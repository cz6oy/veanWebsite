/**
 * Created by mayd on 17/6/1.
 */

function getBloodSugarTimeBy(stsrtTime,px){
    let day1s=stsrtTime.split("-"); //字符分割
    var date=new Date()
    date.setFullYear(day1s[0],day1s[1],day1s[2])


    var time= date.getTime()+parseInt(px/1000)*24*60*60*1000;

    var newDate=new Date(time)
    return newDate.getFullYear()+"年"+newDate.getMonth()+"月"+newDate.getDate()+"日"
}

function getBloodPressureOfWeek(data){
    let day=0;
    let sum=0;
    let day_start;
    let isBlank_0="YES";
    let isBlank_1="YES";
    let isBlank_2="YES";
    let newData=[];
    for(let i=0;i<data.length;i++){

        let bloodPresure =data[i];

        let measure=bloodPresure.measured_at
        let date=new Date(measure*1000)
        let currentHour=date.getHours();
        let currentDay=parseInt((measure-8*3600)/3600/24);
        if(i==0){
            day_start=currentDay;//第一个 要给起始值 为以后的做定位
        }
        let dis=currentDay-day_start;
        let newBp={}
        if(currentDay<day){
            newBp.y_high=bloodPresure.high;
            newBp.y_low=bloodPresure.low;
            if(0<=currentHour&&currentHour<12){
                newBp.x=dis-0.3;
                isBlank_0="NO";
                isBlank_1="YES";
                isBlank_2="YES";
            }else if(12<=currentHour&&currentHour<18){
                newBp.x=dis;
                isBlank_0="NO";
                isBlank_1="YES";
                isBlank_2="YES";
            }else {
                newBp.x=dis+0.3
                isBlank_0="NO";
                isBlank_1="NO";
                isBlank_2="NO";
            }
            newData.push(newBp)
            day=currentDay;
            sum=1;//此时 ==1
        }else{
            if(sum==3)continue;
            else {
                if((0<=currentHour&&currentHour<12&&isBlank_0==="NO")||(12<=currentHour&&currentHour<18&&isBlank_1==="NO")||(18<=currentHour&&currentHour<24&&isBlank_2==="NO"))continue ;
                newBp.y_high=bloodPresure.high;
                newBp.y_low=bloodPresure.low;
                if(0<=currentHour&&currentHour<12){
                    newBp.x=dis-0.3;
                    isBlank_0="NO";
                    isBlank_1="YES";
                    isBlank_2="YES";
                }else if(12<=currentHour&&currentHour<18){
                    newBp.x=dis
                    isBlank_0="NO";
                    isBlank_1="NO";
                    isBlank_2="YES";
                }else {
                    newBp.x=dis+0.3;
                    isBlank_0="NO";
                    isBlank_1="NO";
                    isBlank_2="NO";
                }
                newData.push(newBp)
                sum++;
                ;
            }
        }
    }
    return newData;
}


function getBloodPressureOfMonth(data){
    let newData=[];
    let shouldDay=0;
    let day_start=0;
    for(let i=0;i<data.length;i++){
        let bp=data[i];
        let measure=bp.measured_at
        let currentDay=parseInt((measure-8*3600)/3600/24);
        if(i==0){
            day_start=currentDay;//第一个 要给起始值 为以后的做定位
        }
        let dis=currentDay-day_start;
        if(currentDay<=shouldDay)continue;

        shouldDay=currentDay;
        let newBp={}
        newBp.x=dis,
        newBp.y_high=bp.high,
        newBp.y_low=bp.low
        newData.push(newBp)
    }
    return newData;
}





function getBloodPresureOfYear(data){
    let currentTime;
    let allCount_high=0;
    let allCount_low=0;
    let numCount=0;
    let newData=[]

    for(let i=0;i<data.length;i++){
        let bp=data[i];
        let measure=bp.measured_at
        let currentDay=parseInt((measure-8*3600)/3600/24);
        if(i==0){
            currentTime=currentDay;
        }
        let dis=currentDay-currentTime;
        if(dis>7){
            let newBp=data[i-1];
            newBp.y_high=allCount_high/numCount;
            newBp.y_low=allCount_low/numCount;
            newBp.x=dis;
            newData.push(newBp)
            allCount_high=bp.high
            allCount_low=bp.low
            numCount=1;
            currentTime=currentDay;
        }else{
            //更新数据
            allCount_high+=bp.high
            allCount_low+=bp.low
            numCount++;
            if(i==data.count-1){
                let newBp=data[i];
                newBp.y_high=allCount_high/numCount;
                newBp.y_low=allCount_low/numCount;
                newBp.x=dis;
                newData.push(newBp)
            }
        }

    }

    return newData;
}



