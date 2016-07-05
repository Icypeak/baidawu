function init(){
   showCity();
   showCalendar();
   clickToSearch();
}

// 显示当前城市
function showCity(){
   var $cityName=$("#city_name");
   var $cityId=$("#city_id");
   // 判断地址栏中是否有参数
   if(getParam()){
      var cityName=getParam().city_name;
      var cityId=getParam().city_id;
      $cityName.text(cityName);
      $cityId.val(cityId);
      ls.setItem("city_id",cityId);
      ls.setItem("city_name",cityName);
   }else{
      debugger;
      $cityName.text("北京");
      $cityId.val("28");
      ls.setItem("city_id","28");
      debugger;
      ls.setItem("city_name","北京");
   }
}

// 日历
function showCalendar(){
   var $dateIn=$("#date_in"),
       $dateOut=$("#date_out"),
       today=new Date(),
       beginDate,
       maxDate;
   $dateIn.val(getDateFormat());
   $dateOut.val(getDateFormat(1));
   // 选择入住日
   $("#date_in").on("focus",function(){
       beginDate=new Date(today.getFullYear(),today.getMonth(),today.getDate());
       maxDate=new Date(today.getFullYear(),today.getMonth(),today.getDate()+90);
       callCalendar($(this),beginDate,maxDate);
   })
   // 选择离店日
   $("#date_out").on("focus",function(){
       beginDate=new Date(today.getFullYear(),today.getMonth(),today.getDate());
       maxDate=new Date(today.getFullYear(),today.getMonth(),today.getDate()+91);
       callCalendar($(this),beginDate,maxDate);
   })
}

// 点击搜索
function clickToSearch(){
   $("#search").click(function(){
      var cityId=$("#city_id").val(),
          dateIn=$("#date_in").val(),
          dateOut=$("#date_out").val(),
          name=$("#name").val();
      $(this).attr("href","html/hotel.html?city_id="+cityId+'&date_in='+dateIn+'&date_out='+dateOut+'&name='+encodeURI(name));
   })
}

init();