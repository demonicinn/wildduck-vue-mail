webpackJsonp([7],{326:function(t,e,i){function a(t){i(640)}var n=i(1)(i(519),i(690),a,null,null);t.exports=n.exports},383:function(t,e,i){"use strict";function a(t){return(0,s.default)({url:"mail_detail",method:"get",params:t})}function n(){return r.Observable.create(function(t){setTimeout(function(){return t.next()},1e3)})}Object.defineProperty(e,"__esModule",{value:!0}),e.fetchDetail=a,e.delMail=n;var l=i(38),s=function(t){return t&&t.__esModule?t:{default:t}}(l),r=i(64)},519:function(t,e,i){"use strict";function a(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e.default=t,e}Object.defineProperty(e,"__esModule",{value:!0});var n=i(383),l=a(n),s=i(118),r=a(s);i(9);e.default={name:"mail_detail",data:function(){return{mail:{id:"",title:"",target:[],copy:[],sender:"",sendMail:"",receiveDate:"",sendDate:"",oldFileList:[],oldAudioList:[],labelList:[],isStar:!1},loading:!0,activeGroup:["target"],labelList:[],mailType:"",mailId:null}},created:function(){this.initPage()},computed:{showMailTime:function(){return this.mail.receiveDate||this.mail.sendData}},methods:{initPage:function(){this.getDetail(),this.getLabelList()},getDetail:function(){var t=this;this.loading=!0,this.mailId=this.$route.params.mailId||this.$store.getters.mailId,this.mailId||this.$router.push("/"),this.mailType=this.$store.getters.mailType;var e={mailId:this.mailId,mailType:this.mailType};l.fetchDetail(e).then(function(e){t.loading=!1,t.mail=e.data})},getLabelList:function(){var t=this;r.fetchList().then(function(e){return t.labelList=e.data.labelList})},reply:function(t){t?this.$store.commit("SET_PAGE_TYPE","replyAll"):this.$store.commit("SET_PAGE_TYPE","reply"),this.$store.commit("SET_MAIL_TYPE","receive"),this.$router.push({path:"/mail_send/index"})},edit:function(){this.$store.commit("SET_PAGE_TYPE","edit"),this.$store.commit("SET_MAIL_TYPE",this.mailType),this.$router.push({path:"/mail_send/index"})},forward:function(){this.$store.commit("SET_PAGE_TYPE","forward"),this.$store.commit("SET_MAIL_TYPE",this.mailType),this.$router.push({path:"/mail_send/index"})},deleteMail:function(){var t=this;this.$confirm("Are you sure want to delete this message","confirm",{confirmButtonText:"Confirm",cancelButtonText:"Cancel",type:"warning"}).then(function(){l.delMail().subscribe({next:function(){t.$message({type:"success",message:"Successfully deleted",duration:1e3}),setTimeout(function(){return t.$router.go(-1)},1e3)},error:function(){return t.$message({type:"error",message:"Failed to delete"})}})}).catch()},delLabel:function(t){this.mail.labelList.splice(t,1)},toggleStar:function(){var t=this;r.toggleStar([this.mail.id]).subscribe({next:function(){t.mail.isStar=!t.mail.isStar}})},handleMark:function(t){var e=this;"star"===t?this.toggleStar():r.markLabel(t,[this.mail.id]).subscribe({next:function(){var i=e.labelList.filter(function(e){if(e.id==t)return!0});e.mail.labelList.find(function(e){return e.id==t})||e.mail.labelList.push(i[0])}})}}}},557:function(t,e,i){e=t.exports=i(311)(!0),e.push([t.i,".tool-bar{margin-top:-20px;margin-left:-20px}.mail-info{background-color:#eff2f7}.mail-info div{font-size:14px;margin:4px}.mail-info .el-tag{margin-right:6px}.title-info{padding:2px 5px}.detail-mark-star,.mail-title{font-size:18px;vertical-align:-3px}.detail-mark-star{color:#f08a5d;cursor:pointer}.label-item{margin-left:5px}.info-tag{margin-left:inherit}.target-board{display:inline-block}.send-name,.target-name{color:#1fab89;font-weight:600}.el-collapse-item__header{height:30px;line-height:30px;padding-left:0;color:#20a0ff;font-size:13px}.el-collapse-item__content{padding:2px}","",{version:3,sources:["E:/node/vueJs/dAppBoxV3/src/views/mail_detail/index.vue"],names:[],mappings:"AACA,UACE,iBAAkB,AAClB,iBAAmB,CACpB,AACD,WACE,wBAA0B,CAC3B,AACD,eACE,eAAgB,AAChB,UAAY,CACb,AACD,mBACE,gBAAkB,CACnB,AACD,YACE,eAAiB,CAClB,AAKD,8BAHE,eAAgB,AAChB,mBAAqB,CAOtB,AALD,kBAGE,cAAe,AACf,cAAgB,CACjB,AACD,YACE,eAAiB,CAClB,AACD,UACE,mBAAqB,CACtB,AACD,cACE,oBAAsB,CACvB,AACD,wBAEE,cAAe,AACf,eAAiB,CAClB,AACD,0BACE,YAAa,AACb,iBAAkB,AAClB,eAAgB,AAChB,cAAe,AACf,cAAgB,CACjB,AACD,2BACE,WAAa,CACd",file:"index.vue",sourcesContent:["\n.tool-bar {\r\n  margin-top: -20px;\r\n  margin-left: -20px;\n}\n.mail-info {\r\n  background-color: #eff2f7;\n}\n.mail-info div {\r\n  font-size: 14px;\r\n  margin: 4px;\n}\n.mail-info .el-tag {\r\n  margin-right: 6px;\n}\n.title-info {\r\n  padding: 2px 5px;\n}\n.mail-title {\r\n  font-size: 18px;\r\n  vertical-align: -3px;\n}\n.detail-mark-star {\r\n  font-size: 18px;\r\n  vertical-align: -3px;\r\n  color: #f08a5d;\r\n  cursor: pointer;\n}\n.label-item {\r\n  margin-left: 5px;\n}\n.info-tag {\r\n  margin-left: inherit;\n}\n.target-board {\r\n  display: inline-block;\n}\n.send-name,\r\n.target-name {\r\n  color: #1fab89;\r\n  font-weight: 600;\n}\n.el-collapse-item__header {\r\n  height: 30px;\r\n  line-height: 30px;\r\n  padding-left: 0;\r\n  color: #20a0ff;\r\n  font-size: 13px;\n}\n.el-collapse-item__content {\r\n  padding: 2px;\n}\r\n"],sourceRoot:""}])},640:function(t,e,i){var a=i(557);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);i(312)("711f10b1",a,!0)},690:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"loading",rawName:"v-loading.body",value:t.loading,expression:"loading",modifiers:{body:!0}}],staticClass:"app-container calendar-list-container"},[i("el-row",{staticClass:"tool-bar"},[i("el-button-group",["receive"===t.mailType?i("el-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{type:"primary",icon:"edit",size:"small"},on:{click:function(e){t.reply()}}},[t._v("Reply")]):t._e(),t._v(" "),"receive"===t.mailType?i("el-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{type:"primary",icon:"edit",size:"small"},on:{click:function(e){t.reply(!0)}}},[t._v("Reply all")]):t._e(),t._v(" "),"send"===t.mailType?i("el-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{type:"primary",icon:"edit",size:"small"},on:{click:t.edit}},[t._v("Edit")]):t._e(),t._v(" "),i("el-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{type:"primary",icon:"share",size:"small"},on:{click:t.forward}},[t._v("Forward")]),t._v(" "),i("el-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{type:"primary",icon:"delete",size:"small"},on:{click:t.deleteMail}},[t._v("Delete")]),t._v(" "),i("el-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{type:"primary",size:"small"},on:{click:t.initPage}},[i("icon-svg",{attrs:{"icon-class":"reload4"}})],1)],1),t._v(" "),i("el-dropdown",{attrs:{"split-button":"",type:"primary",size:"small","menu-align":"start"},on:{command:t.handleMark}},[t._v("Mark as\n      "),i("el-dropdown-menu",{slot:"dropdown"},[i("el-dropdown-item",{attrs:{command:"star"}},[i("icon-svg",{staticClass:"download-icon",attrs:{"icon-class":"favourite"}}),t._v("Star mail\n        ")],1),t._v(" "),t._l(t.labelList,function(e){return i("el-dropdown-item",{key:e.id,attrs:{command:e.id+""}},[i("icon-svg",{staticClass:"download-icon",attrs:{"icon-class":"label1"}}),t._v("\n          "+t._s(e.name)+"\n        ")],1)})],2)],1),t._v(" "),i("el-dropdown",{attrs:{"split-button":"",type:"primary",size:"small","menu-align":"start"}},[t._v("attachment\n      "),i("el-dropdown-menu",{slot:"dropdown"},t._l(t.mail.oldFileList,function(e){return i("el-dropdown-item",{key:e.name},[i("icon-svg",{staticClass:"download-icon",attrs:{"icon-class":"download3"}}),t._v(" "),i("a",{attrs:{href:e.url,download:""}},[t._v(t._s(e.name))])],1)}))],1),t._v(" "),i("el-dropdown",{attrs:{"split-button":"",type:"primary",size:"small","menu-align":"start"}},[t._v("Recording\n      "),i("el-dropdown-menu",{slot:"dropdown"},t._l(t.mail.oldAudioList,function(e){return i("el-dropdown-item",{key:e.name},[i("icon-svg",{staticClass:"download-icon",attrs:{"icon-class":"voice4"}}),t._v(" "),i("a",{attrs:{href:e.url,download:""}},[t._v(t._s(e.name))])],1)}))],1)],1),t._v(" "),i("div",{staticClass:"mail-info"},[i("div",{staticClass:"title-info"},[i("span",{staticClass:"mail-title"},[t._v(t._s(t.mail.title))]),t._v(" "),i("i",{staticClass:"detail-mark-star fa",class:[t.mail.isStar?"fa-star":"fa-star-o"],on:{click:function(e){t.toggleStar()}}}),t._v(" "),t._l(t.mail.labelList,function(e,a){return i("el-tag",{key:e.id,staticClass:"label-item",attrs:{closable:!0,color:e.color,"close-transition":!1},on:{close:function(e){t.delLabel(a)}}},[t._v(t._s(e.name))])})],2),t._v(" "),i("div",[i("el-tag",{staticClass:"info-tag",attrs:{type:"primary"}},[t._v("Sender")]),t._v(" "),i("span",{staticClass:"send-name"},[t._v(t._s(t.mail.sender))]),t._v("\n      <"+t._s(t.mail.sendMail)+">;\n    ")],1),t._v(" "),i("div",[i("el-tag",{staticClass:"info-tag",attrs:{type:"primary"}},[t._v("Time    ")]),t._v("\n      "+t._s(t._f("parseTime")(t.showMailTime,"{y}-{m}-{d} {h}:{i}"))+"\n    ")],1),t._v(" "),i("el-row",[i("el-col",{attrs:{span:1}},[i("el-tag",{attrs:{type:"primary"}},[t._v("Recipient")])],1),t._v(" "),i("el-col",{attrs:{span:22}},t._l(t.mail.target,function(e){return i("span",{key:e.mail,staticClass:"target-item"},[i("span",{staticClass:"target-name"},[t._v(t._s(e.name))]),t._v("\n          <"+t._s(e.mail)+">;\n        ")])}))],1),t._v(" "),i("el-row",[i("el-col",{attrs:{span:1}},[i("el-tag",{attrs:{type:"primary"}},[t._v("Cc    ")])],1),t._v(" "),i("el-col",{attrs:{span:22}},t._l(t.mail.copy,function(e){return i("span",{key:e.mail,staticClass:"target-item"},[i("span",{staticClass:"target-name"},[t._v(t._s(e.name))]),t._v("\n          <"+t._s(e.mail)+">;\n        ")])}))],1)],1),t._v(" "),i("div",{staticClass:"mail-content",domProps:{innerHTML:t._s(t.mail.content)}})],1)},staticRenderFns:[]}}});