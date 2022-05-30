<template>
  <div>
    <el-button type="info" @click="backlogin"> 退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    backlogin() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    }
  }
};
</script>

<style>
</style>
