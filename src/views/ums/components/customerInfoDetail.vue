<template>
  <div>
    <el-form
      :model="dataInstance"
      ref="customerInfoForm"
      label-width="100px"
      label-position="right"
      size="small"
      :rules="rules"
    >
      <el-row :span="10">
        <el-form-item label="头像 :" prop="albumPic">
          <template v-if="viewFlag">
            <el-image :src="dataInstance.albumPic" style="width: 80px;" />
          </template>
          <template v-else>
            <single-upload v-model="dataInstance.albumPic" :style="dialogItemStyleObj"></single-upload>
          </template>
        </el-form-item>
      </el-row>
      <el-row :span="20">
        <el-col :span="10">
          <el-form-item label="first name :" prop="firstName">
            <el-input
              v-model="dataInstance.firstName"
              :style="dialogItemStyleObj"
              :readonly="viewFlag"
              placeholder="例:John Trump"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="last name: " prop="lastName">
            <el-input
              v-model="dataInstance.lastName"
              :style="dialogItemStyleObj"
              :readonly="viewFlag"
              placeholder="例:Donald"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="10">
          <el-form-item label="客户昵称 :" prop="nickName">
            <el-input
              v-model="dataInstance.nickName"
              :style="dialogItemStyleObj"
              :readonly="viewFlag"
              placeholder="例:Trump"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="客户标签: ">
            <el-tag
              v-for="tag in dataInstance.tagsArray"
              :key="tag.name"
              closable
              :disable-transitions="false"
              @close="handleCloseTag(tag)"
              effect="dark"
            >{{tag.name}}</el-tag>
            <template v-if="!viewFlag">
              <el-input
                class="input-new-tag"
                v-if="inputNewTagVisible"
                v-model="inputNewTagValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleNewTagInputConfirm"
                @blur="handleNewTagInputConfirm"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showNewTagInput">+ 添加标签</el-button>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="10">
          <el-form-item label="客户公司:">
            <el-input
              v-model="dataInstance.company"
              :style="dialogItemStyleObj"
              :readonly="viewFlag"
              placeholder="例:.inc"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="客户邮箱:" prop="email">
            <el-input
              v-model="dataInstance.email"
              :style="dialogItemStyleObj"
              :readonly="viewFlag"
              placeholder="例:xxx@gmail.com"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="10">
          <el-form-item label="客户来源:">
            <el-input
              v-model="dataInstance.source"
              :style="dialogItemStyleObj"
              :readonly="viewFlag"
              placeholder="例如: 1688"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="客户状态:">
            <el-switch
              active-value="normal"
              inactive-value="freeze"
              :active-text="statusMap['normal']"
              :inactive-text="statusMap['freeze']"
              v-model="dataInstance.status"
              :disabled="viewFlag"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :span="20">
        <el-col :span="10">
          <el-form-item label="手机号:">
            <el-input
              v-model="dataInstance.mobile"
              :style="dialogItemStyleObj"
              :readonly="viewFlag"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="座机号:">
            <el-input v-model="dataInstance.phone" :style="dialogItemStyleObj" :readonly="viewFlag"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="传真: ">
        <el-input v-model="dataInstance.fax" :style="dialogItemStyleObj" :readonly="viewFlag"></el-input>
      </el-form-item>
      <el-row :span="20">
        <el-col :span="10">
          <el-form-item label="客户等级 :">
            <el-select
              v-model="dataInstance.level"
              :style="dialogItemStyleObj"
              :disabled="viewFlag"
              placeholder="请选择客户等级"
            >
              <el-option v-for="(v, k) in levelMap" :key="k" :label="k" :value="'大于' + v + '次(含)'">
                <span style="float: left">{{ k }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ '大于' + v + '次(含)' }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="等级控制:">
            <el-select
              v-model="dataInstance.controlLevel"
              :style="dialogItemStyleObj"
              :disabled="viewFlag"
              placeholder="请选择客户等级升级方式"
            >
              <el-option v-for="(v, k) in controllerLevelMap" :key="k" :label="v" :value="k"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :span="20">
        <el-col :span="10">
          <el-form-item label="维护人: ">
            <div v-if="addFlag">
              <selectUser v-model="dataInstance.accendantUserIdList"></selectUser>
            </div>
            <div v-if="viewFlag">
              <el-tag
                v-for="(item,index) in dataInstance.userListItemList"
                :key="index"
              >{{item.username}}</el-tag>
            </div>
            <div v-if="editFlag">
              <el-tag
                v-for="(item,index) in dataInstance.userListItemList"
                :key="index"
              >{{item.username}}</el-tag>
              <selectUser v-model="dataInstance.accendantUserIdList"></selectUser>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item v-if="!addFlag" label="创建人 :">
            <span>{{dataInstance.createUsername}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注 :">
        <el-input
          v-model="dataInstance.remark"
          :style="dialogItemStyleObj"
          type="textarea"
          :readonly="viewFlag"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary" @click="handleUpdateOrSave" size="small">确 定</el-button>
    </span>
  </div>
</template>
<script>
import selectUser from "@/components/Admin/selectUser";
import SingleUpload from "@/components/Upload/singleUpload";
import { STATUS_MAP, STATUS_MAP_QUERY } from "@/utils/status";
import { LEVEL_MAP, CONTROLLER_LEVEL_MAP } from "@/utils/level";
import { createEntity, updateEntity, getEntity } from "@/api/customer";
const defaultDataInstance = {
  albumPic: "",
  city: "",
  company: "",
  level: "G",
  controlLevel: "auto",
  country: "",
  detailAddress: "",
  email: "",
  facebook: "",
  fax: "",
  firstName: "",
  lastName: "",
  mobile: "",
  nickName: "",
  phone: "",
  postcode: "",
  province: "",
  createUsername: "",
  accendantUsername: "",
  remark: "",
  source: "alibaba",
  status: "",
  tagsArray: [],
  tags: "",
  accendantUserIdList: [],
  accendantUserList: [],
  whatsapp: "",
  id: null,
};
export default {
  name: "customerInforDetail",
  components: { SingleUpload, selectUser },
  filters: {
    gmtCreateTimeFormat() {},
  },
  props: {
    showFlag: {
      type: String,
    },
    customerId: {
      type: Number,
    },
  },
  data() {
    return {
      dataInstance: Object.assign({}, defaultDataInstance),
      operateType: null,
      selectDialogVisible: false,
      inputNewTagVisible: false,
      inputNewTagValue: "",
      inputNewTagVisible: false,
      viewFlag: false, //查看状态
      editFlag: false, //修改状态
      addFlag: true, // 添加状态
      dialogItemStyleObj: {},
      statusMapQuery: Object.assign({}, STATUS_MAP_QUERY),
      statusMap: Object.assign({}, STATUS_MAP),
      levelMap: Object.assign({}, LEVEL_MAP),
      controllerLevelMap: Object.assign({}, CONTROLLER_LEVEL_MAP),
      rules: {
        firstName: [
          { trigger: "blur", required: true, message: "请输入first name" },
        ],
        lastName: [
          { trigger: "blur", required: true, message: "请输入last name" },
        ],
        email: [{ trigger: "blur", required: true, message: "请输入客户邮箱" }],
        source: [{ trigger: "blur", required: true, message: "客户来源" }],
        mobile: [{ trigger: "blur", required: false, message: "手机号" }],
        phone: [{ trigger: "blur", required: false, message: "座机号" }],
      },
    };
  },
  created() {
    if (this.customerId) {
      this.getEntity();
    } else {
      this.dataInstance = Object.assign({}, defaultDataInstance);
    }
    this.formatFlag(this.showFlag);
  },
  watch: {
    showFlag: function (newVal, oldVal) {
      this.formatFlag(newVal);
    },
    customerId: function (newVal, oldVal) {
      if (newVal) {
        this.getEntity();
      } else {
        this.dataInstance = Object.assign({}, defaultDataInstance);
      }
    },
  },
  methods: {
    formatFlag(newVal) {
      switch (newVal) {
        case "查看":
          this.viewFlag = true;
          this.editFlag = false;
          this.addFlag = false;
          break;
        case "修改":
          this.viewFlag = false;
          this.editFlag = true;
          this.addFlag = false;
          break;
        case "添加":
          this.viewFlag = false;
          this.editFlag = false;
          this.addFlag = true;
          break;
      }
    },
    updateOrSave() {
      this.$confirm(`是要${this.showFlag}?`, "提示", {
        confirmButtonTex: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 将tags复原
        let tags = this.dataInstance.tagsArray;
        this.dataInstance.tags = tags.map((e) => e.name).join(",");
        if (this.showFlag === "修改") {
          updateEntity(this.dataInstance.id, this.dataInstance).then(
            (response) => {
              this.$message({
                type: "success",
                message: "修改成功",
              });
              this.dataInstance = Object.assign({}, defaultDataInstance);
            }
          );
        } else {
          createEntity(this.dataInstance).then((response) => {
            this.$message({
              type: "success",
              message: "添加成功",
            });
            this.dataInstance = Object.assign({}, defaultDataInstance);
          });
        }
      });
    },
    handleNewTagInputConfirm() {
      let inputNewTagValue = this.inputNewTagValue;
      if (inputNewTagValue) {
        this.dataInstance.tagsArray.push({
          name: inputNewTagValue,
          type: "info",
        });
      }
      this.inputNewTagVisible = false;
      this.inputNewTagValue = "";
    },
    obtainInputItem(item) {
      if (item) {
        this.dataInstance.accendantUsername = item.value;
        this.dataInstance.accendantId = item.id;
      }
    },
    getEntity() {
      if (this.customerId) {
        getEntity(this.customerId).then((resp) => {
          this.dataInstance = resp.data;
          console.log(resp.data);
          let tags = [];
          if (this.dataInstance.tags) {
            this.dataInstance.tags.split(",").forEach((e) => {
              tags.push({
                name: e,
                type: "success",
              });
            });
          }
          this.dataInstance.createUsername = resp.data.createUser.note;
          this.dataInstance.tagsArray = tags;
        });
      } else {
        this.$message({
          message: "查询失败",
          type: "info",
        });
      }
    },
    showNewTagInput() {
      this.inputNewTagVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleCloseTag(tag) {
      this.dataInstance.tagsArray.splice(
        this.dataInstance.tagsArray.indexOf(tag),
        1
      );
    },
    handleUpdateOrSave() {
      this.$refs.customerInfoForm.validate((valid) => {
        if (valid) {
          this.updateOrSave();
        } else {
          this.$message({
            message: "填写完必填项",
            type: "error",
            duration: 1000,
          });
          return false;
        }
      });
    },
  },
};
</script>
<style>
</style>