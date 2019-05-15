<template>
  <el-upload
      action="https://upload.qbox.me"
      :data="dataObj"
      drag
      :multiple="true"
      :before-upload="beforeUpload">
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">Drag files here, or<em>Click to upload</em></div>
  </el-upload>
</template>


<script>
    import { getToken } from 'api/qiniu'; // Get the seven cattle token backend through Access Key,Secret Key,bucket Equal generation token
    // Seven cattle official sdk https://developer.qiniu.com/sdk#official-sdk

    export default{
      data() {
        return {
          dataObj: { token: '', key: '' },
          image_uri: [],
          fileList: []
        }
      },
      methods: {
        beforeUpload() {
          const _self = this;
          return new Promise((resolve, reject) => {
            getToken().then(response => {
              const key = response.data.qiniu_key;
              const token = response.data.qiniu_token;
              _self._data.dataObj.token = token;
              _self._data.dataObj.key = key;
              resolve(true);
            }).catch(err => {
              console.log(err)
              reject(false)
            });
          });
        }
      }
    }
</script>
