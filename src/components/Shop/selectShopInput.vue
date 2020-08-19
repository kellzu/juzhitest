<template>
    <el-select 
      v-model="businessGroupId" 
      filterable 
      v-bind="$attrs"
      @change="handleEmitValue"
      placeholder="请选择店铺">
      <el-option
        filterable
        v-for="item in idNameList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        >
      </el-option>
    </el-select>
</template>
<script>
import { groupIdNameList as getEntityIdName } from "@/api/shop";

export default {
  name: "shopInput",
  inheritAttrs: false,
  props: {
    value: Number
  },
  computed: {
  },
  data() {
    return {
      idNameList: [],
      businessGroupId: this.value,
    };
  },
  beforeUpdate() {},
  created() {
    this.getEntityIdNameList();
  },
  methods: {
    handleEmitValue(newVal) {
      this.$emit('input', newVal);
    },
    getEntityIdNameList() {
      getEntityIdName()
        .then(response => {
          let data = response.data;
          let idNameList = [];
          data.forEach(e => {
            idNameList.push({
              id: e.id,
              value: e.id,
              label: e.name,
            });
          });
          this.idNameList = idNameList;
          this.sortDialogVisible = true;
        })
        .catch(e => {
          this.sortDialogVisible = false;
          this.$message({
            type: "error",
            message: "获取店铺列表失败，请联系相关人员"
          });
        });
    },
  }
};
</script>
<style>
</style>