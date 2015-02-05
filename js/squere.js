/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-2-4
 * Time: 上午10:37
 */
// 定义自定义覆盖物的构造函数
function SquareOverlay(center, length, color,map){
    this._center = center;
    this._color = color;
    this.width = length;
    this.height = length;
    this.map = map
}

// 继承API的BMap.Overlay
SquareOverlay.prototype = new BMap.Overlay();

// 实现初始化方法
SquareOverlay.prototype.initialize = function(map){//在执行this.map.addOverlay(mySquare)会调用此函数
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
    this.createResizer(map);
    return this._div;


}

SquareOverlay.prototype.createResizer = function(map){//创建
    this._map = map;
    var _this = this;
    // 将div添加到覆盖物容器中
    _this.map.getPanes().markerPane.appendChild(_this._div);
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
    });
    $('.area').on('mousedown',function(e){
        e.stopPropagation();
        e.preventDefault();
    });
}

SquareOverlay.prototype.setCenter = function(){//当mouseup后会调用此函数，将地图居中到覆盖物的中心
    var left = this.div.position().left;
    var top = this.div.position().top;
    var width=this.width;
    var height=this.height;
    var centerX = left + width / 2;
    var centerY = top + height / 2;
    var center = {
        x:centerX,
        y:centerY
    }
    var point = this.map.overlayPixelToPoint(center);
    this._center = point;//因为调用panTo时会调用draw函数,因此需要重新设置中心点
    this.map.panTo(new BMap.Point(point.lng,point.lat));

}

SquareOverlay.prototype.setGeography = function(){
//通过百度地图自带的apioverlayPixelToPoint将获取的四个点的覆盖物像素转换为四个点的地理位置
    var left = this.div.position().left;
    var top = this.div.position().top;
    this.width=this.div.width();
    this.height=this.div.height();
    var LeftTopPoint = {
        x:left,
        y:top
    }
    var LeftBottomPoint = {
        x:left,
        y:top + this.height
    }
    var RightBottomPoint = {
        x:left + this.width,
        y:top + this.height
    }
    var RightTopPoint = {
        x:left + this.width,
        y:top
    }

   /* console.log('左上角的坐标位置：'+JSON.stringify(this.div.position()));
    console.log('地理位置：');
    console.log('左上角：'+JSON.stringify(this.map.overlayPixelToPoint(LeftTopPoint))+'；' +
        '左下角：'+JSON.stringify(this.map.overlayPixelToPoint(LeftBottomPoint))+'；'+
        '右上角：'+JSON.stringify(this.map.overlayPixelToPoint(RightBottomPoint))+'；'+
        '右下角：'+JSON.stringify(this.map.overlayPixelToPoint(RightTopPoint)));*/

    this.ltPoint = this.map.overlayPixelToPoint(LeftTopPoint);
    this.lbPoint = this.map.overlayPixelToPoint(LeftBottomPoint);
    this.rbPoint = this.map.overlayPixelToPoint(RightBottomPoint);
    this.rtPoint = this.map.overlayPixelToPoint(RightTopPoint);
}

SquareOverlay.prototype.getGeography = function(){//获取矩形四个点的地理位置
    return {
        ltPoint:this.ltPoint,
        lbPoint:this.lbPoint,
        rbPoint:this.rbPoint,
        rtPoint:this.rtPoint
    }
}

// 实现绘制方法
SquareOverlay.prototype.draw = function(){//当调用centerZoom 或者panTo等时都会调用此函数
    // 根据地理坐标转换为像素坐标，并设置给容器
    var position = this.map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this.width / 2 + "px";
        this._div.style.top = position.y - this.height / 2 + "px";
    this.setGeography();
    //console.log(JSON.stringify(this.getGeography()));
}