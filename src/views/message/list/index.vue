<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtTime | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Author">
        <template slot-scope="scope">
          <span>{{ scope.row.createName }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="{row}">
          <el-tag>{{ row.isDone }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="Title">
        <template slot-scope="{row}">
          <a @click="showDetail(row.id)" class="link-type">
            <span>{{ row.title }}</span>
          </a>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog title="留言详情" :visible.sync="dialogTableVisible">
      <h1>{{msgDetail.title}}</h1>
      <h2>{{msgDetail.summary}}</h2>
      <el-divider></el-divider>
      <el-card class="app-container">
        <div v-html="msgDetail.content"></div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { pareTime } from "@/utils/date";
import { fetchList, selectByid } from "@/api/message";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "ArticleList",
  components: { Pagination },

  filters: {
    statusFormatter(val) {
      if (val) {
        return true;
      }
      return false;
    },
    parseTime(val) {
      return pareTime(val);
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      msgDetail: {
        id: null,
        createUserId: null,
        createName: null,
        gmtTime: null,
        isDone: null,
        title: null,
        summary: null,
        content: null
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    showDetail(id) {
      selectByid(id).then(response => {
        this.msgDetail = response.data;
        this.dialogTableVisible = true;
      });
    }
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
