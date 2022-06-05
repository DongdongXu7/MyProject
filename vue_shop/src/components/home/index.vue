<template>
    <el-container class="home_container">
      <el-header>
          <div class="header_main">
              <img src="../../assets/img/zhongli.webp" >
              <span>XXX后台管理系统</span>
          </div>
          <el-button type="info" @click="backlogin"> 退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="meta ? '64px': '200px' ">
            <div :class="meta ? 'el-icon-turn-off toggle-button':'el-icon-open toggle-button'" @click="toggleCollapse"></div>
            <Aside :menus='menuList' :meta='meta'/>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
      <el-footer>Footer</el-footer>
    </el-container>
</template>

<script>
import Aside from './Aside'
export default {
  name: 'home',
  data() {
    return {
      menuList: [],
      meta: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    backlogin() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleCollapse() {
      this.meta = !this.meta
    }
  },
  components: {
    Aside
  }
};
</script>

<style lang="less" scoped>
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header_main{
    height: 100%;
    display: flex;
    img{
        height: 80%;
        border-radius: 50%;
        float: left;
        align-self: center;
    }
    span{
        align-self: center;
        margin: 0 20px ;
        font-size: 24px;
        color: #eaedf1;
    }
    }
}
.el-aside{
    background-color: #333744;
    .toggle-button{
      display: flex;
      justify-content: center;
      background-color: #4A5064;
      line-height: 24px;
      color: #fff;
    }
}
.el-main{
    background-color: #eaedf1;
}
.el-footer{
    background-color: #333744;
}
.home_container{
    height: 100%;
}
</style>
