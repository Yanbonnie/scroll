var jmScroll = (function() {
	//判断设备是否支持touch事件
    var _upSupportTouch = !((window.DocumentTouch && document instanceof window.DocumentTouch) || "ontouchstart" in window) * 1,
    _event = {
        start: ["touchstart", "mousedown"][_upSupportTouch],
        move: ["touchmove", "mousemove"][_upSupportTouch],
        end: ["touchend", "mouseup"][_upSupportTouch]
    };
	var _scroller = function(obj){
		var key = "top",
        Key = "Top",
        size = "height",
        Size = "Height",
        pageKey = "pageY";
		var pos = {}
		obj.addEventListener(_event.start,function(){
			
			pos[pageKey] = event.touches ? event.touches[0][pageKey] : event[pageKey];
            pos[key] = this["scroll" + Key];
			console.log(pos[key]);
		})
		obj.addEventListener(_event.move,function(event) {
            if (_upSupportTouch == false || (document.moveFollow == true)) {
                this["scroll" + Key] = pos[key] + (pos[pageKey] - (event.touches ? event.touches[0][pageKey] : event[pageKey]));
               // fnPosScroll();
               // params.onScroll.call(this, event)
            }
            event.preventDefault()
        })
		obj.addEventListener(_event.end,function(){
			console.log("touchend")
		})
	}
	return function(obj){
		$('body').bind("touchmove", function(event) {
			console.log('11111111111111111111')
			event.preventDefault()
		}, false); 
		 var childerns = obj.childNodes,
        fragment = document.createDocumentFragment(); [].slice.call(childerns).forEach(function(child) {
            fragment.appendChild(child)
        });
        var wrap = document.createElement("div");
        wrap.style.height = "100%";
        wrap.style.width = "100%";
        wrap.style.overflow = "hidden";
        obj.appendChild(wrap);
        wrap.appendChild(fragment);
		_scroller(wrap)
	}
})();