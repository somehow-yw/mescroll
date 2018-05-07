<template>
<div id="mescroll" class="mescroll">
			<!--展示上拉加载的数据列表-->
			<ul id="dataList" class="data-list">
				<li v-for="(sp, index) in pdlist" :key="index">
          <div class="sp-time">
            <span class="yuan yuan1"><i class="iconfont icon-shijian"></i></span>
            <span>发货时间：{{sp.time}}</span>
          </div>
          <div class="sp-detail">
            <span class="yuan yuan2"><i class="iconfont icon-zhiyuandizhi3"></i></span>
            <div style="padding-top:15px;display:inline-block;margin-right:10px;"><p><span style="margin-right:16px;">{{sp.buyerShopName}}</span><span>{{sp.buyerPhone}}</span></p>
            <p>{{sp.buyerAddress}}</p>
            </div>
            <i @click="call(sp.buyerPhone)" class="iconfont icon-dianhua"></i>
          </div>
          <div class="sp-time">
            <span class="yuan yuan3"><i class="iconfont icon-icon2"></i></span>
            <div class="goods">
                <p v-for="(good, idx) in sp.goods_info" :key="idx">{{good.title}}<span style="float:right">{{good.num}}{{good.unit}}</span>
                </p>
            </div>
            <span>共计{{sp.goods_info.length}}件货品</span>
            <p style="display:inline-block;float:right;margin-right:22px;" v-if="!expand" class="expand" @click="is_expand(index)">收起<i class="iconfont icon-z045 expand2"></i></p>
            <p style="display:inline-block;float:right;margin-right:22px;" v-if="expand" @click="show(index)">货品详情>></p>
            
          </div>
          <div class="sp-time">
            <span class="yuan yuan4"><i class="iconfont icon-qian"></i></span>
            <span>配送奖励金：<span style="color:#ff3333">{{sp.money}}</span><span>（{{sp.status}}）</span></span>
          </div>
				</li>
			</ul>
		</div>
