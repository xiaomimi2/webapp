;(function () {
    var TRANSITION = 'transition'
    var TRANSFORM = 'transform'
    var TRANSITION_END = 'transitionend'
    var TRANSFORM_CSS = 'transform'
    var TRANSITION_CSS = 'transition'
    var TRANSFORM_ORIGIN = 'transformorigin'
    var touches = {}
    var reap

    if (typeof document.body.style.webkitTransform !== 'undefined') {
        TRANSITION = 'webkitTransition'
        TRANSFORM = 'webkitTransform'
        TRANSITION_END = 'webkitTransitionEnd'
        TRANSFORM_CSS = '-webkit-transform'
        TRANSITION_CSS = '-webkit-transition'
        TRANSFORM_ORIGIN = 'webkitTransformOrigin'
    }
    function Mytouch (id) {
        this.id = id
        var touchee = document.createElement('div')
        touchee.className = 'touched'
        touchee.style.opacity = 0
        touchee.id = id
        touchee.addEventListener(TRANSITION_END, function () {
            touchee.style[TRANSFORM] = ''
        })
        document.body.appendChild(touchee)
        this.node = touchee
    }

    Mytouch.prototype.setPos = function (posX, posY) {
        this.node.style.opacity = 1
        var x = Math.round(posX - 50) + 'px'
        var y = Math.round(posY - 50) + 'px'
        this.node.style[TRANSFORM] = 'translate3d(' + x + ',' + y + ', 0)'
    }
    Mytouch.prototype.destroy = function (cb) {
        this.fade()
        var node = this.node, id = this.id
        window.setTimeout(function () {
            node.parentNode && node.parentNode.removeChild(node)
            delete (touches[id])
        }, 100)
    }
    Mytouch.prototype.fade = function () {
        this.node.style[TRANSITION] = 'opacity .1s ease-in-out'
        console.log(this.node.style[TRANSITION])
        var that = this
        setTimeout(function () {
            that.node.style.opacity = 0
        }, 100)
    }
    function kill (id) {
        touches[id] && touches[id].destroy()
    }

    function reaper () {
        var id
        for (id in touches) {
            kill(id)
        }
    }

    function moverMS (e) {
        if (!touches[e.pointerId]) {
            touches[e.pointerId] = new Mytouch(e.pointerId)
        }
        touches[e.pointerId].setPos(e.clientX, e.clientY)
    }
    function mover (e) {
        e.preventDefault()
        var len = e.touches.length
        var thistouch
        for (var i = 0; i < len; i++) {
            thistouch = e.touches[i]
            console.log(thistouch.identifier)
            if (!touches[thistouch.identifier]) {
                touches[thistouch.identifier] = new Mytouch(thistouch.identifier)
            }
            touches[thistouch.identifier].setPos(thistouch.pageX, thistouch.pageY)
        }
    }

    function touchend (e) {
        window.clearTimeout(reap)
        for (var i = 0; i < e.changedTouches.length; i++) {
            kill(e.changedTouches[i].identifier)
            console.log(e.changedTouches[i].identifier)
        }
        reap = window.setTimeout(reaper, 100)
        document.body.innerHTML = touches.length
    }

    function touchendMs (e) {
        window.clearTimeout(reap)
        kill(e.pointerId)
        reap = window.setTimeout(reaper, 100)
    }
    

    document.addEventListener('touchstart', mover)
    document.addEventListener('touchmove', mover)
    document.addEventListener('touchend', touchend)
    document.addEventListener('MSPointerStart', moverMS)
    document.addEventListener('MSPointerMove', moverMS)
    document.addEventListener('MSPointerUp', touchendMs)
})()
