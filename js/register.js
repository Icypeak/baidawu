var testCode="";
function bindEvent(){
   // 手机号码只能输入数字
   $("#phone").on("input propertychange",function(){
       // 输入内容中含有非数字时，将非数字替换为空
       var reg=/\D/g;
       var phone=$(this).val();
       $(this).val(phone.replace(reg,""));
       //heckInput();
   })
   // 密码的开关
   $("#pwd_on_off").on("click",changePwd);
   // 点击获取验证码
   $("#get_code_btn").on("click",getTestCode);
   // 给所有的文本框绑定事件
   $(".forms").on("input propertychange","input[data-check]",checkInput);
   $(".forms input[type=checkbox]").on("change",checkInput);
   // 下一步
   $("#next").on("click",checkRegister);
}

// 检测所有的文本框是否都填写了
function checkInput(){
   var phone=$.trim($("#phone").val()),
       pwd=$.trim($("#pwd").val()),
       code=$.trim($("#code").val()),
       isRead=$("#isRead").prop("checked"),
       $next=$("#next");
    
    if(phone && pwd && code && isRead){
       $next.addClass("activ");
    }else{
       $next.removeClass("activ");
    } 
}

function changePwd(){
   var $pwd=$("#pwd");
   var $round=$(".round");
 
   // 如果密码是开启的，否则是关闭的
   if($pwd.attr("type")=="password"){
       $round.css({
           '-webkit-transition':'transform 0.3s ease-in-out',
           '-webkit-transform':'translate3d(0,0,0)'
        })
       $pwd.attr("type","text");
       $(this).addClass("pwd-btn");
   }else{
       $round.css({
           '-webkit-transition':'transform 0.3s ease-in-out',
           '-webkit-transform':'translate3d(50px,0,0)'
        })
       $pwd.attr("type","password");
       $(this).removeClass("pwd-btn");
   }
}

// 获取验证码
function getTestCode(){
   var phone=$.trim($("#phone").val()),
       times=10,
       timer=null,
       $btn=$(this),
       timerFn=null;
   if($btn.data("clicked")) return;
   if(!common.checkPhone(phone)){
      common.showDialog("请输入有效的手机号码","确定");
      return;
   }
   common.access_server("../server/register.php",{phone:phone},function(data){
       data=data.result;
       var msg=data.risg;
       if(data.errcode==2){
          common.showDialog(msg,"重试");
       }else if(data.errcode==1){
          common.showDialog(msg,"登陆",function(){
             location.href="login.html";
          });
       }else{
          common.showDialog("验证码发送成功","确定",function(){
              testCode=msg;
              timerFn();
          });
       }
   });
   timerFn=function(){
      timer=setInterval(function(){
       console.log(times);
          times--;
          if(times<=0){
             clearInterval(timer);
             $btn.text("获取验证码").data("clicked",false);
          }else{
             $btn.text(times+'秒后重试').data("clicked",true);
          }
      },1000)
   }
}

// 注册
function checkRegister(){
   if(!$(this).is(".activ"))return;
   var phone=$.trim($("#phone").val());
   var pwd=$.trim($("#pwd").val());
   var code=$.trim($("#code").val());
   var user={};
   var errcode="";
   if(!common.checkPhone(phone)){
      common.showDialog("请输入有效的手机号码","确定");
      return;
   }
   if(!common.checkPwd(pwd)){
      common.showDialog("请输入6-12位的字母数字下划线","确定");
      return;
   }
   if(code!=testCode){
      common.showDialog("验证码输入有误","确定");
      return;
   }
   user={
      phone:phone,
      pwd:pwd
   }
   common.access_server("../server/registersubmit.php",user,function(data){
       errcode=data.result.errcode;
       if(errcode==1){
          common.showDialog("该手机号码已被注册过了","确定",function(){
              location.href='login.html';
          })
       }else if(errcode==2){
          common.showDialog("抱歉，注册失败，请重试","确定");
       }else{
          common.showDialog("恭喜您，注册成功！","确定",function(){
              location.href='login.html';
          })
       }
   })
}

bindEvent()