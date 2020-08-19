<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" type="primary" size="small" @click="fetchListHandle">查询结果</el-button>
        <el-button style="float: right;margin-right: 15px" @click="reset" size="small">重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" size="small" label-width="105x" label-suffix="：">
          <el-form-item label="业务员">
            <selectUserOne v-model="listQuery.createUserId"></selectUserOne>
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
      <i class="el-icon-tickets"></i>
      <span>请款列表</span>
      <el-button class="btn-add" size="mini" @click="requestPayOutfun">申请款项</el-button>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-table :data="reimbursementList">
        <el-table-column label="请款人" prop="userName"></el-table-column>
        <el-table-column label="请款类型" prop="product"></el-table-column>
        <el-table-column label="请款金额" prop="amountCny"></el-table-column>
        <el-table-column label="请款时间">
          <template slot-scope="scope">{{scope.row.applicationTime | pareTimeFormate}}</template>
        </el-table-column>
        <el-table-column label="审核状况">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.approvalStatus |approvalStatusFormat(false)"
            >{{scope.row.approvalStatus | approvalStatusFormat(true)}}</el-tag>

            <el-tag v-if="scope.row.status === 'reject'" type="danger">驳回</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="approved(scope.row.id)">查看</el-button>
            <el-button type="text" @click="approved(scope.row.id)">删除</el-button>
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
    <el-dialog
      :destroy-on-close="true"
      :visible.sync="dialogVisible"
      @closed="fetchListHandle"
      top="1vh"
      :fullscreen="true"
    >
      <reimbursementDetail v-model="reimbursementId"></reimbursementDetail>
    </el-dialog>
  </div>
</template>
<script>
import { formatApprovalStatus } from "@/utils/approvalstatus";
import reimbursementDetail from "./compoment/reimbursementDetail";
import { str2Date, pareTime } from "@/utils/date";
import selectUserOne from "@/components/Admin/selectUserOne";
import { fetchList } from "@/api/expenseClaim";
const defaultListQuery = {
  sn: null,
  name: null,
  otherSN: null,
  status: null,
  orderStatus: null,
  mark: null,
  createUserId: null,
  pageNum: 1,
  pageSize: 10,
  temporalInterval: [],
};
export default {
  name: "reimbursement",
  components: { selectUserOne, reimbursementDetail },
  data() {
    return {
      reimbursementId: null,
      dialogVisible: false,
      listQuery: Object.assign({}, defaultListQuery),
      reimbursementList: [],
      total: null,
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
  filters: {
    pareTimeFormate(str) {
      return pareTime(str);
    },
    approvalStatusFormat(val, type) {
      return formatApprovalStatus(val, type);
    },
  },
  created() {
    this.fetchListHandle();
  },
  methods: {
    fetchListHandle() {
      fetchList(this.listQuery).then((resp) => {
        this.total = resp.data.total;
        this.reimbursementList = resp.data.list;
      });
    },
    approved(id) {
      this.reimbursementId = id;
      this.dialogVisible = true;
    },
    requestPayOutfun() {
      this.$router.push({ path: "/fms/applyDetail" });
    },
    reset() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.listQuery.pageNum = 1;
      this.fetchListHandle();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.fetchListHandle();
    },
  },
};
</script>

<style>
</style>