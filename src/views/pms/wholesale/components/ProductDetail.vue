<template>
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="基础信息"></el-step>
      <el-step title="商品价格"></el-step>
      <el-step title="工厂信息"></el-step>
      <el-step title="运输规则"></el-step>
    </el-steps>
    <product-info-detail
      v-show="showStatus[0]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
    ></product-info-detail>
    <product-attr-detail
      v-show="showStatus[1]"
      v-model="productParam"
      :is-edit="isEdit"
      @prevStep="prevStep"
      @finishCommit="finishCommit"
    ></product-attr-detail>
  </el-card>
</template>
<script>
import ProductInfoDetail from "./ProductInfoDetail";
import ProductAttrDetail from "./ProductAttrDetail";
import {
  createProduct,
  getProduct,
  updateProduct
} from "@/api/wholesaleProduct";

const DEFAULT_WHOLESALE_PRODUCTP_RICE_INSTANCE = {
  quantity: 0,
  costUnitPrice: 0,
  wholesaleUnitPrice: 0,
  grossProfitMargin: 0,
  shippingWay: "air express",
  status: "normal",
  shippingCost: 0,
  reamrk: ""
};

const defaultProductParam = {
  previewStatus: 0,
  id: null,
  albumPics: "", // 多个图片路径,限制5张
  brandName: "",
  status: "normal",
  sourceProductLink: "",
  source: "", //  商品归属
  sourceSn: "",
  sourceTitle: "",
  name: "",
  nameEn: "",
  sn: "",
  productCategoryId: null,
  productAttributeCategoryId: null,
  productCode: "",
  reamrk: "",
  productionTime: 0,
  attritionRate: 0,
  weight: 0,
  cartonLongWidthHeigh: 0,
  cartonLong: 0,
  cartonWidth: 0,
  cartonHeigh: 0,
  cartonCount: 0,
  moq: 0, //最小起订量,必须为cartonCount倍数
  cartonGw: 0, //商品最小包装毛重（单位kg，长*宽*高/5000)
  cartonDesc: "",
  designDescription: "",
  costPrice: 0, //单位元
  retailPrice: 0, //单位美元
  grossProfitMargin: 0, //预期毛利率
  publishStatus: "on_sale",
  recommandStatus: "recommend",
  saleAmount: 0, //销量
  stock: -1, //库存
  lowStock: 0, //库存预警值，必须低于库存
  unit: "", //商品单位
  keywords: "",
  sort: 0,
  createUserId: 0,
  accendantId: 0,
  detailDesc: "",
  productCategoryName: "",
  //albumPics中的第一张图片
  picPath: "",
  price: 0,
  factoryId: null,
  factoryName: "",
  //批发商品属性相关{productAttributeId: 0, value: ''}
  wholesaleProductAttributeValueList: [],
  //商品sku库存信息{lowStock: 0, pic: '', price: 0, sale: 0, skuCode: '', sp1: '', sp2: '', sp3: '', stock: 0, type: 'wholesale'}
  skuStockList: [],
  //商品批发阶梯价格信息{quantity: 0, costUnitPrice: 0, wholesaleUnitPrice: 0, grossProfitMargin: 0, shippingWay: 'air express',shippingCost: 0, }
  // air express
  // sea
  // air cargo
  // air mail
  wholesaleProductPriceList: [
    JSON.parse(JSON.stringify(DEFAULT_WHOLESALE_PRODUCTP_RICE_INSTANCE))
  ]
};
export default {
  name: "ProductDetail",
  components: { ProductInfoDetail, ProductAttrDetail },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: 0,
      productParam: Object.assign({}, defaultProductParam),
      showStatus: [true, false]
    };
  },
  created() {
    if (this.isEdit) {
      getProduct(this.$route.query.id).then(response => {
        // 初始化商品信息
        this.initProductParam(response.data);
      });
    }
  },
  computed: {},
  methods: {
    hideAll() {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false;
      }
    },
    prevStep() {
      if (this.active > 0 && this.active < this.showStatus.length) {
        this.active--;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    nextStep() {
      if (this.active < this.showStatus.length - 1) {
        this.active++;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    initProductParam(data) {
      // 包装长宽高拆分
      let arr = [0, 0, 0];
      if (data.cartonLongWidthHeigh) {
        arr = data.cartonLongWidthHeigh.split(",");
      }
      data.cartonLong = Number(arr[0]);
      data.cartonWidth = Number(arr[1]);
      data.cartonHeigh = Number(arr[2]);
      this.productParam = data;
    },
    finishCommit(isEdit) {
      this.$confirm("是否要提交该产品", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (isEdit) {
          updateProduct(this.$route.query.id, this.productParam).then(
            response => {
              this.$message({
                type: "success",
                message: "提交成功",
                duration: 1000
              });
              // this.$router.back();
            }
          );
        } else {
          createProduct(this.productParam).then(response => {
            this.$message({
              type: "success",
              message: "提交成功",
              duration: 1000
            });
          });
        }
      });
    }
  }
};
</script>
<style>
.form-container {
  width: 1200px;
}
</style>


