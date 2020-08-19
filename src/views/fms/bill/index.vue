<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" type="primary" size="small">查询结果</el-button>
        <el-button style="float: right;margin-right: 15px" size="small">重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" size="small" label-width="120x" label-suffix="：">
          <el-form-item label="客户/采购/订单编号">
            <el-input v-model="listQuery.name" @keyup.native.enter="queryBtn()"></el-input>
          </el-form-item>
          <el-form-item label="业务员">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="时间">
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
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>账单列表</span>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-table :data="billList">
        <el-table-column label="客户订单" prop="customerOrderSn"></el-table-column>
        <el-table-column label="入账金额 / $" prop="totalCostUsd"></el-table-column>
        <el-table-column label="采购合计" prop></el-table-column>
        <el-table-column label="利润"></el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">{{scope.row.gmtCreate | pareTimeFormate}}</template>
        </el-table-column>
        <el-table-column label="业务员" prop="createUserName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="showBillDetail(scope.row.id)">明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="账单详情"
      :visible.sync="dialogVisible"
      width="70%"
      :close-on-click-modal="false"
      :fullscreen="true"
    >
      <bill-details v-model="bill_id"></bill-details>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import billDetails from "./detail/billDetails";
import { pareTime } from "@/utils/date";
import { billFetchList, billDetail } from "@/api/bill";
const defaultListQuery = {
  createUserId: null,
  pageNum: 1,
  pageSize: 10,
  name: null,
  status: null
};
export default {
  components: { billDetails },
  data() {
    return {
      dialogVisible: false,
      listQuery: Object.assign({}, defaultListQuery),
      bill_id: null,
      billList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  filters: {
    pareTimeFormate(str) {
      return pareTime(str);
    }
  },
  created() {
    this.getBillList();
  },
  methods: {
    queryBtn() {
      this.getBillList();
    },
    getBillList() {
      billFetchList(this.listQuery).then(resp => {
        this.billList = resp.data.list;
      });
    },
    showBillDetail(id) {
      this.bill_id = id;
      this.dialogVisible = true;
    }
  }
};
</script>

<style>
</style>