//获取最终可以用作显示的数据（经处理过的 有 x y 的血压数据）
function getShowDataByOriginData(data){
    let hights=[];
    let lows=[];
    let diss=[];
    for(let i=0;i<data.length;i++){
        let bp=data[i];
        let heigh={
            y:bp.y_high,
            x:bp.x
        }
        let low={
            y:bp.y_low,
            x:bp.x
        }
        let dis={
            y:bp.y_high-bp.y_low,
            x:bp.x
        }
        hights.push(heigh)
        lows.push(low)
        diss.push(dis)
    }
    return {
        height:hights,
        low:lows,
        dis:diss,
    }
}

function getXAxisTypeWeekBy(startTime,index){
    if(index===0){
        var date=new Date(startTime*1000);
        var nd= new Date();
        nd.setFullYear(date.getFullYear());
        nd.setMonth(date.getMonth());
        nd.setDate(date.getDate());
        window.startTime=nd.getTime();
    }
    var now=window.startTime+index*24*3600*1000;
    var dd=new Date(now)
    return dd.getFullYear()+"-"+ (dd.getMonth()+1)+"-"+ dd.getDate();
}
function getXAxisTypeMonthBy(startTime,index){
    if(index===0){
        var date=new Date(startTime*1000);
        var nd= new Date();
        nd.setFullYear(date.getFullYear());
        nd.setMonth(date.getMonth());
        nd.setDate(date.getDate());
        window.startTime=nd.getTime();
    }
    var now=window.startTime+index*24*3600*1000;
    var dd=new Date(now)
    if(index%7!=0)return ""
    else return dd.getFullYear()+"-"+ (dd.getMonth()+1)+"-"+ dd.getDate();
}

var MORNING="MORNING"
var RADOM="RADOM"
var PRE_BREAKFAST="PRE_BREAKFAST"
var POST_BREAKFAST="POST_BREAKFAST"
var PRE_LUNCH="PRE_LUNCH"
var POST_LUNCH="POST_LUNCH"
var PRE_SUPPER="PRE_SUPPER"
var POST_SUPPER="POST_SUPPER"
var PRE_SLEEP="PRE_SLEEP"

var BLOOD_DATA_TYPE_ALLDAY="全天"
var BLOOD_DATA_TYPE_PRE="餐前"
var BLOOD_DATA_TYPE_POST="餐后"
var BLOOD_DATA_TYPE_SLEEP="睡前"

function getDisDay(day1,day2){
    let day1s=day1.split("-"); //字符分割
    let day2s=day2.split("-"); //字符分割
    let date1=new Date()
    date1.setFullYear(day1s[0],day1s[1],day1s[2])
    let date2=new Date()
    date2.setFullYear(day2s[0],day2s[1],day2s[2])
    return parseInt((date2.getTime()-date1.getTime())/(24*60*60*1000));
}


function getBloodSugarXY(sugar,startTime,type){
    let period=sugar.period;
    let date= sugar.date;
    let day=getDisDay(startTime,date)
    let newSugar={};
    if(MORNING===period)return ;
    if(type===BLOOD_DATA_TYPE_ALLDAY){
        if(PRE_BREAKFAST===period)newSugar.x=day;
        else if(POST_BREAKFAST===period)newSugar.x=day+1/7.0;
        else if(PRE_LUNCH===period)newSugar.x=day+2/7.0;
        else if(POST_LUNCH===period)newSugar.x=day+3/7.0;
        else if(PRE_SUPPER===period)newSugar.x=day+4/7.0;
        else if(POST_SUPPER===period)newSugar.x=day+5/7.0;
        else if(PRE_SLEEP===period)newSugar.x=day+6/7.0;
    }
    if(type===BLOOD_DATA_TYPE_PRE){
        if(PRE_BREAKFAST===period)newSugar.x=day;
        else if(PRE_LUNCH===period)newSugar.x=day+0.33;
        else if(PRE_SUPPER===period)newSugar.x=day+0.66;
    }
    if(type===BLOOD_DATA_TYPE_POST){
        if(POST_BREAKFAST===period)newSugar.x=day;
        else if(POST_LUNCH===period)newSugar.x=day+0.33;
        else if(POST_SUPPER===period)newSugar.x=day+0.66;
    }
    if(type===BLOOD_DATA_TYPE_SLEEP) {
        if (PRE_SLEEP === period) newSugar.x = day;
    }
    return newSugar;
}

