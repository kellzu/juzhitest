<template>
  <el-card shadow="never">
    <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          <el-avatar shape="square" :size="50" :src="logisticsResult.logo"></el-avatar>
          <div style="margin-left: 20px">物流公司：{{logisticsResult.expName}}</div>
          <div style="margin-left: 20px">物流耗时：{{logisticsResult.takeTime}}</div>
          <div style="margin-left: 20px">
            <el-tag
              :type="deliveryStatusCN[logisticsResult.deliverystatus][1]"
            >{{deliveryStatusCN[logisticsResult.deliverystatus][0]}}</el-tag>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in logisticsResult.list"
            :key="index"
            color="#0bbd87"
            :timestamp="activity.time"
          >{{activity.status}}</el-timeline-item>
        </el-timeline>
      </el-collapse-item>
    </el-collapse>
    <el-divider>
      采购样图 ·
      <!-- <el-button v-show="isUpdate" type="text">添加·修改采购样图</el-button> -->
    </el-divider>
  </el-card>
</template>
<script>
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
  takeTime: null
};
import { getDeliveryDetail } from "@/api/delivery";
export default {
  name: "delivery",
  props: {
    value: Number
  },
  data() {
    return {
      deliveryStatusCN: {
        0: ["揽件中", "info"],
        1: ["在途中", "info"],
        2: ["派件中", "info"],
        3: ["已签收", "success"],
        4: ["派送失败", "warning"],
        5: ["疑难件", "warning"],
        6: ["退件签收", "warning"],
        7: ["无物流信息", "warning"]
      },
      logisticsResult: Object.assign({}, defaultLogisticsResult)
    };
  },
  created() {
    if (this.value != null) {
      this.getDeliveryDetail(this.value);
    }
  },
  watch: {
    value: function(newVal, oldVal) {
      this.getDeliveryDetail(newVal);
    }
  },
  methods: {
    getDeliveryDetail(id) {
      getDeliveryDetail(id).then(resp => {
        this.logisticsResult = resp.data.result;
      });
    }
  }
};
</script>
<style>
</style>