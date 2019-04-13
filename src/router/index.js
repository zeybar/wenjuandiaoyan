import Vue from 'vue'
import Router from 'vue-router'
import appRoutes from './routers'

Vue.use(Router)

const routes = [
  ...appRoutes,
];
const rootRouter = new Router({
  mode: 'history',
  base: '/',
  // scrollBehavior: () => ({ y: 0 }),
  routes,
});

rootRouter.beforeEach((to, from, next) => {
  /**
   * 登陆之后的路由全是嵌套在父级路由中
   * 只在父级路由及其同级路由定义 meta.login
   * 那么登陆之后的路由 meta.login === 'undefined'，变相继承父级路由 meta.login = true
   */
  // const requiresAuth = to.meta.login === undefined ? true : to.meta.login;
  // const isLogin = store.getters.hasLogin; // 是否登陆过，登陆过会有存储信息
  // if (requiresAuth && !isLogin) {
  //   // 需要重新登录
  //   store.commit('SHOW_LOGIN_VIEW');
  //   return;
  // }
  // 特定tab初始化
  next();
});


export default rootRouter;