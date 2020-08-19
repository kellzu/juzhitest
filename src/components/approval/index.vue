<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>{{entity.approvalStatus|approvalStatusFormat(true)}}</span>
      </div>
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
import { approval } from "@/api/approval";
import { approvalFunc, formatApprovalStatus } from "@/utils/approvalstatus";
const defaultEntity = {
  id: null,
  status: "pass",
  approvalStatus: null,
  imgPath: [],
  remark: "",
};
export default {
  name: "approval",
  props: {
    value: {
      type: Number,
    },
  },
  components: { approvalTimeLine, multiUpload },
  data() {
    return {
      reFresh: 0,
      entity: Object.assign({}, defaultEntity),
    };
  },
  filters: {
    approvalStatusFormat(val,type) {
      return formatApprovalStatus(val,type);
    },
  },
  watch: {
    value: function (newVal, oldVal) {
      if (newVal) {
        this.getApproval();
      } else {
        this.entity = Object.assign({}, defaultEntity);
        this.reFresh++;
      }
    },
  },
  created() {
    if (this.value) {
      this.getApproval();
    } else {
      this.entity = Object.assign({}, defaultEntity);
    }
  },
  methods: {
    getApproval() {
      approval(this.value).then((resp) => {
        this.entity.approvalStatus = resp.approvalStatus;
        this.entity.status = resp.status;
      });
    },
    submit() {
      if (this.value) {
        approvalFunc(this.entity.approvalStatus, this.value, this.entity).then(
          (resp) => {
            this.$message({
              message: resp.data,
              type: "success",
            });
            this.reFresh++;
            this.getApproval();
          }
        );
      } else {
        this.$message({
          message: "尚未添加待审信息，无法审批",
        });
      }
    },
  },
};
</script>
<style >
</style>