<template>
    <div>
         <el-autocomplete
            v-model="username"
            @keyup.enter.native="handleSelect"
            :fetch-suggestions="querySearchOwnerIdAsync"
            placeholder="请输入用户名或昵称"
            v-bind="$attrs"
            @select="handleSelect">
                <template slot-scope="{ item }">
                <div class="name">{{ item.label }}</div>
                <div class="name">{{ item.note }}</div>
            </template>
        </el-autocomplete>
    </div>
</template>
<script>
import {getAdminIdNames} from '@/api/admin'

export default {
    name: 'adminUserInput',
    inheritAttrs: false,
    props: {
        value: String
    },
    computed: {
    },
    data() {
        return {
            idNameList: [],
            username: this.value,
        };
    },
    beforeUpdate() {
    },
    created() {
        this.getOwnerIdNameList();
    },
    methods: {
      getOwnerIdNameList() {
         let params = new URLSearchParams();
         params.append('username', '');
         getAdminIdNames(params).then(response => {
           let data = response.data;
           let idNameList = []
           data.forEach(e => {
             idNameList.push({
               id: e.id,
               value: e.username,
               label: e.username,
               nickName: e.nickName,
             })
           })
           this.idNameList = idNameList;
           this.sortDialogVisible = true;
          }).catch(e => {
            this.sortDialogVisible = false;
            this.$message({
                type: 'error',
                message: '获取用户列表失败，请联系相关人员'
              });
          });
      },
      querySearchOwnerIdAsync(queryString, cb) {
        var idNameList = this.idNameList;
        var results = queryString ? idNameList.filter(this.createNameOrNickNameFilter(queryString)) : idNameList;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 1000 * Math.random());
      },
      createNameOrNickNameFilter(queryString) {
        return (e) => {
          return (e.label.toLowerCase().indexOf(queryString.toLowerCase()) >= 0) || (e.nickName.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
        };
      },
      handleSelect(item) {
        this.$emit('input', Object.assign({}, item));
      },
    }
}
</script>