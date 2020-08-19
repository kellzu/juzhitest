<template>
  <div class="app-container">
    <el-card shadow="never" v-show="isShow">
      <div slot="header">父权限信息</div>
      <el-form :inline="true" size="small" class="demo-form-inline">
        <el-form-item label="父级权限名称">
          <el-input v-model="fatherPermissionName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="父级权限uri">
          <el-input v-model="fatherPermissionUri" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="父级权限">
          <el-input v-model="fatherPermissionValue" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="form-container" shadow="never">
      <div slot="header">
        {{title}}
        <el-button @click="goBack" style="float: right; padding: 3px 0" type="text">返回</el-button>
      </div>

      <el-form
        label-width="150px"
        :model="permiDetail"
        class="demo-ruleForm"
        ref="permiDetail"
        :rules="rules"
        size="small"
      >
        <el-form-item label="权限名：" prop="name">
          <el-input v-model="permiDetail.name" class="input-width" placeholder="请输入权限名"></el-input>
        </el-form-item>

        <el-form-item label="图标：" prop="icon">
          <SingleUpload v-model="permiDetail.icon"></SingleUpload>
        </el-form-item>

        <el-form-item label="权限值：" prop="value">
          <el-input v-model="permiDetail.value" class="input-width"></el-input>
        </el-form-item>

        <el-form-item label="权限uri：" prop="uri">
          <el-input v-model="permiDetail.uri" class="input-width"></el-input>
        </el-form-item>

        <el-form-item label="类型：" prop="type">
          <el-select v-model="permiDetail.type" placeholder="请选择">
            <el-option v-for="(v, k) in permistype" :key="v" :label="k" :value="v"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态：">
          <el-switch
            :active-value="1"
            active-text="开启"
            :inactive-value="0"
            inactive-text="关闭"
            v-model="permiDetail.status"
          ></el-switch>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input-number v-model="permiDetail.sort" :step="10" :min="0" :max="100" label="修改排序等级"></el-input-number>
        </el-form-item>
        <el-form-item>
          <span v-if="isUpdata">
            <el-button type="primary" @click="updatePermisBtn()">修改</el-button>
          </span>
          <span v-else>
            <el-button type="primary" @click="createPermis()">添加</el-button>
          </span>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { createpermission, updatePermission } from "@/api/permission";
import SingleUpload from "@/components/Upload/singleUpload";
export default {
  components: { SingleUpload },
  data() {
    const validatername = (rule, value, callback) => {
      if (value == null || value.length < 2) {
        callback(new Error("权限名不能小于2个字符"));
      } else {
        callback();
      }
    };
    const validdatevalue = (rule, value, callback) => {
      if (value == null || value.length < 5) {
        callback(new Error("权限值不能小于5个字符"));
      } else {
        callback();
      }
    };
    const validateuri = (rule, value, callback) => {
      var z = /^(\/)|(\/\w+(\/[0-9a-zA-Z.]+)*)$/;
      if (z.test(value)) {
        callback();
      } else {
        callback(new Error("uri 格式错误"));
      }
    };
    return {
      isShow: false,
      fatherPermissionName: "",
      fatherPermissionUri: "",
      fatherPermissionValue: "",
      title: null,
      permistype: {
        目录: 0,
        菜单: 1,
        按钮: 2
      },
      isUpdata: false,
      permiDetail: {
        createTime: null,
        icon: null,
        id: null,
        name: null,
        pid: 0,
        sort: 0,
        status: 1,
        type: 0,
        uri: null,
        value: null
      },
      fileList: [],
      rules: {
        name: [{ required: true, trigger: "blur", validator: validatername }],
        value: [{ required: true, trigger: "blur", validator: validdatevalue }],
        uri: [{ required: true, trigger: "blur", validator: validateuri }]
      }
    };
  },
  created() {
    var code = this.$route.query.code;
    this.title = this.$route.query.msg;
    if (code == 1) {
      this.isShow = false;
      this.isUpdata = true;
      this.permiDetail = this.$route.query.permi;
    } else if (code == 2) {
      this.fatherPermissionName = this.$route.query.permi.name;
      this.fatherPermissionUri = this.$route.query.permi.uri;
      this.fatherPermissionValue = this.$route.query.permi.value;
      this.permiDetail.pid = this.$route.query.permi.id;
      this.isShow = true;
      this.isUpdata = false;
    } else if (code == 0) {
      this.isShow = false;
      this.isUpdata = false;
    }
  },
  methods: {
    createPermis() {
      this.$refs.permiDetail.validate(vaild => {
        if (!vaild) {
          this.$message({
            message: "参数填写不正确",
            type: "error"
          });
          return false;
        }
        this.$confirm("是否要确认?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          createpermission(this.permiDetail).then(response => {
            this.$message({
              message: "创建成功",
              type: "success"
            });
            this.$router.back(-1);
          });
        });
      });
    },
    updatePermisBtn() {
      this.$refs.permiDetail.validate(vaild => {
        if (!vaild) {
          this.$message({
            message: "参数填写不正确",
            type: "error"
          });
          return false;
        }
        this.$confirm("是否要确认?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          updatePermission(this.permiDetail.id, this.permiDetail).then(
            response => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$router.back(-1);
            }
          );
        });
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    goBack() {
      this.$router.back(-1);
    }
  }
};
</script>

<style>
</style>