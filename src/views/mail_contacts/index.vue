<template>
    <div class="app-container calendar-list-container">
    
        <div class="filter-container">
            <el-tooltip class="item" effect="dark" content="New" placement="top-start">
                <el-button v-waves @click="openForm('add')" type="primary" icon="plus" class="tool-item filter-item btn-add"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Send selected contacts" placement="bottom-start">
                <el-button v-waves @click="sendMail()" type="primary" class="tool-item filter-item btn-send">
                    <icon-svg icon-class="send2"/>
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Send all" placement="top-start">
                <el-button v-waves @click="sendMail('all')" type="primary" class="tool-item filter-item btn-send-to-all">
                    <icon-svg icon-class="send2"/>
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Delete selected contacts" placement="bottom-start">
                <el-button v-waves @click="del" type="danger" icon="delete" class="tool-item filter-item btn-del"></el-button>
            </el-tooltip>
    
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="Name" v-model="listQuery.name">
            </el-input>
    
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="mailbox" v-model="listQuery.mail">
            </el-input>
    
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">Search for</el-button>
            <el-button class="filter-item" type="text" icon="document" @click="handleDownload">Export</el-button>
        </div>
    
        <el-row>
            <el-col :span="8" v-for="(item, index) in list" :key="index" class="card-row">
                <div class="el-card" ref="card" @click="toggleSelect(item, index, $event)">
                    <img :src="item.avatarUrl" class="avatar-image">
                    <div class="constact-right">
                        <p>
                            <icon-svg icon-class="user4" class="user-icon"/>{{item.name}}
                            <el-button v-waves @click="openForm('edit', item, $event)" type="primary" icon="edit" size="small" class="card-btn card-btn-edit"></el-button>
                            <el-button v-waves @click="sendMail(null, item, $event)" type="primary" size="small" class="btn-send-mail">
                                <icon-svg icon-class="send2" class="send-mail-icon"/>
                            </el-button>
                        </p>
                        <div class="mail-container">
                            <i class="el-icon-message mail-icon"></i>
                            <span>{{item.mail}}</span>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    
        <el-dialog :title="contactOperation | operationFilter" :visible.sync="formVisible">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="Choose Avatar" label-width="100px">
                    <img class="avatar" :src="form.avatarUrl" @click="showCropper">
                </el-form-item>
                <el-form-item label="Name" prop="name" label-width="100px">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Mailbox" prop="mail" label-width="100px">
                    <el-input v-model="form.mail" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="formVisible = false">Cancel</el-button>
                <el-button type="primary" @click="submit()">Submit</el-button>
            </div>
        </el-dialog>
        <ImageCropper :width="300" :height="300" url="https://httpbin.org/post" @crop-upload-success="cropSuccess" v-show="imageCropperShow" :key="imageCropperKey" />
    </div>
</template>
<script>
import * as contactsAPI from 'api/mail_contacts';
import { parseTime } from 'utils/index';
import ImageCropper from 'components/ImageCropper';

