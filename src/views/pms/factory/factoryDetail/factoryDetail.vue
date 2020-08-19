<template>
  <div class="detail-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="工厂信息" name="first">
        <el-card shadow="never" class="standard-margin">
          <div slot="header" class="clearfix">
            <span class="font-title-medium">工厂信息</span>
            <el-button @click="goBack" style="float: right; padding: 3px 0" type="text">返回</el-button>
          </div>
          <div class="form-container-border">
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">工厂名称</el-col>
              <el-col
                class="form-border font-small"
                :span="18"
              >{{factoryDetail.name | handlerFormatter}}</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">别名</el-col>
              <el-col
                class="form-border font-small"
                :span="18"
              >{{factoryDetail.nickName | handlerFormatter}}</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">公司电话</el-col>
              <el-col
                class="form-border font-small"
                :span="18"
              >{{factoryDetail.phone | handlerFormatter}}</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">公司官网</el-col>
              <el-col
                class="form-border font-small"
                :span="18"
              >{{factoryDetail.portalWebsite | handlerFormatter}}</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">公司店铺网站</el-col>
              <el-col
                class="form-border font-small"
                :span="18"
              >{{factoryDetail.shopWebsite | handlerFormatter}}</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">法人信息</el-col>
              <el-col
                class="form-border font-small"
                :span="18"
              >{{factoryDetail.owner | handlerFormatter}}</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">法人电话</el-col>
              <el-col
                class="form-border font-small"
                :span="18"
              >{{factoryDetail.ownerPhone | handlerFormatter}}</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">法人性别</el-col>
              <el-col
                class="form-border font-small"
                :span="18"
              >{{factoryDetail.ownerSex | formatSex}}</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">创建人姓名</el-col>
              <el-col
                class="form-border font-small"
                :span="18"
              >{{factoryDetail.createName | handlerFormatter}}</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">业务员</el-col>
              <el-col
                class="form-border font-small"
                :span="18"
              >{{factoryDetail.createName | handlerFormatter}}</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">级别</el-col>
              <el-col
                class="form-border font-small"
                :span="18"
              >{{factoryDetail.level | handlerFormatter}}</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">传真</el-col>
              <el-col
                class="form-border font-small"
                :span="18"
              >{{factoryDetail.fax | handlerFormatter}}</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">备注</el-col>
              <el-col
                class="form-border font-small"
                :span="18"
              >{{factoryDetail.remark | handlerFormatter}}</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">创建时间</el-col>
              <el-col
                class="form-border font-small"
                :span="18"
              >{{factoryDetail.gmtCreate | formatTime}}</el-col>
            </el-row>
          </div>
        </el-card>
      </el-tab-pane>
      <!-- 联系人列表 -->
      <el-tab-pane label="工厂联系人列表" name="second">
        <el-card shadow="never" class="standard-margin">
          <div slot="header" class="clearfix">
            <span class="font-title-medium">工厂联系人列表</span>
            <el-button
              style="float: right; padding: 3px 0"
              @click="createBtn('contact')"
              type="text"
            >添加联系人</el-button>
          </div>
          <el-table
            :data="factoryDetail.factoryContacts"
            @selection-change="selectionContactChange"
            style="width: 100%"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="联系人别名">
                    <span>{{ props.row.contactName }}</span>
                  </el-form-item>
                  <el-form-item label="联系人微信">
                    <span>{{ props.row.wx }}</span>
                  </el-form-item>
                  <el-form-item label="联系人QQ号">
                    <span>{{ props.row.qq }}</span>
                  </el-form-item>
                  <el-form-item label="联系人阿里账号">
                    <span>{{ props.row.alitalk }}</span>
                  </el-form-item>
                  <el-form-item label="联系人职务">
                    <span>{{ props.row.contactTitle }}</span>
                  </el-form-item>
                  <el-form-item label="联系人备注">
                    <span>{{ props.row.remark }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="姓名" prop="contactName"></el-table-column>
            <el-table-column label="电话" prop="contactPhone"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="updateBtn(scope.row,'contact')" type="text">修改</el-button>
                <el-button @click="deleteBtn(scope.row.id,'contact')" type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="batch-operate-container">
            <el-select size="small" v-model="operateType" placeholder="批量操作">
              <el-option
                v-for="item in operates"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>

            <el-button
              style="margin-left: 20px"
              class="search-button"
              @click="batchOperation()"
              type="primary"
              size="small"
            >确定</el-button>
          </div>
        </el-card>
      </el-tab-pane>
      <!-- 厂商地址 -->
      <el-tab-pane label="工厂地址管理" name="fourth">
        <el-card shadow="never" class="standard-margin">
          <div slot="header" class="clearfix">
            <span class="font-title-medium">工厂地址</span>
            <el-button
              style="float: right; padding: 3px 0"
              @click="createBtn('address')"
              type="text"
            >添加厂商地址</el-button>
          </div>
          <el-table
            :data="factoryDetail.factoryAddresses"
            @selection-change="selectionAddressChange"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="联系人">
                    <span>{{ props.row.contactName }}</span>
                  </el-form-item>
                  <el-form-item label="电话">
                    <span>{{props.row.phone}}</span>
                  </el-form-item>
                  <el-form-item label="邮编">
                    <span>{{ props.row.postcode }}</span>
                  </el-form-item>
                  <el-form-item label="详细地址地址">
                    <span>{{ props.row.detailAddress }}</span>
                  </el-form-item>
                  <el-form-item label="备注">
                    <span>{{ props.row.remark }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="省份" prop="province"></el-table-column>
            <el-table-column label="城市" prop="city"></el-table-column>
            <el-table-column label="地区" prop="region"></el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="updateBtn(scope.row,'address')" type="text">修改</el-button>
                <el-button @click="deleteBtn(scope.row.id,'address')" type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="batch-operate-container">
            <el-select size="small" v-model="operateType" placeholder="批量操作">
              <el-option
                v-for="item in operates"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>

            <el-button
              style="margin-left: 20px"
              class="search-button"
              @click="batchAddressOperation()"
              type="primary"
              size="small"
            >确定</el-button>
          </div>
        </el-card>
      </el-tab-pane>
      <!-- 厂商图片 -->
      <el-tab-pane label="厂商图片" name="third">
        <el-card shadow="never" class="standard-margin">
          <div slot="header" class="clearfix">
            <span class="font-title-medium">厂商图片</span>
          </div>
          <div class="standard-margin">
            <div>
              <a>厂商图片</a>
              <a style="font:12px Extra Small; color:#C0C4CC">点击放大查看更多</a>
            </div>
            <br />
            <div class="demo-image__preview">
              <el-image style="width: 100px; height: 100px" :src="url" :preview-src-list="srcList"></el-image>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- 工厂地址创建与修改 -->
    <el-dialog :visible.sync="dialogFactoryAddressVisible" @closed="getDetail()" width="30%">
      <factory-address-detail :factoryId="id" :detail="newDetail"></factory-address-detail>
    </el-dialog>
    <!-- 工厂联系人创建与修改 -->
    <el-dialog :visible.sync="dialogFactoryContactVisible" @closed="getDetail()" width="30%">
      <factory-contact-detail :factoryId="id" :detail="newDetail"></factory-contact-detail>
    </el-dialog>
  </div>
</template>
<script>
import {
  deleteFactoryAddress,
  batchAddressUpdateStatus,
  deleteFactoryAddressBatch
} from "@/api/factoryAddress";
import {
  batchUpdateContactStatus,
  deleteFactoryContactBacth,
  deleteFactoryContact
} from "@/api/factoryContact";
import { getFactoryDetail } from "@/api/factory";
import { formatDate } from "@/utils/date";
import factoryAddressDetail from "@/views/pms/factory/factoryAddress/index";
import factoryContactDetail from "@/views/pms/factory/factoryContact/index";

export default {
  components: { factoryAddressDetail, factoryContactDetail },
  data() {
    return {
      isCreate: true,
      dialogFactoryAddressVisible: false,
      dialogFactoryContactVisible: false,
      activeName: "first",
      id: null,
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      srcList: [
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
        "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
        "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
        "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
        "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
        "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg"
      ],
      factoryDetail: {
        id: null,
        albumId: null,
        accendantId: null,
        accendantName: null,
        controlLevel: null,
        createName: null,
        createUserId: null,
        fax: null,
        gmtCreate: null,
        level: null,
        name: null,
        nickName: null,
        owner: null,
        ownerPhone: null,
        ownerSex: null,
        phone: null,
        picturePath: null,
        portalWebsite: null,
        remark: null,
        shopWebsite: null,
        spellName: null,
        status: null
      },
      operateType: 0,
      operates: [
        {
          label: "普通",
          value: 0
        },
        {
          label: "冻结",
          value: 1
        },
        {
          label: "删除",
          value: 2
        }
      ],
      newDetail: {
        id: null
      },
      searchAddressList: [],
      searchContactList: []
    };
  },
  created() {
    let factoryId = this.$route.query.id;
    if (factoryId != undefined && factoryId != null && factoryId > 0) {
      this.id = factoryId;
      this.getDetail(factoryId);
    } else {
      this.$router.push("/factory");
    }
  },
  computed: {},
  filters: {
    formatSex(val) {
      if (val === "1") return "男";
      if (val === "2") return "女";
      return "未知性别";
    },
    formatTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    handlerFormatter(value) {
      if (value == null || value == "") {
        return "未填写";
      } else {
        return value;
      }
    }
  },
  methods: {
    //批量操作---地址
    selectionAddressChange(val) {
      let array = [];
      val.forEach(element => {
        array.push(element.id);
      });
      this.searchAddressList = Object.assign([], array);
    },
    batchAddressOperation() {
      if (this.searchAddressList.length <= 0) {
        this.$message({
          message: "您尚未选取任意一条记录",
          type: "error"
        });
      } else {
        this.$confirm("是否要确认?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          if (this.operateType === 0) {
            this.updateStatusAddress(this.searchAddressList, "normal");
          } else if (this.operateType === 1) {
            this.updateStatusAddress(this.searchAddressList, "freeze");
          } else if (this.operateType === 2) {
            this.deleteAddressBatch(this.searchAddressList);
          } else {
            this.$message({
              message: "您尚未选取操作方式",
              type: "error"
            });
          }
        });
      }
    },
    getDetail(id) {
      getFactoryDetail(this.id).then(response => {
        this.factoryDetail = response.data;
      });
    },
    updateStatusAddress(ids, status) {
      let idsStatus = {
        ids: ids,
        status: status
      };
      batchAddressUpdateStatus(idsStatus).then(response => {
        this.$message({
          message: "操作成功",
          type: "success"
        });
        this.getDetail();
      });
    },
    deleteAddressBatch(ids) {
      deleteFactoryAddressBatch(ids).then(response => {
        this.$message({
          message: "操作成功",
          type: "success"
        });
        this.getDetail();
      });
    },
    //批量操作---联系人
    batchOperation() {
      if (this.searchContactList.length <= 0) {
        this.$message({
          message: "您尚未选取任意一条记录",
          type: "error"
        });
      } else {
        this.$confirm("是否要确认?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          if (this.operateType === 0) {
            this.updataContactStatus(this.searchContactList, "normal");
          } else if (this.operateType === 1) {
            this.updataContactStatus(this.searchContactList, "freeze");
          } else if (this.operateType === 2) {
            this.deleteContactBatch(this.searchContactList);
          } else {
            this.$message({
              message: "您尚未选取操作方式",
              type: "error"
            });
          }
        });
      }
    },
    updataContactStatus(ids, status) {
      let idsStatus = {
        ids: ids,
        status: status
      };
      batchUpdateContactStatus(idsStatus).then(response => {
        this.$message({
          message: "操作成功",
          type: "success"
        });
        this.getDetail();
      });
    },
    deleteContactBatch(ids) {
      deleteFactoryContactBacth(ids).then({
        message: "操作成功",
        type: "success"
      });
      this.getDetail();
    },
    selectionContactChange(val) {
      let array = [];
      val.forEach(element => {
        array.push(element.id);
      });
      this.searchContactList = array;
    },
    //批量操作结束
    goBack() {
      this.$router.back(-1);
    },
    createBtn(type) {
      if (!this.isCreate) {
        this.newDetail = { id: null };
      }
      this.dialogFactoryAddressVisible = type === "address" ? true : false;
      this.dialogFactoryContactVisible = type === "contact" ? true : false;
      this.isCreate = true;
    },
    updateBtn(row, type) {
      this.newDetail = Object.assign({}, row);
      this.isCreate = false;
      if (type === "address") {
        this.dialogFactoryAddressVisible = true;
      } else {
        this.dialogFactoryContactVisible = true;
      }
    },
    deleteBtn(id, type) {
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (type === "address") {
          deleteFactoryAddress(id).then(response => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getDetail();
          });
        } else if (type === "contact") {
          deleteFactoryContact(id).then(response => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getDetail();
          });
          console.log("即将删除当前联系人   " + id);
        }
      });
    }
  }
};
</script>
<style scoped>
.detail-container {
  position: absolute;
  left: 0;
  right: 0;
  width: 1080px;
  padding: 35px 35px 15px 35px;
  margin: 20px auto;
}

.standard-margin {
  margin-top: 15px;
}
.form-border {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
}

.form-container-border {
  border-left: 1px solid #dcdfe6;
  border-top: 1px solid #dcdfe6;
  margin-top: 15px;
}

.photo-magin {
  margin-top: 10px;
  display: flex;
  flex-flow: row;
}

.form-left-bg {
  background: #f2f6fc;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>


