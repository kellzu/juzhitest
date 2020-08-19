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
          <el-form-item label="用户名">
            <el-input
              v-model="listQuery.username"
              class="input-width"
              placeholder="用户名或昵称"
              @keyup.native.enter="handleResetSearch()"
              @blur="getList"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input
              v-model="listQuery.email"
              class="input-width"
              placeholder="邮箱"
              @keyup.native.enter="handleResetSearch()"
              @blur="getList"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户状态：">
            <el-select
              v-model="listQuery.status"
              placeholder="全部"
              clearable
              class="input-width"
              @change="getList"
            >
              <el-option
                v-for="item in userStatuss"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleEdit(null, null, 2)">添加用户</el-button>
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
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column label="编号" width="80" align="center" prop="id" />
        <el-table-column label="用户名" align="center" width="120" prop="username" />
        <el-table-column label="英文名" align="center" width="120" prop="nickName" />
        <el-table-column label="中文名" align="center" width="120" prop="note" />
        <el-table-column label="邮箱" align="center" width="180" prop="email" />
        <el-table-column label="创建时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="最后一次登录时间时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="头像" width="120" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.icon" style="height: 80px;" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="200" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleRecommendStatusStatusChange(scope.$index, scope.row)"
              :active-value=1
              active-text="启用"
              :inactive-value=0
              inactive-text="禁用"
              v-model="scope.row.status"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row, 0)">查看</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row, 1)">修改</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleSendResetPasswordEmail(scope.$index, scope.row)"
            >重置密码</el-button>
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
        :page-sizes="[10,20,30,40,50]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 用户信息弹框 -->
    <el-dialog
      @closed="dialogColsed()"
      :title="dialogTitle + '用户设置'"
      :visible.sync="sortDialogVisible"
      destroy-on-close
    >
      <el-dialog title="修改角色" @open="defaultOption" :visible.sync="innerVisible" append-to-body>
        <el-transfer
          style="text-align: left;"
          v-model="value"
          filterable
          :format="{noChecked: '${total}', hasChecked: '${checked}/${total}'}"
          :render-content="renderFunc"
          :titles="['角色列表', '用户角色']"
          :button-texts="['删除', '添加']"
          @change="handleChange"
          :data="roleList"
        ></el-transfer>
        <span slot="footer">
          <el-button @click="innerVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="handleChangeRole" size="small">确定修改</el-button>
        </span>
      </el-dialog>
      <el-form :model="dataInstance" ref="createAdminForm" label-width="120px" :rules="rules">
        <el-card shadow="never">
          <div>
            <el-form-item label="头像：" prop="icon">
              <template v-if="viewFlag">
                <el-image :src="dataInstance.icon" style="width: 80px;" />
              </template>
              <template v-else>
                <single-upload v-model="dataInstance.icon" :style="dialogItemStyleObj"></single-upload>
              </template>
            </el-form-item>

            <el-form-item label="角色标签：">
              <el-tag v-for="item in roleTagList" :key="item.id" effect="plain">{{ item.name }}</el-tag>
            </el-form-item>
            <el-form-item v-show="!viewFlag" label>
              <el-button size="small" type="primary" @click="innerVisible=true">修改角色</el-button>
            </el-form-item>
            <el-dialog
              placement="right"
              width="400"
              trigger="click"
              @open="showAdminPermission"
              :visible.sync="innerPermissionVisible"
              append-to-body
            >
              <el-table :data="adminPermissionList">
                <el-table-column prop="name" label="权限名称"></el-table-column>
              </el-table>
            </el-dialog>
            <el-form-item v-show="viewFlag" label="查看权限：">
              <el-button @click="innerPermissionVisible=true">权限详情</el-button>
            </el-form-item>
          </div>
        </el-card>
        <el-card shadow="never">
          <el-form-item label="用户名：" prop="username">
            <el-input
              v-model="dataInstance.username"
              :style="dialogItemStyleObj"
              :disabled="editFlag"
              :readonly="viewFlag"
              placeholder="例:张三->san.zhang"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input
              v-model="dataInstance.email"
              :style="dialogItemStyleObj"
              type="email"
              :disabled="editFlag"
              :readonly="viewFlag"
            ></el-input>
          </el-form-item>
          <el-form-item label="英文名：" prop="nickName">
            <el-input v-model="dataInstance.nickName" :style="dialogItemStyleObj"></el-input>
          </el-form-item>
          <!--
          <el-form-item label="密码" prop="password" v-if="!viewFlag">
            <el-input
              v-model="dataInstance.password"
              :style="dialogItemStyleObj"
              type="password"
              :show-password="true"
            ></el-input>
          </el-form-item>
          -->
          <el-form-item label="状态：" prop="status">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
              v-model="dataInstance.status"
              :disabled="viewFlag"
            ></el-switch>
          </el-form-item>
          <el-form-item label="中文名：">
            <el-input
              v-model="dataInstance.note"
              :style="dialogItemStyleObj"
              type="textarea"
              :readonly="viewFlag"
            ></el-input>
          </el-form-item>
        </el-card>
      </el-form>
      <span slot="footer">
        <el-button @click="sortDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleUpdateOrSave" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from "@/utils/date";
