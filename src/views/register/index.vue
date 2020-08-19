<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on"
               :model="registerForm"
               :rules="registerRules"
               ref="registerForm"
               label-position="left">
        <div style="text-align: center">
          <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
        </div>
        <h2 class="login-title color-main">聚知后台管理系统</h2>
        <el-form-item label="头像：" prop="icon">
          <single-upload v-model="registerForm.icon"></single-upload>
        </el-form-item>
        <el-form-item label="用户名：" prop="username">
          <!--TODO 用户名有校验-->
          <el-input name="username"
                    type="text"
                    v-model="registerForm.username"
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
                    v-model="registerForm.password"
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
                    v-model="registerForm.rePassword"
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
        <el-form-item label="邮箱：" prop="email">
          <el-input name="email"
                    type="email"
                    v-model="registerForm.email"
                    autoComplete="on"
                    clearable
                    placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="中文名：" prop="note">
          <el-input name="note"
                    type="text"
                    clearable
                    v-model="registerForm.note"
                    autoComplete="on"
                    placeholder="请输入中文名" />
        </el-form-item>
        <el-form-item label="英文名：" prop="nickName">
          <el-input name="nickName"
                    type="text"
                    clearable
                    v-model="registerForm.nickName"
                    autoComplete="on"
                    placeholder="请输入英文名" />
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button type="primary" style="right: 0;" :loading="loading" @click.native.prevent="handleRegister" size="medium">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout">
  </div>
</template>

<script>
  import {isvalidUsername, validateUsername as validateUsernameF, validateEmail as validateEmailF, validateEnName, validateZhName} from '@/utils/validate';
  import {register,} from '@/api/register'
  import login_center_bg from '@/assets/images/login_center_bg.png';
  import SingleUpload from "@/components/Upload/singleUpload";
  import {getAdminIdNames} from '@/api/admin';

  export default {
    name: 'register',
    components: { SingleUpload },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validateUsernameF(value)) {
          callback(new Error('用户名不能有空格且长度不能小于5个字符'))
        } else {
          let params = new URLSearchParams();
          params.append('username', encodeURIComponent(value));
          getAdminIdNames(params).then(resp => {
            if (resp.data.length > 0) {
              callback(new Error('已存在此用户，建议添加数字或字母'));
            } else {
              callback();
            }
          });
        }
      };
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
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次密码不一致'));
        } else {
          callback();
        }
      };
      
      const validateEmail = (rule, value, callback) => {
        if (!validateEmailF(value)) {
          callback(new Error('请输入正确的邮箱地址，邮箱地址只能是英文字母、数字、下划线、英文句号、以及中划线组成!'))
        } else {
          callback();
        }
      };

      const validateNickName = (rule, value, callback) => {
        if (!validateEnName(value)) {
          callback(new Error('请输入正确的英文名,是英文字母组成，最长9位!'))
        } else {
          callback();
        }
      };

      const validateNote = (rule, value, callback) => {
        if (!validateZhName(value)) {
          callback(new Error('请输入正确的中文名!'))
        } else {
          callback();
        }
      };

      return {
        registerForm: {
          username: '',
          password: '',
          rePassword: '',
          icon: '',
          email: '',
          nickName: '',
          note: '',
        },
        registerRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePass}],
          rePassword: [{required: true, trigger: 'blur', validator: validateRePass}],
          icon: [{required: false, trigger: 'blur',},],
          email: [{required: true, trigger: 'blur', validator: validateEmail, }],
          note: [{required: true, trigger: 'blur', validator: validateNote, }],
          nickName: [{required: true, trigger: 'blur', validator: validateNickName, }],
        },
        loading: false,
        pwdType: 'password',
        rePwdType: 'password',
        login_center_bg,
      }
    },
    created() {
    },
    methods: {
      showPwd() {
        this.pwdType = this.pwdType === 'password'? '': 'password';
      },
      showRePwd() {
        this.rePwdType = this.rePwdType === 'password'? '': 'password';
      },
      handleRegister() {
        this.$refs.registerForm.validate(valid => {
          if (valid) {
            this.loading = true;
            register(this.registerForm).then(resp => {
              this.$message({
                showClose: true,
                center: true,
                type: 'success',
                message: '注册成功，请联系组长激活后使用',
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
    height: 780px;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }
</style>
