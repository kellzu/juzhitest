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
          <el-form-item label="名称">
            <el-input
              v-model="listQuery.name"
              @keyup.native.enter="handleSearchList()"
              class="input-width"
              placeholder="商铺名或拼音名或英文名"
              v-on:blur.enter="getList()"
            ></el-input>
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
      <el-button size="mini" class="btn-add" @click="handleEdit(null, null, 2)">添加商铺</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="homeAdminTable"
        :data="list"
        style="width: 100%;"
        :stripe="true"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
        v-loading="listLoading"
        border
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="编号" align="center" prop="id" />

        <el-table-column label="商铺名" align="center" width="240" prop="name">
          <template slot-scope="scope">
            <p>
              <span>{{scope.row.name}}</span>
            </p>
            <p>
              <a :href="scope.row.website" target="_blank">
                <span>{{scope.row.enName}}</span>
              </a>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="缩写" align="center" prop="shortName" />
        <!-- <el-table-column label="法人" align="center" width="120" prop="juridicalPerson" />-->
        <el-table-column label="主账号" align="center" prop="primaryAccount" />
        <el-table-column label="商铺负责人" align="center">
          <template slot-scope="scope">{{scope.row.ownerEntity.username }}</template>
        </el-table-column>
        <el-table-column label="总销售单数" align="center" prop="quantitySale">
          <template slot-scope="scope">{{scope.row.quantitySale | quantityFormat}}</template>
        </el-table-column>

        <el-table-column label="总销售金额" align="center" prop="totalSale">
          <template slot-scope="scope">{{scope.row.totalSale | amountFormat}}</template>
        </el-table-column>
        <!-- <el-table-column label="创建时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.gmtCreate | formatCreateTime}}</template>
        </el-table-column>-->
        <el-table-column label="状态" align="center">
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
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row, 0)">查看</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row, 1)">修改</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row, 2)">删除</el-button>
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

    <el-dialog :title="dialogTitle + '设置'" :visible.sync="sortDialogVisible" width="50%">
      <el-form :model="dataInstance" label-width="150px" ref="form" :rules="rules">
        <el-form-item label="商铺名：" prop="name">
          <el-input
            v-model="dataInstance.name"
            :style="dialogItemStyleObj"
            :readonly="viewFlag"
            placeholder="例:亚马逊商铺"
          ></el-input>
        </el-form-item>
        <el-form-item label="英文名：" prop="enName">
          <el-input v-model="dataInstance.enName" :style="dialogItemStyleObj" :readonly="viewFlag"></el-input>
        </el-form-item>
        <el-form-item label="商铺缩写：" prop="shortName">
          <el-input
            v-model="dataInstance.shortName"
            :style="dialogItemStyleObj"
            :readonly="viewFlag"
          ></el-input>
        </el-form-item>
        <el-form-item label="商铺法人：" prop="juridicalPerson">
          <el-input
            v-model="dataInstance.juridicalPerson"
            :style="dialogItemStyleObj"
            :readonly="viewFlag"
          ></el-input>
        </el-form-item>
        <el-form-item label="主账号：" prop="primaryAccount">
          <el-input
            v-model="dataInstance.primaryAccount"
            :style="dialogItemStyleObj"
            :readonly="viewFlag"
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺网址：" prop="website">
          <el-input v-model="dataInstance.website" :style="dialogItemStyleObj" :readonly="viewFlag"></el-input>
        </el-form-item>
        <el-form-item label="商铺负责人：" prop="ownerName">
          <admin-user-input
            :style="dialogItemStyleObj"
            v-model="dataInstance.ownerName"
            @input="handleSelect"
            :readonly="viewFlag"
          ></admin-user-input>
        </el-form-item>
        <el-form-item label="业务员: " prop="members">
          <el-transfer
            v-model="dataInstance.members"
            v-loading="listShopMemberLoading"
            :filterable="true"
            filter-placeholder="请输入用户英文名"
            :titles="memberTitles"
            :data="shopMembers"
          ></el-transfer>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-switch
            active-value="normal"
            inactive-value="freeze"
            :active-text="statusMap['normal']"
            :inactive-text="statusMap['freeze']"
            v-model="dataInstance.status"
            :disabled="viewFlag"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            v-model="dataInstance.remark"
            :style="dialogItemStyleObj"
            type="textarea"
            :readonly="viewFlag"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="sortDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleUpdateOrSave" size="small" v-if="!viewFlag">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from "@/utils/date";
