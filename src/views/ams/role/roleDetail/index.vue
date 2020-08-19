<template>
  <div class="app-container">
    <el-card class="form-container">
      <div slot="header" class="clearfix">
        <span>
          <a style="color:#909399">{{title}}</a>
        </span>
        <el-button @click="goBack" style="float: right; padding: 3px 0" type="text">返回</el-button>
      </div>
      <el-form :model="roleDetail" ref="roleDetail" label-width="150px" size="small">
        <el-form-item label="名称" class="input-width">
          <el-input v-model="roleDetail.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            :active-value="1"
            active-text="启用"
            :inactive-value="0"
            inactive-text="禁用"
            v-model="roleDetail.status"
          ></el-switch>
        </el-form-item>
        <el-form-item label="排序值" class="input-width">
          <el-input-number
            v-model="roleDetail.sort"
            :step="10"
            :min="0"
            :max="100"
            label="请输入角色排序值"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="说明" class="input-width">
          <el-input
            type="textarea"
            v-model="roleDetail.description"
            maxlength="100"
            placeholder="请输入说明"
            :autosize="{ minRows: 5, maxRows: 5}"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item>
          <span v-if="isUpdate==true">
            <el-button @click="updataRoleBtn" type="primary">修改</el-button>
          </span>
          <span v-else-if="isUpdate==false">
            <el-button @click="createRoleBtn" type="primary">添加</el-button>
            <el-button>重置</el-button>
          </span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { createRole, updataRole } from "@/api/role";
export default {
  name: "roleDetail",
  data() {
    return {
      isUpdate: false,
      roleDetail: {
        adminCount: 0,
        createTime: "",
        description: "",
        id: null,
        name: "",
        sort: 0,
        status: 0
      }
    };
  },
  computed: {
    title: function() {
      if (this.isUpdate) {
        return "修改角色";
      }
      if (!this.isUpdate) {
        return "添加角色";
      }
    }
  },
  created() {
    var roleDetail = this.$route.query.roleDetail;
    if (roleDetail != undefined) {
      this.roleDetail = roleDetail;
      this.isUpdate = true;
    } else {
      this.isUpdate = false;
    }
  },
  methods: {
    createRoleBtn() {
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        createRole(this.roleDetail).then(response => {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.$router.push({ path: "/role/roleList" });
        });
      });
    },
    updataRoleBtn() {
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        updataRole(this.roleDetail.id, this.roleDetail).then(response => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.$router.push({ path: "/role/roleList" });
        });
      });
    },
    goBack() {
      this.$router.back(-1);
    }
  }
};
</script>
<style>
</style>


