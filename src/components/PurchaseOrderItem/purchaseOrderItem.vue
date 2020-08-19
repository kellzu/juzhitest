<template>
  <div>
    <el-divider content-position="left">
      商品列表 ·
      <el-button type="text" @click="handleAddProductLadder()">点击添加</el-button>
    </el-divider>
    <el-table :data="purchaseOrderItems" style="width: 100%" border>
      <el-table-column label="商品名称" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="商品SN" align="center">
        <template slot-scope="scope">
          <el-input size="mini" :disabled="true" v-model="scope.row.sn" placeholder="商品编号"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="采购单价" align="center">
        <template slot-scope="scope">
          <el-input-number
            size="mini"
            v-model="scope.row.wholeSaleProductCostPrice"
            @change="handleUpdateWholeSaleProductCostPrice(scope.row)"
            :disabled="true"
            placeholder="采购单价"
            :precision="2"
            :step="0.01"
            :min="0"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="采购数量" align="center">
        <template slot-scope="scope">
          <el-input-number
            size="mini"
            v-model="scope.row.wholesaleProductCount"
            @change="handleUpdateWholesaleProductCount(scope.row)"
            placeholder="采购数量"
            :precision="0"
            :step="1"
            :min="1"
            :max="scope.row.quantityAvailable"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="采购合计金额" align="center">
        <template slot-scope="scope">
          <el-input-number
            size="mini"
            v-model="scope.row.productAmount"
            @change="handleUpdateProductAmount(scope.row)"
            placeholder="合计金额"
            :precision="2"
            :step="0.01"
            :min="0"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="商品单位" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.wholesaleProductUnit" placeholder="商品单位"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="handleAddProductLadder()">添加</el-button> -->
          <el-button type="text" @click="handleRemoveProductLadder(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-card class="operate-container" shadow="never">
      <el-form :inline="true" size="mini">
        <el-form-item label="商品采购总额">
          <el-input v-model="extimatedPurchaseAmountPrice">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="平均每件单价">
          <el-input v-model="averageCostUnitPrice">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品数量总计">
          <el-input-number v-model="pcs" :min="0"></el-input-number>
        </el-form-item>
        <!-- <el-form-item>
          <el-button @click="calculate" type="success">计算</el-button>
        </el-form-item>-->
      </el-form>
    </el-card>
    <el-dialog :visible.sync="dialogTableVisible" :destroy-on-close="true" width="70%" top="5vh">
      <product-wholesale @add="add"></product-wholesale>
    </el-dialog>
    <!-- 
    <el-drawer title="添加商品" :visible.sync="dialogTableVisible" size="80%">
      <product-wholesale @add="add"></product-wholesale>
    </el-drawer>-->
  </div>
</template>

