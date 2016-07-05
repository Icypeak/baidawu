function init(){
   bindEvent();
}

function bindEvent(){
   // 手机号码只能输入数字
   $("#phone").on("input propertychange",function(){
       // 输入内容中含有非数字时，将非数字替换为空
       var reg=/\D/g;
       var phone=$(this).val();
       $(this).val(phone.replace(reg,""));
       checkInput();
   })
   $("#password").on("input propertychange",function(){
       checkInput(); 
   })
   // 登陆
   $("#login").on("click",checkLogin);
}

function checkInput(){
   var phone=$.trim($("#phone").val());
   var pwd=$.trim($("#password").val());
   var login=$("#login");
   if(phone && pwd){
      login.addClass("activ");
   }else{
      login.removeClass("activ");
   }
}

function checkLogin(){
    if(!$(this).hasClass("activ"))return;
    var phone=$.trim($("#phone").val());
    var pwd=$.trim($("#password").val());
    if(!common.checkPhone(phone)){
        common.showDialog("请输入有效的手机号码","确定");
        return;
    }
    if(!common.checkPwd(pwd)){
        common.showDialog("请输入有效的密码","确定");
        return;
    }
    // ajax请求
    common.access_server("../server/checkuser.php",{phone:phone,pwd:pwd},function(data){
        var msg=data.msg;
        if(data.code==1){
           common.showDialog(msg,"确定",function(){
               location.href="register.html";
           })
        }else if(data.code==2){
           common.showDialog(msg,"确定",function(){
               $("#password").val("");
           })
        }else{
           location.href=ls.getItem("orderUrl");
        }
    });
}

init();