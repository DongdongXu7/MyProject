<template>
    <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" class='menustyle' unique-opened :collapse='meta' :collapse-transition='false' :router="true" :default-active='activePath'>
      <!-- 一级菜单 -->
      <el-submenu v-for="item in menus" :key="item.id" :index="'/'+ item.path">
        <!-- 一级菜单的模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="'/'+subItem.path" @click="saveNavindex('/'+subItem.path)">
          <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
</template>

<script>
export default {
  name: 'Aside',
  props: ['menus', 'meta'],
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      activePath: ''
    }
  },
  methods: {
    saveNavindex(str) {
      window.sessionStorage.setItem('activePath', str)
      this.activePath = str
    }
  }
};
</script>

<style lang="less" scoped>
.el-menu{
  border-right: none;
}
.iconfont{
  padding-right: 10px;
}
</style>
