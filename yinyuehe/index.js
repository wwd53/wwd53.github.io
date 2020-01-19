var myAudio=document.getElementById("myAudio");
var CurrentTime=document.getElementsByClassName("current-time")[0];
var DurationTime=document.getElementsByClassName("duration-time")[0];
var obtn=document.getElementsByClassName("btn")[0];
var isplay=obtn.getElementsByClassName("iconfont")[0];
var proactive=document.getElementsByClassName("pro-active")[0];
var backactive=document.getElementsByClassName("back-active")[0];
var oradio=document.getElementsByClassName("radio")[0];
var oround=document.getElementsByClassName("round")[0];
var oprobox=document.getElementsByClassName("pro-box")[0];
var obackbox=document.getElementsByClassName("back-box")[0];
var sys=document.getElementsByClassName("sys")[0];
var xys=document.getElementsByClassName("xys")[0];
var ovolume=document.getElementsByClassName("volume")[0];
var zanting=ovolume.getElementsByClassName("iconfont")[0];
var timer,duration;

// ondurationchange
myAudio.oncanplay=function(){//获取audio当前播放时长与总时长
    CurrentTime.innerHTML=conversion(this.currentTime);
    duration=myAudio.duration
    DurationTime.innerHTML=conversion(duration);
}

function conversion(time){//将时长转化为：00:00样式
    var sec=parseInt(time%60)<10? "0"+parseInt(time%60):parseInt(time%60);
    var min=parseInt(time/60)<10? "0"+parseInt(time/60):parseInt(time/60);
    return min+":"+sec;
}

obtn.onmouseup=function(){//控制播放与暂停
    if(myAudio.paused){
        musicPlay();
    }else{
        musicPause();
    }
}
function musicPlay(){//音乐播放
    myAudio.play();
    isplay.innerHTML="&#xe62e;";
    timer=setInterval(movepro,200);
}
function musicPause(){//音乐暂停
    myAudio.pause();
    isplay.innerHTML="&#xe710;";
    clearInterval(timer);
}
myAudio.onended=function(){ //音乐播放完后自动播放下一首
    musicPause();
    myAudio.currentTime=0;
    CurrentTime.innerHTML=conversion(0);
    proactive.style.width=8+"px";
    id+=1;
    console.log(id);
    if(id>2){
        id=0;
        myAudio.src=quku[id];
    }else{
        myAudio.src=quku[id];
    }
    musicPlay();
}

function movepro(){ //当前宽度=当前时长/总时长*总宽度
    var currentTime=myAudio.currentTime;
    CurrentTime.innerHTML=conversion(currentTime);
    proactive.style.width=currentTime/duration*232+8+"px";
}

oradio.onmousedown=function(){ //控制播放进程
    clearInterval(timer);
    var c=myAudio.currentTime;
    document.body.onmousemove=function(e){
        var newWidth=e.clientX-oprobox.getBoundingClientRect().left
        if(newWidth<8){
            newWidth=8;
        }
        else if(newWidth>240){
            newWidth=240;
        }
        proactive.style.width=newWidth+"px";
        c=(newWidth-8)/232*duration;
        CurrentTime.innerHTML=conversion(c);
    }
    document.body.onmouseup=function(){
        document.body.onmousemove=null;
        document.body.onmouseup=null;
        musicPlay();
        myAudio.currentTime=c;
    }
}

var quku=["五月天 - 温柔.mp3","五月天 - 突然好想你.mp3","五月天 - 我不愿 让你一个人.mp3"];
var id=2;
sys.onclick=function(){ //点击上一首
    id-=1;
    console.log(id);
    if(id<0){
        id=2;
        myAudio.src=quku[id];
    }else{
        myAudio.src=quku[id];
    }
    musicPlay();
}
xys.onclick=function(){ //点击下一首
    id+=1;
    console.log(id);
    if(id>2){
        id=0;
        myAudio.src=quku[id];
    }else{
        myAudio.src=quku[id];
    }
    musicPlay();
}

// 音量控制部分
var d,newyinliang;
oround.onmousedown=function(){ //控制音量大小
    d=myAudio.volume;
    document.body.onmousemove=function(e){
        zanting.innerHTML="&#xe650;";
        newyinliang=e.clientX-obackbox.getBoundingClientRect().left;
        if(newyinliang<8){
            newyinliang=8;
            zanting.innerHTML="&#xe747;";
        }
        else if(newyinliang>72){
            newyinliang=72;
        }
        backactive.style.width=newyinliang+"px";
        d=(newyinliang-8)/64*1;
        myAudio.volume=d;
    }
    document.body.onmouseup=function(){
        document.body.onmousemove=null;
        document.body.onmouseup=null;
        myAudio.volume=d;
    }
}

ovolume.onclick=function(){
    d=myAudio.volume;
    newyinliang=backactive.offsetWidth;
    console.log(d);
    console.log(newyinliang);
    if(d>0 || newyinliang==8){
        d=0;
        myAudio.volume=d;
        zanting.innerHTML="&#xe747;";
    }
    else if(d==0 && newyinliang>0){
        zanting.innerHTML="&#xe650;";
        d=(newyinliang-8)/64*1;
        myAudio.volume=d;
    }
}