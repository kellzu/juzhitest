<template>
  <div>
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="activity.gmtCreate|formatTime"
        placement="top"
      >
        <el-card>
          <p>
            <b>{{activity.approvalStatus | formatApprovalStatus(true)}}</b>
          </p>
          <p>
            <b>操作人：</b>
            {{activity.username}}
          </p>
          <p>
            <b>留言：</b>
            {{activity.remark}}
          </p>
          <div class="my-demo-image">
            <div v-for="(item,index) in activity.imgPath" :key="index">
              <el-image
                style="width: 100px;  margin-right: 10; height: 100px"
                :src="item"
                :preview-src-list="activity.imgPath"
              ></el-image>
            </div>
          </div>
          <el-tag :type="activity.status|formatType">{{activity.status|formatStatus}}</el-tag>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
import { pareTime } from "@/utils/date";
import { approvedMemo } from "@/api/approval";
import { formatApprovalStatus } from "@/utils/purchaseApprovalStatus";
export default {
  name: "approvalTimeLine",
  created() {
    if (this.exId != null) {
      this.getResult(this.exId);
    } else {
      this.activities = [];
    }
  },
  props: ["exId", "reFresh"],
  filters: {
    formatTime(val) {
      return pareTime(val);
    },
    formatApprovalStatus(val, type) {
      return formatApprovalStatus(val, type);
    },
    formatStatus(val) {
      if (val === "pass") return "通过";
      if (val === "reject") return "驳回";
    },
    formatType(val) {
      if (val === "pass") return "success";
      if (val === "reject") return "danger";
    },
  },
  watch: {
    exId: function (newVal, oldVal) {
      if (newVal != null) {
        this.getResult(newVal);
      }else{
      this.activities = [];
      }
    },
    reFresh: function () {
      if (this.exId != null) this.getResult(this.exId);
    },
  },
  data() {
    return {
      formatStatus: {
        pass: ["通过", "success"],
        reject: ["驳回", "danger"],
      },
      activities: [],
    };
  },
  methods: {
    getResult(id) {
      approvedMemo(id).then((resp) => {
        if (resp.data) {
          this.activities = resp.data;
        }
      });
    },
  },
};
</script>
<style>
.my-demo-image {
  display: flex;
  flex-wrap: nowrap;
}
</style>