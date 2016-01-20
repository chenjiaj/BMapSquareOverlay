###[demo](http://chenjiaj.github.io/BMapSquareOverlay/lfDemo.html)
#SquareOverlay自定义矩形覆盖物文档说明

------

国外地图大多有加载限制，加载到一定数量就会收费，有一个组织提供了地图图片，另一个组织提供了使用图片的js和css
一个免费的国外地图文档地址http://leafletjs.com/reference.html#map-zoomlevelschange


##一、自定义矩形覆盖物使用说明
>###（1）引入jquery-1.11.1.min.js、resizer.js、squere.js
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
    <link rel="stylesheet" href="css/demo.css"  type="text/css"/>
    <script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
>###（2）在你使用的文件js中添加创建地图后再创建自定义矩形覆盖物
    直接使用 this.mySquare = new SquareOverlay(this.point, 200, "rgba(0,0,0,0.5)",this.map);
    this.point是一个数组[51.505, -0.09];
    
    例子：
    <pre>
    var mapManager = {
        init:function(){
            this.createMap();
            this.createArea();
        },
        createMap:function(){
            this.point = [51.505, -0.09];
            this.map = L.map('map').setView(this.point, 13);
            var  cloudmadeUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
            var	subDomains = ['otile1','otile2','otile3','otile4'];
            var	cloudmadeAttrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';
            L.tileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttrib, subdomains: subDomains}).addTo(this.map);
            /*this.map.on('click',function(e){
                console.log(e.latlng);
            });*/

        },
        createArea:function(){
            this.mySquare = new SquareOverlay(this.point, 200, "rgba(0,0,0,0.5)",this.map);
        },
        getGeography:function(){
            return this.mySquare.getGeography();
        }
    }
    //地图API功能
    mapManager.init();</pre>
>###（3）获得四个点的地理坐标位置
可以调用自定义覆盖物对象的getGeography(),获得一个对象
<pre>return {
        ltPoint:this.ltPoint,//左上角经纬度
        lbPoint:this.lbPoint,//左下角经纬度
        rbPoint:this.rbPoint,//右上角经纬度
        rtPoint:this.rtPoint//右下角经纬度
    }</pre>