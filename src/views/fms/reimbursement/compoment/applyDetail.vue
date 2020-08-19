<template>
  <div class="app-container">
    <el-card class="form-container">
      <div slot="header" class="clearfix">
        <span>费用申请</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="goBack">Go Back</el-button>
      </div>
      <el-form :model="reimbursement" label-width="110px" size="small" label-suffix="：">
        <el-form-item label="费用类型">
          <el-input placeholder="如：办公室费用" v-model="reimbursement.product"></el-input>
        </el-form-item>
        <el-form-item label="费用金额">
          <el-input placeholder="申请金额" v-model="reimbursement.amountCny"></el-input>
        </el-form-item>
        <el-form-item label="费用说明">
          <el-input
            placeholder="费用使用说明"
            type="textarea"
            v-model="reimbursement.applicationDescription"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-input placeholder="微信支付，银行转账" v-model="reimbursement.patternOfPayment"></el-input>
        </el-form-item>
        <el-form-item label="凭证图片">
          <multiUpload v-model="reimbursement.picPaths"></multiUpload>
        </el-form-item>
        <el-divider>收款</el-divider>
        <el-form-item label="收款方式">
          <el-select v-model="patternTypeStatic" @change="selectHandle" placeholder="请选择">
            <el-option
              v-for="item in patternType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div v-if="patternTypeStatic!='bank'">
          <el-form-item label="账号">
            <el-input placeholder="账号" v-model="reimbursement.patternAccount"></el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item>
            <el-row :span="20">
              <el-col :span="3">银行：</el-col>
              <el-col :span="7">
                <el-input placeholder="开户行" v-model="reimbursement.paymentTerm"></el-input>
              </el-col>
              <el-col :span="3">卡号：</el-col>
              <el-col :span="11">
                <el-input placeholder="卡号" v-model="reimbursement.patternAccount"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
        <el-form-item label="期望收款日期">
          <el-date-picker
            v-model="reimbursement.expectedPaymentTime"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="收款说明">
          <el-input type="textarea" v-model="reimbursement.patternDescription"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="commit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { createExpenseClaim } from "@/api/expenseClaim";
import multiUpload from "@/components/Upload/multiUpload";
const defaultPatternType = [
  {
    label: "银行",
    value: "bank"
  },
  {
    label: "支付宝",
    value: "支付宝"
  },
  {
    label: "微信",
    value: "微信"
  },
  {
    label: "其它",
    value: "other"
  }
];
const defaultReimbursement = {
  id: null,
  product: null,
  applicationTime: null,
  patternOfPayment: null,
  paymentTerm: null,
  patternAccount: null,
  patternDescription: null,
  expectedPaymentTime: null,
  remark: null,
  amountUsd: null,
  amountCny: null,
  picPaths: []
};
export default {
  name: "reimbursement",
  components: { multiUpload },
  data() {
    return {
      patternTypeStatic: null,
      patternType: Object.assign([], defaultPatternType),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      reimbursement: Object.assign({}, defaultReimbursement)
    };
  },
  methods: {
    commit() {
      createExpenseClaim(this.reimbursement)
        .then(resp => {
          this.$message({
            message: "申请成功",
            type: "success"
          });
          this.$router.go(-1);
        })
        .catch(resp => {
        });
    },
    selectHandle(value) {
      if (value == "bank") {
        this.reimbursement.paymentTerm = null;
        return;
      }
      this.reimbursement.paymentTerm = value;
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style>
.sa {
  margin-right: 10px;
}
</style>