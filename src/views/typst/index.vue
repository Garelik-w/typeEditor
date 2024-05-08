<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <SideBar :active-menu="activeMenu" @menuSelect="menuSelect" />
    <div class="main-container" style="margin-left: 80px;">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar
          :show-function-bar="true"
          @handleSave="handleSave"
          @handleOpen="handleOpen"
          @handlePreview="handlePreview"
          @handleToWX="handleToWX"
          @openLogin="openLogin"
          @handleNew="handleNew"
        />
      </div>
      <div v-loading="loading" class="app-container">
        <TemplateMenu
          ref="templateMenu"
          :active-menu="activeMenu"
          :is-article="true"
          @openLogin="openLogin"
          @templateSelect="templateSelect"
          @addNewTemplate="addNewArticle"
          @onClipboardSelect="onClipboardSelect"
        />
        <div id="ts_main" ref="ts_main" class="ts-main" @click.stop="handleOutClick()">
          <div class="ts-panel-container">
            <div class="ts-comp-edit">
              <div class="box ts-editing-dock">
                <div class="ts-page-container">
                  <div class="ts-article-info">
                    <div class="left-part">
                      <div class="title-image" :style="getTitleImgStyle()" @click.stop="handleImageSelect" />
                    </div>
                    <div class="right-part">
                      <div style="margin-bottom: .5em"><el-input v-if="comp" v-model="comp.title" placeholder="标题" maxlength="50" /></div>
                      <div><el-input v-if="comp" v-model="comp.summary" placeholder="摘要" :rows="3" maxlength="200" type="textarea" resize="none" /></div>
                    </div>
                    <div style="clear:both" />
                  </div>
                </div>
              </div>
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
                          <comp ref="root" :data="comp" :is-root="true" :is-article="true" @onClipboard="onClipboard" @record="record" @like="like" />
                        </div>
                      </section>
                    </div>
                  </div>
                </article>
                <div class="edit-mode-box">
                  <el-button type="text" @click="editmodeClick">
                    <svg-icon v-if="this.editmode==='design'" icon-class="grid-design" style="font-size: 1.5em;" />
                    <svg-icon v-else icon-class="grid" style="font-size: 1.5em;" />
                  </el-button>
                </div>
                <div class="text-input-box">
                  <Tinymce ref="text_add" :node="inputData" :notools="true" placeholder="点击输入文字" @unEditing="unEditing" />
                  <div class="text-input-type-box">
                    <el-select v-model="inputData.textType" placeholder="文本类型" size="mini" class="edit-select" style="width: 100px">
                      <el-option
                        v-for="item in textTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <RightToolbar />
        <ImageSelect ref="imageSelect" @imgSelected="imgSelected" />
      </div>
    </div>
    <loginForm ref="loginForm" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tinymce from '@/components/Tinymce'
import Navbar from '@/components/Navbar'
import comp from '@/components/Comp'
import variables from '@/styles/variables.scss'
import RightToolbar from '@/components/RightToolbar'
import TemplateMenu from '@/components/TemplateMenu'
import SideBar from '@/components/SideBar'
import { postArticle, putArticle } from '@/api/article'
import { postUserTemplate } from '@/api/template'
import placeholder from '@/assets/imgs/placeholder.jpg'
import ImageSelect from '@/components/TSimage/select'
import loginForm from '@/views/user/login'

