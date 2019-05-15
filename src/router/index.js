import Vue from 'vue';
import Router from 'vue-router';

/* layout */
import Layout from '../views/layout/Layout';

/* login */
import Login from '../views/login/';
const authRedirect = () =>
    import('../views/login/authredirect');
const sendPWD = () =>
    import('../views/login/sendpwd');
const reset = () =>
    import('../views/login/reset');

/* dashboard */
const dashboard = () =>
    import('../views/dashboard/index');

/* Introduction */
const Introduction = () =>
    import('../views/introduction/index');

/* error page */
const Err404 = () =>
    import('../views/error/404');
const Err401 = () =>
    import('../views/error/401');

/* error log */
const ErrorLog = () =>
    import('../views/errlog/index');

// mail page
const Inbox = () =>
    import('../views/inbox/index');
const Outbox = () =>
    import('../views/outbox/index');
const DraftBox = () =>
    import('../views/draftbox/index');
const MailSend = () =>
    import('../views/mail_send/index');
const MailDetail = () =>
    import('../views/mail_detail/index');
const MailExpanded = () =>
    import('../views/mail_expanded/index');
const MailLabel = () =>
    import('../views/mail_label/index');
const Alias = () =>
    import('../views/aliases/index');
const MailList = () =>
    import('../views/mail_list/index');
const MailGroup = () =>
    import('../views/mail_contacts/group');
const ContactList = () =>
    import('../views/mail_contacts/index');
const Threads = () =>
    import('../views/threads/index');

import * as labelAPI from 'api/mail_label';
import * as groupAPI from 'api/mail_group';

Vue.use(Router);

/**
 * icon : the icon show in the sidebar
 * hidden : if hidden:true will not show in the sidebar
 * redirect : if redirect:noredirect will not redirct in the levelbar
 * noDropdown : if noDropdown:true will not has submenu
 * meta : { role: ['admin'] }  will control the page role
 **/

// All permissions common routing tables, such as the home page and login page and some public pages that do not have permissions
export const constantRouterMap = [
    { path: '/login', component: Login, hidden: true },
    { path: '/authredirect', component: authRedirect, hidden: true },
    { path: '/sendpwd', component: sendPWD, hidden: true },
    { path: '/reset', component: reset, hidden: true },
    { path: '/404', component: Err404, hidden: true },
    { path: '/401', component: Err401, hidden: true },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        name: 'Home',
        hidden: true,
        children: [{ path: 'dashboard', component: dashboard }]
    },
    {
        path: '/introduction',
        component: Layout,
        redirect: '/introduction/index',
        icon: 'question2',
        noDropdown: true,
        children: [{ path: 'index', component: Introduction, name: 'Introduction' }]
    },
    {
        path: '/mail_send',
        component: Layout,
        redirect: '/mail_send/index',
        icon: 'edit2',
        noDropdown: true,
        children: [{ path: 'index', component: MailSend, name: 'Write mail or share access' }]
    },
    {
        path: '/inbox',
        component: Layout,
        redirect: '/inbox/index',
        icon: 'inbox',
        noDropdown: true,
        children: [{ path: 'index', component: Inbox, name: 'Inbox' }]
    },
    {
        path: '/outbox',
        component: Layout,
        redirect: '/outbox/index',
        icon: 'outbox',
        noDropdown: true,
        children: [{ path: 'index', component: Outbox, name: 'Outbox' }]
    },
    {
        path: '/draftbox',
        component: Layout,
        redirct: '/draftbox/index',
        icon: 'edit3',
        noDropdown: true,
        children: [{ path: 'index', component: DraftBox, name: 'Draft box' }]
    },
    {
        path: '/mail_list',
        component: Layout,
        redirect: '/mail_list/index',
        icon: 'recycle3',
        noDropdown: true,
        children: [{ path: 'index', component: MailList, name: 'Recycle', meta: { isDeleted: true } }]
    },
    {
        path: '/mail_detail',
        component: Layout,
        redirect: '/mail_detail/index',
        hidden: true,
        children: [{ path: 'index/:mailId?', component: MailDetail, name: 'Mail Details' }]
    },
    {
        path: '/mail_expanded',
        component: Layout,
        redirect: '/mail_expanded/index',
        hidden: true,
        children: [{ path: 'index/:mailId?', component: MailExpanded, name: 'Mail Details' }]
    },
    {
        path: '/mail_list',
        component: Layout,
        redirect: '/mail_list/index',
        hidden: true,
        children: [{ path: 'index/:labelId?', component: MailList, name: 'Mailing list' }]
    },
    {
        path: '/mail_contacts',
        component: Layout,
        redirect: '/mail_contacts/index',
        hidden: true,
        children: [{ path: 'index/:groupId?', component: ContactList, name: 'Contact list' }]
    },
    {
        path: '/aliases',
        component: Layout,
        redirect: '/aliases/index',
        icon: 'el-icon-tickets',
        noDropdown: true,
        children: [{ path: 'index', component: Alias, name: 'Aliases' }]
    },
    {
        path: '/mail_label',
        component: Layout,
        redirect: '/mail_label/index',
        icon: 'xinrenzhinan',
        hidden: true,
        children: [{ path: 'index', component: MailLabel }]
    },
    {
        path: '/threads',
        component: Layout,
        redirect: '/threds/index',
        icon: 'bug',
        noDropdown: true,
        children: [{ path: 'index', component: Threads, name: 'Threads' }]
    }
]

// Mount only when vue is instantiated constantRouter
export default new Router({
    // mode: 'history', //Backend support can be opened
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
});

// Asynchronously mounted routes, dynamic routing tables that need to be loaded according to permissions
export const asyncRouterMap = [
    {
        path: '',
        component: Layout,
        redirect: 'noredirect',
        name: 'Mail label',
        icon: 'label7',
        children: [{ path: 'mail_label/index', component: MailLabel, name: 'Label management' }]
    },
    {
        path: '',
        component: Layout,
        redirect: 'noredirect',
        name: 'Address book',
        icon: 'contact5',
        children: [
            { path: 'mail_contacts/group', component: MailGroup, name: 'Group management' },
            { path: 'mail_contacts/index', component: ContactList, name: 'All contacts' }
        ]
    },
    {
        path: '/errorpage',
        component: Layout,
        redirect: 'noredirect',
        name: 'Error page',
        icon: 'warn1',
        children: [
            { path: '401', component: Err401, name: '401' },
            { path: '404', component: Err404, name: '404' }
        ]
    },
    {
        path: '/errlog',
        component: Layout,
        redirect: 'noredirect',
        name: 'errlog',
        icon: 'bug',
        hidden: true,
        noDropdown: true,
        children: [{ path: 'log', component: ErrorLog, name: 'Error log' }]
    },
    { path: '*', redirect: '/404', hidden: true }

];

labelAPI.fetchList().then(res => {
    const labelList = res.data.labelList;
    console.log(labelList);
    const labelMenuIndex = asyncRouterMap.findIndex(item => item.name === 'Mail label');
    labelList.forEach(item => {
        asyncRouterMap[labelMenuIndex].children.push({
            path: 'mail_list/index/' + item.id,
            component: MailList,
            name: item.name,
            meta: {
                labelId: item.id
            }
        })
    });
});

groupAPI.fetchList().then(res => {
    const groupList = res.data.groupList;
    const groupMenuIndex = asyncRouterMap.findIndex(item => item.name === 'Address book');
    groupList.forEach(item => {
        asyncRouterMap[groupMenuIndex].children.push({
            path: 'mail_contacts/index/' + item.id,
            component: ContactList,
            name: item.name,
            meta: {
                groupId: item.id
            }
        })
    });
})