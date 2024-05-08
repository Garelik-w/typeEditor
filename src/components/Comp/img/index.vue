<template>
  <img :src="node.attrs.src" :style="bodyStyle()">
</template>

<script>

export default {
  components: {
  },
  props: {
    node: {
      type: Object,
      default: null
    }
  },
  computed: {
  },
  methods: {
    // 图片css style设定
    bodyStyle() {
      const s = {}
      s['width'] = '100%'

      // border(preset)
      if (this.node.attrs.border) {
        s['border'] = this.node.attrs.border
      }
      if (this.node.attrs['box_shadow']) {
        s['box-shadow'] = this.node.attrs['box_shadow']
      }
      if (this.node.attrs['border_radius']) {
        s['border-radius'] = this.node.attrs['border_radius']
      }
      if (this.node.attrs['border_color']) {
        s['border-color'] = this.node.attrs['border_color']
      }

      return s
    }
  }
}
</script>

