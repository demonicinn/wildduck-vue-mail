<template>
    <div class="upload-container">
        <el-button  :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">Upload video</el-button>
        <el-dialog v-model="dialogVisible">
            <el-form ref="form" :model="form" :rules="rules" label-width="140px" label-position="left">
                <el-upload
                        class="editor-video-upload"
                        action="https://upload.qbox.me"
                        :data="dataObj"
                        :show-file-list="true"
                        :file-list="videoList"
                        :on-success="handleVideoScucess"
                        :on-change="handleVideoChange"
                        :before-upload="videoBeforeUpload">
                    <el-button size="small" type="primary">Upload video</el-button>
                </el-upload>
                <el-form-item prop="url" label="Video URL">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>
                <el-form-item prop="title" label="Video title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                 <el-form-item label="Upload video cover image">
                </el-form-item>
                <el-upload
                        class="image-uploader"
                        action="https://upload.qbox.me"
                        :show-file-list="false"
                        :data="dataObj"
                        :on-success="handleImageScucess"
                        :before-upload="beforeImageUpload">
                    <img v-if="form.image" :src="form.image" class="image-uploader-image">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form>
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="handleSubmit">Submit</el-button>

        </el-dialog>
    </div>
</template>
<script>
    import { getToken } from 'api/qiniu';

    export default {
      name: 'editorVideoUpload',
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
          videoList: [],
          tempVideoUrl: '',
          tempImageUrl: '',
          form: {
            title: '',
            url: '',
            image: ''
          },
          rules: {
            url: [
                        { required: true, trigger: 'blur' }
            ],
            title: [
                        { required: true, trigger: 'blur' }
            ]
          }
        };
      },
      methods: {
        handleSubmit() {
          this.$refs.form.validate(valid => {
            if (valid) {
              if (this.form.image.length > 0) {
                this.$emit('successCBK', this.form);
                this.dialogVisible = false;
                this.form = {
                  title: '',
                  url: '',
                  image: ''
                }
              } else {
                this.$message('Please upload an image');
              }
            } else {
              this.$message('Incorrectly filled out');
              return false;
            }
          });
        },
        handleVideoChange(file, fileList) {
          this.videoList = fileList.slice(-1);
        },
        handleVideoScucess() {
          this.form.url = this.tempVideoUrl
        },
        videoBeforeUpload() {
          const _self = this;
          return new Promise((resolve, reject) => {
            getToken().then(response => {
              const key = response.data.qiniu_key;
              const token = response.data.qiniu_token;
              _self._data.dataObj.token = token;
              _self._data.dataObj.key = key;
              this.tempVideoUrl = response.data.qiniu_url;
              resolve(true);
            }).catch(err => {
              console.log(err);
              reject(false)
            });
          });
        },
        handleImageScucess() {
          this.form.image = this.tempImageUrl
        },
        beforeImageUpload() {
          const _self = this;
          return new Promise((resolve, reject) => {
            getToken().then(response => {
              const key = response.data.qiniu_key;
              const token = response.data.qiniu_token;
              _self._data.dataObj.token = token;
              _self._data.dataObj.key = key;
              this.tempImageUrl = response.data.qiniu_url;
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
        .editor-video-upload {
            button {
                float: left;
            }
        }
        .image-uploader {
            margin: 5px auto;
            width: 400px;
            height: 200px;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            line-height: 200px;
            i {
                font-size: 28px;
                color: #8c939d;
            }
            .image-uploader-image {
                height: 200px;
            }
        }
    }
</style>
