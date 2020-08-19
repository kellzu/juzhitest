<template>
  <el-select
    v-model="forwardingId"
    filterable
    v-bind="$attrs"
    @change="handleEmitValue"
    placeholder="请选择货代公司"
  >
    <el-option
      filterable
      v-for="item in idNameList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>
<script>
import { getList } from "@/api/forwardingCompany";
export default {
  name: "customerInput",
  inheritAttrs: false,
  props: {
    value: Number
  },
  computed: {
  },
  data() {
    return {
      idNameList: [],
      forwardingId: this.value
    };
  },
  beforeUpdate() {},
  created() {
    this.getEntityIdNameList();
  },
  methods: {
    handleEmitValue(newVal) {
      this.$emit("input", newVal);
    },
    getEntityIdNameList() {
      getList()
        .then(response => {
          let data = response.data;
          let idNameList = [];
          data.forEach(e => {
            idNameList.push({
              id: e.id,
              value: e.id,
              label: e.forwardingCompanyName
            });
          });
          this.idNameList = idNameList;
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: "获取列表失败"
          });
        });
    }
  }
};
</script>

<style>
</style>