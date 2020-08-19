<template>
  <!-- 代发货列表页面展示 -->
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" type="primary" @click="queryBtn" size="small">查询结果</el-button>
        <el-button style="float: right;margin-right: 15px" size="small">重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" size="mini" label-width="120x" label-suffix="：">
          <el-form-item label="客户/采购/订单编号">
            <el-input v-model="listQuery.name" @keyup.native.enter="queryBtn()"></el-input>
          </el-form-item>
          <el-form-item label="物流编号">
            <el-input></el-input>
          </el-form-item>
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
        <el-table-column label="采购订单编号">
          <template></template>
        </el-table-column>
        <el-table-column label="商品数量">
          <template slot-scope="scope">{{scope.row.productCount}}</template>
        </el-table-column>
        <el-table-column label="审批状态">
          <template></template>
        </el-table-column>
        <el-table-column label="业务员" prop="createName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="submitShipmentBtn(scope.row)">查看</el-button>
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
    <el-dialog top="1vh" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <exWarehose :exEntity="exEntity" @dialogControl="dialogControl"></exWarehose>
    </el-dialog>
  </div>
</template>
<script>
import exWarehose from "../compoment/exWarehose";
import { exlist } from "@/api/exWarehouse";
import selectUserOne from "@/components/Admin/selectUserOne";
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
  name: "deliveryList",
  components: { selectUserOne, exWarehose },
  created() {
    this.getExWarehouse();
  },
  data() {
    return {
      exEntity: null,
      dialogVisible: false,
      customerOrderId: null,
      total: null,
      listQuery: Object.assign({}, defaultListQuery),
      pickerOptions: Object.assign({}, defaultPickerOptions),
      exWarehouseList: [],
    };
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
    queryBtn() {
      this.getExWarehouse();
      console.log(this.listQuery);
    },
    inputAdmin(val) {
      this.listQuery.createUserId = val;
    },
    shipmentBtn(row) {
      this.exEntity = row;
      this.dialogControl();
    },
    getExWarehouse() {
      exlist(this.listQuery).then((resp) => {
        this.total = resp.data.total;
        this.exWarehouseList = resp.data.list;
      });
    },
    dialogControl() {
      this.dialogVisible = !this.dialogVisible;
    },
    submitShipmentBtn(row) {
      console.log(row);
    },
  },
};
</script>
<style>
</style>