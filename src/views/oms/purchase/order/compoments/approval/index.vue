<template>
  <div>
    <el-card shadow="never">
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
    </el-card>
    <br />
    <el-card shadow="never">
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            <i class="header-icon el-icon-info" style="margin-right: 10px;"></i>
            审核记录
          </template>
          <approvalTimeLine :exId="value" :reFresh="reFresh"></approvalTimeLine>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>
<script>
import approvalTimeLine from "./approvalTimeLine/index";
import multiUpload from "@/components/Upload/multiUpload";
import { approval, approvedMemoEx } from "@/api/approvalPurchase";
export default {
  name: "approval",
  props: {
    value: {
      type: Number
    }
  },
  components: { approvalTimeLine, multiUpload },
  data() {
    return {
      reFresh: 0,
      entity: {
        id: null,
        status: "pass",
        approvalStatus: null,
        imgPath: [],
        remark: ""
      }
    };
  },
  watch: {
    value: function(newVal, oldVal) {}
  },
  created() {},
  methods: {
    submit() {
      if (this.value) {
        approval(this.value, this.entity).then(resp => {
          this.$message({
            message: resp.data,
            type: "success"
          });
          this.reFresh ++;
        });
      } else {
        this.$message({
          message: "尚未有添加国际物流信息，无法审批"
        });
      }
    }
  }
};
</script>
<style >
</style>