<template>
<div>
    <div class="shopcart">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                      <div class="logo" :class="{'highlight':totalCount}">
                          <i class="icon-shopping_cart" :class="{'highlight':totalCount}"></i>
                      </div>
                      <div class="num" v-show="totalCount">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highlight':totalCount}">¥{{totalPrice}}元</div>
                <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
            </div>
            <div class="content-right">
                 <div class="pay" :class="payClass" @click.stop.prevent="pay">  <!--阻止冒泡和默认事件-->
                    {{payDesc}}
                </div>
           </div>
        </div>
        <transition name="fold">
            <div class="shopcart-list" v-show="listShow">
                <div class="list-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="empty">清空</span>
                </div>
                <div class="list-content" ref="listContent">
                    <ul>
                        <li class="food" v-for="(food,index) in selectFood" :key="index">
                            <span class="name">{{food.name}}</span>
                            <span class="price">¥{{food.price*food.count}}</span>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol :food="food"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
    <transition name="fade">
        <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
</div>
</template>

<script type='text/ecmascript-6'>
import cartcontrol from 'components/cartcontrol/cartcontrol';
import BScroll from 'better-scroll';
export default {
    props: {
        selectFood: {
            type: Array,
            default() {
                return [];  // 当对象类型是Array或者Object时,default必须是函数
            }
        },
       deliveryPrice: {
           type: Number,
           default: 0
       },
       minPrice: {
           type: Number,
           default: 0
       }
    },
    data () {
        return {
            fold: true
        };
    },
    computed: {
        totalPrice() {
            let total = 0;
            this.selectFood.forEach((food) => {
                total += food.price * food.count;
            });
            return total;
        },
        totalCount() {
            let count = 0;
            this.selectFood.forEach((food) => {
                 count += food.count;
            });
            return count;
        },
        payDesc() {
            if (this.totalPrice === 0) {
                return `¥${this.minPrice}元起送`;
            } else if (this.totalPrice < this.minPrice) {
                let diff = this.minPrice - this.totalPrice;
                return `还差¥${diff}元起送`;
            } else {
                return '去结算';
            }
        },
        payClass() {
            if (this.totalPrice >= this.minPrice) {
                return 'enough';
            }
        },
        listShow() {
            if (!this.totalCount) {
                this.fold = true;
                return false;
            }
            let show = !this.fold;
            if (show) {
                this.$nextTick(() => {
                    if (!this.scroll) {
                   this.scroll = new BScroll(this.$refs.listContent, {
                       click: true
                   });
                    } else {
                        this.scroll.refresh();
                    }
                });
            }
            return show;
        }
    },
    components: {
        cartcontrol
    },
    methods: {
        toggleList() {
            if (!this.totalCount) {
                return;
            }
            this.fold = !this.fold;
        },
         empty() {
        this.selectFood.forEach((food) => {
          food.count = 0;
        });
      },
      hideList() {
            this.fold = true;
        },
      pay() {
          if (this.totalPrice < this.minPrice) {
              return;
          }
          window.alert(`支付${this.totalPrice}元`);
      }
    }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import "../../common/stylus/mixin";
  .shopcart
      position fixed
      left 0
      bottom 0
      z-index 50
      width 100%
      height 48px
      .content
          display flex
          background #141d27
          font-size 0
          .content-left
             flex 1
             .logo-wrapper
                 position relative 
                 top -10px
                 display inline-block
                 vertical-align top
                 margin 0 12px
                 padding 6px
                 box-sizing border-box
                 width 56px
                 height 56px
                 border-radius: 50%
                 background: #141d27
                 .logo
                     width 100%
                     height 100%
                     background: #2b343c
                     border-radius 50%
                     text-align center
                     &.highlight
                         background rgb(0,160,220)
                     .icon-shopping_cart
                         color: #80858a
                         font-size 24px
                         line-height 44px
                         &.highlight
                             color #fff
                 .num
                     position absolute
                     top 0
                     right 0
                     height 16px
                     line-height 16px
                     width 24px
                     text-align center
                     border-radius 16px
                     font-size 9px
                     font-weight 700
                     background rgb(240,20,20)
                     color rgb(255,255,255)
                     box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)

             .price
                 display inline-block
                 vertical-align top
                 font-weight 700
                 font-size 16px
                 color rgba(255,255,255,0.4)
                 padding-right 12px
                 margin-top 12px
                 border-sizing border-box 
                 line-height 24px
                 border-right 1px solid rgba(255,255,255,0.1)
                 &.highlight
                     color #fff
             .desc
                 display inline-block
                 vertical-align top
                 font-size 10px
                 color rgba(255,255,255,0.4)
                 line-height 24px
                 padding 12px
          .content-right
              flex 0 0 105px
              width 105px // 存疑
              .pay
                  font-size 12px
                  color rgba(255,255,255,0.4)
                  font-weight 700
                  height 48px
                  line-height 48px
                  background #2b333b
                  text-align center
                  &.enough
                      color #fff
                      background #00b43c
    
      .shopcart-list
          position absolute
          top 0
          left 0
          z-index -1
          width 100%
          transform translate3d(0,-100%,0)
          &.fade-enter-active,&.fold-leave-active
              transition: all 0.5s
          &.fold-enter,&.fold-leave-active
              transform translate3d(0,0,0)
          .list-header
              height 40px
              line-height 40px
              padding 0 18px
              background #f3f5f7
              border-bottom 1px solid rgba(7,17,27,0.1)
              .title
                  float left  //必须浮动，否则因为是块级元素会独占一行，会把右浮动挤下去.前面的浮动后面的不浮动，后面的会跑上去被前面的覆盖。而后面的浮动前面的不浮动则和标准流里一上一下没有区别。
                  font-size 14px
                  font-weight 200
                  color rgb(7,17,27)
              .empty
                  float right
                  font-size 12px
                  color rgb(0,160,220)
          .list-content
              //font-size 0 不是挨着的span不用写
              max-height 217px
              overflow hidden
              background #f3f5f7
              .food
                  box-sizing border-box // 必须加这个，不加的话宽度会比父亲的还大，导致定位出问题
                  position relative
                  padding 12px 18px
                  border-1px(rgba(7,17,27,0.1))
                  .name
                      font-size 14px
                      color rgb(7,17,27)
                      line-height 24px
                  .price
                      position absolute
                      right 90px
                      bottom 12px
                      font-size 14px
                      font-weight 700
                      color rgb(240,20,20)
                      line-height 24px
                  .cartcontrol-wrapper
                      position absolute 
                      right 0px
                      bottom 6px
                      
  .list-mask
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      z-index 40
      opacity 1
      background rgba(7,17,27,0.6)
      filter blur(10px)
      backdrop-filter: blur(10px) // 只有在移动端才有效
      &.fade-enter-active,&.fade-leave-active
         transition all 0.5s
      &.fade-enter,&.fade-leave-active
         opacity 0
         background rgba(7,17,27,0)
         filter blur(0)      

</style>