export default {
    name: 'contacts_list',
    components: { ImageCropper },
    data() {
        return {
            list: [],
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 20,
                name: '',
                mail: ''
            },
            selected: [],
            contactOperation: '',
            formVisible: false,
            imageCropperShow: false,
            imageCropperKey: 0,
            form: {
                name: '',
                mail: '',
                avatar: ''
            },
            rules: {
                name: [
                    { required: true, message: 'Please enter a contact name', trigger: 'blur' },
                    { min: 1, max: 10, message: 'length should be 1 to 10 Characters', trigger: 'blur' }
                ],
                mail: [
                    { type: 'email', required: true, message: 'Please enter a mailbox that meets the specifications', trigger: 'blur' }
                ]
            }
        }
    },
    filters: {
        operationFilter(operation) {
            const operationMap = {
                add: 'Add contact',
                edit: 'Edit contact'
            };
            return operationMap[operation];
        }
    },
    created() {
        this.getContacts();
    },
    methods: {
        getContacts() {
            this.listLoading = true;
            contactsAPI.fetchList(this.listQuery).then(res => {
                this.list = res.data.contacts;
                this.list.forEach(item => item.selected = false);
                this.total = res.data.total;
                this.listLoading = false;
            })
        },
        handleFilter() {
            this.getContacts();
        },
        handleSizeChange(val) {
            this.listQuery.limit = val;
            this.getContacts();
        },
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getContacts();
        },
        toggleSelect(contact, index, event) {
            const card = this.$refs.card[index];
            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
                this.selected.forEach((item, index) => {
                    if (item.mail === contact.mail) {
                        this.selected.splice(index, 1);
                    }
                });
            } else {
                card.classList.add('selected');
                this.selected.push({
                    name: contact.name,
                    mail: contact.mail
                });
            }
        },
        initForm() {
            this.form = {
                name: '',
                mail: '',
                avatarUrl: ''
            };
        },
        openForm(operation, contact, e) {
            e && e.stopPropagation();
            this.contactOperation = operation;
            this.formVisible = true;
            if (operation === 'add') {
                this.initForm();
            } else {
                this.form = contact;
            }
        },
        showCropper() {
            this.imageCropperShow = true;
        },
        cropSuccess(resData) {
            this.imageCropperKey += 1;
            this.imageCropperShow = false;
            this.form.avatarUrl = resData.files.avatar;
        },
        submit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const handle = this.contactOperation === 'add' ? contactsAPI.add : contactsAPI.edit;
                    handle(this.form).subscribe({
                        next: () => {
                            this.$message({
                                type: 'success',
                                message: 'Success',
                                duration: 1000
                            });
                            setTimeout(() => {
                                this.formVisible = false;
                                this.getContacts();
                            }, 1000)
                        },
                        error: () => {
                            this.$message({
                                type: 'error',
                                message: 'operation failed'
                            })
                        }
                    })
                }
            })
        },
        del() {
            const length = this.selected.length;
            if (length < 1) {
                this.$message('Please select a contact to delete');
                return;
            }
            this.$confirm('Are you sue want to delete this ' + length + 'Contacts？', 'Confirm', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                const idArr = [];
                this.selected.forEach(item => idArr.push(item.id));
                contactsAPI.del(idArr).subscribe({
                    next: () => {
                        this.$message('Deleted Successfully');
                        this.$refs.card.forEach(item => item.classList.remove('selected'));
                        this.getContacts();
                    },
                    error: () => {
                        this.$message('Failed to delete');
                    }
                })
            })
        },
        sendMail(type, contact, e) {
            e && e.stopPropagation();
            if (type === 'all') {
                this.$store.commit('SET_TARGET', 'all');
            } else if (contact) {
                this.$store.commit('SET_TARGET', [{ name: contact.name, mail: contact.mail }]);
            } else {
                if (this.selected.length < 1) {
                    this.$message('Please select a contact to send');
                    return;
                }
                const target = [];
                this.selected.forEach(item => target.push({ name: item.name, mail: item.mail }));
                this.$store.commit('SET_TARGET', target);
            }
            this.$store.commit('SET_PAGE_TYPE', 'add');
            this.$router.push('/mail_send/index');
        },
        handleDownload() {
            require.ensure([], () => {
                const { export_json_to_excel } = require('vendor/Export2Excel');
                const tHeader = ['Name', 'mailbox'];
                const filterVal = ['name', 'mail'];
                const data = this.formatJson(filterVal, this.list);
                export_json_to_excel(tHeader, data, parseTime(Date.now()) + 'Address book data');
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        }
    }
}
</script>
<style>
.el-card {
    margin: 12px;
}

.selected {
    border: 2px solid #08D9D6;
}

.card-row {
    height: 130px;
}

.avatar-image {
    float: left;
    margin: 15px;
    width: 80px;
    height: 80px;
}

.user-icon {
    margin-right: 5px;
    color: #F38181;
}

.mail-icon {
    margin-right: 5px;
    color: #F38181;
}

.card-btn {
    margin-left: 5px;
    vertical-align: 1px;
}

.avatar {
    width: 100px;
    height: 100px;
}
</style>
