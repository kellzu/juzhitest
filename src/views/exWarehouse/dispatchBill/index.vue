<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" type="primary" @click="queryBtn" size="small">查询结果</el-button>
        <el-button style="float: right;margin-right: 15px" size="small">重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" size="small" label-width="120x" label-suffix="：">
          <el-form-item label="客户/采购/订单编号">
            <el-input v-model="listQuery.name" @keyup.native.enter="queryBtn()"></el-input>
          </el-form-item>
          <el-form-item label="业务员">
            <admin-user @inputAdmin="inputAdmin"></admin-user>
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
      <i class="el-icon-search"></i>
      <span>出货列表</span>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-table :data="exWarehouseList">
        <el-table-column label="客户订单" prop="customerOrderSn"></el-table-column>
        <el-table-column label="客户">
          <template slot-scope="scope">
            {{scope.row.customerFirstName}}
            {{scope.row.customerLastName}}
          </template>
        </el-table-column>
        <el-table-column label="物流单号" prop="deliverySn"></el-table-column>
        <el-table-column label="商品数量">
          <template slot-scope="scope">{{scope.row.productCount}}</template>
        </el-table-column>
        <el-table-column label="业务员" prop="note"></el-table-column>
        <el-table-column label="国家" prop="deliveryCountry"></el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.approvalStatus|approvalStatusFormate(false)"
              @click="approvalBtn(scope.row)"
            >{{scope.row.approvalStatus|approvalStatusFormate(true)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="shipmentBtn(scope.row)">详情</el-button>
            <el-button type="text" @click="shipmentBtn(scope.row)">验收详情</el-button>
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
      top="1vh"
      :visible.sync="dialogVisible"
      width="60%"
      @close="baseClose()"
      :close-on-click-modal="false"
    >
      <exWarehose :reFresh="reFresh" :exEntity="exEntity" @dialogControl="dialogControl"></exWarehose>
    </el-dialog>
    <el-dialog top="1vh" :visible.sync="approvalVisble" @close="getExWarehouse()">
      <approval v-model="approvalId"></approval>
    </el-dialog>
  </div>
</template>
<script>
import approval from "@/components/approval/index";
import { formatApprovalStatus } from "@/utils/approvalstatus";
import exWarehose from "../compoment/exWarehose";
import { exlist } from "@/api/exWarehouse";
import adminUser from "@/components/Admin/adminUser";
const defaultListQuery = {
  createUserId: null,
  pageNum: 1,
  pageSize: 10,
  name: null,
  status: null,
};
const defaultPickerOptions = {
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
};
export default {
  name: "dispatchBill",
  components: { adminUser, exWarehose, approval },
  created() {
    this.getExWarehouse();
  },
  data() {
    return {
      exEntity: null,
      dialogVisible: false,
      customerOrderId: null,
      approvalId: null,
      approvalVisble: false,
      reFresh: 0,
      total: null,
      listQuery: Object.assign({}, defaultListQuery),
      pickerOptions: Object.assign({}, defaultPickerOptions),
      exWarehouseList: [],
    };
  },
  filters: {
    approvalStatusFormate(val, type) {
      return formatApprovalStatus(val, type);
    },
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getExWarehouse();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getExWarehouse();
    },
    approvalBtn(row) {
      this.approvalId = row.appId;
      this.approvalVisble = true;
    },
    queryBtn() {
      this.getExWarehouse();
    },
    inputAdmin(val) {
      this.listQuery.createUserId = val;
    },
    shipmentBtn(row) {
      this.exEntity = row;
      this.reFresh = 1;
      this.dialogControl();
    },
    dialogControl() {
      this.dialogVisible = !this.dialogVisible;
    },
    baseClose() {
      this.reFresh = 0;
    },
    getExWarehouse() {
      exlist(this.listQuery).then((resp) => {
        this.total = resp.data.total;
        this.exWarehouseList = resp.data.list;
      });
    },
  },
};
</script>
<style>
</style>