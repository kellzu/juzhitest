<template>
  <div>
    <el-card shadow="never">
      <el-collapse>
        <el-collapse-item
          v-for="(item,index) in operation"
          :key="index"
          :title="item.title"
          :disabled="item.status == 'cancel'"
        >
          <template slot="title">
            <div class="collapseType">{{item.taskTitle}}</div>
            <div class="collapseType" v-if="item.startTime">
              <b>开始时间：</b>
              {{item.startTime | dateFormat}}
            </div>
            <div class="collapseType" v-else>
              <b>开始时间：长期有效</b>
            </div>
            <div class="collapseType" v-if="item.endTime ">
              <b>预计完成：</b>
              {{item.endTime | dateFormat}}
            </div>
            <div class="collapseType" v-else>
              <b>预计完成：长期有效</b>
            </div>
            <div class="collapseType">
              <el-tag :type="item.type">{{item.title}}</el-tag>
            </div>
          </template>
          <el-card shadow="never">
            <el-form label-width="110px" size="mini" label-position="left">
              <el-form-item label="执行人：">
                <el-tag
                  size="small"
                  v-for="tag in item.userList"
                  :key="tag.id"
                  closable
                  effect="plain"
                  type="info"
                >
                  <span v-if="tag.type ==='delete'">
                    <s>{{tag.username}}</s>
                  </span>
                  <span v-else>{{tag.username}}</span>
                </el-tag>
              </el-form-item>
              <el-form-item label="任务项：">
                <el-card shadow="never">
                  <div v-html="item.taskDefinition"></div>
                </el-card>
              </el-form-item>
              <el-form-item></el-form-item>
              <el-form-item label="操作">
                <el-button
                  size="mini"
                  :disabled="item.status == 'cancel'"
                  type="success"
                  @click="complete(item.taskId)"
                >完成任务</el-button>
                <el-button
                  size="mini"
                  :disabled="item.status == 'cancel'"
                  @click="cancel(item.taskId)"
                >取消任务</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>
<script>
import { pareTime } from "@/utils/date";
import { getDetail, updateStatus } from "@/api/companyMeeting";
import Tinymce from "@/components/Tinymce";
export default {
  props: {
    value: Number,
  },
  name: "taskDetail",
  components: { Tinymce },
  data() {
    return {
      operation: [],
      activeHtmlName: "pc",
    };
  },
  filters: {
    dateFormat: function (value) {
      return pareTime(value);
    },
  },
  created() {
    this.getTaskDetail();
  },
  watch: {
    value: function (newVal, oldVal) {
      this.getTaskDetail();
    },
  },
  methods: {
    getTaskDetail() {
      getDetail(this.value).then((resp) => {
        this.operation = resp.data;
        let newAll = this.operation;
        console.log(this.operation);
        newAll.forEach((item) => {
          var currentTime = new Date();
          if (!item.endTime) {
            item.title = "未完成";
            item.type = "warning";
          } else {
            let str = item.endTime;
            str = str.replace("/-/g", "/");
            let oldTime = new Date(str).getTime();
            //    进行比较
            if (oldTime < new Date().getTime()) {
              item.type = "danger";
              item.title = "超时";
            } else {
              item.type = "warning";
              item.title = "未完成";
            }
          }
          if (item.status == "cancel") {
            item.title = "已取消";
          }
          if (item.status == "complete") {
            item.title = "已完成";
          }
        });
      });
    },
    complete(id) {
      updateStatus(id, "complete").then((resp) => {
        this.getTaskDetail();
      });
    },
    cancel(id) {
      updateStatus(id, "cancel").then((resp) => {
        this.getTaskDetail();
      });
    },
  },
};
</script>
<style>
.collapseType {
  margin-right: 20px;
}
</style>