<script>
import productWholesale from "@/components/Product/Wholesale/index";
const defaultPurchaseItem = {
  sn: null,
  name: null,
  factoryAddressId: null,
  factoryId: null,
  productAmount: null,
  purchaseWholesaleProductId: null,
  purchasesOrderId: null,
  remark: null,
  wholeSaleProductCostPrice: null,
  wholesaleProductCount: 1,
  wholesaleProductLink: null,
  wholesaleProductRemark: null,
  wholesaleProductUnit: null
};
export default {
  components: { productWholesale },
  name: "purchaseOrderItem",
  props: ["purchaseItem"],
  data() {
    return {
      pcs: 0,
      dialogTableVisible: false,
      extimatedPurchaseAmountPrice: 0,
      averageCostUnitPrice: null,
      purchaseOrderItems: []
    };
  },
  created() {
    if (this.purchaseItem != null && this.purchaseItem != undefined) {
      this.purchaseOrderItems = this.purchaseItem;
    }

  },
  watch: {
    purchaseItem: function(newVal, oldVal) {
      if (newVal != null && newVal != undefined) {
        this.purchaseOrderItems = newVal;
      }
      this.calculate();
    },
    extimatedPurchaseAmountPrice: function(newVal, oldVal) {
      this.setExtimatedPurchaseAmountPrice(newVal);
    },
    averageCostUnitPrice: function(newVal, OldVal) {
      this.setAverageCostUnitPrice(newVal);
    }
  },
  methods: {
    setExtimatedPurchaseAmountPrice(val) {
      this.$emit("extimatedAmountPriceHandle", val);
    },
    setAverageCostUnitPrice(val) {
      this.$emit("averageHandle", val);
    },
    handleRemoveProductLadder(index, row) {
      if (this.purchaseOrderItems.length > 1) {
        this.purchaseOrderItems.splice(index, 1);
      } else {
        this.$message({
          message: "必须保留一条有效记录",
          type: "error"
        });
      }
    },
    handleAddProductLadder() {
      this.dialogTableVisible = true;
    },
    add(proList) {
      var list = Object.values(proList);
      list.forEach(element => {
        var purItem = Object.assign({}, defaultPurchaseItem);
        purItem.name = element.name;
        purItem.sn = element.sn;
        purItem.purchaseWholesaleProductId = element.id;
        purItem.wholesaleProductUnit = element.unit;
        purItem.wholeSaleProductCostPrice = element.costPrice;
        this.purchaseOrderItems.push(purItem);
      });
      this.dialogTableVisible = false;
    },
    // 计算采购合计价格
    calculate() {
      let count = 0;
      let totel = 0;
      this.purchaseOrderItems.forEach(element => {
        let proCount = element.wholesaleProductCount;
        if (proCount != null && proCount != "" && !isNaN(proCount)) {
          count = count + proCount;
        } else {
          count = count + 0;
        }
        let productAmount = element.productAmount;
        if (
          productAmount != null &&
          productAmount != "" &&
          !isNaN(productAmount)
        ) {
          totel = totel + productAmount;
        }
      });
      this.pcs = count;
      this.extimatedPurchaseAmountPrice = totel;
      this.averageCostUnitPrice = totel / count;
    },
    handleUpdateProductAmount(row) {
      this.calculateUnitPrice(row);
      this.calculate();
    },
    handleUpdateWholesaleProductCount(row) {
      this.calculateUnitPrice(row);
      this.calculate();
    },
    handleUpdateWholeSaleProductCostPrice(row) {
      this.calculate();
    },
    handleUpdateProductLadder(index, row) {},
    calculateUnitPrice(row) {
      let count = row.wholesaleProductCount;
      if (count != null && count != "" && !isNaN(count)) {
        row.wholeSaleProductCostPrice =
          row.productAmount / row.wholesaleProductCount;
      } else {
      }
    },
    //过滤集合
    processArray(arr) {
      for (let i in arr) {
        if (arr[i] === null || arr[i] === undefined) {
          arr.splice(i, 1);
          return this.processArray(arr);
        } else if (
          arr[i].purchaseWholesaleProductId === null ||
          arr[i].purchaseWholesaleProductId === "" ||
          arr[i].productAmount === null ||
          arr[i].productAmount === 0
        ) {
          arr.splice(i, 1);
          return this.processArray(arr);
        }
      }
      return arr;
    },
    // 判断是否继续
    judgeContinue() {
      let arr = this.purchaseOrderItems;
      if (arr === null || arr.length < 1) {
        return false;
      }
      for (let i in arr) {
        if (
          arr[i].purchaseWholesaleProductId === null ||
          arr[i].purchaseWholesaleProductId === "" ||
          arr[i].productAmount === null ||
          arr[i].productAmount === 0
        ) {
          this.$confirm(
            "有需要采购的商品信息未填写完整, 如果继续将会过滤无效数据，取消可以继续修改?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.$message({
                message: "已清除无效信息",
                type: "success"
              });
              return this.processArray(arr);
            })
            .catch(() => {
              this.$message({
                message: "请继续修改",
                type: "success"
              });
              return false;
            });
          return false;
        }
      }
      return arr;
    }
  }
};
</script>

<style>
</style>