<template>
  <div class="rating-select">
    <div class="rating-type border-1px">
        <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count" >{{ratings.length}}</span></span>
        <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
        <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
      <i class="icon-check_circle"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
   const POSITIVE = 0;
   const NEGATIVE = 1;
   const All = 2;

export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {
        type: Number,
        default: All
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    computed: { // 计算数组长度用的，全部、满意后面的数量
      positive() {
        return this.ratings.filter(function(rating) {
          return rating.rateType === POSITIVE;
        });
        }, // 箭头函数写法
      negative() {
          return this.ratings.filter((rating) => {
            return rating.rateType === NEGATIVE;
          });
      }
    },
    methods: {
      select(type, event) {
        if (!event._constructed) {
         return;
       } // 不需要在这里修改selectType和onlyContent的值，因为当父组件收到子组件发出的事件并且修改了值后也会影响到传给子组件的值
        this.$emit('select', type); // 触发当前实例上的事件。附加参数都会传给监听器回调
      },
      toggleContent(event) {
        if (!event._constructed) {
         return;
       }
        this.$emit('toggle');
      }
    }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import "../../common/stylus/mixin";
    .rating-select
      .rating-type
        padding 18px 0
        margin 0 18px
        border-1px(rgba(7,17,27,0.1))
        font-size 0
        .block
          display inline-block
          vertical-align top
          padding 8px 12px
          border-radius 1px
          margin-right 8px
          font-size 12px
          color rgb(77,85,93)
          line-height 16px
          &.active
            color #fff
          .count 
            font-size 8px
            margin-left 2px 
          &.positive
            background rgba(0,160,220,0.2)
            &.active
              background: rgb(0, 160, 220)
          &.negative
            background rgba(77,85,93,0.2)
            &.active
              background rgb(77,85,93)
      .switch
        padding 12px 18px
        border-bottom 1px solid rgba(7,17,27,0.1)
        font-size 0
        &.on
          .icon-check_circle
            color:#00c850
        .icon-check_circle
          font-size 24px
          color rgb(147,153,159)
          line-height 24px
          margin-right 4px
        .text 
          font-size 12px
          color rgb(146,153,159)
          line-height 24px
          vertical-align top
</style>