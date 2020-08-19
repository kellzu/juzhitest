<template>
  <div class="app-container">
    <el-card shadow="never" class="operate-container">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" size="small">查询搜索</el-button>
        <el-button style="float:right;margin-right: 15px" size="small">重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" ref="searchForm" size="small" label-width="140px">
          <el-form-item label="会议主题">
            <el-input class="input-width" placeholder="订单编号"></el-input>
          </el-form-item>
          <el-form-item label="组别">
            <el-input placeholder="客户订单编号"></el-input>
          </el-form-item>
          <el-form-item label="时间">
            <el-input placeholder="客户订单编号"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card shadow="never" class="operate-container">
      <el-table :data="meetList">
        <el-table-column label="会议主题" prop="title"></el-table-column>
        <el-table-column label="会议主持" prop="createName"></el-table-column>
        <el-table-column label="开会时间">
          <template slot-scope="scope">{{scope.row.gmtCreate|pareTimeFormat }}</template>
        </el-table-column>
        <el-table-column label="任务数量" prop="taskCount"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="taskProgress(scope.row.id)">会议详情</el-button>
            <el-button type="text" @click="delMeeting(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :visible.sync="taskProgressVisible" top="10vh" width="60%">
      <taskDetail v-model="companyMeetingId"></taskDetail>
    </el-dialog>
  </div>
</template>
<script>
import { pareTime } from "@/utils/date";
import { accomplish, createMeeting, fetchList,delMeeting } from "@/api/companyMeeting";
import meetingDetail from "./detail/index";
import taskDetail from "./components/taskDetail";
const defaultMeetingEntity = {
  title: "",
  gmtCreate: "",
  message: "",
  createName: "",
  taskCount: null
};
const defaultQueryList = {
  sn: null,
  name: null,
  otherSN: null,
  status: null,
  orderStatus: null,
  mark: null,
  createUserId: null,
  pageNum: null,
  pageSize: null,
  temporalInterval: null
};
export default {
  name: "meeting",
  components: { meetingDetail, taskDetail },
  filters: {
    pareTimeFormat(str) {
      return pareTime(str);
    }
  },
  data() {
    return {
      companyMeetingId: null,
      taskProgressVisible: false,
      meetList: [Object.assign({}, defaultMeetingEntity)],
      queryList: Object.assign({}, defaultQueryList)
    };
  },
  created() {
    this.fetchList();
    
  },
  methods: {
    taskProgress(id) {
      this.companyMeetingId = id;
      this.taskProgressVisible = true;
    },
    fetchList() {
      fetchList(this.queryList).then(resp => {
        this.meetList = resp.data;
      });
    },
    delMeeting(id) {
      const h = this.$createElement;
      this.$msgbox({
        message: h('p', null, [
          h('span', null, '确定删除')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            delMeeting(id).then(resp=>{
              done();
              instance.confirmButtonLoading = false;
            })
          } else {
            done();
          }
        }
      }).then(action => {
       this.fetchList();
      });
    }
  }
};
</script>
<style>
</style>