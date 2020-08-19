<template>
  <div>
    <el-card shadow="never">
      <!-- 物流信息 -->
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
      <br />
      <el-card class="operate-container" shadow="never">
        <el-form label-width="100px" size="mini">
          <el-form-item label="物流单号：">
            <el-input v-model="globalLogistics.deliverySn"></el-input>
          </el-form-item>
          <el-form-item label="物流公司：">
            <el-input v-model="globalLogistics.deliveryCompany"></el-input>
          </el-form-item>
          <el-form-item label="货品体积：">
            <el-input-number v-model="globalLogistics.totalVolume"></el-input-number>
          </el-form-item>
          <el-form-item label="货品重量：">
            <el-input-number v-model="globalLogistics.totalWeight"></el-input-number>
          </el-form-item>
          <el-form-item label="物流金额：">
            <el-input-number v-model="globalLogistics.price"></el-input-number>
          </el-form-item>
          <el-form-item label="付款方式：">
            <el-input v-model="globalLogistics.patternpayment"></el-input>
          </el-form-item>
          <el-form-item label="付款凭证：">
            <imageList :images="globalLogistics.picList" istyle="width: 50px; height: 50px"></imageList>
          </el-form-item>
          <el-form-item label="发货打包图：">
            <imageList :images="globalLogistics.logisticsPic" istyle="width: 50px; height: 50px"></imageList>
          </el-form-item>
          <el-form-item label="客户地址：">
            <el-input type="textarea" v-model="globalLogistics.detailAddress"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="globalLogistics.remark"></el-input>
          </el-form-item>
          <br />
          <span v-if="toShow" style="font-size: 16px; color: #909399;">暂无物流信息</span>
        </el-form>
      </el-card>
      <br />
      <template slot="title">
        <i class="header-icon el-icon-info" style="margin-right: 5px;"></i>
        <B style="margin-right: 10px;">国际物流信息</B>
      </template>
      <logistticsLog :toShow="toShow" :logisticsResult="logisticsResult"></logistticsLog>
      <approval v-model="exDetail.appId"></approval>
    </el-card>
    <br />
  </div>
</template>
<script>
import imageList from "@/components/imageList/imageList";
import productList from "@/views/oms/order/customer/components/productList";
import approval from "@/components/approval/index";
import logistticsLog from "@/components/logistticsLog/logistticsLog";
import { getGlobalLogistics } from "@/api/delivery";
const defaultGetGlobalLogistics = {
  id: null,
  customerOrderId: null,
  customerId: null,
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
  deliveryEvidenceAlbumId: null,
  paymentAlbumId: null,
  priceBillId: null,
  apId: null,
  patternpayment: null,
};
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
export default {
  name: "globalLogistics",
  props: {
    exEntity: Object,
    reFresh: Number,
  },
  components: { logistticsLog, imageList, approval, productList },
  data() {
    return {
      toShow: true,
      globalLogistics: Object.assign({}, defaultGetGlobalLogistics),
      logisticsResult: null,
      exDetail: Object.assign({}, defaultExdetail),
    };
  },
  created() {
    this.exDetail = Object({}, this.exEntity);
    if (this.exDetail.exId) {
      this.getGlobalLogistics();
    }
  },
  watch: {
    reFresh: function (newVal, oldVal) {
      if (newVal == 1) {
        this.exDetail = Object.assign({}, this.exEntity);
        if (this.exDetail.exId) {
          this.getGlobalLogistics();
        }
      }
    },
  },
  methods: {
    getGlobalLogistics() {
      getGlobalLogistics(this.exEntity.exId).then((resp) => {
        console.log(resp.data);
        this.globalLogistics = Object.assign({}, resp.data);
        if (resp.data != null && resp.data.logisticsEntity != null) {
          this.toShow = false;
          this.logisticsResult = resp.data.logisticsEntity.result;
        }
      });
    },
  },
};
</script>
<style>
</style>