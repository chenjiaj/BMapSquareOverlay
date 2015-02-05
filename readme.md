#BMapSquareOverlay自定义矩形覆盖物文档说明

------

百度地图暂时还未提供矩形覆盖物功能，虽有绘制覆盖物插件**DrawingManager**中可以绘制矩形，但是未提供拖拽和矩形编辑功能

本自定义矩形覆盖物创建一个处于编辑状态的矩形，支持大小编辑和拖拽功能，编辑后自动居中到覆盖物中心

##一、百度地图的DrawingManager插件
>*（1）例子http://developer.baidu.com/map/jsdemo.htm#f0_7
>*（2）使用文档BMapLib.DrawingManager
http://api.map.baidu.com/library/DrawingManager/1.4/docs/symbols/BMapLib.DrawingManager.html

##二、自定义矩形覆盖物使用说明
>*（1）引入jquery-1.11.1.min.js、resizer.js、squere.js文件
>*（2）在你使用的文件js中添加创建地图后再创建自定义矩形覆盖物
    var mySquare = new SquareOverlay(this.map.getCenter(), 200, "rgba(0,0,0,0.5)",this.map);
    this.map.addOverlay(mySquare);
    传入的四个参数分别是中心点point、矩形宽高、背景色、当前的map对象
>*（3）获得四个点的地理坐标位置
可以调用g自定义覆盖物对象的getGeography(),获得一个对象
return {
        ltPoint:this.ltPoint,//左上角经纬度
        lbPoint:this.lbPoint,//左下角经纬度
        rbPoint:this.rbPoint,//右上角经纬度
        rtPoint:this.rtPoint//右下角经纬度
    }