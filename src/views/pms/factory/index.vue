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
          <el-form-item label="厂商名称：">
            <el-input class="input-width" @keyup.native.enter="handleSearchList()"  v-model="listQuery.name" placeholder="厂商名称"></el-input>
          </el-form-item>
          <el-form-item label="厂商状态：">
            <el-select v-model="listQuery.status" class="input-width" placeholder="厂商状态">
              <el-option v-for="(v, k) in roletype" :key="v" :label="k" :value="v"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <router-link to="/factory/factoryDetail">
        <el-button size="mini" class="btn-add">添加厂商</el-button>
      </router-link>
    </el-card>

    <el-card class="operate-container" shadow="never">
      <el-table border :data="factoryList">
        <el-table-column prop="name" label="工厂名称"></el-table-column>
        <el-table-column prop="phone" label="工厂电话"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">{{scope.row.status|formatStatus}}</template>
        </el-table-column>
        <el-table-column prop="level" label="等级" width="80px"></el-table-column>
        <el-table-column prop="createName" label="创建人"></el-table-column>
        <el-table-column prop="gmtCreate" label="创建日期">
          <template slot-scope="scope">{{scope.row.gmtCreate|formatTime}}</template>
        </el-table-column>
        <el-table-column fixed="right" width="200px" label="操作">
          <template slot-scope="scope">
            <el-button @click="showDtailBtn(scope.row)" type="text" size="small">查看详情</el-button>
            <el-button @click="updateBtn(scope.row)" type="text" size="small">修改信息</el-button>
            <el-button @click="deleteBtn(scope.row.id)" type="text" size="samll">删除</el-button>
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
  </div>
</template>
<script>
import {
  batchUpdateStatus,
  deleteReality,
  deleteFactorys,
  createFactory,
  getFactoryDetail,
  getFactoryList
} from "@/api/factory";
import { pareTime } from "@/utils/date";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null,
  status: null
};
export default {
  name: "factoryList",
  data() {
    return {
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
      factoryId: 0,
      selectList: [],
      initELTreeFlag: false,
      listQuery: Object.assign({}, defaultListQuery),
      factoryList: [
        {
          accendantId: 0,
          accendantName: null,
          albumId: 0,
          controlLevel: null,
          createName: null,
          createUserId: 0,
          fax: null,
          gmtCreate: null,
          id: 0,
          level: null,
          name: null,
          nickName: null,
          owner: null,
          ownerPhone: null,
          ownerSex: null,
          phone: null,
          picturePath: null,
          portalWebsite: null,
          remark: null,
          shopWebsite: null,
          spellName: null,
          status: null
        }
      ],
      statusTypeTags: ["danger", "success"]
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formatTime(time) {
      return pareTime(time);
    },
    formatType(val) {
      if (val === 0) return "目录";
      if (val === 1) return "菜单";
      if (val === 2) return "按钮";
      return "状态码错误";
    },
    formatStatus(val) {
      if (val === "delete") return "删除";
      if (val === "freeze") return "冻结";
      if (val === "normal") return "正常";
      return "状态码错误";
    }
  },
  methods: {
    getList() {
      getFactoryList(this.listQuery).then(response => {
        this.factoryList = response.data.list;
        this.total = response.data.total;
      });
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSelectionChange(val) {
      let array = [];
      for (var item in val) {
        array.push(val[item].id);
      }
      this.selectList = array;
    },
    deleteRoleBtn(id) {
      this.$confirm("已被使用的角色无法被删除,是否确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {});
    },
    rest() {
      this.listQuery.name = null;
      this.listQuery.status = null;
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
          } else {
            this.$message({
              message: "您尚未选取操作方式",
              type: "error"
            });
          }
        });
      }
    },
    updateBtn(row) {
      this.$router.push({
        path: "/factory/factoryDetail",
        query: { msg: "修改工厂信息", code: 1, factoryDetail: row }
      });
    },
    showDtailBtn(row) {
      this.$router.push({
        path: "/factory/factoryDetailShow",
        query: { id: row.id, factoryDetail: row }
      });
    },
    deleteBtn(id) {
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [id];
          deleteFactorys(ids).then(resp=>{
            this.$message({
              message: resp.data,
              type: 'success',
              duration: 1000,
            })
            this.getList();
      });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
  }
};
</script>
<style>
.batchOperation {
  margin-top: 10px;
}
</style>