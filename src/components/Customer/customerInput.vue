<template>
    <el-autocomplete
      v-model="name"
      @keyup.enter.native="handleSelect"
      :fetch-suggestions="querySearchIdAsync"
      placeholder="请输入客户名或昵称"
      v-bind="$attrs"
      @select="handleSelect"
      size="medium"
    >
      <template slot-scope="{ item }">
        <p>
          First name: <span style="font-size: 1em;"><b>{{ item.firstName }}</b></span>
        </p>
        <p>
          Last name: <span style="font-size: 1em;"><b>{{ item.lastName }}</b></span>
        </p>
      </template>
    </el-autocomplete>
</template>
<script>
import { getEntityIdName } from "@/api/customer";

export default {
  name: "customerInput",
  inheritAttrs: false,
  props: {
    value: String
  },
  computed: {},
  data() {
    return {
      idNameList: [],
      name: this.value
    };
  },
  beforeUpdate() {},
  created() {
    this.getEntityIdNameList();
  },
  methods: {
    getEntityIdNameList() {
      getEntityIdName("")
        .then(response => {
          let data = response.data;
          let idNameList = [];
          data.forEach(e => {
            let nameArr = [];
            if (e.firstName) {
              nameArr.push(e.firstName);
            }
            if (e.lastName) {
              nameArr.push(e.lastName);
            }
            let name = nameArr.join(' ');
            idNameList.push({
              id: e.id,
              value: name,
              label: name,
              firstName: e.firstName,
              lastName: e.lastName,
              nickName: e.nickName
            });
          });
          this.idNameList = idNameList;
          this.sortDialogVisible = true;
        })
        .catch(e => {
          console.error(e);
          this.sortDialogVisible = false;
          this.$message({
            type: "error",
            message: "获取列表失败，请联系相关人员"
          });
        });
    },
    querySearchIdAsync(queryString, cb) {
      var idNameList = this.idNameList;
      var results = queryString
        ? idNameList.filter(this.NameOrNickNameFilter(queryString))
        : idNameList;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    NameOrNickNameFilter(queryString) {
      return e => {
        return (
          e.label.toLowerCase().indexOf(queryString.toLowerCase()) >= 0 ||
          e.nickName.toLowerCase().indexOf(queryString.toLowerCase()) >= 0 ||
          e.firstName.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
        );
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