function getCategoryBloodSugar(originArray){
    let preArray=[];
    let postArray=[];
    let sleepArray=[];
    let allArray=[];
    if(originArray.length==0)return ;
    let sugar=originArray[0];
    let startTime=sugar.date;
    for(let i=0;i<originArray.length;i++){
        let sugar=originArray[i];
        let period=sugar.period;//时间段
        if(MORNING===period)continue;//旧数据干扰
        if(RADOM===period)continue;
        if(PRE_BREAKFAST===period||PRE_LUNCH ===period||PRE_SUPPER ===period){
            let sugarnew= getBloodSugarXY(sugar,startTime,BLOOD_DATA_TYPE_PRE)
            if(!sugarnew.x)continue;
            sugarnew.y=sugar.value
            preArray.push(sugarnew)
        }
        if(POST_BREAKFAST===period||POST_LUNCH ===period||POST_SUPPER===period){
            let  sugarnew= getBloodSugarXY(sugar,startTime,BLOOD_DATA_TYPE_POST)
            if(!sugarnew.x)continue;
            sugarnew.y=sugar.value
            postArray.push(sugarnew)
        }
        if(PRE_SLEEP===period){
            let sugarnew= getBloodSugarXY(sugar,startTime,BLOOD_DATA_TYPE_SLEEP)
            if(!sugarnew.x)continue;
            sugarnew.y=sugar.value
            sleepArray.push(sugarnew)
        }
        let sugarnew=getBloodSugarXY(sugar,startTime,BLOOD_DATA_TYPE_ALLDAY)
        if(!sugarnew.x)continue;
        sugarnew.y=sugar.value
        allArray.push(sugarnew)
    }
    return {
        preArray:preArray,
        postArray:postArray,
        sleepArray:sleepArray,
        allArray:allArray
    }
}




var MVeanDsConfigure=function(conName){
    this.conName=conName
    this.xAxisClassName="XAxis";
    this.gridLineClassName="Gridline";
    this.referLineClassName="Referline";
    this.y2AxisClassName="YAaxisR";
    this.yAxisClassName="YAaxisL";
    this.padding={
        left: 30,//左边距  用于显示左边的Y轴
        top: 10,//顶边距  用于用于给最上方的y值流出空间
        right: 20,
        bottom: 30//底边距  用于用于给下方的X轴流出空间
    }
    //显示的数据范围 以圆点为标准
    this.xDataDomain=[0,15];//真实的数据
    this.yDomain=[40,180];
    this.unitIntervalu=30;
    this.circleClickEvent=function(d,i){
    };
    this.circleOverEvent=function(d,i){
    };




}


var MCircleConfigure=function(data,name){
    this.option={
        heightColor: "rgba(255,69,91,1)",
        lowColor: "rgba(239,187,13,1)",
        normalColor:"rgba(27,189,143,1)"
    }
    this.name=name;
    this.data=data;
    this.clickEvent=(d,i,x,y)=>{console.log("点击坐标"+x+"--"+y)}
    this.styleDict={
        "stroke-dasharray":function(d,i){return ""},
        "stroke-width":function(d,i){return 1;},
        "stroke":function(d,i){return "green";},
        "fill":function(d,i){return "white";},
        "r":function(d,i){return 3;},
    }
}


var MLineConfigure=function(data,name){
    this.svg;
    this.data=data;
    this.name=name;
    this.clickEvent=(d,i,x,y)=>{console.log("点击坐标"+x+"--"+y)}
    this.styleDict={
        "stroke-dasharray":function(d,i){return ""},
        "stroke-width":function(d,i){return 1;},
        "stroke":function(d,i){return "rgba(27,189,143,1)";},
        "fill":function(d,i){return "none";},
    }
}


