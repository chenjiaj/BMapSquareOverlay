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
            this.map = new BMap.Map('map');
            var poi = new BMap.Point(116.307852,40.057031);
            this.map.centerAndZoom(poi, 16);
            this.map.enableScrollWheelZoom();
            //this.map.disableDragging();
           /* this.map.addEventListener("click",function(e){
                console.log(e.point.lng + "," + e.point.lat);
            });*/
        },
        createArea:function(){
            this.mySquare = new SquareOverlay(this.map.getCenter(), 200, "rgba(0,0,0,0.5)",this.map);
            this.map.addOverlay(this.mySquare);
            console.log(JSON.stringify(this.getGeography()));
        },
        getGeography:function(){
            return this.mySquare.getGeography();
        }
    }
    // 百度地图API功能
    mapManager.init();
})();