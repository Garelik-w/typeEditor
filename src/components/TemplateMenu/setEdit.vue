<template>
  <el-dialog v-el-drag-dialog title="一键排版" :visible.sync="formVisible" width="600px" :close-on-click-modal="false" :modal-append-to-body="false" append-to-body>
    <div v-loading="loading" class="ts-img-border-select" style="max-height: 500px;overflow-y: auto;">
      <el-form ref="form" :rules="rules" :model="data" label-width="100px">
        <el-form-item label="排版名称" prop="title">
          <el-input v-model="data.title" />
        </el-form-item>
        <el-form-item label="标题">
          <templateItem v-model="data.set.title" type="001" />
        </el-form-item>
        <el-form-item label="重点文本">
          <templateItem v-model="data.set.card" type="002" />
        </el-form-item>
        <el-form-item label="图片">
          <templateItem v-model="data.set.img" type="003" />
        </el-form-item>
        <el-form-item label="组件">
          <templateItem v-model="data.set.component" type="004" />
        </el-form-item>
        <el-form-item label="引导">
          <templateItem v-model="data.set.guid" type="005" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer" style="margin: 5px 0 -1px">
      <el-button size="mini" @click="closeForm">
        取消
      </el-button>
      <el-button type="primary" size="mini" @click="saveData()">保存</el-button>
    </div>
    <div />
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import templateItem from '@/components/TemplateMenu/templateItem'
import placeholder from '@/assets/imgs/placeholder.jpg'
import elDragDialog from '@/directive/el-drag-dialog'
import { post, put } from '@/api/template'

import { formatTime } from '@/utils/index'

export default {
  directives: { elDragDialog },
  components: {
    templateItem
  },
  data() {
    return {
      formVisible: false, // 画面表示标识
      loading: false, // 加载中
      isNew: true, // 新增标识
      data: {
        title: '', // 一键排版模板名称
        set: {
          title: null, // 标题模板
          card: null, // 重点文本模板
          img: null, // 图片模板
          component: null, // 组件模板
          guid: null // 引导模板
        }
      },
      rules: { // 表单验证规则
        title: [
          { required: true, message: '请输入排版名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userid'
    ])
  },
  methods: {
    formatTime,
    // 打开画面
    open(data) {
      this.formVisible = true
      // 默认值
      this.data = {
        title: '',
        set: {
          title: null,
          card: null,
          img: null,
          component: null,
          guid: null
        }
      }
      this.isNew = true
      if (data) {
        // 编辑模式，加载数据
        this.data = JSON.parse(JSON.stringify(data))
        this.isNew = false
        if (!this.data.set) {
          this.data.set = {
            title: null,
            card: null,
            img: null,
            component: null,
            guid: null
          }
        }
      }
    },
    // 关闭画面
    closeForm() {
      this.formVisible = false
    },
    // 获取卡片css class样式
    getCardClass(item) {
      return {
        'active': item.isActive
      }
    },
    // 点击事件
    handleClick(itme) {
      this.list.forEach((i) => {
        if (i.isActive) {
          this.$set(i, 'isActive', false)
        }
      })
      this.$set(itme, 'isActive', true)
      this.activeItem = itme
    },
    // 获取标题背景style
    getTitleImgStyle(item) {
      const s = {}
      s['background-image'] = 'url(' + (item && item.resourcepath ? item.resourcepath : placeholder) + ')'
      return s
    },
    // 保存处理
    saveData() {
      this.$refs.form.validate((valid) => { // 校验表单
        if (valid) {
          // 保存模板数据
          this.saveTemplate()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取随机新id
    getNewId() {
      return 'ts-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
    },
    // 保存模板数据
    saveTemplate() {
      if (this.isNew) {
        // 新增时创建新id
        this.data.id = this.getNewId()
      }
      const data = {
        'templateid': this.data.id,
        'userid': 'admin',
        'title': '',
        'templatetype': '006',
        'templatekbn': '',
        'content': JSON.stringify(this.data)
      }

      this.loading = true
      if (this.isNew) {
        // 新增处理
        data['createdtime'] = new Date()
        post(data).then((result) => {
          this.isNew = false
          this.loading = false
          this.$notify({
            message: '保存成功。',
            type: 'success',
            duration: 2000
          })
          this.closeForm()
          this.$emit('afterSaved')
        }).catch(error => {
          this.loading = false
        })
      } else {
        // 保存处理
        data['modifiedtime'] = new Date()
        put(data).then((result) => {
          this.isNew = false
          this.loading = false
          this.$notify({
            message: '保存成功。',
            type: 'success',
            duration: 2000
          })
          this.closeForm()
          this.$emit('afterSaved')
        }).catch(error => {
          this.loading = false
        })
      }
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

  .el-form-item__content{
    line-height: 1.3;
  }
</style>
