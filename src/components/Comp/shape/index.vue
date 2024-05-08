<template>
  <div :style="bodyStyle">
    shape
  </div>
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
    // css style设定
    bodyStyle() {
      const s = {}
      s['with'] = '100%'
      return s
    }
  }
}
</script>

