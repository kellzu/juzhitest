<template>
  <div>
    <el-card shadow="never">
      <div slot="header">
        <span class="font-title-medium">
          <div v-if="isCreate">添加联系人</div>
          <div v-else>修改联系人</div>
        </span>
      </div>
      <div>
        <el-form
          label-width="150px"
          :rules="rules"
          class="demo-ruleForm"
          ref="factoryContactForm"
          :model="factoryContactDetail"
          size="small"
        >
          <el-form-item prop="contactName" label="联系人姓名">
            <el-input
              class="input-width"
              v-model="factoryContactDetail.contactName"
              placeholder="请输入联系人姓名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="contactPhone" label="联系人手机号">
            <el-input
              class="input-width"
              v-model="factoryContactDetail.contactPhone"
              placeholder="请输入联系人手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="email" label="联系人邮箱">
            <el-input
              class="input-width"
              v-model="factoryContactDetail.email"
              placeholder="请输入联系人邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="contactNickName" label="联系人别名">
            <el-input
              class="input-width"
              v-model="factoryContactDetail.contactNickName"
              placeholder="请输入联系人别名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="wx" label="联系人微信">
            <el-input class="input-width" v-model="factoryContactDetail.wx" placeholder="请输入联系人微信"></el-input>
          </el-form-item>
          <el-form-item prop="qq" label="联系人QQ号">
            <el-input class="input-width" v-model="factoryContactDetail.qq" placeholder="请输入联系人QQ号"></el-input>
          </el-form-item>
          <el-form-item prop="contactTitle" label="联系人职务">
            <el-input
              class="input-width"
              v-model="factoryContactDetail.contactTitle"
              placeholder="请输入联系人职务"
            ></el-input>
          </el-form-item>
          <el-form-item prop="alitalk" label="联系人阿里账号">
            <el-input
              class="input-width"
              v-model="factoryContactDetail.alitalk"
              placeholder="请输入联系人阿里账号"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="factoryContactDetail.status" label="normal">正常</el-radio>
            <el-radio v-model="factoryContactDetail.status" label="freeze">冻结</el-radio>
          </el-form-item>
          <el-form-item prop="sort" label="排序值">
            <el-input-number v-model="factoryContactDetail.sort" :min="0" :max="100" :step="10"></el-input-number>
          </el-form-item>
          <el-form-item prop="remark" label="备注">
            <el-input class="input-width" v-model="factoryContactDetail.remark" placeholder="备注"></el-input>
          </el-form-item>
          <el-form-item>
            <span v-if="!isCreate">
              <el-button type="primary" @click="updateFactoryBtn()">修改</el-button>
            </span>
            <span v-else>
              <el-button type="primary" @click="createFactoryBtn()">添加</el-button>
            </span>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import {
  updateFactoryContact,
  createFactoryContact
} from "@/api/factoryContact";

const defaultfactoryContactDetail = {
  alitalk: null,
  contactName: null,
  contactNickName: null,
  contactPhone: null,
  contactTitle: null,
  email: null,
  factoryId: null,
  qq: null,
  remark: null,
  sort: null,
  status: "normal",
  wx: null
};
export default {
  props: ["factoryId", "detail"],
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
      factoryContactDetail: Object.assign({}, this.defaultfactoryContactDetail, this.detail),
      rules: {
        alitalk: [
          {
            required: true,
            trigger: "blur",
            validator: validaterBase
          }
        ],
        contactName: [
          {
            required: true,
            trigger: "blur",
            message: '联系人名称不能为空',
          }
        ],
        contactNickName: [
          {
            required: false,
            trigger: "blur",
            message: '联系人不能为空',
          }
        ],
        contactPhone: [
          {
            required: true,
            trigger: "blur",
            validator: validaterBase
          }
        ],
        contactTitle: [
          {
            required: true,
            trigger: "blur",
            validator: validaterBase
          }
        ],
        email: [
          {
            required: false,
            trigger: "blur",
            message: '联系人邮箱',
          }
        ],
        qq: [
          {
            required: false,
            trigger: "blur",
            message: '联系人qq',
          }
        ],
        remark: [
          {
            required: false,
            trigger: "blur",
            message: '联系人备注',
          }
        ],
        sort: [
          {
            required: false,
            trigger: "blur",
            message: '排序',
          }
        ],
        status: [
          {
            required: false,
            trigger: "blur",
            message: '状态',
          }
        ],
        wx: [
          {
            required: false,
            trigger: "blur",
            message: '微信',
          }
        ]
      },
      isCreate: true
    };
  },
  watch: {
    "detail.id": function(newVal, oldVal) {
      if (this.detail.id) {
        this.isCreate = false;
        this.factoryContactDetail = this.detail;
      } else {
        this.isCreate = true;
        this.factoryContactDetail = Object.assign(
          {},
          this.defaultfactoryContactDetail
        );
      }
    }
  },
  methods: {
    updateFactoryBtn() {},
    createFactoryBtn() {
      this.$refs.factoryContactForm.validate(vaild => {
        if (!vaild) {
          this.$message({
            message: "参数填写不正确",
            type: "error"
          });
          return false;
        }
        this.factoryContactDetail.factoryId = this.factoryId;
        createFactoryContact(this.factoryContactDetail).then(response => {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.$confirm("添加成功,您可以继续添加", "提示", {
            confirmButtonText: "确定",
            type: "success"
          }).then(() => {
            this.reset();
          });
        });
      });
    },
    reset() {
      this.factoryContactDetail = Object.assign(
        {},
        defaultfactoryContactDetail
      );
    }
  },
  created() {
    this.factoryContactDetail.factoryId = this.factoryId;
    if (this.detail.id) {
      this.factoryContactDetail = this.detail;
    } else {
      this.factoryContactDetail = Object.assign(
        {},
        defaultfactoryContactDetail
      );
    }
  }
};
</script>
<style scoped>
</style>