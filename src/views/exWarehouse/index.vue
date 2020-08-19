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
            <el-input v-model="listQuery.customerOrderSn" @keyup.native.enter="queryBtn()"></el-input>
          </el-form-item>
          <el-form-item label="业务员">
            <admin-user @inputAdmin="inputAdmin"></admin-user>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
              v-model="temporalInterval"
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
        <el-table-column label="客户姓名">
          <template slot-scope="scope">
            {{scope.row.customerFirstName}}
            {{scope.row.customerLastName}}
          </template>
        </el-table-column>
        <el-table-column label="商品数量">
          <template slot-scope="scope">{{scope.row.productCount}}</template>
        </el-table-column>
        <el-table-column label="国家" prop="deliveryCountry"></el-table-column>
        <el-table-column label="业务员" prop="note"></el-table-column>
        <el-table-column label="采购订单编号" prop="purchaerOrderSN"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="submitShipmentBtn(scope.row)">申请发货</el-button>
            <el-button type="text" @click="shipmentBtn(scope.row)">发货</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container"></div>
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
    <el-dialog top="1vh" :visible.sync="dialogVisible" :close-on-click-modal="false" width="60%">
      <shipmentsInfo :exEntity="exEntity" @dialogControl="dialogControl"></shipmentsInfo>
    </el-dialog>
  </div>
</template>
<script>
import shipmentsInfo from "./compoment/shipmentsInfo";
import { exlist, shipmentsData, ToBeDeliveredList } from "@/api/exWarehouse";
import adminUser from "@/components/Admin/adminUser";
const defaultListQuery = {
  businessAdminId: null,
  pageNum: 1,
  pageSize: 10,
  customerOrderSn: null,
  startTime: null,
  endTime: null,
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
  name: "exWarehouse",
  components: { adminUser, shipmentsInfo },
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
      temporalInterval: [],
    };
  },
  watch: {},
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
    },
    inputAdmin(val) {
      this.listQuery.businessAdminId = val;
    },
    shipmentBtn(row) {
      shipmentsData(row.customerOrderId).then((resp) => {
        this.exEntity = resp.data;
        this.dialogControl();
      });
    },
    getExWarehouse() {
      if (this.temporalInterval[0]) {
        this.listQuery.startTime = this.temporalInterval[0];
        this.listQuery.endTime = this.temporalInterval[1];
        ToBeDeliveredList(this.listQuery).then((resp) => {
          this.total = resp.data.total;
          this.exWarehouseList = resp.data.list;
        });
      } else {
        ToBeDeliveredList(this.listQuery)
          .then((resp) => {
            this.total = resp.data.total;
            this.exWarehouseList = resp.data.list;
          })
          .catch((resp) => {
          });
      }
    },
    dialogControl() {
      this.dialogVisible = !this.dialogVisible;
    },
    submitShipmentBtn(row) {
    },
  },
};
</script>
<style>
</style>