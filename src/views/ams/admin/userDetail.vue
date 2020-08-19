<template>
  <div class="user-info-detail">
    <el-card class="operate-container" shadow="never">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
        <el-button
          v-show="viewFlag"
          @click="viewFlag = false"
          style="float: right; padding: 3px 0"
          type="text"
        >修改</el-button>
        <el-button
          v-show="!viewFlag"
          @click="viewFlag = true"
          style="float: right; padding: 3px 0"
          type="text"
        >提交修改</el-button>
      </div>
      <el-form
        :model="dataInstance"
        ref="createAdminForm"
        label-position="left"
        label-width="100px"
        :rules="rules"
        :inline="true"
      >
        <el-form-item label="头像：" prop="icon">
          <template v-if="viewFlag">
            <el-image :src="dataInstance.icon" style="width: 80px;" />
          </template>
          <template v-else>
            <single-upload v-model="dataInstance.icon" :style="dialogItemStyleObj"></single-upload>
          </template>
        </el-form-item>
        <el-form>
          <el-form-item v-show="viewFlag" label="查看权限：" >
            <el-button @click="innerPermissionVisible=true">点击查看权限</el-button>
          </el-form-item>
          <el-form-item v-show="viewFlag" label="角色标签：" style="display: block;">
            <el-tag v-for="item in dataInstance.roles" :key="item.id" effect="plain">{{ item.name }}</el-tag>
          </el-form-item>
        </el-form>
        <!-- 权限弹窗-->
        <el-dialog
          placement="right"
          width="400"
          trigger="click"
          :visible.sync="innerPermissionVisible"
        >
          <el-table :data="dataInstance.permissions">
            <el-table-column prop="name" label="权限名称"></el-table-column>
            <el-table-column prop="value" label="权限编码"></el-table-column>
            <el-table-column prop="type" label="权限类型">
              <template slot-scope="scope">{{scope.type}}</template>
            </el-table-column>
          </el-table>
        </el-dialog>
        <!-- end-->
        <el-form-item label="邮箱：" prop="email">
          <el-input
            v-model="dataInstance.email"
            :style="dialogItemStyleObj"
            type="email"
            :disabled="viewFlag"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="username"> 
          <el-input
            v-model="dataInstance.username"
            :style="dialogItemStyleObj"
            :disabled="viewFlag"
            placeholder="例:张三->san.zhang"
          ></el-input>
        </el-form-item>
        <el-form-item label="英文名：" prop="nickName">
          <el-input
            v-model="dataInstance.nickName"
            :disabled="viewFlag"
            :style="dialogItemStyleObj"
          ></el-input>
        </el-form-item>
        <el-form-item label="中文名：">
          <el-input
            v-model="dataInstance.note"
            :style="dialogItemStyleObj"
            :disabled="viewFlag"
          ></el-input>
        </el-form-item>
        <el-form-item label="业务员编码">
          <el-input
            :disabled="viewFlag"
            :style="dialogItemStyleObj"
            v-model="dataInstance.adminCode"
            placeholder="输入英文名首字母 + 中文名字拼音首字母"
          ></el-input>
        </el-form-item>

        <el-form-item label="业务组">
          <business-group-input
            v-show="!viewFlag"
            :style="dialogItemStyleObj"
            v-model="dataInstance.groupId"
          ></business-group-input>
          <el-input
            :style="dialogItemStyleObj"
            :disabled="viewFlag"
            v-show="viewFlag"
            v-model="groupName"
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺">
          <select-shop-input
            v-show="!viewFlag"
            :style="dialogItemStyleObj"
            v-model="dataInstance.shopId"
          ></select-shop-input>
          <el-input
            v-show="viewFlag"
            :style="dialogItemStyleObj"
            :disabled="viewFlag"
            v-model="shopName"
          ></el-input>
        </el-form-item>

        <el-form-item label="手机">
          <el-input :style="dialogItemStyleObj" :disabled="viewFlag" v-model="dataInstance.phone"></el-input>
        </el-form-item>
        <el-form-item label="QQ">
          <el-input :style="dialogItemStyleObj" :disabled="viewFlag" v-model="dataInstance.qqNum"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="updateDetal" v-show="!viewFlag">提交修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="operate-container" shadow="never">
      <div slot="header" class="clearfix">
        <span>小组信息</span>
      </div>
      <el-form label-width="100px" :inline="true" label-position="right">
        <el-form-item label="所属小组：">
          <el-input v-model="groupName"></el-input>
        </el-form-item>
        <el-form-item label="小组组长:">
          <el-input v-model="dataInstance.groupOwnerName"></el-input>
        </el-form-item>
      </el-form>
      <el-divider content-position="left">小组成员</el-divider>
      <el-table :data="groupMember">
        <el-table-column prop="note" label="姓名"></el-table-column>
        <el-table-column prop="nickName" label="别名"></el-table-column>
        <el-table-column prop="phone" label="手机"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="绩效">
          <el-button size="mini" type="text" @click="handleAdd()">添加绩效</el-button>
          <el-button size="mini" type="text" @click="handleEdit()">修改绩效</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import SelectShopInput from "@/components/Shop/selectShopInput";
