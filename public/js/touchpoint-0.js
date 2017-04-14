/*
实现图片缩放
 */
;(function () {
    var TRANSITION = 'transition'
    var TRANSFORM = 'transform'
    var TRANSITION_END = 'transitionend'
    var TRANSFORM_CSS = 'transform'
    var TRANSFORM_ORIGIN = 'transformorigin'
    var TRANSITION_CSS = 'transition'
    var vchrome
    var hchrome
    var lastScale
    var imageHeight = 1200
    var imageWidth = 1920
    var startLen

    if (typeof document.body.style.webkitTransform !== 'undefined') {
        TRANSITION = 'webkitTransition'
        TRANSFORM = 'webkitTransform'
        TRANSITION_END = 'webkitTransitionEnd'
        TRANSFORM_ORIGIN = 'webkitTransformOrigin'
        TRANSFORM_CSS = '-webkit-transform'
        TRANSITION_CSS = '-webkit-transition'
    }
    if (window.navigator.userAgent.match(/iphone/)) {
        vchrome = 65
        hchrome = 50
    } else {
        vchrome = 65
        hchrome = 50
    }
    function $ (selector) {
        return document.querySelector(selector)
    }
    var marker = document.createElement('div')
    $('#img').appendChild(marker)
    marker.style.position = 'absolute'
    marker.style.top = 0
    marker.style.left = 0
    marker.style.height = '2px'
    marker.style.width = '2px'
    marker.style.background = 'red'

    var hero = (function () {
        var image = $('#img')
        var currentDims = []
        var top = 0
        var left = 0
        var center = [0, 0]
        setSrc('images/1.jpg')
        function setSrc (src) {
            var img = new Image()
            img.onload = function () {
                image.style.backgroundImage = 'url(' + src + ')'
            }
            img.src = src
        }

        function setScale (scale, animate) {
            if (animate) {
                image.style[TRANSITION] = TRANSFORM_CSS + '.2s ease-out'
            } else {
                image.style[TRANSITION] = 'none'
            }
            var tx = center[0] + scale * (0 - center[0])
            var ty = center[1] + scale * (top - center[1])
            ty = ty - top
            // image.style[TRANSFORM] = 'scale3d(' + scale + ',' + scale + ',1)'
            image.style[TRANSFORM] = 'matrix3d(' + scale + ',0,0,0,0,' + scale + ',0,0,0,0,1,0,' + tx + ',' + ty + ',0,1)'
        }
        function fitToBox (dimsArr) {
            var imgw
            var imgh
            var scaleFactor
            var w = dimsArr[0]
            var h = dimsArr[1]
            imgw = w
            scaleFactor = w / imageWidth
            imgh = imageHeight * scaleFactor
            image.style.width = imgw + 'px'
            image.style.height = imgh + 'px'
            currentDims = [imgw, imgh]
            top = (h / 2, imgh / 2)
            image.style.top = top + 'px'
        }

        function setCenter (centerArr) {
            center = centerArr
        }
        return {
            setScale: setScale,
            fitToBox: fitToBox,
            setCenter: setCenter,
            setSrc: setSrc
        }
    })()

    function rebuild () {
        setTimeout(function () {
            var box
            if (Math.abs(window.orientation) > 0) {
                box = [window.innerHeight, window.innerWidth - hchrome]
            } else {
                box = [window.innerWidth, window.innerHeight - vchrome]
            }
            $('#holder').style.height = box[1] + 'px'
            $('#holder').style.width = box[0] + 'px'
            hero.fitToBox(box)
        }, 50)
    }

    window.setTimeout(function () {
        window.scrollTo(0, 1)
        rebuild()
    }, 50)
// 默认做竖屏的方向
    document.addEventListener('orientation', rebuild)
    function dist (pointA, pointB) {
        return Math.sqrt(Math.pow(pointA[0] - pointB[0], 2), Math.pow(pointA[1] - pointB[1], 2))
    }

    function handleTouch (e) {
        e.preventDefault()
        if (e.type === 'touchstart') {
            hero.setSrc('images/1.jpg')
            if (e.touches.length > 1) {
                console.log('two')
                var pointA = e.touches[0]
                var pointB = e.touches[1]
                if (pointB) {
                    startLen = dist([pointA.screenX, pointA.screenY], [pointB.screenX, pointB.screenY])
                }
                console.log(startLen)

                $('#img').innerHTML = startLen
            }
        } else if (e.type === 'touchmove' && e.touches.length === 2) {
            console.log('two move')
            var x = (e.touches[0].pageX + e.touches[1].pageX) / 2
            var y = (e.touches[0].pageY + e.touches[1].pageY) / 2
            hero.setCenter([Math.round(x), Math.round(y)])
            // $('#img').style[TRANSFORM_ORIGIN] = Math.round(x) + ' ' + Math.round(y)
            var pointA = e.touches[0]
            var pointB = e.touches[1]
            if (pointB) {
                var len = dist([pointA.screenX, pointA.screenY], [pointB.screenX, pointB.screenY])
            }
            lastScale = len / startLen
            hero.setScale(lastScale)
            $('#img').innerHTML = lastScale
        } else if (e.type === 'touchend' || e.type === 'touchcancel') {
            $('#img').innerHTML = lastScale
            if (lastScale) {
                if (lastScale > 1.5) {
                    hero.setScale(lastScale, true)
                     $('#img').innerHTML = '变换'
                } else {
                    hero.setScale(1, true)
                }
            }
        }
    }
    document.addEventListener('touchstart', handleTouch)
    document.addEventListener('touchend', handleTouch)
    document.addEventListener('touchmove', handleTouch)
    document.addEventListener('touchcancle', handleTouch)
    /*
    缩放的时候阻止滚动事件
     */
    document.ontouchmove = function (e) {
        e.preventDefault()
    }
})()
