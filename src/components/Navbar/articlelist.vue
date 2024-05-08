<template>
  <el-dialog v-el-drag-dialog title="选择图文" :visible.sync="formVisible" width="1000px" :close-on-click-modal="false" :modal-append-to-body="false" append-to-body>
    <div v-loading="loading" class="ts-img-border-select">
      <el-row style="min-height: 330px; max-height: 410px;overflow: auto;">
        <el-col v-for="(item, index) in list" :key="item.articleid" :span="8" style="padding: 6px;">
          <el-card shadow="always" :class="getCardClass(item)" @click.native="handleClick(item)">
            <div class="ts-article-info">
              <div class="left-part">
                <div class="title-image" :style="getTitleImgStyle(item)" />
              </div>
              <div class="right-part">
                <div style="margin-bottom: .5em;min-height: 16px;">{{ item.title }}</div>
                <div class="title-summary">{{ item.summary }}</div>
                <div class="title-time">{{ formatTime(new Date(item.createdtime),'{y}-{m}-{d} {h}:{i}:{s}')}}</div>
              </div>
              <div style="clear:both" />
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="text-align: center;">
        <Pagination
          v-show="total>0"
          background
          layout="prev, pager, next"
          :total="total"
          :page.sync="page"
          :limit.sync="pageSize"
          @pagination="getArticleList()"
        />
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer" style="margin: 5px 0 -1px">
      <el-button size="mini" @click="closeForm">
        取消
      </el-button>
      <el-button type="primary" size="mini" @click="openArticle()">打开</el-button>
    </div>
    <div />
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import placeholder from '@/assets/imgs/placeholder.jpg'
import elDragDialog from '@/directive/el-drag-dialog'
import { getList } from '@/api/article'

import { formatTime } from '@/utils/index'

export default {
  directives: { elDragDialog },
  components: {
    Pagination
  },
  data() {
    return {
      formVisible: false,
      loading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      activeItem: null,
      list: []
    }
  },
  computed: {
    ...mapGetters([
      'userid'
    ])
  },
  methods: {
    formatTime,
    open() {
      this.formVisible = true
      this.getArticleList()
    },
    closeForm(){
      this.formVisible = false
    }, openArticle() {
      if (!this.activeItem) {
        this.$message({
          message: '请选择图文',
          type: 'warning'
        })
      } else {
        this.$emit('doOpen', this.activeItem.content)
        this.formVisible = false
      }
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
    }, getArticleList() {
      this.loading = true
      getList({ page: this.page, userid: this.userid }).then((result) => {
        this.loading = false
        this.list = result.results
        this.total = result.count
        this.activeItem = null
      }).catch(error => {

      })
    }
  }
}
</script>

<style lang="scss">
  .ts-article-info{
    background-color: #fff;
    position: relative;
  }
  .left-part{
    position: relative;
    float: left;
    width: 75px;
    height: 75px;
    text-align: center;
  }
  .right-part{
    position: absolute;
    left: 85px;
    right: 0;
    top: 0;
    text-align: left;
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

  .title-summary{
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    min-height: 32px;
  }
  .title-time{
    color:#999;
    margin-top: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }

  .el-card.active{
    border: 1px solid #409eff;
    box-shadow: #409eff 0px 0px 10px inset;
  }
</style>
