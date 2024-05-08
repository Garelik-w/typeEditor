<template>
  <div>
    <el-row>
      <el-col :span="18" style="position: relative;">
        <comp
          v-if="currentVal"
          :data="currentVal"
          :is-root="true"
          :is-article="true"
          :is-preview="true"
          :is-like="false"
          :is-del="false"
        />
        <span v-if="!currentVal">&nbsp;</span>
        <el-button v-if="currentVal" size="mini" type="danger" icon="el-icon-delete" style="margin-top: 10px;position: absolute;top: 0;right: 8px;" @click="delItem()" />
      </el-col>
      <el-col :span="6">
        <el-button size="mini" style="margin-top: 10px;" @click="openSelect()">
          选择
        </el-button>
      </el-col>
    </el-row>
    <templateSelect ref="templateSelect" :type="type" @templateSelect="templateSelect" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import comp from '@/components/Comp'
import templateSelect from '@/components/TemplateMenu/templateSelect'

export default {
  directives: { },
  components: {
    templateSelect,
    comp
  },
  props: {
    value: {
      type: Object,
      default: null
    },
    type: { // 模板类型
      required: false,
      type: String,
      default: null
    },
    kbn: { // 模板区分-留用
      required: false,
      type: String,
      default: null
    }
  },
  data() {
    return {
      formVisible: false, // 画面显示开关
      loading: false, // 加载中
      currentVal: this.value // 记录当前值
    }
  },
  watch: {
    // 监听值变化，反写v-mode值
    currentVal: {
      handler(newVal, oldVal) {
        this.$emit('input', newVal)
      },
      deep: true
    },
    // 监听值变化，记录当前值
    value: {
      handler(newVal, oldVal) {
        this.currentVal = newVal
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'userid'
    ])
  },
  methods: {
    // 打开模板选择
    openSelect() {
      this.$refs.templateSelect.open()
    },
    // 记录选中的模板
    templateSelect(selectedData) {
      this.currentVal = selectedData
    },
    // 删除
    delItem() {
      this.currentVal = null
    }
  }
}
</script>

