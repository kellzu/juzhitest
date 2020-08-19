<template>
  <div>
    <el-card shadow="never">
      <div slot="header">
        <span class="font-title-medium">
          <div v-if="isCreate">创建厂商地址</div>
          <div v-else>修改厂商地址</div>
        </span>
      </div>
      <div>
        <el-form
          label-width="150px"
          :rules="rules"
          class="demo-ruleForm"
          ref="factoryAddressForm"
          :model="factoryAddressDetail"
          size="small"
        >
          <el-form-item prop="contactName" label="地址联系人">
            <el-input
              class="input-width"
              v-model="factoryAddressDetail.contactName"
              placeholder="请输入地址联系人联系人"
            ></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="地址联系电话">
            <el-input
              v-model="factoryAddressDetail.phone"
              class="input-width"
              placeholder="请输入地址联系电话"
            ></el-input>
          </el-form-item>
          <el-form-item prop="province" label="省份">
            <el-input
              v-model="factoryAddressDetail.province"
              class="input-width"
              placeholder="请输入省份"
            ></el-input>
          </el-form-item>
          <el-form-item prop="city" label="城市">
            <el-input v-model="factoryAddressDetail.city" class="input-width" placeholder="请输入城市"></el-input>
          </el-form-item>
          <el-form-item prop="region" label="地区">
            <el-input v-model="factoryAddressDetail.region" class="input-width" placeholder="请输入地区"></el-input>
          </el-form-item>
          <el-form-item prop="detailAddress" label="详细地址">
            <el-input
              v-model="factoryAddressDetail.detailAddress"
              class="input-width"
              placeholder="请输入详细地址"
            ></el-input>
          </el-form-item>
          <el-form-item prop="postcode" label="邮编">
            <el-input
              v-model="factoryAddressDetail.postcode"
              class="input-width"
              placeholder="请输入邮编"
            ></el-input>
          </el-form-item>
          <el-form-item prop="status" label="状态">
            <el-radio v-model="factoryAddressDetail.status" label="normal">正常</el-radio>
            <el-radio v-model="factoryAddressDetail.status" label="freeze">冻结</el-radio>
          </el-form-item>
          <el-form-item prop="remark" label="备注">
            <el-input class="input-width" v-model="factoryAddressDetail.remark" placeholder="备注"></el-input>
          </el-form-item>
          <el-form-item>
            <span v-if="!isCreate">
              <el-button type="primary" @click="updatefactoryBtn()">修改</el-button>
            </span>
            <span v-else>
              <el-button type="primary" @click="createFactoryBtn()">添加</el-button>
            </span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { createFactoryAddress } from "@/api/factoryAddress";
var defaultfactoryAddressDetail = {
  city: null,
  contactName: null,
  detailAddress: null,
  factoryId: null,
  phone: null,
  postcode: null,
  province: null,
  region: null,
  remark: null,
  status: "normal"
};
export default {
  props: ["detail", "factoryId"],
  data() {
    const validaterBase = function(rule, value, callback) {
      if (value == null || value.length < 3) {
        callback(new Error("输入的格式错误，不能少于3个字符"));
      } else {
        callback();
      }
    };
    return {
      title: "创建",
      factoryAddressDetail: Object.assign({}, this.defaultfactoryAddressDetail, this.detail),
      rules: {
        city: [{ required: true, trigger: "blur", validator: validaterBase }],
        contactName: [
          { required: true, trigger: "blur", validator: validaterBase }
        ],
        detailAddress: [
          { required: true, trigger: "blur", validator: validaterBase }
        ],
        factoryId: [
          { required: true, trigger: "blur", validator: validaterBase }
        ],
        phone: [{ required: true, trigger: "blur", validator: validaterBase }],
        postcode: [
          { required: true, trigger: "blur", validator: validaterBase }
        ],
        province: [
          { required: true, trigger: "blur", validator: validaterBase }
        ],
        region: [{ required: true, trigger: "blur", validator: validaterBase }],
        remark: [{ required: true, trigger: "blur", validator: validaterBase }],
        status: [{ required: true, trigger: "blur", validator: validaterBase }]
      },
      isCreate: true
    };
  },
  watch: {
    "detail.id": function(newVal, oldVal) {
      if (this.detail.id) {
        this.isCreate = false;
        this.factoryAddressDetail = this.detail;
      } else {
        this.isCreate = true;
        this.factoryAddressDetail = Object.assign(
          {},
          this.defaultfactoryAddressDetail
        );
      }
    }
  },
  methods: {
    updatefactoryBtn() {},
    change(e) {},
    createFactoryBtn() {
      this.$refs.factoryAddressForm.validate(vaild => {
        if (!vaild) {
          this.$message({
            message: "参数填写不正确",
            type: "error"
          });
          return false;
        }
        createFactoryAddress(this.factoryAddressDetail).then(response => {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.$confirm("添加成功，您可以继续添加", "提示", {
            confirmButtonText: "确认",
            type: "success"
          }).then(() => {
            this.reset();
          });
        });
      });
    },
    reset() {
      this.factoryAddressDetail = Object.assign(
        {},
        defaultfactoryAddressDetail
      );
    }
  },
  created() {
    this.factoryAddressDetail.factoryId = this.factoryId;
    if (this.detail.id) {
      this.factoryAddressDetail = this.detail;
    }
  },
  mounted() {}
};
</script>
<style scoped>
</style>