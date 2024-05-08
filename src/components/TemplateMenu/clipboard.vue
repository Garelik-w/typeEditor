<template>
  <div class="ts-comp-panel">

    <draggable
      class="dragArea list-group"
      :list="list"
      :group="{ name: 'ts-cont', pull: 'clone', put: false }"
      :sort="false"
    >
      <comp v-for="el in list" :data="el" :is-root="true" :is-preview="true" @templateSelect="templateSelect" />
    </draggable>
    <p class="info"> 复制内容到剪贴板，再点击或者拖动加回到编辑页面。<br>  剪贴板在页面刷新后会清空。 </p>
  </div>
</template>

<script>
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
    list: {
      type: Array,
      required: false,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false, // 加载中
      noMore: false // 是否还有更多
    }
  },
  computed: {
  },
  mounted() {

  },
  methods: {
    // 剪裁板中模板选中处理
    templateSelect(tmpl) {
      // 触发事件
      this.$emit('onClipboardSelect', tmpl)
    },
    // 获取随机新id
    getNewId() {
      return 'ts-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
    }
  }
}
</script>

