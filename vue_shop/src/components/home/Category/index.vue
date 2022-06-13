<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 开片视图区域 -->
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        show-index
        :expand-type="false"
        border>
          <template slot="isok" slot-scope="{row}">
            <i class="el-icon-success" v-if="row.cat_deleted === false" style="color: lightgreen"></i>
            <i class="el-icon-edit" v-else style="color: red"></i>
          </template>
          <template slot="order" slot-scope="{row}">
              <el-tag type="primary" v-show="row.cat_level === 0">一级</el-tag>
              <el-tag type="success" v-show="row.cat_level === 1">二级</el-tag>
              <el-tag type="warning" v-show="row.cat_level === 2">三级</el-tag>
          </template>
          <template slot="opt" slot-scope="{row}">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                <el-button type="primary" class="el-icon-edit" size="mini" @click="editCate(row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" class="el-icon-delete" size="mini" @click="cateDelete(row)"></el-button>
              </el-tooltip>
          </template>
        </tree-table>
        <!-- 分页区 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </el-card>
    <!-- 添加分类表单 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialog" center width="40%" @close="addCateDialogClosed">
      <el-form :model="addCateForm" label-width="100px" :rules="addCateFormRule" ref="addCateFormRef">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类:">
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="{ expandTrigger: 'hover', checkStrictly: true, ...cascaderProps}"
              @change="handleChange"
              clearable></el-cascader>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialog = false">取 消</el-button>
        <el-button @click="addCate" type="primary" >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑分类" :visible.sync="editCateDialog" center width="40%" @close="editCateDialogClosed">
      <el-form :model="editCateForm" label-width="100px" :rules="editCateFormRule" ref="editCateFormRef">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类:">
            <el-cascader
              v-model="editselectedKeys"
              :options="parentCateList"
              disabled></el-cascader>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialog = false">取 消</el-button>
        <el-button @click="editCateSave" type="primary" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'category',
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      },
      {
        label: '排序',
        type: 'template',
        template: 'order'
      },
      {
        label: '操作',
        type: 'template',
        template: 'opt'
      }
      ],
      addCateDialog: false,
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认为一级分类
        cat_level: 0
      },
      addCateFormRule: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      editCateDialog: false,
      editCateForm: {},
      editCateFormRule: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      editselectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialog = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类数据失败')
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    handleChange() {
      // 如果selectedKeys数组中的length大于0,证明选中的父级分类
      // 反之就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败!')
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialog = false
      })
    },
    // 对话框的关闭清空内容
    addCateDialogClosed() {
      this.selectedKeys = []
      this.addCateForm = {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认为一级分类
        cat_level: 0
      }
    },
    // 删除对应的分类
    async cateDelete(row) {
      const deleteRes = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (deleteRes !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.delete('categories/' + row.cat_id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getCateList()
    },
    // 编辑分类
    async editCate(row) {
      this.editCateDialog = true
      const { data: res } = await this.$http.get('categories/' + row.cat_id)
      if (res.meta.status !== 200) return this.$message.error('获取分类失败')
      this.editCateForm = res.data
      this.getParentCateList()
    // 这边存在一个回显的问题待解决,在显示编辑分类的时候要将父级分类的内容也显示出来
    },
    // 保存修改后的分类
    editCateSave() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id, { cat_name: this.editCateForm.cat_name })
        if (res.meta.status !== 200) return this.$message.error('编辑修改失败!')
        this.$message.success('编辑修改成功!')
        this.getCateList()
        this.editCateDialog = false
        console.log(this.parentCateList)
      })
    },
    editCateDialogClosed() {
      this.editselectedKeys = []
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader{
    width: 100%;
}
</style>
