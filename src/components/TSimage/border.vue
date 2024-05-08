<template>
  <el-dialog v-el-drag-dialog title="图片边框" :visible.sync="formVisible" width="1000px" :close-on-click-modal="false" :modal-append-to-body="false" append-to-body>
    <div class="ts-img-border-select">
      <el-row>
        <el-col :span="2">
          <label style="line-height: 36px;vertical-align: text-bottom;">颜色：</label> <el-color-picker v-model="borderColor" size="mini" />
        </el-col>
        <el-col :span="22">
          <label style="line-height: 36px;vertical-align: text-bottom;float: left;">圆角：</label>
          <el-slider v-model="radius" show-input :max="100" style="float: left;width: 400px;margin-left: 10px;" />
          <el-select v-model="radiusType" placeholder="" style="width: 100px;margin-left: 10px;" size="medium">
            <el-option
              key="px"
              label="像素"
              value="px"
            />
            <el-option
              key="%"
              label="百分比"
              value="%"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row style="max-height: 410px;overflow: auto;">
        <el-col v-for="(item, index) in boderModel" :key="item.name" :span="6" style="padding: 6px;">
          <el-card shadow="always" :class="getCardClass(item)" @click.native="handleClick(item)">
            <p>{{ item.name }}</p>
            <img :src="imgSrc" class="image" :style="getBorderStype(item)">
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer" style="margin: 5px 0 -1px">
      <el-button size="mini" @click="closeForm">
        取消
      </el-button>
      <el-button type="primary" size="mini" @click="applyToAll()">
        应用到所有图片
      </el-button>
      <el-button type="primary" size="mini" @click="applyToThis()">
        应用到当前图片
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
      borderColor: null, // 边框颜色
      activeItem: null, // 激活中的边框类型数据
      radius: 0, // 圆角
      imgSrc: '', // 图片资源路径
      radiusType: 'px', // 圆角类型
      boderModel: [ // 边框类型下拉
        {
          name: '无边框',
          border: 'none'
        }, {
          name: '虚线边框',
          border: '2px dashed rgb(151, 152, 153)'
        }, {
          name: '点边框',
          border: '2px dotted rgb(151, 152, 153)'
        }, {
          name: '右下阴影',
          'box_shadow': 'rgba(151, 152, 153) 3.53553px 3.53553px 8px'
        }, {
          name: '左上阴影',
          'box_shadow': 'rgba(151, 152, 153) -0.2em -0.2em 0.8em'
        }, {
          name: '四周边框四周阴影',
          border: '1px solid rgb(151, 152, 153)',
          'box_shadow': 'rgba(151, 152, 153) 0px 0px 6px'
        }, {
          name: '四周边框右下阴影',
          border: '1px solid rgb(151, 152, 153)',
          'box_shadow': 'rgba(151, 152, 153) 2px 2px 5px'
        }, {
          name: '倒影',
          border: '1px solid rgb(151, 152, 153)',
          '_webkit_box_reflect': 'below 0px -webkit-gradient(linear, 0% 0%, 0% 100%, from(transparent), color-stop(0.7, transparent), to(rgba(250, 250, 250, 0.298)))'
        }, {
          name: '底部虚化',
          '_webkit_mask': '-webkit-gradient(linear, 0% 0%, 0% 100%, from(rgb(0, 0, 0)), to(rgba(0, 0, 0, 0)))'
        }, {
          name: '顶部虚化',
          '_webkit_mask': '-webkit-gradient(linear, 0% 100%, 0% 0%, from(rgb(0, 0, 0)), to(rgba(0, 0, 0, 0)))'
        }, {
          name: '右部虚化',
          '_webkit_mask': '-webkit-gradient(linear, 0% 0%, 100% 0%, from(rgb(0, 0, 0)), to(rgba(0, 0, 0, 0)))'
        }, {
          name: '左部虚化',
          '_webkit_mask': '-webkit-gradient(linear, 100% 0%, 0% 0%, from(rgb(0, 0, 0)), to(rgba(0, 0, 0, 0)))'
        }, {
          name: '内阴影',
          border: '1px solid rgb(151, 152, 153)',
          'box_shadow': 'rgb(151, 152, 153) 0px 0px 10px inset'
        }, {
          name: '外阴影',
          border: '1px solid rgb(151, 152, 153)',
          'box_shadow': 'rgb(151, 152, 153) 0px 0px 10px'
        }, {
          name: '实线边框',
          border: '3px solid rgb(151, 152, 153)'
        }, {
          name: '宽阴影',
          'box_shadow': 'rgb(151, 152, 153) 0px 0px 5px 5px'
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    // 打开画面
    open(node) {
      this.imgSrc = node.attrs.src
      if (this.activeItem) {
        this.activeItem.isActive = false
        this.activeItem = null
      }
      this.formVisible = true
    },
    // 获取边框数据
    getBorderStype(item) {
      const s = {
        'padding': '5px'
      }
      s['border'] = item.border

      if (this.borderColor) {
        if (s['border']) {
          s['border'] = s['border'].replace('rgb(151, 152, 153)', this.borderColor)
        }
      }

      s['box-shadow'] = item['box_shadow']
      if (!this.radius) {
        s['border-radius'] = '0'
      } else {
        s['border-radius'] = this.radius + this.radiusType
      }
      s['-webkit-box-reflect'] = item['_webkit_box_reflect']
      s['-webkit-mask'] = item['_webkit_mask']

      return s
    },
    // 获取卡片class
    getCardClass(item) {
      return {
        'active': item.isActive
      }
    },
    // 卡片点击事件
    handleClick(itme) {
      this.boderModel.forEach((i) => {
        if (i.isActive) {
          this.$set(i, 'isActive', false)
        }
      })
      this.$set(itme, 'isActive', true)
      this.activeItem = itme
    },
    // 获取选中的边框项目
    getSelectedItem() {
      if (this.activeItem) {
        const selected = JSON.parse(JSON.stringify(this.activeItem))

        if (this.radius) {
          // 圆角
          selected['border_radius'] = this.radius + this.radiusType
        }
        if (this.borderColor) {
          if (selected['border']) {
            // 边框颜色
            selected['border'] = selected['border'].replace('rgb(151, 152, 153)', this.borderColor)
          }
        }

        return selected
      }
    },
    // 应用到当前图片
    applyToThis() {
      const selected = this.getSelectedItem()
      if (selected) {
        this.$emit('imgBorderSelected', { type: 'this', border: selected })
        this.formVisible = false
      } else {
        this.$message({
          message: '请边框类型',
          type: 'warning'
        })
      }
    },
    // 应用到所有图片
    applyToAll() {
      const selected = this.getSelectedItem()
      if (selected) {
        this.$emit('imgBorderSelected', { type: 'all', border: selected })
        this.formVisible = false
      }
    },
    // 关闭画面
    closeForm() {
      this.formVisible = false
    }
  }
}
</script>

<style lang="scss">
  .ts-img-border-select .el-card__body p{
    margin: 5px 0;
  }

  .ts-img-border-select .el-card__body img{
    max-height: 140px;
  }
  .ts-img-border-select .el-card__body{
    text-align: center;
    padding: 10px;
  }

  .ts-img-border-select .el-card.active{
    border: 1px solid #409eff;
    box-shadow: #409eff 0px 0px 10px inset;
  }
  .ts-img-border-select .el-card:hover{
    background-color: #d6e3f1;
  }
</style>
