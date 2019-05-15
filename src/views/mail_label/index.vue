<template>
    <div class="app-container calendar-list-container">
    
        <div class="filter-container">
            <el-button @click="openForm('add')" type="primary" icon="plus">Add tag</el-button>
        </div>
    
        <el-table :data="list" ref="labelTable" v-loading.body="listLoading" border highlight-current-row style="width: 100%">
    
            <el-table-column align="center" min-width="200px" label="Tag name">
                <template scope="scope">
                    <el-tag  type="primary" color="#E3FDFD">{{scope.row.name}}</el-tag>
                </template>
            </el-table-column>
    
            <el-table-column align="center" label="operating" min-width="200px">
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
                <el-form-item label="Label name" label-width="100px">
                    <el-input v-model="form.name" auto-complete="off" ></el-input>
                </el-form-item>
                <el-form-item label="Label color" label-width="100px">
                    <el-color-picker v-model="form.color" show-alpha></el-color-picker>
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
import _ from 'lodash';

export default {
    name: 'label_manage',
    data() {
        return {
            listLoading: false,
            total: null,
            listQuery: {
                page: 1,
                limit: 10,
                sort: ''
            },
            list: [],
            localList: [],
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
        getList() {
            // this.loading = true;
            labelAPI.getLabel().subscribe({
                next: (res) => {
                    this.list = res.data;
                    // this.loading = false;
                },
                error: (error) => {
                this.$message({
                    type: 'error',
                    message: 'Failed to fetch label',
                    duration: 2000
                });
                // this.loading = false;
                }
            });

            // labelAPI.fetchList().then(res => {
            //     console.log(res.data.labelList);
            //     this.list = res.data.labelList;
            //     this.total = res.data.total;
            //     this.listLoading = false;
            // });
            // if(!localStorage.localList){
            //     this.localList = this.list
            //     localStorage.setItem('localList', JSON.stringify(this.localList));
            // } else {
            //     this.localList = JSON.parse(localStorage.localList);
            // }
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
            const handle = this.labelOperation === 'add' ? labelAPI.add : labelAPI.edit;
            if(this.labelOperation === 'add'){
                // this.form.id = new Date().getUTCMilliseconds();
                // this.localList.push(this.form);
                // this.formVisible = false;
                let params = {
                    guid: new Date().getUTCMilliseconds(),
                    name: this.form.name
                }
                labelAPI.createLabel(params).subscribe({
                    next: (res) => {
                        this.$message({
                            type: 'success',
                            message: 'Successfully created Label',
                            duration: 2000
                        });
						res.name = this.form.name;
                        this.list.push(res);
						this.formVisible = false;
                        //this.loading = false;
                    },
                    error: () => {
                    this.$message({
                        type: 'error',
                        message: 'Failed to create Label',
                        duration: 2000
                    });
                    //this.loading = false;
                    }
                });
            } else {
                let id = this.form.id;
                labelAPI.editLabel(this.form).subscribe({
                    next: (res) => {
                        this.list.forEach((label) => {
                            if(res.data.id == label.id){
                                label = res;
                            }
                        });
						this.formVisible = false;
                        //this.loading = false;
                    },
                        error: () => {
                        this.$message({
                            type: 'error',
                            message: 'Failed to edit',
                            duration: 2000
                        });
                        //this.loading = false;
                    }
                });

                // this.localList.forEach((tag) => {
                //     if (id == tag.id){
                //         tag = {...this.form};
                //     }
                // });
                // this.formVisible = false;
            }
            // handle(this.form).subscribe({
            //     next: () => {
            //         this.$message({
            //             type: 'success',
            //             message: 'Successful operation',
            //             duration: 1000
            //         });
            //         setTimeout(() => {
            //             this.formVisible = false;
            //             this.getList();
            //         }, 1000)
            //     },
            //     error: () => {
            //         this.$message({
            //             type: 'error',
            //             message: 'operation failed'
            //         })
            //     }
            // })
        },
        delLabel(id) {
            this.$confirm('Are you sure to delete the lebel，The label will also be deleted after deletion.', 'Confirm', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                labelAPI.deleteLabel(id).subscribe({
                    next: () => {
                        this.$message('Successfully deleted');
                        this.getList();
                    },
                    error: () => {
                        this.$message('Failed to delete');
                    }
                })
                // let index = _.findIndex(this.localList, function(o) { return o.id == id; });
                // this.localList.splice(index, 1);
                // localStorage.setItem('localList', JSON.stringify(this.localList));
                // this.$message('Successfully deleted');
                // this.getList();
            })
        },
        goToMailList(id) {
            this.$router.push({ path: '/mail_list/index', query: { labelId: id } })
        }
    }
}
</script>
<style>

</style>
