<template>
    <div class="upload-container">
        <el-button :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">Upload audio
        </el-button>
        <el-dialog v-model="dialogVisible">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
                <el-upload
                        class="editor-audio-upload"
                        action="https://upload.qbox.me"
                        :data="dataObj"
                        :show-file-list="true"
                        :file-list="audioList"
                        :on-success="handleAudioScucess"
                        :on-change="handleAudioChange"
                        :before-upload="audioBeforeUpload">
                    <el-button size="small" type="primary">Upload audio</el-button>
                </el-upload>
                <el-form-item prop="url" label="Audio URL">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>
                <el-form-item prop="title" label="Audio URL">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="Audio text">
                    <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.text"></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="handleSubmit">Submit</el-button>

        </el-dialog>
    </div>
</template>
<script>
    import { getToken } from 'api/qiniu';

    export default {
      name: 'editorAudioUpload',
      props: {
        color: {
          type: String,
          default: '#20a0ff'
        }
      },
      data() {
        return {
          dialogVisible: false,
          dataObj: { token: '', key: '' },
          audioList: [],
          tempAudioUrl: '',
          form: {
            title: '',
            url: '',
            text: ''
          },
          rules: {
            title: [
                        { required: true, trigger: 'blur', message: 'Audio Title is required '}
            ],
            url: [
                        { required: true, trigger: 'blur', message: 'Audio Url is required '}
            ]
          }
        };
      },
      methods: {
        handleSubmit() {
          this.$refs.form.validate(valid => {
            if (valid) {
              this.$emit('successCBK', this.form);
              this.dialogVisible = false;
              this.form = {
                title: '',
                url: '',
                text: ''
              }
            } else {
              this.$message('Incorrectly filled out');
              return false;
            }
          });
        },
        handleAudioChange(file, fileList) {
          this.audioList = fileList.slice(-1);
        },
        handleAudioScucess() {
          this.form.url = this.tempAudioUrl
        },
        audioBeforeUpload() {
          const _self = this;
          return new Promise((resolve, reject) => {
            getToken().then(response => {
              const key = response.data.qiniu_key;
              const token = response.data.qiniu_token;
              _self._data.dataObj.token = token;
              _self._data.dataObj.key = key;
              this.tempAudioUrl = response.data.qiniu_url;
              resolve(true);
            }).catch(err => {
              console.log(err);
              reject(false)
            });
          });
        }
      }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .upload-container {
        .editor-audio-upload {
            button {
                float: left;
                margin-left: 30px;
                margin-bottom: 20px;
            }
        }
    }
</style>
