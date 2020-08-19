<template>
    <div>
         <el-autocomplete
            v-model="name"
            @keyup.enter.native="handleSelect"
            :fetch-suggestions="querySearchIdNameAsync"
            placeholder="请输入厂商名称或昵称"
            v-bind="$attrs"
            size="medium"
            @select="handleSelect">
                <template slot-scope="{ item }">
                <div class="name">{{ item.label }}</div>
                <div class="name">{{ item.nickName }}</div>
            </template>
        </el-autocomplete>
    </div>
</template>
<script>
import {getEntityIdName} from '@/api/factory'

export default {
    name: 'factoryInput',
    inheritAttrs: false,
    props: {
        value: String,
        size: String,
    },
    computed: {
    },
    watch: {
        "value": function(newVal) {
                  this.name = newVal;
               }
    },
    data() {
        return {
            idNameList: [],
            name: this.value,
        };
    },
    beforeUpdate() {
    },
    created() {
        this.getOwnerIdNameList();
    },
    methods: {
      getOwnerIdNameList() {
         getEntityIdName('').then(response => {
           let data = response.data;
           let idNameList = []
           data.forEach(e => {
             idNameList.push({
               id: e.id,
               value: e.name,
               label: e.name,
               nickName: e.nickName,
               spellName: e.spellName,
             })
           })
           this.idNameList = idNameList;
           this.sortDialogVisible = true;
          }).catch(e => {
            this.sortDialogVisible = false;
            this.$message({
                type: 'error',
                message: '获取失败，请联系相关人员'
              });
          });
      },
      querySearchIdNameAsync(queryString, cb) {
        var idNameList = this.idNameList;
        var results = queryString ? idNameList.filter(this.createNameFilter(queryString)) : idNameList;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 1000 * Math.random());
      },
      createNameFilter(queryString) {
        return (e) => {
          return (e.label.toLowerCase().indexOf(queryString.toLowerCase()) >= 0) || (e.nickName.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
          || (e.spellName.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
        };
      },
      handleSelect(item) {
        this.$emit('input', Object.assign({}, item));
      },
    }
}
</script>