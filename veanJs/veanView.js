/**
 * Created by mayd on 17/6/1.
 */



var ButtonGroupConfigure=function(titles){
    this.titles=titles
    this.fontSize="13px";
    this.tintColor="rgba(27,189,143,1)";
    this.borderColor=this.tintColor;
    this.cursor="pointer"
    this.selectedStyle={
        "background":"rgba(27,189,143,1)",
        "textColor":"white",
    }
    this.unselectedStyle={
        "background":"rgba(27,189,143,0)",
        "textColor":"rgba(27,189,143,1)",
    }
    this.setDefaultType=function(type){
        if(type===1){
            this.fontSize="15px"
            this.selectedStyle["background"]="white"
            this.selectedStyle["textColor"]="rgba(27,189,143,1)"
            this.unselectedStyle["background"]="white"
            this.unselectedStyle["textColor"]="rgba(100,100,100,1)"
            this.borderColor="white"
        }
    }

}
var buttonGroup=function(dom,configure){
    let mConfigure=configure;
    let d=dom;
    d.css({
        "background":"white",
        "overflow":"hidden",
        "border":"1px solid "+configure.borderColor,
        "background":"white",
        "border-radius":"5px"
    })
    this.addItemClickEvent=function(index,e){

    }
    for(let i=0;i<configure.titles.length;i++){
        d.append("<a></a>")
    }
    this.setCurrentIndexState=function(index){
        for(let i=0;i<mConfigure.titles.length;i++){
            let color;
            let background;
            if(index===i){
                color=mConfigure.selectedStyle["textColor"],
                    background  = mConfigure.selectedStyle["background"];
            }
            else{
                color=mConfigure.unselectedStyle["textColor"],
                    background  = mConfigure.unselectedStyle["background"]
            }
            d.find("a").eq(i).css(
                {
                    "color": color,
                    "background":background
                }
            )
        }
    }
    var btns= d.find("a");
    for(let i=0;i<btns.length;i++){
        var btn=btns[i];
        btn.innerHTML=configure.titles[i]
    }
    for(let i=0;i<btns.length;i++){
        d.find("a").eq(i).on("click",(e)=>{
            this.setCurrentIndexState(i)
            this.addItemClickEvent(i,e)
        })
    }
    for(let i=0;i<btns.length;i++){
        d.find("a").eq(i).css(
            {
                "position":"absolute",
                "font-size":mConfigure.fontSize,
                "height": d.height()+"px",
                "width": d.width()/configure.titles.length+"px",
                "left": i*(d.width()/configure.titles.length)+"px",
                "line-height":d.height()+"px",
                "text-align":"center",
                "display":"inline-block",
                "cursor":configure.cursor
            }
        )
        if(i!=0){
            d.find("a").eq(i).css(
                {
                    "border-left": "1px solid "+configure.borderColor,
                }
            )
        }
    }
}