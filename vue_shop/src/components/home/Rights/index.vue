<template>
  <div>
      <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表展示 -->
    <el-card>
        <el-table :data="UserRightsInfo" border stripe height="700">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column label="权限名称" prop='authName' align="center"></el-table-column>
            <el-table-column label="路径" prop="path" align="center"></el-table-column>
            <el-table-column label="权限等级" align="center">
              <template slot-scope="scope">
                  <el-tag v-show="scope.row.level == 0" >一级</el-tag>
                  <el-tag v-show="scope.row.level == 1" type="success">二级</el-tag>
                  <el-tag v-show="scope.row.level == 2" type="warning">三级</el-tag>
              </template>
            </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'rights',
  created() {
    this.getRightsInfo()
  },
  data() {
    return {
      UserRightsInfo: null
    }
  },
  methods: {
    async getRightsInfo() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.UserRightsInfo = res.data
    }
  }
}
</script>

<style>
</style>
