<template>
  <div class="operate-container">
    <el-card class="operate-container" shadow="never">
      <el-form :model="exDetail" label-width="100px" size="mini" label-position="left">
        <el-form-item label="客户">{{exDetail.customerFirstName}} {{exDetail.customerLastName}}</el-form-item>
        <el-form-item label="客户订单编号">{{exDetail.customerOrderSn}}</el-form-item>
        <el-form-item label="产品数量">{{exDetail.productCount}}</el-form-item>
        <el-form-item label="客户地址">{{exDetail.detailAddress}}</el-form-item>
        <el-form-item label="物流公司">
          <forwardingInput @input="selectForwarding"></forwardingInput>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="exDetail.deliverySn"></el-input>
        </el-form-item>
        <el-form-item label="物流费用">
          <el-input v-model="exDetail.price">
            <template slot="append">￥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="付款方式">
          <el-input v-model="exDetail.patternPayment"></el-input>
        </el-form-item>
        <el-form-item label="商品总体积">
          <el-input v-model="exDetail.totalVolume">
            <template slot="append">cm³</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品总重量">
          <el-input v-model="exDetail.totalWeight">
            <template slot="append">kg</template>
          </el-input>
        </el-form-item>
        <el-form-item label="付款凭证图">
          <multiUpload v-model="exDetail.picList"></multiUpload>
        </el-form-item>
        <el-form-item label="发货凭证">
          <multiUpload v-model="exDetail.LogisticsPic"></multiUpload>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="exDetail.remark" rows="5"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addExDetailBtn">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import multiUpload from "@/components/Upload/multiUpload";
import forwardingInput from "@/components/Forwarding/forwardingInput";
import { addExDetail } from "@/api/exWarehouse";
const defaultExdetail = {
  customerOrderId: null,
  customerId: null,
  customerOrderSn: null,
  totalWeight: null,
  totalVolume: null,
  expressCompanyId: null,
  detailAddress: null,
  price: null,
  remark: null,
  gmtCreate: null,
  gmtModify: null,
  createUserId: null,
  deliverySn: null,
  patternPayment: null,
  picList: [],
  LogisticsPic: []
};
export default {
  name: "exWarehose",
  props: ["exEntity", "isCreate"],
  components: { forwardingInput, multiUpload },
  created() {
    if (this.exEntity != null) {
      this.exDetail = Object.assign(defaultExdetail, this.exEntity);
    }
  },
  watch: {
    "exEntity.customerOrderId": function(newVal, oldVal) {
      this.exDetail = Object.assign(defaultExdetail, this.exEntity);
    }
  },
  data() {
    return {
      exDetail: Object.assign({}, defaultExdetail)
    };
  },
  methods: {
    addExDetailBtn() {
      this.$confirm(
        "提交前请确保信息的正确性，注意暂时未开发修改功能",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(() => {
          if (isCreate) {
            // 添加发货信息
            addExDetail(this.exDetail.customerOrderId, this.exDetail)
              .then(resp => {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$emit("dialogControl");
              })
              .catch(resp => {
              });
          } else {
              
          }
        })
        .catch(() => {});
    },
    selectForwarding(id) {
      this.exDetail.expressCompanyId = id;
    }
  }
};
</script>
<style>
</style>