<template>
  <div>
    <el-autocomplete
      v-model="orderSN"
      @keyup.enter.native="handleSelect"
      :fetch-suggestions="querySearchIdAsync"
      placeholder="请选择客户订单"
      v-bind="$attrs"
      @select="handleSelect"
    >
      <template slot-scope="{ item }">
        <div class="name">{{ item.value }}</div>
      </template>
    </el-autocomplete>
  </div>
</template>
<script>
import { customerOrderList } from "@/api/customerOrder";
export default {
  name: "customerOrderSelect",
  inheritAttrs: false,
  props: ["customerId", "sn"],
  computed: {},
  data() {
    return {
      idSnList: [],
      orderSN: this.sn
    };
  },
  beforeUpdate() {},
  created() {
    if (this.customerId) {
      this.getCustomerOrderList();
    }
  },
  watch: {
    customerId: function() {
      if (this.customerId) {
        this.getCustomerOrderList();
      }
    }
  },
  methods: {
    getCustomerOrderList() {
      let params = {
        id: this.customerId,
        sn: null
      };
      customerOrderList(params)
        .then(response => {
          let idSnList = [];
          response.data.forEach(e => {
            idSnList.push({
              id: e.id,
              value: e.sn
            });
          });
          this.idSnList = idSnList;
          this.sortDialogVisible = true;
        })
        .catch(e => {
          this.sortDialogVisible = false;
          this.$message({
            type: "error",
            message: "获取列表失败，请联系相关人员"
          });
        });
    },
    querySearchIdAsync(queryString, cb) {
      var idSnList = this.idSnList;
      var results = queryString
        ? idSnList.filter(this.OrderSnFilter(queryString))
        : idSnList;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 10 * Math.random());
    },
    OrderSnFilter(queryString) {
      return e => {
        return e.value.indexOf(queryString.toLowerCase()) >= 0;
      };
    },
    handleSelect(item) {
      this.$emit("input", Object.assign({}, item));
    }
  }
};
</script>
<style scoped>
</style>