export default {
  name: 'Layout',
  components: {
    Navbar,
    comp,
    RightToolbar,
    SideBar,
    ImageSelect,
    loginForm,
    Tinymce,
    TemplateMenu
  },
  data() {
    return {
      title: '图文排版', // 标题
      isNew: true, // 新建标识
      loading: false, // 加载中
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png', // logo图片地址
      activeMenu: '1', // 左侧激活的菜单
      undoList: [], // 撤销列表
      redoList: [], // 重做列表
      lastRecord: '', // 最后记录的操作数据
      lastRecordTime: 0, // 最后记录的操作时间
      editmode: 'typing', // 编辑模式
      inputData: { // 输入框对象
        type: 'text',
        textType: 'content',
        attrs: {
          text: ''
        }
      },
      textTypes: [ // 文本类型下拉
        {
          value: 'title',
          label: '小标题'
        }, {
          value: 'important',
          label: '重点文本'
        }, {
          value: 'content',
          label: '正文文本'
        }
      ],
      comp: { // 默认图文对象
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
      'nametype',
      'userid'
    ]),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
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
    this.addNewArticle({
      id: this.getNewId(),
      type: 'article',
      editmode: this.editmode,
      attrs: {

      },
      children: []
    })

    // 快捷键处理
    const _this = this
    document.onkeydown = function(e) {
      const key = window.event.keyCode
      if (_this.$refs.root && _this.$refs.root.activeNode && _this.$refs.root.activeNode.type === 'text') {
        return
      }

      if (_this.$refs.text_add && _this.$refs.text_add.editing) {
        // ctrl+回车，确认输入
        if (key === 13 && event.ctrlKey) {
          _this.$refs.text_add.unEditing()
          setTimeout(function() {
            _this.$refs.text_add.editing = true
          }, 100)
        }
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
    // 新建图文
    addNewArticle(template) {
      this.isNew = true
      this.comp = template
      this.reset()
    },
    // 模板选中处理
    templateSelect(tmpl) {
      // 插入模板数据
      this.$refs.root.insertTemplate(tmpl)
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
    // 保存图文
    saveArticle() {
      const data = {
        'articleid': this.comp.id,
        'userid': this.userid,
        'title': this.comp.title,
        'resourceid': this.comp.resourceid,
        'resourcepath': this.comp.resourcepath,
        'summary': this.comp.summary,
        'content': JSON.stringify(this.comp),
        'reslist': this.$refs.root.getReslist('articleid')
      }

      this.loading = true
      if (this.isNew) { // 新建
        data['createdtime'] = new Date()
        postArticle(data).then((result) => {
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
        putArticle(data).then((result) => {
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
    // 获取摘要图片
    getTitleImgStyle() {
      const s = {}
      s['background-image'] = 'url(' + (this.comp && this.comp.resourcepath ? this.comp.resourcepath : placeholder) + ')'
      return s
    },
    // 图片选中后处理
    imgSelected(data) {
      this.$set(this.comp, 'resourceid', data.resourceid)
      this.$set(this.comp, 'resourcepath', data.path)
    },
    // 打开图片选中画面
    handleImageSelect() {
      this.$refs.imageSelect.open(this.comp.resourcepath)
    },
    // 处理剪切板复制
    onClipboard(clipData) {
      this.$refs.templateMenu.onClipboard(clipData)
    },
    // 更新图文数据对象
    updateComp(data) {
      this.comp = data
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
        this.lastRecord = JSON.stringify(data)
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
    // 保存处理
    handleSave() {
      // 检查是否登录
      if (this.checkToken()) {
        this.saveArticle()
      }
    },
    // 打开处理
    handleOpen(content) {
      this.isNew = false
      this.comp = JSON.parse(content)
      this.$set(this.comp, 'editmode', this.editmode)
      this.reset()
    },
    // 预览
    handlePreview() {
      alert('preview')
    },
    // 粘贴到微信
    handleToWX() {
      alert('copyToWX')
    },
    // 打开登录对话框
    openLogin() {
      this.$refs.loginForm.open()
    },
    // 新建
    handleNew() {
      this.addNewArticle({
        id: this.getNewId(),
        type: 'article',
        attrs: {

        },
        children: []
      })
    },
    // 校验token
    checkToken() {
      if (this.userid) {
        return true
      } else {
        this.openLogin()
        return false
      }
    },
    // 收藏
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
    },
    // 停止编辑模式
    unEditing() {
      if (this.inputData.attrs.text) {
        const tmpl = {
          id: this.getNewId(),
          type: 'text',
          textType: this.inputData.textType,
          attrs: {
            text: this.inputData.attrs.text
          }
        }
        this.$refs.root.insertTemplate(tmpl)
        this.inputData.attrs.text = ''
      }
    },
    // 编辑模式切换处理
    editmodeClick() {
      this.editmode = this.editmode === 'design' ? 'typing' : 'design'
      this.$set(this.comp, 'editmode', this.editmode)
    }
  }
}
</script>
<style scoped>

  .ts-article-info{
    background-color: #fff;
    margin: auto auto 4em auto;
    padding: 1em;
  }
  .left-part{
    position: relative;
    float: left;
    width: 125px;
    height: 125px;
    text-align: center;
  }
  .right-part{
    position: absolute;
    left: 135px;
    right: 0;
    top: 0;
    padding: 1em;
    text-align: center;
  }

  .title-image{
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
</style>

