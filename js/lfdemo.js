/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-2-2
 * Time: 下午3:13
*/

(function(){

    var mapManager = {
        init:function(){
            this.createMap();
            this.createArea();
        },
        createMap:function(){
            this.point = [51.505, -0.09];
            this.map = L.map('map').setView(this.point, 13);
            var cloudmadeUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
            var subDomains = ['otile1','otile2','otile3','otile4'];
            var cloudmadeAttrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';
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
    mapManager.init();
})();