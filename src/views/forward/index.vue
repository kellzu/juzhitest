<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button @click="queryBtn" style="float: right" type="primary" size="small">查询结果</el-button>
        <el-button @click="rest" style="float: right;margin-right: 15px" size="small">重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" size="small" label-width="140px">
          <el-form-item label="公司名称">
            <el-input v-model="listQuery.name" @keyup.native.enter="queryBtn()"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select size="small" v-model="listQuery.status" placeholder="状态">
              <el-option
                v-for="item in operates"
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
      <el-button class="btn-add" size="mini">添加</el-button>
    </el-card>

    <el-card class="operate-container" shadow="never">
      <el-table :data="forwardList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" label="选择"></el-table-column>
        <el-table-column prop="forwardingCompanyName" label="公司名称"></el-table-column>
        <el-table-column prop="contacts" label="联系人"></el-table-column>
        <el-table-column prop="phone" label="联系电话"></el-table-column>
        <el-table-column prop="email" label="公司邮箱"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="show(scope.row.id)">查看</el-button>
            <el-button type="text" @click="toUpdate(scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
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
        <!-- 分页工具 -->
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
      </div>
    </el-card>
  </div>
</template>

<script>
import { fetchList, batchUpdateStatus } from "@/api/forwardingCompany";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null,
  status: null
};
const defaultForwardEntity = {};
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      operateType: null,
      operates: [
        { value: null, label: "全部" },
        { value: "normal", label: "正常" },
        { value: "freeze", label: "禁用" },
        { value: "delete", label: "删除" }
      ],
      selectListIds: [],
      forwardList: []
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getlist();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getlist();
    },
    rest() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    getlist() {
      fetchList(this.listQuery).then(response => {
        this.total = response.data.total;
        this.forwardList = response.data.list;
      });
    },
    queryBtn() {
      this.listQuery.pageNum = 1;
      this.getlist();
      this.$message({
        message: "查询成功",
        type: "success"
      });
    },
    show(id) {
      console.log("正在查询id为: " + id + " 的航线");
    },

    handleSelectionChange(val) {
      let ids = [];
      val.forEach(element => {
        ids.push(element.id);
      });
      this.selectListIds = ids;
    },
    batchOperation() {
      if (this.selectListIds.length == 0) {
        this.$message({
          message: "尚未选取任意一条记录",
          type: "error"
        });
      } else {
        this.$confirm("是否要确认?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            if (this.operateType === "normal") {
              this.batchUpdateStatus(this.selectListIds, "normal");
            } else if (this.operateType === "freeze") {
              this.batchUpdateStatus(this.selectListIds, "freeze");
            } else if (this.operateType === "delete") {
              this.batchUpdateStatus(this.selectListIds, "delete");
            } else {
              this.$message({
                message: "您尚未选取操作方式",
                type: "error"
              });
            }
          })
          .catch(() => {
            this.$message({
              message: "您已取消执行",
              type: "warning"
            });
          });
      }
    },
    batchUpdateStatus(ids, status) {
      batchUpdateStatus({ ids, status })
        .then(response => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getlist();
        })
        .catch(() => {
          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    toUpdate(id) {
      this.$router.push({
        path: "/forward/forwarDetail",
        query: {
          id: id
        }
      });
    }
  }
};
</script>