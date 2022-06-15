<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        show-icon
        title="注意:只允许为第三级分类设置相关参数!"
        :closable="false"
        type="warning"
      >
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="paramsProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="changeDia">添加参数</el-button>
            <el-table :data="manyTableData" border stripe>
                <el-table-column type="expand">
                  <template slot-scope="{row}">
                    <el-tag v-for="(item, index) in row.attr_vals" :key="index" closable @close="handleClose(i, row)">{{item}}</el-tag>
                    <el-input
                    class="input-new-tag"
                    v-if="row.inputVisible"
                    v-model="row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(row)"
                    @blur="handleInputConfirm(row)"></el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
                  </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="{row}">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                          <el-button type="primary" class="el-icon-edit" size="mini" @click="showEditDialog(row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                          <el-button type="danger" class="el-icon-delete" size="mini" @click="removeCate(row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="changeDia">添加属性</el-button>
            <el-table :data="onlyTableData" border stripe>
                <el-table-column type="expand">
                  <template slot-scope="{row}">
                    <el-tag v-for="(item, index) in row.attr_vals" :key="index" closable @close="handleClose(i, row)">{{item}}</el-tag>
                    <el-input
                    class="input-new-tag"
                    v-if="row.inputVisible"
                    v-model="row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(row)"
                    @blur="handleInputConfirm(row)"></el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
                  </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="{row}">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                          <el-button type="primary" class="el-icon-edit" size="mini" @click="showEditDialog(row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                          <el-button type="danger" class="el-icon-delete" size="mini" @click="removeCate(row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <Alldialog :activeName="activeName" :cateId='cateId' ref="allDiaRef" @getParamsData="getParamsData"/>
      </el-tabs>
    </el-card>
    <el-dialog :title="'修改'+titalName" :visible.sync="editDialogVisible" width="50%">
    <el-form :model="editForm" :rules="editFormRule" ref="editFormRef" label-width="100px">
        <el-form-item :label="titalName" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import Alldialog from './Alldialog'
export default {
  name: 'params',
  data() {
    return {
      cateList: [],
      selectedKeys: [],
      paramsProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 被激活的页签名称
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      editDialogVisible: false,
      // 修改的表单数据
      editForm: {},
      // 修改的表单数据的验证规则
      editFormRule: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败!')
      this.cateList = res.data;
    },
    // 级联选择框选中项变化,会触发这个函数
    async handleChange() {
      this.getParamsData()
    },
    // tab页签点击事件的处理函数
    handleTabClick() {
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.manyTableData = []
        this.onlyTableData = []
      }
      // 根据所选的分类id,和当前所处的面板,获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败!')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        item.inputValue = ''
      })
      // 进行数据判断
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    changeDia() {
      this.$refs.allDiaRef.addDialogVisible = true
    },
    async showEditDialog(row) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${row.attr_id}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) return this.$message.error('修改数据失败！')
        this.$message.success('修改数据成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    async removeCate(row) {
      const deleteRes = await this.$confirm(`此操作将永久删除该${this.titalName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (deleteRes !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${row.attr_id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getParamsData()
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获取焦点
      // $nextTick方法作用，就是当页面上的元素被重新渲染后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(',') })
      if (res.meta.status !== 200) return this.$message.error('修改参数项失败')
      this.$message.success('修改参属项成功')
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    titalName() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  components: {
    Alldialog
  }
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 15px;
}
.el-cascader {
  margin: 0 15px;
}
.el-tabs{
  margin: 0 15px;
}
.el-tag{
  margin: 0 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
