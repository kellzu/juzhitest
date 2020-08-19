<template>
  <el-collapse v-if="!toShow" accordion>
    <el-collapse-item>
      <template slot="title">
        <el-avatar shape="square" :size="50" :src="logisticsResultList.logo"></el-avatar>
        <div style="margin-left: 20px">物流公司：{{logisticsResultList.expName}}</div>
        <div style="margin-left: 20px">物流耗时：{{logisticsResultList.takeTime}}</div>
        <div style="margin-left: 20px">
          <el-tag
            :type="logisticsResultList.deliverystatus| deliveryStatusFomat(false)"
          >{{logisticsResultList.deliverystatus| deliveryStatusFomat(true)}}</el-tag>
        </div>
      </template>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in logisticsResultList.list"
          :key="index"
          color="#0bbd87"
          :timestamp="activity.time|dateFromat"
        >{{activity.status}}</el-timeline-item>
      </el-timeline>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import { pareTime } from "@/utils/date";
const defaultLogisticsResult = {
  number: null,
  type: null,
  list: [],
  deliverystatus: 7,
  issign: null,
  expName: null,
  expSite: null,
  expPhone: null,
  logo: null,
  courier: null,
  courierPhone: null,
  updateTime: null,
  takeTime: null,
};
export default {
  name: "logistticsLog",
  props: {
    toShow: {
      type: Boolean,
    },
    logisticsResult: {
      type: Object,
    },
  },
  data() {
    return {
      logisticsResultList: Object.assign({}, defaultLogisticsResult),
      deliveryStatusCN: {
        0: ["揽件中", "info"],
        1: ["在途中", "info"],
        2: ["派件中", "info"],
        3: ["已签收", "success"],
        4: ["派送失败", "warning"],
        5: ["疑难件", "warning"],
        6: ["退件签收", "warning"],
        7: ["无物流信息", "warning"],
      },
    };
  },
  watch: {
    "logisticsResult.number": function (newVal, oldVal) {
      this.logisticsResultList = this.logisticsResult;
    },
  },
  filters: {
    deliveryStatusFomat(val, status) {
      if (status) {
        switch (val) {
          case "0":
            return "揽件中";
          case "1":
            return "在途中";
          case "2":
            return "派件中";
          case "3":
            return "已签收";
          case "4":
            return "派送失败";
          case "5":
            return "疑难件";
          case "6":
            return "退件签收";
          case "7":
            return "无物流信息";
        }
      } else if (!status) {
        switch (val) {
          case 0:
            return "info";
          case 1:
            return "info";
          case 2:
            return "info";
          case 3:
            return "success";
          case 4:
            return "warning";
          case 5:
            return "warning";
          case 6:
            return "warning";
          case 7:
            return "warning";
        }
      }
    },
    dateFromat(val) {
      return pareTime(val);
    },
  },
  created() {
    if (this.logisticsResult != null) {
      this.logisticsResultList = this.logisticsResult;
    }
  },
};
</script>
<style>
</style>