var MAxisConfigure=function(name){
    this.p;
    this.orient="bottom";
    this.name=name;
    this.ticks=15;
    this.text=(d)=>{return d;}
    this.linear;


    this.width;//正常情况下无太多意义  默认为与滚动内容一样宽
    this.height;//正常情况下无太多意义
    this.x=0;//正常情况下无太多意义 x轴起点
    this.y=40;//正常情况下无太多意义 x轴在纵坐标位置

    this.xPix=0;//正常情况下无太多意义 x轴起点
    this.yPix=40;//正常情况下无太多意义 x轴在纵坐标位置

    //关于 x与y  全部是以最原始的坐标轴为基准  两者之间并没有任何关系 （原坐标是于padding相关 不用管了）
}



var MVeanDs=function(_id){
    var self=this;
    this.classname=_id;
    this.initStyle=function(configure){
        this.configure=configure;
        this.padding=this.configure.padding;
        this.lineBoundesHeight=$(_id).height()-15;//15是为了给windows下浏览器下方的滚动条预留的位置  否则横坐标会被阻挡
        this.lineBoundesWidth=$(_id).width();
        this.xDataDomain=this.configure.xDataDomain;//真实的数据
        this.yDomain=this.configure.yDomain;
        this.unitIntervalu=this.configure.unitIntervalu;
        this.contentWidth=(this.xDataDomain[1]-this.xDataDomain[0])*this.unitIntervalu;
        this.xPixRange=[0, this.contentWidth];//实际显示的像素
        this.yRange=[this.lineBoundesHeight-this.padding.bottom, this.padding.top];//此参数无需外接设置
        //构造比例尺
        this.xlinear = d3.scale.linear()
            .domain(this.xDataDomain)
            .range(this.xPixRange);
        this.ylinear = d3.scale.linear()
            .domain(this.yDomain)
            .range(this.yRange);

        this.line=d3.svg.line()
            .x(function(d){
                return this.xlinear(d.x);
            })
            .y(function(d){
                return this.ylinear(d.y);
            })
            .interpolate("linear")//插值模式

        if(this.lincon===undefined){
            this.lincon=d3.select(_id)
                .append("div")
                .attr("class",this.configure.conName)
            this.scrollView=this.lincon.append("div");

        }
        this.lincon.attr("width", this.lineBoundesWidth)       //设定宽度
            .attr("height", this.lineBoundesHeight)    //设定高度
        this.scrollView.attr("width", this.lineBoundesWidth)       //设定宽度
            .attr("height", this.lineBoundesHeight)

    }



    //移除制定内容
    this.removeLineCon=function(name){
        //this.lincon=d3.select("."+this.configure.conName);
        this.lincon.selectAll("."+name).remove();
    }
    //移除制定内容
    this.removeSliceCon=function(name){
        d3.select(this.classname).selectAll("."+name).remove();
    }



    //添加线
    this.addLine=function(lineconfigure){
        let configure=lineconfigure;
        this.scrollView
            .attr("width", this.contentWidth)       //设定宽度
            .attr("height", this.lineBoundesHeight)    //设定高度

           let svg=this.scrollView
                .append("svg")
                .attr("class", configure.name) //添加一个svg元素
                .attr("width", this.contentWidth)       //设定宽度
                .attr("height", this.lineBoundesHeight)    //设定高度
        let path= svg.selectAll("path")
            .data(configure.data)
            .enter()
            .append("path")
            .attr("d",this.line(configure.data))
        for (var key in configure.styleDict) {
            path.attr(key,configure.styleDict[key]);
        }
        return svg;
    }
    //添加圆点
    this.addCircle=function(CircleConfigure){
        let configure=CircleConfigure;
        this.scrollView
            .attr("width", this.contentWidth)       //设定宽度
            .attr("height", this.lineBoundesHeight)    //设定高度
        let svg = this.scrollView
            .append("svg")
            .attr("class", configure.name) //添加一个svg元素
            .attr("width", this.contentWidth)       //设定宽度
            .attr("height", this.lineBoundesHeight)    //设定高度

        let c= svg.selectAll('circle')
            .data(configure.data)
            .enter()
            .append('circle')
            .attr('cx', function(d) {
                return self.xlinear(d.x);
            })
            .attr('cy', function(d) {
                return self.ylinear(d.y);
            })
            .on("click",(d,i)=>{
                this.configure.circleClickEvent(d,i)
                console.log("d=="+d)
            })
            .on("mouseover",(d,i)=>{
                this.configure.circleOverEvent(d,i)
                console.log("d=="+d)
            })

        for (var key in configure.styleDict) {
            c.attr(key,configure.styleDict[key]);
        }
    }


    //添加横坐标 （动）
    //若name相同  则重置
    this.addAxisSport=function(axisconfigure){
        let configure=axisconfigure;
        if(configure.width===undefined)configure.width=self.contentWidth;
        if(configure.height===undefined)configure.height=self.lineBoundesHeight;
        if(configure.linear===undefined)configure.linear=self.xlinear;
        d3.select(this.classname).select("."+configure.name).remove()
        //横坐标轴构造
        let Axis = d3.svg.axis()
            .scale(configure.linear)
            .orient(configure.orient)
            .ticks(configure.ticks)
            .tickFormat(function(d){
                return configure.text(d);
            })
        this.scrollView
            .attr("width", this.contentWidth)       //设定宽度
            .attr("height", this.lineBoundesHeight)    //设定高度

        let svg=this.scrollView
            .append("svg")          //添加一个svg元素
            .attr("class",configure.name)
            .attr("width", configure.width)       //设定宽度
            .attr("height",configure.height)    //设定高
        svg.append("g")
            .attr("transform","translate("+this.xlinear(configure.x)+","+this.ylinear(configure.y)+")")
            .call(Axis)
    }
    //添加坐标 （静）
    //若name相同  则重置
    this.addAxisSilent=function(axisconfigure){
        let configure=axisconfigure;
        if(configure.width===undefined)configure.width=self.contentWidth;
        if(configure.height===undefined)configure.height=self.lineBoundesHeight;
        if(configure.linear===undefined)configure.linear=self.xlinear;
        d3.select(this.classname).select("."+configure.name).remove()
        let svgyAxis = d3.select(this.classname)
            .append("svg")
            .attr("class",configure.name)
            .attr("width", configure.width)       //设定宽度
            .attr("height",configure.height)    //设定高
        //纵坐标构造
        let yAxis = d3.svg.axis()
            .scale(configure.linear)
            .orient(configure.orient)
            .ticks(configure.ticks)
            .tickFormat(function(d){
                return configure.text(d);
            })
        svgyAxis.append("g")
            .attr("transform","translate("+this.padding.left+","+(self.lineBoundesHeight-self.padding.bottom-this.ylinear(configure.y))+")")
            .call(yAxis)
    }


    //以下方法 由封装类调用
    //添加一条完整的线（线+圆点）
    this.addLineByConfigure=function(lineConfigure){
        this.removeLineCon(lineConfigure.name)
        this.addLine(lineConfigure)
    }
    this.addCircleByConfigure=function(circleConfigure){
        this.removeLineCon(circleConfigure.name)
        this.addCircle(circleConfigure)
    }

    this.addYAxisL=function(name,getText,scale){
        this.removeLineCon(name)
        let y=new MAxisConfigure(name);
        y.orient="left"
        y.y=this.yDomain[0];
        y.linear=this.ylinear;
        y.ticks=(this.yDomain[1]-this.yDomain[0])*scale;
        y.text=function(d){
            return getText(d);
        };
        this.addAxisSilent(y)
    }
//          添加横坐标
//    this.addXAxis=function(name,getTextaddXAxisAS){
//        this.addXAxisAS(name,getText,10);
//    }
    this.addXAxisAS=function(name,getText,scalse){
        this.removeLineCon(name)
        let xAxisConfigure=new MAxisConfigure(name)
        xAxisConfigure.y=self.configure.yDomain[0]
        xAxisConfigure.ticks=(this.configure.xDataDomain[1]-this.configure.xDataDomain[0])*scalse;
        xAxisConfigure.text=function(d){
            return getText(d);
        }
        this.addAxisSport(xAxisConfigure)
    }

//          添加右侧纵坐标
    this.addYAxisR=function(name,getStr,scale){
        this.removeSliceCon(name)
        let y=new MAxisConfigure(name);
        y.orient="right"
        y.y=this.yDomain[0];
        y.linear=this.ylinear;
        y.ticks=(this.yDomain[1]-this.yDomain[0])*scale;
        y.text=function(d){
            return  getStr(d);
        }
        this.addAxisSilent(y)
    }
//          添加网格线
    this.addGridLine=function(name,gridDis){
        this.removeLineCon(name)
        var dis=this.configure.xDataDomain[1]-this.configure.xDataDomain[0];
        for(let i=0;i<dis;i+=gridDis){
            var data=[{x:i,y:this.configure.yDomain[0]},{x:i,y:this.configure.yDomain[1]}]
            let flagL=new MLineConfigure(data,name)
            flagL.styleDict["stroke-dasharray"]=function(d){return "2,4";}
            flagL.styleDict["stroke-width"]=function(d,i){return 0.5;}, flagL.styleDict["stroke"]=function(d){return "rgba(193,193,193,1)";}
            this.addLine(flagL,false);//添加
        }
    }
//          添加参考线
    this.addReferline=function(name,data){
        this.removeLineCon(name)
        for(let i=0;i<data.length;i++){
            var d=[{x:0,y:data[i]},{x:this.configure.xDataDomain[1],y:data[i]}]
            let flagL3=new MLineConfigure(d,name)
            flagL3.styleDict["stroke"]=function(d){return "rgba(59,170,255,0.50)";}
            flagL3.styleDict["stroke-width"]=function(d,i){return 0.5;},
                this.addLine(flagL3);//添加折线
        }
    }
    this.addReferlineACount=function(data,scale,lineTag,yAaxisTag){
        this.removeLineCon(lineTag)
        this.removeSliceCon(yAaxisTag)
        this.addYAxisR(yAaxisTag,function(d){
            for(let i=0;i<data.length;i++){
                if(data[i]===d)return data[i]+""
            }
            return ""
        },scale)
        this.addReferline(lineTag,data)
    }
    //仅仅刷新坐标 （横坐标 网格线）
    this.setAXis=function(count,unit,getXAxisStr,scale,gridDis){
        this.configure.unitIntervalu=unit;
        this.configure.xDataDomain=[0,count];
        this.configure.getXAxisAtr=getXAxisStr;
        this.initStyle(this.configure);//初始化样式   在设置完各种属性之后执行
        this.addXAxisAS(this.configure.xAxisClassName,this.configure.getXAxisAtr,scale)
        this.addGridLine(this.configure.gridLineClassName,gridDis);
    }

    //根据类型 设置横坐标
    this.setAxisByType=function(startTime,type,scale){
        this.startTime=startTime*1000;
        let date=new Date(startTime*1000)
        let dis = (new Date().getTime() - date.getTime()) / 24/3600/1000;
        var unit;
        var getTest;
        if(type==="周"){
            unit=140;
            getTest=(index)=>{
                let now=this.startTime+index*24*3600*1000;
                var dd=new Date(now)
                return dd.getFullYear()+"-"+ (dd.getMonth()+1)+"-"+ dd.getDate();
            }
            this.setAXis(dis+1,unit,getTest,scale,1);
        }
        if(type==="月"){
            unit=40;
            getTest=(index)=>{
                let now=this.startTime+index*24*3600*1000;
                var dd=new Date(now)
                if(index%7==0)
                    return dd.getFullYear()+"-"+ (dd.getMonth()+1)+"-"+ dd.getDate();
                else return ""
            }
            this.setAXis(dis+1,unit,getTest,scale,7);
        }
        if(type==="年"){
            unit=10;
            getTest=(index)=>{
                let now=this.startTime+index*24*3600*1000;
                var dd=new Date(now)
                if(index%30==0)
                    return (dd.getMonth()+1)+"月";
                else return ""
            }
            this.setAXis(dis+1,unit,getTest,scale,30);
        }
        if(type==="日"){
            unit=250;
            getTest=(index)=>{
                if(index%4==0)return "早餐"
                if(index%4==1)return "午餐"
                if(index%4==2)return "晚餐"
                if(index%4==3)return "睡前"
                return ""
            }
            this.setAXis(dis+1,unit,getTest,scale,1);
        }
        //this.addReferlineACount([90,140],1,this.configure.referLineClassName,this.configure.y2AxisClassName)
    }

}


