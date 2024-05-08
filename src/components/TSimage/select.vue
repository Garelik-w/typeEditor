<template>
  <el-dialog v-el-drag-dialog title="图片" :visible.sync="formVisible" width="960px" :close-on-click-modal="false" :modal-append-to-body="false" append-to-body>
    <el-tabs v-model="activeName">
      <el-tab-pane label="本地上传" name="upload">
        <el-row>
          <el-col :span="24" style="text-align: center">
            <el-upload
              class="upload-demo"
              name="path"
              drag
              :data="uploadData"
              :on-success="handleSuccess"
              :action="uploadUrl"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5mb</div>
            </el-upload>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="裁剪图片" name="cropper">
        <el-button v-if="!this.cropperOption.img" size="small" type="primary">
          <label for="uploads">①选择图片剪裁</label>
          <input id="uploads" type="file" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="changeUpload($event)">
        </el-button>
        <el-row v-if="this.cropperOption.img">
          <el-col :span="24">
            <el-radio-group v-model="fixedStr" size="small" @change="fixedStrChange">
              <el-radio-button label="free">自由</el-radio-button>
              <el-radio-button label="1_1">1:1</el-radio-button>
              <el-radio-button label="4_3">4:3</el-radio-button>
              <el-radio-button label="3_4">3:4</el-radio-button>
              <el-radio-button label="3_2">3:2</el-radio-button>
              <el-radio-button label="2_3">2:3</el-radio-button>
              <el-radio-button label="16_9">16:9</el-radio-button>
              <el-radio-button label="9_16">9:16</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
        <div class="cropper-content">
          <div class="cropper" style="text-align:center">
            <VueCropper
              v-if="this.cropperOption.img"
              ref="cropper"
              :img="cropperOption.img"
              :output-size="cropperOption.outputSize"
              :output-type="cropperOption.outputType"
              :info="cropperOption.info"
              :full="cropperOption.full"
              :can-move="cropperOption.canMove"
              :can-move-box="cropperOption.canMoveBox"
              :original="cropperOption.original"
              :auto-crop="cropperOption.autoCrop"
              :fixed="cropperOption.fixed"
              :fixed-number="cropperOption.fixedNumber"
              :center-box="cropperOption.centerBox"
              :info-true="cropperOption.infoTrue"
              :fixed-box="cropperOption.fixedBox"
              :auto-crop-width="cropperOption.autoCropWidth"
              :auto-crop-height="cropperOption.autoCropHeight"
              @realTime="realTime"
            />
          </div>
        </div>
        <el-button v-if="this.cropperOption.img" size="small" type="primary" @click="doUpload">
          <label for="uploads">②保存上传</label>
        </el-button>

      </el-tab-pane>
      <el-tab-pane label="我的上传" name="myUpLoad">
        <el-row v-loading="loading" style="height: 460px;overflow: auto;">
          <el-col v-for="(item, index) in resourceList" :key="item.id" :span="6" style="padding: 6px;">
            <el-card shadow="always" :class="getCardClass(item)" style="text-align: center;position: relative;" @click.native="handleClick(item)">
              <img :src="imgBasePath+item.resourcepath" class="image" style="height: 100px">
              <div style="position: absolute;display: inline-block;top:0;right: 0;">
                <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="del(item)" />
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
            @pagination="getResourceList()"
          />
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <div v-if="activeName==='myUpLoad'" slot="footer" class="dialog-footer" style="margin: 5px 0 -1px">
      <el-button size="mini" @click="closeForm">
        取消
      </el-button>
      <el-button type="primary" size="mini" @click="doImgSelected">
        确定
      </el-button>
    </div>
    <div />
  </el-dialog>
</template>

<script>