</template>
<script>
import   "./../assets/mescroll.m";
import "./../assets/mescroll.min.css"
console.log('typeof MeScroll :', typeof MeScroll === "function");
export default {
  data () {
    return {
      mescroll: null,
      pdlist: [],
      expand:true,
      data: {}
    }
  },
  mounted() {
    //创建MeScroll对象,down可以不用配置,因为内部已默认开启下拉刷新,重置列表数据为第一页
    //解析: 下拉回调默认调用mescroll.resetUpScroll(); 而resetUpScroll会将page.num=1,再执行up.callback,从而实现刷新列表数据为第一页;
    var self = this;
    self.mescroll = new MeScroll("mescroll", {
      up: {
        callback: self.upCallback, //上拉回调
        //以下参数可删除,不配置
        //page:{size:8}, //可配置每页8条数据,默认10
        toTop: {
          //配置回到顶部按钮
          src: "http://idongpin.oss-cn-qingdao.aliyuncs.com/Public/images/common/toup.png" //默认滚动到1000px显示,可配置offset修改
          //offset : 1000
        },
        empty: {
          //配置列表无任何数据的提示
          warpId: "dataList",
          icon: "http://idongpin.oss-cn-qingdao.aliyuncs.com/Public/images/common/empty.png",
          tip: "<p>尚未完成司机口令发货的订单？</p><p>快把您的口令告诉发货卖家吧～</p>"
        }
      },
      // down: {
        // callback: self.downCallback, //下拉刷新
      // }
    });

    //初始化vue后,显示vue模板布局
    document.getElementById("dataList").style.display = "block";
  },
  methods: {
    upCallback: function(page) {
      console.log('123', page, 'shangla')

      // 联网加载数据
      var self = this;
      this.getListDataFromNet(
        page.num,
        page.size,
        function(curPageData) {
          if (page.num == 1) self.pdlist = [];
          //更新列表数据
          self.pdlist = self.pdlist.concat(curPageData);

          //方法一(推荐): 后台接口有返回列表的总页数 totalPage
          self.mescroll.endByPage(curPageData.length, self.data.total); //必传参数(当前页的数据个数, 总页数)


          self.mescroll.endSuccess(curPageData.length);
        },
        function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        }
      );
    },
    // downCallback () {
    //   console.log('xiala')
    // },
    call (date) {
      if(confirm('是否拨打电话')) {
        window.location.href = 'tel://' + date;
      }
    },
    show (index) {
      var nownode = document.getElementsByClassName('goods')[index];
      nownode.style.display="block";
      this.expand = false;
    },
    is_expand (index) {
      var nownode = document.getElementsByClassName('goods')[index];
      nownode.style.display="none";
      this.expand = true;
    },
     getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
       var vm = this;
       console.log('pagenum', pageNum, 'pagesize', pageSize, successCallback, 'error',errorCallback);
       setTimeout(function () {
         window.req.getLog(vm, {page: pageNum, size: pageSize}, res => {
           if (res.code === 0) {
             var data = res.data.data;
             var obj = {status: '开始运输'}
             for (var item of data) {
              if (item.state === 2) {obj.status = '确认收货'}
              else if (item.state === 3) {obj.status = '确认提成发放'}
              item = Object.assign(item, obj)
             }
             console.log('data', data)
             vm.data = res.data
             successCallback&&successCallback(data)
           }
         })
       }, 100)
		}
  }
}
</script>
<style>
* {
				margin: 0;
				padding: 0;
				-webkit-touch-callout:none;
				-webkit-user-select:none;
				-webkit-tap-highlight-color:transparent;
			}
			body{background-color: #f5f5f5;}
			ul{list-style-type: none}
			a {text-decoration: none;color: #18B4FE;}
			#mescroll{background: #f5f5f5}
			/*vue*/
			[v-cloak] {
			  display: none;
			}
			/*模拟的标题*/
			.header{
				z-index: 9990;
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 44px;
				line-height: 44px;
				text-align: center;
				border-bottom: 1px solid #eee;
				background-color: white;
			}
			.header .btn-left{
				position: absolute;
				top: 0;
				left: 0;
				padding:12px;
				line-height: 22px;
			}
			/*mescroll滚动的区域*/
			.mescroll{
				position: fixed;
				top: 0px;
				bottom: 0;
				height: auto;
			}
			/*展示上拉加载的数据列表*/
			.data-list li{
				position: relative;
        margin-top: 10px;
        background: #fff;
        color: #666;
        font-size: 12px;
			}
			.data-list .pd-img{
				position: absolute;
				left: 18px;
				top: 18px;
				width: 80px;
				height: 80px;
			}
			.data-list .pd-name{
				font-size: 16px;
				line-height: 20px;
				height: 40px;
				overflow: hidden;
			}
			.data-list .pd-price{
				margin-top: 8px;
				color: red;
			}
			.data-list .pd-sold{
				font-size: 12px;
				margin-top: 8px;
				color: gray;
			}
      .empty-icon {width: 160px !important;height: 160px;}
      .goods{display: none; line-height: 30px;padding-right: 10px;}
      .data-list .iconfont {font-size: 21px;color: #fff;}
      .data-list .yuan {width: 30px;height: 30px;border-radius: 30px;display: inline-block;text-align: center;line-height: 30px;margin-right: 11px}
      .data-list .yuan1 {background: #72cbcc;}
      .data-list .yuan2 {background: #5da8e0;position: relative;top: -5px;}
      .data-list .yuan3 {background: #ff6969;}
      .data-list .yuan4 {background: #fe9934;}
      .data-list .sp-time{line-height: 55px; border-bottom: 1px solid #e3d5e9;padding-left: 10px;}
      .data-list li .sp-time{border-top: 1px solid #e3d5e9;}
      .sp-time .expand .expand2 {color: #666;font-size: 12px;}
      .sp-detail {padding-left: 10px;height: 70px;line-height: 22px;border-bottom: 1px solid #e3d5e9;}
      .sp-detail .icon-dianhua {color: #5da8e0;line-height: 70px;float: right;margin-right: 16px;padding-left: 20px;border-left: 1px solid #e3d5e9;}
</style>
