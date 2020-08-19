<template>
  <el-select v-model="userIds" placeholder="请选择" filterable allow-create>
    <el-option-group v-for="group in options" :key="group.groupName" :label="group.groupName">
      <el-option
        v-for="item in group.userList"
        :key="item.id"
        :label="item.username"
        :value="item.id"
      >
        <span style="float: left">{{ item.username }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.nameEn }}</span>
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script>
import { getGroupUserAndId } from "@/api/admin";
export default {
  data() {
    return {
      options: [],
      userIds: null,
    };
  },
  props: {
    value: Number
  },
  created() {
    this.getGroupUserAndIdFun();
  },
  watch: {
    userIds: function(newVal, oldVal) {
      this.updateHandler();
    }
  },

  methods: {
    getGroupUserAndIdFun() {
      getGroupUserAndId().then(res => {
        this.options = res.data;
      });
    },
    emitInput() {
      this.$emit("input", this.userIds);
    },
    updateHandler() {
      this.emitInput();
      this.$emit("selectUserFun", this.userIds);
    }
  }
};
</script>