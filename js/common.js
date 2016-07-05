document.addEventListener("touchmove",function(e){e.preventDefault()},false);
var ls=window.localStorage;
function Common(){

}

Common.prototype={
      // get请求:url,data是参数,callback是成功之后执行的回调,async同步还是异步
   access_server:function(url,data,callback,asy){
       var _this=this;
       // 显示加载动画
       this.showLoading();
       // 判断用户是否设置了async，如果设置了用async，否则用true
       var async=typeof(asy)==="undefined"?true:asy;
       // ajax 请求
       $.ajax({
          url:url,
          type:"get",
          dataType:"json",
          data:data,
          async:async,
          success:function(data){
             // 删除加载动画
             setTimeout(function(){
                _this.hideLoading();
                callback && callback(data);
             },1000)
          },
          error:function(){
            _this.hideLoading();
            // 显示弹出层
             _this.showDialog('请求失败，请刷新/重试','确定');
          }
       })
   },       
   // 显示加载动画
   showLoading:function(){
       this.showMark();
       // 创建加载动画
       if($("#ui-id-loading").length==0){
          $('<div class="ui-id-loading" id="ui-id-loading"><img src="../img/loading.gif"></div>').appendTo($("body"));
       }
   },
   // 隐藏加载动画
   hideLoading:function(){
       this.hideMark();
       $("#ui-id-loading").remove();
   },
   // 显示遮罩层
   showMark:function(){
       if($("#ui-id-mark").length==0){
          $('<div class="ui-id-mark" id="ui-id-mark"></div>').appendTo($("body"));
       }
   },
   // 隐藏遮罩层
   hideMark:function(){
       if($("#ui-id-mark").length>0){
          $('#ui-id-mark').remove();
       }
   },
   // 显示弹出层
   showDialog:function(msg,btn,callback){
       var _this=this;
       this.showMark();
       // 创建弹出框
       if($("#ui-id-dialog").length==0){
          var html='<div class="ui-id-dialog" id="ui-id-dialog">'
                       +'<div class="tipcontainer">'
                           +'<div class="content">'+msg+'</div>'
                           +'<p><a href="javascript:void(0)" id="ui-id-btn">'+btn+'</a></p>'
                       +'</div>'
                   +'</div>';
          $(html).appendTo($("body"));
       }
       $("#ui-id-btn").on("click",function(){
           _this.hideMark();
           $("#ui-id-dialog").remove();
           callback && callback();
       })
   },
   // 检测手机号码
   checkPhone:function(phone){
      var reg=/^1[34578]\d{9}$/;
      if(reg.test(phone)){
         return true;
      }
      return false;
   },
   // 检测密码
   checkPwd:function(pwd){
      var reg=/^[\w\.]{6,12}$/;
      if(reg.test(pwd)){
         return true;
      }
      return false;
   },
   // 身份证号码
   checkCard:function(card){
      var reg=/^\d{17}(\d|X)$/;
      if(reg.test(card)){
          return true;
      }
      return false;
   }
}
var common=new Common();

// 解析地址栏中的参数
function getParam(){
   var url=location.search.substr(1);
   var obj={};
   if(!url)return false;
   var arr=url.split("&");
   for(var i=0,len=arr.length;i<len;i++){
      var params=arr[i].split("=");
      obj[params[0]]=decodeURI(params[1]);
   }
   return obj;
}

function addZero(num){
   if(num<10){
      return '0'+num;
   }else{
      return num;
   }
}

// 获取日期,某一个日期之后的i天
function getDateFormat(i,option){
   i=i?i*86400000:0;
   // 创建一个当前的日期事件对象
   var today=option?new Date(option.year,option.month-1,option.day):new Date(),
       tempDate=new Date();
   tempDate.setTime(today.getTime()+i);
   return tempDate.getFullYear()+'-'+addZero(tempDate.getMonth()+1)+'-'+addZero(tempDate.getDate());
}

// 调用日历组件
/*
    ele:在哪个元素上调用
    minDate:起始日期
    maxDate:结束日期
*/
function callCalendar(ele,minDate,maxDate,pageType){
   // 调用calendar组件
   ele.calendar({
       minDate:minDate,
       maxDate:maxDate,
       swipeable:true,   // 是否启用滑动
       hide:function(){  // 日历隐藏之后需要执行的回调函数
          if(pageType){
             changeDateOut(pageType);
          }else{
             changeDateOut();
          }
       }
   }).calendar("show");

   $('.shadow').remove();
   $('.ui-slideup-wrap').addClass('calenderbox');
   var shadow=$('<span class="shadow"></span>');
   $('.calenderbox').append(shadow);
   $('.ui-slideup').addClass('calender');
}

// 将字符串转换为数值
function strToNum(str){
    // 将2016-05-20这样的字符串转换为20160520
    return str.replace(/-/g,"");
}

// 将字符串的日期转换为数组
function strToArr(str){
   return str.split("-");
}

// 获取日期格式中的月和日
function getMonthDay(str){
   var arr=str.split("-");
   return arr[1]+'月'+arr[2]+'日';
}

// 日历隐藏之后修改离店日期
function changeDateOut(action){
    var dateIn=$("#date_in").val(),
        newDateOut=dateOut=$("#date_out").val(),
        dateInNum=strToNum(dateIn),
        dateOutNum=strToNum(dateOut),
        dateInArr=strToArr(dateIn);
    // 如果入住日大于等于离店日,离店日自动改为入住日的下一天
    if(dateInNum>=dateOutNum){
        newDateOut=getDateFormat(1,{year:dateInArr[0],month:dateInArr[1],day:dateInArr[2]});
    }
    $("#date_out").val(newDateOut);
    // 如果action为真，说明它不是首页
    if(action){
       $("#inText").text(getMonthDay(dateIn));
       $("#outText").text(getMonthDay(newDateOut));
       // 如果action是list,ajax请求的是列表页,否则请求的是内容页
       if(action=="list"){
          POST.dateIn=dateIn;
          POST.dateOut=newDateOut;
          POST.pageNo=1;
          getDataFromHotel();
       }/*else{

       }*/
    }
}

// 列表页和内容页的修改日期
function editCalendar(){
   var today=new Date(),
       beginDate=new Date(today.getFullYear(),today.getMonth(),today.getDate()),
       maxDate=new Date(today.getFullYear(),today.getMonth(),today.getDate()+90);
   $("#modify").on("click",function(){
       callCalendar($("#date_in"),beginDate,maxDate,$(this).data("type"));
   })
}

// 判断用户是否登陆了
function ifLogined(url){
   common.access_server("../server/check.php",{},function(data){
      if(data.if_logined==0){
         location.href='login.html';
         ls.setItem("orderUrl",url);
      }else{
         // 登陆状态
         location.href=url;
      }
   })
}