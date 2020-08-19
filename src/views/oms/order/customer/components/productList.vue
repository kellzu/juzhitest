<template>
  <div class="app-container">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>添加商品</span>
        <el-button
          style=" margin-left: 30px; padding: 3px 0"
          @click="dialogVisible=true"
          type="text"
        >点击添加</el-button>
      </div>
      <el-table :data="products" border style="width: 100%">
        <el-table-column prop="productSn" label="商品编号"></el-table-column>
        <el-table-column prop="productName" label="商品名称"></el-table-column>
        <el-table-column label="批发售单价">
          <template slot-scope="scope">
            <el-input-number
              size="mini"
              v-model="scope.row.salePrice"
              controls-position="right"
              @change="handleUpdateGrossProftMargin(scope.row)"
              placeholder="实售单价"
              :step="2"
              :max="9999999"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="订单数量">
          <template slot-scope="scope">
            <el-input-number
              size="mini"
              v-model="scope.row.quantity"
              placeholder="订单数量"
              :min="1"
              @change="handleUpdateGrossProftMargin(scope.row)"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="售价合计">
          <template slot-scope="scope">
            <el-input-number
              size="mini"
              v-model="scope.row.saleAmount"
              placeholder="实售单价"
              @change="handleUpdateGrossProftMargin(scope.row)"
            ></el-input-number>
          </template>
        </el-table-column>
        <!--  <el-table-column label="采购成本单价">
          <template slot-scope="scope">
            <el-input-number
              size="mini"
              v-model="scope.row.costPrice"
              controls-position="right"
              @change="handleUpdateGrossProftMargin(scope.row)"
              placeholder="成本价"
              :step="2"
              :max="9999999"
            ></el-input-number>
          </template>
        </el-table-column>-->
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.remark" placeholder="备注"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="del(scope.$index,scope.row)">删除</el-button>
            <el-button
            @click="productinfoVisible=true"
            type="text"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--
    <el-card class="operate-container" shadow="never">
      <el-form :inline="true" label-width="100px" size="small">
          <el-form-item label="总销售额：">
          <el-input v-model="totalProductSale" placeholder="总销售额"></el-input>
        </el-form-item>
        <el-form-item label="总成本：">
          <el-input v-model="totalProductCost" placeholder="总成本"></el-input>
        </el-form-item>
        <el-form-item label="毛利：">
          <el-input v-model="grossProfit" placeholder="毛利"></el-input>
        </el-form-item>
        <el-form-item label="毛利率：">
          <el-input v-model="grossProfitMargin" placeholder="毛利率"></el-input>
        </el-form-item>
      </el-form>
    </el-card>-->

    <el-dialog :visible.sync="dialogVisible" :destroy-on-close="true" :append-to-body="true">
      <product-wholesale @add="add"></product-wholesale>
    </el-dialog>
    <el-dialog :visible.sync="productinfoVisible" @click="innerVisible = true" :destroy-on-close="true" :append-to-body="true">
      <productInfo v-model = "products"></productInfo>
    </el-dialog>
  </div>
</template>
<script>
import productWholesale from "@/components/Product/Wholesale/index";
import productInfo from "@/components/Product/ProductInfo/index"
import { listByOrderId } from "@/api/customerOrderItem";
const defaultProductItem = {
  id: null,
  orderId: null,
  wholesaleProductId: null,
  productName: null,
  productSn: null,
  productPicPath: null,
  productCategoryId: null,
  quantity: 1,
  costPrice: null,
  salePrice: null,
  saleAmount: null,
  productAttr: null,
  shippingPrice: null,
  gmtCreate: null,
  gmtModify: null,
  remark: null
};
export default {
  name: "productList",
  components: { productWholesale,productInfo },
  props: { orderId: Number },
  data() {
    return {
      totalProductSale: null,
      totalProductCost: null,
      grossProfitMargin: null,
      grossProfit: null,
      dialogVisible: false,
      products: [],
      productinfoVisible:false
    };
  },
  created() {
    if (this.orderId != null) {
      this.getlistByOrderId();
    }
  },
  watch: {
    orderId: function(newVal, oldVal) {
      if (newVal != null && newVal != undefined) {
        this.getlistByOrderId();
      }
    }
    // products: function() {
    //   this.settlement();
    // }
  },
  methods: {
    del(index, row) {
      this.products.splice(index, 1);
      // this.settlement();
    },
    add(val) {
      let list = Object.values(val);
      list.forEach(element => {
        let item = Object.assign({}, defaultProductItem);
        item.wholesaleProductId = element.id;
        item.productName = element.name;
        item.productSn = element.sn;
        item.remark = element.remark;
        this.products.push(item);
      });
      this.dialogVisible = false;
    },
    handleUpdateGrossProftMargin(row) {
      row.salePrice = row.saleAmount / row.quantity;
      this.settlement();
    },
    settlement() {
      let totalSale = 0;
      let totalCost = 0;
      this.products.forEach(element => {
        totalSale = totalSale + element.salePrice * element.quantity;
        totalCost = totalCost + element.costPrice * element.quantity;
      });

      this.totalProductSale = totalSale.toFixed(2);
      this.totalProductCost = totalCost.toFixed(2);
      this.grossProfit = (totalSale - totalCost).toFixed(2);
      if (this.totalProductSale != 0)
        this.grossProfitMargin = this.grossProfit / totalSale;
    },
    getlistByOrderId() {
      listByOrderId(this.orderId).then(response => {
        this.products = response.data;
      });
    },
    verify() {
      var verify = true;
      if (this.products.length > 0) {
        this.products.forEach(e => {
          if (e.saleAmount > 0) {
            verify = false;
          }
        });
      }
      return verify;
    }
  }
};
</script>

<style>
</style>