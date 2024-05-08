<template>
  <el-dialog v-el-drag-dialog title="选择模板" :visible.sync="formVisible" width="500px" :close-on-click-modal="false" :modal-append-to-body="false" append-to-body>
    <div v-infinite-scroll="load" v-loading="loading" infinite-scroll-disabled="disabled" class="ts-comp-panel" style="width: 360px;text-align: center;margin: 0 auto;max-height: 400px;overflow-y: auto;">
      <div
        v-for="el in list"
        :class="{'active':curTemplate&&curTemplate.id === el.id}"
      >
        <comp
          :data="el"
          :is-root="true"
          :is-article="true"
          :is-preview="true"
          :is-like="false"
          :is-del="false"
          @templateSelect="templateSelect"
        />
      </div>
      <p v-if="loading" class="info">加载中...</p>
      <p v-if="noMore" class="info">没有更多了</p>
    </div>
    <div slot="footer" class="dialog-footer" style="margin: 5px 0 -1px">
      <el-button size="mini" @click="closeForm">
        取消
      </el-button>
      <el-button type="primary" size="mini" @click="doSelect()">选择</el-button>
    </div>
    <div />
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { getList } from '@/api/template'
import comp from '@/components/Comp'
import placeholder from '@/assets/imgs/placeholder.jpg'
import elDragDialog from '@/directive/el-drag-dialog'

import { formatTime } from '@/utils/index'

export default {
  directives: { elDragDialog },
  components: {
    comp
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
      formVisible: false,
      curTemplate: null,
      list: [],
      loading: false,
      page: 1,
      noMore: false
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
    formatTime,
    open() {
      this.formVisible = true
    },
    closeForm() {
      this.formVisible = false
    }, getCardClass(item) {
      return {
        'active': item.isActive
      }
    }, handleClick(itme) {
      this.list.forEach((i) => {
        if (i.isActive) {
          this.$set(i, 'isActive', false)
        }
      })
      this.$set(itme, 'isActive', true)
      this.activeItem = itme
    }, getTitleImgStyle(item) {
      const s = {}
      s['background-image'] = 'url(' + (item && item.resourcepath ? item.resourcepath : placeholder) + ')'
      return s
    }, load() {
      this.loading = true
      getList({ type: this.type, page: this.page }).then((result) => {
        this.loading = false
        this.page++
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
    }, reload() {
      this.list = []
      this.noMore = false
      this.page = 1
    }, templateSelect(selectedData) {
      this.curTemplate = selectedData
    }, doSelect() {
      this.closeForm()
      this.$emit('templateSelect', this.curTemplate)
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
