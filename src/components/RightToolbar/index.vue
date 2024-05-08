<template>
  <div class="ts-right-toolbar">
    <!--    <el-button @click="showCode"><i class="el-icon-notebook-2" />查看</el-button>-->
    <el-button :disabled="this.parent.undoList.length===0" @click="undo"><i class="el-icon-notebook-2" />撤销</el-button>
    <el-button :disabled="this.parent.redoList.length===0" @click="redo"><i class="el-icon-notebook-2" />重做</el-button>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >

      <rawDisplayer v-if="this.root" :value="this.root.data" style="max-height: 500px;overflow: auto;" title="List" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import rawDisplayer from '@/components/RawDisplayer'
export default {
  components: {
    // rawDisplayer
  },
  props: {
  },
  data() {
    return {
      dialogVisible: false,
      root: null,
      parent: null
    }
  },
  computed: {
  },
  created() {
    this.root = this.$parent.$refs.root
    this.parent = this.$parent
  },
  methods: {
    showCode() {
      this.dialogVisible = true
    }, undo() {
      this.parent.undo()
    }, redo() {
      this.parent.redo()
    }
  }
}
</script>