import { mapGetters } from 'vuex'
import elDragDialog from '@/directive/el-drag-dialog'
import { VueCropper } from 'vue-cropper'
import { upload, getUserResourceList, postUserResource, delUserResource } from '@/api/resource'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  directives: { elDragDialog },
  components: {
    VueCropper,
    Pagination
  },
  data() {
    return {
      formVisible: false, // 表示开关
      activeName: 'upload', // 激活类型名称
      uploading: false, // 正在上传标志
      fixedStr: 'free', // 固定比例标识
      loading: false, // 加载中标识
      total: 0, // 总件数
      page: 1, // 当前页码
      pageSize: 10, // 分页大小
      activeItem: null, // 当前激活item
      imgBasePath: (process.env.VUE_APP_BASE_API + '/media/').replace('https:', 'http:'), // 图片主路径
      uploadUrl: process.env.VUE_APP_BASE_API + '/resource/', // 上传主路径
      previews: {},
      resourceList: [], // 使用中资源列表
      uploadData: {
        resourceid: this.getNewId()
      },
      cropperOption: {
        img: '', // 裁剪图片的地址
        info: false, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 30000, // 默认生成截图框宽度
        autoCropHeight: 20000, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [7, 5], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        canMove: false, // 图能否拖动
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      fileinfo: null
    }
  },
  computed: {
    ...mapGetters([
      'userid'
    ])
  },
  methods: {
    // 打开画面
    open(cropperImg) {
      this.formVisible = true
      if (cropperImg) {
        this.activeName = 'cropper'
        this.fileinfo = null
        // 图片服务应使用 https协议
        this.cropperOption.img = cropperImg.replace('http:', 'https:')
        // this.setBase64(cropperImg, (base64) => {
        //   debugger
        //   this.cropperOption.img = base64
        // })
      }
      this.getResourceList()
    },
    // 设置64进制图片数据
    setBase64(src, callback) {
      const image = new Image()
      // 处理缓存
      image.src = src + '?v=' + Math.random()
      // 支持跨域图片
      // image.crossOrigin = '*'
      const _this = this
      image.onload = function() {
        const base64 = _this.transBase64FromImage(image)
        callback && callback(base64)
      }
    },
    // 图片转64进制
    transBase64FromImage(image) {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, image.width, image.height)
      // 可选其他值 image/jpeg
      return canvas.toDataURL('image/png')
    },
    // 关闭画面
    closeForm() {
      this.formVisible = false
    },
    // 获取随机新id
    getNewId() {
      return 'rs-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
    },
    // 获取随机新名称
    getNewName() {
      return '' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
    },
    // 上传按钮   限制图片大小
    changeUpload(e, fileList) {
      const file = e.target.files[0]
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!')
        return false
      }
      this.fileinfo = file

      const reader = new FileReader()
      reader.onload = (e) => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.$nextTick(() => {
          this.cropperOption.img = data
        })
      }
      // 转化为base64
      reader.readAsDataURL(file)
      // 转化为blob
      // reader.readAsArrayBuffer(file)
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    doUpload() {
      this.$refs.cropper.getCropBlob((data) => {
        // 新建formDate对象
        const formData = new FormData()
        for (const key in this.uploadData) {
          formData.append(key, this.uploadData[key])
        }
        // 文件单独push,第三个参数指定上传的文件名
        formData.append('path', data, this.fileinfo ? this.fileinfo.name : this.getNewName())
        this.uploading = true
        upload(formData).then((result) => {
          this.$notify({
            message: '上传成功。',
            type: 'success',
            duration: 2000
          })
          this.uploadData = {
            resourceid: this.getNewId()
          }
          this.cropperOption.img = ''
          this.uploading = false
          const path = result.path.replace(this.imgBasePath, '')
          postUserResource({ userid: this.userid, resourceid: result.resourceid, resourcepath: path, resourcethumbnail: path }).then((result) => {
            this.getResourceList()
          })
          this.imgSelected(result)
        }).catch(error => {
          this.uploading = false
          this.$notify({
            message: '上传失败。',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    // 上传成功处理
    handleSuccess(response, file, fileList) {
      this.$message({
        message: `上传成功`,
        type: 'success',
        duaration: 1000
      })
      this.uploadData = {
        resourceid: this.getNewId()
      }
      this.cropperOption.img = ''
      this.uploading = false
      const path = response.path.replace(this.imgBasePath, '')
      postUserResource({ userid: this.userid, resourceid: response.resourceid, resourcepath: path, resourcethumbnail: path }).then((result) => {
        this.getResourceList()
      })
      this.imgSelected(response)
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data
    },
    // 图片选中处理
    imgSelected(data) {
      this.$emit('imgSelected', data)
      this.formVisible = false
    },
    // 固定模式变更处理
    fixedStrChange(val) {
      if (val === 'free') {
        this.cropperOption.fixed = false
      } else {
        this.cropperOption.fixed = true
        const nums = val.split('_')
        this.cropperOption.fixedNumber = [Number(nums[0]), Number(nums[1])]
        this.$nextTick(() => {
          this.$refs.cropper.goAutoCrop()
        })
      }
    },
    // 获取用户资料列表
    getResourceList() {
      this.loading = true
      getUserResourceList({ page: this.page, userid: this.userid }).then((result) => {
        this.loading = false
        result.results.forEach((item) => {
          item.path = process.env.VUE_APP_BASE_API + '/media/' + item.resourcepath
        })
        this.resourceList = result.results
        this.total = result.count
        this.activeItem = null
      }).catch(error => {

      })
    },
    // 删除资源
    del(item) {
      delUserResource(item.id).then((result) => {
        this.getResourceList()
      })
    },
    // 点击事件
    handleClick(itme) {
      this.resourceList.forEach((i) => {
        if (i.isActive) {
          this.$set(i, 'isActive', false)
        }
      })
      this.$set(itme, 'isActive', true)
      this.activeItem = itme
    },
    // 卡片 class样式
    getCardClass(item) {
      return {
        'active': item.isActive
      }
    },
    // 执行图片选择处理
    doImgSelected(data) {
      if (this.activeItem) {
        this.imgSelected(this.activeItem)
      } else {
        this.$message({
          message: '请选择图片',
          type: 'warning'
        })
      }
    }
  }
}
</script>
<style lang="scss">
  .el-card.active{
    border: 1px solid #409eff;
    box-shadow: #409eff 0px 0px 10px inset;
  }
</style>

