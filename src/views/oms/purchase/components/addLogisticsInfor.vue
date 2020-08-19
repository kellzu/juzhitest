<template>
  <el-card>
    <el-form ref="deliveyForm" :rules="rules" :model="detail" size="small" label-width="80px">
      <el-form-item v-model="detail" prop="deliverySn" label="物流编号">
        <el-input v-model="detail.deliverySn" placeholder="物流编号"></el-input>
      </el-form-item>
      <el-form-item label="物流金额">
        <el-input-number v-model="detail.deliveryPrice" placeholder="物流金额"></el-input-number>
      </el-form-item>
      <el-form-item label="物流公司">
        <el-select v-model="detail.deliveryType" placeholder="请选择">
          <el-option
            v-for="(item,index) in forwardingList"
            :key="index"
            :label="item.forwardingCompanyName"
            :value="item.sn"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="验收说明">
        <el-input
          v-model="detail.remark"
          placeholder="验收说明与采购要求相类似，如果你填写过采购要求,可以直接复制采购要求。"
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="addLogisticsInfor">确 定</el-button>
  </el-card>
</template>
<script>
import { addDelivery } from "@/api/omsdelivery";
import { getList } from "@/api/forwardingCompany";
const defualtDeliveryEntity = {
  deliverySn: null,
  deliveryCompany: null,
  deliveryType: null,
  deliveryPrice: 0,
  purchaseOrderId: 0,
  remark: null
};
export default {
  name: "addLogisticsInfor",
  props: {
    value: Number
  },
  data() {
    const defaultValidate = (rule, value, callback) => {
      if (value == null || value.length == 0) {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    return {
      delivery: { forwardingCompanyName: null },
      detail: Object.assign({}, defualtDeliveryEntity),
      forwardingList: [],
      rules: {
        deliverySn: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        deliveryCompany: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        deliveryType: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        deliveryPrice: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        purchaseOrderId: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        remark: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ]
      }
    };
  },
  created() {
    this.getForwardingList();
  },
  methods: {
    getForwardingList() {
      getList().then(response => {
        this.forwardingList = response.data;
      });
    },
    selectDeliveryCompany(val) {
      this.detail.deliveryCompany = val.forwardingCompanyName;
      this.detail.deliveryType = val.sn;
      console.log(val);
    },
    addLogisticsInfor() {
      this.detail.purchaseOrderId = this.value;
      this.$refs.deliveyForm.validate(valid => {
        if (valid) {
          this.$confirm("此功能尚未有修改的功能，请仔细确认后添加！", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            addDelivery(this.detail).then(response => {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.$emit("addLogisticsInforBtn", null, false);
            });
          });
        }
      });
    }
  }
};
</script>