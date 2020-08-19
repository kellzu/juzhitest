<template>
  <div>
    <el-upload
      :action="uploadUrl"
      :data="dataObj"
      list-type="picture"
      :headers="headers"
      :multiple="false"
      :show-file-list="showFileList"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :http-request="uploadSectionFile"
    >
       <el-button size="small" type="primary">点击上传</el-button>
       <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="图片加载失败" />
    </el-dialog>
  </div>
</template>
<script>
import {policy, policyUrl, deleteFile} from '@/api/cos'

export default {
  name: "cosSingleUpload",
  props: {
    value: String
  },
  computed: {
    imageUrl() {
      return this.value;
    },
    imageName() {
      if (this.value != null && this.value !== "") {
        let img = this.value.substr(this.value.lastIndexOf("/") + 1);
        return img.split("?")[0];
      } else {
        return null;
      }
    },
    fileList() {
      return [
        {
          name: this.imageName,
          url: this.imageUrl,
        }
      ];
    },
    showFileList: {
      get: function() {
        return (
          this.value !== null && this.value !== "" && this.value !== undefined
        );
      },
      set: function(newValue) {}
    }
  },
  data() {
    return {
      // dataObj: {
      //   policy: '',
      //   signature: '',
      //   key: '',
      //   ossaccessKeyId: '',
      //   dir: '',
      //   host: '',
      //   // callback:'',
      // },
      show: false,
      baseUploadUrl: 'https://juzhi-management-system-1258114501.cos.ap-shanghai.myqcloud.com',
      uploadUrl: '',
      dialogVisible: false,
      dataObj: {
        key: '',
        // policy: '',
        // bucket: '',
        // "q-sign-algorithm": "sha1",
        // "q-ak": "",
        // "q-key-time": "",
        // "q-signature": "",
        "success_action_status": "200", 
      },
      headers: {
        Authorization: '',
      },
    };
  },
  mounted () {
    setTimeout(() => {
      let _self = this;
      this.$nextTick(function () {
        _self.init()
      })
    }, 200)
  },
  created() {
  },
  methods: {
    init () {
      this.$nextTick(function () {
        this.show = true
      })
    },
    emitInput(val) {
      this.$emit("input", val);
    },
    handleRemove(file, fileList) {
      console.log(file);
      let url = this.fileList[0].url;
      let idx = url.lastIndexOf('?');
      if (idx > 0) {
        url = url.substring(0, url.lastIndexOf('?'));
      }
      let hostIndex = url.lastIndexOf('.com');
      let hostLength = '.com'.length;
      let objectKey = url.substring(hostIndex + hostLength)
      let param = new URLSearchParams();
      param.append('key', objectKey);
      deleteFile(param);
      this.emitInput("");
    },
    handlePreview(file) {
      this.dialogVisible = true;
    },
    beforeUpload(file) {
      // 上传之前需要的额外参数设置
      let suffix = "";
      let idx = file.name.lastIndexOf('.');
      if (idx > 0) {
        suffix = file.name.substring(idx);
      }
      let params = new URLSearchParams();
      params.append("fileType", suffix);
      let _self = this;
      return new Promise((resolve, reject) => {
        policy(params).then(response => {
          let fd = {};
          let info = response.data;
          fd["x-cos-security-token"] = info.xCosSecurityToken;
          fd["Signature"] = info.authorization;
          fd["key"] = info.key;
          fd["url"] = info.url;
          fd["bucketName"] = info.bucketName;
          _self.headers.Authorization = info.authorization;
          _self.headers.Host = _self.baseUploadUrl;
          _self.dataObj = fd
          _self.uploadUrl = _self.baseUploadUrl + info.key;
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      });
    },
    handleUploadSuccess (res, file) {
      let _self = this;
      let params = new URLSearchParams();
      params.append('url', this.uploadUrl);
      // 成功之后重新签名url
      policyUrl(params).then(res => {
        _self.emitInput(res.data);
      });
    },
    uploadSectionFile: function (param) { //自定义文件上传
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
          xhr.setRequestHeader('Authorization', param.headers.Authorization);
          xhr.onload = function (rep) {
              vm.$message({
                  message: '上传成功!',
                  type: 'success'
              });
              vm.handleUploadSuccess(rep, file);
          };
          xhr.send(fr.result);
        },
        false
      );
    },
  },
}
</script>
<style>
</style>


