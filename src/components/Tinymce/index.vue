<template>
  <section :class="{fullscreen:fullscreen}" class="tinymce-container" :style="compBodyStyle()">
    <section :id="tinymceId" class="" />
    <!--    <div v-if="editing === false && !readonly" class="cover" @click.stop="editingClick">-->
    <!--      <span v-if="placeholder" style="line-height: 24px;margin-left: 3px;">{{ placeholder }}</span>-->
    <!--&lt;!&ndash;      <span v-if="!notools && node.textType" class="text-type-hint">{{ this.getTextTypeName() }}</span>&ndash;&gt;-->

    <!--      <el-select v-if="!notools && node.textType && node.textType !== 'fixed'" v-model="node.textType" placeholder="文本类型" size="mini" class="edit-select text-type-hint" style="width: 80px">-->
    <!--        <el-option-->
    <!--          v-for="item in textTypes"-->
    <!--          :key="item.value"-->
    <!--          :label="item.label"-->
    <!--          :value="item.value"-->
    <!--        />-->
    <!--      </el-select>-->
    <!--    </div>-->
    <span v-if="placeholder && !this.editing" style="line-height: 24px;margin-left: 3px;position: absolute;top: 0;" @click.stop="placeholderClick">{{ placeholder }}</span>
    <!--      <span v-if="!notools && node.textType" class="text-type-hint">{{ this.getTextTypeName() }}</span>-->

    <el-select v-if="!notools && node.textType && node.textType !== 'fixed' && !readonly" v-model="node.textType" placeholder="文本类型" size="mini" class="edit-select text-type-hint" style="width: 100px">
      <el-option
        v-for="item in textTypes"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </section>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

export default {
  name: 'Tinymce',
  components: { },
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    placeholder: { // 编辑提示
      type: String,
      default: null
    },
    node: {
      type: Object,
      default: null
    },
    toolbar: { // 显示工具条内容，已弃用
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },
    readonly: {// 只读
      required: false,
      type: Boolean,
      default: false
    },
    notools: { // 无工具条模式
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      root: null, // 根节点
      hasChange: false, // 是否有修改
      editing: false, // 是否正在编辑
      hasInit: false, // 是否初始化
      tinymceId: this.id, // id
      fullscreen: false, // 全屏模式
      backUp: '', // 备份
      imgTarget: null, // 图片内容dom
      languageTypeList: { // 多语言选择内容
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      },
      textTypes: [ // 文本类型下拉内容
        {
          value: 'title',
          label: '小标题'
        }, {
          value: 'important',
          label: '重点文本'
        }, {
          value: 'content',
          label: '正文文本'
        }, {
          value: 'component',
          label: '组件'
        }, {
          value: 'guid',
          label: '引导'
        }
      ]
    }
  },
  computed: {
    // 计算容器宽度
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    // 监听text属性变化
    'node.attrs.text': function(val) {
      if (!this.editing && this.hasInit) {
        this.$nextTick(() => {
          if (window.tinymce.get(this.tinymceId)) {
            window.tinymce.get(this.tinymceId).setContent(val || '')
          }
        })
      }
    }
  },
  created() {
    this.root = this.$parent.$parent.root
  },
  mounted() {
    this.init()
  },
  // 激活
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  // 销毁
  deactivated() {
    this.destroyTinymce()
  },
  // 销毁
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    // 初始化
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    // 设置css style
    compBodyStyle() {
      const s = {
        width: this.containerWidth
      }
      // deviation
      if (this.node.deviation) {
        s['transform'] = 'translate3d(' + this.node.deviation + 'px, 0px, 0px)'
      }
      return s
    },
    // 初始化 Tinymce控件
    initTinymce() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.languageTypeList['zh'],
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        inline: true,
        // toolbar: this.notools ? false : (this.toolbar.length > 0 ? this.toolbar : toolbar),
        toolbar: false,
        menubar: false,
        menu: {
          format: { title: '格式', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat' }
        },
        // readonly: true,
        statusbar: false,
        readonly: this.readonly,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.node && _this.node.attrs.text) {
            editor.setContent(_this.node.attrs.text)
            this.backUp = _this.node.attrs.text
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            // this.$emit('input', editor.getContent())
            // _this.node.attrs.text = editor.getContent()
            this.setText(editor.getContent())
          })
          editor.on('NodeChange', () => {
            this.nodeChange()
          })
          editor.on('blur', (e) => {
            this.unEditing()
          })
          editor.on('focus', (e) => {
            this.beginEditing()
          })
          editor.on('click', (e) => {
            if (e.target.localName === 'img') {
              const _this = this
              setTimeout(function() {
                _this.editImg(e.target)
              }, 10)
            }
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        }
      })
    },
    // 编辑文本中图片
    editImg(imgTarget) {
      this.imgTarget = imgTarget
      this.root.hideTool()
      // 清除选中
      if (window.getSelection) {
        // 清除选中
        window.getSelection().removeAllRanges()
      } else if (document.selection && document.selection.empty) {
        // 兼容 IE8 以下，但 IE9+ 以上同样可用
        document.selection.empty()
        // 或使用 clear() 方法
        // document.selection.clear();
      }
      const toolNode = {
        id: 'tpl_img',
        type: 'img',
        text: '图片',
        target: this.imgTarget,
        parentId: this.node.parentId,
        attrs: {
          src: this.imgTarget.src
        }
      }
      this.root.editToolNode(toolNode)
    },
    // 销毁Tinymce
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    // 设置内容
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    // 获取编辑器
    getEditor() {
      return window.tinymce.get(this.tinymceId)
    },
    // 获取内容
    getContent() {
      return window.tinymce.get(this.tinymceId).getContent()
    },
    // 编辑框点击
    editingClick() {
      this.editing = true
      window.tinymce.get(this.tinymceId).focus()
      // 全选
      if (document.selection) {
        const range = document.body.createTextRange()
        range.moveToElementText(document.getElementById(this.tinymceId))
        range.select()
      } else if (window.getSelection) {
        const range = document.createRange()
        range.selectNodeContents(document.getElementById(this.tinymceId))
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
      }

      if (this.root) {
        this.root.active(this.node)
        this.root.setActiveText(this)
      }
    },
    // 开启编辑
    beginEditing() {
      this.editing = true
      if (this.root) {
        this.root.active(this.node)
        this.root.setActiveText(this)
      }
    },
    // 编辑模式点击
    placeholderClick() {
      window.tinymce.get(this.tinymceId).focus()
    },
    // 取消编辑模式
    unEditing() {
      this.editing = false
      this.hasChange = false
      // this.$set(this.node, 'isActive', false)
      this.record()
      this.$emit('unEditing')
    },
    // 设置文本内容
    setText(text) {
      this.$set(this.node.attrs, 'text', text)
    },
    // 记录操作
    record() {
      if (this.root) {
        if (this.backUp !== this.node.attrs.text) {
          this.root.record('text')
          this.backUp = this.node.attrs.text
        }
      }
    },
    // 获取文本类型名称
    getTextTypeName() {
      if (this.node.textType === 'title') {
        return '小标题'
      } else if (this.node.textType === 'important') {
        return '重点文本'
      } else if (this.node.textType === 'content') {
        return '正文文本'
      } else {
        return ''
      }
    },
    // 节点内容变更事件
    nodeChange() {
      this.$emit('nodeChange')
    },
    // 执行文本变更
    acceptChange() {
      this.setText(this.getContent())
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: inherit;
}
.tinymce-container>>>.mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
