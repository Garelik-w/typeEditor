<template>
  <el-dialog
    v-el-drag-dialog
    :title="title"
    :visible.sync="formVisible"
    width="700px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    append-to-body
    :before-close="closeCallback()"
  >
    <div class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="手机"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

        <div class="tips">
          <router-link target="_blank" :to="{path:'/register'}" style="margin-right:20px;">没有账号？注册一个</router-link>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  directives: { elDragDialog },
  components: {
  },
  data() {
    return {
      formVisible: false,
      title: '登录',
      logintype: 0,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    ...mapGetters([
      'userid',
      'usertype'
    ])
  },
  methods: {
    // 打开登录对话框
    open(typecode) {
      this.formVisible = true
      if (typecode === '1') {
        this.title = '请登录管理员账号'
        this.logintype = 1
      }
    },
    // 显示密码
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 关闭登录窗口前的回调(如果用户没有登录成功，则再次打开本窗口，以达到强制登录的目的)
    closeCallback: function() {
      if (this.logintype === 1) {
        if (!this.usertype || this.usertype !== '1') {
          this.formVisible = true
        } else {
          this.formVisible = false
        }
      }
    },
    // 登录处理
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // 登录
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            // 获取用户信息
            this.$store.dispatch('user/getInfo').then((response) => {
              this.loading = false
              // logintype === 1 为需要管理员登录
              if (this.logintype === 1 && this.usertype !== '1') {
                this.$message({
                  message: '请登录管理员',
                  type: 'warning'
                })
              } else {
                this.formVisible = false
              }
            }).catch(() => {
              this.loading = false
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
  </style>

  <style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 80px 35px 50px 35px;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }

      a:hover{
        color: #3a8ee6;
        text-decoration:underline;
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
