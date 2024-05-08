<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <SideBar :active-menu="activeMenu" @menuSelect="menuSelect" />
    <div class="main-container" style="margin-left: 80px;">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <div v-loading="loading" class="app-container">
        <TemplateMenu
          ref="templateMenu"
          :active-menu="activeMenu"
          @templateSelect="editTemplate"
          @addNewTemplate="addNewTemplate"
          @pasteTemplateSave="pasteTemplateSave"
          @onClipboardSelect="onClipboardSelect"
          @openLogin="openLogin"
        />
        <div id="ts_main" class="ts-main" @click.stop="handleOutClick()">
          <div class="ts-editing-tool">
            <el-button v-if="comp && comp.id !== 'empty'" @click="saveTemplate">保存</el-button>
          </div>
          <div class="ts-panel-container">
            <div class="edit-tip">模板类型：{{ getTypeName() }}</div>
            <div class="ts-comp-edit">
              <div class="box ts-editing-dock">
                <article class="tn-paper-document-root">
                  <div class="ts-page-container">
                    <div class="ts-page ts-comp-mode-flow">
                      <section class="ts-comp-pin">
                        <div :id="rootId" class="ts-layer" @click.stop="handleRootClick">
                          <!--                          <comp-->
                          <!--                            v-for="item in comp.data"-->
                          <!--                            :key="item.name"-->
                          <!--                            :data="item"-->
                          <!--                          />-->
                          <comp ref="root" :data="comp" :is-root="true" @onClipboard="onClipboard" @record="record" @like="like" />
                        </div>
                      </section>
                    </div>
                  </div>
                </article>
                <div class="edit-mode-box" style="top:0">
                  <el-button type="text" @click="editmodeClick">
                    <svg-icon v-if="this.editmode==='design'" icon-class="grid-design" style="font-size: 1.5em;" />
                    <svg-icon v-else icon-class="grid" style="font-size: 1.5em;" />
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <ControllerBox />
        </div>
        <RightToolbar />
      </div>
    </div>
    <loginForm ref="loginForm" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Navbar from '@/components/Navbar'
import comp from '@/components/Comp'
import variables from '@/styles/variables.scss'
import RightToolbar from '@/components/RightToolbar'
import ControllerBox from '@/components/ControllerBox'
import TemplateMenu from '@/components/TemplateMenu'
import SideBar from '@/components/SideBar'
import { post, put, postUserTemplate } from '@/api/template'
import loginForm from '@/views/user/login'

