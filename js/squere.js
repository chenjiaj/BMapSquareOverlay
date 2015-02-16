/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-2-4
 * Time: 上午10:37
 * leafletjs地图文档地址
 * http://leafletjs.com/reference.html#map-zoomlevelschange
 */
// 定义自定义覆盖物的构造函数
function SquareOverlay(center, length, color,map){
    this._center = center;
    this._color = color;
    this.width = length;
    this.height = length;
    this.map = map;
    this.initialize();
}

// 实现初始化方法
SquareOverlay.prototype.initialize = function(){
    // 保存map对象实例

    // 创建div元素，作为自定义覆盖物的容器
    var div = $('<div class="area">'+
        '<div class="ui-resizable-handler ui-resizable-ne"></div>'+
        '<div class="ui-resizable-handler ui-resizable-nw"></div>'+
        '<div class="ui-resizable-handler ui-resizable-se"></div>'+
        '<div class="ui-resizable-handler ui-resizable-sw"></div>'+
        '<div class="ui-resizable-handler ui-resizable-n"></div>'+
        '<div class="ui-resizable-handler ui-resizable-s"></div>'+
        '<div class="ui-resizable-handler ui-resizable-e"></div>'+
        '<div class="ui-resizable-handler ui-resizable-w"></div>'+
        '</div>');

    div.css({
        position:'absolute',
        width:this.width + "px",
        height:this.height + "px",
        border:'1px solid #ccc',
        background:this._color
    });

    // 保存div实例
    this._div = div.get(0);
    this.div = div;
    this.createResizer(this.map);
    this.setPosition();
    this.setGeography();

    var _this = this;
    this.map.on('zoomend',function(){//改变地图层级时触发的事件
        _this.setWH();
        _this.setCenter();
        _this.setPosition();
    });
    return this._div;

}

SquareOverlay.prototype.createResizer = function(){//创建
    this._map = this.map;
    var _this = this;
    // 将div添加到覆盖物容器中
    this.map.getPanes().overlayPane.appendChild(_this._div);
    var resizer = new Resizer();
    var $wrapper = _this._div;
    $('.ui-resizable-handler').bind('mousedown', function(e){
        e.stopPropagation(); //防止缩放时冒泡，最终缩放成了拖动
    });
    resizer.addHandler($('.ui-resizable-nw'), {
        left: 1,
        top: 1,
        width: -1,
        height: -1
    }, 'nw-resize');
    resizer.addHandler($('.ui-resizable-ne'), {
        left: 0,
        top: 1,
        width: 1,
        height: -1
    }, 'ne-resize');
    resizer.addHandler($('.ui-resizable-sw'), {
        left: 1,
        top: 0,
        width: -1,
        height: 1
    }, 'sw-resize');
    resizer.addHandler($('.ui-resizable-se'), {
        left: 0,
        top: 0,
        width: 1,
        height: 1
    }, 'se-resize');


    resizer.addHandler($('.ui-resizable-w'), {
        left: 1,
        top: 0,
        width: -1,
        height: 0
    }, 'w-resize');
    resizer.addHandler($('.ui-resizable-e'), {
        left: 0,
        top: 0,
        width: 1,
        height: 0
    }, 'e-resize');



    resizer.addHandler($('.ui-resizable-n'), {
        left: 0,
        top: 1,
        width: 0,
        height: -1
    }, 'n-resize');

    resizer.addHandler($('.ui-resizable-s'), {
        left: 0,
        top: 0,
        width: 0,
        height: 1
    }, 's-resize');

    resizer.addHandler(this.div, {
        left: 1,
        top: 1,
        width: 0,
        height: 0
    }, 'move');
    resizer.addTarget(this.div);
    resizer.bind('afterResize', function(){
        _this.setGeography();
        _this.setCenter();
        _this.setWH();
        _this.setPosition();
    });
    $('.area').on('mousedown',function(e){
        e.stopPropagation();
        e.preventDefault();
    });
}

SquareOverlay.prototype.setCenter = function(){//当mouseup后会调用此函数，将地图居中到覆盖物的中心
    var point = this.getGeography();
    var ltPoint = this.map.latLngToLayerPoint(point.ltPoint);
    var left = ltPoint.x;
    var top = ltPoint.y
    var width=this.width;
    var height=this.height;
    var centerX = left + width / 2;
    var centerY = top + height / 2;
    var center = L.point(centerX, centerY);
    var pointa = this.map.layerPointToLatLng(center);
    this._center = [pointa.lat,pointa.lng];//因为调用panTo时会调用draw函数,因此需要重新设置中心点
    this.map.panTo(this._center);

}

SquareOverlay.prototype.setGeography = function(){
//通过地图自带的layerPointToLatLng将获取的四个点的覆盖物像素转换为四个点的地理位置
    var left = this.div.position().left;
    var top = this.div.position().top;
    this.width=this.div.width();
    this.height=this.div.height();
    var LeftTopPoint = L.point(left, top);
    var LeftBottomPoint = L.point(left, top + this.height);
    var rightTopPoint = L.point(left + this.width, top);
    var RightBottomPoint = L.point(left + this.width, top + this.height);

  /* console.log('左上角的坐标位置：'+JSON.stringify(this.div.position()));
    console.log('地理位置：');
    console.log('左上角：'+JSON.stringify(this.map.layerPointToLatLng(LeftTopPoint))+'；' +
        '左下角：'+JSON.stringify(this.map.layerPointToLatLng(LeftBottomPoint))+'；'+
        '右上角：'+JSON.stringify(this.map.layerPointToLatLng(RightBottomPoint))+'；'+
        '右下角：'+JSON.stringify(this.map.layerPointToLatLng(rightTopPoint)));*/
    this.ltPoint = this.map.layerPointToLatLng(LeftTopPoint);
    this.lbPoint = this.map.layerPointToLatLng(LeftBottomPoint);
    this.rbPoint = this.map.layerPointToLatLng(RightBottomPoint);
    this.rtPoint = this.map.layerPointToLatLng(rightTopPoint);
}

SquareOverlay.prototype.getGeography = function(){//获取矩形四个点的地理位置
    return {
        ltPoint:this.ltPoint,
        lbPoint:this.lbPoint,
        rbPoint:this.rbPoint,
        rtPoint:this.rtPoint
    }
}
SquareOverlay.prototype.setWH = function(){//设置宽高，当改变地图显示级别时
    //latLngToLayerPoint可以将地理位置改变为坐标位置
    var point = this.getGeography();
    var ltPoint = this.map.latLngToLayerPoint(point.ltPoint);
    var lbPoint = this.map.latLngToLayerPoint(point.lbPoint);
    var rbPoint = this.map.latLngToLayerPoint(point.rbPoint);
    var rtPoint = this.map.latLngToLayerPoint(point.rtPoint);
    var width = Math.abs(rtPoint.x - ltPoint.x);
    var height =Math.abs(lbPoint.y - ltPoint.y);
    this.div.width(width);
    this.div.height(height);
    this.width = width;
    this.height = height;
}
// 实现绘制方法

SquareOverlay.prototype.setPosition = function(){//当调用centerZoom 或者panTo等时都会调用此函数
    // 根据地理坐标转换为像素坐标，并设置给容器
    var latlng = L.latLng(this._center[0],this._center[1]);
    var position = this.map.latLngToLayerPoint(latlng);
        this._div.style.left = position.x - this.width / 2 + "px";
        this._div.style.top = position.y - this.height / 2 + "px";
}