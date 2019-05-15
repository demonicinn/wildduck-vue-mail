<template>
    <div class="dashboard-container">
        <div class=" clearfix">
            <PanThumb style="float: left" :image="avatar"> Your permission:
                <span class="pan-info-roles" v-for="item in roles" :key="item">{{item}}</span>
            </PanThumb>

            <div class="info-container">
                <span class="display_name">{{name}}</span>
                <div class="info-wrapper">
                    <div class="info-item">
                        <countTo class="info-item-num" :startVal='0' :endVal='statisticsData.inbox_count' :duration='3400'></countTo>
                        <span class="info-item-text">Receiving</span>
                        <icon-svg icon-class="a" class="dashboard-icon" />
                    </div>
                    <div class="info-item" style="cursor: auto">
                        <countTo class="info-item-num" :startVal='0' :endVal='statisticsData.outbox_count' :duration='3600'></countTo>
                        <span class="info-item-text">Sending</span>
                        <icon-svg icon-class="b" class="dashboard-icon" />
                    </div>
                    <div class="info-item">
                        <countTo class="info-item-num" ref='countTo3' :startVal='0' :endVal='statisticsData.draft_count' :duration='3800'></countTo>
                        <span class="info-item-text">draft</span>
                        <icon-svg icon-class="c" class="dashboard-icon" />
                    </div>
                </div>
            </div>
        </div>
    
        <div class="btn-group">
            <router-link class="pan-btn green-btn" to="/mail_send/index">write a letter</router-link>
            <router-link class="pan-btn orange-btn" to="/inbox/index">inbox</router-link>
            <router-link class="pan-btn blue-btn" to="/outbox/index">Outbox</router-link>
            <router-link class="pan-btn pink-btn" to="/draftbox/index">Draft box</router-link>
            <router-link class="pan-btn cyan-btn" to="/mail_label/index">Label management</router-link>
            <router-link class="pan-btn red-btn" to="/mail_contacts/index">Address book</router-link>
        </div>
    
        <div class="clearfix main-dashboard-container">
            <div class="chart-container">
                <WeeklyUsing :listData='statisticsData.weekly_using'></WeeklyUsing>
            </div>
            <div class="unread-mail-container">
                <div class="unread-mail-title">Unread mail</div>
                <div class="unread-mail-wrapper">
                    <template v-if="unreadMails.length!=0">
                        <div class="unread-mail-item" v-for="mail in unreadMails" :key="mail">
                            <span class="unread-mail-content" @click="toUnreadMail(mail.id)">
                                {{mail.title}}
                            </span>
                            <el-tag type="danger">{{mail.receiveDate | parseTime('{m}-{d} {h}:{i}')}}</el-tag>
                            <el-tag type="primary">{{mail.sendName}}</el-tag>
                        </div>
                    </template>
                    <template v-else>
                        <div class="unread-mail-emptyTitle">All the emails have been read by you.</div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PanThumb from 'components/PanThumb';
