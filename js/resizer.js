function Resizer(){
    this._$targetList = [];
    this._createStyleSheet();//创建一个styleSheet，方便操作光标
    this._events = {}; //容纳各种自定义事件
    this._bindEvents();
    this._config = {
        mouseDownFunction: 'RESIZER_MOUSEDOWN'
    };
}

$.extend(Resizer.prototype, {
    /**
     * 添加一个控制器
     * */
    addHandler: function($dom, vector, cursor, auto){
        var _this = this;
        this.removeHandler($dom);
        var funcName = this._config.mouseDownFunction;

        $dom.data(funcName, (function(){
            return function(evt){
                _this._vector = vector;
                if(cursor){ //改变光标
                    _this.addCSSRule(_this._styleSheet, 'body *', 'cursor: '+ cursor +'!important;');
                }
                _this._mouseDown.call(_this, evt);
            }
        })());
        if(auto !== false){
            $dom.bind('mousedown',  $dom.data(funcName));
        }
    },
    /**
     * 去除一个控制器
     * */
    removeHandler: function($dom){
        var func = $dom.data(this._config.mouseDownFunction);
        if(func){
            $dom.unbind('mousedown', func);
            func = null;
        }
    },

    /**
     * 添加一个变换容器
     * */
    addTarget: function($dom){
        for(var i = 0; i < this._$targetList.length; i++){
            if(this._$targetList[i][0] == $dom[0]){
                return; //防止重复添加
            }
        }
        this._$targetList.push($dom);
    },
    /**
     * 去除一个变换容器
     * */
    removeTarget: function($dom){
        for(var i = 0; i < this._$targetList.length; i++){
            if(this._$targetList[i][0] == $dom[0]){
                this._$targetList.splice(i, 1);
            }
        }
    },
    removeAllTarget: function(){
        this._$targetList.length = 0;
    },
    /**
     * 手动开始一次拖动
     * */
    start: function($dom, evt){
        var func = $dom.data(this._config.mouseDownFunction);
        if(func){
            func.call(this, evt);
        }
    },

    /**
     * 获取某个dom的rect
     * */
    getDomRect: function($dom){
        var position = $dom.position();
        return {
            left: position.left
            ,top: position.top
            ,width: $dom.width()
            ,height: $dom.height()
        }
    },

    /**
     * 设置某个dom的rect
     * */
    setDomRect: function($dom, rect){
        $dom.css(rect);
    },

    /**
     * 得到最终的rect
     * */
    getTargetRect: function(startRect, vector, changeX, changeY){
        return {
            left: startRect.left + vector.left * changeX,
            top: startRect.top + vector.top * changeY,
            width: startRect.width + vector.width * changeX,
            height: startRect.height + vector.height * changeY
        }
    },

    addCSSRule: function (sheet, selector, rules, index) {
        index = index || 0;
        if("addRule" in sheet) {
            sheet.addRule(selector, rules);
        }else if("insertRule" in sheet) {
            sheet.insertRule(selector + "{" + rules + "}", index);
        }
    },

    /**
     * 绑定事件
     * */
    bind: function(evt, func){
        if(!this._events[evt]){
            this._events[evt] = [];
        }
        this._events[evt].push(func);
    },
    /**
     * 取消绑定事件
     * */
    unbind: function(evt, func){
        if(this._events[evt]){
            var events = this._events[evt];
            for(var i = 0; i < events.length; i ++){
                if(func == events[i]){
                    events[i].splice(i, 1);
                }
            }
        }
    },
    /**
     * 触发事件
     * */
    trigger: function(evt){
        if(this._events[evt]){
            var events = this._events[evt];
            for(var i = 0; i < events.length; i ++){
                events[i].call(this);
            }
        }
    },


    /**
     * 鼠标down
     * */
    _mouseDown: function(evt){
        document.onselectstart = function(){ return false; }; //防止选中
        this.addCSSRule(this._styleSheet, 'body *', '-moz-user-select:none;-webkit-user-select: none;-ms-user-select: none;');
        var pageXOffset = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
        var pageYOffset = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

        this._startX = evt.clientX + pageXOffset; //变换初始X
        this._startY = evt.clientY + pageYOffset; //变换初始Y

        for(var i = 0; i < this._$targetList.length; i++){
            var $clip = this._$targetList[i];
            $clip.data('START_RECT', this.getDomRect($clip.show())); //如果$clip是hidden状态，获取的rect可能不准确，先show
        }

        this._isRunning = true;
    },

    /**
     * 鼠标move
     * */
    _mouseMove: function(evt){
        if(this._isRunning){ //正在拖动
            var pageXOffset = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
            var pageYOffset = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            var changeX = evt.clientX + pageXOffset - this._startX;
            var changeY = evt.clientY + pageYOffset - this._startY;
            for(var i = 0; i < this._$targetList.length; i++){
                var $clip = this._$targetList[i];
                var taretRect = this.getTargetRect($clip.data('START_RECT'), this._vector, changeX, changeY);
                var filter = $clip.data('resizer_targetrect_filter');
                if(typeof filter == 'function'){
                    taretRect = filter.call(this, taretRect);
                }
                this.setDomRect($clip, taretRect);
            }
        }
    },

    /**
     * 鼠标up
     * */
    _mouseUp: function(evt){
        if(this._isRunning){
            document.onselectstart = null;
            this._isRunning = false;
            var styleSheet = this._styleSheet;
            var rules = styleSheet.cssRules || styleSheet.rules;
            var len = rules.length;
            for(var i = 0; i < len; i++){
                if(styleSheet.deleteRule){
                    styleSheet.deleteRule(0);
                }else{
                    styleSheet.removeRule(0);
                }
            }
            this.trigger('afterResize');
        }
    },
    /**
     * 创建一个styleSheet对象，方便操作全局样式
     * */
    _createStyleSheet: function(){
        var style = document.createElement("style");
        //style.appendChild(document.createTextNode(""));
        $('head').append(style);
        this._styleSheet = style.sheet || style.styleSheet;
    },


    /**
     * 绑定事件
     * */
    _bindEvents: function($dom, vector){
        var _this = this;

        $(document).bind('mousemove', (function(){
            return function(evt){
                _this._mouseMove.call(_this, evt);
            }
        })());

        $(document).bind('mouseup', (function(){
            return function(evt){
                _this._mouseUp.call(_this, evt);
            }
        })());
    }
 });