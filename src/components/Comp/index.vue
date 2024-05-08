<template>
  <draggable
    ref="box"
    v-bind="dragOptions"
    :tag="data.type==='shape'?'section':'section'"
    draggable=".ts-drag"
    ghost-class="ts-ghost"
    chosen-class="ts-chosen"
    drag-class="ts-on-drag"
    :list="data?data.children:[]"
    :value="value"
    :style="compPanelStyle()"
    :class="compPanelClass()"
    @start="dragstart"
    @end="dragend"
    @input="emitter"
  >
    <!--        <div :class="compBodyClass(data)" @click.stop="handleClick(data)">-->
    <!--          <Tinymce v-if="data.type==='text'" :node="data" :height="50" />-->
    <!--          <Comp v-for="el in realValue.children" :id="'dom_'+ el.id" :key="el.id" :data="el" />-->
    <!--        </div>-->
    <section v-for="el in realValue.children" :id="getDomId(el)" :key="el.id" :class="compBodyClass(el)" :style="compBodyStyle(el)" @click.stop="handleClick(el)">
      <Tinymce v-if="el.type==='text'" :node="el" :height="100" :readonly="disabled" @nodeChange="nodeChange" />
      <TsImg v-if="el.type==='img'" :node="el" />
      <Comp v-if="el.children" :data="el" />
    </section>

    <Tinymce v-if="isRoot && data.type==='text'" :node="data" :height="100" :readonly="disabled" @nodeChange="nodeChange" />
    <TsImg v-if="isRoot && data.type==='img'" :node="data" />

    <Toolbar v-if="isRoot" v-show="activeNode && activeNode.isActive" ref="tool" v-model="activeNode" :is-article="isArticle" :root="this" @onClipboard="onClipboard" @like="sublike" />
    <Toolbar v-if="isRoot" v-show="toolNode" ref="toolCom" v-model="toolNode" :is-article="isArticle" :root="this" @onClipboard="onClipboard" @like="sublike" />

    <div v-if="isRoot && isPreview " class="cover" @click.stop="editingClick" />

    <div v-if="isRoot && (isLike || isDel) " class="tool-box">
      <el-button v-if="isLike" type="primary" plain size="mini" @click="like">收藏</el-button>
      <el-button v-if="isDel" type="danger" icon="el-icon-delete" plain size="mini" @click="del" />
    </div>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import Tinymce from '@/components/Tinymce'
