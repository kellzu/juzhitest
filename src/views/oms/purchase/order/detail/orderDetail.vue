<template>
  <div class="app-container" style>
    <el-card style="width:75%; margin: 0 auto;  background-color: oldlace;">
      <el-form label-position="left" label-width="100px" :model="purchaseDetail">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>客户订单</span>
          </div>
          <div v-for="(item, index) in purchaseDetail.omsCustomerOrderDetails" :key="index">
            <el-form label-width="90px" :inline="true">
              <el-form-item label="客户姓名：">{{item.customerName}}</el-form-item>
              <el-form-item label="订单编号: ">{{item.sn}}</el-form-item>
            </el-form>
          </div>
        </el-card>
        <br />
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span style="margin-right:10px">采购信息</span>
            <el-button type="text" @click="copyBtn">点击复制：</el-button>
            <span id="orderLink">{{orderLink}}</span>
          </div>
          <el-form-item label="采购编号：">
            <el-input size="small" :style="inputStyle" v-model="purchaseDetail.sn"></el-input>
            <el-tag>{{purchaseDetail.islock}}</el-tag>
          </el-form-item>
          <el-form-item label="采购进度：">
            <el-input size="small" :style="inputStyle" v-model="purchaseDetail.orderStatus"></el-input>
          </el-form-item>
          <el-form-item label="组别：">
            <el-input size="small" :style="inputStyle" v-model="purchaseDetail.groupName"></el-input>
          </el-form-item>
          <el-form-item label="业务员：">
            <el-input size="small" :style="inputStyle" v-model="purchaseDetail.createUserName"></el-input>
          </el-form-item>
          <el-form-item label="备注信息：">
            <el-input
              size="small"
              type="textarea"
              :style="inputStyle"
              :rows="4"
              v-model="purchaseDetail.remark"
            ></el-input>
          </el-form-item>
          <div>
            <el-button type="success" v-show="isUpdate" @click="toUpdate">提交修改</el-button>
          </div>
        </el-card>
        <br />
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>商品列表</span>
          </div>
          <el-form-item label="商品列表：">
            <purchase-order-item
              :purchaseItem="purchaseDetail.purchaseOrderIdDetails"
              ref="orderItem"
            ></purchase-order-item>
          </el-form-item>
          <div>
            <el-button type="success" v-show="isUpdate" @click="updateOrderItem">提交修改</el-button>
          </div>
        </el-card>
      </el-form>
      <br />
      <!--采购费用-->
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>采购费用</span>
        </div>
        <el-form label-position="right" label-width="120px" :inline="true">
          <el-form-item label="采购订单合计">
            <el-input-number
              size="small"
              controls-position="right"
              v-model="purchaseDetail.amountFee"
              :step="0.01"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="采购商品费用">
            <el-input
              size="small"
              type="Number"
              v-model="purchaseDetail.extimatedPurchaseAmountPrice"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-form label-width="120px">
          <el-form-item label="物流费用">
            <el-input
              size="small"
              type="Number"
              v-model="purchaseDetail.freightAmount"
              :style="inputStyle"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item label="其他费用">
            <el-input
              size="small"
              type="Number"
              v-model="purchaseDetail.otherAmount"
              :style="inputStyle"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="审核备注">
            <el-input
              type="textarea"
              v-model="purchaseDetail.approvalDesc"
              :style="inputStyle"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-divider>
          采购凭证图 ·
          <el-button v-show="isUpdate" @click="dialogTableVisible=true" type="text">添加凭证图片</el-button>·
          <el-button v-show="isUpdate" @click="deletePicVisible=true" type="text">编辑</el-button>
        </el-divider>
        <div class="my-image-list2">
          <div v-for="(item ,index) in purchaseDetail.invoicePics " :key="index">
            <div>
              <div class="my-image-list">
                <el-image
                  :src="item.pic"
                  style="width: 300px; height: 280px"
                  fit="scale-down"
                  :preview-src-list="pictureList"
                ></el-image>
              </div>
              <el-button
                size="small"
                type="danger"
                @click="deletePicBtn(item,index)"
                v-show="deletePicVisible"
                icon="el-icon-delete"
                circle
              ></el-button>
            </div>
          </div>
        </div>
        <br />
      </el-card>
      <br />
      <!-- 审核 -->
      <approval
        :purchaseOrderId="value"
        :approvalStatus="purchaseDetail.approvalStatus"
        :reFresh="reFresh"
        @updateHandle="myUpdate"
      ></approval>
      <br />
      <!-- 国内快递 -->
      <domesticLogistics v-model="value"></domesticLogistics>
      <!-- 国际物流 -->
      <globalLogistics v-model="purchaseDetail.exId"></globalLogistics>
    </el-card>

    <el-dialog :modal="false" title="添加凭证图" width="40%" :visible.sync="dialogTableVisible">
      <el-form label-width="80px">
        <el-form-item label="凭证图">
          <multi-upload v-model="addCredentialPicture"></multi-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="addCredentialPictureBtn">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import domesticLogistics from "../compoments/domesticLogistics";
