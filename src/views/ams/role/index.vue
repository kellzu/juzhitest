<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" ref="searchForm" size="small" label-width="140px">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList"
          size="small"
        >查询搜索</el-button>
        <el-button style="float:right;margin-right: 15px" @click="rest" size="small">重置</el-button>
      </div>
      <div style="margin-top: 15px">
        
          <el-form-item label="角色名称：">
            <el-input class="input-width" v-model="listQuery.name" placeholder="角色名称" @keyup.native.enter="handleSearchList"></el-input>
          </el-form-item>
          <el-form-item label="角色状态：">
            <el-select v-model="listQuery.status" class="input-width" placeholder="角色状态">
              <el-option v-for="(v, k) in roletype" :key="v" :label="k" :value="v"></el-option>
            </el-select>
          </el-form-item>
        
      </div>
      </el-form>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <router-link to="/role/roleDetail">
        <el-button size="mini" class="btn-add">添加角色</el-button>
      </router-link>
    </el-card>

    <el-card class="operate-container" shadow="never">
      <el-table :data="roles" :stripe="true" @selection-change="handleSelectionChange">
        <el-table-column type="selection" label="选择"></el-table-column>
        <el-table-column label="编号">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>

        <el-table-column label="角色名称">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="角色说明">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column label="角色状态">
          <template slot-scope="scope">
            <el-tag :type="statusTypeTags[scope.row.status]">{{scope.row.status | statusFormatter}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色创建时间">
          <template slot-scope="scope">{{scope.row.createTime|formatTime}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="updataRolePermissionpop(scope.row.id)" type="text" size="small">修改权限</el-button>
            <el-button @click="updataRole(scope.row)" type="text" size="small">修改信息</el-button>
            <el-button @click="deleteRoleBtn(scope.row.id)" type="text" size="samll">删除</el-button>
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
    <!-- 修改角色对应的权限 -->
    <el-dialog :visible.sync="dialogUpdataRolePermissionVisible" width="width">
      <el-tree
        :data="permissionlist"
        :default-checked-keys="defaultchecknode"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="permisTree"
        highlight-current
        :props="defaultProps"
      ></el-tree>
      <div slot="footer">
        <el-button @click="dialogUpdataRolePermissionVisible = false">取 消</el-button>
        <el-button type="primary" @click="updataRolePermissionBtn">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  rolelist,
  getRolePerminssion,
  updataRolePermission,
  getRolePage,
  deleteRole,
  updataRoleStatus
} from "@/api/role";
import { pareTime } from "@/utils/date";
import { permissionlist } from "@/api/permission";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null,
  status: null
};
export default {
  name: "roleIndex",
  data() {
    return {
      title: "添加",
      operateType: null,
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
      roletype: {
        启用: 1,
        禁用: 0
      },
      //分页数据
      total: null,
      dialogShowVisible: false,
      dialogUpdataRolePermissionVisible: false,
      roleid: 0,
      permissionlist: [],
      defaultchecknode: [],
      selectList: [],
      initELTreeFlag: false,
      listQuery: Object.assign({}, defaultListQuery),
      roles: [
        {
          id: 0,
          name: "",
          description: "",
          adminCount: 1,
          createTime: "",
          status: 1,
          sort: 0
        }
      ],
      defaultProps: {
        children: "children",
        label: "name"
      },
      statusTypeTags: ["danger", "success"]
    };
  },
  created() {
    this.getRolelist();
    permissionlist().then(response => {
      this.permissionlist = response.data;
    });
  },
  filters: {
    statusFormatter(value) {
      if (value === 1) {
        return "启用";
      }
      return "禁用";
    },
    formatTime(time) {
      return pareTime(time);
    },
    formatType(val) {
      if (val === 0) return "目录";

      if (val === 1) return "菜单";

      if (val === 2) return "按钮";
    }
  },
  methods: {
    getRolelist() {
      getRolePage(this.listQuery).then(response => {
        this.roles = response.data.list;
        this.total = response.data.total;
      });
    },
    deleteRoleBtn(id) {
      this.$confirm("已被使用的角色无法被删除,是否确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteRole(id).then(response => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
        });
      });
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getRolelist();
    },
    handleSelectionChange(val) {
      let array = [];
      for (var item in val) {
        array.push(val[item].id);
      }
      this.selectList = array;
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getRolelist();
    },
    rest() {
      this.listQuery.name = null;
      this.listQuery.status = null;
    },
    deleteRoles(ids) {
      deleteRole(ids).then(response => {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.getRolelist();
      });
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      if (val != defaultListQuery.pageSize) {
        this.getRolelist();
      }
    },
    updataStatus(ids, status) {
      updataRoleStatus(ids, status)
        .then(response => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getRolelist();
        })
        .catch(() => {
          console.log("update status failure!!!");
        });
    },
    batchOperation() {
      if (this.selectList.length <= 0) {
        this.$message({
          message: "您尚未选取任意一条记录",
          type: "error"
        });
      } else {
        this.$confirm("是否要确认?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          if (this.operateType === 0) {
            this.updataStatus(this.selectList, 1);
          } else if (this.operateType === 1) {
            this.updataStatus(this.selectList, 0);
          } else if (this.operateType === 2) {
            this.deleteRoles(this.selectList);
          } else {
            this.$message({
              message: "您尚未选取操作方式",
              type: "error"
            });
          }
        });
      }
    },
    updataRolePermissionpop(roleid) {
      this.roleid = roleid;
      let _self = this;
      getRolePerminssion(roleid).then(response => {
        let permis = response.data;
        let chicknodes = [];
        for (let i in permis) {
          chicknodes.push(permis[i].id);
        }
        if (!this.initELTreeFlag) {
          _self.defaultchecknode = chicknodes;
          _self.initELTreeFlag = true;
        } else {
          _self.$refs.permisTree.setCheckedKeys(chicknodes);
        }
        _self.dialogUpdataRolePermissionVisible = true;
      });
    },
    updataRolePermissionBtn() {
      let nodekeys = this.$refs.permisTree.getCheckedKeys();
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        updataRolePermission(this.roleid, nodekeys).then(response => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
        });
      });
      this.dialogUpdataRolePermissionVisible = false;
    },
    updataRole(roleDetail) {
      this.$router.push({
        path: "/role/roleDetail",
        query: { roleDetail: roleDetail }
      });
    }
  }
};
</script>
<style>
.batchOperation {
  margin-top: 10px;
}
</style>