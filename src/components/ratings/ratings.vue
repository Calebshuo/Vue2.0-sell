<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star class="star" :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :select-type="selectType" :only-content="onlyContent" :ratings="ratings" @select="selectRating" @toggle="toggleContent"></ratingselect> <!-- @是v-on的缩写，相当于监听了这个事件 -->
      <div class="rating-wrapper">
        <ul>
          <li class="rating-item border-1px" v-for="(rating,index) in ratings" :key="index" v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" style="width:28px;height:28px"><!-- 和width="28" height="28"效果一样 -->
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score" class="star"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="(item,index) in rating.recommend" :key="index">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import BScroll from 'better-scroll';
import star from 'components/star/star';
import split from 'components/split/split';
import ratingselect from 'components/ratingselect/ratingselect';
import {formatDate} from 'common/js/date';

const All = 2;
const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
            ratings: [],
            selectType: All,
            onlyContent: true
        };
    },
    created () {
      this.$http.get('api/ratings').then((response) => {
          response = response.body;
          if (response.errno === ERR_OK) {
          this.ratings = response.data;
          this.$nextTick(() => {
                   this.scroll = new BScroll(this.$refs.ratings, {
                       click: true
                   });
                });
          }
      });
    },
    components: {
      star,
      split,
      ratingselect
    },
    methods: {
      needShow(type, text) {
            if (this.onlyContent && !text) {
                return false;
            }
            if (this.selectType === All) {
                return true;
            } else {
                return this.selectType === type;
            }
        },
        selectRating(type) {
            this.selectType = type;
            this.$nextTick(() => {
                this.scroll.refresh(); // dom更新是异步的，所以不能直接刷新scroll，需要等dom更新之后再刷新滚动条。
            });
        },
        toggleContent() {
            this.onlyContent = !this.onlyContent;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import "../../common/stylus/mixin";
  .ratings
    position fixed
    top 174px
    bottom 0  // 固定了父容器的高度，使得子容器高度可以超过父容器从而实现滚动
    left 0
    width 100%
    overflow hidden
    .overview
      padding 18px 0
      display flex
      .overview-left
        flex 0 0 137
        padding 6px 0
        width 137px
        border-right 1px solid rgba(7,17,27,0.1)
        text-align center
        @media only screen and (max-width: 320px)//只有在屏幕尺寸小于320像素的时候才会应用下面的样式
          flex: 0 0 120px
          width: 120px
        .score
          font-size 24px
          color rgb(255,153,0)
          line-height 28px
          margin-bottom 6px
        .title
          font-size 12px
          color rgb(7,17,27)
          line-height 12px
          margin-bottom 8px
        .rank
          font-size 10px
          color rgb(147,153,159)
          line-height 10px
      .overview-right
        flex 1
        padding 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom 8px
          font-size 0
          .title
            font-size 12px
            color rgb(7,17,27)
            line-height 18px
            margin-right 12px
            vertical-align top
          .star
            display inline-block
          .score
            color rgb(255,153,0)
            line-height 18px
            font-size 12px
            margin-left 12px
            vertical-align top
        .delivery-wrapper
          line-height 18px
          font-size 0
          .title
            font-size 12px
            color rgb(7,17,27)
            margin-right 12px
          .delivery
            font-size 12px
            color rgb(147,153,159)
    .rating-wrapper
      padding 0 18px
      .rating-item
        display flex //这样的布局，可以让avatar独占左边的位置而不用使用定位
        padding 18px 0
        border-1px(rgba(7,17,27,0.1))
        .avatar
          flex 0 0 28px
          margin-right 12px
          img 
            border-radius 50%
        .content
          position relative
          flex 1
          .name
            font-size 10px
            color rgb(7,17,27)
            line-height 12px
            margin-bottom 4px
          .star-wrapper
            margin-bottom 6px
            font-size 0
            .star
              display inline-block
              margin-right 6px
            .delivery
              font-size 10px
              font-weight 200
              color rgb(147,153,159)
              line-height 12px
          .text
            font-size 12px
            color rgb(7,17,27)
            line-height 18px
            margin-bottom 8px
          .recommend
            line-height 16px
            font-size 0
            .icon-thumb_up,.item
              display inline-block
              margin 0 8px 4px 0 //行内元素不能设置下margin和padding，而且行内元素会换行（其中一段文字会一半在上一半在下，很难看）
              font-size 9px
            .icon-thumb_up
              color rgb(0,160,220)            
            .item
              padding 0 6px
              background-color rgb(255,255,255)
              border 1px solid rgba(7,17,27,0.1)
              border-radius 1px
              color rgb(147,153,159)
          .time
            position absolute 
            top 0
            right 0
            font-size 10px
            font-weight 100
            color rgb(147,153,159)
            line-height 12px
</style>