<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" type="primary" @click="handleSearchList" size="small">查询结果</el-button>
        <el-button style="float: right;margin-right: 15px" @click="reset" size="small">重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" size="small" label-width="140px">
          <el-form-item label="客户订单号">
            <el-input v-model="listQuery.sn" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select size="small" v-model="listQuery.status" placeholder="批量操作">
              <el-option
                v-for="item in operateSearch"
                :key="item.value"
                :label="item.value"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间区间">
            <div class="block">
              <el-date-picker
                v-model="listQuery.temporalInterval"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :unlink-panels="true"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="业务员">
            <admin-user-input v-model="listQuery.createUserName" @input="handleSeletCreateUserName"></admin-user-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>

    <el-card class="operate-container" shadow="never">
      <el-table
        :data="customerOrderList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" label="选择"></el-table-column>
        <el-table-column prop="sn" label="订单编号"></el-table-column>
        <!-- <el-table-column label="id" prop="id"></el-table-column> -->
        <el-table-column prop="customerName" label="客户姓名"></el-table-column>
        <el-table-column prop="businessAdminName" label="业务员"></el-table-column>
        <el-table-column label="金额">
          <template slot-scope="scope">{{scope.row.amount}} $</template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" align="center">
          <template slot-scope="scope">{{scope.row.orderStatus |formatOrderStatus}}</template>
        </el-table-column>
        <!--<el-table-column label="状态" width="80px">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>-->
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{scope.row.gmtCreate|formatCreateTime}}
            <br />
            {{scope.row.gmtCreate|getDaysBetween}}天前
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="250px" align="center">
          <template slot-scope="scope">
            <el-button @click="showBtn(scope.row,false)" type="text">查看</el-button>
            <el-button @click="showBtn(scope.row,true)" type="text">修改</el-button>
            <el-button @click="deleteBtn(scope.row.id)" type="text">删除</el-button>
            <br />
            <el-button @click="createPurchaseOrder(scope.row.id)" type="text">创建采购订单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="batch-operate-container">
        <el-select size="small" v-model="operateType" placeholder="批量操作">
          <el-option
            v-for="item in operates"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-button
          style="margin-left: 20px"
          class="search-button"
          @click="batchOperation()"
          type="primary"
          size="small"
        >确定</el-button>
      </div>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper"
          :page-size="listQuery.pageSize"
          :page-sizes="[10,20,30,40,50]"
          :current-page.sync="listQuery.pageNum"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog :fullscreen="true" :visible.sync="customerOrderVisible">
      <customerOrderDetail v-model="customersOrderId"></customerOrderDetail>
    </el-dialog>
  </div>
</template>
<script>
import { getCustomerProductItem } from "@/api/customerOrderItem";
import customerOrderDetail from "./customerOrderDetail/index";
import AdminUserInput from "@/components/Admin/adminUserInput";
import productList from "./components/productList";
import { formatDate } from "@/utils/date";
import {
  createEntity,
  deleteEntity,
  getEntity,
  batchUpdateEntityStatus,
  patchEntity,
  fetchList,
  updateEntity
} from "@/api/customerOrder";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  sn: null,
  status: null,
  temporalInterval: null,
  createUserId: null,
  createUserName: "" // 展示所用，不传递信息
};
export default {
  components: { AdminUserInput, productList, customerOrderDetail },
  data() {
    return {
      customerOrderVisible: false,
      operateType: null,
      customers: [
        { value: "客户1", label: "1" },
        { value: "客户2", label: "2" },
        { value: "客户3", label: "3" },
        { value: "客户4", label: "4" }
      ],
      operateSearch: [
        { value: "全部", label: null },
        { value: "正常", label: "normal" },
        { value: "关闭", label: "freeze" },
        { value: "删除", label: "delete" }
      ],
      customersOrderId: null,
      total: null,
      listQuery: Object.assign({}, defaultListQuery),
      customerOrderList: [
        {
          id: null,
          sn: null,
          customerName: null,
          businessAdminName: null,
          amount: null,
          orderStatus: null,
          gmtCreate: null
        }
      ],
      selectList: [],
      operates: [
        {
          label: "正常",
          value: 0
        },
        {
          label: "关闭",
          value: 1
        },
        {
          label: "删除",
          value: 2
        }
      ]
    };
  },
  filters: {
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    formatOrderStatus(status) {
      if (status === "create") return "创建中";
      if (status === "be_purchased") return "已采购";
      if (status ==="be_delivered") return "代发货";
      if (status === "delivered")return "已发货";
    },

    formatStatus(status) {
      if (status === "normal") return "正常";
      if (status === "freeze") return "失效";
      if (status === "delete") return "删除";
    },
    getDaysBetween(dateString1) {
      var startDate = Date.parse(dateString1);
      var endDate = Date.parse(new Date());
      var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
      return days.toFixed(0);
    }
  },
  created() {
    this.getList();
  },
  methods: {
    searchBtn() {},
    reset() {
      this.listQuery.sn = null;
      this.listQuery.status = null;
      this.listQuery.temporalInterval = null;
    },
    handleSelectionChange(val) {
      let array = [];
      for (var item in val) {
        array.push(val[item].id);
      }
      this.selectList = array;
    },
    createPurchaseOrder(customerOrderId) {
      console.log(customerOrderId);
      getCustomerProductItem(customerOrderId).then(response => {
        console.log(response.data);
        if(response.data.length>0){
          this.$router.push({path:'/purchase/createPurchase',query:{id:customerOrderId}})
        }else{
          this.$message.error("已创建过")
        }
      });
      
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSeletCreateUserName(item) {
      if (item) {
        (this.listQuery.createUserId = item.id),
          (this.listQuery.createUserName = item.label);
      } else {
        (this.listQuery.createUserId = null),
          (this.listQuery.createUserName = "");
      }
    },
    batchOperation() {
      if (this.selectList.length <= 0) {
        this.$message({
          message: "您尚未选取任意一条记录",
          type: "error"
        });
      } else {
        this.$confirm("是否要确认?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          if (this.operateType === 0) {
            this.batchUpdateStatus(this.selectList, "normal");
          } else if (this.operateType === 1) {
            this.batchUpdateStatus(this.selectList, "freeze");
          } else if (this.operateType === 2) {
            this.batchUpdateStatus(this.selectList, "delete");
          } else {
            this.$message({
              message: "您尚未选取操作方式",
              type: "error"
            });
          }
        });
      }
    },
    batchUpdateStatus(ids, status) {
      let idsStatus = {
        ids: ids,
        status: status
      };
      batchUpdateEntityStatus(idsStatus).then(response => {
        this.$message({
          message: "修改成功",
          type: "success"
        }).catch(() => {
          this.$message({
            type: "error",
            message: "错误，已取消操作，请联系相关人员!"
          });
          this.getList();
        });
      });
      this.getList();
    },
    getList() {
      fetchList(this.listQuery).then(response => {
        this.total = response.data.total;
        this.customerOrderList = response.data.list;
      });
    },
    showBtn(row, type) {
      this.customersOrderId = row.id;
      this.customerOrderVisible = true;
    },
    deleteBtn(ids) {
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteEntity(ids)
            .then(response => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getList();
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "删除失败，请联系相关人员"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "已取消操作"
          });
        });
    }
  }
};
</script>
<style>
</style>