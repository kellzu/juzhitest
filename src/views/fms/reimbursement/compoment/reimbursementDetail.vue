<template>
  <div>
    <el-card class="operate-container" shadow="never">
      <el-row :span="20">
        <!-- 费用申请信息 -->
        <el-col :span="12">
          <div>
            <el-row :span="10">
              <el-col class="applyTitle" :span="5">
                <b>请款人：</b>
              </el-col>
              <el-col class="applyBody" :span="13">{{reimbursementDetail.userName}}</el-col>
            </el-row>

            <el-row :span="10">
              <el-col class="applyTitle" :span="5">
                <b>请款时间：</b>
              </el-col>
              <el-col
                class="applyBody"
                :span="13"
              >{{reimbursementDetail.gmtCreate |dateTimeFormat }}</el-col>
            </el-row>

            <el-row :span="10">
              <el-col class="applyTitle" :span="5">
                <b>请款类型：</b>
              </el-col>
              <el-col class="applyBody" :span="13">{{reimbursementDetail.product}}</el-col>
            </el-row>

            <el-row :span="10">
              <el-col class="applyTitle" :span="5">
                <b>付款方式：</b>
              </el-col>
              <el-col class="applyBody" :span="13">{{reimbursementDetail.patternOfPayment}}</el-col>
            </el-row>

            <el-row :span="10">
              <el-col class="applyTitle" :span="5">
                <b>请款金额：</b>
              </el-col>
              <el-col class="applyBody" :span="13">{{reimbursementDetail.amountCny}}</el-col>
            </el-row>

            <el-row :span="10">
              <el-col class="applyTitle" style="height: 140px" :span="5">
                <b>付款凭证：</b>
                <p>共{{reimbursementDetail.picPaths| picLength}}张凭证</p>
              </el-col>
              <el-col
                class="applyBody"
                style="height: 140px;display: flex;overflow: hidden;"
                :span="13"
              >
                <imageList
                  :imgs="reimbursementDetail.picPaths"
                  istyle="width:100px;height:100px;margin-right: 10px;"
                ></imageList>
              </el-col>
            </el-row>

            <el-row :span="10">
              <el-col class="applyTitle" style="  height: 60px;" :span="5">
                <b>请款说明：</b>
              </el-col>
              <el-col
                class="applyBody"
                style="  height: 60px;"
                :span="13"
              >{{reimbursementDetail.applicationDescription}}</el-col>
            </el-row>

            <el-row :span="10">
              <el-col class="applyTitle" :span="5">
                <b>收款方式：</b>
              </el-col>
              <el-col class="applyBody" :span="13">{{reimbursementDetail.paymentTerm}}</el-col>
            </el-row>

            <el-row :span="10">
              <el-col class="applyTitle" :span="5">
                <b>收款账号：</b>
              </el-col>
              <el-col class="applyBody" :span="13">{{reimbursementDetail.patternAccount}}</el-col>
            </el-row>

            <el-row :span="10">
              <el-col class="applyTitle" :span="5">
                <b>收款说明：</b>
              </el-col>
              <el-col class="applyBody" :span="13">{{reimbursementDetail.patternDescription}}</el-col>
            </el-row>

            <el-row :span="10">
              <el-col class="applyTitle" :span="5">
                <b>期望收款日期：</b>
              </el-col>
              <el-col
                class="applyBody"
                :span="13"
              >{{reimbursementDetail.expectedPaymentTime | dateTimeFormat}}</el-col>
            </el-row>
          </div>
        </el-col>
        <!-- 审核信息 -->
        <el-col :span="10">
          <approval v-model="reimbursementDetail.approvalId"></approval>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import approval from "@/components/approval/index";
import imageList from "@/components/imageList/imageList";
import { pareTime } from "@/utils/date";
import { getDetail } from "@/api/expenseClaim";
const defaultReimbursementDetail = {
  id: null,
  createId: null,
  product: null,
  groupId: null,
  applicationTime: null,
  applicationBillId: null,
  patternOfPayment: null,
  paymentTerm: null,
  patternAccount: null,
  patternDescription: null,
  albumId: null,
  expectedPaymentTime: null,
  remark: null,
  approvalId: null,
  gmtCreate: null,
  gmtModeify: null,
  applicationDescription: null,
  amountUsd: null,
  amountCny: null,
  userName: null,
  picPaths: []
};
export default {
  name: "reimbursementDetail",
  components: { imageList, approval },
  props: {
    value: {
      type: Number
    }
  },
  filters: {
    dateTimeFormat(val) {
      return pareTime(val);
    },
    picLength(val) {
      if (val) return val.length;
      return 0;
    }
  },
  data() {
    return {
      reimbursementDetail: Object.assign({}, defaultReimbursementDetail)
    };
  },
  created() {
    if (this.value) this.getDetail();
  },
  watch: {
    value: function(newVal, oldVal) {
      if (newVal) {
        this.getDetail();
      }
    }
  },
  methods: {
    getDetail() {
      getDetail(this.value).then(resp => {
        this.reimbursementDetail = resp.data;
      });
    }
  }
};
</script>
<style>
.applyTitle {
  padding: 10px;
  height: 40px;
  border: 1px solid #dcdfe6;
  text-align: center;
  background: #f2f6fc;
}
.applyBody {
  padding: 10px;
  height: 40px;
  border: 1px solid #dcdfe6;
  text-align: center;
}
</style>