import { STATUS_MAP, STATUS_MAP_QUERY } from "@/utils/status";
import {
  fetchList,
  createEntity,
  deleteEntity,
  getEntity,
  updateEntity,
  getShopMembersApi,
  batchUpdateEntityStatus,
  batchDeleteEntity
} from "@/api/shop";
import { getAdminIdNames } from "@/api/admin";
import SingleUpload from "@/components/Upload/singleUpload";
import AdminUserInput from "@/components/Admin/adminUserInput";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null,
  status: null
};
export default {
  name: "homeAdminList",
  components: { SingleUpload, AdminUserInput },
  data() {
    return {
      fits: ["fill", "contain", "cover", "none", "scale-down"],
      listQuery: Object.assign({}, defaultListQuery),
      statusMapQuery: Object.assign({}, STATUS_MAP_QUERY),
      statusMap: Object.assign({}, STATUS_MAP),
      list: null,
      total: null,
      listLoading: false,
      listShopMemberLoading: false,
      multipleSelection: [],
      shopMembers: [],
      memberTitles: ["所有用户", "成员"],
      operates: [
        {
          label: "启用",
          value: 0
        },
        {
          label: "禁用",
          value: 1
        },
        {
          label: "删除",
          value: 2
        }
      ],
      operateType: null,
      selectDialogVisible: false,
      sortDialogVisible: false,
      dataInstance: {
        name: "",
        shortName: "",
        enName: "",
        website: "",
        juridicalPerson: "",
        primaryAccount: "",
        owner: "",
        ownerName: "",
        status: "freeze",
        remark: "",
        members: [],
        id: null
      },
      viewFlag: true,
      editFlag: false,
      newData: Object.assign({}, this.dataInstance),
      idNameList: [],
      dialogItemStyleObj: {
        width: "300px"
      },
      dialogTitle: "添加",
      viewElRowStyle: {
        height: "60px",
        margin: "10px"
      },
      rules: {
        name: [{ trigger: "blur", required: true, message: "请输入商铺名" }],
        shortName: [
          { trigger: "blur", required: true, message: "请输入商铺缩写名称" }
        ],
        enName: [
          { trigger: "blur", required: true, message: "请输入商铺英文名" }
        ],
        website: [
          { trigger: "blur", required: true, message: "请输入商铺网址" }
        ],
        juridicalPerson: [
          { trigger: "blur", required: true, message: "请输入商铺法人" }
        ],
        primaryAccount: [
          { trigger: "blur", required: true, message: "请输入商铺主账号" }
        ],
        website: [
          { trigger: "blur", required: true, message: "请输入商品网址" }
        ],
        ownerName: [
          {
            type: "string",
            trigger: "change",
            required: true,
            message: "请选择商铺组长"
          }
        ],
        status: [{ trigger: "change", required: true, message: "请选择状态" }]
      }
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  filters: {
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatStatus(status) {
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
    }
  },
  methods: {
    getAllMembers() {
      this.listShopMemberLoading = true;
      getAdminIdNames({ username: "" }).then(resp => {
        let data = resp.data;
        let members = [];
        data.forEach(e => {
          if (e.username !== "admin" && e.username !== "test") {
            members.push({
              id: e.id,
              key: e.id,
              value: e.id,
              label: e.username,
              note: e.note
            });
          }
        });
        this.shopMembers = members;
        this.listShopMemberLoading = false;
      });
    },
    getShopMembers(id) {
      this.listShopMemberLoading = true;
      getShopMembersApi(id).then(resp => {
        if (resp.data && resp.data.length > 0) {
          var members = [];
          resp.data.forEach(e => {
            members.push(e.memberId);
          });
          this.dataInstance.members = members;
        }
        this.listShopMemberLoading = false;
      });
    },
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
      this.updateAdminStatus(row.id, row.status);
    },
    handleDelete(index, row) {
      let ids = [row.id];
      this.multiDeleteAdmins(ids);
    },
    handleBatchOperate() {
      if (this.multipleSelection < 1) {
        this.$message({
          message: "请选择一条记录",
          type: "warning",
          duration: 1000
        });
        return;
      }
      let ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id);
      }
      if (this.operateType === 0) {
        //启用
        this.multiUpdateAdminStatus(ids, "normal");
      } else if (this.operateType === 1) {
        //禁用
        this.multiUpdateAdminStatus(ids, "freeze");
      } else if (this.operateType === 2) {
        //删除
        this.multiDeleteAdmins(ids);
      } else {
        this.$message({
          message: "请选择批量操作类型",
          type: "warning",
          duration: 1000
        });
        return;
      }
    },
    handleAddUser() {
      this.selectDialogVisible = true;
      this.getDialogList();
    },
    handleSelectSearch() {
      this.getDialogList();
    },
    handleDialogSizeChange(val) {
      this.dataInstance.listQuery.pageNum = 1;
      this.dataInstance.listQuery.pageSize = val;
      this.getDialogList();
    },
    handleDialogCurrentChange(val) {
      this.dataInstance.listQuery.pageNum = val;
      this.getDialogList();
    },
    handleDialogSelectionChange(val) {
      this.dataInstance.multipleSelection = val;
    },
    handleEdit(index, row, op) {
      if (this.shopMembers.length <= 0) {
        this.getAllMembers();
      }
      if (row && row.id) {
        this.getShopMembers(row.id);
      }
      // op=0 查看，op=1 修改, op=2 添加
      if (op === 0 || op === null || op === undefined) {
        this.dialogTitle = "查看";
        this.viewFlag = true;
        this.editFlag = false;
      } else if (op === 1) {
        this.dialogTitle = "修改";
        this.viewFlag = false;
        this.editFlag = true;
      } else {
        this.dialogTitle = "添加";
        this.viewFlag = false;
        this.editFlag = false;
      }
      this.sortDialogVisible = true;
      if (index != null && index >= 0) {
        this.dataInstance = Object.assign({}, this.dataInstance, row);
        // 赋值ownerName
        if (row.ownerEntity && row.ownerEntity.username) {
          this.dataInstance.ownerName = row.ownerEntity.username;
        }
        this.dataInstance.id = row.id;
        // 加载商铺成员信息
      } else {
        if (this.dataInstance.id != null) {
          this.dataInstance = Object.assign({}, this.newData);
        }
      }
    },
    handleUpdateOrSave() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.updateOrSave();
        } else {
          this.$message({
            message: "填写完必填项",
            type: "error",
            duration: 1000
          });
          return false;
        }
      });
    },
    updateOrSave() {
      this.$confirm(`是要${this.dialogTitle}?`, "提示", {
        confirmButtonTex: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.dialogTitle === "修改") {
          updateEntity(this.dataInstance.id, this.dataInstance).then(
            response => {
              this.sortDialogVisible = false;
              this.getList();
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.dataInstance = Object.assign({}, this.newData);
            }
          );
        } else {
          createEntity(this.dataInstance).then(response => {
            this.sortDialogVisible = false;
            this.getList();
            this.$message({
              type: "success",
              message: "添加成功"
            });
            this.dataInstance = Object.assign({}, this.newData);
          });
        }
      });
    },
    handleSelect(item) {
      this.dataInstance.ownerName = item.value;
      if (item) {
        this.dataInstance.owner = item.id;
        this.dataInstance.ownerName = item.value;
      } else {
        this.dataInstance.ownerName = "";
        this.dataInstance.ownerName = "";
      }
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    updateAdminStatus(id, status) {
      let satusLabel = status === 1 ? "启用" : "禁用";
      this.$confirm(`是否${satusLabel}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = new URLSearchParams();
          let data = {
            ids: [id],
            status: status
          };
          batchUpdateEntityStatus(data).then(response => {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "错误，已取操作，请联系相关人员!"
          });
          this.getList();
        });
    },
    multiUpdateAdminStatus(ids, status) {
      let satusLabel = status === 1 ? "启用" : "禁用";
      this.$confirm(`是否确定${satusLabel}这些账户?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            ids: ids,
            status: status
          };
          batchUpdateEntityStatus(data).then(response => {
            this.getList();
            this.$message({
              type: "success",
              message: "修改成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "错误，已取操作，请联系相关人员!"
          });
          this.getList();
        });
    },
    multiDeleteAdmins(ids) {
      this.$confirm("是否要删除这条商铺信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          batchDeleteEntity(ids).then(response => {
            this.getList();
            this.$message({
              type: "success",
              message: "删成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "错误，批量删除账户失败，请联系相关人员"
          });
        });
    },
    getDialogList() {
      fetchList(this.dataInstance.listQuery).then(response => {
        this.dataInstance.list = response.data.list;
        this.dataInstance.total = response.data.total;
      });
    }
  }
};
</script>
<style>
/* .el-table .deleted-row {
  background: #909399;
} */
</style>
