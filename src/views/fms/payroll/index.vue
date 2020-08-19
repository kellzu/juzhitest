<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" type="primary" @click="handleSearchList()" size="small">查询结果</el-button>
        <el-button style="float: right;margin-right: 15px" size="small">重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" size="small" label-width="120x" label-suffix="：">
          <el-form-item label="姓名">
            <selectUserOne v-model="listQuery.userId"></selectUserOne>
          </el-form-item>
          <el-form-item label="时间">
            <div class="block">
              <el-date-picker v-model="listQuery.temporalInterval" type="month" placeholder="选择月"></el-date-picker>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>账单列表</span>
        <el-button class="btn-add" size="mini" @click="addProfit">确认</el-button>
        <el-input-number
          v-model="profit"
          class="btn-add"
          size="mini"
          style="width:150px"
          :min="1"
        >
          <template slot="append">汇率</template>
        </el-input-number>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-table :data="payrollList">
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="所属部门" prop="groupName"></el-table-column>
        <el-table-column label="客户订单数量" prop="customerOrderCount"></el-table-column>
        <el-table-column label="客户订单总额($)" prop="customerAmountFee">
          <template slot-scope="scope">${{scope.row.customerAmountFee}}</template>
        </el-table-column>
        <el-table-column label="采购订单数量" prop="purchaseOrderCount"></el-table-column>
        <el-table-column label="采购费用(￥)" prop="purchaseAmountFee">
          <template slot-scope="scope">￥{{scope.row.purchaseAmountFee}}</template>
        </el-table-column>
        <el-table-column label="子采购费用(￥)">
          <template slot-scope="scope">￥{{scope.row.sonPurchaseOrderAmount}}</template>
        </el-table-column>
        <el-table-column label="物流费用(￥)">
          <template slot-scope="scope">￥{{scope.row.logisticsFees}}</template>
        </el-table-column>
        <el-table-column label="毛利(￥)" prop="profit"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="showBillDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog
      title="薪资详情"
      :visible.sync="dialogVisible"
      width="70%"
      :close-on-click-modal="false"
      :fullscreen="true"
    >
      <payrollDetail :userId="userId" :month="month" :profit="profit"></payrollDetail>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import payrollDetail from "./detail/payrollDetail";
import selectUserOne from "@/components/Admin/selectUserOne";
import { getProfit } from "@/api/bill";
import { pareTime } from "@/utils/date";
import { performance } from "@/api/performance";
const defaultListQuery = {
  userId: null,
  temporalInterval: new Date(),
  pageSize: 10,
  pageNum: 1
};
const defaultpayrollDetail = {
  customerAmountFee: null,
  customerOrderCount: null,
  groupName: null,
  profit: null,
  purchaseAmountFee: null,
  purchaseOrderCount: null,
  userId: null,
  username: null
};
export default {
  components: { selectUserOne, payrollDetail },
  data() {
    return {
      total: null,
      userId: null,
      month: null,
      profit: null,
      dialogVisible: false,
      listQuery: Object.assign({}, defaultListQuery),
      payrollList: [],
      time: 1
    };
  },
  filters: {
    pareTimeFormate(str) {
      return pareTime(str);
    }
  },
  created() {
    this.getProfit();
    this.getpayroll();
  },
  methods: {
    // 分页查询的功能
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.listQuery.pageNum = 1;
      this.queryBtn();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.queryBtn();
    },
    handleSearchList() {
      this.getpayroll();
    },
    getProfit() {
      getProfit().then(resp => {
        this.profit = resp.data;
      });
    },
    queryBtn() {
      this.getpayroll();
    },
    getpayroll() {
      performance(this.listQuery).then(resp => {
        this.total = resp.data.total;
        this.payrollList = resp.data.list;
      });
    },
    showBillDetail(row) {
      this.month = this.listQuery.temporalInterval;
      this.userId = row.userId;
      this.dialogVisible = true;
    },
    addProfit() {
      this.payrollList.forEach(e => {
        e.profit =
          (e.customerAmountFee * this.profit).toFixed(4) -
          e.purchaseAmountFee -
          e.logisticsFees -
          e.sonPurchaseOrderAmount;
      });
    }
  }
};
</script>

<style>
</style>