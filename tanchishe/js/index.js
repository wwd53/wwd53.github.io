var sw=20, //方块宽度
    sh=20, //方块高度
    tr=30, //行数
    td=30; //列数

var snake=null, //蛇的实例
    food=null,  //食物的实例
    game=null;  //游戏的实例


//方块的构造函数
function Square(x,y,classname) {
    //0,0   0,0
    //20,0  1,0
    //40,0  2,0
    this.x=x*sw;
    this.y=y*sh;
    this.class=classname;

    this.viewContent=document.createElement("div");//方块对应的dom元素
    this.viewContent.className=this.class;
    this.parent=document.getElementById("snakeWrap");//方块的父级
}

Square.prototype.create=function() {//创建方块dom并添加到父级
    this.viewContent.style.position="absolute";
    this.viewContent.style.left=this.x+"px";
    this.viewContent.style.top=this.y+"px";
    this.viewContent.style.width=sw+"px";
    this.viewContent.style.height=sh+"px";
    this.parent.append(this.viewContent);
}

Square.prototype.remove=function() {
    this.parent.removeChild(this.viewContent);
}

//蛇的构造函数
function Snake() {
    this.head=null; //存一下蛇头的信息
    this.tail=null; //存一下蛇尾的信息
    this.pos=[];    //存储蛇身上每一个方块的位置
    this.directionNum={ //存储蛇走的方向，用一个对象表示
        left:{
            x:-1,
            y:0,
            rotate:180 //蛇头在不同的方向中应该进行旋转，要不始终是向右
        },
        right:{
            x:1,
            y:0,
            totate:0
        },
        up:{
            x:0,
            y:-1,
            rotate:-90
        },
        down:{
            x:0,
            y:1,
            rotate:90
        }
    }
}
//将蛇初始化
Snake.prototype.init=function() { 
    //创建蛇头
    var snakeHead=new Square(2,0,'snakeHead'); 
    snakeHead.create();
    this.head=snakeHead; //存储蛇头信息
    this.pos.push([2,0]); //存储蛇头的位置

    //创建蛇身1
    var snakeBody1=new Square(1,0,'snakeBody');
    snakeBody1.create();
    this.pos.push([1,0]); //存储蛇身1的位置
    //创建蛇身2
    var snakeBody2=new Square(0,0,'snakeBody');
    snakeBody2.create();
    this.tail=snakeBody2; //存储蛇尾的信息
    this.pos.push([0,0]); //存储蛇身2的位置

    //形成链表关系
    snakeHead.last=null;
    snakeHead.next=snakeBody1;

    snakeBody1.last=snakeHead;
    snakeBody1.next=snakeBody2;

    snakeBody2.last=snakeBody1;
    snakeBody2.next=null;

    //给蛇添加一条属性，表示蛇初始走的方向
    this.direction=this.directionNum.right; // 默认往右走
}

//这个方法用来获取蛇头的下一个位置对应的元素，根据元素做不同的事情
Snake.prototype.getNextPos=function() {
    //蛇头要走的下一个点的坐标
    var nextPos=[ 
        this.head.x/sw+this.direction.x,
        this.head.y/sh+this.direction.y
    ]
   //下一个点是自己，代表撞到自己，游戏结束
    var selfCollied=false; //是否撞到了自己
    this.pos.forEach(function (value) {
        if(value[0]==nextPos[0] && value[1]==nextPos[1]) {
            selfCollied=true;
        }
    });
    if(selfCollied) {
        console.log("撞到自己了!");
        this.strategies.die.call(this);
        return;
    }
    //下一个点是围墙，游戏结束
    if(nextPos[0]<0 || nextPos[1]<0 || nextPos[0]>td-1 || nextPos[1]>tr-1) {
        console.log("撞墙了!");
        this.strategies.die.call(this);
        return;
    }
    //下一个点是食物，吃掉
    if(food && food.pos[0]==nextPos[0] && food.pos[1]==nextPos[1]) { //如果成立，蛇头下一步要走的点是吃
        this.strategies.eat.call(this);
        return;
    }
    

    //下一个点什么都不是，继续行走
    this.strategies.move.call(this);
}
//处理碰撞后要做的事
Snake.prototype.strategies= {
    move:function(format) { //这个参数用于决定要不要删除蛇尾（最后一个方块）
        //创建新身体（在旧蛇头的位置）
        var newBody=new Square(this.head.x/sw,this.head.y/sh,"snakeBody");
        //更新链表的关系
        newBody.next=this.head.next;
        newBody.next.last=newBody;
        newBody.last=null;

        this.head.remove(); //把旧蛇头从原来的位置删除
        newBody.create(); //在旧蛇头的位置上创建一个新蛇身

        //创建一个新蛇头（蛇头下一个要走到的点）
        var newHead=new Square(this.head.x/sw+this.direction.x,this.head.y/sh+this.direction.y,"snakeHead");
        //更新链表的关系
        newHead.next=newBody;
        newHead.last=null;
        newBody.last=newHead;
        newHead.viewContent.style.transform='rotate('+this.direction.rotate+'deg)';
        newHead.create(); //创建新蛇头
        //蛇身上的每一个方块的坐标也要更新
        this.pos.splice(0,0,[this.head.x/sw+this.direction.x,this.head.y/sh+this.direction.y]);
        this.head=newHead; //更新蛇头信息

        if(!format) { //如果format的值为false，表示需要删除蛇尾（除了吃之外的操作）
            this.tail.remove();
            this.tail=this.tail.last;
            this.pos.pop(); //更新蛇身位置信息
        }
        
    },
    eat:function() {
        this.strategies.move.call(this,true);
        createFood();
        game.score++;
    },
    die:function() {
        game.over();
    }
}