import globalLogistics from "../compoments/globalLogistics";
import approval from "../../approval/index";
import { addAlbumPicList, deletePic } from "@/api/album";
import multiUpload from "@/components/Upload/multiUpload";
import { patchEntity, updateEntity, getEntity } from "@/api/purchaseOrder";
import purchaseOrderItem from "@/components/PurchaseOrderItem/purchaseOrderItem";
import { updatePurchaseitem } from "@/api/purchaseOrderitem";
const defaultPurchaseDetail = {
  id: null,
  sn: null,
  orderStatus: null,
  customerOrderId: null,
  source: null,
  businessGroupId: null,
  customerId: null,
  goodsAmountFee: null,
  freightAmount: null,
  otherAmount: null,
  amountFee: null,
  extimatedPurchaseAmountPrice: null,
  purchasesDesc: null,
  pcs: null,
  averageCostUnitPrice: null,
  createUserId: null,
  approvalDesc: null,
  approvalStatus: null,
  albumPics: null,
  failureMsg: null,
  receiptPics: null,
  otherPics: null,
  status: null,
  remark: null,
  gmtCreate: null,
  gmtModify: null,
  beDeliveryTime: null,
  deliverySn: null,
  createUserName: null,
  groupName: null,
  customerName: null,
  islock: null,
  invoicePics: [],
  purchaseOrderIdDetails: [
    {
      id: null,
      purchasesOrderId: null,
      purchaseWholesaleProductId: null,
      wholesaleProductLink: null,
      wholesaleProductRemark: null,
      wholesaleProductCount: null,
      wholesaleProductUnit: null,
      wholeSaleProductCostPrice: null,
      productAmount: null,
      factoryId: null,
      factoryAddressId: null,
      gmtCreate: null,
      gmtModify: null,
      remark: null,
      sn: null,
      name: null
    }
  ]
};
const defaultLogisticsResult = {
  number: null,
  type: null,
  list: [],
  deliverystatus: 7,
  issign: null,
  expName: null,
  expSite: null,
  expPhone: null,
  logo: null,
  courier: null,
  courierPhone: null,
  updateTime: null,
  takeTime: null
};
export default {
  props: {
    value: Number
  },
  components: {
    purchaseOrderItem,
    multiUpload,
    approval,
    domesticLogistics,
    globalLogistics
  },
  data() {
    return {
      reFresh: 0,
      orderLink: null,
      purchaseOrderId: null,
      deliveryStatusCN: {
        0: ["揽件中", "info"],
        1: ["在途中", "info"],
        2: ["派件中", "info"],
        3: ["已签收", "success"],
        4: ["派送失败", "warning"],
        5: ["疑难件", "warning"],
        6: ["退件签收", "warning"],
        7: ["无物流信息", "warning"]
      },
      logisticsResult: Object.assign({}, defaultLogisticsResult),
      toShow: true,
      deletePicVisible: false,
      inputStyle: "width:600px",
      addCredentialPicture: [],
      isUpdate: true,
      pictureList: [],
      dialogTableVisible: false,
      purchaseDetail: Object.assign({}, defaultPurchaseDetail)
    };
  },
  created() {
    let id = this.value;
    if (id != null) {
      this.getOrderEntity();
      this.orderLink =
        "http://49.234.145.241/purchase/purchaseDetail?id=" + this.value;
    }
  },
  watch: {
    value: function(newVal, oldVal) {
      if (newVal != null) {
        this.getOrderEntity();
        this.orderLink =
          "http://49.234.145.241/purchase/purchaseDetail?id=" + newVal;
      }
    }
  },
  methods: {
    // 订单修改 ---基本信息
    toUpdate(row, type) {
      this.$confirm("确定要修改此订单", "提示", {})
        .then(() => {
          let list = this.$refs["orderItem"].purchaseOrderItem;
          updateEntity(this.purchaseDetail.id, this.purchaseDetail).then(
            response => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
            }
          );
        })
        .catch(() => {
          this.$message({
            message: "您取消了修改",
            type: "warning"
          });
        });
    },
    addCredentialPictureBtn() {
      if (this.addCredentialPicture.length < 1) {
        this.$message({
          message: "您尚未添加图片",
          type: "error"
        });
        return false;
      }
      addAlbumPicList(this.value, this.addCredentialPicture).then(response => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.getOrderEntity();
        this.dialogTableVisible = false;
      });
    },
    deletePicBtn(item, index) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletePic(item.id, item.pic).then(response => {
            //9ebd9742-abea-4fbd-ae62-e77a5a9e2d0f.jpg
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.purchaseDetail.invoicePics.splice(index, 1);
            this.pictureList.splice(index, 1);
          });
        })
        .catch(() => {
          this.$message({
            message: "已取消",
            type: "success"
          });
        });
    },
    //修改订单上列表
    updateOrderItem() {
      this.$confirm("确认修改", "修改", {
        confirmButtonText: "修改",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          var orderList = this.$refs.orderItem.purchaseOrderItems;
          updatePurchaseitem(this.value, orderList).then(response => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
          });
        })
        .catch(() => {
          this.$message({
            message: "已取消",
            type: "success"
          });
        });
    },
    getOrderEntity() {
      getEntity(this.value).then(response => {
        this.purchaseDetail = response.data;
        if (this.purchaseDetail.logisticsEntity) {
          this.toShow = false;
          this.logisticsResult = Object.assign(
            {},
            this.purchaseDetail.logisticsEntity.result
          );
        }
        this.purchaseDetail.invoicePics.forEach(e => {
          this.pictureList.push(e.pic);
        });
      });
    },
    copyBtn() {
      var mylink = document.getElementById("orderLink");
      window.getSelection().selectAllChildren(mylink);
      document.execCommand("Copy");
      this.$message({
        message: "复制成功",
        type: "success"
      });
    },
    myUpdate() {
      this.getOrderEntity();
      this.reFresh++;
    }
  }
};
</script>

<style>
.my-image-list {
  width: 300px;
  height: 280px;
  border: 1px, black;
}
.my-image-list2 {
  display: flex;
  flex-wrap: wrap;
}
</style>
