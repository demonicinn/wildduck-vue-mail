<template>
    <div class="app-container calendar-list-container">
    
        <div class="filter-container">
            <el-button @click="openForm('add')" type="primary" icon="plus">Add Folder Alias</el-button>
        </div>
    
        <el-table :data="list" ref="labelTable" v-loading.body="listLoading" border highlight-current-row style="width: 100%">
    
            <el-table-column align="center" min-width="200px" label="Email/Folder Alias">
                <template scope="scope">
                    <el-tag type="primary" color="#E3FDFD">{{scope.row.mail}}</el-tag>
                </template>
            </el-table-column>

             <el-table-column align="center" min-width="200px" label="Blockchain/Ethereum Address">
                <template scope="scope">
                    <el-tag type="primary" color="#E3FDFD">{{scope.row.blockAddress}}</el-tag>
                </template>
            </el-table-column>
    
            <el-table-column align="center" label="operations" min-width="200px">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="openForm('edit', scope.row)" class="edit-label">Edit
                    </el-button>
                    <el-button size="small" type="danger" @click="delLabel(scope.row.id)">Delete
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    
        <el-dialog :title="labelOperation | operationFilter" :visible.sync="formVisible">
            <el-form :model="form">
                <el-form-item label="Email Address OR Folder Alias" label-width="100px">
                    <el-input v-model="form.mail" auto-complete="off" ></el-input>
                </el-form-item>
                <el-form-item label="Blockchain Address" label-width="100px">
                    <el-input v-model="form.blockAddress" @change="onAddressChange" auto-complete="off" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="formVisible = false">Cancel</el-button>
                <el-button type="primary" @click="submit()">Submit</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import * as labelAPI from 'api/mail_label';
import * as aliasApi from 'api/aliases';
import ethereum_address from 'ethereum-address';
import validator from 'validator';
import _ from 'lodash';

export default {
    name: 'aliases',
    data() {
        return {
            listLoading: true,
            total: null,
            listQuery: {
                page: 1,
                limit: 10,
                sort: ''
            },
            list: [],
			ethAddresses: [],
            labelOperation: '',
            formVisible: false,
            form: {
                name: '',
                color: '#20a0ff'
            }
        }
    },
    created() {
        this.getList();
        // this.getFolders();
    },
    filters: {
        operationFilter(operation) {
            const operationMap = {
                add: 'Add tag',
                edit: 'Edit tag'
            };
            return operationMap[operation];
        }
    },
    methods: {
        // getFolders() {
        //     this.listLoading = true;
        //     folderListApi.fetchList(this.listQuery).then(res => {
        //         this.list = res.data.contacts;
        //         this.list.forEach(item => item.selected = false);
        //         this.total = res.data.total;
        //         this.listLoading = false;
        //     });
        // },
		onAddressChange(address){
			// Assigning entered value to a temp variable
			let psudoAddress = address;
			
			// If the entered character has a character length of 42 characters
			if(psudoAddress.length == 42){
				// CHeck if Ethereum address is valid or not
				if(ethereum_address.isAddress(this.form.blockAddress)){
					console.log(psudoAddress + 'is a valid address');
				} else {
					this.$message({
						type: 'error',
						message: 'Ethereum address not valid',
						duration: 2500
                    })
                    console.log(psudoAddress);
				}
			}
		},
        getList() {
            // if(localStorage.aliases){    
            //     this.list = JSON.parse(localStorage.aliases);
            // }
            aliasApi.getAlias().subscribe({
                    next: (res) => {
                        this.list = res.data;
                    },
                    error: () => {
                        this.$message({
                            type: 'error',
                            message: 'Failed to fetch Aliases',
                            duration: 2000
                        });
                    }
                });
            this.total = this.list.length;
            this.listLoading = false;
        },
        handleSizeChange(val) {
            this.listQuery.limit = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getList();
        },
        initForm() {
            this.form = {
                name: '',
                color: '#20a0ff'
            };
        },
        openForm(operation, label) {
            this.labelOperation = operation;
            this.formVisible = true;
            if (operation === 'add') {
                this.initForm();
            } else {
                this.form = label;
            }
        },
        submit() {
            // validation for the eth address
            if (ethereum_address.isAddress(this.form.blockAddress)) {
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
            let aliases = [];
            let id = this.form.id;
            this.form.show = this.form.mail
            this.form.name = this.form.mail
            // if(localStorage.aliases){
            //     aliases = JSON.parse(localStorage.aliases);
            // }
            if(id){ // Edit
                let index = _.findIndex(this.list, function(o) { return o.id == id });
                this.list[index] = this.form;
                aliasApi.editAlias(this.form).subscribe({
                    next: (res) => {
                        this.$message({
                            type: 'success',
                            message: 'Alias Updated',
                            duration: 2000
                        });
                        // this.list.push(res.data);
                        this.getList();
                        this.formVisible = false;
                    },
                    error: () => {
                        this.$message({
                            type: 'error',
                            message: 'Failed to create Alias',
                            duration: 2000
                        });
                    }
                });
                 
                // try {
                //     localStorage.setItem('aliases', JSON.stringify(this.list));
                //     this.$message({
                //         type: 'success',
                //         message: 'Successful operation',
                //         duration: 1000
                //     });
                //     this.formVisible = false;
                //     this.getList();
                // } catch(error){
                //     console.log(error);
                //     this.$message('Can not save modifications, please try again.')
                // }
            } else { // Create
                this.form.show = this.form.mail;
                this.form.name = this.form.mail;
                aliasApi.createAlias(this.form).subscribe({
                    next: (res) => {
                        this.$message({
                            type: 'success',
                            message: 'Alias Created',
                            duration: 2000
                        });
                        // this.list.push(res.data);
                        this.formVisible = false;
                        this.getList();
                    },
                    error: () => {
                        this.$message({
                            type: 'error',
                            message: 'Failed to create Alias',
                            duration: 2000
                        });
                    }
                });
                // if(aliases && aliases.length > 0 ){
                //     aliases.push(this.form);
                // } else {
                //     aliases = [];
                //     aliases.push(this.form);
                // }
                // try {
                //     localStorage.setItem('aliases', JSON.stringify(aliases));
                //     this.$message({
                //         type: 'success',
                //         message: 'Successful operation',
                //         duration: 1000
                //     });
                //     this.formVisible = false;
                //     this.getList();
                // } catch(error){
                //     console.log(error);
                //     this.$message('Can not save alias, please try again.')
                // }
            }
        },
        delLabel(id) {
            this.$confirm('Are you sure to delete the lebel，The label will also be deleted after deletion.', 'Confirm', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                aliasApi.deleteAlias(id).subscribe({
                    next: (res) => {
                        this.$message({
                            type: 'success',
                            message: 'Alias Deleted',
                            duration: 2000
                        });
                        // this.list.push(res.data);
                        this.getList();
                        this.formVisible = false;
                    },
                    error: () => {
                        this.$message({
                            type: 'error',
                            message: 'Failed to delete Alias',
                            duration: 2000
                        });
                    }
                });
                // let index = _.findIndex(this.list, function(o) { return o.id == id; });
                // this.list.splice(index, 1);
                // localStorage.setItem('aliases', JSON.stringify(this.list));
                // this.$message('Successfully deleted');
                // this.getList();
            })
        },
    }
}
</script>
<style>

</style>
