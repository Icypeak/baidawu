// 解析地址栏中的参数
var isc=new iScroll("hotel_scroll"),
    params=getParam(),
    dateIn=params.date_in,
    dateOut=params.date_out,
    cityId=params.city_id,
    name=params.name?params.name:"",
    pageSize=5,  // 每页显示的记录数
    pageNo=1,    // 页数
    // 传给服务器端的参数列表
    POST={
       cityId:cityId,
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
    common.access_server("../server/hotel2.php",POST,function(datas){
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
                    +'<a href="detail.html?city_id='+cityId+'&date_in='+$("#date_in").val()+'&date_out='+$("#date_out").val()+'&hotel_id='+obj.hotel_id+'&hotel_name='+encodeURI(obj.name)+'">'
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
                             +'<dd>'
                             +'<p>'+obj.low_price/100+'起</p>'
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

function bindEvent(){
   // 点击加载更多
   $(".load_more").on("click",function(){
       POST.pageNo+=1;
       getDataFromHotel("loadMore");
   })
   // 点击导航切换选项
   $("#ftnav").on("click",'a',function(){
       var index=$(this).index();
       common.showMark();
       var $layer=$("#item_layer");
       $layer.css({
           '-webkit-transition':'height 0.3s ease-in-out',
           'height':'25rem'
       })
       $(this).addClass("cur_item").siblings().removeClass("cur_item");
       // 显示对应的弹出层
       $layer.children("div").eq(index).addClass("cur_layer").siblings().removeClass("cur_layer");
   })
}

bindEvent();

getDataFromHotel();

var sort={
  "all":"不限",
  "hot":"人气最高",
  "priceMax":"价格从高到低",
  "priceMin":"价格从低到高"
}

// 渲染排序
function renderSort(){
   var htmlArr=["<ul>"];
   //var html="<ul>";
   $.each(sort,function(k,text){
     /* html+='<li>'
            +'<a href="javascript:void(0)">'
                 +'<span onclick="checkSort()"></span>'
                 +'<b>'+text+'</b>'
            +'</a>'
          +'</li>';*/
       htmlArr.push('<li id="'+k+'">',
                    '<a href="javascript:void(0)">',
                    '<span onclick="checkSort(\''+k+'\')"></span>',
                    '<b>'+text+'</b>',
                    '</a>',
                    '</li>');
   })
   htmlArr.push("</ul>");
   $("#sort").html(htmlArr.join("")).find("li").eq(0).addClass("on");
   console.log(htmlArr);
   //$("#sort").html(html);
}

// 价格
var price={
  "0":["不限",-1,-1],
  "1":["0-100",0,100],
  "2":["101-200",101,200],
  "3":["201-300",201,300],
  "4":["301-400",301,400],
  "5":["401-500",401,500],
  "6":["500以上",501,-1]
}

function renderPrice(){
   var html='<ul>';
   $.each(price,function(k,texts){
    console.log(k);
       html+='<li id="item'+k+'">'
                +'<a href="javascript:void(0)">'
                     +'<span onclick="checkPrice('+k+','+texts[1]+','+texts[2]+')"></span>'
                     +'<b>'+texts[0]+'</b>'
                +'</a>'
            +'</li>';
   })
   html+='</ul>';
   $("#price").html(html).find("li").eq(0).addClass("on");
}

function checkPrice(id,min,max){
   $("#item"+id).addClass("on").siblings().removeClass("on");
   hideLayer();
   min=min==-1?-100:min*100;
   max=max==-1?-100:max*100;
   $("#min").val(min);
   $("#max").val(max);
   POST.minPrice=$("#min").val();
   POST.maxPrice=$("#max").val();
   getDataFromHotel();
}

renderPrice();

// 价格
var price={
  "0":["不限",-1,-1],
  "1":["0-100",0,100],
  "2":["101-200",101,200],
  "3":["201-300",201,300],
  "4":["301-400",301,400],
  "5":["401-500",401,500],
  "6":["500以上",501,-1]
}

function renderPrice(){
   var html='<ul>';
   $.each(price,function(k,texts){
    console.log(k);
       html+='<li id="item'+k+'">'
                +'<a href="javascript:void(0)">'
                     +'<span onclick="checkPrice('+k+','+texts[1]+','+texts[2]+')"></span>'
                     +'<b>'+texts[0]+'</b>'
                +'</a>'
            +'</li>';
   })
   html+='</ul>';
   $("#price").html(html).find("li").eq(0).addClass("on");
}

function checkPrice(id,min,max){
   $("#item"+id).addClass("on").siblings().removeClass("on");
   hideLayer();
   min=min==-1?-100:min*100;
   max=max==-1?-100:max*100;
   $("#min").val(min);
   $("#max").val(max);
   POST.minPrice=$("#min").val();
   POST.maxPrice=$("#max").val();
   getDataFromHotel();
}

renderPrice();

function renderBrand(){
     var hotelBrands = {
       0:'不限',
       12:'喜来登',
       15:'如家',
       18:"万豪",
       35:"香格里拉",
       39:"速8",
       44:"莫泰168",
       48:"汉庭",
       49:"全季",
       50:"锦江之星",
       53:"里程",
       68:"桔子",
       110:"如家快捷",
       132:"7天",
       160:"布丁",
       168:"格林豪泰",
       286:"尚客优"
   }
   var html='<ul>';
   $.each(hotelBrands,function(k,text){
       html+='<li id="item'+k+'">'
                +'<a href="javascript:void(0)">'
                     +'<span onclick="checkBrand('+k+',\''+text+'\')"></span>'
                     +'<b>'+text+'</b>'
                +'</a>'
            +'</li>';
   })
   html+='</ul>';
   $("#brand").html(html).find("li").eq(0).addClass("on");
}

function checkBrand(id,name){
   $("#item"+id).addClass("on").siblings().removeClass("on");
   hideLayer();
   //id=id==0?-1:id;
   id=id==0?-1:name;
   $("#brand").val(id);
   POST.brand=$("#brand").val();
   getDataFromHotel();
}

renderBrand();

// 选择排序
function checkSort(key){
   $("#"+key).addClass("on").siblings().removeClass("on");
   // 隐藏弹层
   hideLayer();
   var v=key==="all"?-1:key;
   $("#order").val(v);
   // ajax请求
   POST.sortType=$("#order").val();
   getDataFromHotel();
}

renderSort();

// 星级
function renderStar(){
   var stars={
      "0":"不限",
      "2":"二星以下/经济型",
      "3":"三星",
      "4":"四星",
      "5":"五星"
   }
   var html='<ul>';
   $.each(stars,function(k,text){
       html+='<li id="star'+k+'">'
                +'<a href="javascript:void(0)">'
                     +'<span onclick="checkStar('+k+')"></span>'
                     +'<b>'+text+'</b>'
                +'</a>'
            +'</li>';
   })
   html+='</ul>';
   $("#star").html(html).find("li").eq(0).addClass("on");
}

// 选择星级
function checkStar(key){
   $("#star"+key).addClass("on").siblings().removeClass("on");
   // 隐藏弹层
   hideLayer();
   var v=key===0?-1:key;
   $("#star").val(v);
   // ajax请求
   POST.stars=$("#star").val();
   getDataFromHotel();
}

renderStar();

// 隐藏弹层
function hideLayer(){
   setTimeout(function(){
      common.hideMark();
      $("#item_layer").css({
         '-webkit-transition':"height 0.3s ease-in-out",
         'height':'0'
      })
   },400) 
}

// 触摸滑动显示和隐藏底部导航
function showHideNav(){
   var startY,offsetY,$ftnav=$("#ftnav");
   $("#hotel_scroll").on("touchstart",function(e){
       startY=e.touches[0].clientY;
       offsetY=0;
   })
   $("#hotel_scroll").on("touchmove",function(e){
       offsetY=e.touches[0].clientY-startY;
   })
   $("#hotel_scroll").on("touchend",function(e){
       var abs_offsetY=Math.abs(offsetY);
       if(abs_offsetY>20){
          if(offsetY<0){
             $ftnav.css({
                '-webkit-transition':"height 0.3s linear",
                'height':'3rem'
             })
          }else{
             $ftnav.css({
                '-webkit-transition':"height 0.3s linear",
                'height':'0rem'
             })
          }
       }
   })
}

showHideNav();