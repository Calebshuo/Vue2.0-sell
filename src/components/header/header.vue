<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img width="64" height="64" :src="seller.avatar">
                <!--6-3 4:00/因为是异步的，一开始不会先加载进来-->
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div v-if="seller.supports" class="support">
                    <!--这个层可能没有所以加if（可能店铺没有优惠信息-->
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div v-if="seller.supports" class="support-count" @click="showDetail">
                <span class="count">{{seller.supports.length}}个</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div>
        <div class="bulletin-wrapper" @click="showDetail">
            <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
            <i class="icon-keyboard_arrow_right"></i>
        </div>
        <!--让两个span紧挨着也可以消除之间的空白间隙，和令父元素的fontsize等于0的效果一样-->
        <div class="background">
            <img :src="seller.avatar" width="100%" height="100%">
        </div>
        <transition name="fade">
        <div v-show="detailShow" class="detail">
            <div class="detail-wrapper clearfix">
                <div class="detail-main">
                    <h1 class="name">{{seller.name}}</h1>
                    <div class="star-wrapper">
                        <star :size="48" :score="seller.score"></star>
                        <!--v-bind v-for 引号里面的都会被转成js表达式，所以如果想要穿入字符串类型的48,需要写成""48""-->
                    </div>
                    <div class="title">
                        <div class="line"></div>
                        <div class="text">优惠信息</div>
                        <div class="line"></div>
                    </div>
                    <ul v-if="seller.supports" class="supports">
                        <li class="support-item" v-for="(item,index) in seller.supports" :key="index">
                            <span class="icon" :class="classMap[item.type]"></span>
                            <span class="text">{{item.description}}</span>
                        </li>
                    </ul>
                    <div class="title">
                        <div class="line"></div>
                        <div class="text">商家公告</div>
                        <div class="line"></div>
                    </div>
                    <div class="bulletin">
                        <p class="content">{{seller.bulletin}}</p>
                    </div>
                </div>
            </div>
            <div class="detail-close" @click="hideDetail">
                <i class="icon-close"></i>
            </div>
        </div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    import star from 'components/star/star'; // 这里的star就是star文件exportdefault出来的那个对象
    export default {
        props: {
            seller: {
                type: Object // 为什么要写这个？？
            }
        },
        data() {
            return {
                detailShow: false
            };
        },
        methods: {
            showDetail() {
                this.detailShow = true;
            },
            hideDetail() {
                this.detailShow = false;
            }
        },
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        },
        components: {
            star
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin";   
.header
  position relative
  overflow hidden 
  color #fff
  background rgba(7,17,27,0.5)
  .content-wrapper
    position relative
    padding 24px 12px 18px 24px
    font-size 0
    .avatar
      display inline-block // 为什么不能用浮动？
      vertical-align top
      img
        border-radius 2px
    .content
      display inline-block
      margin-left 16px
      .title
        margin 2px 0 8px 0
        .brand
          display inline-block
          vertical-align top
          width 30px  
          height 18px
          bg-image ('brand')
          background-size 30px 18px
          background-repeat no-repeat
        .name
          margin-left 6px
          font-size 16px
          font-weight bold
          line-height 18px
      .description
        font-size 12px
        margin-bottom 10px
        line-height 12px
      .support
       .icon
        display inline-block
        vertical-align top
        width 12px
        height 12px
        margin-right 4px
        background-size 12px 12px
        background-repeat no-repeat
        &.decrease
         bg-image("decrease_1")
        &.discount
         bg-image("discount_1")
        &.special
         bg-image("special_1")
        &.invoice
         bg-image("invoice_1")
        &.guarantee
         bg-image("guarantee_1")
       .text   // 没有图片的span可以不用转换成inline-block，因为不用设置宽高
        font-size 10px
        line-height 12px
    
    .support-count
     position absolute
     bottom 14px
     right 12px 
     height 24px
     padding 0 8px
     background rgba(0,0,0,0.2)
     border-radius 14px
     text-align center
     line-height 24px
     .count
      vertical-align: top
      font-size 10px
      margin-right 2px
     .icon-keyboard_arrow_right
      font-size 10px
      line-height 24px  // 因为字体的类里面把line-height设为了１，所以要重新设置一遍
  .bulletin-wrapper
      position relative
      height 28px
      line-height 28px
      padding 0 22px 0 12px
      background-color rgba(7,17,27,0.2)
      text-overflow ellipsis  // 修剪文本
      white-space nowrap // 不换行
      overflow: hidden
      // 如果设置了font-size 0　那么text-overflow ellipsis就失效了，所以要让两个span紧挨着来消除空白
      .bulletin-title
          display inline-block
          width 22px
          height 12px
          background-size 22px 12px
          background-repeat no-repeat
          bg-image("bulletin")
          vertical-align top
          margin-top 8px
      .bulletin-text
          margin 0 4px
          font-size 10px
          vertical-align top
      .icon-keyboard_arrow_right
          font-size 10px
          position absolute
          right 12px
          top 8px

  .background
      position absolute 
      top: 0
      left: 0
      width: 100%
      height: 100%  // 因为父元素overflow hidden所以超不出去
      z-index: -1  // z-index 属性设置元素的堆叠顺序，Z-index 仅能在定位元素上奏效
      filter: blur(10px)  // 设置模糊效果，值越大越模糊
  .detail
    position fixed
    top 0
    left 0
    overflow auto
    width 100%
    height 100% 
    backdrop-filter: blur(10px)  //　背景模糊，只有在ios上才能看的到
    background rgba(7,17,27,0.8)
    opacity 1 // opacity会继承父元素的 opacity 属性，而RGBA设置的元素的后代元素不会继承不透明属性。rgba控制的是背景，而opacity控制的是.detail里面的子元素
    z-index 100
    &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s
    &.fade-enter, &.fade-leave-active
        background: rgba(7, 17, 27, 0)
        opacity 0
    .detail-wrapper
        width 100%
        min-height 100%
        .detail-main
            margin-top 64px
            padding-bottom 64px // padding必须要有，是布局的套路，大小是最下面容器所占空间
            .name
                font-size 16px
                line-height 16px
                text-align center
                font-weight 700
            .star-wrapper
                margin-top 16px
                text-align center
            .title
                display flex
                margin 28px 36px 24px 36px
                .line
                    border-bottom 1px solid rgba(255,255,255,0.2)
                    flex 1
                    position relative
                    top -6px
                .text
                    padding 0 12px
                    font-weight 700
                    font-size 14px
            .supports
                width 80%
                margin 0 auto
                .support-item
                    padding 0 12px
                    margin-bottom 12px
                    font-size 0
                    &.lastchild
                        margin-bottom 0
                    .icon
                        display:inline-block
                        width 16px
                        height 16px
                        margin-right 6px
                        vertical-align: top
                        background-size 16px 16px
                        background-repeat no-repeat
                        &.decrease
                            bg-image("decrease_2")
                        &.discount
                            bg-image("discount_2")
                        &.special
                            bg-image("special_2")
                        &.invoice
                            bg-image("invoice_2")
                        &.guarantee
                            bg-image("guarantee_2")
                    .text
                        line-height 16px
                        font-size 12px
              .bulletin
                  width 80%
                  margin 0 auto 
                  .content
                      padding 0 12px
                      font-size 12px
                      line-height 24px                  
      .detail-close
          position relative
          width 32px
          height 32px
          margin -64px auto 0 auto   // 套路
          clear both   // 套路
          font-size 32px
          color rgba(255,255,255,0.5)


</style>