import BusinessGroupInput from "@/components/BusinessGroup/businessGroupInput";
import { getMyAdminDetail, updateAdmin, getGroupMember } from "@/api/admin";
import SingleUpload from "@/components/Upload/singleUpload";
const defaultdataInstance = {
  username: "",
  nickName: "",
  password: "",
  email: "",
  icon: "",
  note: "",
  status: 0,
  id: null,
  shop: { name: "未选择商铺" },
  group: { name: "未选择小组" }
};
export default {
  name: "userDetail",
  components: { SingleUpload, BusinessGroupInput, SelectShopInput },
  created() {
    this.getMyAdminDetail();
  },
  filters: {
    permissionTypes(val) {
      if (val === 0) return "目录";
      if (val === 1) return "菜单";
      if (val === 2) return "按钮";
    }
  },
  data() {
    return {
      
      adminId: null,
      innerVisible: false,
      innerPermissionVisible: false,
      viewFlag: true,
      shopName: "未选择商铺",
      groupName: "未选择小组",
      groupMember: [],
      editFlag: false,
      value: null,
      rules: {
        icon: [{ trigger: "blur", required: true, message: "请上传头像" }],
        username: [
          {
            trigger: "blur",
            required: true,
            message: "请输入用户名，尽量使用英文书写方式，例如: 张三->san.zhang"
          }
        ],
        email: [
          {
            type: "email",
            trigger: "blur",
            required: true,
            message: "请输入邮箱"
          }
        ],
        nickname: [{ trigger: "blur", required: false }],
        status: [{ trigger: "change", required: true, message: "请选择状态" }]
        // password: [{ trigger: "blur", required: true, message: "请输入密码" }]
      },
      dialogItemStyleObj: {
        width: "300px"
      },
      renderFunc(h, option) {
        return <span>{option.label}</span>;
      },
      dataInstance: Object.assign({}, defaultdataInstance)
    };
  },
  methods: {
    getMyAdminDetail() {
      getMyAdminDetail().then(response => {
        console.log(response)
        let detail = response.data;
        this.dataInstance = Object.assign({}, response.data);
        if (detail.shop != null) {
          this.shopName = detail.shop.name;
        }
        if (detail.group != null) {
          this.groupName = detail.group.name;
          this.getGroupMember(detail.group.id);
        }
      });
    },
    updateDetal() {
      updateAdmin(this.dataInstance.id, this.dataInstance).then(response => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.viewFlag = true;
        this.getMyAdminDetail();
      });
    },
    getGroupMember(id) {
      getGroupMember(id).then(response => {
        this.groupMember = response.data;
      });
    },
    // 修改绩效
    handleEdit(){},
    // 增加绩效
    handleAdd(){}

  }
};
</script>

<style>
.user-info-detail {
  width: 80%;
  top: 30px;
  margin: 0 auto;
  
}
</style>