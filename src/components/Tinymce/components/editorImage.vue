<template>
  <div class="upload-container">
    <el-button
      icon="el-icon-upload"
      size="mini"
      :style="{background:color,borderColor:color}"
      @click=" dialogVisible=true"
      type="primary"
    >上传图片</el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <el-upload
        class="editor-slide-upload"
        :action="uploadUrl"
        :data="dataObj"
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        list-type="picture-card"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :http-request="uploadSectionFile"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { policy } from "@/api/oss";
import { policy, policyUrl, deleteFile } from "@/api/cos";

export default {
  name: "editorSlideUpload",
  props: {
    color: {
      type: String,
      default: "#1890ff"
    }
  },
  data() {
    return {
      baseUploadUrl:
        "https://juzhi-management-system-1258114501.cos.ap-shanghai.myqcloud.com",
      uploadUrl:
        "https://juzhi-management-system-1258114501.cos.ap-shanghai.myqcloud.com",
      dialogVisible: false,
      listObj: {},
      fileList: [],
      dataObj: {
        key: "",
        fileType: ".png",
        success_action_status: "200"
      },
      headers: {
        Authorization: ""
      }
      // dataObj: {
      //   policy: "",
      //   signature: "",
      //   key: "",
      //   ossaccessKeyId: "",
      //   dir: "",
      //   host: ""
      // }
    };
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(
        item => this.listObj[item].hasSuccess
      );
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v]);
      if (!this.checkAllSuccess()) {
        this.$message(
          "请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！"
        );
        return;
      }
      this.$emit("successCBK", arr);
      this.listObj = {};
      this.fileList = [];
      this.dialogVisible = false;
    },
    handleSuccess(response, file) {
      const uid = file.uid;
      let imgUrl = this.uploadUrl;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = imgUrl;
          this.listObj[objKeyArr[i]].hasSuccess = true;
          return;
        }
      }
    },
    // handleSuccess(res, file) {
    //   console.log( this.uploadUrl);
    // },
    handleRemove(file) {
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]];
          return;
        }
      }
    },
    beforeUpload(file) {
      let suffix = "";
      let idx = file.name.lastIndexOf(".");
      if (idx > 0) {
        suffix = file.name.substring(idx);
      }
      const fileName = file.uid;
      this.listObj[fileName] = {};
      let params = new URLSearchParams();
      params.append("fileType", suffix);
      this.dataObj.fileType = suffix;
      let _self = this;
      return new Promise((resolve, reject) => {
        policy(params)
          .then(response => {
            let fd = {};
            let info = response.data;
            fd["key"] = info.key;
            _self.headers.Authorization = info.authorization;
            _self.headers.Host = _self.baseUploadUrl;
            _self.dataObj = fd;
            _self.uploadUrl = _self.baseUploadUrl + info.key;
            _self.listObj[fileName] = {
              hasSuccess: false,
              uid: file.uid,
              width: this.width,
              height: this.height
            };
            resolve(true);
          })
          .catch(err => {
            reject(false);
          });
      });
    },
    uploadSectionFile: function(param) {
      //自定义文件上传
      var vm = this;
      var file = param.file;
      let fr = new FileReader();
      fr.readAsArrayBuffer(file);
      fr.addEventListener(
        "load",
        () => {
          // XMLHttpRequest 对象
          var xhr = new XMLHttpRequest();
          xhr.open("put", param.action, true);
          xhr.upload.addEventListener("progress", vm.progressFunction, false); //监听上传进度

          // 设置headers
          xhr.setRequestHeader("Authorization", vm.headers.Authorization);
          xhr.onload = function(rep) {
            vm.$message({
              message: "上传成功!",
              type: "success"
            });
            vm.handleSuccess(rep, file);
          };
          xhr.send(fr.result);
        },
        false
      );
    }
    // beforeUpload(file) {
    //   const _self = this;
    //   const fileName = file.uid;
    //   this.listObj[fileName] = {};
    //   return new Promise((resolve, reject) => {
    //     policy()
    //       .then(response => {
    //         _self.dataObj.policy = response.data.policy;
    //         _self.dataObj.signature = response.data.signature;
    //         _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
    //         _self.dataObj.key = response.data.dir + "/${filename}";
    //         _self.dataObj.dir = response.data.dir;
    //         _self.dataObj.host = response.data.host;
    // _self.listObj[fileName] = {
    //   hasSuccess: false,
    //   uid: file.uid,
    //   width: this.width,
    //   height: this.height
    // };
    //         resolve(true);
    //       })
    //       .catch(err => {
    //         console.log(err);
    //         reject(false);
    //       });
    //   });
    // }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload-container .editor-slide-upload {
  margin-bottom: 20px;
}
</style>
