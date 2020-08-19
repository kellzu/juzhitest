<template>
  <div>
    <el-divider content-position="left">
      任务列表 ------
      <el-button type="text" @click="addTask">添加任务</el-button>
    </el-divider>
    <br />
    <el-card class="operate-container" v-for="(item,index) in taskList" :key="index">
      <el-form size="mini" label-width="100px" label-position="left">
        <el-form-item label="执行人员：" :required= true>
          <selectUser v-model="item.ids"></selectUser>
        </el-form-item>
        <el-form-item label="任务周期：">
          <el-date-picker
            v-model="item.timeSlot"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="预计结束时间"
          >></el-date-picker>
        </el-form-item>
        <el-form-item label="应执行任务:" :required= true>
          <!-- <el-input type="textarea" placeholder="会议中需要执行的任务" rows="3" v-model="item.taskDefinition"></el-input> -->
          <el-tabs v-model="activeHtmlName" type="card">
            <el-tab-pane label="详情" name="pc">
              <tinymce :width="595" :height="300" v-model="item.taskDefinition"></tinymce>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" size="mini" @click="deletTask(index)">删除</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import selectUser from "../components/selectUser";
import Tinymce from "@/components/Tinymce";
// 会议任务详情
const defaultTaskEntity = {
  timeSlot: [],
  ids: [],
  taskDefinition: ""
};
export default {
  name: "taskCreateDeetail",
 
  data() {
    return {
      taskList: [],
      //商品富文本详情激活类型
      activeHtmlName: "pc",
      value:null
    };
  },
  created() {},
  components: { selectUser, Tinymce},
  methods: {
    addTask() {
      let task = Object.assign({}, defaultTaskEntity);
      this.taskList.push(task);
      // console.log(this.taskList,"taskList");
    },
    selectUserFun(val, index) {
      console.log(val);
      console.log(index);
    },
    deletTask(index) {
        this.taskList.splice(index, 1);
    }
  }
};
</script>
<style>
</style>