export default {
  name: 'Layout',
  components: {
    Navbar,
    comp,
    RightToolbar,
    ControllerBox,
    SideBar,
    loginForm,
    TemplateMenu
  },
  data() {
    return {
      title: '图文排版', // 标题
      isNew: true, // 是否新建
      loading: false, // 加载中
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png', // logo图片地址
      activeMenu: '1', // 激活中的左侧菜单
      undoList: [], // 撤销列表
      redoList: [], // 重做列表
      lastRecord: '', // 最后记录的数据
      lastRecordTime: 0, // 最后记录的时间
      editmode: 'design', // 编辑模式
      comp: { // 默认控件
        id: 'empty',
        type: 'article',
        attrs: {

        },
        children: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'userid',
      'usertype'
    ]),
    sidebar() {
      // 左侧菜单
      return this.$store.state.app.sidebar
    },
    device() {
      // 设备
      return this.$store.state.app.device
    },
    fixedHeader() {
      // 固定头部
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    variables() {
      return variables
    },
    isCollapse() {
      return false
    },
    // 获取根节点id
    rootId() {
      if (this.comp) {
        return 'dom_' + this.comp.id
      } else {
        return 'dom_empty'
      }
    }
  },
  mounted() {
    // 默认添加数据
    this.addNewTemplate({
      id: this.getNewId(),
      type: 'article',
      editmode: this.editmode,
      attrs: {

      },
      children: []
    })

    if (!this.usertype || this.usertype !== '1') {
      this.openLogin()
    }

    // 快捷键处理
    const _this = this
    document.onkeydown = function(e) {
      const key = window.event.keyCode
      if (_this.$refs.root && _this.$refs.root.activeNode && _this.$refs.root.activeNode.type === 'text') {
        return
      }
      if (_this.$refs.text_add && _this.$refs.text_add.editing) {
        return
      }

      if (key === 90 && event.ctrlKey) {
        // 撤销
        _this.undo()
      } else if (key === 89 && event.ctrlKey) {
        // 重做
        _this.redo()
      }
    }
  },
  methods: {
    // 侧边栏图标点击处理
    handleClickOutside() {
      // 关闭侧边栏
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    // 根节点点击处理
    handleRootClick(e) {
      if (e.target.tagName === 'DIV' && e.target.className.indexOf('root-node') >= 0) {
        this.$refs.root.active(this.$refs.root.data)
      }
    },
    // 外框点击处理
    handleOutClick() {
      // 清空激活
      this.$refs.root.clearActive(this.$refs.root.data)
    },
    // 获取随机新id
    getNewId() {
      return 'ts-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
    },
    // 新建模板
    addNewTemplate(template) {
      this.setTemplateType(template)
      this.isNew = true
      this.comp = template
      this.$set(this.comp, 'editmode', this.editmode)
      this.reset()
    },
    // 粘贴模板处理
    pasteTemplateSave(template) {
      template.id = this.comp.id
      this.$refs.root.setParent(template)
      this.comp = template
    },
    // 设置模板类型
    setTemplateType(template) {
      template.nodeType = 'main'
      if (template.templatetype === '003') {
        template.nodeTypeName = 'img'
      }
    },
    // 编辑模板
    editTemplate(tmpl, isCopy) {
      this.setTemplateType(tmpl)
      // 瞄准模式下应用选中模板的样式
      if (this.$refs.root.$refs.tool && this.$refs.root.$refs.tool.aimed) {
        this.$refs.root.formatPaste(tmpl)
        return
      }

      // 复制模式
      if (isCopy) {
        this.addNewTemplate(tmpl)
        return
      }

      // 编辑模式
      this.isNew = false
      this.comp = JSON.parse(JSON.stringify(tmpl))
      this.$set(this.comp, 'editmode', this.editmode)
      this.reset()
    },
    // 剪切板选中模板处理
    onClipboardSelect(tmpl) {
      // 插入选中的模板
      this.$refs.root.insertTemplate(tmpl)
    },
    // 左侧菜单选中处理
    menuSelect(val) {
      this.activeMenu = val
    },
    // 保存模板
    saveTemplate() {
      if (!this.checkToken()) {
        return
      }
      if (!this.comp.templatetype) {
        this.comp.templatetype = '001'
      }
      const data = {
        'templateid': this.comp.id,
        'userid': 'admin',
        'title': '',
        'templatetype': this.comp.templatetype,
        'templatekbn': this.comp.templatekbn,
        'content': JSON.stringify(this.comp),
        'reslist': this.$refs.root.getReslist('templateid')
      }

      this.loading = true
      if (this.isNew) { // 新建
        data['createdtime'] = new Date()
        post(data).then((result) => {
          this.isNew = false
          this.loading = false
          this.$notify({
            message: '保存成功。',
            type: 'success',
            duration: 2000
          })
          this.$refs.templateMenu.reflashList(this.comp.templatetype)
        }).catch(error => {
          this.loading = false
        })
      } else { // 修改
        data['modifiedtime'] = new Date()
        put(data).then((result) => {
          this.isNew = false
          this.loading = false
          this.$notify({
            message: '保存成功。',
            type: 'success',
            duration: 2000
          })
          this.$refs.templateMenu.reflashList(this.comp.templatetype)
        }).catch(error => {
          this.loading = false
        })
      }
    },
    // 处理剪切板复制
    onClipboard(clipData) {
      this.$refs.templateMenu.onClipboard(clipData)
    },
    // 重置
    reset() {
      this.undoList = []
      this.redoList = []
      this.lastRecord = JSON.stringify(this.comp)
    },
    // 记录操作
    record(key) {
      if (this.$refs.root.changing > 0) {
        return
      }
      const now = (new Date()).getTime()
      if (key === 'width') {
        if (now - this.lastRecordTime < 500) {
          return
        }
      }
      this.lastRecordTime = now
      const newRecord = JSON.stringify(this.comp)
      if (this.lastRecord !== newRecord) {
        this.undoList.push(this.lastRecord)
        this.lastRecord = newRecord
        this.redoList = []
      }
    },
    // 撤销处理
    undo() {
      let undoRecord = ''
      if (this.undoList.length) {
        this.lastRecord = JSON.stringify(this.comp)
        undoRecord = this.undoList.pop()
        const data = JSON.parse(undoRecord)
        this.redoList.push(this.lastRecord)
        this.$nextTick(() => {
          this.$refs.root.changing++
          this.comp = data
          const self = this
          setTimeout(function() {
            self.$refs.root.changing--
          }, 400)
        })
      }
    },
    // 重做处理
    redo() {
      let redoRecord = ''
      if (this.redoList.length) {
        this.lastRecord = JSON.stringify(this.comp)
        redoRecord = this.redoList.pop()
        const data = JSON.parse(redoRecord)
        this.undoList.push(this.lastRecord)
        this.$nextTick(() => {
          this.$refs.root.changing++
          this.comp = data
          const self = this
          setTimeout(function() {
            self.$refs.root.changing--
          }, 400)
        })
      }
    },
    // 打开登录对话框
    openLogin() {
      this.$refs.loginForm.open('1')
    },
    // 校验token
    checkToken() {
      if (!this.usertype || this.usertype !== '1') { // 不是管理员登陆时弹出登录对话框
        this.openLogin()
        return false
      } else {
        return true
      }
    },
    // 获取类型名称
    getTypeName() {
      if (this.comp.templatetype === '001') {
        return '标题'
      } else if (this.comp.templatetype === '002') {
        return '卡片'
      } else if (this.comp.templatetype === '003') {
        return '图片'
      } else if (this.comp.templatetype === '004') {
        return '组件'
      } else if (this.comp.templatetype === '005') {
        return '引导'
      } else if (this.comp.templatetype === '006') {
        return '一键排版'
      } else {
        return '标题'
      }
    },
    // 编辑模式点击处理
    editmodeClick() {
      this.editmode = this.editmode === 'design' ? 'typing' : 'design'
      this.$set(this.comp, 'editmode', this.editmode)
    },
    // 收藏处理
    like(data) {
      if (this.userid) {
        const content = JSON.stringify(data)
        postUserTemplate({ userid: this.userid, content: content, createdtime: new Date() }).then((result) => {
          this.$notify({
            message: '收藏成功。',
            type: 'success',
            duration: 2000
          })

          if (this.$refs.templateMenu.$refs.templateuserlist) {
            this.$refs.templateMenu.$refs.templateuserlist.reload()
          }
        }).catch(error => {

        })
      } else {
        this.openLogin()
      }
    }
  }
}
</script>
