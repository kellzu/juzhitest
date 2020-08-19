<template>
  <div>
    <el-card shadow="never">
      <el-collapse>
        <el-collapse-item title="国内物流信息">
          <template slot="title">
            <i class="header-icon el-icon-info" style="margin-right: 5px;"></i>
            <B style="margin-right: 10px;">国内物流信息</B>
          </template>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form label-width="100px" size="mini">
                <el-form-item label="物流单号：">
                  <el-input v-model="domesticLogisticsDate.deliverySn"></el-input>
                </el-form-item>
                <el-form-item label="物流公司：">
                  <el-input v-model="domesticLogisticsDate.deliveryCompany"></el-input>
                </el-form-item>
                <el-form-item label="物流金额：">
                  <el-input-number v-model="domesticLogisticsDate.deliveryPrice"></el-input-number>
                </el-form-item>
                <el-form-item label="备注：">
                  <el-input type="textarea" v-model="domesticLogisticsDate.remark"></el-input>
                </el-form-item>
                <span v-if="toShow" style="font-size: 16px; color: #909399;">暂无物流信息</span>
              </el-form>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple"></div>
            </el-col>
          </el-row>
          <logistticsLog :toShow="toShow" :logisticsResult="logisticsResult"></logistticsLog>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <br />
  </div>
</template>
<script>
import logistticsLog from "@/components/logistticsLog/logistticsLog";
import { getDomesticLogistics } from "@/api/delivery";
const defaultDomesticLogisticsDate = {
  id: null,
  deliverySn: null,
  deliveryCompany: null,
  deliveryType: null,
  deliveryPrice: null,
  purchaseOrderId: null,
  gmtCreate: null,
  gmtModify: null,
  remark: null,
  deliveryStatus: null,
  createUserId: null,
  deliveryId: null,
  albumId: null
};
export default {
  name: "domesticLogistics",
  props: {
    value: Number
  },
  components: { logistticsLog },
  data() {
    return {
      toShow: true,
      domesticLogisticsDate: Object.assign({}, defaultDomesticLogisticsDate),
      logisticsResult: null,
    };
  },
  created() {
    if (this.value != null) {
      this.getDomesticLogistics();
    }
  },
  watch: {
    value: function(newVal, oldVal) {
      if (newVal != null) {
        this.getDomesticLogistics();
      }
    }
  },
  methods: {
    getDomesticLogistics() {
      getDomesticLogistics(this.value).then(resp => {
        this.domesticLogisticsDate = Object.assign({}, resp.data);
        if (resp.data != null && resp.data.logisticsEntity != null) {
          this.toShow = false;
          this.logisticsResult = resp.data.logisticsEntity.result;
        }
      });
    }
  }
};
</script>
<style>
</style>