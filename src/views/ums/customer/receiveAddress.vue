<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="收货人名">
            <el-input v-model="listQuery.name" class="input-width" placeholder="收货人名" v-on:blur.enter="getList()"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="listQuery.status" placeholder="全部" clearable class="input-width" @change.enter="getList()">
              <el-option v-for="(v, k) in statusMapQuery"
                         :key="k"
                         :label="v"
                         :value="k">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleEdit(null, null, 2)">添加客户收货地址</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdminTable"
                :data="list"
                style="width: 100%;"
                :stripe="true"
                @selection-change="handleSelectionChange"
                :row-class-name="tableRowClassName"
                v-loading="listLoading" 
                border>
        <el-table-column type="selection" width="60" align="center" />
         <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="收货人: ">
                      <span>{{ props.row.name }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="email: ">
                      <span>{{ props.row.email }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="座机号: ">
                      <span>{{ props.row.phone }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号: ">
                      <span>{{ props.row.mobile }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="收货国家或地区: ">
                      <span>{{ props.row.country }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="州: ">
                      <span>{{ props.row.province }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="城市: ">
                      <span>{{ props.row.city }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="邮编: ">
                       <span>{{props.row.postcode}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                    <el-form-item label="详细地址: ">
                        <span>{{ props.row.detailAddress }}</span>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="创建时间: ">
                      <span>{{ props.row.gmtCreate | gmtCreateFormat }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="备注: ">
                       <span>{{props.row.remark}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="编号" width="80" align="center" prop="id" />
        <el-table-column label="收货人" align="center" width="150" prop="name" />
        <el-table-column label="email" align="center" width="150" prop="email" />
        <el-table-column label="座机号" align="center" width="120" prop="phone" />
        <el-table-column label="手机号" align="center" width="120" prop="mobile" />
        <el-table-column label="国家或地区" align="center" width="150" prop="country" /> 
        <el-table-column label="州" align="center" width="120" prop="province" />
        <el-table-column label="城市" align="center" width="120" prop="city" />               
        <el-table-column label="创建时间" width="150" align="center">
          <template slot-scope="scope">{{scope.row.gmtCreate | gmtCreateTimeFormat}}</template>
        </el-table-column>
        <el-table-column label="状态" width="150" align="center">
          <template slot-scope="scope">
            <el-switch
            @change="handleRecommendStatusStatusChange(scope.$index, scope.row)"
            active-value="normal"
            inactive-value="freeze"
            :active-text="statusMap['normal']"
            :inactive-text="statusMap['freeze']"
            v-model="scope.row.status">
          </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleEdit(scope.$index, scope.row, 0)">查看
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleEdit(scope.$index, scope.row, 1)">修改
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row, 2)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogTitle + '设置'"
               :visible.sync="sortDialogVisible"
               width="40%">
      <el-form :model="dataInstance"
               label-width="150px"
               ref="form"
               :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="收货人：" prop="name" label-width="150px">
              <el-input v-model="dataInstance.name" :style="dialogItemStyleObj" :readonly="viewFlag"  placeholder="请输入收货人姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货人邮箱：" prop="email" label-width="150px">
              <el-input v-model="dataInstance.email" type="email" :style="dialogItemStyleObj" :readonly="viewFlag" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="座机号：" prop="phone" label-width="150px">
                <el-input v-model="dataInstance.phone" :style="dialogItemStyleObj" :readonly="viewFlag" ></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="手机号：" prop="mobile" label-width="150px">
                <el-input v-model="dataInstance.mobile" :style="dialogItemStyleObj" :readonly="viewFlag"></el-input>
              </el-form-item>
          </el-col>
        </el-row>
          <el-col :span="12">
              <el-form-item label="国家或地区：" prop="country" label-width="150px">
                <el-input v-model="dataInstance.country" :style="dialogItemStyleObj" :readonly="viewFlag" ></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="州：" prop="province" label-width="150px">
                <el-input v-model="dataInstance.province" :style="dialogItemStyleObj" :readonly="viewFlag"  ></el-input>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="城市：" prop="city" label-width="150px">
                <el-input v-model="dataInstance.city" :style="dialogItemStyleObj" :readonly="viewFlag" ></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="邮编：" prop="postcode" label-width="150px">
                <el-input v-model="dataInstance.postcode" :style="dialogItemStyleObj" :readonly="viewFlag"></el-input>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="详细收货地址：" prop="detailAddress" label-width="150px">
                  <el-input type="textarea" :rows="3" v-model="dataInstance.detailAddress" :style="dialogItemStyleObj" :readonly="viewFlag"></el-input>
                </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" >
              <el-form-item label="状态：" prop="status" label-width="150px">
                  <el-switch
                    active-value="normal"
                    inactive-value="freeze"
                    :active-text="statusMap['normal']"
                    :inactive-text="statusMap['freeze']"
                    v-model="dataInstance.status"
                    :disabled="viewFlag"
                    >
                  </el-switch>
                </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
              <el-form-item label="备注：" prop="remark" label-width="150px">
                  <el-input type="textarea" v-model="dataInstance.remark" :style="dialogItemStyleObj" :readonly="viewFlag"></el-input>
              </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" v-if="!viewFlag" >
        <el-button @click="sortDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleUpdateOrSave" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {formatDate} from '@/utils/date'
  import {STATUS_MAP, STATUS_MAP_QUERY} from '@/utils/status'
  import {LEVEL_MAP, CONTROLLER_LEVEL_MAP} from '@/utils/level'
  import {fetchList, createEntity, deleteEntity, getEntity, updateEntity, patchEntity, batchUpdateEntityStatus, batchDeleteEntity} from '@/api/customerReceiveAddress'
  import SingleUpload from '@/components/Upload/singleUpload'
  import AdminUserInput from '@/components/Admin/adminUserInput'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    customerId: null,
    name: null,
    status: null,
  };
  export default {
    name: 'customerReceiveAddress',
    components:{SingleUpload, AdminUserInput},
    props: {
      customerId: {
        type: Number,
        default: null,
      }, 
    },
    data() {
      return {
        fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
        listQuery: Object.assign({}, defaultListQuery),
        statusMapQuery: Object.assign({}, STATUS_MAP_QUERY),
        statusMap: Object.assign({}, STATUS_MAP),
        levelMap: Object.assign({}, LEVEL_MAP),
        controllerLevelMap: Object.assign({}, CONTROLLER_LEVEL_MAP),
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
        operates: [
          {
            label: "启用",
            value: 0,
          }, 
          {
            label: '禁用',
            value: 1,
          },
          {
            label: "删除",
            value: 2,
          }
        ],
        operateType: null,
        selectDialogVisible:false,
        sortDialogVisible:false,
        dataInstance: {
          customerId: this.customerId,
          name: "",
          phone: "",
          mobile: null,
          status: null,
          country: null,
          province: "",
          city: null,
          detailAddress: null,
          postcode: null,
          remark: null,
          email: null,
        },
        inputNewTagVisible: false,
        inputNewTagValue: '',
        viewFlag: false,
        editFlag: false,
        addFlag: true,
        newData: Object.assign({}, this.dataInstance),
        idNameList: [],
        dialogItemStyleObj: {
        },
        dialogTitle: '添加',
        viewElRowStyle: {
          height: "60px",
          margin: "10px",
        },
        rules: {
          name:  [{trigger: 'blur', required: true, message: '请输入收件人姓名', }, ],
          email:  [{trigger: 'blur', required: true , message: '请输入邮箱号码', }, ],
          mobile: [{trigger: 'blur', required: true,  message: '请输入手机号', },],
          phone: [{trigger: 'blur', required: true, message: '请输入座机号', },],
          country:  [{trigger: 'blur', required: true, message: '请输入国家或地区', }, ],
          province: [{trigger: 'blur', required: true, message: '请输入州', }],
          city: [{trigger: 'blur', required: true, message: '请输入城市', }],
          detailAddress: [{trigger: 'blur', required: true, message: '请输入详细地址', }, ],          
          postcode: [{trigger: 'blur', required: true, message: '请输入邮编', }],
          status: [{trigger: 'change', required: true, message: '请选择状态',},],
        }
      }
    },
    computed: {
    }, 
    created() {
      console.log(this.listQuery);
      if(!this.$route.query.customerId) {
         this.$message({
            message: '请选择客户记录',
            type: 'warning',
            duration: 1000
          });
        this.$router.push({name: 'customer'});
        return;
      }
      console.log(this.listQuery);
      this.listQuery.customerId = this.$route.query.customerId;
      this.getList();
    },
    filters:{
      gmtCreateTimeFormat(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      statusFormat(status) {
          return statusMap[status];
      },
      quantityFormat(quantity) {
        if (quantity != null || quantity != undefined) {
          return quantity;
        }
        return 0;
      },
      amountFormat(amount) {
        if (amount != null || amount != undefined) {
          return amount;
        }
        return 0;
      },
      succTransRateFormat(entity) {
        if (!entity.numTrans) {
          return 0;
        }
        if (!entity.succNumTrans) {
          entity.succNumTrans = 0;
        }
        // 保留2位小数
        return (entity.succNumTrans/ entity.numTrans).toFixed(2);
      },
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (row.status === 0) {
          return "deleted-row";
        }
        return "normal-row";
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        if (val != defaultListQuery.pageSize) {
          this.getList();
        }
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleRecommendStatusStatusChange(index, row){
        this.updateAdminStatus(row.id, row.status);
      },
      handleDelete(index,row){
        let ids = [row.id];
        this.multiDeleteAdmins(ids);
      },
      handleBatchOperate(){
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        if (this.operateType === 0) {
          //启用
          this.multiUpdateAdminStatus(ids, 'normal');
        } else if (this.operateType === 1) {
          //禁用
          this.multiUpdateAdminStatus(ids, 'freeze');
        } else if(this.operateType === 2){
          //删除
          this.multiDeleteAdmins(ids);
         } else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
      },
      handleAddUser(){
        this.selectDialogVisible = true;
        this.getDialogList();
      },
      handleSelectSearch(){
        this.getDialogList();
      },
      handleDialogSizeChange(val) {
        this.dataInstance.listQuery.pageNum = 1;
        this.dataInstance.listQuery.pageSize = val;
        this.getDialogList();
      },
      handleDialogCurrentChange(val) {
        this.dataInstance.listQuery.pageNum = val;
        this.getDialogList();
      },
      handleDialogSelectionChange(val){
        this.dataInstance.multipleSelection = val;
      },
      handleCloseTag(tag) {
        this.dataInstance.tagsArray.splice(
          this.dataInstance.tagsArray.map(e => e.name).indexOf(tag)
          , 1);
      },
      showNewTagInput() {
        this.inputNewTagVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleNewTagInputConfirm() {
        let inputNewTagValue = this.inputNewTagValue;
        if (inputNewTagValue) {
          this.dataInstance.tagsArray.push({
            name: inputNewTagValue,
            type: 'info',
          });
        }
        this.inputNewTagVisible = false;
        this.inputNewTagValue = '';
      },
      obtainInputItem(item) {
        if (item) {
          this.dataInstance.accendantUsername = item.value;
          this.dataInstance.accendantId = item.id;
        }
      },
      handleEdit(index, row, op) {
        // op=0 查看，op=1 修改, op=2 添加
        if (op === 0 || op === null || op === undefined) {
          this.dialogTitle = '查看';
          this.viewFlag = true;
          this.editFlag = false;
          this.addFlag = false;
        } else if (op === 1) {
          this.dialogTitle = '修改';
          this.viewFlag = false;
          this.editFlag = true;
          this.addFlag = false;
        } else {
          this.dialogTitle = '添加';
          this.viewFlag = false;
          this.editFlag = false;
          this.addFlag = true;
        }
        this.sortDialogVisible = true;
        if (index != null && index >= 0) {
           this.dataInstance = Object.assign({}, this.dataInstance, row);
           this.dataInstance.id = row.id;
        } else {
          if (this.dataInstance.id != null) {
              this.dataInstance = Object.assign({}, this.newData);
          }
        }
      },
      handleUpdateOrSave() {
        this.$refs.form.validate((valid) => {
              if (valid) {
                this.updateOrSave();
              }
              else  {
                this.$message({
                  message: "填写完必填项",
                  type: "error",
                  duration: 1000
                });
                return false;
              }
        });
      },
      updateOrSave() {
        this.$confirm(`是要${this.dialogTitle}?`, '提示', {
          confirmButtonTex: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataInstance.customerId = this.listQuery.customerId;
          if (this.dialogTitle === '修改') {
            updateEntity(this.dataInstance.id, this.dataInstance).then(response => {
              this.sortDialogVisible = false;
              this.getList();
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.dataInstance = Object.assign({}, this.newData);
            });
          } else if (this.dialogTitle === '添加') {
            createEntity(this.dataInstance).then(response => {
              this.sortDialogVisible = false;
              this.getList();
              this.$message({
                type: 'success',
                message: '添加成功'
              });
              this.dataInstance = Object.assign({}, this.newData);
            });
          } else {
            this.sortDialogVisible = false;
          }
        });
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        })
      },
      updateAdminStatus(id, status){
        let satusLabel = status === 1 ? '启用': '禁用';
        this.$confirm(`是否${satusLabel}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params=new URLSearchParams();
          let data = {
              ids: [id],
              status: status,
          }
          batchUpdateEntityStatus(data).then(response=>{
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '错误，已取操作，请联系相关人员!'
          });
          this.getList();
        });
      },
      multiUpdateAdminStatus(ids, status) {
        let satusLabel = status === 1 ? '启用': '禁用';
        this.$confirm(`是否确定${satusLabel}这些账户?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            ids: ids,
            status: status,
          }
          batchUpdateEntityStatus(data).then(response=>{
            this.getList();
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '错误，已取操作，请联系相关人员!'
          });
          this.getList();
        });
      },
      multiDeleteAdmins(ids){
        this.$confirm('是否要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchDeleteEntity(ids).then(response=>{
            this.getList();
            this.$message({
              type: 'success',
              message: '删成功!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '删除失败，请联系相关人员',
          })
        })
      },
      getDialogList(){
        fetchList(this.dataInstance.listQuery).then(response=>{
          this.dataInstance.list = response.data.list;
          this.dataInstance.total = response.data.total;
        })
      }
    }
  }
</script>
<style>
/* .el-table .deleted-row {
  background: #909399;
} */
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
