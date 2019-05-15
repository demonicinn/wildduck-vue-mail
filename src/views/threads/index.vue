<template>
  <div class="app-container calendar-list-container">
    
    <!-- <el-table ref="labelTable" row-key="id" :data="data" v-loading.body="listLoading" border highlight-current-row style="width: 100%">

      <el-table-column prop="thread" align="center" min-width="200px" label="Subject">
        
      </el-table-column>

        <el-table-column align="center" prop="sender" min-width="200px" label="Sender">
          <template scope="scope">
              <el-tag type="primary" color="#E3FDFD">{{scope.row.sender}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="date" label="Date" min-width="200px">
          <template scope="scope">
              <el-tag type="primary" color="#E3FDFD">{{scope.row.date}}</el-tag>
          </template>
        </el-table-column>
    </el-table> -->

    <zk-table
      ref="table"
      sum-text="sum"
      index-text="#"
      :data="data"
      :columns="columns"
      :stripe="props.stripe"
      :border="props.border"
      :show-header="props.showHeader"
      :show-summary="props.showSummary"
      :show-row-hover="props.showRowHover"
      :show-index="props.showIndex"
      :tree-type="props.treeType"
      :is-fold="props.isFold"
      :expand-type="props.expandType"
      :selection-type="props.selectionType">
    </zk-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
  </div>
</template>
  

 <script>
  import * as threadAPI from 'api/threads';
  import TreeTable from 'vue-table-with-tree-grid';

  export default {
    name: 'threads',
     data() {
      return {
        props: {
          stripe: false,
          border: false,
          showHeader: true,
          showSummary: false,
          showRowHover: true,
          showIndex: false,
          treeType: true,
          isFold: true,
          expandType: false,
          selectionType: false,
        },
        columns: [
          {
            label: 'Subject',
            prop: 'thread',
            width: '400px',
          },
          {
            label: 'Sender',
            prop: 'sender',
            minWidth: '50px',
          },
          {
            label: 'Date',
            prop: 'date',
          },
        ],
        listLoading: false,
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
            },
          data: [],
          defaultProps: {
            children: 'children',
            label: 'label',
          },
          tableData1: [{
          id: 1,
          date: '2016-05-02',
          name: 'wangxiaohu',
          sender: 'hehe@ahoho.com',
          date: String(Date()),
        }, {
          id: 2,
          date: '2016-05-04',
          name: 'wangxiaohu',
          sender: 'ya@hoo.com',
          date: String(Date()),
        }, {
          id: 3,
          date: '2016-05-01',
          name: 'wangxiaohu',
          sender: 'ghost@rider.com',
          date: String(Date()),
          hasChildren: true
        }, {
          id: 4,
          date: '2016-05-03',
          name: 'wangxiaohu',
          sender: 'god@ofWar.com',
          date: String(Date()),
        }]
        };
    },
    created() {
      this.initThreadPage();
    },
    methods: {
      handleCurrentChange(val) {
        this.listQuery.page = val;
        // this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        // this.getList();
      },
      initThreadPage(){
        threadAPI.getThreads().subscribe({
          next: res => {
            console.log('Threads fetched. fethced list is: ' + res.data);
            this.data = res.data;
          },
          error: error => {
            this.$message({
                type: 'error',
                message: 'Failed to fetch threads',
                duration: 1000
            });
            console.log(error);
          }
        })
      },
      handleNodeClick(data) {
        console.log(data);
      },
      load(tree, treeNode, resolve) {
        resolve([
          {
            id: 31,
            date: '2016-05-01',
            name: 'wangxiaohu'
          }, {
            id: 32,
            date: '2016-05-01',
            name: 'wangxiaohu'
          }
        ])
      }

    }
 }
 </script>

<style>

  .el-tree {
    border: none;
  }

  .cell {
    padding: 0px !important;
  }

</style>