var BPLine=function(_id){
    this.bpConfigure={
        startTime:0,
        allData:[],

        showWeekHData:[],
        showMonthHData:[],
        showYearHData:[],

        showWeekLData:[],
        showMonthLData:[],
        showYearLData:[],

        showWeekCData:[],
        showMonthCData:[],
        showYearCData:[],

    }

    MVeanDs.apply(this,[_id])
    this.configure=new MVeanDsConfigure("mBpScrollerPart");
    this.configure.xDataDomain=[0,300]
    this.configure.unitIntervalu=100;
    //参考线与纵坐标的个性化设置
    this.setConfigure=function(configure){
        this.configure=configure;
        this.initStyle(this.configure);//初始化样式   在设置完各种属性之后执行
        //需要使用到比例尺
        this.addReferlineACount([90,140],1,this.configure.referLineClassName,this.configure.y2AxisClassName)
        //添加纵坐标
        this.addYAxisL(this.configure.yAxisClassName,function(d){
            if(d%20==0)return d;
            else return ""
        },0.5)
    }
    this.setConfigure(this.configure,true);




    this.addLineAC=function(data1,data2){
        let linecon=new MLineConfigure(data1,"line1")
        this.addLineByConfigure(linecon)
        let linecon2=new MLineConfigure(data2,"line2")
        this.addLineByConfigure(linecon2)
        var cd=data1.concat(data2);
        let circleConfigure=new MCircleConfigure(cd,"c1")   //添加左侧纵坐标
        circleConfigure.styleDict["stroke"]=function(d,i){
            if(d.y>=140)return  circleConfigure.option.heightColor;
            if(d.y<=90)return  circleConfigure.option.lowColor;
            return circleConfigure.option.normalColor;
        }
        this.addCircleByConfigure(circleConfigure)
    }

    //终极调用方式 传递类型
    this.showDataByType=function(type){
        if(type==="周"){
            this.setAxisByType(this.bpConfigure.startTime,type,1);
            this.addReferlineACount([90,140],1,this.configure.referLineClassName,this.configure.y2AxisClassName)
            this.addLineAC(this.bpConfigure.showWeekHData,this.bpConfigure.showWeekLData)
        }
        if(type==="月"){
            this.setAxisByType(this.bpConfigure.startTime,type,1);
            this.addReferlineACount([90,140],1,this.configure.referLineClassName,this.configure.y2AxisClassName)
            this.addLineAC(this.bpConfigure.showMonthHData,this.bpConfigure.showMonthLData)
        }
        if(type==="年"){
            this.setAxisByType(this.bpConfigure.startTime,type,0.1);
            this.addReferlineACount([90,140],1,this.configure.referLineClassName,this.configure.y2AxisClassName)
            this.addLineAC(this.bpConfigure.showYearHData,this.bpConfigure.showYearLData)
        }
    }
}