import Toolbar from '@/components/Comp/Toolbar'
import TsImg from '@/components/Comp/img'
import attribute from './attribute'
export default {
  name: 'Comp',
  components: {
    draggable,
    Tinymce,
    TsImg,
    Toolbar
  },
  props: {
    value: {
      required: false,
      type: Object,
      default: null
    },
    data: {
      required: false,
      type: Object,
      default: null
    },
    isRoot: {// 根节点
      required: false,
      type: Boolean,
      default: false
    },
    isArticle: {// true：是文章  false：是模板
      required: false,
      type: Boolean,
      default: false
    },
    isPreview: {// 预览模式，不可编辑
      required: false,
      type: Boolean,
      default: false
    },
    isLike: {// 是否可收藏
      required: false,
      type: Boolean,
      default: false
    },
    isDel: {// 是否可删除
      required: false,
      type: Boolean,
      default: false
    }
  }, data() {
    return {
      root: null, // 根节点
      activeNode: null, // 激活中节点
      toolNode: null, // 复杂节点（从秀米中粘贴生成的）中启动工具条编辑的数据节点
      aimed: false, // 瞄准状态
      changing: 0, // 是否正在变更
      insertIndex: 0, // 插入节点索引
      lastClipData: null, // 剪切板中复制的内容
      textUi: null // 激活中的文本控件
    }
  },
  computed: {
    // 拖动设定
    dragOptions() {
      return {
        animation: 0,
        group: this.getGroupName(),
        disabled: this.disabled,
        ghostClass: 'ghost'
      }
    },
    // this.value when input = v-model
    // this.list  when input != v-model
    realValue() {
      return this.value ? this.value : this.data ? this.data : {}
    },
    // this.value when input = v-model
    // this.list  when input != v-model
    disabled() {
      return this.root.isPreview
    }
  },
  watch: {
    // 有节点更新时刷新数据
    'data.children': function(val, val2) {
      // console.log('Collection updated!')
      if (val2) {
        val2.forEach((item) => {
          if (item && item.id.indexOf('tpl_') === 0) {
            this.insertIndex = val2.findIndex(function(itemT) {
              return itemT.id === item.id
            })
            val2.splice(this.insertIndex, 1)
            this.$nextTick(() => {
              this.insertNode(JSON.parse(JSON.stringify(item)), this.insertIndex)
            })
          }
        })
      }
    }
    // , 'data.attrs': {
    //   handler(newValue, oldValue) {
    //     console.log(newValue)
    //   },
    //   deep: true
    // },
    // 'data.attrs.color': function(newValue, oldValue) {
    //   debugger
    //   console.log('Collection updated!')
    // }
  },
  created() {
    // 设置根节点
    if (this.isRoot) {
      this.root = this
      this.setParent(this.data)
    } else {
      // 设置父节点
      const parent = this.$parent.$parent

      if (parent.isRoot) {
        this.root = parent
      } else {
        this.root = parent.root
      }
    }

    // 监控所有属性，有属性变更时记录下操作，从而实现撤销和重做
    attribute.forEach((key) => {
      this.$watch('data.attrs.' + key, (newValue, oldValue) => {
        this.root.record(key)
      })
    })

    /*
    this.$watch(`node.data.${childrenKey}`, () => {
      this.node.updateChildren()
    })
    */
  },
  methods: {
    emitter(value) {
      this.$emit('input', value)
    }, dragstart() {
      // 拖动开始前隐藏工具条
      this.root.hideTool()
    }, dragend(p1, p2) {
      // 拖动结束后记录动作
      this.root.record('drag')
    }, addNode(evt, p2, p3) {
      evt.cancelBubble = true
    }, classObject() {
      return {
        'ts-drag': this.value.type !== 'cell',
        'item-group': true
      }
    }, insertNode(nodeData, index) {
      // 新增节点，需要重新设定id
      nodeData.id = this.getNewId()
      nodeData.parentId = this.data.id
      // 给新增节点设置父节点
      this.setParent(nodeData, true)
      // 插入节点数据
      this.data.children.splice(index, 0, nodeData)
      this.$nextTick(() => {
        // 激活插入的节点
        this.root.activeById(nodeData.id)
      })
    }, setParent(node, needNewId) {
      // 设置父节点信息
      node.isActive = false
      if (node.children) {
        node.children.forEach((item) => {
          if (needNewId) {
            // 设置新id
            item.id = this.getNewId()
          }
          item.parentId = node.id
          item.isActive = false
          this.setParent(item, needNewId)
        })
      }
    },
    compBodyClass(itemData) {
      // 节点css class设定
      return {
        'ts-drag': this.isdrag(itemData),
        'ts-cell': itemData.type === 'cell',
        'ts-row': itemData.type === 'row',
        'ts-text': itemData.type === 'text',
        'ts-img': itemData.type === 'img',
        'ts-shape': itemData.type === 'shape',
        'ts-active': (itemData.type === 'text' || itemData.type === 'img') && itemData.isActive
      }
    },
    // 获取分组名称
    getGroupName() {
      if (this.realValue.type === 'text') {
        return 'no' // 文本不可容纳子节点
      }
      if (this.root.data.editmode === 'design') { // 设计模式
        if (this.realValue.type !== 'text') {
          return 'ts-cont'
        }
      } else {
        if (this.isRoot) {
          return 'ts-cont'
        }
      }

      return 'no'
    },
    // 是否可拖动
    isdrag(itemData) {
      if (this.root.data.editmode === 'design') { // 设计模式
        if (itemData.type !== 'cell') {
          return true
        }
      } else {
        if (itemData.nodeType === 'main') {
          return true
        }
      }
      return false
    },
    // 节点css style设定
    compBodyStyle(itemData) {
      if (!itemData) {
        return {}
      }
      const s = {}
      if (itemData.type === 'row') { // 行类型节点
        s['margin-top'] = '10px'
        s['margin-bottom'] = '10px'
      }
      // width
      if (itemData.attrs.widthType || itemData.attrs.width) {
        if (!itemData.attrs.widthType) {
          itemData.attrs.widthType = '%'
        }
        if (itemData.attrs.widthType === '%' || itemData.attrs.widthType === 'px') {
          s['width'] = Number(itemData.attrs.width) + itemData.attrs.widthType
        } else if (itemData.attrs.widthType === 'stretch') {
          // flex: 100 100 0%;
          s['flex'] = itemData.attrs.width + ' ' + itemData.attrs.width + ' 0%'
        }
      }
      // interval
      if (itemData.attrs.interval) {
        s['margin-top'] = itemData.attrs.interval + 'px'
      }
      // intervalAfter
      if (itemData.attrs.intervalAfter) {
        s['margin-bottom'] = itemData.attrs.intervalAfter + 'px'
      }

      // deviation
      if (itemData.attrs.deviation) {
        s['margin-left'] = itemData.attrs.deviation + 'px'
      }
      // marginLeft
      if (itemData.attrs.marginLeft) {
        s['margin-left'] = itemData.attrs.marginLeft + 'px'
      }
      // marginRight
      if (itemData.attrs.marginRight) {
        s['margin-right'] = itemData.attrs.marginRight + 'px'
      }
      // marginTop
      if (itemData.attrs.marginTop) {
        s['margin-top'] = itemData.attrs.marginTop + 'px'
      }
      // marginBottom
      if (itemData.attrs.marginBottom) {
        s['margin-bottom'] = itemData.attrs.marginBottom + 'px'
      }

      // paddingLeft
      if (itemData.attrs.paddingLeft) {
        s['padding-left'] = itemData.attrs.paddingLeft + 'px'
      }
      // paddingRight
      if (itemData.attrs.paddingRight) {
        s['padding-right'] = itemData.attrs.paddingRight + 'px'
      }
      // paddingTop
      if (itemData.attrs.paddingTop) {
        s['padding-top'] = itemData.attrs.paddingTop + 'px'
      }
      // paddingBottom
      if (itemData.attrs.paddingBottom) {
        s['padding-bottom'] = itemData.attrs.paddingBottom + 'px'
      }

      // lineHeight
      if (itemData.attrs.lineHeight) {
        s['line-height'] = itemData.attrs.lineHeight + 'em'
      }

      if (itemData.type !== 'img') {
        // border(preset)
        if (itemData.attrs.border) {
          s['border'] = itemData.attrs.border
        }
        if (itemData.attrs['box_shadow']) {
          s['box-shadow'] = itemData.attrs['box_shadow']
        }
        if (itemData.attrs['border_radius']) {
          s['border-radius'] = itemData.attrs['border_radius']
        }
        if (itemData.attrs['border_color']) {
          s['border-color'] = itemData.attrs['border_color']
        }
      }

      // -webkit-box-reflect
      if (itemData.attrs['_webkit_box_reflect']) {
        s['-webkit-box-reflect'] = itemData.attrs['_webkit_box_reflect']
      }
      // -webkit-mask
      if (itemData.attrs['_webkit_mask']) {
        s['-webkit-mask'] = itemData.attrs['_webkit_mask']
      }

      // filter
      if (itemData.attrs['filter']) {
        s['filter'] = itemData.attrs['filter']
      }

      // border
      if (itemData.attrs.borderType) {
        s['border'] = itemData.attrs.borderSize + 'px ' + itemData.attrs.borderType + ' ' + itemData.attrs.borderColor
      }
      if (itemData.attrs.radius) {
        s['border-radius'] = itemData.attrs.radius + (itemData.attrs.radiusType ? itemData.attrs.radiusType : 'px')
      }

      // borderTop
      if (itemData.attrs.borderTopType) {
        s['border-top'] = itemData.attrs.borderTopSize + 'px ' + itemData.attrs.borderTopType + ' ' + itemData.attrs.borderTopColor
      }
      if (itemData.attrs.radiusTop) {
        s['border-top-left-radius'] = itemData.attrs.radiusTop + (itemData.attrs.radiusTopType ? itemData.attrs.radiusTopType : 'px')
      }
      // borderRight
      if (itemData.attrs.borderRightType) {
        s['border-right'] = itemData.attrs.borderRightSize + 'px ' + itemData.attrs.borderRightType + ' ' + itemData.attrs.borderRightColor
      }
      if (itemData.attrs.radiusRight) {
        s['border-top-right-radius'] = itemData.attrs.radiusRight + (itemData.attrs.radiusRightType ? itemData.attrs.radiusRightType : 'px')
      }
      // borderBottom
      if (itemData.attrs.borderBottomType) {
        s['border-bottom'] = itemData.attrs.borderBottomSize + 'px ' + itemData.attrs.borderBottomType + ' ' + itemData.attrs.borderBottomColor
      }
      if (itemData.attrs.radiusBottom) {
        s['border-bottom-right-radius'] = itemData.attrs.radiusBottom + (itemData.attrs.radiusBottomType ? itemData.attrs.radiusBottomType : 'px')
      }
      // borderLeft
      if (itemData.attrs.borderLeftType) {
        s['border-left'] = itemData.attrs.borderLeftSize + 'px ' + itemData.attrs.borderLeftType + ' ' + itemData.attrs.borderLeftColor
      }
      if (itemData.attrs.radiusLeft) {
        s['border-bottom-left-radius'] = itemData.attrs.radiusLeft + (itemData.attrs.radiusLeftType ? itemData.attrs.radiusLeftType : 'px')
      }

      // height
      if (itemData.attrs.height) {
        s['height'] = Number(itemData.attrs.height) + 'px'
      }
      // letter-spacing
      if (itemData.attrs.letterSpacing) {
        s['letter-spacing'] = Number(itemData.attrs.letterSpacing) + 'px'
      }
      // align
      if (itemData.attrs.align) {
        // vertical-align: middle;
        // align-self: center;
        if (itemData.attrs.align === 'top') {
          s['vertical-align'] = 'top'
          s['align-self'] = 'flex-start'
        } else if (itemData.attrs.align === 'middle') {
          s['vertical-align'] = 'middle'
          s['align-self'] = 'center'
        } else if (itemData.attrs.align === 'bottom') {
          s['vertical-align'] = 'bottom'
          s['align-self'] = 'flex-end'
        } else if (itemData.attrs.align === 'top-bottom') {
          s['vertical-align'] = 'top'
          s['align-self'] = 'stretch'
        }
      }
      if (itemData.type === 'cell') {
        s['display'] = 'inline-block'
      }
      if (itemData.type === 'text') {
        s['overflow-wrap'] = 'break-word'
      }

      // backgroundColor
      if (itemData.attrs.backgroundColor) {
        s['background-color'] = itemData.attrs.backgroundColor
      }

      // color
      if (itemData.attrs.color) {
        s['color'] = itemData.attrs.color
      }

      // zoom
      if (itemData.attrs.zoom) {
        s['transform'] = 'scale(' + (Number(itemData.attrs.zoom) / 100).toFixed(2) + ')'
      }

      // opacity
      if (itemData.attrs.opacity) {
        s['opacity'] = (Number(itemData.attrs.opacity) / 100).toFixed(2)
      }

      // rotate transform:rotate(7deg);
      if (itemData.attrs.rotate) {
        if (!s['transform']) {
          s['transform'] = ''
        }
        s['transform'] += ' rotate(' + itemData.attrs.rotate + 'deg)'
      }

      // 上下翻转
      if (itemData.attrs.rotateType === 'rotateY') {
        if (!s['transform']) {
          s['transform'] = ''
        }
        s['transform'] += ' rotateY(180deg)'
      }

      // 左右翻转
      if (itemData.attrs.rotateType === 'rotateX') {
        if (!s['transform']) {
          s['transform'] = ''
        }
        s['transform'] += ' rotateX(180deg)'
      }

      // isReflect 倒影
      if (itemData.attrs.isReflect) {
        s['-webkit-box-reflect'] = ' below ' + itemData.attrs.reflectSpace + 'px -webkit-linear-gradient(top, transparent, transparent ' + itemData.attrs.reflectOpacity + '%, rgba(255, 255, 255, 0.8))'
      }

      // textAlign
      if (itemData.attrs.textAlign) {
        s['text-align'] = itemData.attrs.textAlign
      }

      /*
      if (!s['width'] || s['width'] === '100%') {
        s['width'] = 'auto'
      }
      */

      if (s['width'] && s['width'].indexOf('%') > 0) {
        s['width'] = 'calc(' + s['width'] + ' - 0px)'
      }

      return s
    },
    // 控件容器css style 设定
    compPanelStyle() {
      if (!this.data) {
        return {}
      }
      let s = {}
      if (this.isRoot) {
        s = this.compBodyStyle(this.data)
      }
      if (this.data.attrs.display) {
        s['display'] = this.data.attrs.display
      }
      if (this.data.type === 'cell' && this.data.attrs.align === 'top-bottom') {
        s['height'] = '100%'
      }

      s['width'] = 'auto'

      return s
    },
    // 控件容器css class 设定
    compPanelClass() {
      if (!this.data) {
        return {}
      }
      if (this.data.isActive) {
      }

      return {
        'ts-comp': true,
        'root-node': this.isRoot,
        'ts-article': this.isRoot,
        'ts-active': this.data.isActive,
        'ts-design': this.isRoot && !this.isPreview && this.data.editmode === 'design',
        'ts-node': this.data.nodeType === 'main'
      }
    },
    // 点击控件进行激活
    handleClick(item) {
      if (this.disabled) {
        return
      }
      this.active(item)
    },
    // 根据id获取控件节点
    getNodeById(id) {
      return this._getNodeById(this.data, id)
    },
    // 根据id获取控件节点
    _getNodeById(node, id) {
      if (node.id === id) {
        return node
      }
      // 遍历子节点
      if (node.children) {
        for (const key in node.children) {
          const item = node.children[key]
          // 递归寻找子节点
          const finded = this._getNodeById(item, id)
          if (finded) {
            return finded
          }
        }
      }
      return undefined
    },
    // 根据id激活控件
    activeById(id) {
      const item = this.getNodeById(id)
      this.active(item)
    },
    // 激活控件数据
    active(item) {
      // 获取根节点数据
      const store = this.root.data
      // 清空激活的节点
      this.clearActive(store)
      // 设置节点为激活状态
      this.$set(item, 'isActive', true)
      // 获取激活节点的dom对象
      const dom = document.getElementById('dom_' + item.id)
      this.root.activeNode = item
      if (dom) {
        this.$nextTick(() => {
          this.root.$refs.tool.show(dom)
        })
      }
    },
    // 清除激活状态
    clearActive(node) {
      this.activeNode = null
      // this.textUi = null
      if (node) {
        if (node.isActive) {
          // 设置节点为非激活状态
          this.$set(node, 'isActive', false)
        }
        if (node.children) {
          // 递归遍历子节点
          node.children.forEach((item) => {
            this.clearActive(item)
          })
        }
      }
      // 隐藏工具条
      this.hideTool()
    },
    // 隐藏工具条
    hideTool() {
      if (this.root.$refs.tool) {
        // 隐藏主工具条
        this.root.$refs.tool.hide()
      }
      if (this.root.$refs.toolCom) {
        // 隐藏副工具条
        this.root.$refs.toolCom.hide()
      }
    },
    // 获取新id
    getNewId() {
      return 'ts-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
    },
    // 编辑按钮点击
    editingClick() {
      this.$emit('templateSelect', this.data)
    },
    // 新增模板数据
    insertTemplate(tmpl) {
      if (tmpl.set) {
        // 一键排版应用
        this.formatSet(tmpl)
        return
      }
      if (this.$refs.tool && this.$refs.tool.aimed) {
        // 样式应用
        this.formatPaste(tmpl)
        return
      }

      // 新增模板
      let selectedNode = this.activeNode
      let index = 0
      if (!selectedNode) {
        selectedNode = this.data
      }
      const nodeData = JSON.parse(JSON.stringify(tmpl))
      nodeData.nodeType = 'main'
      if (selectedNode.children) {
        nodeData.id = this.getNewId()
        nodeData.parentId = selectedNode.id
        this.setParent(nodeData, true)
        selectedNode.children.splice((selectedNode.children.length), 0, nodeData)
      } else {
        const parent = this.getNodeById(selectedNode.parentId)
        index = parent.children.findIndex(function(itemT) {
          return itemT.id === selectedNode.id
        })
        nodeData.id = this.getNewId()
        nodeData.parentId = parent.id
        this.setParent(nodeData, true)
        parent.children.splice(index + 1, 0, nodeData)
      }
      this.root.record('insert')
    },
    // 一键排版样式应用
    formatSet(tmpl) {
      this.data.children.forEach((item) => {
        const typeName = item.textType || item.nodeTypeName
        if (typeName === 'title' && tmpl.set.title) {
          this.activeNode = item
          this.formatPaste(tmpl.set.title, true, typeName)
        } else if ((typeName === 'important') && tmpl.set.card) {
          this.activeNode = item
          this.formatPaste(tmpl.set.card, true, typeName)
        } else if (typeName === 'component' && tmpl.set.component) {
          this.activeNode = item
          this.formatPaste(tmpl.set.component, true, typeName)
        } else if (typeName === 'guid' && tmpl.set.guid) {
          this.activeNode = item
          this.formatPaste(tmpl.set.guid, true, typeName)
        } else if ((typeName === 'img' || item.type === 'img') && tmpl.set.img) {
          this.activeNode = item
          this.formatPaste(tmpl.set.img, true, 'img')
        }
      })
      this.root.record('formatSet')
    },
    // 样式应用
    formatPaste(tmpl, isSet, typeName) {
      let selectedNode = this.activeNode
      if (!selectedNode) {
        selectedNode = this.data
      }
      let index = 0
      // 根据模板构建数据节点
      const nodeData = JSON.parse(JSON.stringify(tmpl))
      nodeData.nodeType = 'main'
      if (typeName) {
        nodeData.nodeTypeName = typeName
      }

      // 获取父节点
      const parent = this.getNodeById(selectedNode.parentId)
      index = parent.children.findIndex(function(itemT) {
        return itemT.id === selectedNode.id
      })
      nodeData.id = this.getNewId()
      nodeData.parentId = parent.id
      this.setParent(nodeData, true)

      // 内容复制
      const textsFrom = this.getNodesByType(selectedNode, 'text')
      const imgsFrom = this.getNodesByType(selectedNode, 'img')
      const textsTo = this.getNodesByType(nodeData, 'text')
      const imgsTo = this.getNodesByType(nodeData, 'img')

      // 文字复制
      textsTo.forEach((text) => {
        if (text.textType && text.textType !== 'fixed') {
          // const textTarget = textsFrom.filter(item => item.textType === text.textType)
          const textTarget = textsFrom.filter(item => item.textType && item.textType !== 'fixed')
          if (textTarget.length) {
            //
            let tFrom = textTarget[0].attrs.text
            tFrom = tFrom.replace(/(<([^>]+)>)/ig, '')

            let tTo = text.attrs.text
            // if (tTo.match(/<span[^<>]+>(.*?)<\/span>/)) {
            //   // tTo = tTo.replace(/<span[^<>]+>(.*?)<\/span>/g, '1133444')
            //   tTo = tTo.replace(/<span[^<>]+>(.*?)<\/span>/g, (match, matchText, index, str) => {
            //     return match.replace(matchText, tFrom)
            //   })
            // } else
            if (tTo.match(/<p[^<>]+>(.*?)<\/p>/)) {
              // tTo = tTo.replace(/<span[^<>]+>(.*?)<\/span>/g, '1133444')
              tTo = tTo.replace(/<p[^<>]+>(.*?)<\/p>/g, (match, matchText, index, str) => {
                if (matchText.length > 20 && !matchText.match(/(<([^>]+)>)/ig)) {
                  return match.replace(matchText, tFrom)
                } else {
                  return match
                }
              })
            } else {
              tTo = '<p>' + tFrom + '</p>'
            }
            // text.attrs.text = textTarget[0].attrs.text
            text.attrs.text = tTo
          }
        }
      })

      // 图片复制
      imgsTo.forEach((img) => {
        if (imgsFrom.length) {
          img.attrs.src = imgsFrom[0].attrs.src
          img.resourceid = imgsFrom[0].resourceid
        }
      })

      parent.children.splice(index, 1)
      parent.children.splice(index, 0, nodeData)

      this.hideTool()
      if (!isSet) {
        this.root.record('formatPaste')
        this.root.activeById(nodeData.id)
      }
    },
    // 剪贴板处理
    onClipboard(clipData) {
      if (clipData.type === 'paste') {
        // 粘贴
        if (this.lastClipData) {
          this.root.insertTemplate(this.lastClipData.data)
        }
      } else {
        this.lastClipData = JSON.parse(JSON.stringify(clipData))
        const newData = JSON.parse(JSON.stringify(clipData.data))
        newData.id = 'tpl_' + newData.id
        this.setParent(newData, true)
        clipData.data = newData
        this.$emit('onClipboard', clipData)
        if (clipData.type === 'shear') {
          // 剪切
          this.root.delNode(clipData.data)
        }
      }
    },
    // 删除节点
    delNode(node) {
      const parent = this.root.getNodeById(node.parentId)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }

        // index
        let index = 0
        let indexTemp = 0
        parent.children.forEach((item) => {
          if (item.id === node.id) {
            index = indexTemp
          }
          indexTemp++
        })

        parent.children.splice(index, 1)
        this.root.record()
        this.hideTool()
        this.activeNode = null
      }
    },
    // 记录操作步骤
    record(key) {
      this.$emit('record', key)
    },
    // 收藏点击
    like() {
      this.$emit('like', this.data)
    },
    // 子控件收藏点击
    sublike(data) {
      this.$emit('like', data)
    },
    // 删除
    del() {
      this.$emit('del', this.data)
    },
    // 获取使用中的资源列表
    getReslist(fieldname) {
      const list = []
      this._getReslist(this.data.children, list, fieldname)
      return list
    },
    // 获取使用中的资源列表
    _getReslist(children, list, fieldname) {
      if (children) {
        children.forEach((item) => {
          if (item.resourceid) {
            const data = {
              resourceid: item.resourceid
            }
            if (fieldname) {
              data[fieldname] = this.data.id
            }
            list.push(data)
          }
          this._getReslist(item.children, list, fieldname)
        })
      }
    },
    // 获取 dom id
    getDomId(item) {
      if (this.root.isPreview) {
        return undefined
      } else {
        return 'dom_' + item.id
      }
    },
    // 根据类型获取节点
    getNodesByType(nodeData, type) {
      const nodes = []
      this._getNodesByType(nodes, nodeData, type)
      return nodes
    },
    // 根据类型获取节点
    _getNodesByType(nodes, nodeData, type) {
      if (nodeData.type === type) {
        nodes.push(nodeData)
      }
      if (nodeData.children) {
        nodeData.children.forEach((item) => {
          this._getNodesByType(nodes, item, type)
        })
      }
    },
    // 节点变更事件
    nodeChange() {
      if (this.root.$refs.tool) {
        this.root.$refs.tool.setTextBarStyle()
      }
    },
    // 设置激活中的文本
    setActiveText(text) {
      this.textUi = text
    },
    // 获取主节点
    getMainNode(data) {
      if (data.nodeType === 'main' || data.type === 'text' || data.type === 'img') {
        return data
      }
      if (data.parentId) {
        const pitem = this.getNodeById(data.parentId)
        if (pitem) {
          if (pitem.type === 'article') {
            return data
          }
          return this.getMainNode(pitem)
        }
      }
      return null
    },
    // 复杂节点（从秀米中粘贴生成的）中启动子内容编辑
    editToolNode(toolNode) {
      this.toolNode = toolNode
      const dom = toolNode.target
      if (dom) {
        this.$nextTick(() => {
          // 工具条显示
          this.root.$refs.toolCom.show(dom)
        })
      }
    },
    // 取消复杂节点编辑
    unEditToolNode() {
      this.toolNode = null
      this.hideTool()
    }
  }
}
</script>
<style scoped>
  .tool-box{
    display: none;
    position: absolute;
    top: 0;
    right:0;
  }
  .ts-article:hover .tool-box{
    display: inline-block;
  }
</style>
