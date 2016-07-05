function Slider(opts){
   this.wrap=opts.wrap;
   this.data=opts.data;

   // 构造函数三部曲

   // 初始化
   this.init();
   // 渲染
   this.renderDom();
   // 绑定事件
   this.bindDom();
}

Slider.prototype={
	init:function(){
		// 计算设备屏幕的宽高比,判断图片是要横着显示还是竖着显示
		this.percent=window.innerHeight/window.innerWidth;  // 1.5
		// 获取设备屏幕的宽
		this.winw=window.innerWidth;    // 320
		// 索引
		this.idx=0;
	},
	renderDom:function(){
		var wrap=this.wrap;
		var data=this.data;
		var len=data.length;
		var w=this.winw;
		var h=window.innerHeight;
		var percent=this.percent;
		var i,li,imgper,lih,bg,div,dl,index=this.idx+1,dot;
		this.ul=document.createElement('ul');
    this.ol=document.createElement('ol');
		// 将JSON数据中的图片渲染到li里，将li渲染到ul里，将ul渲染到div里
		for(i=0;i<len;i++){
           var obj=data[i];
           var html='';
           imgper=obj.height/obj.width;   // 0.5
           lih=w*imgper;
           li=document.createElement('li');
           dot=document.createElement('li');
           li.style.width=w+'px';
           li.style.height=lih+'px';
           li.style.webkitTransform='translate3d('+i*w+'px,0,0)';
           li.innerHTML='<a href=""><img src="'+obj.img+'"></a>';
           this.ul.appendChild(li);
           this.ol.appendChild(dot);
		}
		wrap.style.height=lih+'px';
		wrap.appendChild(this.ul);
    wrap.appendChild(this.ol);
    this.ol.getElementsByTagName('li')[0].className='on';
	},
	bindDom:function(){
		var wrap=this.wrap;
		var self=this;
		// 开始触摸
		var startFn=function(e){
           e.preventDefault();
           self.pos=e.touches[0].pageX;
           self.offset=0;
           self.startTime=new Date()*1;
		}
		// 移动触摸
		var moveFn=function(e){
           e.preventDefault();
           self.offset=e.touches[0].pageX-self.pos;
           var lis=self.ul.getElementsByTagName('li');
           var scale=self.winw;
           var idx=self.idx;
           var offset=self.offset;
           document.title=self.offset;
           // 改变当前图片的上一张、当前图片和当前图片的下一张三个li的位置
           var p=idx-1;   
           var t=p+3;
           for(p;p<t;p++){
              lis[p] && (lis[p].style.webkitTransform='translate3d('+((p-idx)*scale+offset)+'px,0,0)');
              lis[p] && (lis[p].style.webkitTransition='none');
           }
		}

		// 结束触摸
		var endFn=function(e){
           e.preventDefault();
           var times=new Date()*1-self.startTime;
           var flag=self.winw/6;
           var offset=self.offset;
           if(times>800){
             if(offset>=flag){
                self.go('-1');
             }else if(offset<=-flag){
                self.go('+1');
             }else{
                self.go('0');
             }
           }else{
           	if(offset>=50){
           	   self.go('-1');
           	}else if(offset<=-50){
           	   self.go('+1');
           	}else{
           	   self.go('0');
           	}
           }
		}
		wrap.addEventListener('touchstart',startFn,false);
		wrap.addEventListener('touchmove',moveFn,false);
		wrap.addEventListener('touchend',endFn,false);
	},
	go:function(n){
       var oldIdx=this.idx;
       var nowIdx;
       var lis=this.ul.getElementsByTagName('li');
       var dots=this.ol.getElementsByTagName('li');
       var len=lis.length;
       var scale=this.winw;

       for(var i=0;i<dots.length;i++){
          dots[i].className="";
       }

       if(typeof n=='number'){
          nowIdx=n;
       }else if(typeof n=='string'){
          nowIdx=oldIdx+n*1;
       }
       if(nowIdx<0){
         nowIdx=0;
       }else if(nowIdx>len-1){
         nowIdx=len-1;
       }
       document.title=nowIdx;

       lis[nowIdx-1] && (lis[nowIdx-1].style.webkitTransition='-webkit-transform 0.3s ease-out');
       lis[nowIdx] && (lis[nowIdx].style.webkitTransition='-webkit-transform 0.3s ease-out');
       lis[nowIdx+1] && (lis[nowIdx+1].style.webkitTransition='-webkit-transform 0.3s ease-out');

       lis[nowIdx-1] && (lis[nowIdx-1].style.webkitTransform='translate3d(-'+scale+'px,0,0)');
       lis[nowIdx] && (lis[nowIdx].style.webkitTransform='translate3d(0,0,0)');
       lis[nowIdx+1] && (lis[nowIdx+1].style.webkitTransform='translate3d('+scale+'px,0,0)');
       
       dots[nowIdx] && (dots[nowIdx].className='on');

       this.idx=nowIdx;
	}
}