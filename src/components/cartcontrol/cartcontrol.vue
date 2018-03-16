<template>
  <div class="cartcontrol">
      <transition name="move">
        <div class="cart-decrease" @click.stop.prevent='decreaseCart' v-show="food.count>0">
            <span class="inner icon-remove_circle_outline"></span>
        </div>
      </transition>
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
      <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type='text/ecmascript-6'>
import Vue from 'vue';
export default {
     props: {
         food: {
             type: Object
         }
     },
     methods: {
         addCart(event) {   // @click没有参数的话是默认传入点击事件
             if (!event._constructed) {  // 阻止浏览器原生点击
                 return;
             }
             if (!this.food.count) {
                 Vue.set(this.food, 'count', 1);
             } else {
                 this.food.count++;
             }
         },
         decreaseCart() {
             if (this.food.count > 0) {
                 this.food.count--;
             }
         }
     }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .cartcontrol
      font-size 0
      .cart-decrease
          display inline-block     
          vertical-align top
          padding 6px
          opacity 1 // 最终时
          transform translate3d(0,0,0) // 不写效果也一样
          transition all 0.4s linear // 不写&.move-leave-active和&.move-enter-active，写在这里也可
          .inner
            display inline-block  // 一定要设为inline-block不然高度就是0，有宽高动画才能做起来
            font-size 24px
            line-height 24px
            color rgb(0,160,220)
            transition all 0.4s linear // 写在这里也可
            transform rotate(0) // 最终时        
          &.move-enter, &.move-leave-active // 进入时和离开的最终时
            opacity: 0
            transform: translate3d(24px, 0, 0)
            .inner
                transform: rotate(180deg)               
       .cart-count
          display inline-block
          width 12px
          line-height 24px
          vertical-align top
          padding-top 6px
          font-size 10px
          color rgb(147,153,159)
          text-align center
      .cart-add
          display inline-block     
          vertical-align top
          font-size 24px
          line-height 24px
          padding 6px
          color rgb(0,160,220)
</style>