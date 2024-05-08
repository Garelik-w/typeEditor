<template>
  <el-dialog v-el-drag-dialog title="预览" :visible.sync="formVisible" width="600px" :close-on-click-modal="false" :modal-append-to-body="false" append-to-body>
    <div class="">
      <el-row style="min-height: 330px; max-height: 460px;overflow: auto;background-color: #edeceb;">
        <div class="ts-panel-container">
          <article class="tn-paper-document-root">
            <div class="ts-page-container">
              <div class="ts-page ts-comp-mode-flow">
                <section class="ts-comp-pin">
                  <div class="ts-layer">
                    <comp ref="root" :data="articleData" :is-preview="true" :is-root="true" :is-article="true" /></div>
                </section>
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
    },
    closeForm(){
      this.formVisible = false
    }
  }
}
</script>

<style lang="scss">

</style>
