<template>
  <div class="operate-container">
    <h1>添加发货物流</h1>
    <el-card class="operate-container" shadow="never">
      <el-row :span="24">
        <el-col :span="12" style="display:flex;align-items: center;">
          <h3>客户名称:</h3>
          <span>{{exDetail.customerFirstName}} {{exDetail.customerLastName}}</span>
        </el-col>
        <el-col :span="12" style="display:flex;align-items: center;">
          <h3>国家:</h3>
          <span>{{exDetail.deliveryCountry}}</span>
        </el-col>
        <el-col :span="12" style="display:flex;align-items: center;">
          <h3>订单编号:</h3>
          <span>{{exDetail.customerOrderSn}}</span>
        </el-col>
        <el-col :span="12" style="display:flex;align-items: center;">
          <h3 style="width: 100px">详情地址:</h3>
          <span>{{exDetail.detailAddress}}</span>
        </el-col>
        <el-col :span="12" style="display:flex;align-items: center;">
          <h3>产品数量:</h3>
          <span>{{exDetail.productCount}}</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <productList :orderId="exDetail.customerOrderId"></productList>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-form :model="shipmentsInfo" label-width="100px" size="mini" label-position="left">
        <el-form-item label="物流公司">
          <forwardingInput @input="selectForwarding"></forwardingInput>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="shipmentsInfo.deliverySn"></el-input>
        </el-form-item>
        <el-form-item label="物流费用">
          <el-input v-model="shipmentsInfo.price">
            <template slot="append">￥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="付款方式">
          <el-input v-model="shipmentsInfo.patternPayment"></el-input>
        </el-form-item>
        <el-form-item label="商品总体积">
          <el-input v-model="shipmentsInfo.totalVolume">
            <template slot="append">cm³</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品总重量">
          <el-input v-model="shipmentsInfo.totalWeight">
            <template slot="append">kg</template>
          </el-input>
        </el-form-item>
        <el-form-item label="付款凭证图">
          <multiUpload v-model="shipmentsInfo.paymentAlbum"></multiUpload>
        </el-form-item>
        <el-form-item label="发货凭证">
          <multiUpload v-model="shipmentsInfo.deliveryevidencealbum"></multiUpload>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="shipmentsInfo.ewRemark" rows="5"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addExDetailBtn">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import productList from "@/views/oms/order/customer/components/productList";

import multiUpload from "@/components/Upload/multiUpload";
import forwardingInput from "@/components/Forwarding/forwardingInput";
// 国际物流审核
import globalLogistics from "@/views/oms/purchase/order/compoments/globalLogistics";
import { addExDetail, upDateOrder } from "@/api/exWarehouse";
const defaultExdetail = {
  customerOrderId: null,
  customerOrderSn: null,
  totalWeight: null,
  totalVolume: null,
  customerFirstName: null,
  customerLastName: null,
  productCount: null,
  detailAddress: null,
  deliveryCountry: null,
  deliveryCompanyId: null,
  deliverySn: null,
  price: null,
  payType: null,
  ewRemark: null,
};
const defaultShipmentsInfo = {
  orderId: null,
  expressCompanyId: null,
  deliverySn: null,
  price: 0,
  patternPayment: null,
  totalVolume: 0,
  totalWeight: 0,
  paymentAlbum: [],
  deliveryevidencealbum: [],
  ewRemark: null,
};
export default {
  name: "exWarehose",
  props: ["exEntity"],
  components: { forwardingInput, multiUpload, globalLogistics, productList },
  created() {
    if (this.exEntity != null) {
      this.exDetail = Object.assign(defaultExdetail, this.exEntity);
      this.shipmentsInfo.orderId = this.exDetail.customerOrderId;
    }
  },
  watch: {
    "exEntity.customerOrderId": function (newVal, oldVal) {
      this.exDetail = Object.assign(defaultExdetail, this.exEntity);
    },
  },
  data() {
    return {
      exDetail: Object.assign({}, defaultExdetail),
      shipmentsInfo: Object.assign({}, defaultShipmentsInfo),
    };
  },
  methods: {
    addExDetailBtn() {
      this.$confirm(
        "提交前请确保信息的正确性，注意暂时未开发修改功能",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      ).then(() => {
        console.log(this.shipmentsInfo, "提交的数据this.shipmentsInfo");
        upDateOrder(this.shipmentsInfo)
          .then((resp) => {
            this.$message({
              message: "提交成功",
              type: "success",
            });
            this.$emit("dialogControl");
          })
          .catch((resp) => {
            console.log(resp);
          });
      });
    },
    selectForwarding(id) {
      this.shipmentsInfo.expressCompanyId = id;
    },
  },
};
</script>
<style scoped>
</style>