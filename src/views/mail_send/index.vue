<template>
  <div v-loading.body="loading" class="app-container calendar-list-container">
    <div id='switchMail'>
      <span> Folder Sharing </span>
      <el-switch
        v-model="mailing"
        active-text="Folder Sharing"
        inactive-text="EMailing"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
      <span> Mailing </span>
    </div>
    <div v-if="mailing === false">
      <el-row :gutter="10">
      <el-col :span="2">
        <el-tag v-if="mailing" class="target-label" color="#36c6d3">From
          <icon-svg icon-class="add-user4" class="add-user"/>
        </el-tag>
        <el-tag v-else class="target-label" color="#36c6d3">Local Folder
          <icon-svg icon-class="add-user4" class="add-user"/>
        </el-tag>
      </el-col>
      <el-col id="from" :span="20">
        <multiselect
          v-model="from"
          v-on:change.native="handleInputChange"
          :options="aliases"
          :multiple="true"
          :taggable="true"
          @close="onSelectFromOption"
          @tag="addAlias"         
          @select="onSelectFromOption"
          :clear-on-select="false"
          :hide-target="true"
          placeholder="Please fill this field if you wanna share files and folders."
          label="name"
          track-by="mail"
        ></multiselect>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" @click="cleanTarget">Empty</el-button>
      </el-col>
    </el-row>
    </div>
    <el-row :gutter="10">
      <el-col :span="2">
        <el-tag v-if="mailing" class="target-label" color="#36c6d3">Recipient
          <icon-svg icon-class="add-user4" class="add-user"/>
        </el-tag>
        <el-tag v-else class="target-label" color="#36c6d3">Remote Write Access
          <icon-svg icon-class="add-user4" class="add-user"/>
        </el-tag>
      </el-col>
      <el-col v-if="mailing" id='to' style="padding-left: 30px" v-bind:class="{ to: !mailing }" :span="20">
        <multiselect
          v-model="target"
          v-on:change.native="handleInputChange"
          :options="contacts"
          :multiple="true"
          :taggable="true"
          :value="word"
          @close="onSelectOption"
          @tag="addContact"
          @select="onSelectOption"
          :clear-on-select="false"
          :hide-target="true"
          placeholder="Please select or enter a contact"
          label="show"
          track-by="mail"
        ></multiselect>
      </el-col>
      <el-col v-else id='to' style="padding-left: 30px" v-bind:class="{ to: !mailing }" :span="20">
        <multiselect
          v-model="target"
          v-on:change="handleInputChange"
          :options="aliases"
          :multiple="true"
          :taggable="true"
          @close="onSelectOption"
          @tag="addContact"
          @select="onSelectOption"
          :clear-on-select="false"
          :hide-target="true"
          placeholder="Please select or enter a contact"
          label="show"
          track-by="mail"
        ></multiselect>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" @click="cleanTarget">Empty</el-button>
      </el-col>
    </el-row>
    <el-row v-if="mailing" :gutter="10">
      <el-col :span="2">
        <el-tag v-if="mailing" class="target-label" color="#36c6d3">Cc
          <icon-svg icon-class="add-user4" class="add-user"/>
        </el-tag>
        <el-tag v-else class="target-label" color="#36c6d3">Remote Read Access
          <icon-svg icon-class="add-user4" class="add-user"/>
        </el-tag>
      </el-col>
      <el-col id='cc' v-bind:class="{ cc: !mailing }" :span="20">
        <multiselect
          v-model="copy"
          v-on:change="handleInputChange"
          :options="contacts"
          :multiple="true"
          :taggable="true"
          @close="onSelectCopyOption"
          @tag="addContactCopy"
          @select="onSelectCopyOption"
          :clear-on-select="false"
          :hide-target="true"
          placeholder="Please select or enter a contact"
          label="show"
          track-by="mail"
        ></multiselect>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" @click="cleanCopy">Empty</el-button>
      </el-col>
    </el-row>
    <el-row v-else :gutter="10">
      <el-col :span="2">
        <el-tag v-if="mailing" class="target-label" color="#36c6d3">Cc
          <icon-svg icon-class="add-user4" class="add-user"/>
        </el-tag>
        <el-tag v-else class="target-label" color="#36c6d3">Remote Read Access
          <icon-svg icon-class="add-user4" class="add-user"/>
        </el-tag>
      </el-col>
      <el-col id='cc' v-bind:class="{ cc: !mailing }" :span="20">
        <multiselect
          v-model="copy"
          v-on:change="handleInputChange"
          :options="aliases"
          :multiple="true"
          :taggable="true"
          @tag="addContactCopy"
          @select="onSelectCopyOption"
          @close="onSelectCopyOption"
          :clear-on-select="false"
          :hide-target="true"
          placeholder="Please select or enter a contact"
          label="show"
          track-by="mail"
        ></multiselect>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" @click="cleanCopy">Empty</el-button>
      </el-col>
    </el-row>

    <!-- <template> -->
      <el-row :gutter="10">
        <el-col :span="2">
          <a-select mode="multiple" :defaultValue="['a1', 'b2']" style="width: 100%" @change="handleChange" placeholder="Please select">
            <!-- <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">{{(i + 9).toString(36) + i}}</a-select-option> -->
          </a-select>
        </el-col>
      </el-row>
    <!-- </template> -->


    <el-row :gutter="20">
      <el-col :span="2">
        <el-tag class="target-label" color="#36c6d3">Subject</el-tag>
      </el-col>
      <el-col :span="20">
        <el-input v-model="mail.title" placeholder="Please enter a subject"></el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-upload
          class="upload-file"
          :before-upload="handleBefore"
          :on-preview="handlePreview"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :show-file-list="true"
          :file-list="mail.oldFileList"
          drag
          action="https://httpbin.org/post"
          multiple
        >
          <i class="el-icon-upload"></i>
          <i class="el-upload__text">
            Drag files here, or
            <em>Click to upload</em>
          </i>
        </el-upload>
        <ul v-show="!!mail.oldFileList.length" class="old-file-list"></ul>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" :disabled="isRecording" @click="startRecorder" size="small">Start recording</el-button>
        <el-button type="primary" :disabled="!isRecording" @click="stopRecorder" size="small">End recording</el-button>
        <ul v-show="!!mail.oldAudioList.length" class="old-audio-list">
          <li v-for="(audio, index) in mail.oldAudioList" :key="index">
            <audio :src="audio.url" controls></audio>
            <a class="old-audio-name" :href="audio.url" download>{{audio.name}}</a>
            <icon-svg icon-class="delete11" class="del-audio" @click.native="delOldAudio(index)"/>
          </li>
        </ul>
        <ul class="audio-list">
          <li v-for="(audio, index) in mail.audioList" :key="index">
            <audio :src="audio.url" controls></audio>
            <el-input class="audio-name" v-model="audio.name" size="small"></el-input>
            <icon-svg icon-class="delete11" class="del-audio" @click.native="delAudio(index)"/>
          </li>
        </ul>
      </el-col>
    </el-row>
    <div class="editor-container">
      <Tinymce :id="editorId" :height="editorHeight" ref="editor" v-model="mail.content"></Tinymce>
    </div>
    <el-row id='send'>
      <el-col :span="12" :offset="9">
        <el-button type="primary" @click="sendSubmit">Send</el-button>
        <el-button type="primary" @click="saveAsDraft">Save</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Tinymce from 'components/Tinymce';
