<template>
   <div class="table-container">
           <el-table ref="homeAdminTable"
                :data="list"
                style="width: 100%;"
                :stripe="true"
                @row-dblclick="addressSelection"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                :highlight-current-row="true" 
                border>
        <el-table-column label="收件人" align="center" width="150" prop="name" />
        <el-table-column label="国家或地区" align="center" width="150" prop="country" /> 
        <el-table-column label="州" align="center" width="120" prop="province" />
        <el-table-column label="城市" align="center" width="120" prop="city" />
        <el-table-column label="详细地址" align="center" width="150" prop="detailAddress" />
        <el-table-column label="备注" align="center" width="150" prop="remark" />                 
        <el-table-column label="最后修改时间" width="150" align="center">
          <template slot-scope="scope">{{scope.row.gmtModify | gmtModifyTimeFormat}}</template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top: 20px;">
        <el-col :span="6" :offset="18">
          <el-button size="mini" type="text" @click="gotoAddAddress">添加收货地址</el-button>
        </el-col>
      </el-row>
      
    </div>
</template>
<script>
import {formatDate} from '@/utils/date'
import { getEntityIdName } from "@/api/customerReceiveAddress";

export default {
  name: "customerReceiveAddressSelect",
  inheritAttrs: true,
  props: {
    customerId: Number,
    autoRedirect: Boolean,
  },
  watch: {
    customerId: function(newVal, oldVal) {
      this.loadDatas(newVal);
    },
  },
  computed: {},
  data() {
    return {
      idNameList: [],
      username: this.value,
      list: [],
      listLoading: false,
    };
  },
  beforeUpdate() {},
  created() {
    this.loadDatas(this.customerId);
  },
  filters: {
     gmtCreateTimeFormat(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
     gmtModifyTimeFormat(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
  },
  methods: {
    loadDatas(val) {
      if(val) {
            this.getEntityIdNameList();
          } else {
            this.$message({
                type: "error",
                message: "错误，请联系相关人员"
            });
      }
    },
    getEntityIdNameList() {
      this.listLoading = true;
      getEntityIdName(this.customerId, "")
        .then(response => {
          this.list = response.data;
          // 暂无收货地址，去添加收货地址
          if (this.list.length === 0) {
            this.$message({
              type: "info",
              message: "客户地址为空，请先添加客户收货地址!"
            });
            this.autoRedirect && this.gotoAddAddress();
          }
          this.listLoading = false;
        })
        .catch(e => {
          this.listLoading = false;
          this.$message({
            type: "error",
            message: "获取客户收货地址失败，请联系相关人员"
          });
        });
    },
    handleSelectionChange(val) {

    },
    addressSelection(row, column, event) {
      this.$emit('select', Object.assign({}, row));
      this.addressSelection = false;
    },
    gotoAddAddress() {
      this.$router.push({name: 'customerReceiveAddress',  query:{customerId: this.customerId}});
    },
  },
};
</script>