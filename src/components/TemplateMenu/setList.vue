<template>
  <div v-infinite-scroll="load" v-loading="loading" infinite-scroll-disabled="disabled" class="ts-comp-panel" style="padding-right: 0;">

    <el-button v-if="!isArticle" @click="addNewTemplate">新增模板</el-button>
    <div style="clear: both;margin-top: 10px;" />
    <div
      v-for="el in list"
      :key="el.id"
      class="set-box"
    >
      <div class="comp-box">
        <comp
          :data="getCompData(el)"
          :is-root="true"
          :is-article="true"
          :is-preview="true"
          :is-like="false"
          :is-del="false"
        />
      </div>
      <div class="set-cover">
        <el-button v-if="isArticle" size="mini" type="primary" @click="applySet(el)">使用</el-button>
        <el-button v-if="!isArticle" size="mini" type="primary" @click="editSet(el)">编辑</el-button>
        <el-button v-if="!isArticle" size="mini" type="danger" @click="deleteSet(el)">删除</el-button>
      </div>
      <div class="set-title">{{ el.title }}</div>
    </div>
    <div style="clear: both;margin-bottom: 20px;" />
    <p v-if="loading" class="info">加载中...</p>
    <p v-if="noMore" class="info">没有更多了</p>
    <setEdit ref="setEdit" @afterSaved="reload" />
  </div>
</template>

<script>
import { getList } from '@/api/template'
import setEdit from '@/components/TemplateMenu/setEdit'
import comp from '@/components/Comp'
export default {
  components: {
    comp,
    setEdit
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
    isArticle: {// 是否是文章
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [], // 一键排版数据列表
      loading: false, // 加载中
      page: 1, // 当前页数
      noMore: false // 没有更多标识
    }
  },
  computed: {
    // 禁用设定
    disabled() {
      return this.loading || this.noMore
    }
  },
  mounted() {

  },
  methods: {
    // 一键排版模板选择事件
    templateSelect(tmpl) {
      // 触发事件
      this.$emit('templateSelect', tmpl)
    },
    // 滚动加载一键排版数据
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
      this.$refs.setEdit.open()
      // this.$emit('addNewTemplate', newTemp)
    },
    // 收藏处理
    like(data) {
      // 触发事件
      this.$emit('like', data)
    },
    // 删除模板数据
    del(data) {
      this.$emit('del', data)
    },
    // 构造控件数据
    getCompData(data) {
      const compData = {
        'id': this.getNewId(),
        'attrs': {},
        'children': []
      }
      if (data.set) {
        // 标题
        this.addCompData(data.set.title, compData)
        // 重点文本
        this.addCompData(data.set.card, compData)
        // 图片
        this.addCompData(data.set.img, compData)
        // 组件
        this.addCompData(data.set.component, compData)
        // 引导
        this.addCompData(data.set.guid, compData)
      }

      return compData
    },
    // 添加组件
    addCompData(item, compData) {
      if (item) {
        item.parentId = compData.id
        compData.children.push(item)
      }
      return compData
    },
    // 应用一键排版处理
    applySet(setData) {
      this.$confirm('确认要应用该模板吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 触发事件
        this.$emit('templateSelect', setData)
      }).catch(() => {

      })
    },
    // 编辑一键排版模板
    editSet(setData) {
      this.$refs.setEdit.open(setData)
    },
    // 删除一键排版模板
    deleteSet(setData) {
      this.$emit('del', setData)
    }
  }
}
</script>
<style scoped>
.set-box{
  width: 160px;
  position: relative;
  height: 240px;
  float: left;
  /* background-color: red; */
  margin: 0 14px 20px 7px;
}
.set-box .comp-box{
  height: 400px;
  width: 320px;
  background-color: #fff;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  /* width: 50%; */
  /* float: left; */
  position: absolute;
  top: -100px;
  left: -80px;
  overflow: hidden;
}

  .comp-box >>> .ts-article {
    -webkit-box-shadow: none;
    box-shadow: none;
  }

  .set-cover{
    position: absolute;
    z-index: 9;
    width: 100%;
    height: 200px;
    background-color: #00000047;
    display: none;
    align-items: center;
  }

.set-box:hover .set-cover{
  display: flex;
}

  .set-cover .el-button{
    margin: auto;
  }
  .set-title{
    width: 100%;
    position: absolute;
    bottom: 0;
    line-height: 40px;
    text-align: center;
    background-color:#efefef;
  }
</style>
