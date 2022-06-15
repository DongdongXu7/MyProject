<template>
  <el-dialog :title="'添加'+TitalName" :visible.sync="addDialogVisible" width="50%" @close="addDialogVisibleClosed">
    <el-form :model="addForm" :rules="addFormRule" ref="addFormRef" label-width="100px">
        <el-form-item :label="TitalName" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'Alldialog',
  props: ['activeName', 'cateId'],
  data() {
    return {
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      // 添加表单的验证规则
      addFormRule: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    TitalName() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  methods: {
    addDialogVisibleClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) return this.$message.error('添加参数失败!')
        this.$message.success('添加参数成功')
        // 调用自定义事件
        this.$emit('getParamsData')
        this.addDialogVisible = false
      })
    }
  }
}
</script>

<style>

</style>
