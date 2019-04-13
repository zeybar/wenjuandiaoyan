const Home = () => import(/* webpackChunkName: "Home" */ '../views/Home/index.vue'); // 首页

export default [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      login: false,
      showHeader: true,
      showVersionTip: true,
    },
  },
  // 404 路由永远在最后
  // {
  //   path: '*',
  //   name: 'not-found',
  //   component: NotFound,
  //   meta: {
  //     login: false,
  //   },
  // },
];
