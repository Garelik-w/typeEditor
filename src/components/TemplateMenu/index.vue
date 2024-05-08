<template>
  <div class="ts-tool">
    <div v-if="activeMenu==='1'" class="ts-tool-panel">
      <el-tabs v-model="activeTemplate">
        <el-tab-pane label="标题" name="title">
          <keep-alive>
            <templateList v-if="activeTemplate==='title'" ref="list001" :is-article="isArticle" type="001" @templateSelect="templateSelect" @addNewTemplate="addNewTemplate" @like="like" @del="del" @pasteTemplateSave="pasteTemplateSave" />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="卡片" name="card">
          <keep-alive>
            <templateList v-if="activeTemplate==='card'" ref="list002" :is-article="isArticle" type="002" @templateSelect="templateSelect" @addNewTemplate="addNewTemplate" @like="like" @del="del" @pasteTemplateSave="pasteTemplateSave" />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="图片" name="image">
          <keep-alive>
            <templateList v-if="activeTemplate==='image'" ref="list003" :is-article="isArticle" type="003" @templateSelect="templateSelect" @addNewTemplate="addNewTemplate" @like="like" @del="del" @pasteTemplateSave="pasteTemplateSave" />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="组件" name="component">
          <keep-alive>
            <templateList v-if="activeTemplate==='component'" ref="list004" :is-article="isArticle" type="004" @templateSelect="templateSelect" @addNewTemplate="addNewTemplate" @like="like" @del="del" @pasteTemplateSave="pasteTemplateSave" />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="引导" name="guide">
          <keep-alive>
            <templateList v-if="activeTemplate==='guide'" ref="list005" :is-article="isArticle" type="005" @templateSelect="templateSelect" @addNewTemplate="addNewTemplate" @like="like" @del="del" @pasteTemplateSave="pasteTemplateSave" />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="一键排版" name="set">
          <keep-alive>
            <setList v-if="activeTemplate==='set'" ref="list006" :is-article="isArticle" type="006" @templateSelect="templateSelect" @addNewTemplate="addNewTemplate" @like="like" @del="del" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="activeMenu==='2'" class="ts-tool-panel">
      <clipboard ref="clipboard" :list="clipboardList" @onClipboardSelect="onClipboardSelect" />
    </div>
    <div v-if="activeMenu==='3'" class="ts-tool-panel">
      <templateuserList ref="templateuserlist" :is-article="isArticle" @templateSelect="templateSelect" @del="delUserTemp" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { postUserTemplate, delUserTemplate, del } from '@/api/template'
import templateList from '@/components/TemplateMenu/templateList'
import setList from '@/components/TemplateMenu/setList'
import templateuserList from '@/components/TemplateMenu/templateuserList'
import clipboard from '@/components/TemplateMenu/clipboard'
export default {
  components: {
    templateList,
    setList,
    templateuserList,
    clipboard
  },
  props: {
    activeMenu: {
      required: true,
      type: String,
      default: '1'
    },
    isArticle: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeTemplate: 'title', // 激活tab类型
      clipboardList: [] // 剪切板数据
    }
  },
  computed: {
    ...mapGetters([
      'userid'
    ])
  },
  methods: {
    // 调试log
    log: function(evt) {
      window.console.log(evt)
    },
    // 获取随机新id
    getNewId() {
      return 'ts-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
    },
    // 模板选中处理
    templateSelect(tmpl, isCopy) {
      // 触发事件
      this.$emit('templateSelect', tmpl, isCopy)
    },
    // 剪切板中模板选中处理
    onClipboardSelect(tmpl) {
      // 触发事件
      this.$emit('onClipboardSelect', tmpl)
    },
    // 模板管理-添加新模板
    addNewTemplate(tmpl) {
      // 触发事件
      this.$emit('addNewTemplate', tmpl)
    },
    // 模板管理-粘贴模板样式-确定
    pasteTemplateSave(tmpl) {
      // 触发事件
      this.$emit('pasteTemplateSave', tmpl)
    },
    // 模板类型有数据变更时 刷新数据
    reflashList(type) {
      if (this.$refs['list' + type]) {
        this.$refs['list' + type].reload()
      }
    },
    // 剪切板复制处理
    onClipboard(clipData) {
      // this.$refs.clipboard.addData(clipData)
      this.clipboardList.push(clipData.data)
    },
    // 收藏处理
    like(data) {
      if (this.userid) { // 已登录的用户才可以使用
        const content = JSON.stringify(data)
        postUserTemplate({ userid: this.userid, content: content, createdtime: new Date() }).then((result) => {
          this.$notify({
            message: '收藏成功。',
            type: 'success',
            duration: 2000
          })

          if (this.$refs.templateuserlist) {
            this.$refs.templateuserlist.reload()
          }
        }).catch(error => {
          if (error.response.request.responseText && error.response.request.responseText === '{"non_field_errors":["字段 userid, templateid 必须能构成唯一集合。"]}') {
            this.$notify({
              message: '收藏成功。',
              type: 'success',
              duration: 2000
            })
          }
        })
      } else {
        // 未登录时触发弹出登录框事件
        this.$emit('openLogin', null)
      }
    },
    // 删除收藏内容
    delUserTemp(data) {
      if (this.userid) {// 已登录的用户才可以使用
        delUserTemplate(data.templateuserid).then((result) => {
          this.$notify({
            message: '删除成功。',
            type: 'success',
            duration: 2000
          })

          if (this.$refs.templateuserlist) {
            this.$refs.templateuserlist.reload()
          }
        }).catch(error => {

        })
      } else {
        // 未登录时触发弹出登录框事件
        this.$emit('openLogin', null)
      }
    },
    // 删除模板数据
    del(data) {
      if (this.userid) {// 已登录的用户才可以使用
        this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(data.id).then((result) => {
            this.$notify({
              message: '删除成功。',
              type: 'success',
              duration: 2000
            })
            if (this.$refs['list' + data.templatetype]) {
              this.$refs['list' + data.templatetype].reload()
            } else {
              this.$refs['list006'].reload()
            }
          }).catch(error => {

          })
        })
      } else {
        // 未登录时触发弹出登录框事件
        this.$emit('openLogin', null)
      }
    }
  }
}
</script>

