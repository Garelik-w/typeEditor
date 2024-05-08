<template>
  <div v-infinite-scroll="load" v-loading="loading" infinite-scroll-disabled="disabled" class="ts-comp-panel">
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
        :is-del="true"
        @like="like"
        @del="del"
        @templateSelect="templateSelect"
      />
    </draggable>
    <p v-if="loading" class="info">加载中...</p>
    <p v-if="noMore" class="info">没有更多了</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserTemplateList } from '@/api/template'
import comp from '@/components/Comp'
import draggable from 'vuedraggable'
export default {
  components: {
    comp,
    draggable
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
    isArticle: { // 是否是文章标识
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
    ...mapGetters([
      'userid'
    ]),
    disabled() {
      return this.loading || this.noMore
    }
  },
  mounted() {

  },
  methods: {
    // 模板选中处理
    templateSelect(tmpl) {
      // 触发事件
      this.$emit('templateSelect', JSON.parse(JSON.stringify(tmpl)), true)
    },
    // 滚动加载模板数据
    load() {
      if (this.userid) {
        this.loading = true
        getUserTemplateList({ page: this.page, userid: this.userid }).then((result) => {
          this.loading = false
          // 下次加载下一页
          this.page++
          // 如果没有下一页数据，则记录没有更多数据
          if (!result.next) {
            this.noMore = true
          }

          result.results.forEach((item) => {
            if (item.content) {
              const itemData = JSON.parse(item.content)
              itemData.id = 'tpl_' + itemData.id
              itemData.templateuserid = item.id
              this.list.push(itemData)
            }
          })
        }).catch(error => {

        })
      }
    },
    // 重新加载数据
    reload() {
      this.$nextTick(() => {
        this.list = []
        this.noMore = false
        this.page = 1
      })
    },
    // 获取随机新id
    getNewId() {
      return 'ts-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
    },
    // 收藏
    like(data) {
      // 触发事件
      this.$emit('like', data)
    },
    // 删除模板
    del(data) {
      // 触发事件
      this.$emit('del', data)
    }
  }
}
</script>