snake=new Snake();


//创建食物
function createFood() {
    //食物小方块的随机坐标
    var x=null;
    var y=null;
    var include=true; //循环跳出的条件:true表示食物的坐标在蛇身上（需要继续循环），false表示食物的坐标不在蛇身上（不循环）
    while(include) {
        x=Math.round(Math.random()*(td-1));
        y=Math.round(Math.random()*(tr-1));
        snake.pos.forEach(function(value) {
            if(value[0]!=x && value[1]!=y) {
                //这个条件成立说明随机出来的坐标不在蛇身上
                include=false;
            }
        })       
    }
    //生成食物
    food=new Square(x,y,"food");
    food.pos=[x,y]; //存储生成食物的坐标，用于跟蛇头要走的下一个点做对比
    var foodDom=document.querySelector('.food');
    if(foodDom) {
        foodDom.style.left=x*sw+'px';
        foodDom.style.top=y*sh+'px';
    }else {
        food.create();
    }   
}


//创建游戏逻辑
function Game() {
    this.timer=null;
    this.score=0;
}

Game.prototype.init=function() {
    snake.init();
    // snake.getNextPos();
    createFood();
    document.onkeydown=function(ev) {
        if(ev.which==37 && snake.direction!=snake.directionNum.right) { //按左键的时候，蛇不能是正在往右走
            snake.direction=snake.directionNum.left;
        }else if(ev.which==38 && snake.direction!=snake.directionNum.down){
            snake.direction=snake.directionNum.up;
        }else if(ev.which==39 && snake.direction!=snake.directionNum.left){
            snake.direction=snake.directionNum.right;
        }else if(ev.which==40 && snake.direction!=snake.directionNum.up){
            snake.direction=snake.directionNum.down;
        }
    }
    this.start();
}

Game.prototype.start=function() { //开始游戏
    this.timer=setInterval(function() {
        snake.getNextPos();
    },300);
}

Game.prototype.pause=function() { //暂停游戏
    clearInterval(this.timer);
}

Game.prototype.over=function() {
    clearInterval(this.timer);
    alert('你的得分为：'+this.score);
    //游戏回到初始状态
    var snakeWrap=document.getElementById('snakeWrap')
    snakeWrap.innerHTML='';
    snake=new Snake();
    game=new Game();
    var startBtnWrap=document.querySelector('.startBtn');
    startBtnWrap.style.display='block';
}

//开始游戏
game=new Game();
var startBtn=document.querySelector('.startBtn button');
startBtn.onclick=function() {
    startBtn.parentNode.style.display='none';
    game.init();
}

//暂停游戏
var snakeWrap=document.getElementById('snakeWrap');
var pauseBtn=document.querySelector('.pauseBtn button');
snakeWrap.onclick=function() {
    game.pause();
    pauseBtn.parentNode.style.display='block';
}
//再次开始游戏
pauseBtn.onclick=function() {
    game.start();
    pauseBtn.parentNode.style.display='none';
}