var PPLine=function(_id){
    this.ppConfigure={
        startTime:0,
        allData:[],
        showWeekData:[],
        showMonthData:[],
        showYearData:[],
    }

    MVeanDs.apply(this,[_id])
    this.configure=new MVeanDsConfigure("mPpScrollerPart");
    this.configure.xDataDomain=[0,300]
    this.configure.yDomain=[0,100]
    this.configure.unitIntervalu=100;
    //参考线与纵坐标的个性化设置
    this.setConfigure=function(configure){
        this.configure=configure;
        this.initStyle(this.configure);//初始化样式   在设置完各种属性之后执行
        //需要使用到比例尺
        this.addReferlineACount([20,60],1,this.configure.referLineClassName,this.configure.y2AxisClassName)
        //添加纵坐标
        this.addYAxisL(this.configure.yAxisClassName,function(d){
            if(d%20==0)return d;
            else return ""
        },0.5)
    }
    this.setConfigure(this.configure,true);


    this.addLineAC=function(data1){
        let linecon = new MLineConfigure(data1, "ppline")
        this.addLineByConfigure(linecon)
        let circleConfigure = new MCircleConfigure(data1, "ppcircle")
        circleConfigure.styleDict["stroke"] = function (d, i) {
            if (d.y >= 60)return circleConfigure.option.heightColor;
            if (d.y <= 20)return circleConfigure.option.lowColor;
            return circleConfigure.option.normalColor;
        }
        this.addCircleByConfigure(circleConfigure)
    }




    //终极调用方式 传递类型
    this.showDataByType=function(type){
        if(type==="周"){
            this.setAxisByType(this.ppConfigure.startTime,type,1);
            this.addReferlineACount([20,60],1,this.configure.referLineClassName,this.configure.y2AxisClassName)
            this.addLineAC(this.ppConfigure.showWeekData)
        }
        if(type==="月"){
            this.setAxisByType(this.ppConfigure.startTime,type,1);
            this.addReferlineACount([20,60],1,this.configure.referLineClassName,this.configure.y2AxisClassName)
            this.addLineAC(this.ppConfigure.showMonthData)
        }
        if(type==="年"){
            this.setAxisByType(this.ppConfigure.startTime,type,0.1);
            this.addReferlineACount([20,60],1,this.configure.referLineClassName,this.configure.y2AxisClassName)
            this.addLineAC(this.ppConfigure.showYearData)
        }
    }

}

