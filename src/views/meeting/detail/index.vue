<template>
  <div class="app-container">
    <el-card class="app-container" shadow="never">
      <el-form size="small" :model="meetingEntity" :rules="rule">
        <el-form-item style="margin-bottom: 20px;" prop="title" label=" " label-position="left"  :required= true>
          <MDinput v-model="meetingEntity.title" :maxlength="100" required>会议标题</MDinput>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;">
          <MDinput v-model="meetingEntity.remark" :maxlength="100" required>会议备注</MDinput>
        </el-form-item>
        <br />
        <el-form-item label="参与人员："  prop="userList" 
        :rules="[
          { required: true, message: '请选择至少一人参与人员', trigger: 'blur' },]">
          <selectUser @selectUserFun="selectUserFun"></selectUser>
        </el-form-item>
        <br />
        <el-form-item label="会议时间：" :required= true>
          <el-date-picker
            v-model="meetingEntity.startTime"
            type="datetime"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <br />
        <el-form-item label=" " :required= true>
          <taskCreateDetail ref="taskDetailRef"></taskCreateDetail>
        </el-form-item>
        <br />
      </el-form>
      
      <div class="bottom clearfix">
        <el-button size="small" class="button" @click="create">提交</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import taskCreateDetail from "../components/taskCreateDetail";
import { accomplish, createMeeting } from "@/api/companyMeeting";
import selectUser from "../components/selectUser";
import MDinput from "@/components/MDinput";
const defaultMeetingEntity = {
  title: "",
  startTime: "",
  remark: "",
  userIds: [],
  companyMeetingItems: null
};
export default {
  name: "meetingDetail",
  components: { MDinput, selectUser, taskCreateDetail },
  data() {
    return {
      rule: {
        title: [
          { required: true, trigger: "blur", message: "会议标题不可为空" }
        ]
      },
      meetingEntity: Object.assign({}, defaultMeetingEntity)
    };
  },
  created() {},
  methods: {
    create() {
      const tasklist = this.$refs.taskDetailRef.taskList;
      this.meetingEntity.companyMeetingItems = tasklist;
      this.meetingEntity.companyMeetingItems.forEach(itme => {
        if(itme.timeSlot){
          itme.startTime = itme.timeSlot[0]
          itme.endTime = itme.timeSlot[1]
        }
      });
      createMeeting(this.meetingEntity).then(resp => {
        this.$message({
          message: resp.data,
          type: "success"
        });
      });
    },
    selectUserFun(vals) {
      this.meetingEntity.userIds = vals;
    }
  }
};
</script>
<style>
</style>