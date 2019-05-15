// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import ZkTable from 'vue-table-with-tree-grid';
import 'element-ui/lib/theme-default/index.css';
import 'assets/custom-theme/index.css'; // Skinning versionelement-ui css https://github.com/PanJiaChen/custom-element-theme
import NProgress from 'nprogress'; // Progress progress bar
import 'nprogress/nprogress.css';// Progress progress bar style
import 'normalize.css/normalize.css';// normalize.css Style formatting
import 'styles/index.scss'; // Globally customizedcssstyle
import 'components/Icon-svg/index'; // PackagedsvgComponent
import 'assets/iconfont/iconfont'; // iconfont See the specific iconhttps://github.com/PanJiaChen/vue-element-admin/wiki
import * as filters from './filters'; // Globalvue filter
import Multiselect from 'vue-multiselect';// a multi-selector component used，element-ui of select Can't meet all the needs
import 'vue-multiselect/dist/vue-multiselect.min.css';// Multi-selection box component css
import Sticky from 'components/Sticky'; // viscosity header Component
import vueWaves from './directive/waves';// Water ripple command
import errLog from 'store/errLog';// error log Component
import './mock/index.js';  // All requests for this project are used mockjs simulation
import locale from 'element-ui/lib/locale/lang/en'
// import aLocale from 'ant-design-vue/lib/locale-provider/en_US';

// register globally
Vue.component('multiselect', Multiselect);
Vue.component('Sticky', Sticky);
Vue.component(ZkTable.name, ZkTable);
Vue.use(antd);
// Vue.component('a-select-option', antd.Select.Option);
Vue.use(ElementUI, { locale });
Vue.use(vueWaves);


// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

// permissiom judge
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true; // admin Permission Pass directly
  if (!permissionRoles) return true;
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

// register global progress.
const whiteList = ['/login', '/authredirect', '/reset', '/sendpwd'];// Do not redirect whitelist
router.beforeEach((to, from, next) => {
  NProgress.start(); // Open Progress
  if (store.getters.token) { // Determine if there is token
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      if (store.getters.roles.length === 0) { // Determine if the current user has finished pulling user_info information
        store.dispatch('GetInfo').then(res => { // Pull user_info
          const roles = res.data.role;
          store.dispatch('GenerateRoutes', { roles }).then(() => { // Generate an accessible routing table
            router.addRoutes(store.getters.addRouters) // Dynamically add accessible routing tables
            next(to.path); // hack Method Make sure addRoutes is complete
          })
        }).catch(err => {
          console.log(err);
        });
      } else {
        // There is no need to dynamically change permissions directly next() Delete the permission below ↓
        if (hasPermission(store.getters.roles, to.meta.role)) {
          next();//
        } else {
          next({ path: '/401', query: { noGoBack: true } });
        }
        // Can be deleted ↑
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // Free login whitelist，enter directly
      next()
    } else {
      next('/login'); // Otherwise redirect all to the login page
      NProgress.done(); // inhashMode Change manual changeshash Redirect back Will not triggerafterEach temporarilyhackProgram ps：historyNo problem in mode，Can delete the line！
    }
  }
});


router.afterEach(() => {
  NProgress.done(); // EndProgress
});

// window.onunhandledrejection = e => {
//     console.log('unhandled', e.reason, e.promise);
//     e.preventDefault()
// };

// Production environment error log
if (process.env === 'production') {
  Vue.config.errorHandler = function (err, vm) {
    console.log(err, window.location.href);
    errLog.pushLog({
      err,
      url: window.location.href,
      vm
    })
  };
}

// window.onerror = function (msg, url, lineNo, columnNo, error) {
//     console.log('window')
// };
//
// console.error = (function (origin) {
//     return function (errorlog) {
//         // handler();//Business-based logging and data error reporting
//         console.log('console'+errorlog)
//         origin.call(console, errorlog);
//     }
// })(console.error);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
