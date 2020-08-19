<template> 
  <div>
    <el-upload
      :action="uploadUrl"
      :data="dataObj"
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
      :http-request="uploadSectionFile"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import {policy, policyUrl, deleteFile} from '@/api/cos'

  export default {
    name: 'multiUpload',
    props: {
      //图片属性数组
      value: Array,
      //最大上传图片数量
      maxCount: {
        type:Number,
        default: 100
      },
    },
    data() {
      return {
        baseUploadUrl: 'https://juzhi-management-system-1258114501.cos.ap-shanghai.myqcloud.com',
        uploadUrl: '',
        dataObj: {
          key: '',
          fileType: '.png',
          success_action_status: "200",
        },
        dialogVisible: false,
        dialogImageUrl:null,
        headers: {
          Authorization: "",
        },
      };
    },
    computed: {
      fileList() {
        let fileList=[];
        for(let i=0;i<this.value.length;i++){
          fileList.push({url:this.value[i]});
        }
        return fileList;
      }
    },
    methods: {
      emitInput(fileList) {
        let value=[];
        for(let i=0;i<fileList.length;i++){
          value.push(fileList[i].url);
        }
        this.$emit('input', value)
      },
      handleRemove(file, fileList) {
        let url = file.url;
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
        this.emitInput(fileList);
      },
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl=file.url;
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
        this.dataObj.fileType = suffix;
        let _self = this;
        return new Promise((resolve, reject) => {
          policy(params).then(response => {
            let fd = {};
            let info = response.data;
            fd["key"] = info.key;
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
      handleUploadSuccess(res, file) {
        let _self = this;
        let params = new URLSearchParams();
        params.append('url', this.uploadUrl);
        // 成功之后重新签名url
        policyUrl(params).then(res => {
          let fileList = [];
          _self.fileList.forEach(e => {
            fileList.push({
              name: e.name,
              url: e.url,
            });
          });
          fileList.push({
            name: _self.dataObj.key,
            url: res.data,
          })
          _self.emitInput(fileList);
        });
      },
      handleExceed(files, fileList) {
        this.$message({
          message: '最多只能上传'+this.maxCount+'张图片',
          type: 'warning',
          duration:1000
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
            xhr.setRequestHeader('Authorization', vm.headers.Authorization);
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
      handleSuccess(rep,file){

      }
    }
  }
</script>
<style>

</style>


