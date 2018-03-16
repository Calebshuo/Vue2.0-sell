<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score" class="star"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content"> <!-- 为什么要再多套个div。因为后面的元和20字体不同 -->
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content"> 
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content"> 
              <span class="stress">{{seller.deliveryTime}}</span>元
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item border-1px" v-for="(item,index) in seller.supports" :key="index">
            <span class="icon" :class="classMap[item.type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper"><!-- 为了能横向滚动，所以要加这个wrapper -->
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic,index) in seller.pics" :key="index">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item border-1px" v-for="(info,index) in seller.infos" :key="index">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import star from 'components/star/star';
import split from 'components/split/split';
import BScroll from 'better-scroll';
import {saveToLocal, loadFromLocal} from 'common/js/store';
  export default {
    props: {
      seller: {
          type: Object
      }
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    created() {
          this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        },
    watch: {  // 用于在seller页面刷新而初始化滚动条。如果是在其他页面刷新的话，seller就会先加载，就不会触发watch的回调了
      'seller'() {
        this.$nextTick(() => {
          this._initScroll();
          this._initPics();
        });
      }
    },
    mounted() { // 用于在其他页面加载而初始化滚动条
      this.$nextTick(() => {
        this._initScroll();
        this._initPics();
      });
    },

    // },当view-router组件有了keep-alive属性后，就不会反复执行created生命周期函数了，mounted和watch不会被反复的执行
    methods: {
      toggleFavorite(event) {
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      },
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });
        } else {
          this.scroll.refresh(); // 这句话如果在seller页面刷新就有用，因为刚开始seller没有加载进来mounted的滚动条初始不正确，随后watch函数会调用refresh方法重新计算高度。
        }
      },
      _initPics() {
        if (this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          this.$refs.picList.style.width = width + 'px';// 宽度不能被内容撑开所以手动设置宽度。（padding可以让子元素的宽度大于父元素。）
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picWrapper, {
                scrollX: true, // 说明是横向滚动
                eventPassthrough: 'vertical' // eventPassthrough 是为了忽略某一方向的滚动处理。不写也可
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      }
    },
    components: {
      star,
      split
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import "../../common/stylus/mixin";
  .seller
    position fixed
    top 174px
    bottom 0  // 固定了父容器的高度，使得子容器高度可以超过父容器从而实现滚动
    left 0
    width 100%
    overflow hidden
    .seller-content
      .overview
        position relative
        padding 18px
        .title
          margin-bottom 8px
          font-size 14px
          color rgb(7,17,27)
          line-height 14px
        .desc
          padding-bottom 18px
          height 18px
          line-height 18px
          border-1px(rgba(7,17,27,0.1))
          font-size 0
          .star
            display inline-block
            margin-right 8px
          .text
            vertical-align top
            margin-right 12px
            font-size 10px
            color rgb(77,85,93)
        .remark
          display flex
          margin-top 18px
          .block
            flex 1
            border-right 1px solid rgba(7,17,27,0.1)
            text-align center
            &:last-child // 注意写法
              border: none //注意和border-none（）作区分，一个是取消普通写法，一个是取消函数写法
            h2
              font-size 10px
              color rgb(147,153,159)
              line-height 10px
            .content
              margin-top 4px
              font-size 10px
              color rgb(7,17,27)
              line-height 24px
              .stress
                font-size 24px
        .favorite
          position absolute
          top 17px
          right 11px
          width 50px
          text-align center 
          .icon-favorite
            display block
            margin-bottom: 4px
            font-size 24px
            line-height 24px
            color: #d4d6d9
            &.active
              color rgb(240,20,20)
          .text
            font-size 10px
            color rgb(77,85,93)
            line-height 10px
      .bulletin
        padding 18px 18px 0 18px
        .title
          font-size 14px
          line-height 14px
          color rgb(7,17,27)
        .content-wrapper
          padding 8px 12px 16px 12px
          border-1px(rgba(7,17,27,0.1))
          .content
            font-size 12px
            font-weight 200
            color rgb(240,20,20)
            line-height 24px
        .supports
          .support-item
            padding 16px 12px
            border-1px(rgba(7,17,27,0.1))
            font-size 0
            &:last-child // 注意写法
              border-none() 
            .icon
              display inline-block
              vertical-align top
              width 16px
              height 16px
              margin-right 6px
              background-size 16px 16px
              background-repeat no-repeat
              &.decrease
                bg-image('decrease_4')
              &.discount
                bg-image('discount_4')
              &.guarantee
                bg-image('guarantee_4')
              &.invoice
                bg-image('invoice_4')
              &.special
                bg-image('special_4')
            .text
              font-size 12px
              font-weight 200
              color rgb(7,17,27)
              line-height 16px
      .pics
        padding 18px
        .title
          margin-bottom 12px
          font-size 14px
          color rgb(7,17,27)
          line-height 14px
        .pic-wrapper // 为了能横向滚动，所以要加这个wrapper
          width 100%
          overflow hidden
          white-space nowrap // 不换行
          .pic-list
            font-size 0
            .pic-item
              display inline-block
              margin-right 6px
              width 120px
              height 90px
              &:last-child
                margin 0
      .info
        padding 18px 18px 0 18px
        .title
          padding-bottom 12px
          font-size 14px
          color rgb(7,17,27)
          line-height 14px
          border-1px(rgba(7,17,27,0.1))
        .info-item
          padding 16px 12px 16px 12px
          font-size 12px
          font-weight 200
          color rgb(7,17,27)
          line-height 16px
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()
</style>