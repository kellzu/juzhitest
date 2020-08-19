<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">查询搜索</el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="采购订单编号">
            <el-input v-model="listQuery.sn" placeholder="采购订单编号"></el-input>
          </el-form-item>
          <el-form-item label="业务员">
            <admin-user @inputAdmin="inputAdmin"></admin-user>
          </el-form-item>
          <el-form-item label="时间区间">
            <el-date-picker
              v-model="listQuery.temporalInterval"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <br />
    <el-card class="app-container" shadow="never">
      <el-table :data="orderList">
        <el-table-column prop="purchaseOrderSn" label="采购编号"></el-table-column>
        <el-table-column prop="deliverySn" label="物流单号"></el-table-column>
        <el-table-column prop="productCount" label="商品数量"></el-table-column>
        <!-- <el-table-column label="预计到货时间"></el-table-column> -->
        <el-table-column prop="createUserName" label="业务员"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="acceptanceCheck(scope.row.id)" type="text">开始验收</el-button>
            <el-button @click="showDelivery(scope.row.id)" type="text">查看物流</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
    <el-dialog title="商品验收" :visible.sync="acceptanceDialogVisible">
      <acceptance-check-detail></acceptance-check-detail>
    </el-dialog>
    <el-dialog title="物流信息" :visible.sync="deliveryDialogVisible">
      <delivery v-model="deliveryId"></delivery>
    </el-dialog>
  </div>
</template>
<script>
import { getDeliveryDetail } from "@/api/delivery";
import delivery from "./compoment/delivery";
import acceptanceCheckDetail from "./compoment/acceptanceCheckDetail";
import adminUser from "@/components/Admin/adminUser";
import { acceptanceList } from "@/api/purchaseOrder";
const defaultListQuery = {
  sn: null,
  status: null,
  otherSN: null,
  pageNum: 1,
  pageSize: 10,
  createUserId: null,
  orderStatus: null,
  temporalInterval: [],
};
export default {
  name: "acceptanceList",
  components: { adminUser, acceptanceCheckDetail, delivery },
  data() {
    return {
      total: null,
      deliveryDialogVisible: false,
      acceptanceDialogVisible: false,
      deliveryId: null,
      orderList: [],
      userid: 0,
      listQuery: Object.assign({}, defaultListQuery),
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {
    this.getAcceptceList();
  },
  watch: {
    userid: function (newVal, oldVal) {
      console.log(newVal);
    },
  },
  methods: {
    getAcceptceList() {
      acceptanceList(this.listQuery).then((response) => {
        this.total = response.data.total;
        this.orderList = response.data.list;
      });
    },
    handleSearchList() {},
    showDelivery(val) {
      this.deliveryId = val;
      this.deliveryDialogVisible = true;
    },
    acceptanceCheck(val) {
      this.$router.push({
        path: "/warehouse/acceptanceCheckDetail",
        query: {
          purchaseId: val,
        },
      });
    },
    inputAdmin(val) {
      this.listQuery.createUserId = val;
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getAcceptceList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getAcceptceList();
    },
  },
};
</script>

<style>
</style>