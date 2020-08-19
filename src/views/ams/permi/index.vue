<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>权限列表</span>
      <el-button size="mini" class="btn-add" @click="toCreatePermi(null)">添加权限</el-button>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-table
        :data="permission"
        style="width: 100%"
        row-key="id"
        border
        @selection-change="handleSelectionChange"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="权限代码">
          <template slot-scope="scope">{{scope.row.value}}</template>
        </el-table-column>
        <el-table-column label="权限状态">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              active-text="开启"
              :inactive-value="0"
              inactive-text="关闭"
              v-model="scope.row.status"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="权限uri">
          <template slot-scope="scope">{{scope.row.uri}}</template>
        </el-table-column>
        <el-table-column label="创建日期">
          <template slot-scope="scope">{{scope.row.createTime|formatTime}}</template>
        </el-table-column>
        <el-table-column label="权限类型">
          <template slot-scope="scope">
            <el-tag type="info">{{scope.row.type|formatType}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="toCreatePermi(scope.row)" size="small">添加子权限</el-button>
            <el-button @click="updatePermission(scope.row)" type="text" size="small">修改</el-button>
            <el-button type="text" @click="deletePermissionBtn(scope.row.id)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>
<script>
import {
  permissionlist,
  deletePermissions,
  createpermission,
  updatePermission,
  updatePermissionStatus
} from "@/api/permission";
import { pareTime } from "@/utils/date";
export default {
  name: "permilist",
  data() {
    return {
      multipleSelection: [],
      newPermissionData: {
        ids: [],
        status: 0
      },
      operateType: 0,
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
      permission: [
        {
          id: 1,
          pid: 0,
          name: "商品",
          value: null,
          icon: null,
          type: 0,
          uri: "/role/detail",
          status: 1,
          createTime: "2018-09-29T08:15:14.000+0000",
          sort: 0
        }
      ],
      listLoading: false
    };
  },
  filters: {
    formatTime(time) {
      return pareTime(time);
    },
    formatType(val) {
      if (val === 0) return "目录";

      if (val === 1) return "菜单";

      if (val === 2) return "按钮";
    }
  },
  created() {
    this.getpermissionlist();
  },
  methods: {
    getpermissionlist() {
      permissionlist().then(response => {
        this.permission = response.data;
      });
    },
    updatePermission(permiDetail) {
      this.$router.push({
        path: "/role/permissionDetail",
        query: { msg: "修改权限信息", code: 1, permi: permiDetail }
      });
    },
    deletePermissionBtn(ids) {
      this.$confirm("正在使用的权限无法被删除,是否确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deletePermissions(ids).then(response => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getpermissionlist();
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    batchOperation() {
      if (this.multipleSelection.length <= 0) {
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
          var idsList = [];
          this.multipleSelection.forEach(element => {
            idsList.push(element.id);
          });
          this.newPermissionData.ids = idsList + "";
          if (this.operateType === 0) {
            this.newPermissionData.status = 1;
            this.updataStatus(this.newPermissionData);
          } else if (this.operateType === 1) {
            this.newPermissionData.status = 0;
            this.updataStatus(this.newPermissionData);
          } else if (this.operateType === 2) {
            this.deletePermissionBtn(idsList);
          } else {
            this.$message({
              message: "您尚未选取操作方式",
              type: "error"
            });
          }
        });
      }
    },
    updataStatus(params) {
      updatePermissionStatus(params).then(response => {
        this.$message({
          message: "操作成功",
          type: "success"
        });
        this.getpermissionlist();
      });
    },
    toCreatePermi(permi) {
      if (permi == null) {
        this.$router.push({
          path: "/role/permissionDetail",
          query: { msg: "新建权限", code: 0, permi: permi }
        });
      }
      if (permi != null) {
        this.$router.push({
          path: "/role/permissionDetail",
          query: { msg: "新建子权限", code: 2, permi: permi }
        });
      }
    }
  }
};
</script>
<style>
</style>


