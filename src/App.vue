<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view><!--keep-alive的原理就是把组件的状态缓存到内存里，如果组件加载过保留在内存里的话，就会直接从内存里调用而不用重新加载(如果不加的话比如添加完商品再回到这个页面商品就没有了)-->
    </keep-alive>
  </div> <!-- 这里传的seller三个组件都可以接收到 -->
</template>

<script>
import {urlParse} from 'common/js/util';
import header from './components/header/header';

const ERR_OK = 0;

export default {
  data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
  created() {
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, response.data); // Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象（this.seller, response.data）复制到目标对象（{}）。它将返回目标对象（{}）
        }
      });
    },
  components: {
    'v-header': header
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "common/stylus/mixin.styl" 
  .tab                 // 为什么在js中已经导入，这里还需要再导入？
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    //border-bottom: 1px solid rgba(7,17,27,0.1)
    border-1px(rgba(7,17,27,0.1))  //理解成一个函数给tab加样式

    .tab-item 
      flex: 1
      text-align: center
      &>a      //&符号指向它的父元素，就是tab-item
         display: block
         font-size: 14px
         color : rgb(77,85,93)
         &.active   //记住这种写法,a中带有active类的标签
           color : rgb(240,20,20)
</style>