//血糖曲线 日 周 月的数据是一样的  只是显示方式不同
var BSLine=function(_id){
    this.bsConfigure={
        startDate:"",
        startTime:0,
        allData:[],
        showDayData:undefined,
        showAllData:[],
        showPreData:[],
        showPostData:[],
        showSleepPreData:[],
        bloodTarget:[],
        bloodTargetAll:[5,10],
        bloodTargetPre:[5,8],
        bloodTargetPost:[6,9],
        bloodTargetSleep:[,5,9],
    }
    MVeanDs.apply(this,[_id])
    this.configure=new MVeanDsConfigure("mBsScrollerPart");
    this.configure.xDataDomain=[0,300]
    this.configure.yDomain=[0,20]
    this.configure.unitIntervalu=100;

    //参考线与纵坐标的个性化设置
    this.setConfigure=function(configure){
        this.configure=configure;
        this.initStyle(this.configure);//初始化样式   在设置完各种属性之后执行
        this.addYAxisL(this.configure.yAxisClassName,function(d){
            if(d<=15){
                if(d%2==1)return d;
            }else if(d==20){
                return "30";
            }
            return ""
        },1)
    }
    this.setConfigure(this.configure,true);

    //**********************外界调用*********************
    this.addLineAC=function(data,Refer){
        let linecon = new MLineConfigure(data,"bsline")
        this.addLineByConfigure(linecon)
        let circleConfigure = new MCircleConfigure(data,"bscircle")
        circleConfigure.styleDict["stroke"] = function (d, i) {
            if (d.y >= Refer[1])return circleConfigure.option.heightColor;
            if (d.y <= Refer[0])return circleConfigure.option.lowColor;
            return circleConfigure.option.normalColor;
        }
        this.addCircleByConfigure(circleConfigure)
    }

    //终极调用方式 传递类型
    this.showDataByType=function(peroid,type){
        let bloodTarget=[4.4,9.0]
        let data;
        if(type==="周"){
            this.setAxisByType(this.bsConfigure.startTime,type,1);
        }
        else if(type==="月"){
            this.setAxisByType(this.bsConfigure.startTime,type,1);
        }
        else if(type==="日"){
            this.setAxisByType(this.bsConfigure.startTime,type,1);
            if(this.bsConfigure.showDayData===undefined){
                this.bsConfigure.showDayData=[];
                for(let i=0;i<this.bsConfigure.showAllData.length;i++){
                    let bd={
                        x:this.bsConfigure.showAllData[i].x*4,
                        y:this.bsConfigure.showAllData[i].y
                    }
                    this.bsConfigure.showDayData.push(bd)
                }
            }
            this.addReferlineACount([4.4,10],1,this.configure.referLineClassName,this.configure.y2AxisClassName)
            this.addLineAC(this.bsConfigure.showDayData,[4.4,10]);
            return ;
        }
        if(peroid==="全天"){
            data=this.bsConfigure.showAllData;
            bloodTarget=this.bsConfigure.bloodTargetAll;
        }
        else if(peroid==="餐前"){
            data=this.bsConfigure.showPreData;
            bloodTarget=this.bsConfigure.bloodTargetPre;
        }
        else if(peroid==="餐后"){
            data=this.bsConfigure.showPostData;
            bloodTarget=this.bsConfigure.bloodTargetPost;
        }
        else if(peroid==="睡前"){
            data=this.bsConfigure.showSleepPreData;
            bloodTarget=this.bsConfigure.bloodTargetSleep;
        }
        this.addReferlineACount([4.4,10],1,this.configure.referLineClassName,this.configure.y2AxisClassName)
        this.addLineAC(data,[4.4,10]);
    }


}