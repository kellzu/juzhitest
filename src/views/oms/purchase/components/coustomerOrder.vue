<template>
  <div class="operate-container">
    <el-divider content-position="left">
      添加客户订单 ·
      <el-button type="text" @click="addOrderItem">点击添加</el-button>
    </el-divider>
    <el-table :data="customerOrderList" style="width: 100%">
      <el-table-column>
        <template slot-scope="scope">
          <customer-order-item :index="scope.$index" @setOrderItem="setOrderItem"></customer-order-item>
        </template>
      </el-table-column>
      <!-- <el-table-column>
        <template slot-scope="scope">
          <el-button @click="deleteHandle(scope.$index)" type="text">删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>
  </div>
</template>
<script>
import customerOrderItem from "./customerOrderItem";
const defaultCustomerOrder = {
  id: null,
  customerId: null,
  customerName: "",
  customerOrderId: null,
  customerOrderSn: null,
  purchaseOrderId: null,
  remark: null
};
export default {
  components: { customerOrderItem },
  name: "coustomerOrder",

  data() {
    return {
      customerOrderList: [null]
    };
  },
  methods: {
    setOrderItem(index, customerOrder, order) {
      if (order == null) {
        this.customerOrderList[index] = null;
      } else {
        this.customerOrderList[index] = customerOrder;
      }
    },
    deleteHandle(index) {
      if (this.customerOrderList.length <= 1) {
        this.$message({
          message: "必须要有一条记录",
          type: "warning"
        });
      } else {
        this.customerOrderList.splice(index, 1);
      }
    },
    addOrderItem() {
      this.customerOrderList.push(null);
    },
    //过滤集合
    processArray(arr) {
      for (let i in arr) {
        if (arr[i] === null) {
          arr.splice(i, 1);
          return this.processArray(arr);
        } 
      }
      return arr;
    },
    // 判断是否继续
    judgeContinue() {
      let arr = this.customerOrderList;
      if (arr.length < 1) {
        this.$message({
          message: "尚未添加有效的客户订单信息",
          type: "warning"
        });
        return false;
      }
      for (let i in arr) {
        if (arr[i] == null) {
          this.$confirm(
            "有需要客户的订单未选取, 如果继续将会过滤无效数据，取消可以继续修改！",
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