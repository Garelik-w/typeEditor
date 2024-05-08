<template>
  <el-dialog v-el-drag-dialog title="粘贴模板" :visible.sync="formVisible" width="500px" :close-on-click-modal="false" :modal-append-to-body="false" append-to-body>

    <p style="color: #e85959;margin-top: 0;">请将复制好的内容粘贴到到下方输入框内。</p>
    <div ref="contentBox" contenteditable="true" style="border: 1px dashed #aaa;min-height: 40px;padding: 5px 10px;" />
    <div slot="footer" class="dialog-footer" style="margin: 5px 0 -1px">
      <el-button size="mini" @click="closeForm">
        取消
      </el-button>
      <el-button type="primary" size="mini" @click="doSave()">确定</el-button>
    </div>
    <div />
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  components: {
  },
  props: {
    type: { // 模板类型
      required: false,
      type: String,
      default: null
    },
    kbn: { // 模板区分-留用
      required: false,
      type: String,
      default: null
    }
  },
  data() {
    return {
      formVisible: false, // 画面显示标识
      curTemplate: null, // 当前模板
      list: [], // 列表数据
      loading: false, // 加载中
      page: 1, // 当前页码
      noMore: false // 没有更多标识
    }
  },
  computed: {
    ...mapGetters([
      'userid'
    ]),
    disabled() {
      return this.loading || this.noMore
    }
  },
  methods: {
    // 打开画面
    open() {
      this.formVisible = true
      // 清空内容
      if (this.$refs.contentBox) {
        this.$refs.contentBox.innerHTML = ''
      }
    },
    // 关闭画面
    closeForm() {
      this.formVisible = false
    },
    // 获取随机新id
    getNewId() {
      return 'ts-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
    },
    // 点击确定的处理
    doSave() {
      this.closeForm()
      const newTemp = {
        id: this.getNewId(),
        type: 'text',
        textType: 'content',
        attrs: {
          text: this.$refs.contentBox.innerHTML
        },
        children: []
      }
      this.$emit('save', newTemp)
    }
  }
}
</script>

<style>
div.active .ts-article {
  -webkit-box-shadow: rgb(239 5 5 / 88%) 0px 0px 4px;
  box-shadow: rgb(239 5 5 / 88%) 0px 0px 4px;
}
</style>
