define(function () {
    $.fn.mousewheelStopPropagation = function (options) {
        options = $.extend({
            // defaults
            wheelstop: null // Function
        }, options);

        // Compatibilities
        var ua = navigator.userAgent.toLowerCase(),
            isMsIE = /(trident|msie)/.test(ua);
        var docElt = document.documentElement,
            mousewheelEventName = 'mousewheel';
        if ('onmousewheel' in docElt) {
            mousewheelEventName = 'mousewheel';
        } else if ('onwheel' in docElt) {
            mousewheelEventName = 'wheel';
        } else if ('DOMMouseScroll' in docElt) {
            mousewheelEventName = 'DOMMouseScroll';
        }
        if (!mousewheelEventName) {
            return this;
        }

        function mousewheelPrevent(event) {
            event.preventDefault();
            event.stopPropagation();
            if ('function' === typeof options.wheelstop) {
                options.wheelstop(event);
            }
        }

        return this.each(function () {
            var _this = this,
                $this = $(_this);
            $this.on(mousewheelEventName, function (event) {
                var origiEvent = event.originalEvent;
                var scrollTop = _this.scrollTop,
                    scrollMax = _this.scrollHeight - $this.outerHeight(),
                    delta = -origiEvent.wheelDelta;
                if (isNaN(delta)) {
                    delta = origiEvent.deltaY;
                }
                var scrollUp = delta < 0;
                if ((scrollUp && scrollTop <= 0) || (!scrollUp && scrollTop >= scrollMax)) {
                    mousewheelPrevent(event);
                } else if (isMsIE) {
                    // Fix Internet Explorer and emulate natural scrolling
                    var animOpt = {
                        duration: 200,
                        easing: 'linear'
                    };
                    if (scrollUp && -delta > scrollTop) {
                        $this.stop(true).animate({
                            scrollTop: 0
                        }, animOpt);
                        mousewheelPrevent(event);
                    } else if (!scrollUp && delta > scrollMax - scrollTop) {
                        $this.stop(true).animate({
                            scrollTop: scrollMax
                        }, animOpt);
                        mousewheelPrevent(event);
                    }
                }
            });
        });
    };

});
