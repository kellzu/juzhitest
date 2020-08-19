<template>
  <div>
    <el-divider content-position="left">
      <el-button @click="addBillDetail" type="text">添加入账记录</el-button>
    </el-divider>
    <el-table :data="billDatailList" style="width: 100%">
      <el-table-column label="付款方式" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.patternPayment" ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="付款金额" align="center">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.amountUsd" controls-position="right" ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="付款凭证">
        <template slot-scope="scope">
          <multi-upload v-model="scope.row.picPath"></multi-upload>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" align="center">
          <el-button type="text" @click="deleteBillDetail(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import multiUpload from "@/components/Upload/multiUpload";
const defaultBillDetail = {
  patternPayment: "",
  amountUsd: 0,
  amountCny: 0,
  exchangeRate: 0,
  remark: "",
  picPath: []
};
export default {
  components: { multiUpload },
  name: "fmsBillList",
  data() {
    return {
      billDatailList: []
    };
  },
  methods: {
    addBillDetail() {
      this.billDatailList.push(Object.assign({}, defaultBillDetail));
    },
    deleteBillDetail(index) {
      this.billDatailList.splice(index, 1);
    }
  }
};
</script>