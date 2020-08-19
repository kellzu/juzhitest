<template>
  <div>
    <el-form :inline="true" label-width="120px">
      <el-form-item label="选择客户">
        <customer-input
          size="small"
          v-model="customerOrder.customerName"
          @input="handleSelectCustomer"
        ></customer-input>
      </el-form-item>
      <el-form-item label="客户订单">
        <el-select size="small" v-model="customerOrder.customerOrderSn" placeholder="请选择">
          <el-option v-for="item in orderList" :key="item.id" :label="item.sn" :value="item.sn"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CustomerInput from "@/components/Customer/customerInput";
import { customerOrderList } from "@/api/customerOrder";
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
  name: "customerOrderItem",
  components: { CustomerInput },
  props: {
    index: Number
  },
  data() {
    return {
      customerOrder: Object.assign({}, defaultCustomerOrder),
      orderList: [],
      order: null
    };
  },

  watch: {
    "customerOrder.customerId": function(newVal, oldVal) {
      this.getCustomerOrderList(newVal);
      if (this.orderList == null || this.orderList.length < 1) {
        this.order = null;
        this.handleChange();
      }
    },
    customerName: function(newVal, oldVal) {
      this.customerOrder.customerName = newVal;
    },
    "customerOrder.customerOrderSn": function(newVal, oldVal) {
      let isMatch = true;
      this.orderList.forEach(e => {
        if (e.sn === newVal) {
          this.order = e;
          this.customerOrder.customerOrderId = e.id;
          this.handleChange();
          isMatch = false;
        }
      });
      if (isMatch) {
        this.order = null;
        this.handleChange();
      }
    }
  },
  methods: {
    handleSelectCustomer(item) {
      this.customerOrder.customerId = item.id;
      this.customerName = item.value;
      this.customerOrder.customerName = item.value;
    },
    getCustomerOrderList(id) {
      let params = {
        id: id,
        sn: null
      };
      customerOrderList(params)
        .then(response => {
          this.orderList = response.data;
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: "获取列表失败，请联系相关人员"
          });
        });
    },
    handleChange() {
      this.$emit("setOrderItem", this.index, this.customerOrder, this.order);
    }
  }
};
</script>

<style>
</style>