import WeeklyUsing from './weekly_using';
import { fetchUnReadList } from 'api/inbox';
import countTo from 'vue-count-to';
import { parseTime } from 'utils/index';
export default {
    name: 'dashboard',
    components: { PanThumb, WeeklyUsing, countTo },
    data() {
        return {
            chart: null,
            statisticsData: {
                inbox_count: 512,
                outbox_count: 256,
                draft_count: 128,
                month_inbox_count: 28,
                unread_mail: [],
                weekly_using: [
                    { receiveCount: 40, sendCount: 21, week: '201701' },
                    { receiveCount: 48, sendCount: 19, week: '201702' },
                    { receiveCount: 55, sendCount: 23, week: '201703' },
                    { receiveCount: 68, sendCount: 26, week: '201704' },
                    { receiveCount: 52, sendCount: 21, week: '201705' },
                    { receiveCount: 64, sendCount: 23, week: '201706' },
                    { receiveCount: 69, sendCount: 20, week: '201707' },
                    { receiveCount: 61, sendCount: 26, week: '201708' },
                    { receiveCount: 78, sendCount: 32, week: '201709' },
                    { receiveCount: 73, sendCount: 22, week: '2017010' },
                    { receiveCount: 62, sendCount: 20, week: '2017011' },
                    { receiveCount: 66, sendCount: 23, week: '2017012' }
                ],
                frequertContacts: [
                    {
                        name: 'Test 1',
                        mail: 'ruli@snh48.com',
                        avatarUrl: 'https://c1.staticflickr.com/9/8046/8082447203_14ec1579b4_z.jpg'
                    },
                    {
                        name: 'test 2',
                        mail: 'xiaoju@snh48.com',
                        avatarUrl: 'https://c1.staticflickr.com/9/8046/8082447203_14ec1579b4_z.jpg'
                    },
                    {
                        name: 'test 3',
                        mail: 'ahuang@snh48.com',
                        avatarUrl: 'https://c1.staticflickr.com/9/8046/8082447203_14ec1579b4_z.jpg'
                    },
                    {
                        name: 'test 4',
                        mail: 'ergou@snh48.com',
                        avatarUrl: 'https://c1.staticflickr.com/9/8046/8082447203_14ec1579b4_z.jpg'
                    },
                    {
                        name: 'test 5',
                        mail: 'dage@snh48.com',
                        avatarUrl: 'https://c1.staticflickr.com/9/8046/8082447203_14ec1579b4_z.jpg'
                    },
                    {
                        name: 'test 6',
                        mail: 'xiaosi@snh48.com',
                        avatarUrl: 'https://c1.staticflickr.com/9/8046/8082447203_14ec1579b4_z.jpg'
                    },
                    {
                        name: 'test 7',
                        mail: 'shiqi@snh48.com',
                        avatarUrl: 'https://c1.staticflickr.com/9/8046/8082447203_14ec1579b4_z.jpg'
                    },
                    {
                        name: 'test 7',
                        mail: 'aizong@snh48.com',
                        avatarUrl: 'https://c1.staticflickr.com/9/8046/8082447203_14ec1579b4_z.jpg'
                    }
                ]
            },
            unreadList: []
        }
    },
    created() {
        this.fetchData();
    },
    computed: {
        ...mapGetters([
            'name',
            'avatar',
            'email',
            'uid',
            'introduction',
            'roles'
        ]),
        unreadMails() {
            return this.unreadList.slice(0,6)
        }
    },
    methods: {
        fetchData() {
            fetchUnReadList().then(res => {
                this.unreadList = res.data.items;
            })
        },
        toUnreadMail(id) {
            this.$store.commit('SET_MAIL_TYPE', 'receive');
            this.$router.push({ path: '/mail_detail/index/' + id });
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.unread-mail-emptyTitle {
    font-size: 16px;
    color: #F38181;
    padding-top: 20px;
    text-align: center;
}

.dashboard-container {
    padding: 20px 50px;
    .pan-info-roles {
        font-size: 12px;
        font-weight: 700;
        color: #333;
        display: block;
    }
    .info-container {
        position: relative;
        margin-left: 190px;
        height: 150px;
        line-height: 200px;
        .display_name {
            font-size: 48px;
            line-height: 48px;
            color: #212121;
            position: absolute;
            top: 25px;
        }
        .info-wrapper {
            line-height: 40px;
            position: absolute;
            bottom: 0px;
            .info-item {
                display: inline-block;
                margin-right: 95px;
                .info-item-num {
                    color: #212121;
                    font-size: 24px;
                    display: inline-block;
                    padding-right: 5px;
                }
                .info-item-text {
                    color: #727272;
                    font-size: 14px;
                    padding-right: 5px;
                    display: inline-block;
                }
            }
        }
        .dashboard-icon {
            width: 22px;
            height: 22px;
        }
    }
    .btn-group {
        display: flex;
        margin: 30px 36px 30px 0;
    }
    .main-dashboard-container {
        width: 100%;
        position: relative;
        border: 1px solid #DEE1E2;
        padding: 0 10px;
    }
    .chart-container {
        float: left;
        position: relative;
        padding-right: 10px;
        width: 40%;
        border-right: 1px solid #DEE1E2;
    }
    .unread-mail-container {
        padding: 12px 12px 0px;
        float: left;
        width: 60%;
        height: 380px;
        position: relative;
        .unread-mail- {
            &title {
                font-size: 16px;
                color: #F38181;
                letter-spacing: 1px;
                padding-left: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #DEE1E2;
            }
            &more {
                color: #2C3E50;
                font-size: 12px;
                float: right;
                margin-right: 25px;
                line-height: 40px;
                &:hover {
                    color: #3A71A8;
                }
            }
            &wrapper {
                padding: 0 20px 0 22px;
                .unread-mail- {
                    &item {
                        cursor: pointer;
                        padding: 16px 8px 16px 16px;
                        border-bottom: 1px solid #DEE1E2;
                        position: relative;
                        .el-tag {
                            margin: 0 3px;
                        }
                        &:before {
                            content: "";
                            height: 104%;
                            width: 0px;
                            background: #30B08F;
                            display: inline-block;
                            position: absolute;
                            opacity: 0;
                            left: 0px;
                            top: -2px;
                            transition: 0.3s ease all;
                        }
                        &:hover {
                            &:before {
                                opacity: 1;
                                width: 3px;
                            }
                        }
                    }
                    &status {
                        font-size: 12px;
                        display: inline-block;
                        color: #9B9B9B;
                        padding-right: 6px;
                    }
                    &content {
                        font-size: 13px;
                        color: #2C3E50;
                        &:hover {
                            color: #3A71A8;
                        }
                    }
                    &time {
                        position: absolute;
                        right: 16px;
                        top: 16px;
                        color: #9B9B9B;
                    }
                }
            }
        }
    }
}
</style>
