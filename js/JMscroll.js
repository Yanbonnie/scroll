var jmScroll = (function() {
	//判断设备是否支持touch事件
    var _upSupportTouch = !((window.DocumentTouch && document instanceof window.DocumentTouch) || "ontouchstart" in window) * 1,
    _event = {
        start: ["touchstart", "mousedown"][_upSupportTouch],
        move: ["touchmove", "mousemove"][_upSupportTouch],
        end: ["touchend", "mouseup"][_upSupportTouch]
    };
	//console.log()
	//console.log(_event.start);
    var _scroller = function(container, direction, params) {
		

        var key = "top",
        Key = "Top",
        size = "height",
        Size = "Height",
        pageKey = "pageY";
        if (direction == "horizontal") {
            key = "left";
            Key = "Left";
            size = "width";
            Size = "Width";
            pageKey = "pageX"
        }
        var scroller = null;
        if (params.hideScrollBar == false) {
            scroller = document.createElement("div");
            scroller.className = "scroller_" + direction;
            params.container.appendChild(scroller)
        }
        var sizeContainer = container["client" + Size],
		
        sizeContainerWithScroll = 0;
		console.log(sizeContainer)
        var fnPosScroll = function() {
            if (scroller == null) {
                return
            }
            var sizeScroller = scroller.style[size].replace("px", ""),		
            keyScroller = container["scroll" + Key] / (sizeContainerWithScroll - sizeContainer) * (sizeContainer - sizeScroller);
			//console.log(keyScroller)
            if (sizeContainer - sizeScroller - keyScroller <= 0) {   //滚动层高度- 滚动条高度- 滚动条距离父级的高度
                keyScroller = sizeContainer - sizeScroller
            }
			
            scroller.style[key] = keyScroller + "px"
        };
		var fn =function() {	
		//console.log('vertical')		
				sizeContainerWithScroll = container["scrollHeight"];
				if (scroller && sizeContainerWithScroll > sizeContainer) {
				scroller.style.opacity = 1;
                scroller.style[size] = (sizeContainer * sizeContainer / sizeContainerWithScroll) + "px";
                fnPosScroll()
            }
        }
		if (direction == "vertical"){
			fn();
		}
        var pos = {};
        container.addEventListener(_event.start,
        function(event) {
            sizeContainerWithScroll = this["scroll" + Size];
            pos[pageKey] = event.touches ? event.touches[0][pageKey] : event[pageKey];
            pos[key] = this["scroll" + Key];
			console.log(this)
            document.moveFollow = true;
            if (scroller && sizeContainerWithScroll > sizeContainer) {
                scroller.style.opacity = 1;
                scroller.style[size] = (sizeContainer * sizeContainer / sizeContainerWithScroll) + "px";
                fnPosScroll()
            }
        });
        container.addEventListener(_event.move,
        function(event) {
            if (_upSupportTouch == false || (document.moveFollow == true)) {
                this["scroll" + Key] = pos[key] + (pos[pageKey] - (event.touches ? event.touches[0][pageKey] : event[pageKey]));
				console.log(pos[key])
                fnPosScroll();
                params.onScroll.call(this, event)
            }
            event.preventDefault()
        });
        container.addEventListener(_event.end,
        function(event) {
            scroller && (scroller.style.opacity = 1)
        });
        if (_upSupportTouch == true) {
            document.addEventListener("mouseup",
            function() {
                this.moveFollow = false
            })
        }
    };
    return function(container, options) {
		$('body').bind("touchmove", function(event) {
			//console.log('11111111111111111111')
			event.preventDefault()
		}, false);  		
		
        options = options || {};
        var params = new Object({
            verticalScroll: true,
            horizontalScroll: false,
            hideScrollBar: false,
            onScroll: function() {}
        }),
        key;
        for (key in options) {
            params[key] = options[key]
        }
        if (window.getComputedStyle(container).position == "static") {
            container.style.position = "absolute"
        }
        var childerns = container.childNodes,
        fragment = document.createDocumentFragment(); [].slice.call(childerns).forEach(function(child) {
            fragment.appendChild(child)
        });
        var wrap = document.createElement("div");
        wrap.style.height = "100%";
        wrap.style.width = "100%";
        wrap.style.overflow = "hidden";
        container.appendChild(wrap);
        wrap.appendChild(fragment);
        params.container = container;
        if (params.verticalScroll == true) {
            _scroller(wrap, "vertical", params)
        }
        if (params.horizontalScroll == true) {
			console.log('horizontalScroll')
            _scroller(wrap, "horizontal", params)
        }
    }
})();