<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="RolerDialog = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="RoleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="{row}">
              <el-row :class="['bdbottom', index === 0 && 'bdtop','vcenter']" v-for="(item1,index) in row.children" :key="item1.id">
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag type="primary" effect="dark" closable @close="removeRightById(row, item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级三级权限 -->
                <el-col :span="19">
                  <el-row :class="[index2 !== 0 && 'bdtop','vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id">
                    <!-- 二级权限 -->
                    <el-col :span="6">
                      <el-tag type="success" effect="dark" closable @close="removeRightById(row, item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级权限 -->
                    <el-col :span="18">
                      <el-tag v-for="(item3) in item2.children" :key="item3.id" effect="dark" closable @close="removeRightById(row, item3.id)">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" class="el-icon-edit" size="mini" @click="editRoler(row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" class="el-icon-delete" size="mini" @click="RolerDelete(row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="info" class="el-icon-setting" size="mini" @click="showRightDialog(row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分配权限" :visible.sync="RightDialog" width="50%" center @close="CloseRightDialog">
      <el-tree
        :data="RoleTree"
        show-checkbox
        node-key="id"
        :default-checked-keys="defkeys"
        :default-expand-all="true"
        :props="treeProps"
        ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RightDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加角色" :visible.sync="RolerDialog" @close="RolerDialogClosed">
      <el-form :model="addRolerInfo" :rules="addRolerInfoRule" ref="addRolerInfoRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolerInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolerInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RolerDialog = false">取 消</el-button>
        <el-button type="primary"  @click="addRoler">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑角色" :visible.sync="EditRolerDialog" @close="EidtRolerDialogClosed">
      <el-form :model="editRolerInfo" :rules="editRolerInfoRule" ref="editRolerInfoRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolerInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolerInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditRolerDialog = false">取 消</el-button>
        <el-button type="primary"  @click="saveEditRoler">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'roles',
  data() {
    return {
      RoleList: [],
      RightDialog: false,
      RoleTree: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值数组
      defkeys: [],
      roleid: '',
      // 管理添加用户信息对话框的开闭
      RolerDialog: false,
      // 添加角色信息
      addRolerInfo: {
        roleName: '',
        roleDesc: ''
      },
      // 添加用户信息中角色名称的规则
      addRolerInfoRule: {
        roleName: [{ required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, message: '长度不小于1个字符', trigger: 'blur' }]
      },
      // 管理编辑用户信息对话框的开闭
      EditRolerDialog: false,
      // 编辑用户的信息
      editRolerInfo: {},
      // 添加用户信息中角色名称的规则
      editRolerInfoRule: {
        roleName: [{ required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, message: '长度不小于1个字符', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRoleLists()
  },
  methods: {
    // 获取权限人员信息
    async getRoleLists() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.RoleList = res.data
    },
    // 删除人物权限
    async removeRightById(role, rightid) {
      const Removeresult = await this.$confirm('此操作永久删除该权限,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (Removeresult !== 'confirm') return this.$message.info('取消了删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      role.children = res.data
      this.$message.success('删除权限成功')
    },
    // 展示分配权限的对话框
    async showRightDialog(row) {
      this.roleid = row.id
      this.RightDialog = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限对话框信息失败！')
      this.RoleTree = res.data
      this.getLeafkeys(row, this.defkeys)
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defkeys中
    getLeafkeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(element => {
        this.getLeafkeys(element, arr)
      })
    },
    CloseRightDialog() {
      this.defkeys = []
    },
    async allotRights() {
      this.RightDialog = false
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleid}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功')
      this.getRoleLists()
    },
    // 添加角色
    addRoler() {
      this.$refs.addRolerInfoRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRolerInfo)
        if (res.meta.status !== 201) return this.$message.error('创建角色失败！')
        this.$message.success('创建角色成功！')
        this.getRoleLists()
      })
      this.RolerDialog = false
    },
    // 管理添加角色的对话框的关闭时内容的清空
    RolerDialogClosed() {
      this.addRolerInfo.roleName = ''
      this.addRolerInfo.roleDesc = ''
    },
    // 删除角色
    async RolerDelete(row) {
      const deleteResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (deleteResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.delete(`roles/${row.id}`)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
      this.$message.success('删除角色成功！')
      this.getRoleLists()
    },
    // 编辑角色
    async editRoler(row) {
      this.EditRolerDialog = true
      const { data: res } = await this.$http.get('roles/' + row.id)
      if (res.meta.status !== 200) return this.$message.error('获取编辑角色信息失败')
      this.editRolerInfo = res.data
    },
    // 保存编辑角色
    async saveEditRoler() {
      this.$refs.editRolerInfoRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editRolerInfo.roleId, { roleName: this.editRolerInfo.roleName, roleDesc: this.editRolerInfo.roleDesc })
        if (res.meta.status !== 200) return this.$message.error('更新角色信息失败')
        this.$message.success('更新角色信息成功')
        this.getRoleLists()
        this.EditRolerDialog = false
      })
    },
    EidtRolerDialogClosed() {
      this.$refs.editRolerInfoRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 10px;
}
.bdtop{
  border-top: 1px solid #ddd;
}
.bdbottom{
  border-bottom: 1px solid #ddd;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
