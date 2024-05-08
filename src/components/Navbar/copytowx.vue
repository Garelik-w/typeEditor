<template>
  <el-dialog v-el-drag-dialog title="复制到微信公众号" :visible.sync="formVisible" width="600px" :close-on-click-modal="false" :modal-append-to-body="false" append-to-body>
    <div class="">
      <el-row style="min-height: 330px; max-height: 460px;overflow: auto;background-color: #edeceb;">
        <p style="color: rgb(249, 110, 87);text-align: center;font-size: 1.2em;"> 复制成功！！，请使用Ctrl+V ( Mac: ⌘V ) 粘贴到微信后台编辑器中，<br> 微信后台也要用谷歌浏览器打开，不要用Windows的IE/Edge浏览器。 </p>
        <div class="ts-panel-container" >
          <article class="tn-paper-document-root">
            <div class="ts-page-container">
              <div class="ts-page ts-comp-mode-flow">
                <div class="ts-comp-pin">
                  <div  class="ts-layer" id="article_panel">
                    <section style="position: absolute;opacity: 0">mark</section>
                    <comp ref="root" :data="articleData" :is-preview="true" :is-root="true" :is-article="true" />
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer" style="margin: 5px 0 -1px">
      <el-button size="mini" @click="closeForm">
        取消
      </el-button>
    </div>
    <div />
  </el-dialog>
</template>

<script>

import elDragDialog from '@/directive/el-drag-dialog'
import comp from '@/components/Comp'
export default {
  directives: { elDragDialog },
  components: {
    comp
  },
  data() {
    return {
      formVisible: false,
      articleData: {
        id: 'empty',
        type: 'article',
        attrs: {

        },
        children: []
      }
    }
  },
  computed: {
  },
  methods: {
    open(article) {
      this.formVisible = true
      this.articleData = article

      // this.$nextTick(() => {
      //   this.$refs.root.copyToWX()
      // })

      setTimeout(function() {
        // 全选
        if (document.selection) {
          const range = document.body.createTextRange()
          range.moveToElementText(document.getElementById('article_panel'))
          range.select()
        } else if (window.getSelection) {
          const range = document.createRange()
          range.selectNodeContents(document.getElementById('article_panel'))
          window.getSelection().removeAllRanges()
          window.getSelection().addRange(range)
        }
        document.getElementById('article_panel').focus()
        document.execCommand('copy')
      }, 300)
    },
    closeForm() {
      this.formVisible = false
    }
  }
}
</script>

<style lang="scss">

</style>
