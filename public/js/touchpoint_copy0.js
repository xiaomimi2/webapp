(function () {
    var TRANSITION = 'transition'
    var TRANSITIONEND = 'transitionend'
    var TRANSFORM = 'transform'
    var TRANSFORM_CSS = 'transform'
    var TRANSITION_CSS = 'transition'
    var TRANSFORM_ORIGIN= 'transformorigin'
    var touches = {}
    var reap

    if (typeof document.body.webkitTransform !== 'undefined') {
        TRANSITION = 'webkitTransition'
        TRANSITIONEND = 'webkitTransitionEnd'
        TRANSFORM = 'webkitTransform'
        TRANSFORM_CSS = '-webkit-transform'
        TRANSITION_CSS = '-webkit-transition'
        TRANSFORM_ORIGIN = 'webkitTransformOrigin'
    }

    function Mytouch (id) {
        this.id = id
        var node = document.createElement('div')
        node.className = 'touched'
        node.style.opacity = 1
        node.addEventListener(TRANSITIONEND, function () {
            this.style[TRANSFORM] = ''
        })
        document.body.appendChild(node)
        this.node = node
    }

    Mytouch.prototype.setPos = function (x, y) {
        this.node.opacity = 1
        this.node.style[TRANSFORM] = 'translate3d(' + Math.round(x) + 'px,' + Math.round(y) + 'px,0)'
    }
    Mytouch.prototype.destroy = function () {
        this.fade()
        var node = this.node
        var id = this.id
        setTimeout(function () {
            node.parentNode && node.parentNode.removeChild(node)
            delete (touches[id])
        }, 100)
    }
    Mytouch.prototype.fade = function () {
        this.node.style[TRANSITION] = 'opacity .2s ease-in-out'
        this.node.style.opacity = 0
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

    function mover (e) {
        console.log("move")
        var thistouch
        for (var i = 0; i < e.touches.length; i++) {
            thistouch = e.touches[i]
            if (!touches[thistouch.identifier]) {
                touches[thistouch.identifier] = new Mytouch(thistouch.identifier)
            }
            touches[thistouch.identifier].setPos(e.touches[i].pageX, e.touches[i].pageY)
        }
    }

    function moverMS (e) {
        if (!(touches[e.pointerId])) {
            touches[e.pointerId] = new Mytouch(e.pointId)
        }
        touches[e.pointerId].setPos(e.clientX, e.clientY)
    }
    function touchEnd (e) {
        clearTimeout(reap)
        var len = e.changedTouches.length
        for (var i = 0; i < len; i++) {
            kill(e.changedTouches[i])
        }
        reap = setTimeout(reaper, 100)
    }
    function touchEndMs (e) {
        clearTimeout(reap)
        kill(e.pointerId)
        reap = setTimeout(reaper, 100)
    }
    document.addEventListener('touchstart', mover)
    document.addEventListener('touchmove', mover)
    document.addEventListener('touchend', touchEnd)
    document.addEventListener('MSPointerStart', moverMS)
    document.addEventListener('MSPointerMove', moverMS)
    document.addEventListener('MSPointerUp', touchEndMs)
})()
