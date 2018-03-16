<template>
<div>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)" ref="menuList"> <!--7-8，v-bind/@click/ref的等于号后面的引号里要用camelCase命名法-->
           <span class="text border-1px">
             <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
           </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="food-list" ref="foodList" :key="index">
          <h1 class="title">{{item.name}}</h1>
          <ul>
           <li @click="selectFoods(food,$event)" v-for="(food,index) in item.foods" class="food-item border-1px" :key="index"> <!--有需要传参的时候需要加上类名-->
             <div class="icon">
               <img :src=food.icon width="57" height="57">
             </div>
             <div class="content">
               <h2 class="name">{{food.name}}</h2>
               <p class="desc">{{food.description}}</p>
               <div class="extra">
                 <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
               </div>
               <div class="price">
                 <span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
               </div>
               <div class="cartcontrol-wrapper">
                 <cartcontrol :food="food"></cartcontrol>
               </div>
             </div>
           </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :select-food="selectFood" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
 </div> <!--v-ref绑定子组件后，父组件可以调用子组件的方法-->
  <food :food="selectedFoods" ref="food"></food>
</div>
</template>

<script type='text/ecmascript-6'>
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';

  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object  // 值是如何传进来的？
      }
    },
    data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFoods: {}
    };
  },
  computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) { // scrollY是foods-wrapper最上方的距离
            this._followScroll(i);
            return i;
          }
        }
        return 0;
      },
      selectFood() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
  created() {
    this.$http.get('api/goods').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.goods = response.data;
        this.$nextTick(() => {  // Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新，$nextTick是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用$nextTick，则可以在回调中获取更新后的 DOM
            this._initScroll(); // 初始化滚动条
            this._calculateHeight();
          });
      }
    });
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
   },
   methods: {
     selectMenu(index, event) {
       if (!event._constructed) { // 阻止浏览器端原生点击（防止点击两次，当我们自己派发的点击事件产生时这个值event._constructed为true）
         return; // 终止方法继续执行
       }
       let foodList = this.$refs.foodList;
       let el = foodList[index];
       this.foodsScroll.scrollToElement(el, 300);
     },
     _initScroll() {
       this.menuScroll = new BScroll(this.$refs.menuWrapper, {
         click: true
       });  // 不用声明，这只是往组件实例上挂属性，如果不需要观测这个变量的变化，是不需要在 data 里申明的，data 里的数据都是添加了 getter 和 setter
       this.foodsScroll = new BScroll(this.$refs.foodsWrapper, { click: true, probeType: 3 }); // 传入的probeType: 3表示在滚动时能够实时告诉滚动的位置
       this.foodsScroll.on('scroll', (pos) => { // 被监听的事件是scroll，pos是位置// (老师写)判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
         if (pos.y <= 0) {
            this.scrollY = Math.abs(Math.round(pos.y));
          } // 内层先取整，外层再取绝对值
       });
     },
     _calculateHeight() {
       let foodList = this.$refs.foodList;
       let height = 0;
       this.listHeight.push(height);
       for (let i = 0; i < foodList.length; i++) {
         let item = foodList[i];
         height += item.clientHeight; // 计算元素所占视口大小
         this.listHeight.push(height);
       }
     },
     selectFoods(food, event) {
       if (!event._constructed) {  // 阻止浏览器原生点击
          return;
        }
        this.selectedFoods = food;
        this.$refs.food.show();
     },
     _followScroll(index) {
        let menuList = this.$refs.menuList;
        let el = menuList[index];
        this.menuScroll.scrollToElement(el, 300);
      }
   },
   components: {
     shopcart,
     cartcontrol,
     food
   }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import "~common/stylus/mixin"; // ~ 是 stylus-loader 到东东 ,~common 表示相对 common，然后我们在 webpack 配置了 common 的 alias，就能找到了它的路径了

  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px  // 存疑？
      width 80px // 保证安卓浏览器的兼容性
      background-color #f3f5f7
      .menu-item  // 检索类名比标签效率高
        display table // 实现多行文字垂直居中对齐
        height 54px
        width 56px
        padding 0 12px
        &.current
         font-weight 700
         position relative //这三句代码是为了遮住上面一块的线
         z-index 10
         margin-top -1px
         background #fff
         .text
          border-none()
        .icon
         display inline-block
         vertical-align top
         width 12px
         height 12px
         margin-right 2px
         background-size 12px 12px // 第一个值宽度第二个高度
         background-repeat no-repeat
         &.decrease
          bg-image("decrease_3")
         &.discount
          bg-image("discount_3")
         &.special
          bg-image("special_3")
         &.invoice
          bg-image("invoice_3")
         &.guarantee
          bg-image("guarantee_3")
        .text // 在html里text包着icon
           display table-cell
           width 56px
           vertical-align middle
           border-1px(rgba(7,17,27,0.1))
           line-height 14px
           font-size 12px
            
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        font-size 12px
        color rgb(147,153,159)
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        background #f3f5f7
      .food-item
        display flex
        margin 18px
        border-1px(rgba(7,17,27,0.1))
        padding-bottom 18px
        &:last-child // 表示最后一个.food-item
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 8px 0
            font-size 14px
            color rgb(7,17,27)
            line-height 14px
            height 14px
          .desc,.extra
            font-size 10px
            color rgb(147,153,159)
            line-height 10px
          .desc
            line-height 12px
            margin-bottom 10px
          .extra
            .count  
              margin-right 12px
          .price
            font-weight 700px
            line-height 24px
            .now
              margin-right 8px
              font-size 14px
              color rgb(240,20,20)
            .old
              font-size 10px
              color rgb(147,153,159)
              text-decoration line-through
          .cartcontrol-wrapper
            position absolute  // 父亲没有相对定位，存疑？相对于food-item定位了，因为它有border-1px给它加上了相对定位（绝对定位会占据padding的空间不会占据border和margin的）
            right 0
            bottom 0

            
</style>