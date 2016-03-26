define(['public/event/event'], function (customEvent) {
    function createDrag(isStart) {
        var dragdrop = new customEvent();
        var dragging = null;
        var html = document.documentElement,
            isIE6 = !('minWidth' in html.style),
            isLosecapture = !isIE6 && ('onlosecapture' in html),
            isSetCapture = 'setCapture' in html;
        function dragend(event) {
            if (dragging !== null) {
                event.preventDefault();
                event.stopPropagation();
                if (isSetCapture) {
                    dragging.releaseCapture();
                }
                if (isLosecapture) {
                    $(dragging).bind('losecapture', dragend);
                } else {
                    $(window).bind('blur', dragend);
                }
                document.body.onselectstart = null;
                dragdrop.trigger({
                    type: 'dragend',
                    target: dragging,
                    x: event.pageX,
                    y: event.pageY
                });
                dragging = null;
            }
        }
        function handlerEvent(event) {
            var target = event.target,
                _handlerFunc = {
                    'mousedown': function (event) {
                        if (isStart(target)) {
                            event.preventDefault();
                            event.stopPropagation();
                            target.ondragstart = function () {
                                return false;
                            };
                            target.onselectstart = function () {
                                return false;
                            };
                            document.body.onselectstart = function () {
                                return false;
                            };
                            dragging = target;
                            if (isSetCapture) {
                                dragging.setCapture();
                            }
                            if (isLosecapture) {
                                $(dragging).bind('losecapture', dragend);
                            } else {
                                $(window).bind('blur', dragend);
                            }
                            dragdrop.trigger({
                                type: 'dragstart',
                                target: dragging,
                                x: event.pageX,
                                y: event.pageY
                            });
                        }
                    },
                    'mousemove': function (event) {
                        if (dragging !== null) {
                            event.preventDefault();
                            event.stopPropagation();
                            dragdrop.trigger({
                                type: 'drag',
                                target: dragging,
                                x: event.pageX,
                                y: event.pageY
                            });
                        }
                    },
                    'mouseup': function (event) {
                        dragend(event);
                    }
                };
            _handlerFunc[event.type](event);
        }
        $(document).bind('mousedown', handlerEvent);
        $(document).bind('mousemove', handlerEvent);
        $(document).bind('mouseup', handlerEvent);
        return dragdrop;
    }
    return createDrag;
});
