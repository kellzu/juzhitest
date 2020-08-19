<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" size="small">下载Excel</el-button>
        <el-button
          style="float:right;margin-right: 15px"
          type="primary"
          @click="handleSearchList()"
          size="small"
        >查询搜索</el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="昵称或first name: ">
            <el-input
              v-model="listQuery.name"
              @keyup.native.enter="handleSearchList()"
              class="input-width"
              placeholder="昵称或first name"
              v-on:blur.enter="getList()"
            ></el-input>
          </el-form-item>
          <el-form-item label="last name: ">
            <el-input
              v-model="listQuery.lastName"
              @keyup.native.enter="handleSearchList()"
              class="input-width"
              placeholder="last name: "
              v-on:blur.enter="getList()"
            ></el-input>
          </el-form-item>
          <el-form-item label="业务员查询">
            <AdminUser v-model="salesmanName" @inputAdmin="inputAdmin"></AdminUser>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select
              v-model="listQuery.status"
              placeholder="全部"
              clearable
              class="input-width"
              @change.enter="getList()"
            >
              <el-option v-for="(v, k) in statusMapQuery" :key="k" :label="v" :value="k"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleEdit(null, null, 2)">添加客户</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="homeCustomerTable"
        :data="list"
        style="width: 100%;"
        :stripe="true"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
        v-loading="listLoading"
        border
      >
        <el-table-column type="selection" width="60" align="center" />
        <!--<el-table-column label="ID" width="40" align="center" prop="id" />-->
        <el-table-column label="名字" align="center">
          <template slot-scope="scope">{{scope.row | customerNameFormat}}</template>
        </el-table-column>
        <el-table-column label="别名" align="center" width="120" prop="nickName" />
        <el-table-column label="邮箱" align="center" prop="email" />
        <!--  <el-table-column label="公司" align="center" width="120" prop="company" />-->
        <!--<el-table-column label="座机号" align="center" width="120" prop="phone" />-->
        <el-table-column label="等级" align="center" width="50" prop="level" />
        <el-table-column label="交易成功率" align="center" width="100">
          <template slot-scope="scope">{{scope.row | succTransRateFormat}}</template>
        </el-table-column>
        <el-table-column label="总销售单数" align="center" width="100" prop="quantitySale">
          <template slot-scope="scope">{{scope.row.succNumTrans | quantityFormat}}</template>
        </el-table-column>
        <el-table-column label="销售总金额" align="center" width="100" prop="totalSale">
          <template slot-scope="scope">{{scope.row.totalSale | amountFormat}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.gmtCreate | gmtCreateTimeFormat}}</template>
        </el-table-column>
        <el-table-column label="状态" width="150" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleRecommendStatusStatusChange(scope.$index, scope.row)"
              active-value="normal"
              inactive-value="freeze"
              :active-text="statusMap['normal']"
              :inactive-text="statusMap['freeze']"
              v-model="scope.row.status"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="handleToReceiveAddress(scope.$index, scope.row)"
            >收货地址</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row, 0)">查看</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row, 1)">修改</el-button>
            <!-- <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row, 2)">删除</el-button>-->
            <el-button size="mini" type="text" @click="createCustomerOrder(scope.row)">创建客户订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
        @click="handleBatchOperate()"
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
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog
      :title="dialogTitle + '设置'"
      :visible.sync="sortDialogVisible"
      @closed="handlerClosed"
      :close-on-click-modal="false"
      width="60%"
    >
      <customerInforDetail :customerId="customerId" :showFlag="dialogTitle"></customerInforDetail>
    </el-dialog>
  </div>
