<template>
  <div class="app-container">
    <el-card class="operate-container">
      <div slot="header" class="clearfix">
        <span>采购订单编号（SN）</span>
        <span style="color: #909399;">{{acceptanceDetail.purchaseOrderSn}}</span>
        <el-button style="float: right; padding: 3px 0" type="text">查看采购订单详情</el-button>
      </div>
      <el-form label-position="right" :inline="true" label-width="100px" label-suffix="：">
        <el-form-item label="业务员">{{acceptanceDetail.createUserName}}</el-form-item>
        <el-form-item label="快递单号">{{acceptanceDetail.deliverySn}}</el-form-item>
      </el-form>
      <el-form label-width="100px" label-suffix="：">
        <el-form-item label="验收要求">
          <el-input type="textarea" v-model="acceptanceDetail.remark"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div v-for="(item,index) in acceptanceDetail.products" :key="item.productId">
      <el-card class="operate-container">
        <div class="my-image-list">
          <div v-for="(pic ,index) in item.picPath " :key="index">
            <div class="my-image-list-item">
              <el-image :src="pic" fit="scale-down" :preview-src-list="item.picPath"></el-image>
            </div>
          </div>
        </div>
        <div slot="header" class="clearfix">
          <span>商品名称：</span>
          <span style="color: #909399;">{{item.productName}}</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="productInfo(index)"
          >操作按钮</el-button>
        </div>
        <el-divider></el-divider>
        <el-form label-width="100px" v-model="acceptanceList[index]" label-suffix="：">
          <el-form-item label="型号">
            <el-checkbox v-model="acceptanceList[index].model">符合</el-checkbox>
          </el-form-item>
          <el-form-item label="颜色外观">
            <el-checkbox v-model="acceptanceList[index].colorAppearance">符合</el-checkbox>
          </el-form-item>
          <el-form-item label="包装">
            <el-radio-group v-model="acceptanceList[index].packaging">
              <el-radio :label="0">无损</el-radio>
              <el-radio :label="1">微损</el-radio>
              <el-radio :label="2">破损</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input-number size="mini" v-model="acceptanceList[index].productCount"></el-input-number>
          </el-form-item>
          <el-form-item label="损坏数量">
            <el-input-number size="mini" v-model="acceptanceList[index].damageCount"></el-input-number>
          </el-form-item>
          <el-form-item label="是否合格">
            <el-checkbox v-model="acceptanceList[index].isAccept">合格</el-checkbox>
          </el-form-item>
          <el-form-item label="实收图">
            <multi-upload v-model="acceptanceList[index].picPaths"></multi-upload>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-card class="app-container">
      <el-button type="primary" @click="accept" plain>确定</el-button>
    </el-card>
  </div>
</template>
<script>
import multiUpload from "@/components/Upload/multiUpload";
import { acceptanceOrder } from "@/api/acceptance";
import { getProductsToAcceptance } from "@/api/delivery";
const defaultAcceptanceProduct = {
  id: null,
  deliverySn: null,
  deliveryCompany: null,
  deliveryType: null,
  deliveryPrice: null,
  purchaseOrderId: null,
  gmtCreate: null,
  gmtModify: null,
  remark: null,
  deliveryStatus: null,
  purchaseOrderSn: null,
  createUserName: null,
  productCount: null,
  products: []
};
const defaultAccept = {
  purchaseOrderId: null,
  productCount: null,
  damageCount: 0,
  remark: null,
  packaging: null,
  model: false,
  colorAppearance: false,
  isAccept: null,
  productId: null,
  deliveryId: null,
  picPaths: []
};
export default {
  name: "acceptanceCheckDetail",
  components: { multiUpload },
  created() {
    let id = this.$route.query.purchaseId;
    this.getAcceptanceProducts(id);
  },
  data() {
    return {
      value2: false,
      acceptanceDetail: Object.assign({}, defaultAcceptanceProduct),
      acceptanceList: []
    };
  },
  methods: {
    getAcceptanceProducts(id) {
      getProductsToAcceptance(id).then(resp => {
        console.log(resp.data);
        this.acceptanceDetail = resp.data;
        let len = resp.data.products.length;
        for (let i = 0; i < len; i++) {
          let accept = Object.assign({}, defaultAccept);
          accept.purchaseOrderId = resp.data.purchaseOrderId;
          accept.productId = resp.data.products[i].productId;
          accept.deliveryId = resp.data.id;
          this.acceptanceList.push(Object.assign({}, accept));
        }
      });
    },
    productInfo(id) {
      console.log(id);
    },
    accept() {
      acceptanceOrder(
        this.acceptanceDetail.purchaseOrderId,
        this.acceptanceDetail.id,
        this.acceptanceList
      ).then(resp => {
        this.$message.success("验证成功");
      }).catch(resp =>{
        this.$messsage.error("验证失败")
      });
    }
  }
};
</script>
<style>
.my-image-list-item {
  width: 100px;
  height: 100px;
}
.my-image-list {
  display: flex;
  flex-wrap: wrap;
}
</style>