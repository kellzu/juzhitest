<template>
  <div class="app-container">
    <el-card class="app-container">
      <div slot="header" class="clearfix">
        <span>
          <a style="color:#909399">{{title}}</a>
        </span>
        <el-button @click="goBack" style="float: right; padding: 3px 0" type="text">返回</el-button>
      </div>

      <el-form
        style="width:40%"
        :rules="rules"
        :model="forwardDetail"
        ref="forwardForm"
        label-width="150px"
        size="small"
      >
        <el-form-item prop="forwardingCompanyName" label="公司名称:">
          <el-input v-model="forwardDetail.forwardingCompanyName"></el-input>
        </el-form-item>
        <el-form-item label="公司编码">
          <el-input v-model="forwardDetail.sn"></el-input>
        </el-form-item>
        <el-form-item prop="contacts" label="联系人:">
          <el-input v-model="forwardDetail.contacts"></el-input>
        </el-form-item>

        <el-form-item prop="email" label="邮箱:">
          <el-input v-model="forwardDetail.email"></el-input>
        </el-form-item>

        <el-form-item prop="phone" label="电话:">
          <el-input v-model="forwardDetail.phone"></el-input>
        </el-form-item>

        <el-form-item label="状态:">
          <el-switch
            v-model="forwardDetail.status"
            type="texteare"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            active-value="normal"
            inactive-text="禁用"
            inactive-value="freeze"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input type="textarea" v-model="forwardDetail.remark" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <br />
      <el-divider content-position="left">
        添加航线 ·
        <el-button @click="addItem" type="text">点击添加</el-button>
      </el-divider>

      <el-table :data="forwardRouteMode" border>
        <el-table-column label="航线名">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.routeName"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="类别">
          <template slot-scope="scope">
            <el-select size="small" v-model="scope.row.routeType">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="起点">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.startPoint"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="终点">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.endPoint"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="花费时间 /天">
          <template slot-scope="scope">
            <el-input-number
              size="small"
              controls-position="right"
              :min="0"
              v-model="scope.row.timeTaken"
            ></el-input-number>
          </template>
        </el-table-column>

        <el-table-column label="价格 /￥">
          <template slot-scope="scope">
            <el-input-number
              size="small"
              controls-position="right"
              :min="0"
              v-model="scope.row.price"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input size="small" :rows="3" v-model="scope.row.remark" type="textarea"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-show="isUpdate"
              @click="updateModeDetail(scope.row.id , scope.row)"
            >修改</el-button>
            <el-button @click="deleteItem(scope.$index)" type="text" style="color: #F56C6C">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <br />
      <span>
        <a style="font-size: small; color: #909399">
          <b>航线名</b> 与
          <b>类别</b> 为必填项
        </a>
      </span>
      <el-divider></el-divider>

      <el-button type="primary" v-show="isUpdate" @click="updateDetail">修改</el-button>
      <el-button type="primary" v-show="!isUpdate" @click="createHandler">添加</el-button>
    </el-card>
  </div>
</template>

<script>
import {
  createHandler,
  updateDetail,
  getDetail,
  updateRouteModel
} from "@/api/forwardingCompany";
const defaultForwardRouteMode = {
  routeName: null,
  routeType: null,
  price: null,
  startPoint: null,
  endPoint: null,
  timeTaken: null,
  remark: null
};
const defaultForwardDetail = {
  forwardingCompanyName: null,
  sn: null,
  sphereBusiness: null,
  typeShipping: null,
  contacts: null,
  email: null,
  phone: null,
  transportationRoute: null,
  remark: null,
  status: null,
  forwardingRouteModes: []
};
export default {
  data() {
    const defaultValidate = (rule, value, callback) => {
      if (value == null || value.length < 3) {
        callback(new Error("请输入正确的数据"));
      } else {
        callback();
      }
    };
    return {
      isUpdate: false,
      title: "添加货代公司",
      forwardRouteMode: [],
      forwardDetail: Object.assign({}, defaultForwardDetail),
      options: [
        {
          label: "空运",
          value: 0
        },
        {
          label: "海运",
          value: 1
        },
        {
          label: "陆运",
          value: 2
        }
      ],
      rules: {
        forwardingCompanyName: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        contacts: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        email: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        phone: [{ required: true, trigger: "blur", validator: defaultValidate }]
      }
    };
  },
  created() {
    let id = this.$route.query.id;
    if (id != null) {
      this.isUpdate = true;
      this.getDetail(id);
    }
  },
  methods: {
    goBack() {},
    addItem() {
      let item = Object.assign({}, defaultForwardDetail);
      this.forwardRouteMode.push(item);
    },
    getDetail(id) {
      getDetail(id).then(response => {
        this.forwardDetail = response.data;
        this.forwardRouteMode = response.data.forwardingRouteModes;
      });
    },
    deleteItem(index) {
      if (this.forwardRouteMode.length <= 1) {
        this.$message({
          message: "必须保留一条记录",
          type: "warning"
        });
      } else {
        this.forwardRouteMode.splice(index, 1);
      }
    },
    createHandler() {
      this.$refs.forwardForm.validate(val => {
        if (val) {
          let resultList = this.filterList(this.forwardRouteMode);
          if (resultList != null && resultList.length > 0) {
            this.forwardDetail.forwardingRouteModes = resultList;
            createHandler(this.forwardDetail).then(response => {
              this.$message({
                message: "添加成功",
                type: "success"
              });
            });
          } else {
            this.$message({
              message: "数据不完整",
              type: "error"
            });
          }
        } else {
          this.$message({
            message: "数据不完整",
            type: "error"
          });
        }
      });
    },
    filterList(valueList) {
      for (let index = 0; index < valueList.length; index++) {
        const element = valueList[index];
        if (
          element.routeName == null ||
          element.routeName == "" ||
          element.routeType == null
        ) {
          valueList.splice(index, 1);
          return this.filterList(valueList);
        }
      }
      return valueList;
    },
    updateDetail() {
      this.$refs.forwardForm.validate(val => {
        if (val) {
          updateDetail(this.forwardDetail.id, this.forwardDetail).then(
            response => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
            }
          );
        } else {
          this.$message({
            message: "数据不完整",
            type: "error"
          });
        }
      });
    },
    updateModeDetail(id, row) {
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateRouteModel(id, row)
            .then(response => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
            })
            .catch(() => {
              this.$message({
                message: "修改失败，联系相关人员",
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message({
            message: "您已取消执行",
            type: "warning"
          });
        });
    }
  }
};
</script>

<style>
</style>