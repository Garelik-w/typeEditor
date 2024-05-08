<template>
<!-- <div v-html="node.attrs.text"></div>-->
  <Tinymce :node="node" :height="100" />
</template>

<script>

  import Tinymce from '@/components/Tinymce'
export default {
  components: {
    Tinymce
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

  }
}
</script>

