<template>
  <div class="app-container">
    <el-card class="form-container">
      <div slot="header" class="clearfix">
        <span>
          <a style="color:#909399">{{title}}</a>
        </span>
        <el-button @click="goBack" style="float: right; padding: 3px 0" type="text">返回</el-button>
      </div>
      <el-form :model="factoryDetail" ref="factoryForm" label-width="150px" size="small">
        <el-form-item label="名称" class="input-width">
          <el-input v-model="factoryDetail.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="别名" class="input-width">
          <el-input v-model="factoryDetail.nickName" placeholder="请输入别名"></el-input>
        </el-form-item>
        <el-form-item label="法人" class="input-width">
          <el-input v-model="factoryDetail.owner" placeholder="请输入法人姓名"></el-input>
        </el-form-item>
        <el-form-item label="法人性别" class="input-width">
          <template>
            <el-radio v-model="factoryDetail.ownerSex" label="1">男</el-radio>
            <el-radio v-model="factoryDetail.ownerSex" label="2">女</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="法人电话" class="input-width">
          <el-input v-model="factoryDetail.ownerPhone" placeholder="请输入法人电话"></el-input>
        </el-form-item>
        <el-form-item label="公司官网" class="input-width">
          <el-input v-model="factoryDetail.portalWebsite" placeholder="请输入公司官网"></el-input>
        </el-form-item>
        <el-form-item label="公司商铺地址" class="input-width">
          <el-input v-model="factoryDetail.shopWebsite" placeholder="请输入公司商铺地址"></el-input>
        </el-form-item>
        <el-form-item label="公司电话" class="input-width">
          <el-input v-model="factoryDetail.phone" placeholder="请输入公司电话"></el-input>
        </el-form-item>
        <el-form-item label="公司传真" class="input-width">
          <el-input v-model="factoryDetail.fax" placeholder="请输入公司传真"></el-input>
        </el-form-item>
        <el-form-item label="公司图片">
          <single-upload v-model="factoryDetail.picturePath"></single-upload>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            active-value="normal"
            active-text="启用"
            inactive-value="freeze"
            inactive-text="禁用"
            v-model="factoryDetail.status"
          ></el-switch>
        </el-form-item>
        <el-form-item label="说明" class="input-width">
          <el-input
            type="textarea"
            v-model="factoryDetail.remark"
            maxlength="100"
            placeholder="请输入说明"
            :autosize="{ minRows: 5, maxRows: 5}"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item>
          <span v-if="isUpdata==true">
            <el-button @click="updataFactoryBtn" type="primary">修改</el-button>
          </span>
          <span v-else-if="isUpdata==false">
            <el-button @click="createFactoryBtn" type="primary">添加</el-button>
            <el-button>重置</el-button>
          </span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import SingleUpload from "@/components/Upload/singleUpload";
import { createFactory, updateFactory } from "@/api/factory";
export default {
  name: "factoryDetail",
  components: { SingleUpload },
  data() {
    return {
      picture: null,
      fileList: [],
      radio: 1,
      title: "添加厂商信息",
      isUpdata: false,
      factoryDetail: {
        accendantName: null,
        controlLevel: null,
        createName: null,
        accendantId: null,
        fax: null,
        level: null,
        name: null,
        nickName: null,
        owner: null,
        ownerPhone: null,
        ownerSex: null,
        phone: null,
        picturePath: null,
        portalWebsite: null,
        remark: null,
        shopWebsite: null,
        spellName: null,
        status: 'normal'
      }
    };
  },
  created() {
    let fac = this.$route.query.code;
    if (fac != undefined) {
      this.title = this.$route.query.msg;
      this.factoryDetail = this.$route.query.factoryDetail;
      this.isUpdata = true;
      this.title = "修改厂商信息";
    } else {
      console.log("create factory");
    }
  },
  methods: {
    updataFactoryBtn() {
        this.$confirm("确认修改?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        updateFactory(this.factoryDetail.id,this.factoryDetail).then(response => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.$router.back(-1);
        });
      });
      //todo
    },
    createFactoryBtn() {
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        createFactory(this.factoryDetail).then(response => {
          this.$message({
            message: "创建成功",
            type: "success"
          });
          this.$router.back(-1);
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
.button {
  display: flex;
  flex-flow: nowrap;
  justify-content: space-between;
}
</style>