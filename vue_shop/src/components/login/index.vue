<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_img">
        <div class="avatar_box">
          <img src="../../assets/img/zhongli.webp" />
        </div>
        <div class="avatar_footer">后台管理系统</div>
      </div>
      <div class="ele_box">
        <el-form class="forms" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input
              placeholder="用户名"
              v-model="loginForm.username"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="密码"
              type="password"
              v-model="loginForm.password"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="upload">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
    // 这是登录表单的用户数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
      }
    };
  },
  methods: {
    reset () {
      this.$refs.loginFormRef.resetFields()
    },
    upload () {
      this.$refs.loginFormRef.validate(async v => {
        if (!v) return;
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败！');
        this.$message.success('登录成功！');
        // 将登录后后台发送的数据中的token存储到sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-image: url(./image/456536.jpg);
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
}
.login_box {
  width: 750px;
  height: 400px;
  background: rgba(250, 250, 250, 0.5);
  align-self: center;
  border-radius: 2%;
  box-shadow: 0 0 5px #222;
  display: flex;
}
.login_img {
  width: 420px;
  height: 100%;
  border-radius: 2%;
  text-align: center;
  position: relative;
  .avatar_box {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 1px solid #ddd;
    box-shadow: 0 0 10px #222;
    padding: 5px;
    position: absolute;
    left: 50%;
    top: 15%;
    transform: translate(-50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .avatar_footer {
    width: 300px;
    height: 30%;
    position: absolute;
    left: 50%;
    top: 60%;
    transform: translate(-50%);
    font-size: 26px;
    font-family: 宋体;
    font-weight: 700;
    letter-spacing: 10px;
  }
}
.ele_box {
  background: #424346;
  border-radius: 0 2% 2% 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .forms {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 10px;
    .btns {
      display: flex;
      justify-content: space-evenly;
    }
  }
}
</style>
