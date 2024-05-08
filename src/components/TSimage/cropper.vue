<template>
  <el-dialog
    ref="dialog"
    v-el-drag-dialog
    class="aim-panel"
    :top="top+'px'"
    title="图片"
    :visible.sync="formVisible"
    :width="dialogWidth+'px'"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    append-to-body
    @open="onOpen"
  >

    <div class="cropper-content" :style="{'width':width+'px','height':height+'px'}">
      <div class="cropper" :style="{'text-align':'center','width':width+'px','height':height+'px'}">
        <VueCropper
          v-if="this.cropperOption.img"
          ref="cropper"
          mode="100%"
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
          :auto-crop-area="1"
          @realTime="realTime"
        />
      </div>
    </div>

    <div class="cropper-tool">
      <el-radio-group v-model="fixedStr" size="small" @change="fixedStrChange">
        <el-radio label="free">自由</el-radio>
        <el-radio label="1_1">1:1</el-radio>
        <el-radio label="4_3">4:3</el-radio>
        <el-radio label="3_4">3:4</el-radio>
        <el-radio label="3_2">3:2</el-radio>
        <el-radio label="2_3">2:3</el-radio>
        <el-radio label="16_9">16:9</el-radio>
        <el-radio label="9_16">9:16</el-radio>
      </el-radio-group>

      <el-row style="text-align: center;margin-top: 20px;">
        <el-button size="mini" type="primary" @click="doUpload">
          <label>确定</label>
        </el-button>
        <el-button size="mini" type="primary" @click="closeForm">
          <label>取消</label>
        </el-button>
      </el-row>
    </div>
    <div />
  </el-dialog>
</template>

<script>

import { mapGetters } from 'vuex'
import elDragDialog from '@/directive/el-drag-dialog'
import { VueCropper } from 'vue-cropper'
import { upload, getUserResourceList, postUserResource, delUserResource } from '@/api/resource'
export default {
  directives: { elDragDialog },
  components: {
    VueCropper
  },
  data() {
    return {
      formVisible: false, // 画面表示开关
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
        resourceid: this.getNewId() // 资源id
      },
      cropperOption: {
        img: '', // 裁剪图片的地址
        info: false, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 30000, // 默认生成截图框宽度
        autoCropHeight: 20000, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [7, 5], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMove: false, // 图能否拖动
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      top: 100,
      left: 100,
      width: 100,
      height: 100,
      dialogWidth: 600,
      loaded: false,
      fileinfo: null
    }
  },
  computed: {
    ...mapGetters([
      'userid'
    ])
  },
  methods: {
    // 打开剪裁画面
    open(cropperImg, pos) {
      this.formVisible = true
      if (cropperImg) {
        this.activeName = 'cropper'
        this.top = pos.top
        this.left = pos.left
        this.width = pos.width
        this.dialogWidth = this.width + 356
        this.height = pos.height
        this.fileinfo = null
        // 图片服务应使用 https协议
        this.cropperOption.img = cropperImg.replace('http:', 'https:')
        // this.setBase64(cropperImg, (base64) => {
        //   debugger
        //   this.cropperOption.img = base64
        // })
      }
    },
    // 打开画面事件，根据剪裁目标位置显示剪裁框
    onOpen(e) {
      const el = this.$refs.dialog.$el
      const dragDom = el.querySelector('.el-dialog')
      const screenWidth = document.body.clientWidth
      let left = (this.left - (screenWidth / 2 - this.dialogWidth / 2))
      if (!this.loaded) {
        left -= 10
        this.loaded = true
      }
      dragDom.style.left = left + 'px'
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
    // 上传成功
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
    // 剪裁图片确定
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
    // 点击事件
    handleClick(itme) {
      this.resourceList.forEach((i) => {
        if (i.isActive) {
          this.$set(i, 'isActive', false)
        }
      })
      this.$set(itme, 'isActive', true)
      this.activeItem = itme
    }
  }
}
</script>
<style lang="scss">
.cropper-content{
width: 300px;
  height: 260px;
  float: left;
}
  .cropper-tool{
    width: 300px;
    float: left;
    background-color: #fff;
    border: 1px solid #666;
    border-radius: 8px;
    padding: 20px;
    margin-left: 10px;
  }
</style>

