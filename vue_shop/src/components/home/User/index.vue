<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
          <el-col :span='8'>
            <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getUserInfo">
              <el-button slot="append" icon="el-icon-search" @click="getUserInfo"></el-button>
            </el-input>
          </el-col>
          <el-col :span='4'>
              <el-button type="primary" @click="addDialogVisible=!addDialogVisible">添加用户</el-button>
          </el-col>
      </el-row>

      <!--用户列表区域 -->
      <el-table :data="users" border stripe>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="用户名称" prop="username"></el-table-column>
        <el-table-column label="角色名称" prop="role_name"></el-table-column>
        <el-table-column label="电子邮件" prop="email"></el-table-column>
        <el-table-column label="联系方式" prop="mobile"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStatechange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top-start" :enterable="false">
              <el-button type="info" class="el-icon-edit" size="mini" @click="EditInfo(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top-start" :enterable="false" >
              <el-button type="danger" class="el-icon-delete" size="mini" @click="DelectUser(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip  effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="primary" class="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible"  center @close="closeDialog">
      <el-form :model='addForm' :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username" ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="用户手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="EditDialogVisible"  center @close="closeEditDialog">
      <el-form :model='EditUserInfo' :rules="editFormRules" ref="EditFormRef" label-width="100px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="EditUserInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="EditUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="用户手机" prop="mobile">
          <el-input v-model="EditUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="EditUser">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'user',
  data() {
    // 验证邮箱
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if(regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[3-9][0-9]{9}/
      if(regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 用来获取用户列表并在页面中展示
      users: [],
      // 分页器中信息的总数
      total: 0,
      // 添加用户的表单显示判断标识
      addDialogVisible: false,
      // 添加新用户的信息收集
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加新用户使用的校验规则
      addFormRules: {
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2到10个字符之间', trigger: 'blur' }],
        password: [{ required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }],
        email: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入用户手机号', trigger: 'blur' },
          {validator: checkMobile, trigger: 'blur' }]
      },
      // 编辑页面的展示标识
      EditDialogVisible: false,
      // 编辑用户信息
      EditUserInfo: {},
      editFormRules: {
        email: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入用户手机号', trigger: 'blur' },
          {validator: checkMobile, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    // 获取用户数据列表
    async getUserInfo() {
      const { data: res } = await this.$http.get('users', { params: this.queryinfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.users = res.data.users
      this.total = res.data.total
    },
    // 改变展示内容的数量；分页器功能
    handleSizeChange(val) {
      this.queryinfo.pagesize = val
      this.getUserInfo()
    },
    // 改变当前页数；分页器功能
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val
      this.getUserInfo()
    },
    // 用户状态修改功能
    async userStatechange(row) {
      const { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      if (res.meta.status !== 200) {
        this.users.mg_state = !this.users.mg_state
        return this.$message.error('更新失败！')
      }
      this.$message.success(res.meta.msg)
    },
    // 用户对话框关闭清空对话框
    closeDialog() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate( async valid => {
        if(!valid) return 
        //可添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if(res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getUserInfo()
       } )
    },
    // 修改用户操作
    /* EditInfo(row) {
      this.EditDialogVisible = true
      this.EditUserInfo = row
    }, */
    async EditInfo(id) {
      const { data: res } = await this.$http.get('users/'+id)
      if(res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.EditUserInfo = res.data
      this.EditDialogVisible = true
    },
    // 保存修改后用户信息
    async EditUser(){
      this.$refs.EditFormRef.validate(async valid =>{
        if(!valid) return
        this.EditDialogVisible = false
        const { data: res} = await this.$http.put('users/'+this.EditUserInfo.id, { email: this.EditUserInfo.email, mobile: this.EditUserInfo.mobile})
        if(res.meta.status !==200) return this.$message.error('更新用户信息失败')
        this.getUserInfo()
        this.$message.success('更新用户信息成功')
      })
      
    },
    // 关闭弹框对之前内容重置
    closeEditDialog() {
      this.$refs.EditFormRef.resetFields()
    },
    // 删除用户
    async DelectUser(row) {
      const { id } = row
      const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if( res !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const rest= await this.$http.delete('users/' + id)
      if(rest.status !== 200) return this.$message.error('用户删除失败，请重新尝试')
      this.$message.success('删除用户成功')
      this.getUserInfo()
    }
  }
};
</script>

<style lang='less' scoped>
</style>
