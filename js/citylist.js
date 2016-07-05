var cityIscroll=new iScroll("container");
var Alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'];
function init(){
   showCity();
   showMoreCity();
}

function showCity(){
   var cityId=localStorage.getItem("city_id");
   var cityName=localStorage.getItem("city_name");
   $("#cur_city").text(cityName);
   $("#return").click(function(){
       $(this).attr("href","../index.html?city_id="+cityId+'&city_name='+encodeURI(cityName));
   })
}

function showMoreCity(){
   var html="";
   for(var i=0,len=Alphabet.length;i<len;i++){
       var s=Alphabet[i];
       var listHtml='<section id="city'+i+'">'
                      +'<div class="tipbg">'+s+'</div>'
                      +'<ul>';
       html+='<li>'+'<a href="#city'+i+'">'+s+'</a></li>';
       // 城市列表
       $.each(CITIES,function(k,arr){
          if(arr[1].charAt(0)==s){
             listHtml+='<li>'
                          +'<a href="../index.html?city_id='+k+'&city_name='+encodeURI(arr[0])+'">'+arr[0]+'</a>'
                      +'</li>';              
          }
       })
       listHtml+='</ul></section>';
       $(listHtml).appendTo($("#city_box"));
   }
   $("#more_list").html(html);
   cityIscroll.refresh();
}

init();