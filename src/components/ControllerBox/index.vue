<template>
  <div class="ts-controller-box">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>组件：</span>
      </div>
      <div style="">
        <draggable
          class="dragArea controller-group"
          :list="list1"
          :group="{ name: 'ts-cont', pull: 'clone', put: false }"
          :sort="false"
          @clone="onClone"
        >
          <div
            v-for="element in list1"
            :key="element.id"
            class="controller-item"
          >
            <svg-icon :icon-class="'ctl-'+element.type" style="font-size: 1.5em;" />

            <span>{{ element.text }}</span>
          </div>
        </draggable>
      </div>
    </el-card>

  </div>
</template>

<script>
import draggable from 'vuedraggable'
import placeholder from '@/assets/imgs/placeholder.jpg'
export default {
  components: {
    draggable
  },
  props: {
  },
  data() {
    return {
      dialogVisible: false,
      list1: [
        {
          id: 'tpl_layout',
          type: 'row',
          text: '布局',
          attrs: {
          },
          children: [
            {
              id: 'temp_cell',
              type: 'cell',
              attrs: {
                width: 100,
                widthType: '%'
              },
              children: []
            }
          ]
        },
        {
          id: 'tpl_text',
          type: 'text',
          text: '文本',
          attrs: {
            text: '文本'
          }
        },
        {
          id: 'tpl_img',
          type: 'img',
          text: '图片',
          attrs: {
            src: placeholder
          }
        },
        {
          id: 'tpl_shape',
          type: 'shape',
          text: '形状',
          attrs: {
          }
        }
      ]
    }
  },
  computed: {
  },
  created() {
    this.root = this.$parent.$refs.root
  },
  methods: {
    showCode() {
      this.dialogVisible = true
    }, onClone: function(evt) {
      const origEl = evt.item
      const cloneEl = evt.clone
    }
  }
}
</script>
<style lang="scss" scoped>
  .controller-group {

    & .controller-item{
     margin-top: 15px;
    }
    & .controller-item:first-child{
      margin-top: 0;
    }
  }
</style>

