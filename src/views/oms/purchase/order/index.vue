<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList" size="small">查询搜索</el-button>
        <el-button style="float:right;margin-right: 15px" @click="rest" size="small">重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" ref="searchForm" size="small" label-width="140px">
          <el-form-item label="订单编号：">
            <el-input
              class="input-width"
              v-model="listQuery.sn"
              placeholder="订单编号"
              @keyup.native.enter="handleSearchList()"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户订单编号">
            <el-input
              v-model="listQuery.otherSN"
              placeholder="客户订单编号"
              @keyup.native.enter="handleSearchList()"
            ></el-input>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select v-model="listQuery.status" class="input-width" placeholder="订单状态">
              <el-option v-for="v in operates" :key="v.value" :label="v.label" :value="v.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采购状态：">
            <el-select v-model="listQuery.orderStatus" placeholder="采购状态">
              <el-option
                v-for="(item ,key) in purchaseStatus"
                :key="key"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务员">
            <admin-user-input @input="inputAdmin"></admin-user-input>
          </el-form-item>
          <el-form-item label="时间查询：">
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
      <span>数据列表</span>
      <br />
      <br />
      <el-row :span="10">
        <el-col :span="10">
          <el-row>
            <el-col :span="5">
              <el-button @click="approval_status_search('commit_to_finance')" size="mini">订单-待财务审核</el-button>
            </el-col>
            <el-col :span="5">
              <el-button
                @click="approval_status_search('commit_to_principal')"
                size="mini"
              >订单-待负责人审核</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="approval_status_search('commit_to_group')" size="mini">订单-待组长审核</el-button>
            </el-col>
          </el-row>
          <br />
          <el-row :span="10">
            <el-col :span="5">
              <el-button
                @click="ex_warehouse_approval_status_search('commit_to_finance')"
                size="mini"
              >物流-待财务审核</el-button>
            </el-col>
            <el-col :span="5">
              <el-button
                @click="ex_warehouse_approval_status_search('commit_to_principal')"
                size="mini"
              >物流-待负责人审核</el-button>
            </el-col>
            <el-col :span="5">
              <el-button
                @click="ex_warehouse_approval_status_search('commit_to_group')"
                size="mini"
              >物流-待组长审核</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-table
        :data="purchaseOrderList"
        @selection-change="handleSelectionChange"
        :stripe="true"
        :border="true"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="sn" label="订单编号" align="center"></el-table-column>
        <el-table-column label="订单归属" width="80px">
          <template slot-scope="scope" align="center">{{scope.row.source | sourceFormatter }}</template>
        </el-table-column>
        <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.orderStatus | orderStatusFormater(false)"
            >{{scope.row.orderStatus | orderStatusFormater(true)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审批状态" align="center">
          <template slot-scope="scope">
            <div style="margin-bottom:-20px">
              订单审核
              <el-tag
                style="cursor: pointer;"
                :type="scope.row.approvalStatus|formatType"
                @click="approveOrder(scope.row.id,scope.row.approvalStatus)"
                size="mini"
              >{{ scope.row.approvalStatus|formatStatus}}</el-tag>
              <el-tag v-if="scope.row.auditStatus === 'reject'" type="danger" size="mini">驳回</el-tag>
            </div>
            <el-divider></el-divider>
            <div style="margin-top:-20px">
              物流审核
              <el-tag
                :type="scope.row.exApprovalStatus|formatType"
                size="mini"
              >{{ scope.row.exApprovalStatus|formatStatus}}</el-tag>
              <el-tag v-if="scope.row.exStatus === 'reject'" type="danger" size="mini">驳回</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="amountFee" label="采购总额 /￥" align="center"></el-table-column>
        <el-table-column prop="createUserName" label="创建人" align="center"></el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="getDetailInformation(scope.row.id,true)" type="text" size="small">查看</el-button>
            <el-button @click="exWarehoseFnc(scope.row.id)" type="text" size="small">发货物流</el-button>
            <br />
            <el-button @click="deleteHandle(scope.row.id)" type="text" size="samll">删除</el-button>
            <el-button
              @click="addLogisticsInforBtn(scope.row.id,true)"
              type="text"
              size="small"
            >收货物流</el-button>
            <br />
            <el-button type="text" @click="addChildPurchaseOrder(scope.row.id,scope.row)">添加子采购</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
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
      <!-- 批量操作 -->
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
    </el-card>
    <el-dialog
      :visible.sync="approveOrderVisible"
      @closed="getList"
      :destroy-on-close="true"
      width="70%"
      top="5vh"
    >
      <approval
        :purchaseOrderId="purchaseOrderId"
        :approvalStatus="approvalStatus"
        @updateHandle="myUpdate"
      ></approval>
    </el-dialog>
    <el-dialog @closed="getList" :visible.sync="logisticsVisible" title="物流">
      <add-logistics-infor @addLogisticsInforBtn="addLogisticsInforBtn()" v-model="purchaseOrderId"></add-logistics-infor>
    </el-dialog>
    <el-dialog
      :visible.sync="orderDetailVisible"
      :fullscreen="true"
      @closed="getList"
      :destroy-on-close="true"
      :before-close="orderDetailVisibleCloss"
    >
      <orderDetail v-model="purchaseOrderId"></orderDetail>
    </el-dialog>

    <el-dialog @closed="getList" :visible.sync="exWarehoseVisible" top="1vh">
      <exWarehose v-model="purchaseOrderId"></exWarehose>
    </el-dialog>
  </div>
</template>

<script>
import exWarehose from "@/components/exWarehose/exWarehose";
import { pareTime } from "@/utils/date";
import approval from "../approval/index";
import {
  formatApprovalStatus,
  formatApprovalType,
} from "@/utils/purchaseApprovalStatus";
import orderDetail from "./detail/orderDetail";
import {
  fetchList,
  batchDeleteEntity,
  batchUpdateEntityStatus,
  patchEntity,
  updateEntity,
  deleteEntity,
  getEntity,
} from "@/api/purchaseOrder";
import adminUserInput from "@/components/Admin/adminUserInput";
import { getItemByPurchaseId } from "@/api/purchaseOrderitem";
import purchaseOrderItem from "@/components/PurchaseOrderItem/purchaseOrderItem";
import addLogisticsInfor from "../components/addLogisticsInfor";
const defaultListQuery = {
  otherSN: null,
  pageNum: 1,
  pageSize: 10,
  sn: null,
  orderStatus: null,
  status: null,
  approvalProcess: null,
  temporalInterval: null,
};
const defaultPurchaseStatus = [
  { value: "CREATE", label: "已创建" },
  {
    value: "be_approval",
    label: "待审核",
  },
  {
    value: "be_inspection",
    label: "待验货",
  },
  {
    value: "approved",
    label: "已审核",
  },
  {
    value: "acceptance_inspection",
    label: "已验收",
  },
  {
    value: "be_clerk_audit",
    label: "业务员确认",
  },
  {
    value: "failure",
    label: "采购失败",
  },
  {
    value: "completed",
    label: "完成",
  },
];
const defaultStatus = [
  { label: "全部", value: null },
  { label: "启用", value: "normal" },
  { label: "禁用", value: "freeze" },
  { label: "删除", value: "delete" },
];
export default {
  components: {
    purchaseOrderItem,
    adminUserInput,
    addLogisticsInfor,
    orderDetail,
    approval,
    exWarehose,
  },
  data() {
    return {
      exWarehoseVisible: false,
      orderDetailVisible: false,
      purchaseOrderId: null,
      approvalStatus: "",
      logisticsVisible: false,
      operates: Object.assign([], defaultStatus),
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      selectList: [],
      purchaseList: null,
      operateType: null,
      updateStatus: {
        ids: [],
        status: "",
      },
      purchaseStatus: Object.assign([], defaultPurchaseStatus),
      approveOrderVisible: false,
      isUpdate: false,
      purchaseVisible: false,
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
      purchaseOrderList: [],
    };
  },
  filters: {
    statusFormatter(value) {
      if (value === "normal") return "正常";
      if (value === "freeze") return "禁用";
      if (value === "delete") return "删除";
    },
    orderStatusFormater(val, type) {
      if (type) {
        switch (val) {
          case "CREATE":
            return "已创建";
          case "be_approval":
            return "待审核";
          case "be_inspection":
            return "待验货";
          case "approved":
            return "已审核";
          case "acceptance_inspection":
            return "已验收";
          case "be_clerk_audit":
            return "业务员确认";
          case "failure":
            return "采购失败";
          case "completed":
            return "完成";
        }
      } else {
        switch (val) {
          case "CREATE":
            return "info";
          case "be_approval":
            return "info";
          case "be_inspection":
            return "warning";
          case "approved":
            return "";
          case "be_clerk_audit":
            return "success";
          case "acceptance_inspection":
            return "success";
          case "failure":
            return "采购失败";
          case "danger":
            return "success";
        }
      }
    },
    sourceFormatter(value) {
      if (value === "alibaba") {
        return "1688";
      }
      if (value === "offline") return "线下订单";
      return "多单合并";
    },
    formatStatus(val) {
      return formatApprovalStatus(val);
    },
    formatType(val) {
      return formatApprovalType(val);
    },
    formateTime(val) {
      return pareTime(val);
    },
  },
  created() {
    this.getList();
  },
  methods: {
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSelectionChange(val) {
      var ids = [];
      val.forEach((element) => {
        ids.push(element.id);
      });
      this.selectList = ids;
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      if (val != defaultListQuery.pageSize) {
        this.getList();
      }
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    batchOperation() {
      if (this.selectList.length <= 0) {
        this.$message({
          message: "您尚未选取任意一条记录",
          type: "error",
        });
      } else {
        this.$confirm("是否要确认?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            if (this.operateType === "normal") {
              this.updataHandle(this.selectList, "normal");
            } else if (this.operateType === "freeze") {
              this.updataHandle(this.selectList, "freeze");
            } else if (this.operateType === "delete") {
              this.updataHandle(this.selectList, "delete");
            } else {
              this.$message({
                message: "您尚未选取操作方式",
                type: "error",
              });
            }
          })
          .catch(() => {
            this.$message({
              message: "您取消了操作!",
              type: "info",
            });
          });
      }
    },
    getList() {
      fetchList(this.listQuery).then((response) => {
        this.purchaseOrderList = response.data.list;
        this.total = response.data.total;
      });
    },
    updataHandle(ids, status) {
      this.updateStatus.ids = ids;
      this.updateStatus.status = status;
      batchUpdateEntityStatus(this.updateStatus)
        .then((response) => {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.getList();
        })
        .catch(() => {
          this.$message({
            message: "当前操作失败，请联系相关人员！",
            type: "info",
          });
        });
    },
    approveOrder(id, approvalStatus) {
      this.purchaseOrderId = id;
      this.approvalStatus = approvalStatus;
      this.approveOrderVisible = true;
    },
    deleteHandle(id) {
      this.$confirm("确定删除此采购订单", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteEntity(id)
          .then((response) => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getList();
          })
          .catch(() => {
            this.$message({
              message: "error",
              typee: "error",
            });
          });
      });
    },
    getDetailInformation(id, status) {
      this.purchaseOrderId = id;
      this.orderDetailVisible = true;
    },
    rest() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    inputAdmin(item) {
      this.listQuery.createUserId = item.id;
    },
    addLogisticsInforBtn(id, status) {
      this.purchaseOrderId = id;
      this.logisticsVisible = status;
    },
    orderDetailVisibleCloss() {
      this.purchaseOrderId = null;
      this.orderDetailVisible = false;
    },
    myUpdate() {
      this.getList();
      this.approveOrderVisible = false;
    },
    exWarehoseFnc(val) {
      this.purchaseOrderId = val;
      this.exWarehoseVisible = true;
    },
    approval_status_search(status) {
      this.listQuery.exWarehouseApprovalProcess = null;
      this.listQuery.approvalProcess = status;
      this.getList();
    },
    ex_warehouse_approval_status_search(status) {
      this.listQuery.approvalProcess = null;
      this.listQuery.exWarehouseApprovalProcess = status;
      this.getList();
    },
    addChildPurchaseOrder(id, row) {
      this.$router.push({
        path: "/purchase/createPurchase",
        query: { parentId: id, parentSn: row.sn },
      });
    },
  },
};
</script>

<style>
</style>