</template>
<script>
import customerInforDetail from "../components/customerInfoDetail";
import { formatDate } from "@/utils/date";
import { STATUS_MAP, STATUS_MAP_QUERY } from "@/utils/status";
import {
  fetchList,
  createEntity,
  deleteEntity,
  getEntity,
  updateEntity,
  patchEntity,
  batchUpdateEntityStatus,
  batchDeleteEntity,
} from "@/api/customer";
import AdminUserInput from "@/components/Admin/adminUserInput";
import AdminUser from "@/components/Admin/adminUser";
import CustomerReceiveAddressSelect from "@/components/Customer/customerReceiveAddressSelect";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null,
  createId: null,
  lastName: null,
  status: null,
};
export default {
  name: "homeCustomerList",
  components: {
    AdminUserInput,
    AdminUser,
    CustomerReceiveAddressSelect,
    customerInforDetail,
  },
  data() {
    return {
      salesmanName: "",
      fits: ["fill", "contain", "cover", "none", "scale-down"],
      listQuery: Object.assign({}, defaultListQuery),
      statusMapQuery: Object.assign({}, STATUS_MAP_QUERY),
      statusMap: Object.assign({}, STATUS_MAP),
      list: [],
      total: null,
      listLoading: false,
      multipleSelection: [],
      operates: [
        {
          label: "启用",
          value: 0,
        },
        {
          label: "禁用",
          value: 1,
        },
        {
          label: "删除",
          value: 2,
        },
      ],
      operateType: null,
      customerId: null,
      sortDialogVisible: false,
      viewFlag: false,
      editFlag: false,
      addFlag: true,
      dialogItemStyleObj: {},
      dialogTitle: "添加",
      viewElRowStyle: {
        height: "60px",
        margin: "10px",
      },
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  filters: {
    gmtCreateTimeFormat(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    statusFormat(status) {
      return statusMap[status];
    },
    quantityFormat(quantity) {
      if (quantity != null || quantity != undefined) {
        return quantity;
      }
      return 0;
    },
    amountFormat(amount) {
      if (amount != null || amount != undefined) {
        return amount;
      }
      return 0;
    },
    succTransRateFormat(entity) {
      if (!entity.numTrans) {
        return 0;
      }
      if (!entity.succNumTrans) {
        entity.succNumTrans = 0;
      }
      // 保留2位小数
      return (entity.succNumTrans / entity.numTrans).toFixed(2);
    },
    customerNameFormat(row) {
      let name = row.firstName;
      if (row.lastName) {
        name = `${name} ${row.lastName}`;
      }
      return name;
    },
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.status === 0) {
        return "deleted-row";
      }
      return "normal-row";
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    handleRecommendStatusStatusChange(index, row) {
      this.updateEntityStatus(row.id, row.status);
    },
    handleDelete(index, row) {
      let ids = [row.id];
      this.multiDeleteEntities(ids);
    },
    handleBatchOperate() {
      if (this.multipleSelection < 1) {
        this.$message({
          message: "请选择一条记录",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      let ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id);
      }
      if (this.operateType === 0) {
        //启用
        this.multiUpdateEntityStatus(ids, "normal");
      } else if (this.operateType === 1) {
        //禁用
        this.multiUpdateEntityStatus(ids, "freeze");
      } else if (this.operateType === 2) {
        //删除
        this.multiDeleteEntities(ids);
      } else {
        this.$message({
          message: "请选择批量操作类型",
          type: "warning",
          duration: 1000,
        });
        return;
      }
    },
    handleEdit(index, row, op) {
      // op=0 查看，op=1 修改, op=2 添加
      if (op === 0 || op === null || op === undefined) {
        this.customerId = row.id;
        this.dialogTitle = "查看";
        this.viewFlag = true;
        this.editFlag = false;
        this.addFlag = false;
      } else if (op === 1) {
        this.customerId = row.id;
        this.dialogTitle = "修改";
        this.viewFlag = false;
        this.editFlag = true;
        this.addFlag = false;
      } else {
        this.dialogTitle = "添加";
        this.viewFlag = false;
        this.editFlag = false;
        this.addFlag = true;
      }
      this.sortDialogVisible = true;
    },
    handleToReceiveAddress(index, row) {
      this.$router.push({
        name: "customerReceiveAddress",
        query: { customerId: row.id },
      });
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    updateEntityStatus(id, status) {
      let satusLabel = status === 1 ? "启用" : "禁用";
      this.$confirm(`是否${satusLabel}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = new URLSearchParams();
          let data = {
            ids: [id],
            status: status,
          };
          batchUpdateEntityStatus(data).then((response) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "错误，已取操作，请联系相关人员!",
          });
          this.getList();
        });
    },
    multiUpdateEntityStatus(ids, status) {
      let satusLabel = status === 1 ? "启用" : "禁用";
      this.$confirm(`是否确定${satusLabel}这些账户?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            ids: ids,
            status: status,
          };
          batchUpdateEntityStatus(data).then((response) => {
            this.getList();
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "错误，已取操作，请联系相关人员!",
          });
          this.getList();
        });
    },
    multiDeleteEntities(ids) {
      this.$confirm("是否要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          batchDeleteEntity(ids).then((response) => {
            this.getList();
            this.$message({
              type: "success",
              message: "删成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "错误，批量删除账户失败，请联系相关人员",
          });
        });
    },
    createCustomerOrder(row) {
      this.$router.push({
        path: "/oms/addCustomerOrder",
        query: {
          customerId: row.id,
          customerName: row.firstName + " " + row.lastName,
        },
      });
    },
    inputAdmin(val) {
      this.listQuery.createId = val;
    },
    handlerClosed() {
      this.getList();
      this.customerId = null;
    },
  },
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
