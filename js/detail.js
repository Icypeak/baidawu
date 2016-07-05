// 解析地址栏中的参数
var isc=new iScroll("section"),
    params=getParam(),
    dateIn=params.date_in,
    dateOut=params.date_out,
    cityId=params.city_id,
    hotelId=params.hotel_id,
    hotelName=params.hotel_name,
    pageSize=10,  // 每页显示的记录数
    pageNo=1,    // 页数
    stars=["","","二星/经济型","三星","四星","五星"],  
    // 传给服务器端的参数列表
    POST={
       cityId:cityId,
       dateIn:dateIn,
       dateOut:dateOut,
       hotelId:hotelId,
       hotelName:hotelName,
       pageNo:pageNo,
       pageSize:pageSize
    };

// 显示入住和离店日期
$("#inText").text(getMonthDay(dateIn));
$("#outText").text(getMonthDay(dateOut));
$("#date_in").val(dateIn);
$("#date_out").val(dateOut);

function getDataFromDetail(){
   common.access_server("../server/hotelDetail.json",POST,function(data){
       renderDetailList(data.result);
   })
}

function renderDetailList(data){
   var img=data.images.split(";")[0],
       $li=$("#hotel_info_list").children();
   $("#hotel_img").children("img").attr("src","../"+img);
   $("#hotel_name").text(data.name);
   $li.eq(0).text("星级："+stars[data.star]+'级酒店');
   $li.eq(1).text("电话："+data.tel.replace(/,/g," "));
   $li.eq(2).text("地址："+data.addr);
   $("#description").text(data.desc);
   $("#sheshi").text(data.facilities);
   renderRoomList(data);
}

getDataFromDetail();

// 渲染房间信息
function renderRoomList(data,action){
   var $list=$("#detail_list"),
       roomData=data.room_types,
       html='',
       i,len=roomData.length,
       obj,
       img=data.images.split(";")[0];   
   for(i=0;i<len;i++){
      obj=roomData[i];
      $.each(obj.goods,function(k,room){
          var btn="";
          var price=(Math.min.apply(null,room.price))/100;
          if(room.room_state==0){
             btn='<span class="disabled">客 满</span>';
          }else{
             btn='<span data-img="../'+img+'" data-type="'+obj.name+'" data-price="'+price+'" data-bed="'+obj.bed_type+'" data-id="'+room.room_id+'">预定</span>';
          }
          html+='<div class="room-box">'
                   +'<dl>'
                       +'<dt>'+obj.name+'</dt>'
                       +'<dd><span>'+obj.bed_type+'</span><span>免费早餐</span></dd>'
                   +'</dl>'
                   +'<p>￥<em>'+price+'起</em></p>'
                   +'<div>'+btn+'</div>'
                +'</div>';
      })
   }
   if(typeof(action)==="undefined"){
      $list.html("");
   }
   $(html).appendTo($list);
   isc.refresh();
}

function bindEvent(){
   $(".base_info").on("click","li",function(){
       var index=$(this).index();
       var childs=$(".content_wrap").children();
       $(this).addClass("on").siblings().removeClass("on");
       childs.eq(index).addClass("cur_info").siblings().removeClass("cur_info");
   })

   $(".hotel_btn").on("click",function(){
       var $desc=$(this).prev();
       if($(this).text()=="展开详情"){
          $desc.css("height","auto");
          $(this).text("收起");
       }else{
          $desc.css("height","3.2rem");
          $(this).text("收起");
       }
   })

   // 预定
   $("#detail_list").on("click","span",function(){
      var img=$(this).data("img"),
          price=$(this).data("price"),
          type=$(this).data("type");
      if($(this).hasClass("disabled"))return;
      common.showMark();
      $("#layer").css({
         '-webkit-transition':'height 0.3s ease-in-out',
         'height':'28rem'
      })
      $("#pics").attr("src",img);
      $("#bed_name").text(type);
      $("#book_price").text(price);
      $("#bed_type").text($(this).data("bed"));

      $("#img").val();
      $("#room_name").val(type);
      $("#room_id").val($(this).data("id"));
      $("#price").val(price);
   })

   // 关闭预定
   $(".close").on("click",function(){
       common.hideMark();
       $("#layer").css({
          '-webkit-transition':'height 0.3s ease-in-out',
          'height':'0rem'
       })
   })

   // 立即预定
   $("#gotoOrder").on("click",function(){
       // 获取订单页的url地址
       var url='order.html?city_id='+cityId+'&date_in='+$("#date_in").val()
       +'&date_out='+$("#date_out").val()+'&hotel_id='+hotelId+'&hotel_name='
       +encodeURI(hotelName)+'&room_type='+encodeURI($("#room_name").val())
       +'&room_id='+$("#room_id").val()+'&price='+$("#price").val();
       // 判断用户是否在登陆状态下
       ifLogined(url);
   })
}

bindEvent();