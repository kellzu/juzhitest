<template>
  <div>
    <el-card shadow="never">
      <el-collapse>
        <el-collapse-item :title="entity.approvalStatus | formatStatus">
          <template slot="title">
            <i class="header-icon el-icon-info" style="margin-right: 5px;"></i>
            <B style="margin-right: 10px;">采购订单审核: </B>
            {{entity.approvalStatus | formatStatus}}
          </template>
          <el-row>
            <el-col :span="12">
              <el-form label-width="60px">
                <el-form-item label="审批：">
                  <el-radio v-model="entity.status" label="pass">通过</el-radio>
                  <el-radio v-model="entity.status" label="reject">驳回</el-radio>
                </el-form-item>
                <el-form-item label="备注：">
                  <el-input
                    v-model="entity.remark"
                    placeholder="审批备注(无论通过或驳回都需要填写)"
                    show-word-limit
                    type="textarea"
                    rows="5"
                  ></el-input>
                </el-form-item>
                <el-form-item label="图片">
                  <multiUpload v-model="entity.imgPath"></multiUpload>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="submit">提交</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12">
              <approvalTimeLine :purchaseOrderId="entity.purchaseOrderId" :reFresh="reFresh"></approvalTimeLine>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>
<script>
import multiUpload from "@/components/Upload/multiUpload";
import approvalTimeLine from "./approvalTimeLine/index";
import {
  formatApprovalStatus,
  formatApprovalType,
  approvalFunc
} from "@/utils/purchaseApprovalStatus";
export default {
  components: { approvalTimeLine, multiUpload },
  props: ["purchaseOrderId", "approvalStatus", "reFresh"],
  name: "approval",
  data() {
    return {
      entity: {
        status: "pass",
        purchaseOrderId: null,
        approvalStatus: null,
        imgPath: [],
        remark: ""
      }
    };
  },
  created() {
    this.entity.purchaseOrderId = this.purchaseOrderId;
    this.entity.approvalStatus = this.approvalStatus;
  },
  filters: {
    formatStatus(val) {
      return formatApprovalStatus(val);
    }
  },
  watch: {
    purchaseOrderId: function(newVal, oldVal) {
      this.entity.purchaseOrderId = newVal;
    },
    approvalStatus: function(newVal, oldVal) {
      this.entity.approvalStatus = newVal;
    },
    reFresh: function() {}
  },
  methods: {
    submit() {
      this.entity.purchaseOrderId = this.purchaseOrderId;
      this.entity.approvalStatus = this.approvalStatus;
      approvalFunc(
        this.entity.approvalStatus,
        this.purchaseOrderId,
        this.entity
      ).then(resp => {
        this.$message({
          message: resp.data,
          type: "success"
        });
        this.$emit("updateHandle");
      });
    }
  }
};
</script>
<style>
</style>