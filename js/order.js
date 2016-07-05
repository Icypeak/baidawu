var roomIsc=new iScroll("orderbox",{
    onBeforeScrollStart:function(e){
       var ele=e.target.tagName.toLowerCase();
       if(ele!="input" && ele!="select" && ele!="textarea"){
          e.preventDefault();
       }
    }
}),
    param=getParam(),
    cityId=param.city_id,
    dateIn=param.date_in,
    dateOut=param.date_out,
    hotelName=param.hotel_name,
    roomType=param.room_type,
    roomId=param.room_id,
    price=param.price;

// 显示入住和离店日期
$("#inText").text(getMonthDay(dateIn));
$("#outText").text(getMonthDay(dateOut));
$("#date_in").val(dateIn);
$("#date_out").val(dateOut);

function init(){
   $("#hotel_name").text(hotelName);
   $("#type_name").text(roomType);
   $("#book_price").text();
   bindEvent();
   changeTotal(1);
}

function bindEvent(){
   // 点击添加
   $("#add").on("click",function(){
       if($(this).hasClass("no")){
           common.showDialog("您最多只能预订5间","关闭");
           return;
       }
       var count=parseInt($("#roomcount").val());
       count=count>=5?5:(count+1);
       if(count>=5) $(this).addClass("no");
       $("#sub").removeClass("no");
       $("#roomcount").val(count);
       changeTotal(count);
       appendNode(count);
   })
   // 点击添加
   $("#sub").on("click",function(){
       if($(this).hasClass("no")){
           common.showDialog("您不能取消预订","关闭");
           return;
       }
       var count=parseInt($("#roomcount").val());
       count=count<=1?1:(count-1);
       if(count<=1) $(this).addClass("no");
       $("#add").removeClass("no");
       $("#roomcount").val(count);
       changeTotal(count);
       removeNode(count+1);
   })
   // 点击立即预定
   $("#booknow").on("click",function(){
       if(!checkInput())return;
       var url="orderSubmit.html";
       location.href=url;
   });
}

// 改变总价格
function changeTotal(num){
   var totalPrice=num*price;
   $("#tprice").text(totalPrice);
   $("#rprice").val(totalPrice);
}

// 添加入住人信息
function appendNode(i){
   var html='<div class="userInfo" id="info'+i+'">'
                +'<ul class="infos">'
                    +'<li><i>姓名'+i+'</i><input type="text" placeholder="没间只需填写一个姓名" id="userName'+i+'" name="userName'+i+'"><span class="clear_input">x</span></li>'
                +'</ul>'
                +'<ul class="infos">'
                    +'<li><i>证件'+i+'</i><input type="text" placeholder="入住人身份证好/证件号" id="idcard'+i+'" name="idcard'+i+'"><span class="clear_input">x</span></li>'
                +'</ul>'
             +'</div>';
   $(html).appendTo($("#info"));
   roomIsc.refresh();
   $("#userName"+i).showClear();
   $("#idcard"+i).showClear();
   $(".clear_input").clearInput();
}

// 删除入住人信息
function removeNode(i){
   $("#info"+i).remove();
   roomIsc.refresh();
}

// 立即预定
function checkInput(){
    var $inputs=$("#info-boxs").find("input[type=text]");
    var i,size=$inputs.size();
    for(i=0;i<size;i++){
       var $input=$inputs.eq(i);
       var v=$input.val();
       if(!v){
          common.showDialog("入住信息填写不完整","确定",function(){
              $input.focus();
          });
          return false;
       }else{
          if(i%2!=0 && $input.attr("id")!="phone"){
              if(!common.checkCard(v)){
                  common.showDialog("请输入有有效的证件号码","确定",function(){
                      $input.focus();
                  });
              }
          }
          if($input.attr("id")=="phone"){
             if(!common.checkPhone(v)){
                 common.showDialog("请输入有有效的手机号码","确定",function(){
                     $input.focus();
                 });
             }
          }
       }
    }
    return true;
}

init();

// 封装一个插件
(function($){
   $.fn.showClear=function(){
      $(this).on("input propertychange",function(){
         var $span=$(this).next();
         if($(this).val()!=""){
             $span.css("display","block");
         }else{
             $span.css("display","none");
         }
      })
   }
   $.fn.clearInput=function(){
      $(this).on("click",function(){
          $(this).prev().val("");
          $(this).css("display","none");
      })
   }
})(Zepto)

$("#info-boxs").find("input[type=text]").each(function(){
    $(this).showClear();
})

$("#info-boxs").find("span.clear_input").each(function(){
    $(this).clearInput();
})

