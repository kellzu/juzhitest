<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on"
               :model="resetPasswordForm"
               :rules="resetPasswordRules"
               ref="resetPasswordForm"
               label-position="left">
        <div style="text-align: center">
          <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
        </div>
        <h2 class="login-title color-main">聚知管理系统重置密码</h2>
        <el-form-item label="用户名：" prop="username">
          <el-input name="username"
                    type="text"
                    v-model="resetPasswordForm.username"
                    autoComplete="on"
                    clearable
                    placeholder="请输入用户名, 例如：张三=>san.zhang">
          <span slot="prefix">
            <svg-icon icon-class="user" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input name="password"
                    :type="pwdType"
                    v-model="resetPasswordForm.password"
                    autoComplete="on"
                    placeholder="请输入密码">
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
            <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item label="请确认密码：" prop="rePassword">
          <el-input name="rePassword"
                    :type="rePwdType"
                    v-model="resetPasswordForm.rePassword"
                    autoComplete="on"
                    placeholder="请重复输入密码">
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
            <span slot="suffix" @click="showRePwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item v-show="false">
          <el-input v-model="resetPasswordForm.key" />
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button type="primary" style="right: 0;" :loading="loading" @click.native.prevent="handleResetPassword" size="medium">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout">
  </div>
</template>

<script>
  import {validateUsername as validateUsernameF, validateEmail as validateEmailF} from '@/utils/validate';
  import {resetPassword} from '@/api/resetPassword'
  import login_center_bg from '@/assets/images/login_center_bg.png';

  export default {
    name: 'resetPassword',
    data() {
      const validatePass = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('密码不能小于3位'))
        } else {
          callback()
        }
      };

      const validateRePass = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('密码不能小于3位'))
        } else if (value !== this.resetPasswordForm.password) {
          callback(new Error('两次密码不一致'));
        } else {
          callback();
        }
      };
      return {
        resetPasswordForm: {
          username: '',
          password: '',
          rePassword: '',
          key: '',
        },
        resetPasswordRules: {
          username: [{required: true, trigger: 'blur',}],
          password: [{required: true, trigger: 'blur', validator: validatePass}],
          rePassword: [{required: true, trigger: 'blur', validator: validateRePass}],
        },
        loading: false,
        pwdType: 'password',
        rePwdType: 'password',
        login_center_bg,
      }
    },
    created() {
      if (!this.$route.query.key) {
        this.$message({
          type: 'error',
          message: '链接错误，跳转到首页',
          duration: 3000,
        });
        this.$router.push({path: '/'});
      } else {
        this.resetPasswordForm.key = this.$route.query.key;
      }
    },
    methods: {
      showPwd() {
        this.pwdType = this.pwdType === 'password'? '': 'password';
      },
      showRePwd() {
        this.rePwdType = this.rePwdType === 'password'? '': 'password';
      },
      handleResetPassword() {
        this.$refs.resetPasswordForm.validate(valid => {
          if (valid) {
            this.loading = true;
            resetPassword(this.resetPasswordForm).then(resp => {
              this.$message({
                showClose: true,
                center: true,
                type: 'success',
                message: '重置成功',
                duration: 1000,
              });
              this.loading = false;
              this.$router.push('/login');
            }, (e) => {
              this.loading = false;
            });
          } else {
            this.$message( {
              type: 'error',
              message: '参数验证不合法!',
              duration: 3000,
            });
            this.loading = false;
            return false
          }
        })
      },
    }
  }
</script>

<style scoped>
  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    width: 500px;
    margin: 140px auto;
    border-top: 10px solid #409EFF;
  }

  .login-title {
    text-align: center;
  }

  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: 500px;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }
</style>
