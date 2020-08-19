<template>
  <el-select v-model="userId" @change="selectHandle" filterable placeholder="请选择">
    <el-option v-for="item in adminList" :key="item.id" :label="item.username" :value="item.id">
      <span style="float: left">{{ item.note }}</span>
      <span
        style="float: right;margin-left: 20px; color: #8492a6; font-size: 13px"
      >{{ item.username }}</span>
    </el-option>
  </el-select>
</template>
<script>
import { getAdminIdNames } from "@/api/admin";
export default {
  name: "adminUser",
  data() {
    return {
      adminList: [],
      userId: null
    };
  },
  created() {
    this.getOwnerIdNameList();
  },
  methods: {
    getOwnerIdNameList() {
      getAdminIdNames().then(res => {
        this.adminList = res.data;
      });
    },
    selectHandle(val) {
      this.$emit("inputAdmin", val);
    }
  }
};
</script>