import * as contactsAPI from 'api/mail_contacts';
import * as mailSendAPI from 'api/mail_send';
import * as mailDetailAPI from 'api/mail_detail';
import * as aliasAPI from 'api/aliases';
import * as outboxAPI from 'api/outbox';
import * as threadsMockAPI from 'mock/access_rights';
import * as threadsAPI from 'api/threads';
import * as folderOwnersRightsAPI from 'api/folder_owners_rights';
import _ from 'lodash';
import validator from 'validator';
import ethereum_address from 'ethereum-address';
import moment from 'moment';
import { isEmail, isEmpty, getType } from 'utils/validate';
import { getNowFormatDate, parseTime } from 'utils';
import { Observable } from 'rxjs/Observable';

export default {
  name: 'mail_send',
  components: { Tinymce },
  data() {
    return {
      loading: true,
      mailing: true,
      mail: {
        title: '',
        oldFileList: [],
        oldAudioList: [],
        content: '',
        target: [],
        copy: [],
        aliases: [],
        fileList: [],
        audioList: []
      },
      date: '',
      target: [],
      from: [],
      aliases: [],
      cc: [],
      copy: [],
      isRecording: false,
      recorder: null,
      contacts: [],
      editorId: 'mail_send_ediotr',
      editorHeight: null,
      timing: '',
      word: '',
      options: [{
          value: 'HTML',
          label: 'HTML'
        }, {
          value: 'CSS',
          label: 'CSS'
        }, {
          value: 'JavaScript',
          label: 'JavaScript'
        }],
        value: []

    };
  },
  created() {
    this.$on('close', () => {
      if (this.options.length) this.select(this.options[0])
    });
    aliasAPI.getAlias().subscribe({
      next: (res) => {
        this.aliases = res.data;
      },
      error: (error) => {
        console.log(error)
      }
    });
    this.initSendPage();
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    initSendPage() {
      this.getContacts().subscribe({
        next: () => {
          this.getContent();
        }
      });
      this.editorHeight = window.innerHeight - 420;
    },
    getContacts() {
      this.loading = true;
      return Observable.create(observer => {
        contactsAPI.fetchList().then(res => {
          res.data.contacts.forEach(item => {
            item.show = item.name + '<' + item.mail + '>';
          });
          //Getting aliases from local storage
          // if(localStorage.aliases){
          //   this.aliases = JSON.parse(localStorage.aliases);
          // }
          this.contacts = res.data.contacts
          if(this.aliases.length > 0){  // If aliases exists
            this.aliases.forEach( alias => this.contacts.push(alias) );
          }
          this.loading = false;
          observer.next();
        });
      });
    },
    getContent() {
      const pageType = this.$store.getters.pageType;
      const mailId = this.$store.getters.mailId || this.$store.getters.draftId;
      const mailType = this.$store.getters.mailType;
      if (pageType && pageType !== 'add') {
        mailDetailAPI.fetchDetail({ mailId, mailType }).then(res => {
          // Be careful when setting the fields, the fields on both sides are not matched.
          const detail = res.data;
          this.mail.title = detail.title;
          this.mail.content = detail.content;
          this.mail.oldFileList = detail.oldFileList;
          this.mail.oldAudioList = detail.oldAudioList;
          this.date = detail.receiveDate || detail.sendDate;
          let receiveStr = '';
          detail.target.forEach(item => {
            item.show = item.name + '<' + item.mail + '>';
            receiveStr += item.show + ';';
          });
          let copyStr = '';
          detail.copy.forEach(item => {
            item.show = item.name + '<' + item.mail + '>';
            copyStr += item.show + ';';
          });
          const sender = {
            name: detail.sender,
            mail: detail.sendMail,
            show: detail.sender + '<' + detail.sendMail + '>'
          };
          switch (pageType) {
            case 'reply':
              this.mail.title = 'Reply：' + this.mail.title;
              this.addContentHeader(sender.show, receiveStr, copyStr);
              this.target.push(sender);
              break;
            case 'replyAll':
              this.mail.title = 'Reply：' + this.mail.title;
              this.addContentHeader(sender.show, receiveStr, copyStr);
              this.target = [sender].concat(detail.target, detail.copy);
              break;
            case 'edit':
              this.target = detail.target;
              this.copy = detail.copy;
              break;
            case 'forward':
              this.mail.title = 'Forward' + this.mail.title;
              this.addContentHeader(sender.show, receiveStr, copyStr);
              break;
            default:
          }
        });
      } else if (pageType && pageType === 'add') {
        const target = this.$store.getters.target;
        if (target) {
          if (target === 'all') {
            this.target = this.contacts;
          } else {
            target.forEach(
              item => (item.show = item.name + '<' + item.mail + '>')
            );
            this.target = target;
          }
          this.$store.commit('SET_TARGET', null);
        }
      }
    },
    handleInputChange(word) {
      debugger
      this.word = word;
    },
    addContentHeader(sender, receiveStr, copyStr) {
      const header = `<p><span>------------------------ &nbsp; The original message &nbsp;------------------------</span></p>
                <div style="background: #e4eaef"><br>
                <p>&nbsp;<strong>Sender:</strong>${sender}</p>
                <p>&nbsp;<strong>Time:&nbsp;&nbsp;&nbsp;</strong>${parseTime(
                  this.date
                )}</p>
                <p>&nbsp;<strong>Recipient:</strong>${receiveStr}</p>
                <p>&nbsp;<strong>Cc:&nbsp;&nbsp;&nbsp;</strong>${copyStr}</p>
                <p>&nbsp;<strong>Subject:&nbsp;&nbsp;&nbsp;</strong>${
                  this.mail.title
                }</p>
                <p><br/></p>
                </div>`;
      this.mail.content = header + this.mail.content;
    },
    // Striping text from a HTML string
    stripHtml(html){
      // Create a new div element
      var temporalDivElement = document.createElement("div");
      // Set the HTML content with the providen
      temporalDivElement.innerHTML = html;
      // Retrieve the text property of the element (cross-browser support)
      return temporalDivElement.textContent || temporalDivElement.innerText || "";
    },
    async onSelectFromOption(newTag, id) {
      
      // Removing leading and trailing spaces
      if(newTag.name){
        newTag.name = newTag.name.replace(/(^\s+|\s+$)/g, '');
      }

      if(newTag.show){
        newTag.show = newTag.show.replace(/(^\s+|\s+$)/g, '');
      }

      if(newTag.mail){
        newTag.mail = newTag.mail.replace(/(^\s+|\s+$)/g, '');
      }

      //Check if an email is entered
      if(validator.isEmail(newTag.mail)){  // If entered target is an email
        let isBlockChainAlias = await this.checkAlias(newTag.mail); // Check if new email is an alias for a blockchain address
        if(!isBlockChainAlias){ // If email isn't an alias
          this.$message({
            showClose: true,
            message: ' Only blickchain aliases allowed here...Sorry (-_-) ',
            type: 'warning',
            duration: 2000
          });
          return;
        } else {
          return this.from.push(newTag);  
        }
      } else {
        return this.from.push(newTag);
      }
    },
    async onSelectOption(newTag, id) {
      
      // Removing leading and trailing spaces
      if(newTag.name){
        newTag.name = newTag.name.replace(/(^\s+|\s+$)/g, '');
      }

      if(newTag.show){
        newTag.show = newTag.show.replace(/(^\s+|\s+$)/g, '');
      }

      if(newTag.mail){
        newTag.mail = newTag.mail.replace(/(^\s+|\s+$)/g, '');
      }
      
      // Check if from field has values or not
      if(this.from.length > 0){ // Form has values
         //Check if an email is entered
        if(validator.isEmail(newTag.mail)){  // If entered target is an email
          let isBlockChainAlias = await this.checkAlias(newTag.mail); // Check if new email is an alias for a blockchain address
          if(!isBlockChainAlias){ // If email isn't an alias
            this.$message({
              showClose: true,
              message: " As from has values thus, it's folder sharing do no emails allowed...Sorry (-_-) " ,
              type: 'warning',
              duration: 2000
            });
            return this.target.pop();
          } else {
            return this.target.push(newTag);
          }
        } else {
          return this.target.push(newTag);
        }
      } else {  // From field is empty
        // Validation to block anything besides email
        if (!isEmail(newTag.mail)) {
          this.$message({
            showClose: true,
            message: 'The entered email address is not valid',
            type: 'warning',
            duration: 1200
          });
          return;
        } else {
          let isBlockChainAlias = await this.checkAlias(newTag.mail); // Check if new email is an alias for a blockchain address          
          if(isBlockChainAlias){ // If email isn't an alias
            this.$message({
              showClose: true,
              message: ' Unless From is filled, no blockchain addresses or aliases are allowed...Sorry (-_-) ',
              type: 'warning',
              duration: 2000
            });
            return this.target.pop();
          } else {
            return this.target.push(newTag);
          }
        }
      }
    },
    async onSelectCopyOption(newTag, id){
      
      // Removing leading and trailing spaces
      if(newTag.name){
        newTag.name = newTag.name.replace(/(^\s+|\s+$)/g, '');
      }

      if(newTag.show){
        newTag.show = newTag.show.replace(/(^\s+|\s+$)/g, '');
      }

      if(newTag.mail){
        newTag.mail = newTag.mail.replace(/(^\s+|\s+$)/g, '');
      }
      
      // Check if from field has values or not
      if(this.from.length > 0){ // Form has values
         //Check if an email is entered
        if(validator.isEmail(newTag.mail)){  // If entered target is an email
          let isBlockChainAlias = await this.checkAlias(newTag.mail); // Check if new email is an alias for a blockchain address
          if(!isBlockChainAlias){ // If email isn't an alias
            this.$message({
              showClose: true,
              message: " As the from has values thus, it's folder sharing therefore no emails...Sorry (-_-) ",
              type: 'warning',
              duration: 2000
            });
            return this.target.pop();
          } else {
            return this.copy.push(newTag);
          }
        } else {
          return this.copy.push(newTag);
        }
      } else {  // From field is empty
        // Validation to block anything besides email
        if (!isEmail(newTag.mail)) {
          this.$message({
            showClose: true,
            message: 'The entered email address is not valid',
            type: 'warning',
            duration: 1200
          });
          return;
        } else {
          let isBlockChainAlias = await this.checkAlias(newTag.mail); // Check if new email is an alias for a blockchain address          
          if(isBlockChainAlias){ // If email isn't an alias
            this.$message({
              showClose: true,
              message: ' Unless From is filled, no blockchain addresses or aliases are allowed...Sorry (-_-) ',
              type: 'warning',
              duration: 2000
            });
            return this.target.pop();
          } else {
            return this.copy.push(newTag);
          }
        }
      }
      
    },
    async addContact(newTag) {
      
      // Removing leading and trailing spaces
      newTag = newTag.replace(/(^\s+|\s+$)/g, '');
      
      // Check if from field has values or not
      if(this.from.length > 0){ // Form has values
         //Check if an email is entered
        if(validator.isEmail(newTag)){  // If entered target is an email
          let isBlockChainAlias = await this.checkAlias(newTag); // Check if new email is an alias for a blockchain address
          if(!isBlockChainAlias){ // If email isn't an alias
            this.$message({
              showClose: true,
              message: ' As the first contact is an email thus, the following ones should be too...Sorry (-_-) ',
              type: 'warning',
              duration: 2000
            });
            return;
          }
        }
      } else {  // From field is empty
        // Validation to block anything besides email
        if (!isEmail(newTag)) {
          this.$message({
            showClose: true,
            message: 'The entered email address is not valid',
            type: 'warning',
            duration: 1200
          });
          return;
        }
      }
     
      const tag = {
        name: newTag,
        show: newTag,
        mail: newTag
      };
      this.contacts.push(tag);
      this.target.push(tag);
    },
    async addContactCopy(newTag) {
      
      // Removing leading and trailing spaces
      newTag = newTag.replace(/(^\s+|\s+$)/g, '');
      
      // Check if from field has values or not
      if(this.from.length > 0){ // Form has values
         //Check if an email is entered
        if(validator.isEmail(newTag)){  // If entered target is an email
          let isBlockChainAlias = await this.checkAlias(newTag); // Check if new email is an alias for a blockchain address
          if(!isBlockChainAlias){ // If email isn't an alias
            this.$message({
              showClose: true,
              message: ' As the first contact is an email thus, the following ones should be too...Sorry (-_-) ',
              type: 'warning',
              duration: 2000
            });
            return;
          }
        }
      } else {  // From field is empty
        // Validation to block anything besides email
        if (!isEmail(newTag)) {
          this.$message({
            showClose: true,
            message: 'The entered email address is not valid',
            type: 'warning',
            duration: 1200
          });
          return;
        }
      }
      const tag = {
        name: newTag,
        show: newTag,
        mail: newTag
      };
      this.contacts.push(tag);
      this.copy.push(tag);
    },
    async addAlias(newTag) {
      
      // Removing leading and trailing spaces
      newTag = newTag.replace(/(^\s+|\s+$)/g, '');
      
      // Check whether the type of contacts is i.e. only emails or only blockchain addresses
      if(this.aliases){  //If targets ( contacts array ) has been initialised
        if(this.aliases.length > 0){ // If the targets ( contacts array ) has more then one contact
          if(validator.isEmail(this.aliases[0].mail)){ // If the first contact is an email
            let isBlockChainAlias = await this.checkAlias(this.aliases[0].mail); // Check if email is an alias for a blockchain address
            if(!isBlockChainAlias) {
                 this.$message({
                    showClose: true,
                    message: ' Only Folder aliases or addresses are allowed here...Sorry (-_-) ',
                    type: 'warning',
                    duration: 2000
                  });
                  return;
              } else {
                if(validator.isEmail(newTag)){ // If the new contact is an email
                let isBlockChainAlias = await this.checkAlias(newTag); // Check if new email is an alias for a blockchain address
                if(!isBlockChainAlias){
                  this.$message({
                    showClose: true,
                    message: ' Only Folder aliases or addresses are allowed here...Sorry (-_-) ',
                    type: 'warning',
                    duration: 2000
                  });
                  return;
                }
              }
            }
          } else {  //If first contact is a blockchain address
            if(validator.isEmail(newTag)){ // If the new contact is an email
              let isBlockChainAlias = await this.checkAlias(newTag); // Check if email is an alias for a blockchain address
              if(!isBlockChainAlias){ // If the email is not an alias for a blockchain address
                this.$message({
                  showClose: true,
                  message: ' Only Folder aliases or addresses are allowed here...Sorry (-_-) ',
                  type: 'warning',
                  duration: 2000
                });
                return;
              }
            }
          }
        } else {
          if(validator.isEmail(newTag)){
            let isBlockChainAlias = await this.checkAlias(newTag); // Check if email is an alias for a blockchain address
            if(!isBlockChainAlias){ // If the email is not an alias for a blockchain address
              this.$message({
                showClose: true,
                message: ' Only Folder aliases or addresses are allowed here...Sorry (-_-) ',
                type: 'warning',
                duration: 2000
              });
              return;
            }
          } else {
            // validation for the eth address
              if (ethereum_address.isAddress(newTag)) {
                console.log('Valid ethereum address.');
              }
              else {
                console.log('Invalid Ethereum address.');
                this.$message({
                    type: 'error',
                    message: 'Ethereum address not valid',
                    duration: 2500
                });
                return;
              }
            }
        }
      }

      const tag = {
        name: newTag,
        show: newTag,
        mail: newTag
      };
      this.aliases.push(tag);
      this.from.push(tag);
    },
    checkAlias(email) {
      if(this.aliases){
        let list = this.aliases;
        let index = _.findIndex(list, function(o) { return o.email == email });
        if(~index){
          return true;
        }
      }
      return false;
    },
    cleanTarget() {
      this.target = [];
    },
    cleanCopy() {
      this.copy = [];
    },
    handleBefore(file) {
      // You can control the file you want to upload before uploading
    },
    handleSuccess(file, fileInfo) {
      this.mail.fileList.push({
        name: fileInfo.name,
        uuid: fileInfo.uid,
        url: fileInfo.url
      });
    },
    handlePreview(file) {
      // Preview, some files cannot be previewed due to formatting issues. It is recommended to use the a tag, src is the download address of the file, click to download, refer to the recording
      window.open(file.url);
    },
    handleRemove(file) {
      // Remove
      this.mail.fileList.forEach((item, index) => {
        if (item.uuid === file.uid) {
          this.mail.fileList.splice(index, 1);
        }
      });
    },
    startRecorder() {
      Recorder.get(rec => {
        this.recorder = rec;
        this.recorder.start();
        this.isRecording = true;
      });
    },
    stopRecorder() {
      this.recorder.stop();
      this.isRecording = false;
      this.mail.audioList.push({
        name: getNowFormatDate(),
        blob: this.recorder.getBlob(),
        url: window.URL.createObjectURL(this.recorder.getBlob())
      });
    },
    delOldAudio(index) {
      this.mail.oldAudioList.splice(index, 1);
    },
    delAudio(index) {
      this.mail.audioList.splice(index, 1);
    },
    sendSubmit() {
      if (this.target.length < 1) {
        this.$message({
          showClose: true,
          message: 'The recipient cannot be empty',
          type: 'warning',
          duration: 1200
        });
        return;
      }
      // Checking whether the to field is a blockchin address or an email
      if(validator.isEmail(this.target[0].mail)){
        // Data should be processed as needed before adding to formData
      this.target.forEach(item => {
        this.mail.target.push(item.mail);
      });
      this.copy.forEach(item => {
        this.mail.copy.push(item.mail);
      });
      const mailForm = new FormData();
      this.appendToFormData(mailForm, this.mail);
      const mailDTO = mailForm;
      this.loading = true;
      let addresses = [];
      this.target.forEach((target)=>{
          addresses.push({address: target.mail})
      });
      let carbonCopies = [];
      if(this.copy){
        this.copy.forEach((cc)=>{
          carbonCopies.push({address: cc.mail})
        });
      }
      let strippedTExt = this.stripHtml(this.mail.content);
      const params = {
        to: addresses,
        cc: carbonCopies || [],
        subject: this.mail.title,
        text: strippedTExt,
      }

      mailSendAPI.wildduckAPISendMail(params).subscribe({
        next: (res) => {
          this.$message({
            type: 'success',
            message: 'Sent successfully',
            duration: 2000
          });
          this.loading = false;
          let ccObjectsArray = [];
          let recipientsObjectArray = [];
          // addresses = addresses.concat(params.cc);
          // recipients = recipients.concat(addresses);
          addresses.forEach( address =>{
            recipientsObjectArray.push({
              name: address.address,
              mail: address.address,
            });
          });

          if(carbonCopies) {
            carbonCopies.forEach( copy => {
              ccObjectsArray.push({
                name: copy.address,
                mail: copy.address
              })
            })
          }

          let currentDate = String(moment().year()) + '-' + String(moment().month() + 1) + '-' 
          + String(moment().date()) + ' ' + String(moment().hour()) + ':' 
          + String(moment().minute());
          
          let oParams = {
            isStar: false,
            isHaveFile: false,
            isHaveAudio: false,
            from: {
              name: this.$store.getters.name || '',
              email: this.$store.getters.email || ''
            },
            receiveList: recipientsObjectArray,
            ccList: ccObjectsArray,
            labelList: [],
            title: this.mail.title,
            text: strippedTExt,
            sendDate: currentDate,
          }
          
          console.log(oParams);
          outboxAPI.createSentMail(oParams).subscribe({
            next: res => {
              console.log('Mail added to outbox.');
              console.log(res);
            },
            error: error => {
              console.log(error);
            }
          })
          this.initMail();
        },
        error: () => {
          this.$message({
            type: 'error',
            message: 'Failed to send',
            duration: 2000
          });
          this.loading = false;
        }
      });
      } else {  //Target is a blockchain address
        let tParams = {};
        let currentDate = String(moment().year()) + '-' + String(moment().month() +1) + '-' 
          + String(moment().date()) + ' ' + String(moment().hour()) + ':' 
          + String(moment().minute());
        let strippedTExt = this.stripHtml(this.mail.content);
        tParams = {
          thread: strippedTExt,
          sender: this.$store.getters.email,
          date: currentDate,
        }
        console.log('tParams:');
        console.log(tParams);
        threadsAPI.createThread(tParams).subscribe({
          next: res => {
            
            let rParams = { // Generating access request reply
              id: res.data.id,
              thread: res.data.thread,
              sender: res.data.sender,
              date: res.data.date,
              hasChildren: true,
              children: [{
                date: currentDate,
                children: [],
              }]
            }

            threadsMockAPI.updateThread(rParams).subscribe({
              next: res => {
                console.log(res);
              },
              error: error => {
                console.log(error);
              }
            });

            return this.$message({
              showClose: true,
              message: ' Thread created ',
              type: 'success',
              duration: 2000
            });
          },
          error: error => {
            return this.$message({
              showClose: true,
              message: " Sorry...We couldn't create a thread (T_T) ",
              type: 'error',
              duration: 2000
            });
          }
        });
      }
    },
    saveAsDraft() {
      // Data should be processed as needed before adding to formData
      this.target.forEach(item => {
        this.mail.target.push(item.mail);
      });
      this.copy.forEach(item => {
        this.mail.copy.push(item.mail);
      });
      const mailForm = new FormData();
      this.appendToFormData(mailForm, this.mail);
      const mailDTO = mailForm;
      this.loading = true;
      mailSendAPI
        .saveAsDraft(mailDTO)
        .subscribe({
          next: () => {
            this.loading = false;
            this.$message('Successfully saved');
          }
        })
        .catch();
    },
    // Add to formData, need to conform to formData format
    appendToFormData(form, data) {
      // Pass the fields to be added
      Object.keys(data).forEach(field => {
        // If the value of this field is an object
        if (typeof data[field] === 'object') {
          if (!isEmpty(data[field])) {
            // Not empty
            if (getType(data[field]) === 'Array') {
              // Array object
              data[field].forEach((item, index) => {
                if (getType(item) === 'Object') {
                  // Array item if it is still an object
                  // Pass the properties of an array item
                  Object.keys(item).forEach(itemField => {
                    form.append(
                      field + '[' + index + '].' + itemField,
                      item[itemField]
                    );
                  });
                } else {
                  form.append(field + '[' + index + ']', item);
                }
              });
            } else {
              // Non-array object
              Object.keys(data[field]).forEach(fieldKey => {
                form.append(field + '.' + fieldKey, data[field][fieldKey]);
              });
            }
          }
        } else {
          // In the simplest case, the field value is not an object, directly append
          form.append(field, data[field]);
        }
      });
    },
    initMail() {
      for (const field in this.mail) {
        if (getType(this.mail[field]) === 'String') {
          this.mail[field] = '';
        } else if (getType(this.mail[field]) === 'Array') {
          this.mail[field] = [];
        }
      }
      this.target = [];
      this.copy = [];
      this.aliases = [];
      //The editor content and mail.content are two-way binding, the mail.content = '' in the previous step does not know why the editor content is not cleared.
      tinymce.get(this.editorId).setContent('');
    }
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

ul {
  list-style: none;
}

audio {
  width: 260px;
}

.mce-panel {
  border-radius: 10px;
  border: 0 solid #f3f3f3 !important;
}

.tool-bar {
  margin-top: -20px;
  margin-left: -20px;
}

.el-row {
  margin-bottom: 10px;
}

.target-label {
  font-size: 14px;
  padding: 0px 12px;
  margin: 2px 0;
  height: 35px;
  line-height: 35px;
}

.target-label i {
  margin-left: 3px;
}

.upload-file {
  display: inline-block;
  vertical-align: middle;
  width: 100%;
}

.el-upload-dragger {
  height: 30px;
  border: none;
  width: 100%;
}

.el-upload-dragger .el-icon-upload {
  font-size: 30px;
  line-height: 20px;
  margin: 3px 0;
}

.audio-name {
  width: 200px;
  vertical-align: 12px;
}

.audio-list > li {
  display: flex;
  align-items: center;
}

.del-audio {
  margin-left: 5px;
  cursor: pointer;
  vertical-align: 10px;
  font-size: 20px;
  color: #00adb5;
}

.send-btn {
  margin-top: 10px;
  margin-right: 60px;
}

.cancel-btn {
  margin-top: 10px;
}

.old-audio-name {
  vertical-align: 10px;
}

.el-switch {
  height: 0%;
}

#send {
  margin-top: 0.5%;
}

#switchMail {
  display: inline-block;
  font-size: 80%;
  text-align: center;
  padding: 10px;
  font-weight: 100;
  color: darkgray;
}

#from {
  padding-left: 4% !important;
}

.to {
  padding-left: 9% !important;
}

.cc {
  padding-left: 9% !important;
}

</style>