import {
  fetchList,
  createAdmin,
  getAdmin,
  updateAdmin,
  updateAdminStatus,
  batchUpdateAdminStatus,
  getAdminRole,
  getAdminPermission,
  updateAdminRole
} from "@/api/admin";

import { resetPasswordEmail } from "@/api/resetPassword";
import { rolelist } from "@/api/role";
import SingleUpload from "@/components/Upload/singleUpload";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  email: null,
  username: null,
  status: null
};
const defaultUserStatuss = [
  {
    label: "禁用",
    value: 0
  },
  {
    label: "启用",
    value: 1
  }
];
export default {
  name: "homeAdminList",
  components: { SingleUpload },

  data() {
    return {
      innerVisible: false,
      value: [],
      renderFunc(h, option) {
        return <span>{option.label}</span>;
      },
      fits: ["fill", "contain", "cover", "none", "scale-down"],
      listQuery: Object.assign({}, defaultListQuery),
      userStatuss: Object.assign({}, defaultUserStatuss),
      list: null,
      total: null,
      innerPermissionVisible: false,
      listLoading: false,
      multipleSelection: [],
      operates: [
        {
          label: "启用",
          value: 0
        },
        {
          label: "禁用",
          value: 1
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      roleTagList: [],
      roleList: [],
      adminPermissionList: [],
      operateType: null,
      selectDialogVisible: false,
      sortDialogVisible: false,
      dataInstance: {
        username: "",
        nickName: "",
        password: "",
        email: "",
        icon: "",
        note: "",
        status: 0,
        id: null,
        roleIds: []
      },
      checkedAdminId: null,
      viewFlag: true,
      editFlag: false,
      newData: Object.assign({}, this.dataInstance),
      dialogItemStyleObj: {
        width: "300px"
      },
      dialogTitle: "添加",
      viewElRowStyle: {
        height: "60px",
        margin: "10px"
      },
      rules: {
        icon: [{ trigger: "blur", required: true, message: "请上传头像" }],
        username: [
          {
            trigger: "blur",
            required: true,
            message: "请输入用户名，尽量使用英文书写方式，例如: 张三->san.zhang"
          }
        ],
        email: [
          {
            type: "email",
            trigger: "blur",
            required: true,
            message: "请输入邮箱"
          }
        ],
        nickname: [{ trigger: "blur", required: false }],
        status: [{ trigger: "change", required: true, message: "请选择状态" }]
        // password: [{ trigger: "blur", required: true, message: "请输入密码" }]
      }
    };
  },
  computed: {},
  created() {
    this.getList();
    rolelist().then(response => {
      var roleDate = response.data;
      const data = [];
      for (const i in roleDate) {
        const element = roleDate[i];
        data.push({
          key: element.id,
          label: `${element.name}`
        });
      }
      this.roleList = data;
    });
  },
  filters: {
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatStatus(status) {
      if (status === 1) {
        return "启用";
      } else {
        return "禁用";
      }
    }
  },
  methods: {
    dialogColsed() {
      this.roleTagList = Object.assign([], []);
      this.value = Object.assign([], []);
      this.adminPermissionList = Object.assign([], []);
      this.checkedAdminId = null;
    },
    defaultOption() {
      var defaultRoleTagList = [];
      this.roleTagList.forEach(element => {
        defaultRoleTagList.push(element.id);
      });
      this.value = defaultRoleTagList;
    },
    handleChange(value, direction, movedKeys) {},
    handleChangeRole() {
      if (this.checkedAdminId != null) {
        this.$confirm("确认修改用户角色").then(() => {
          updateAdminRole(this.checkedAdminId, this.value).then(response => {
            this.$message({
              message: "修改成功",
              type: "success",
              duration: 1000
            });
            getAdminRole(this.checkedAdminId).then(response => {
              this.roleTagList = response.data;
            });
            this.innerVisible = false;
          });
        });
      } else {
        let defaultCheck = [];
        this.roleList.forEach(element => {
          if (this.value.indexOf(element.key) >= 0) {
            defaultCheck.push({ id: element.key, name: element.label });
          }
        });
        this.roleTagList = defaultCheck;
        this.$message({
          message: "角色已选择",
          type: "success",
          duration: 1000
        });
        this.innerVisible = false;
      }
    },
    tableRowClassName({ row, rowIndex }) {
      // console.log(row.status, rowIndex);
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
    handleBatchOperate() {
      if (this.multipleSelection < 1) {
        this.$message({
          message: "请选择一条记录",
          type: "warning",
          duration: 1000
        });
        return;
      }
      // 完成批量修改功能
      let ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id);
      }
      if (this.operateType === 0) {
        //启用
        this.multiUpdateAdminStatus(ids, 1);
      } else if (this.operateType === 1) {
        //禁用
        this.multiUpdateAdminStatus(ids, 0);
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
    showAdminPermission() {
      getAdminPermission(this.checkedAdminId).then(response => {
        this.adminPermissionList = response.data;
      });
    },
    handleEdit(index, row, op) {
      if (row != null) {
        this.checkedAdminId = row.id;
        // 获取 用户的角色信息
        // op=0 查看，op=1 修改, op=2 添加
        getAdminRole(row.id).then(response => {
          this.roleTagList = response.data;
        });
      }
      if (op === 0 || op === null || op === undefined) {
        this.dialogTitle = "查看";
        this.viewFlag = true;
        this.editFlag = false;
      } else if (op === 1) {
        this.dialogTitle = "修改";
        this.viewFlag = false;
        this.editFlag = true;
      } else if (op === 2) {
        this.dialogTitle = "添加";
        this.viewFlag = false;
        this.editFlag = false;
      }
      this.sortDialogVisible = true;
      if (index != null && index >= 0) {
        this.dataInstance = Object.assign({}, this.dataInstance, row);
        this.dataInstance.password = "******";
        // console.log("进入条件" + row);
        this.dataInstance.id = row.id;
      } else {
        if (this.dataInstance.id != null) {
          this.dataInstance = Object.assign({}, this.newData);
        }
      }
    },
    handleSendResetPasswordEmail(index, row) {
      let url = new URL(window.location.href);
      let data = {
        username: row.username,
        email: row.email,
        urlPrefix: `${url.origin}/resetPassword`
      };
      resetPasswordEmail(data).then(resp => {
        this.$message({
          type: "success",
          message: resp.message,
          duration: 1000
        });
      });
    },
    updateOrSave() {
      this.$confirm(`是要${this.dialogTitle}?`, "提示", {
        confirmButtonTex: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.dialogTitle === "修改") {
          updateAdmin(this.dataInstance.id, this.dataInstance).then(
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
          this.$refs.createAdminForm.validate(val => {
            if (val) {
              this.dataInstance.roleIds = this.value;
              createAdmin(this.dataInstance).then(response => {
                this.sortDialogVisible = false;
                this.getList();
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
                this.dataInstance = Object.assign({}, this.newData);
              });
            } else {
              this.$message({
                type: "error",
                message: "参数填写不正确"
              });
            }
          });
        }
      });
    },
    handleUpdateOrSave() {
      this.$refs["createAdminForm"].validate(valid => {
        if (valid) {
          this.updateOrSave();
        } else {
          this.$message({
            message: "请填写完必填项",
            type: "error",
            duration: 1000
          });
          return false;
        }
      });
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
      this.$confirm(`是否${satusLabel}该账户状态?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = new URLSearchParams();
          let adminObj = {
            status: status
          };
          updateAdminStatus(id, adminObj).then(response => {
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
          batchUpdateAdminStatus(data).then(response => {
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