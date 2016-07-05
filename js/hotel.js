// 解析地址栏中的参数
var isc=new iScroll("hotel_scroll"),
    params=getParam(),
    dateIn=params.date_in,
    dateOut=params.date_out,
    city_id=params.city_id,
    name=params.name?params.name:"",
    pageSize=4,  // 每页显示的记录数
    pageNo=1,    // 页数
    // 传给服务器端的参数列表
    POST={
       cityId:city_id,
       dateIn:dateIn,
       dateOut:dateOut,
       pageNo:pageNo,
       pageSize:pageSize
    }
    if(name){
       POST.name=name;
    }

// 显示入住和离店日期
$("#inText").text(getMonthDay(dateIn));
$("#outText").text(getMonthDay(dateOut));
$("#date_in").val(dateIn);
$("#date_out").val(dateOut);

// 修改日期
editCalendar();

// ajax请求
function getDataFromHotel(action){
    console.log(POST);
    common.access_server("../server/hotel.php",POST,function(datas){
        renderHotelList(datas,action);
    });
}

// 渲染数据
function renderHotelList(datas,action){
   var $tip=$("#tipbox"),
       $container=$("#hotel_list"),
       $loadMore=$(".load_more"),
       count=0,
       data,
       html="";
   if(datas.errcode==1){
      $tip.css("display","block");
      $container.empty();
   }else{
      $tip.css("display","none");
      count=datas.count;
      data=datas.result.hotel_list;
      $.each(data,function(i,obj){
           html+='<div class="rows">'
                    +'<a href="detail.html">'
                         +'<dl>'
                             +'<dt>'
                                 +'<img src="../'+obj.image+'">'
                             +'</dt>'
                             +'<dd>'
                                  +'<h2>'+obj.name+'</h2>'
                                  +'<p class="tip">'
                                       +'<span>4.5分</span>'
                                       +'<em>礼</em>'
                                       +'<em>促</em>'
                                       +'<em>返</em>'
                                  +'</p>'
                                  +'<p class="stars">'+obj.stars+'</p>'
                                  +'<p class="address">'+obj.addr+'</p>'
                             +'</dd>'
                          +'</dl>'
                       +'</a>'
                    +'</div>';
     })
     if(typeof(action)==="undefined") $container.html("");
     $(html).appendTo($container);
     // 是否实现加载更多
     if(POST.pageNo*POST.pageSize<count){
        $loadMore.css("display","block");
     }else{
        $loadMore.css("display","none");
     }
     isc.refresh();
   }
}

function clickLoadMore(){
   $(".load_more").on("click",function(){
       POST.pageNo+=1;
       getDataFromHotel("loadMore");
   })
}

clickLoadMore();

getDataFromHotel();