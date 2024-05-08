<template>
  <div v-infinite-scroll="load" v-loading="loading" infinite-scroll-disabled="disabled" class="ts-comp-panel">

    <el-button v-if="!isArticle" @click="addNewTemplate">新增模板</el-button>
    <el-button v-if="!isArticle" @click="pasteTemplate">粘贴模板</el-button>
    <draggable
      class="dragArea list-group"
      :list="list"
      :group="{ name: 'ts-cont', pull: 'clone', put: false }"
      :sort="false"
      :disabled="!isArticle"
    >
      <comp
        v-for="el in list"
        :data="el"
        :is-root="true"
        :is-article="isArticle"
        :is-preview="true"
        :is-like="isArticle"
        :is-del="!isArticle"
        @like="like"
        @del="del"
        @templateSelect="templateSelect"
      />
    </draggable>
    <p v-if="loading" class="info">加载中...</p>
    <p v-if="noMore" class="info">没有更多了</p>
    <templatePaste ref="templatePaste" @save="pasteTemplateSave" />
  </div>
</template>

<script>
import { getList } from '@/api/template'
import comp from '@/components/Comp'
import templatePaste from '@/components/TemplateMenu/templatePaste'
import draggable from 'vuedraggable'
export default {
  components: {
    comp,
    draggable,
    templatePaste
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
    type: { // 模板类型
      required: false,
      type: String,
      default: null
    },
    kbn: { // 模板区分-留用
      required: false,
      type: String,
      default: null
    },
    isArticle: { // 是否是文章的标识
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [], // 列表数据
      loading: false, // 加载中
      page: 1, // 当前页码
      noMore: false // 没有更多标识
    }
  },
  computed: {
    disabled() {
      return this.loading || this.noMore
    }
  },
  mounted() {

  },
  methods: {
    // 模板选择处理
    templateSelect(tmpl) {
      this.$emit('templateSelect', tmpl)
    },
    // 滚动加载模板数据
    load() {
      this.loading = true
      getList({ type: this.type, page: this.page }).then((result) => {
        this.loading = false
        // 下次加载下一页
        this.page++
        // 如果没有下一页数据，则记录没有更多数据
        if (!result.next) {
          this.noMore = true
        }
        result.results.forEach((item) => {
          const itemData = JSON.parse(item.content)
          if (this.isArticle) {
            itemData.id = 'tpl_' + itemData.id
          }
          this.list.push(itemData)
        })
      }).catch(error => {

      })
    },
    // 重新加载数据
    reload() {
      this.list = []
      this.noMore = false
      this.page = 1
    },
    // 获取随机新id
    getNewId() {
      return 'ts-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
    },
    // 添加新模板
    addNewTemplate() {
      const newTemp = {
        id: this.getNewId(),
        type: 'layout',
        templatetype: this.type,
        templatekbn: this.kbn,
        attrs: {

        },
        children: []
      }
      this.$emit('addNewTemplate', newTemp)
    },
    // 收藏处理
    like(data) {
      // 触发事件
      this.$emit('like', data)
    },
    // 删除模板数据
    del(data) {
      // 触发事件
      this.$emit('del', data)
    },
    // 构造控件数据
    pasteTemplate() {
      this.$refs.templatePaste.open()
    },
    // 粘贴模板确定处理
    pasteTemplateSave(template) {
      const newTemp = {
        id: this.getNewId(),
        type: 'layout',
        templatetype: this.type,
        templatekbn: this.kbn,
        attrs: {

        },
        children: [template]
      }
      // 触发事件
      this.$emit('pasteTemplateSave', newTemp)
    }
  }
}
</script>

