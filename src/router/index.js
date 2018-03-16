import Vue from 'vue';
import Router from 'vue-router';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';

Vue.use(Router);

const routes = [{
  path: '/',
  redirect: '/goods' // 默认打开goods组件，redirect『重定向』的意思是，当用户访问 /a时，URL 将会被替换成 /b，然后匹配路由为 /b
}, {
  path: '/goods',
  component: goods
}, {
  path: '/ratings',
  component: ratings
}, {
  path: '/seller',
  component: seller
}];

export default new Router({
    linkActiveClass: 'active', // 给跳转到的页面添加active类名
    routes
});
