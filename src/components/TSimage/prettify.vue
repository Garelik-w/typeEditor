<template>
  <el-dialog v-el-drag-dialog title="图片美化" :visible.sync="formVisible" width="80%" :close-on-click-modal="false" :modal-append-to-body="false" append-to-body>
    <div class="prettify-panel">
      <el-row>
        <el-col :span="8" style="padding: 0 2%;" class="prettify-tool">
          <el-row>
            <el-col :span="24">
              <span class="filter-title">对比度</span>
              <span class="filter-val">{{ filter.contrast }}%</span>
            </el-col>
          </el-row>
          <el-row class="slider-row">
            <el-col :span="24">
              <el-slider v-model="filter.contrast" :max="200" :show-tooltip="false" />
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <span class="filter-title">亮度</span>
              <span class="filter-val">{{ filter.brightness }}%</span>
            </el-col>
          </el-row>
          <el-row class="slider-row">
            <el-col :span="24">
              <el-slider v-model="filter.brightness" :max="200" :show-tooltip="false" />
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <span class="filter-title">浸透</span>
              <span class="filter-val">{{ filter.saturate }}%</span>
            </el-col>
          </el-row>
          <el-row class="slider-row">
            <el-col :span="24">
              <el-slider v-model="filter.saturate" :max="200" :show-tooltip="false" />
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <span class="filter-title">棕褐色</span>
              <span class="filter-val">{{ filter.sepia }}%</span>
            </el-col>
          </el-row>
          <el-row class="slider-row">
            <el-col :span="24">
              <el-slider v-model="filter.sepia" :max="100" :show-tooltip="false" />
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <span class="filter-title">灰度</span>
              <span class="filter-val">{{ filter.grayscale }}%</span>
            </el-col>
          </el-row>
          <el-row class="slider-row">
            <el-col :span="24">
              <el-slider v-model="filter.grayscale" :max="100" :show-tooltip="false" />
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <span class="filter-title">反相</span>
              <span class="filter-val">{{ filter.invert }}%</span>
            </el-col>
          </el-row>
          <el-row class="slider-row">
            <el-col :span="24">
              <el-slider v-model="filter.invert" :max="100" :show-tooltip="false" />
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <span class="filter-title">色相旋转</span>
              <span class="filter-val">{{ filter['hue-rotate'] }}deg</span>
            </el-col>
          </el-row>
          <el-row class="slider-row">
            <el-col :span="24">
              <el-slider v-model="filter['hue-rotate']" :max="360" :show-tooltip="false" />
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <span class="filter-title">模糊</span>
              <span class="filter-val">{{ filter.blur }}px</span>
            </el-col>
          </el-row>
          <el-row class="slider-row">
            <el-col :span="24">
              <el-slider v-model="filter.blur" :max="10" :show-tooltip="false" />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="16" style="text-align: center;">
          <el-row class="pre-set-panel">
            <ul class="gallery_items">
              <li v-for="item in filterTemplate" class="gallery_item">
                <div class="thumb" @click.stop="handleFilterClick(item.filter)">
                  <figure class="thumb_figure" :style="getStyle(item.filter)">
                    <img class="thumb_img" :src="img">
                  </figure>
                  <p class="thumb_label">{{ item.title }}</p>
                </div>
              </li>
            </ul>
          </el-row>
          <el-row style="min-height: 380px;display: flex;">
            <img :src="img" class="prettify-image" :style="getStyle(filter)">
          </el-row>
        </el-col>
      </el-row>
    </div>

    <div slot="footer" class="dialog-footer" style="margin: 5px 0 -1px">
      <el-button size="mini" @click="closeForm">
        取消
      </el-button>
      <el-button type="primary" size="mini" style="width:80px" @click="imgFilterSelected">
        确定
      </el-button>
    </div>
    <div />
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  directives: { elDragDialog },
  components: {
  },
  data() {
    return {
      formVisible: false, // 表示开关
      filterDefault: { // 默认滤镜
        contrast: 100, // 对比度
        brightness: 100, // 亮度
        saturate: 100, // 浸透
        sepia: 0, // 棕褐色
        grayscale: 0, // 灰度
        invert: 0, // 反相
        'hue-rotate': 0, // 色相旋转
        blur: 0 // 模糊
      },
      filter: {
      },
      filterTemplate: [
        {
          title: '清除滤镜',
          filter: {
            contrast: 100, // 对比度
            brightness: 100, // 亮度
            saturate: 100, // 浸透
            sepia: 0, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        }, {
          title: '灰阶',
          filter: {
            contrast: 100, // 对比度
            brightness: 100, // 亮度
            saturate: 100, // 浸透
            sepia: 0, // 棕褐色
            grayscale: 100, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: '反相',
          filter: {
            contrast: 100, // 对比度
            brightness: 100, // 亮度
            saturate: 100, // 浸透
            sepia: 0, // 棕褐色
            grayscale: 0, // 灰度
            invert: 100, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: '棕褐色',
          filter: {
            contrast: 100, // 对比度
            brightness: 100, // 亮度
            saturate: 100, // 浸透
            sepia: 100, // 棕褐色
            grayscale: 0, // 灰度
            invert: 100, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Aden',
          filter: {
            contrast: 90, // 对比度
            brightness: 120, // 亮度
            saturate: 85, // 浸透
            sepia: 0, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 20, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Amaro',
          filter: {
            contrast: 90, // 对比度
            brightness: 110, // 亮度
            saturate: 150, // 浸透
            sepia: 0, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Brannan',
          filter: {
            contrast: 140, // 对比度
            brightness: 100, // 亮度
            saturate: 100, // 浸透
            sepia: 50, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Brooklyn',
          filter: {
            contrast: 90, // 对比度
            brightness: 110, // 亮度
            saturate: 100, // 浸透
            sepia: 0, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Clarendon',
          filter: {
            contrast: 120, // 对比度
            brightness: 100, // 亮度
            saturate: 125, // 浸透
            sepia: 0, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Earlybird',
          filter: {
            contrast: 90, // 对比度
            brightness: 100, // 亮度
            saturate: 100, // 浸透
            sepia: 20, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Gingham',
          filter: {
            contrast: 100, // 对比度
            brightness: 105, // 亮度
            saturate: 100, // 浸透
            sepia: 0, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 350, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Hudson',
          filter: {
            contrast: 90, // 对比度
            brightness: 120, // 亮度
            saturate: 110, // 浸透
            sepia: 0, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: '反相',
          filter: {
            contrast: 100, // 对比度
            brightness: 100, // 亮度
            saturate: 100, // 浸透
            sepia: 0, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Inkwell',
          filter: {
            contrast: 110, // 对比度
            brightness: 110, // 亮度
            saturate: 100, // 浸透
            sepia: 30, // 棕褐色
            grayscale: 100, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Lofi',
          filter: {
            contrast: 150, // 对比度
            brightness: 100, // 亮度
            saturate: 110, // 浸透
            sepia: 0, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Maven',
          filter: {
            contrast: 95, // 对比度
            brightness: 95, // 亮度
            saturate: 150, // 浸透
            sepia: 25, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Reyes',
          filter: {
            contrast: 85, // 对比度
            brightness: 110, // 亮度
            saturate: 75, // 浸透
            sepia: 22, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Stinson',
          filter: {
            contrast: 75, // 对比度
            brightness: 115, // 亮度
            saturate: 85, // 浸透
            sepia: 0, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Toaster',
          filter: {
            contrast: 150, // 对比度
            brightness: 90, // 亮度
            saturate: 100, // 浸透
            sepia: 0, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Walden',
          filter: {
            contrast: 100, // 对比度
            brightness: 110, // 亮度
            saturate: 160, // 浸透
            sepia: 30, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 350, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Valencia',
          filter: {
            contrast: 108, // 对比度
            brightness: 108, // 亮度
            saturate: 100, // 浸透
            sepia: 8, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        },
        {
          title: 'Xpro2',
          filter: {
            contrast: 100, // 对比度
            brightness: 100, // 亮度
            saturate: 100, // 浸透
            sepia: 30, // 棕褐色
            grayscale: 0, // 灰度
            invert: 0, // 反相
            'hue-rotate': 0, // 色相旋转
            blur: 0 // 模糊
          }
        }
      ],
      img: ''
    }
  },
  computed: {
  },
  methods: {
    // 打开画面
    open(node) {
      this.filter = JSON.parse(JSON.stringify(this.filterDefault))
      this.img = node.attrs.src
      this.formVisible = true
    },
    // 关闭画面
    closeForm() {
      this.formVisible = false
    },
    // 获取滤镜值
    getFilterStr(filter) {
      // sepia(20%) brightness(100%) contrast(90%) saturate(100%) grayscale(0%) invert(0%) hue-rotate(0deg) blur(0px
      let filterStr = 'sepia(' + filter.sepia + '%)'
      filterStr += ' brightness(' + filter.brightness + '%)'
      filterStr += ' contrast(' + filter.contrast + '%)'
      filterStr += ' saturate(' + filter.saturate + '%)'
      filterStr += ' grayscale(' + filter.grayscale + '%)'
      filterStr += ' invert(' + filter.invert + '%)'
      filterStr += ' hue-rotate(' + filter.grayscale + 'deg)'
      filterStr += ' blur(' + filter.blur + 'px)'
      return filterStr
    },
    // 设置滤镜css style值
    getStyle(filter) {
      const s = {}
      s['filter'] = this.getFilterStr(filter)
      return s
    },
    // 滤镜点击事件
    handleFilterClick(filter) {
      // 记录滤镜值
      this.filter = JSON.parse(JSON.stringify(filter))
    },
    // 图片滤镜选择处理
    imgFilterSelected() {
      // imgFilterSelected
      // 触发事件
      this.$emit('imgFilterSelected', this.getFilterStr(this.filter))
      // 关闭画面
      this.formVisible = false
    }
  }
}
</script>

<style scoped>
  .prettify-image{
    max-width: 700px;
    align-self: center;
    margin: 0 auto;
  }
.filter-title{
  position: absolute;
  bottom: 0;
}

.filter-val{
  float: right;
  background-color: #808080;
  color: #fff;
  padding: 5px 6px;
  font-size: .9em;
}
  .slider-row{
    margin-top: -10px;
    margin-bottom: -6px;
  }

  .gallery_items{
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: justify;
    justify-content: space-between;
    list-style-type: none;
    width: 100%;
    overflow: auto;
    padding: 5px 0;
  }
  .gallery_item{
    display: inline-block;
    margin: 0 5px;
  }
.thumb{
  border: 1px solid #35373a;
  border-radius: 2px;
  cursor: pointer;
  overflow: hidden;
  padding-bottom: 0;
}
.thumb:hover{
  border: 1px solid #409eff;
  box-shadow: #409eff 0px 0px 10px inset;
}
.thumb_figure{
  position: relative;
  margin: 0;
}
.thumb_img{
height: 70px;
}
  .thumb_label{
    color: #7e8792;
    font-size: 14px;
    line-height: 1.5;
    text-align: center;
    margin: 0;
  }
</style>
