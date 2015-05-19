/*==================================================
 Copyright (c) 2013-2014 ˾ͽ���� and other contributors
 http://www.cnblogs.com/rubylouvre/
 https://github.com/RubyLouvre
 http://weibo.com/jslouvre/

 Released under the MIT license
 avalon.js 1.3.8 build in 2014.11.15 
 __________________________________
 support IE6+ and other browsers
 ==================================================*/
(function () {

    /*********************************************************************
     *                    ȫ�ֱ���������                                  *
     **********************************************************************/
    var expose = new Date - 0
//http://stackoverflow.com/questions/7290086/javascript-use-strict-and-nicks-find-global-function
    var window = Function( "return this" )()
    var DOC = window.document
    var head = DOC.getElementsByTagName( "head" )[ 0 ] //HEADԪ��
    var ifGroup = head.insertBefore( document.createElement( "avalon" ), head.firstChild ) //����IE6 base��ǩBUG
    ifGroup.innerHTML = "X<style id='avalonStyle'>.avalonHide{ display: none!important }</style>"
    function log() {
        if ( window.console && avalon.config.debug ) {
            // http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
            Function.apply.call( console.log, console, arguments )
        }
    }


    var subscribers = "$" + expose
    var otherRequire = window.require
    var otherDefine = window.define
    var stopRepeatAssign = false
    var rword = /[^, ]+/g //�и��ַ���Ϊһ����С�飬�Կո�򶹺ŷֿ����ǣ����replaceʵ���ַ�����forEach
    var rnative = /\[native code\]/ //�ж��Ƿ�ԭ������
    var rcomplexType = /^(?:object|array)$/
    var rsvg = /^\[object SVG\w*Element\]$/
    var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/
    var oproto = Object.prototype
    var ohasOwn = oproto.hasOwnProperty
    var serialize = oproto.toString
    var ap = Array.prototype
    var aslice = ap.slice
    var Registry = {} //�������ع⵽�˶����ϣ�����������ռ�����
    var W3C = window.dispatchEvent
    var root = DOC.documentElement
    var hyperspace = DOC.createDocumentFragment()
    var cinerator = DOC.createElement( "div" )
    var class2type = {}
    "Boolean Number String Function Array Date RegExp Object Error".replace( rword, function ( name ) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase()
    } )


    function noop() {
    }


    function oneObject( array, val ) {
        if ( typeof array === "string" ) {
            array = array.match( rword ) || []
        }
        var result = {},
            value = val !== void 0 ? val : 1
        for ( var i = 0, n = array.length; i < n; i++ ) {
            result[ array[ i ] ] = value
        }
        return result
    }

    function createCache( maxLength ) {
        var keys = []

        function cache( key, value ) {
            if ( keys.push( key ) > maxLength ) {
                delete cache[ keys.shift() ]
            }
            return cache[ key ] = value;
        }

        return cache;
    }

//����UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    var generateID = window.performance && performance.now ? function () {
        return ("avalon" + performance.now() + performance.now()).replace( /\./g, "" )
    } : function () {
        return ("avalon" + Math.random() + Math.random()).replace( /0\./g, "" )
    }

    /*********************************************************************
     *                 avalon�ľ�̬����������                              *
     **********************************************************************/
    avalon = function ( el ) { //����jQueryʽ����new ʵ�����ṹ
        return new avalon.init( el )
    }

    avalon.init = function ( el ) {
        this[ 0 ] = this.element = el
    }
    avalon.fn = avalon.prototype = avalon.init.prototype

    avalon.type = function ( obj ) { //ȡ��Ŀ�������
        if ( obj == null ) {
            return String( obj )
        }
        // ���ڵ�webkit�ں������ʵ�����ѷ�����ecma262v4��׼�����Խ�������������������ʹ�ã����typeof���ж�����ʱ�᷵��function
        return typeof obj === "object" || typeof obj === "function" ?
        class2type[ serialize.call( obj ) ] || "object" :
            typeof obj
    }

    var isFunction = typeof alert === "object" ? function ( fn ) {
        try {
            return /^\s*\bfunction\b/.test( fn + "" )
        } catch ( e ) {
            return false
        }
    } : function ( fn ) {
        return serialize.call( fn ) == "[object Function]"
    }
    avalon.isFunction = isFunction

    avalon.isWindow = function ( obj ) {
        if ( !obj )
            return false
        // ����IE678 window == documentΪtrue,document == window��ȻΪfalse����������
        // ��׼�������IE9��IE10��ʹ�� ������
        return obj == obj.document && obj.document != obj
    }

    function isWindow( obj ) {
        return rwindow.test( serialize.call( obj ) )
    }

    if ( isWindow( window ) ) {
        avalon.isWindow = isWindow
    }
    var enu
    for ( enu in avalon( {} ) ) {
        break
    }
    var enumerateBUG = enu !== "0" //IE6��Ϊtrue, ����Ϊfalse
    /*�ж��Ƿ���һ�����ص�javascript����Object��������DOM���󣬲���BOM���󣬲����Զ������ʵ��*/
    avalon.isPlainObject = function ( obj, key ) {
        if ( !obj || avalon.type( obj ) !== "object" || obj.nodeType || avalon.isWindow( obj ) ) {
            return false;
        }
        try { //IE���ö���û��constructor
            if ( obj.constructor && !ohasOwn.call( obj, "constructor" ) && !ohasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
                return false;
            }
        } catch ( e ) { //IE8 9���������״�
            return false;
        }
        if ( enumerateBUG ) {
            for ( key in obj ) {
                return ohasOwn.call( obj, key )
            }
        }
        for ( key in obj ) {
        }
        return key === void 0 || ohasOwn.call( obj, key );
    }
    if ( rnative.test( Object.getPrototypeOf ) ) {
        avalon.isPlainObject = function ( obj ) {
            // �򵥵� typeof obj === "object"��⣬����ʹ��isPlainObject(window)��opera��ͨ����
            return serialize.call( obj ) === "[object Object]" && Object.getPrototypeOf( obj ) === oproto
        }
    }
//��jQuery.extend������������ǳ���������
    avalon.mix = avalon.fn.mix = function () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[ 0 ] || {},
            i = 1,
            length = arguments.length,
            deep = false

        // �����һ������Ϊ����,�ж��Ƿ����
        if ( typeof target === "boolean" ) {
            deep = target
            target = arguments[ 1 ] || {}
            i++
        }

        //ȷ�����ܷ�Ϊһ�����ӵ���������
        if ( typeof target !== "object" && !isFunction( target ) ) {
            target = {}
        }

        //���ֻ��һ����������ô�³�Ա�����mix���ڵĶ�����
        if ( i === length ) {
            target = this
            i--
        }

        for ( ; i < length; i++ ) {
            //ֻ����ǿղ���
            if ( (options = arguments[ i ]) != null ) {
                for ( name in options ) {
                    src = target[ name ]
                    try {
                        copy = options[ name ] //��optionsΪVBS����ʱ����
                    } catch ( e ) {
                        continue
                    }

                    // ��ֹ������
                    if ( target === copy ) {
                        continue
                    }
                    if ( deep && copy && (avalon.isPlainObject( copy ) || (copyIsArray = Array.isArray( copy ))) ) {

                        if ( copyIsArray ) {
                            copyIsArray = false
                            clone = src && Array.isArray( src ) ? src : []

                        } else {
                            clone = src && avalon.isPlainObject( src ) ? src : {}
                        }

                        target[ name ] = avalon.mix( deep, clone, copy )
                    } else if ( copy !== void 0 ) {
                        target[ name ] = copy
                    }
                }
            }
        }
        return target
    }

    function _number( a, len ) { //����ģ��slice, splice��Ч��
        a = Math.floor( a ) || 0
        return a < 0 ? Math.max( len + a, 0 ) : Math.min( a, len );
    }

    avalon.mix( {
        rword: rword,
        subscribers: subscribers,
        version: 1.37,
        ui: {},
        log: log,
        slice: W3C ? function ( nodes, start, end ) {
            return aslice.call( nodes, start, end )
        } : function ( nodes, start, end ) {
            var ret = []
            var len = nodes.length
            if ( end === void 0 )
                end = len
            if ( typeof end === "number" && isFinite( end ) ) {
                start = _number( start, len )
                end = _number( end, len )
                for ( var i = start; i < end; ++i ) {
                    ret[ i - start ] = nodes[ i ]
                }
            }
            return ret
        },
        noop: noop,
        /*�������Error�����װһ�£�str�ڿ���̨�¿��ܻ�����*/
        error: function ( str, e ) {
            throw new (e || Error)( str )
        },
        /*��һ���Կո�򶺺Ÿ������ַ���������,ת����һ����ֵ��Ϊ1�Ķ���*/
        oneObject: oneObject,
        /* avalon.range(10)
         => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
         avalon.range(1, 11)
         => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
         avalon.range(0, 30, 5)
         => [0, 5, 10, 15, 20, 25]
         avalon.range(0, -10, -1)
         => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
         avalon.range(0)
         => []*/
        range: function ( start, end, step ) { // ����������������
            step || (step = 1)
            if ( end == null ) {
                end = start || 0
                start = 0
            }
            var index = -1,
                length = Math.max( 0, Math.ceil( (end - start) / step ) ),
                result = Array( length )
            while ( ++index < length ) {
                result[ index ] = start
                start += step
            }
            return result
        },
        eventHooks: {},
        /*���¼�*/
        bind: function ( el, type, fn, phase ) {
            var hooks = avalon.eventHooks
            var hook = hooks[ type ]
            if ( typeof hook === "object" ) {
                type = hook.type
                if ( hook.deel ) {
                    fn = hook.deel( el, fn )
                }
            }
            var callback = W3C ? fn : function ( e ) {
                fn.call( el, fixEvent( e ) );
            }
            if ( W3C ) {
                el.addEventListener( type, callback, !!phase )
            } else {
                el.attachEvent( "on" + type, callback )
            }
            return callback
        },
        /*ж���¼�*/
        unbind: function ( el, type, fn, phase ) {
            var hooks = avalon.eventHooks
            var hook = hooks[ type ]
            var callback = fn || noop
            if ( typeof hook === "object" ) {
                type = hook.type
            }
            if ( W3C ) {
                el.removeEventListener( type, callback, !!phase )
            } else {
                el.detachEvent( "on" + type, callback )
            }
        },
        /*��дɾ��Ԫ�ؽڵ����ʽ*/
        css: function ( node, name, value ) {
            if ( node instanceof avalon ) {
                node = node[ 0 ]
            }
            var prop = /[_-]/.test( name ) ? camelize( name ) : name
            name = avalon.cssName( prop ) || prop
            if ( value === void 0 || typeof value === "boolean" ) { //��ȡ��ʽ
                var fn = cssHooks[ prop + ":get" ] || cssHooks[ "@:get" ]
                if ( name === "background" ) {
                    name = "backgroundColor"
                }
                var val = fn( node, name )
                return value === true ? parseFloat( val ) || 0 : val
            } else if ( value === "" ) { //�����ʽ
                node.style[ name ] = ""
            } else { //������ʽ
                if ( value == null || value !== value ) {
                    return
                }
                if ( isFinite( value ) && !avalon.cssNumber[ prop ] ) {
                    value += "px"
                }
                fn = cssHooks[ prop + ":set" ] || cssHooks[ "@:set" ]
                fn( node, name, value )
            }
        },
        /*�������������,�ص��ĵ�һ������Ϊ���������,�ڶ�����Ԫ�ػ��ֵ*/
        each: function ( obj, fn ) {
            if ( obj ) { //�ų�null, undefined
                var i = 0
                if ( isArrayLike( obj ) ) {
                    for ( var n = obj.length; i < n; i++ ) {
                        fn( i, obj[ i ] )
                    }
                } else {
                    for ( i in obj ) {
                        if ( obj.hasOwnProperty( i ) ) {
                            fn( i, obj[ i ] )
                        }
                    }
                }
            }
        },
        //�ռ�Ԫ�ص�data-{{prefix}}-*���ԣ���ת��Ϊ����
        getWidgetData: function ( elem, prefix ) {
            var raw = avalon( elem ).data()
            var result = {}
            for ( var i in raw ) {
                if ( i.indexOf( prefix ) === 0 ) {
                    result[ i.replace( prefix, "" ).replace( /\w/, function ( a ) {
                        return a.toLowerCase()
                    } ) ] = raw[ i ]
                }
            }
            return result
        },
        Array: {
            /*ֻ�е�ǰ���鲻���ڴ�Ԫ��ʱֻ�����*/
            ensure: function ( target, item ) {
                if ( target.indexOf( item ) === -1 ) {
                    return target.push( item )
                }
            },
            /*�Ƴ�������ָ��λ�õ�Ԫ�أ����ز�����ʾ�ɹ����*/
            removeAt: function ( target, index ) {
                return !!target.splice( index, 1 ).length
            },
            /*�Ƴ������е�һ��ƥ�䴫�ε��Ǹ�Ԫ�أ����ز�����ʾ�ɹ����*/
            remove: function ( target, item ) {
                var index = target.indexOf( item )
                if ( ~index )
                    return avalon.Array.removeAt( target, index )
                return false
            }
        }
    } )

    var bindingHandlers = avalon.bindingHandlers = {}
    var bindingExecutors = avalon.bindingExecutors = {}

    /*�ж��Ƿ������飬��ڵ㼯�ϣ������飬arguments��ӵ�зǸ�������length���ԵĴ�JS����*/

    function isArrayLike( obj ) {
        if ( obj && typeof obj === "object" && !avalon.isWindow( obj ) ) {
            var n = obj.length
            if ( +n === n && !(n % 1) && n >= 0 ) { //���length�����Ƿ�Ϊ�Ǹ�����
                try {
                    if ( {}.propertyIsEnumerable.call( obj, "length" ) === false ) { //�����ԭ������
                        return Array.isArray( obj ) || /^\s?function/.test( obj.item || obj.callee )
                    }
                    return true
                } catch ( e ) { //IE��NodeListֱ���״�
                    return true
                }
            }
        }
        return false
    }

    /*�������������������첽�ص�(��avalon.ready�����һ����֧�����ڴ���IE6-9)*/
    avalon.nextTick = window.setImmediate ? setImmediate.bind( window ) : function ( callback ) {
        setTimeout( callback, 0 ) //IE10-11 or W3C
    }

    /*********************************************************************
     *                         javascript �ײ㲹��                       *
     **********************************************************************/
    if ( !"˾ͽ����".trim ) {
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
        String.prototype.trim = function () {
            return this.replace( rtrim, "" )
        }
    }
    var hasDontEnumBug = !({
            'toString': null
        }).propertyIsEnumerable( 'toString' ),
        hasProtoEnumBug = (function () {
        }).propertyIsEnumerable( 'prototype' ),
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;
    if ( !Object.keys ) {
        Object.keys = function ( object ) { //ecma262v5 15.2.3.14
            var theKeys = [];
            var skipProto = hasProtoEnumBug && typeof object === "function"
            if ( typeof object === "string" || (object && object.callee) ) {
                for ( var i = 0; i < object.length; ++i ) {
                    theKeys.push( String( i ) )
                }
            } else {
                for ( var name in object ) {
                    if ( !(skipProto && name === "prototype") && ohasOwn.call( object, name ) ) {
                        theKeys.push( String( name ) )
                    }
                }
            }

            if ( hasDontEnumBug ) {
                var ctor = object.constructor,
                    skipConstructor = ctor && ctor.prototype === object;
                for ( var j = 0; j < dontEnumsLength; j++ ) {
                    var dontEnum = dontEnums[ j ]
                    if ( !(skipConstructor && dontEnum === "constructor") && ohasOwn.call( object, dontEnum ) ) {
                        theKeys.push( dontEnum )
                    }
                }
            }
            return theKeys
        }
    }
    if ( !Array.isArray ) {
        Array.isArray = function ( a ) {
            return serialize.call( a ) === "[object Array]"
        }
    }

    if ( !noop.bind ) {
        Function.prototype.bind = function ( scope ) {
            if ( arguments.length < 2 && scope === void 0 )
                return this
            var fn = this,
                argv = arguments
            return function () {
                var args = [],
                    i
                for ( i = 1; i < argv.length; i++ )
                    args.push( argv[ i ] )
                for ( i = 0; i < arguments.length; i++ )
                    args.push( arguments[ i ] )
                return fn.apply( scope, args )
            }
        }
    }

    function iterator( vars, body, ret ) {
        var fun = 'for(var ' + vars + 'i=0,n = this.length; i < n; i++){' + body.replace( '_', '((i in this) && fn.call(scope,this[i],i,this))' ) + '}' + ret
        return Function( "fn,scope", fun )
    }

    if ( !rnative.test( [].map ) ) {
        avalon.mix( ap, {
            //��λ���������������е�һ�����ڸ���������Ԫ�ص�����ֵ��
            indexOf: function ( item, index ) {
                var n = this.length,
                    i = ~~index
                if ( i < 0 )
                    i += n
                for ( ; i < n; i++ )
                    if ( this[ i ] === item )
                        return i
                return -1
            },
            //��λ������ͬ�ϣ������ǴӺ������
            lastIndexOf: function ( item, index ) {
                var n = this.length,
                    i = index == null ? n - 1 : index
                if ( i < 0 )
                    i = Math.max( 0, n + i )
                for ( ; i >= 0; i-- )
                    if ( this[ i ] === item )
                        return i
                return -1
            },
            //�����������������Ԫ�ذ���������һ��������ִ�С�Prototype.js�Ķ�Ӧ����Ϊeach��
            forEach: iterator( "", '_', "" ),
            //������ �������е�ÿ����������һ������������˺�����ֵΪ�棬���Ԫ����Ϊ�������Ԫ���ռ�������������������
            filter: iterator( 'r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r' ),
            //�ռ��������������Ԫ�ذ���������һ��������ִ�У�Ȼ������ǵķ���ֵ���һ�������鷵�ء�Prototype.js�Ķ�Ӧ����Ϊcollect��
            map: iterator( 'r=[],', 'r[i]=_', 'return r' ),
            //ֻҪ��������һ��Ԫ�������������Ž�������������true������ô���ͷ���true��Prototype.js�Ķ�Ӧ����Ϊany��
            some: iterator( "", 'if(_)return true', 'return false' ),
            //ֻ�������е�Ԫ�ض������������Ž�������������true�������ŷ���true��Prototype.js�Ķ�Ӧ����Ϊall��
            every: iterator( "", 'if(!_)return false', 'return true' )
        } )
    }
    /*********************************************************************
     *                           DOM �ײ㲹��                             *
     **********************************************************************/

    function fixContains( root, el ) {
        try { //IE6-8,������DOM������ı��ڵ㣬����parentNode��ʱ���״�
            while ( (el = el.parentNode) )
                if ( el === root )
                    return true;
            return false
        } catch ( e ) {
            return false
        }
    }

    avalon.contains = fixContains
//safari5+�ǰ�contains��������Element.prototype�϶�����Node.prototype
    if ( !root.contains ) {
        Node.prototype.contains = function ( arg ) {
            return !!(this.compareDocumentPosition( arg ) & 16)
        }
    }
//IE6-11���ĵ�����û��contains
    if ( !DOC.contains ) {
        DOC.contains = function ( b ) {
            return fixContains( DOC, b )
        }
    }

    function outerHTML() {
        return new XMLSerializer().serializeToString( this )
    }


    if ( window.SVGElement ) {
        var svgns = "http://www.w3.org/2000/svg"
        var svg = DOC.createElementNS( svgns, "svg" )
        svg.innerHTML = '<circle cx="50" cy="50" r="40" fill="red" />'
        if ( !rsvg.test( svg.firstChild ) ) { // #409
            function enumerateNode( node, targetNode ) {
                if ( node && node.childNodes ) {
                    var nodes = node.childNodes
                    for ( var i = 0, el; el = nodes[ i++ ]; ) {
                        if ( el.tagName ) {
                            var svg = DOC.createElementNS( svgns,
                                el.tagName.toLowerCase() )
                            ap.forEach.call( el.attributes, function ( attr ) {
                                svg.setAttribute( attr.name, attr.value ) //��������
                            } )
                            // �ݹ鴦���ӽڵ�
                            enumerateNode( el, svg )
                            targetNode.appendChild( svg )
                        }
                    }
                }
            }

            Object.defineProperties( SVGElement.prototype, {
                "outerHTML": {//IE9-11,firefox��֧��SVGԪ�ص�innerHTML,outerHTML����
                    enumerable: true,
                    configurable: true,
                    get: outerHTML,
                    set: function ( html ) {
                        var tagName = this.tagName.toLowerCase(),
                            par = this.parentNode,
                            frag = avalon.parseHTML( html )
                        // ������svg��ֱ�Ӳ���
                        if ( tagName === "svg" ) {
                            par.insertBefore( frag, this )
                            // svg�ڵ���ӽڵ�����
                        } else {
                            var newFrag = DOC.createDocumentFragment()
                            enumerateNode( frag, newFrag )
                            par.insertBefore( newFrag, this )
                        }
                        par.removeChild( this )
                    }
                },
                "innerHTML": {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        var s = this.outerHTML
                        var ropen = new RegExp( "<" + this.nodeName + '\\b(?:(["\'])[^"]*?(\\1)|[^>])*>', "i" )
                        var rclose = new RegExp( "<\/" + this.nodeName + ">$", "i" )
                        return s.replace( ropen, "" ).replace( rclose, "" )
                    },
                    set: function ( html ) {
                        if ( avalon.clearHTML ) {
                            avalon.clearHTML( this )
                            var frag = avalon.parseHTML( html )
                            enumerateNode( frag, this )
                        }
                    }
                }
            } )
        }
    }
    if ( !root.outerHTML && window.HTMLElement ) { //firefox ��11ʱ����outerHTML
        HTMLElement.prototype.__defineGetter__( "outerHTML", outerHTML );
    }

//============================= event binding =======================

    function fixEvent( event ) {
        var ret = {}
        for ( var i in event ) {
            ret[ i ] = event[ i ]
        }
        var target = ret.target = event.srcElement
        if ( event.type.indexOf( "key" ) === 0 ) {
            ret.which = event.charCode != null ? event.charCode : event.keyCode
        } else if ( /mouse|click/.test( event.type ) ) {
            var doc = target.ownerDocument || DOC
            var box = doc.compatMode === "BackCompat" ? doc.body : doc.documentElement
            ret.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0)
            ret.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0)
            ret.wheelDeltaY = ret.wheelDelta
            ret.wheelDeltaX = 0
        }
        ret.timeStamp = new Date - 0
        ret.originalEvent = event
        ret.preventDefault = function () { //��ֹĬ����Ϊ
            event.returnValue = false
        }
        ret.stopPropagation = function () { //��ֹ�¼���DOM���еĴ���
            event.cancelBubble = true
        }
        return ret
    }

    var eventHooks = avalon.eventHooks
//���firefox, chrome����mouseenter, mouseleave
    if ( !("onmouseenter" in root) ) {
        avalon.each( {
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }, function ( origType, fixType ) {
            eventHooks[ origType ] = {
                type: fixType,
                deel: function ( elem, fn ) {
                    return function ( e ) {
                        var t = e.relatedTarget
                        if ( !t || (t !== elem && !(elem.compareDocumentPosition( t ) & 16)) ) {
                            delete e.type
                            e.type = origType
                            return fn.call( elem, e )
                        }
                    }
                }
            }
        } )
    }
//���IE9+, w3c����animationend
    avalon.each( {
        AnimationEvent: "animationend",
        WebKitAnimationEvent: "webkitAnimationEnd"
    }, function ( construct, fixType ) {
        if ( window[ construct ] && !eventHooks.animationend ) {
            eventHooks.animationend = {
                type: fixType
            }
        }
    } )
//���IE6-8����input
    if ( !("oninput" in DOC.createElement( "input" )) ) {
        eventHooks.input = {
            type: "propertychange",
            deel: function ( elem, fn ) {
                return function ( e ) {
                    if ( e.propertyName === "value" ) {
                        e.type = "input"
                        return fn.call( elem, e )
                    }
                }
            }
        }
    }
    if ( DOC.onmousewheel === void 0 ) {
        /* IE6-11 chrome mousewheel wheelDetla �� -120 �� 120
         firefox DOMMouseScroll detail ��3 ��-3
         firefox wheel detlaY ��3 ��-3
         IE9-11 wheel deltaY ��40 ��-40
         chrome wheel deltaY ��100 ��-100 */
        var fixWheelType = DOC.onwheel !== void 0 ? "wheel" : "DOMMouseScroll"
        var fixWheelDelta = fixWheelType === "wheel" ? "deltaY" : "detail"
        eventHooks.mousewheel = {
            type: fixWheelType,
            deel: function ( elem, fn ) {
                return function ( e ) {
                    e.wheelDeltaY = e.wheelDelta = e[ fixWheelDelta ] > 0 ? -120 : 120
                    e.wheelDeltaX = 0
                    if ( Object.defineProperty ) {
                        Object.defineProperty( e, "type", {
                            value: "mousewheel"
                        } )
                    }
                    fn.call( elem, e )
                }
            }
        }
    }


    /*********************************************************************
     *                           ����ϵͳ                                 *
     **********************************************************************/

    function kernel( settings ) {
        for ( var p in settings ) {
            if ( !ohasOwn.call( settings, p ) )
                continue
            var val = settings[ p ]
            if ( typeof kernel.plugins[ p ] === "function" ) {
                kernel.plugins[ p ]( val )
            } else if ( typeof kernel[ p ] === "object" ) {
                avalon.mix( kernel[ p ], val )
            } else {
                kernel[ p ] = val
            }
        }
        return this
    }

    var openTag, closeTag, rexpr, rexprg, rbind, rregexp = /[-.*+?^${}()|[\]\/\\]/g

    function escapeRegExp( target ) {
        //http://stevenlevithan.com/regex/xregexp/
        //���ַ�����ȫ��ʽ��Ϊ������ʽ��Դ��
        return (target + "").replace( rregexp, "\\$&" )
    }

    var innerRequire = noop
    var plugins = {
        loader: function ( builtin ) {
            window.define = builtin ? innerRequire.define : otherDefine
            window.require = builtin ? innerRequire : otherRequire
        },
        interpolate: function ( array ) {
            openTag = array[ 0 ]
            closeTag = array[ 1 ]
            if ( openTag === closeTag ) {
                throw new SyntaxError( "openTag!==closeTag" )
            } else if ( array + "" === "<!--,-->" ) {
                kernel.commentInterpolate = true
            } else {
                var test = openTag + "test" + closeTag
                cinerator.innerHTML = test
                if ( cinerator.innerHTML !== test && cinerator.innerHTML.indexOf( "&lt;" ) >= 0 ) {
                    throw new SyntaxError( "�˶�������Ϸ�" )
                }
                cinerator.innerHTML = ""
            }
            var o = escapeRegExp( openTag ),
                c = escapeRegExp( closeTag )
            rexpr = new RegExp( o + "(.*?)" + c )
            rexprg = new RegExp( o + "(.*?)" + c, "g" )
            rbind = new RegExp( o + ".*?" + c + "|\\sms-" )
        }
    }

    kernel.debug = true
    kernel.plugins = plugins
    kernel.plugins[ 'interpolate' ]( [ "{{", "}}" ] )
    kernel.paths = {}
    kernel.shim = {}
    kernel.maxRepeatSize = 100
    avalon.config = kernel
    /*********************************************************************
     *                            �¼�����                               *
     **********************************************************************/
    var EventBus = {
        $watch: function ( type, callback ) {
            if ( typeof callback === "function" ) {
                var callbacks = this.$events[ type ]
                if ( callbacks ) {
                    callbacks.push( callback )
                } else {
                    this.$events[ type ] = [ callback ]
                }
            } else { //���¿�ʼ������VM�ĵ�һ�ؼ����Եı䶯
                this.$events = this.$watch.backup
            }
            return this
        },
        $unwatch: function ( type, callback ) {
            var n = arguments.length
            if ( n === 0 ) { //�ô�VM������$watch�ص���Ч��
                this.$watch.backup = this.$events
                this.$events = {}
            } else if ( n === 1 ) {
                this.$events[ type ] = []
            } else {
                var callbacks = this.$events[ type ] || []
                var i = callbacks.length
                while ( ~--i < 0 ) {
                    if ( callbacks[ i ] === callback ) {
                        return callbacks.splice( i, 1 )
                    }
                }
            }
            return this
        },
        $fire: function ( type ) {
            var special
            if ( /^(\w+)!(\S+)$/.test( type ) ) {
                special = RegExp.$1
                type = RegExp.$2
            }
            var events = this.$events
            var args = aslice.call( arguments, 1 )
            var detail = [ type ].concat( args )
            if ( special === "all" ) {
                for ( var i in avalon.vmodels ) {
                    var v = avalon.vmodels[ i ]
                    if ( v !== this ) {
                        v.$fire.apply( v, detail )
                    }
                }
            } else if ( special === "up" || special === "down" ) {
                var elements = events.expr ? findNodes( events.expr ) : []
                if ( elements.length === 0 )
                    return
                for ( var i in avalon.vmodels ) {
                    var v = avalon.vmodels[ i ]
                    if ( v !== this ) {
                        if ( v.$events.expr ) {
                            var eventNodes = findNodes( v.$events.expr )
                            if ( eventNodes.length === 0 ) {
                                continue
                            }
                            //ѭ������vmodel�еĽڵ㣬����ƥ�䣨����ƥ���������ƥ�䣩�Ľڵ㲢���ñ�ʶ
                            Array.prototype.forEach.call( eventNodes, function ( node ) {
                                Array.prototype.forEach.call( elements, function ( element ) {
                                    var ok = special === "down" ? element.contains( node ) : //���²���
                                        node.contains( element ) //����ð��

                                    if ( ok ) {
                                        node._avalon = v //���������ļ�һ����ʶ
                                    }
                                } );
                            } )
                        }
                    }
                }
                var nodes = DOC.getElementsByTagName( "*" ) //ʵ�ֽڵ�����
                var alls = []
                Array.prototype.forEach.call( nodes, function ( el ) {
                    if ( el._avalon ) {
                        alls.push( el._avalon )
                        el._avalon = ""
                        el.removeAttribute( "_avalon" )
                    }
                } )
                if ( special === "up" ) {
                    alls.reverse()
                }
                for ( var i = 0, el; el = alls[ i++ ]; ) {
                    if ( el.$fire.apply( el, detail ) === false ) {
                        break
                    }
                }
            } else {
                var callbacks = events[ type ] || []
                var all = events.$all || []
                for ( var i = 0, callback; callback = callbacks[ i++ ]; ) {
                    if ( isFunction( callback ) )
                        callback.apply( this, args )
                }
                for ( var i = 0, callback; callback = all[ i++ ]; ) {
                    if ( isFunction( callback ) )
                        callback.apply( this, arguments )
                }
            }
        }
    }

    var ravalon = /(\w+)\[(avalonctrl)="(\S+)"\]/
    var findNodes = DOC.querySelectorAll ? function ( str ) {
        //pc safari v5.1: typeof DOC.querySelectorAll(str) === 'function'
        //https://gist.github.com/DavidBruant/1016007
        return DOC.querySelectorAll( str )
    } : function ( str ) {
        var match = str.match( ravalon )
        var all = DOC.getElementsByTagName( match[ 1 ] )
        var nodes = []
        for ( var i = 0, el; el = all[ i++ ]; ) {
            if ( el.getAttribute( match[ 2 ] ) === match[ 3 ] ) {
                nodes.push( el )
            }
        }
        return nodes
    }
    /*********************************************************************
     *                           modelFactory                             *
     **********************************************************************/
//avalon����ĵķ�������������֮һ����һ����avalon.scan��������һ��ViewModel(VM)
    var VMODELS = avalon.vmodels = {} //����vmodel������������
    avalon.define = function ( id, factory ) {
        var $id = id.$id || id
        if ( !$id ) {
            log( "warning: vm����ָ��$id" )
        }
        if ( VMODELS[ $id ] ) {
            log( "warning: " + $id + " �Ѿ�������avalon.vmodels��" )
        }
        if ( typeof id === "object" ) {
            var model = modelFactory( id )
        } else {
            var scope = {
                $watch: noop
            }
            factory( scope ) //�õ����ж���
            model = modelFactory( scope ) //͵�컻�գ���scope��Ϊmodel
            stopRepeatAssign = true
            factory( model )
            stopRepeatAssign = false
        }
        model.$id = $id
        return VMODELS[ $id ] = model
    }

//һЩ����Ҫ������������
    var $$skipArray = String( "$id,$watch,$unwatch,$fire,$events,$model,$skipArray" ).match( rword )

    function isObservable( name, value, $skipArray ) {
        if ( isFunction( value ) || value && value.nodeType ) {
            return false
        }
        if ( $skipArray.indexOf( name ) !== -1 ) {
            return false
        }
        if ( $$skipArray.indexOf( name ) !== -1 ) {
            return false
        }
        var $special = $skipArray.$special
        if ( name && name.charAt( 0 ) === "$" && !$special[ name ] ) {
            return false
        }
        return true
    }

    var defineProperty = Object.defineProperty
    var canHideOwn = true
//����������֧��ecma262v5��Object.defineProperties���ߴ���BUG������IE8
//��׼�����ʹ��__defineGetter__, __defineSetter__ʵ��
    try {
        defineProperty( {}, "_", {
            value: "x"
        } )
        var defineProperties = Object.defineProperties
    } catch ( e ) {
        canHideOwn = false
    }
    function modelFactory( $scope, $special, $model ) {
        if ( Array.isArray( $scope ) ) {
            var arr = $scope.concat()
            $scope.length = 0
            var collection = Collection( $scope )
            collection.pushArray( arr )
            return collection
        }
        if ( typeof $scope.nodeType === "number" ) {
            return $scope
        }
        if ( $scope.$id && $scope.$model && $scope.$events ) { //fix IE6-8 createWithProxy $val: val������BUG
            return $scope
        }
        if ( !Array.isArray( $scope.$skipArray ) ) {
            $scope.$skipArray = []
        }
        $scope.$skipArray.$special = $special || {} //ǿ��Ҫ����������
        var $vmodel = {} //Ҫ���صĶ���, ����IE6-8�¿��ܱ�͵��ת��
        $model = $model || {} //vmodels.$model����
        var $events = {} //vmodel.$events����
        var watchedProperties = {} //�������
        var computedProperties = [] //��������
        for ( var i in $scope ) {
            (function ( name, val ) {
                $model[ name ] = val
                if ( !isObservable( name, val, $scope.$skipArray ) ) {
                    return //�������зǼ������
                }
                //�ܹ���������accessor
                var accessor
                var valueType = avalon.type( val )
                $events[ name ] = []
                //�ܹ���������accessor
                if ( valueType === "object" && isFunction( val.get ) && Object.keys( val ).length <= 2 ) {
                    var setter = val.set
                    var getter = val.get
                    //��1�ֶ�Ӧ�������ԣ� �������ͨ������������Դ�����ı�
                    accessor = function ( newValue ) {
                        var $events = $vmodel.$events
                        var oldValue = $model[ name ]
                        if ( arguments.length ) {
                            if ( stopRepeatAssign ) {
                                return
                            }
                            if ( isFunction( setter ) ) {
                                var backup = $events[ name ]
                                $events[ name ] = [] //��ջص�����ֹ�ڲ�ð�ݶ��������$fire
                                setter.call( $vmodel, newValue )
                                $events[ name ] = backup
                            }
                        } else {
                            if ( avalon.openComputedCollect ) { // �ռ���ͼˢ�º���
                                collectSubscribers( $events[ name ] )
                            }
                        }
                        newValue = $model[ name ] = getter.call( $vmodel ) //ͬ��$model
                        if ( !isEqual( oldValue, newValue ) ) {
                            notifySubscribers( $events[ name ] ) //ͬ����ͼ
                            safeFire( $vmodel, name, newValue, oldValue ) //����$watch�ص�
                        }
                        return newValue
                    }
                    computedProperties.push( function () {
                        Registry[ expose ] = {
                            evaluator: accessor,
                            element: head,
                            type: "computed::" + name,
                            handler: noop,
                            args: []
                        }
                        accessor()
                        collectSubscribers( $events[ name ] )
                        delete Registry[ expose ]
                    } )
                } else if ( rcomplexType.test( valueType ) ) {
                    //��2�ֶ�Ӧ��ViewModel�������� 
                    accessor = function ( newValue ) {
                        var childVmodel = accessor.child
                        var oldValue = $model[ name ]
                        if ( arguments.length ) {
                            if ( stopRepeatAssign ) {
                                return
                            }
                            if ( !isEqual( oldValue, newValue ) ) {
                                childVmodel = accessor.child = neutrinoFactory( $vmodel, name, newValue, valueType )
                                newValue = $model[ name ] = childVmodel.$model //ͬ��$model
                                var fn = midway[ childVmodel.$id ]
                                fn && fn() //ͬ����ͼ
                                safeFire( $vmodel, name, newValue, oldValue ) //����$watch�ص�
                            }
                        } else {
                            collectSubscribers( $events[ name ] ) //�ռ���ͼ����
                            return childVmodel
                        }
                    }
                    var childVmodel = accessor.child = modelFactory( val, 0, $model[ name ] )
                    childVmodel.$events[ subscribers ] = $events[ name ]
                } else {
                    //��3�ֶ�Ӧ�򵥵��������ͣ��Ա������������
                    accessor = function ( newValue ) {
                        var oldValue = $model[ name ]
                        if ( arguments.length ) {
                            if ( !isEqual( oldValue, newValue ) ) {
                                $model[ name ] = newValue //ͬ��$model
                                notifySubscribers( $events[ name ] ) //ͬ����ͼ
                                safeFire( $vmodel, name, newValue, oldValue ) //����$watch�ص�
                            }
                        } else {
                            collectSubscribers( $events[ name ] )
                            return oldValue
                        }
                    }
                }
                watchedProperties[ name ] = accessor
            })( i, $scope[ i ] )
        }

        $$skipArray.forEach( function ( name ) {
            delete $scope[ name ]
            delete $model[ name ] //��Щ�������Բ�Ӧ����$model�г���
        } )

        $vmodel = defineProperties( $vmodel, descriptorFactory( watchedProperties ), $scope ) //����һ���յ�ViewModel
        for ( var name in $scope ) {
            if ( !watchedProperties[ name ] ) {
                $vmodel[ name ] = $scope[ name ]
            }
        }
        //���$id, $model, $events, $watch, $unwatch, $fire
        $vmodel.$id = generateID()
        $vmodel.$model = $model
        $vmodel.$events = $events
        for ( var i in EventBus ) {
            var fn = EventBus[ i ]
            if ( !W3C ) { //��IE6-8�£�VB����ķ������this����ָ��������Ҫ��bind����һ��
                fn = fn.bind( $vmodel )
            }
            $vmodel[ i ] = fn
        }

        $vmodel.hasOwnProperty = function ( name ) {
            return name in $vmodel.$model
        }
        computedProperties.forEach( function ( collect ) { //�ռ�����
            collect()
        } )
        return $vmodel
    }

//�Ƚ�����ֵ�Ƿ����
    var isEqual = Object.is || function ( v1, v2 ) {
            if ( v1 === 0 && v2 === 0 ) {
                return 1 / v1 === 1 / v2
            } else if ( v1 !== v1 ) {
                return v2 !== v2
            } else {
                return v1 === v2
            }
        }

    function safeFire( a, b, c, d ) {
        if ( a.$events ) {
            EventBus.$fire.call( a, b, c, d )
        }
    }

    var descriptorFactory = W3C ? function ( obj ) {
        var descriptors = {}
        for ( var i in obj ) {
            descriptors[ i ] = {
                get: obj[ i ],
                set: obj[ i ],
                enumerable: true,
                configurable: true
            }
        }
        return descriptors
    } : function ( a ) {
        return a
    }


//Ӧ���ڵ�2��accessor
    var midway = {}

    function neutrinoFactory( parent, name, value, valueType ) {
        //aΪԭ����VM�� bΪ��������¶���
        var son = parent[ name ]
        if ( valueType === "array" ) {
            if ( !Array.isArray( value ) || son === value ) {
                return son //fix https://github.com/RubyLouvre/avalon/issues/261
            }
            son.clear()

            son.pushArray( value.concat() )
            return son
        } else {//object
            var iterators = parent.$events[ name ]
            var pool = son.$events.$withProxyPool
            if ( pool ) {
                proxyCinerator( pool )
                son.$events.$withProxyPool = null
            }
            var ret = modelFactory( value )
            ret.$events[ subscribers ] = iterators
            midway[ ret.$id ] = function ( data ) {
                while ( data = iterators.shift() ) {
                    (function ( el ) {
                        if ( el.type ) { //���°�
                            avalon.nextTick( function () {
                                el.rollback && el.rollback() //��ԭ ms-with ms-on
                                bindingHandlers[ el.type ]( el, el.vmodels )
                            } )
                        }
                    })( data )
                }
                delete midway[ ret.$id ]
            }
            return ret
        }
    }

//===================�޸��������Object.defineProperties��֧��=================
    if ( !canHideOwn ) {
        if ( "__defineGetter__" in avalon ) {
            defineProperty = function ( obj, prop, desc ) {
                if ( 'value' in desc ) {
                    obj[ prop ] = desc.value
                }
                if ( "get" in desc ) {
                    obj.__defineGetter__( prop, desc.get )
                }
                if ( 'set' in desc ) {
                    obj.__defineSetter__( prop, desc.set )
                }
                return obj
            }
            defineProperties = function ( obj, descs ) {
                for ( var prop in descs ) {
                    if ( descs.hasOwnProperty( prop ) ) {
                        defineProperty( obj, prop, descs[ prop ] )
                    }
                }
                return obj
            }
        }
        if ( window.VBArray ) {
            window.execScript( [
                "Function parseVB(code)",
                "\tExecuteGlobal(code)",
                "End Function",
                "Dim VBClassBodies",
                "Set VBClassBodies=CreateObject(\"Scripting.Dictionary\")",
                "Function findOrDefineVBClass(name,body)",
                "\tDim found",
                "\tfound=\"\"",
                "\tFor Each key in VBClassBodies",
                "\t\tIf body=VBClassBodies.Item(key) Then",
                "\t\t\tfound=key",
                "\t\t\tExit For",
                "\t\tEnd If",
                "\tnext",
                "\tIf found=\"\" Then",
                "\t\tparseVB(\"Class \" + name + body)",
                "\t\tVBClassBodies.Add name, body",
                "\t\tfound=name",
                "\tEnd If",
                "\tfindOrDefineVBClass=found",
                "End Function"
            ].join( "\n" ), "VBScript" )

            function VBMediator( accessingProperties, name, value ) {
                var accessor = accessingProperties[ name ]
                if ( typeof accessor === "function" ) {
                    if ( arguments.length === 3 ) {
                        accessor( value )
                    } else {
                        return accessor()
                    }
                }
            }

            defineProperties = function ( name, accessors, properties ) {
                var className = "VBClass" + setTimeout( "1" ),
                    buffer = []
                buffer.push(
                    "\r\n\tPrivate [__data__], [__proxy__]",
                    "\tPublic Default Function [__const__](d, p)",
                    "\t\tSet [__data__] = d: set [__proxy__] = p",
                    "\t\tSet [__const__] = Me", //��ʽ����
                    "\tEnd Function" )
                //�����ͨ����,��ΪVBScript��������JS����������ɾ���ԣ�����������Ԥ�ȶ����
                for ( name in properties ) {
                    if ( !accessors.hasOwnProperty( name ) ) {
                        buffer.push( "\tPublic [" + name + "]" )
                    }
                }
                $$skipArray.forEach( function ( name ) {
                    if ( !accessors.hasOwnProperty( name ) ) {
                        buffer.push( "\tPublic [" + name + "]" )
                    }
                } )
                buffer.push( "\tPublic [" + 'hasOwnProperty' + "]" )
                //��ӷ��������� 
                for ( name in accessors ) {
                    buffer.push(
                        //���ڲ�֪�Է��ᴫ��ʲô,���set, let������
                        "\tPublic Property Let [" + name + "](val" + expose + ")", //setter
                        "\t\tCall [__proxy__]([__data__], \"" + name + "\", val" + expose + ")",
                        "\tEnd Property",
                        "\tPublic Property Set [" + name + "](val" + expose + ")", //setter
                        "\t\tCall [__proxy__]([__data__], \"" + name + "\", val" + expose + ")",
                        "\tEnd Property",
                        "\tPublic Property Get [" + name + "]", //getter
                        "\tOn Error Resume Next", //��������ʹ��set���,�������������鵱�ַ�������
                        "\t\tSet[" + name + "] = [__proxy__]([__data__],\"" + name + "\")",
                        "\tIf Err.Number <> 0 Then",
                        "\t\t[" + name + "] = [__proxy__]([__data__],\"" + name + "\")",
                        "\tEnd If",
                        "\tOn Error Goto 0",
                        "\tEnd Property" )

                }

                buffer.push( "End Class" )
                var code = buffer.join( "\r\n" ),
                    realClassName = window[ 'findOrDefineVBClass' ]( className, code ) //�����VB���Ѷ��壬����������������className����һ�����ࡣ
                if ( realClassName === className ) {
                    window.parseVB( [
                        "Function " + className + "Factory(a, b)", //����ʵ�������������ؼ��Ĳ���
                        "\tDim o",
                        "\tSet o = (New " + className + ")(a, b)",
                        "\tSet " + className + "Factory = o",
                        "End Function"
                    ].join( "\r\n" ) )
                }
                var ret = window[ realClassName + "Factory" ]( accessors, VBMediator ) //�õ����Ʒ
                return ret //�õ����Ʒ
            }
        }
    }

    /*********************************************************************
     *          ������飨��ms-each, ms-repeat���ʹ�ã�                     *
     **********************************************************************/

    function Collection( model ) {
        var array = []
        array.$id = generateID()
        array.$model = model //����ģ��
        array.$events = {}
        array.$proxies = []  //װ������VM����
        array.$events[ subscribers ] = []//װ������Ԫ�ؽڵ��ms-repeat����ת������������
        array._ = modelFactory( {
            length: model.length
        } )
        for ( var i in EventBus ) {
            array[ i ] = EventBus[ i ]
        }
        avalon.mix( array, CollectionPrototype )
        array._.$watch( "length", function ( a, b ) {
            array.$fire( "length", a, b )
        } )
        return array
    }

    var _splice = ap.splice
    var CollectionPrototype = {
        _splice: _splice,
        _fire: function ( method, a, b ) {
            notifySubscribers( this.$events[ subscribers ], method, a, b )
        },
        _add: function ( arr, pos ) { //�ڵ�pos��λ���ϣ����һ��Ԫ��
            var oldLength = this.length
            pos = typeof pos === "number" ? pos : oldLength
            var added = []
            var proxies = []
            for ( var i = 0, n = arr.length; i < n; i++ ) {
                var index = pos + i
                added[ i ] = eachItemFactory( arr[ i ], this.$model[ index ] ) //����������ת��ΪVM����
                proxies[ i ] = eachProxyFactory( index, this )//���ɶ�Ӧ�Ĵ���VM����
            }
            _splice.apply( this, [ pos, 0 ].concat( added ) )
            _splice.apply( this.$proxies, [ pos, 0 ].concat( proxies ) )
            this._fire( "add", pos, added )
            if ( !this._stopFireLength ) {
                return this._.length = this.length
            }
        },
        _del: function ( pos, n ) { //�ڵ�pos��λ���ϣ�ɾ��N��Ԫ��
            var ret = this._splice( pos, n )
            var proxies = this.$proxies.splice( pos, n )
            if ( ret.length ) {
                proxyCinerator( proxies )
                this._fire( "del", pos, n )
                if ( !this._stopFireLength ) {
                    this._.length = this.length
                }
            }
            return ret
        },
        _index: function ( pos ) {
            var proxies = this.$proxies
            for ( var n = proxies.length; pos < n; pos++ ) {
                var el = proxies[ pos ]
                el.$$index = pos
                notifySubscribers( el.$subscribers )
            }
        },
        push: function () {
            var pos = this.length
            ap.push.apply( this.$model, arguments )
            this._add( arguments )
            this._index( pos )
            return this.length
        },
        pushArray: function ( array ) {
            return this.push.apply( this, array )
        },
        unshift: function () {
            ap.unshift.apply( this.$model, arguments )
            this._add( arguments, 0 )
            this._index( 0 )
            return this.length //IE67��unshift���᷵�س���
        },
        shift: function () {
            var el = this.$model.shift()
            this._del( 0, 1 )
            this._index( 0 )
            return el //���ر��Ƴ���Ԫ��
        },
        pop: function () {
            var el = this.$model.pop()
            this._del( this.length - 1, 1 )
            return el //���ر��Ƴ���Ԫ��
        },
        size: function () { //ȡ�����鳤�ȣ������������ͬ����ͼ��length����
            return this._.length
        },
        splice: function ( must ) {
            // ������ڵ�һ����������Ҫ����-1, Ϊ��ӻ�ɾ��Ԫ�صĻ���
            var a = _number( must, this.length )
            var removed = _splice.apply( this.$model, arguments )
            var ret = [], change
            this._stopFireLength = true //ȷ������������� , $watch("length",fn)ֻ����һ��
            if ( removed.length ) {
                ret = this._del( a, removed.length )
                change = true
            }
            if ( arguments.length > 2 ) {
                this._add( aslice.call( arguments, 2 ), a )
                change = true
            }
            this._stopFireLength = false
            this._.length = this.length
            if ( change ) {
                this._index( 0 )
            }
            return ret //���ر��Ƴ���Ԫ��
        },
        contains: function ( el ) { //�ж��Ƿ����
            return this.indexOf( el ) !== -1
        },
        remove: function ( el ) { //�Ƴ���һ�����ڸ���ֵ��Ԫ��
            return this.removeAt( this.indexOf( el ) )
        },
        removeAt: function ( index ) { //�Ƴ�ָ�������ϵ�Ԫ��
            return index >= 0 ? this.splice( index, 1 ) : []
        },
        clear: function () {
            this.$model.length = this.length = this._.length = 0 //�������
            proxyCinerator( this.$proxies )
            this._fire( "clear", 0 )
            return this
        },
        removeAll: function ( all ) { //�Ƴ�N��Ԫ��
            if ( Array.isArray( all ) ) {
                all.forEach( function ( el ) {
                    this.remove( el )
                }, this )
            } else if ( typeof all === "function" ) {
                for ( var i = this.length - 1; i >= 0; i-- ) {
                    var el = this[ i ]
                    if ( all( el, i ) ) {
                        this.splice( i, 1 )
                    }
                }
            } else {
                this.clear()
            }
        },
        ensure: function ( el ) {
            if ( !this.contains( el ) ) { //ֻ�в����ڲ�push
                this.push( el )
            }
            return this
        },
        set: function ( index, val ) {
            if ( index >= 0 ) {
                var valueType = avalon.type( val )
                if ( val && val.$model ) {
                    val = val.$model
                }
                var target = this[ index ]
                if ( valueType === "object" ) {
                    for ( var i in val ) {
                        if ( target.hasOwnProperty( i ) ) {
                            target[ i ] = val[ i ]
                        }
                    }
                } else if ( valueType === "array" ) {
                    target.clear().push.apply( target, val )
                } else if ( target !== val ) {
                    this[ index ] = this.$model[ index ] = val
                    var el = this.$proxies[ index ]
                    notifySubscribers( el.$subscribers )
                }
            }
            return this
        }
    }

    "sort,reverse".replace( rword, function ( method ) {
        CollectionPrototype[ method ] = function ( fn ) {
            var aaa = this.$model
            var bbb = aaa.slice( 0 ) //���ɲ���������
            var proxies = this.$proxies
            var sorted = false
            ap[ method ].apply( aaa, arguments ) //�ƶ�$model����
            for ( var i = 0, n = bbb.length; i < n; i++ ) {
                var a = aaa[ i ]
                var b = bbb[ i ]
                if ( !isEqual( a, b ) ) {
                    sorted = true
                    //�ƶ�����������
                    var index = bbb.indexOf( a, i )
                    bbb[ i ] = bbb[ index ]
                    bbb[ index ] = b
                    //�ƶ�VM����
                    var c = this[ i ]
                    this[ i ] = this[ index ]
                    this[ index ] = c
                    //�ƶ�����VM����
                    var d = proxies.splice( index, 1 )[ 0 ]
                    proxies.splice( i, 0, d )
                    //�ƶ��ڵ�����
                    this._fire( "move", index, i )
                }
            }
            bbb = void 0
            if ( sorted ) {
                this._index( 0 )
            }
            return this
        }
    } )


    /*********************************************************************
     *                           ��������ϵͳ                             *
     **********************************************************************/
    var ronduplex = /^(duplex|on)$/

    function registerSubscriber( data ) {
        Registry[ expose ] = data //����˺���,����collectSubscribers�ռ�
        avalon.openComputedCollect = true
        var fn = data.evaluator
        if ( fn ) { //�������ֵ����
            try {
                var c = ronduplex.test( data.type ) ? data : fn.apply( 0, data.args )
                data.handler( c, data.element, data )
            } catch ( e ) {
                // log("warning:exception throwed in [registerSubscriber] " + e)
                delete data.evaluator
                var node = data.element
                if ( node.nodeType === 3 ) {
                    var parent = node.parentNode
                    if ( kernel.commentInterpolate ) {
                        parent.replaceChild( DOC.createComment( data.value ), node )
                    } else {
                        node.data = openTag + data.value + closeTag
                    }
                }
            }
        }
        avalon.openComputedCollect = false
        delete Registry[ expose ]
    }

    function collectSubscribers( list ) { //�ռ�����������������Ķ�����
        var data = Registry[ expose ]
        if ( list && data && avalon.Array.ensure( list, data ) && data.element ) { //ֻ�����鲻���ڴ�Ԫ�ز�push��ȥ
            addSubscribers( data, list )
        }
    }

    function addSubscribers( data, list ) {
        data.$uuid = data.$uuid || generateID()
        list.$uuid = list.$uuid || generateID()
        var obj = {
            data: data,
            list: list,
            toString: function () {
                return data.$uuid + " " + list.$uuid
            }
        }
        if ( !$$subscribers[ obj ] ) {
            $$subscribers[ obj ] = 1
            $$subscribers.push( obj )
        }
    }

    var $$subscribers = [],
        $startIndex = 0,
        $maxIndex = 200,
        beginTime = new Date(),
        removeID

    function removeSubscribers() {
        for ( var i = $startIndex, n = $startIndex + $maxIndex; i < n; i++ ) {
            var obj = $$subscribers[ i ]
            if ( !obj ) {
                break
            }
            var data = obj.data
            var el = data.element
            var remove = el === null ? 1 : (el.nodeType === 1 ? typeof el.sourceIndex === "number" ?
            el.sourceIndex === 0 : !root.contains( el ) : !avalon.contains( root, el ))
            if ( remove ) { //�����û����DOM��
                $$subscribers.splice( i, 1 )
                delete $$subscribers[ obj ]
                avalon.Array.remove( obj.list, data )
                //log("debug: remove " + data.type)
                disposeData( data )
                obj.data = obj.list = null
                i--
                n--

            }
        }
        obj = $$subscribers[ i ]
        if ( obj ) {
            $startIndex = n
        } else {
            $startIndex = 0
        }
        beginTime = new Date()
    }

    function disposeData( data ) {
        data.element = null
        data.rollback && data.rollback()
        for ( var key in data ) {
            data[ key ] = null
        }
    }

    function notifySubscribers( list ) { //֪ͨ����������������Ķ����߸�������
        clearTimeout( removeID )
        if ( new Date() - beginTime > 444 ) {
            removeSubscribers()
        } else {
            removeID = setTimeout( removeSubscribers, 444 )
        }
        if ( list && list.length ) {
            var args = aslice.call( arguments, 1 )
            for ( var i = list.length, fn; fn = list[ --i ]; ) {
                var el = fn.element
                if ( el && el.parentNode ) {
                    if ( fn.$repeat ) {
                        fn.handler.apply( fn, args ) //����������ķ���
                    } else if ( fn.type !== "on" ) { //�¼���ֻ�����û�����,�����ɳ��򴥷�
                        var fun = fn.evaluator || noop
                        fn.handler( fun.apply( 0, fn.args || [] ), el, fn )
                    }
                }
            }
        }
    }

    /************************************************************************
     *            HTML����(parseHTML, innerHTML, clearHTML)                  *
     ************************************************************************/
//parseHTML�ĸ�������
    var tagHooks = {
        area: [ 1, "<map>" ],
        param: [ 1, "<object>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</table>" ],
        legend: [ 1, "<fieldset>" ],
        option: [ 1, "<select multiple='multiple'>" ],
        thead: [ 1, "<table>", "</table>" ],
        //������ﲻд</tbody></table>,��IE6-9���ڶ��һ����ֵ�caption��ǩ
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        //������ﲻд</tr></tbody></table>,��IE6-9���ڶ��һ����ֵ�caption��ǩ
        th: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        td: [ 3, "<table><tbody><tr>" ],
        g: [ 1, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">', '</svg>' ],
        //IE6-8����innerHTML���ɽڵ�ʱ������ֱ�Ӵ���no-scopeԪ����HTML5���±�ǩ
        _default: W3C ? [ 0, "" ] : [ 1, "X<div>" ] //div���Բ��ñպ�
    }

    tagHooks.optgroup = tagHooks.option
    tagHooks.tbody = tagHooks.tfoot = tagHooks.colgroup = tagHooks.caption = tagHooks.thead
    String( "circle,defs,ellipse,image,line,path,polygon,polyline,rect,symbol,text,use" ).replace( rword, function ( tag ) {
        tagHooks[ tag ] = tagHooks.g //����SVG
    } )
    var rtagName = /<([\w:]+)/  //ȡ����tagName
    var rxhtml = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig
    var rcreate = W3C ? /[^\d\D]/ : /(<(?:script|link|style|meta|noscript))/ig
    var scriptTypes = oneObject( [ "", "text/javascript", "text/ecmascript", "application/ecmascript", "application/javascript" ] )
    var rnest = /<(?:tb|td|tf|th|tr|col|opt|leg|cap|area)/ //��Ҫ������Ƕ��ϵ�ı�ǩ
    var script = DOC.createElement( "script" )
    avalon.parseHTML = function ( html ) {
        if ( typeof html !== "string" ) {
            html = html + ""
        }
        html = html.replace( rxhtml, "<$1></$2>" ).trim()
        var tag = (rtagName.exec( html ) || [ "", "" ])[ 1 ].toLowerCase(),
        //ȡ�����ǩ��
            wrap = tagHooks[ tag ] || tagHooks._default,
            fragment = hyperspace.cloneNode( false ),
            wrapper = cinerator,
            firstChild, neo
        if ( !W3C ) { //fix IE
            html = html.replace( rcreate, "<br class=msNoScope>$1" ) //��link style script�ȱ�ǩ֮ǰ���һ������
        }
        wrapper.innerHTML = wrap[ 1 ] + html + (wrap[ 2 ] || "")
        var els = wrapper.getElementsByTagName( "script" )
        if ( els.length ) { //ʹ��innerHTML���ɵ�script�ڵ㲻�ᷢ��������ִ��text����
            for ( var i = 0, el; el = els[ i++ ]; ) {
                if ( scriptTypes[ el.type ] ) {
                    //��͵��ת�﷽ʽ�ָ�ִ�нű�����
                    neo = script.cloneNode( false ) //FF����ʡ�Բ���
                    ap.forEach.call( el.attributes, function ( attr ) {
                        if ( attr && attr.specified ) {
                            neo[ attr.name ] = attr.value //����������
                            neo.setAttribute( attr.name, attr.value )
                        }
                    } )
                    neo.text = el.text
                    el.parentNode.replaceChild( neo, el ) //�滻�ڵ�
                }
            }
        }
        //�Ƴ�����Ϊ�˷�����Ƕ��ϵ����ӵı�ǩ
        for ( i = wrap[ 0 ]; i--; wrapper = wrapper.lastChild ) {
        }
        if ( !W3C ) { //fix IE
            for ( els = wrapper[ "getElementsByTagName" ]( "br" ), i = 0; el = els[ i++ ]; ) {
                if ( el.className && el.className === "msNoScope" ) {
                    el.parentNode.removeChild( el )
                    i--
                }
            }
            for ( els = wrapper.all, i = 0; el = els[ i++ ]; ) { //fix VML
                if ( isVML( el ) ) {
                    fixVML( el )
                }
            }
        }

        while ( firstChild = wrapper.firstChild ) { // ��wrapper�ϵĽڵ�ת�Ƶ��ĵ���Ƭ�ϣ�
            fragment.appendChild( firstChild )
        }
        return fragment
    }

    function isVML( src ) {
        var nodeName = src.nodeName
        return nodeName.toLowerCase() === nodeName && src.scopeName && src.outerText === ""
    }

    function fixVML( node ) {
        if ( node.currentStyle.behavior !== "url(#default#VML)" ) {
            node.style.behavior = "url(#default#VML)"
            node.style.display = "inline-block"
            node.style.zoom = 1 //hasLayout
        }
    }

    avalon.innerHTML = function ( node, html ) {
        if ( !W3C && (!rcreate.test( html ) && !rnest.test( html )) ) {
            try {
                node.innerHTML = html
                return
            } catch ( e ) {
            }
        }
        var a = this.parseHTML( html )
        this.clearHTML( node ).appendChild( a )
    }
    avalon.clearHTML = function ( node ) {
        node.textContent = ""
        while ( node.firstChild ) {
            node.removeChild( node.firstChild )
        }
        return node
    }

    /*********************************************************************
     *                           ɨ��ϵͳ                                 *
     **********************************************************************/
    var scanObject = {}
    avalon.scanCallback = function ( fn, group ) {
        group = group || "$all"
        var array = scanObject[ group ] || (scanObject[ group ] = [])
        array.push( fn )
    }
    avalon.scan = function ( elem, vmodel, group ) {
        elem = elem || root
        group = group || "$all"
        var array = scanObject[ group ] || []
        var vmodels = vmodel ? [].concat( vmodel ) : []
        var scanIndex = 0;
        var scanAll = false
        var fn
        var dirty = false

        function cb( i ) {
            scanIndex += i
            dirty = true
            setTimeout( function () {
                if ( scanIndex <= 0 && !scanAll ) {
                    scanAll = true
                    while ( fn = array.shift() ) {
                        fn()
                    }
                }
            } )
        }

        vmodels.cb = cb
        scanTag( elem, vmodels )
        //html, include, widget
        if ( !dirty ) {
            while ( fn = array.shift() ) {
                fn()
            }
        }
    }

//http://www.w3.org/TR/html5/syntax.html#void-elements
    var stopScan = oneObject( "area,base,basefont,br,col,command,embed,hr,img,input,link,meta,param,source,track,wbr,noscript,script,style,textarea".toUpperCase() )

    function checkScan( elem, callback, innerHTML ) {
        var id = setTimeout( function () {
            var currHTML = elem.innerHTML
            clearTimeout( id )
            if ( currHTML === innerHTML ) {
                callback()
            } else {
                checkScan( elem, callback, currHTML )
            }
        } )
    }


    function createSignalTower( elem, vmodel ) {
        var id = elem.getAttribute( "avalonctrl" ) || vmodel.$id
        elem.setAttribute( "avalonctrl", id )
        vmodel.$events.expr = elem.tagName + '[avalonctrl="' + id + '"]'
    }

    var getBindingCallback = function ( elem, name, vmodels ) {
        var callback = elem.getAttribute( name )
        if ( callback ) {
            for ( var i = 0, vm; vm = vmodels[ i++ ]; ) {
                if ( vm.hasOwnProperty( callback ) && typeof vm[ callback ] === "function" ) {
                    return vm[ callback ]
                }
            }
        }
    }

    function executeBindings( bindings, vmodels ) {
        if ( bindings.length )
            vmodels.cb( bindings.length )

        for ( var i = 0, data; data = bindings[ i++ ]; ) {
            data.vmodels = vmodels
            bindingHandlers[ data.type ]( data, vmodels )
            if ( data.evaluator && data.element && data.element.nodeType === 1 ) { //�Ƴ����ݰ󶨣���ֹ�����ν���
                //chromeʹ��removeAttributeNode�Ƴ������ڵ����Խڵ�ʱ�ᱨ�� https://github.com/RubyLouvre/avalon/issues/99
                data.element.removeAttribute( data.name )
            }
        }
        bindings.length = 0
    }


    var rmsAttr = /ms-(\w+)-?(.*)/
    var priorityMap = {
        "if": 10,
        "repeat": 90,
        "data": 100,
        "widget": 110,
        "each": 1400,
        "with": 1500,
        "duplex": 2000,
        "on": 3000
    }
    var events = oneObject( "animationend,blur,change,input,click,dblclick,focus,keydown,keypress,keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,scan,scroll,submit" )
    var obsoleteAttrs = oneObject( "value,title,alt,checked,selected,disabled,readonly,enabled" )

    function bindingSorter( a, b ) {
        return a.priority - b.priority
    }

    function scanTag( elem, vmodels, node ) {
        //ɨ��˳��  ms-skip(0) --> ms-important(1) --> ms-controller(2) --> ms-if(10) --> ms-repeat(100) 
        //--> ms-if-loop(110) --> ms-attr(970) ...--> ms-each(1400)-->ms-with(1500)--��ms-duplex(2000)���
        var a = elem.getAttribute( "ms-skip" )
        //#360 �ھ�ʽIE�� Object��ǩ������Flash����Դʱ,���ܳ���û��getAttributeNode,innerHTML������
        if ( !elem.getAttributeNode ) {
            return log( "warning " + elem.tagName + " no getAttributeNode method" )
        }
        var b = elem.getAttributeNode( "ms-important" )
        var c = elem.getAttributeNode( "ms-controller" )
        if ( typeof a === "string" ) {
            return
        } else if ( node = b || c ) {
            var newVmodel = avalon.vmodels[ node.value ]
            if ( !newVmodel ) {
                return
            }
            //ms-important��������VM��ms-controller�෴
            var cb = vmodels.cb
            vmodels = node === b ? [ newVmodel ] : [ newVmodel ].concat( vmodels )
            vmodels.cb = cb
            var name = node.name
            elem.removeAttribute( name ) //removeAttributeNode����ˢ��[ms-controller]��ʽ����
            avalon( elem ).removeClass( name )
            createSignalTower( elem, newVmodel )
        }
        scanAttr( elem, vmodels ) //ɨ�����Խڵ�
    }

    function scanNodeList( parent, vmodels ) {
        var node = parent.firstChild
        while ( node ) {
            var nextNode = node.nextSibling
            scanNode( node, node.nodeType, vmodels )
            node = nextNode
        }
    }

    function scanNodeArray( nodes, vmodels ) {
        for ( var i = 0, node; node = nodes[ i++ ]; ) {
            scanNode( node, node.nodeType, vmodels )
        }
    }

    function scanNode( node, nodeType, vmodels ) {
        if ( nodeType === 1 ) {
            scanTag( node, vmodels ) //ɨ��Ԫ�ؽڵ�
        } else if ( nodeType === 3 && rexpr.test( node.data ) ) {
            scanText( node, vmodels ) //ɨ���ı��ڵ�
        } else if ( kernel.commentInterpolate && nodeType === 8 && !rexpr.test( node.nodeValue ) ) {
            scanText( node, vmodels ) //ɨ��ע�ͽڵ�
        }
    }

    function scanAttr( elem, vmodels ) {
        //��ֹsetAttribute, removeAttributeʱ attributes�Զ���ͬ��,����forѭ������
        var attributes = getAttributes ? getAttributes( elem ) : avalon.slice( elem.attributes )
        var bindings = [],
            msData = {},
            match
        for ( var i = 0, attr; attr = attributes[ i++ ]; ) {
            if ( attr.specified ) {
                if ( match = attr.name.match( rmsAttr ) ) {
                    //�������ָ��ǰ׺������
                    var type = match[ 1 ]
                    var param = match[ 2 ] || ""
                    var value = attr.value
                    var name = attr.name
                    msData[ name ] = value
                    if ( events[ type ] ) {
                        param = type
                        type = "on"
                    } else if ( obsoleteAttrs[ type ] ) {
                        log( "ms-" + type + "�Ѿ�������,��ʹ��ms-attr-*����" )
                        if ( type === "enabled" ) { //�Ե�ms-enabled��,��ms-disabled����
                            type = "disabled"
                            value = "!(" + value + ")"
                        }
                        param = type
                        type = "attr"
                        elem.removeAttribute( name )
                        name = "ms-attr-" + param
                        elem.setAttribute( name, value )
                        match = [ name ]
                        msData[ name ] = value
                    }
                    if ( typeof bindingHandlers[ type ] === "function" ) {
                        var binding = {
                            type: type,
                            param: param,
                            element: elem,
                            name: match[ 0 ],
                            value: value,
                            priority: type in priorityMap ? priorityMap[ type ] : type.charCodeAt( 0 ) * 10 + (Number( param ) || 0)
                        }
                        if ( type === "if" && param.indexOf( "loop" ) > -1 ) {
                            binding.priority += 100
                        }
                        if ( vmodels.length ) {
                            bindings.push( binding )
                            if ( type === "widget" ) {
                                elem.msData = elem.msData || msData
                            }
                        }
                    }
                }
            }
        }
        bindings.sort( bindingSorter )
        if ( msData[ "ms-attr-checked" ] && msData[ "ms-duplex" ] ) {
            log( "warning!һ��Ԫ���ϲ���ͬʱ����ms-attr-checked��ms-duplex" )
        }
        var scanNode = true
        for ( var i = 0, binding; binding = bindings[ i ]; i++ ) {
            var type = binding.type
            if ( rnoscanAttrBinding.test( type ) ) {
                return executeBindings( bindings.slice( 0, i + 1 ), vmodels )
            } else if ( scanNode ) {
                scanNode = !rnoscanNodeBinding.test( type )
            }
        }
        executeBindings( bindings, vmodels )

        if ( scanNode && !stopScan[ elem.tagName ] && rbind.test( elem.innerHTML.replace( rlt, "<" ).replace( rgt, ">" ) ) ) {
            scanNodeList( elem, vmodels ) //ɨ������Ԫ��
        }
    }

    var rnoscanAttrBinding = /^if|widget|repeat$/
    var rnoscanNodeBinding = /^each|with|html|include$/
//IE67�£���ѭ�����У�һ���ڵ������ͨ��cloneNode�õ����Զ������Ե�specifiedΪfalse���޷���������ķ�֧��
//���������ȥ��scanAttr�е�attr.specified��⣬һ��Ԫ�ػ���80+�����Խڵ㣨��Ϊ�������ֹ����������Զ������ԣ��������׿���ҳ��
    if ( !"1" [ 0 ] ) {
        var cacheAttrs = createCache( 512 )
        var rattrs = /\s+(ms-[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g,
            rquote = /^['"]/,
            rtag = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/i,
            ramp = /&amp;/g
        //IE6-8����HTML5�±�ǩ���Ὣ���ֽ�����Ԫ�ؽڵ���һ���ı��ڵ�
        //<body><section>ddd</section></body>
        //        window.onload = function() {
        //            var body = document.body
        //            for (var i = 0, el; el = body.children[i++]; ) {
        //                avalon.log(el.outerHTML)
        //            }
        //        }
        //�������<SECTION>, </SECTION>
        var getAttributes = function ( elem ) {
            var html = elem.outerHTML
            //����IE6-8����HTML5�±�ǩ���������<br>�Ȱ�պϱ�ǩouterHTMLΪ�յ����
            if ( html.slice( 0, 2 ) === "</" || !html.trim() ) {
                return []
            }
            var str = html.match( rtag )[ 0 ]
            var attributes = [],
                match,
                k, v;
            if ( cacheAttrs[ str ] ) {
                return cacheAttrs[ str ]
            }
            while ( k = rattrs.exec( str ) ) {
                v = k[ 2 ]
                if ( v ) {
                    v = (rquote.test( v ) ? v.slice( 1, -1 ) : v).replace( ramp, "&" )
                }
                var name = k[ 1 ].toLowerCase()
                match = name.match( rmsAttr )
                var binding = {
                    name: name,
                    specified: true,
                    value: v || ""
                }
                attributes.push( binding )
            }
            return cacheAttrs( str, attributes )
        }
    }

    var rfilters = /\|\s*(\w+)\s*(\([^)]*\))?/g,
        r11a = /\|\|/g,
        r11b = /U2hvcnRDaXJjdWl0/g,
        rlt = /&lt;/g,
        rgt = /&gt;/g

    function trimFilter( value, leach ) {
        if ( value.indexOf( "|" ) > 0 ) { // ��ȡ������ ���滻�����ж�·��
            value = value.replace( r11a, "U2hvcnRDaXJjdWl0" ) //btoa("ShortCircuit")
            value = value.replace( rfilters, function ( c, d, e ) {
                leach.push( d + (e || "") )
                return ""
            } )
            value = value.replace( r11b, "||" ) //��ԭ��·��
        }
        return value
    }

    function scanExpr( str ) {
        var tokens = [],
            value, start = 0,
            stop
        do {
            stop = str.indexOf( openTag, start )
            if ( stop === -1 ) {
                break
            }
            value = str.slice( start, stop )
            if ( value ) { // {{ ��ߵ��ı�
                tokens.push( {
                    value: value,
                    expr: false
                } )
            }
            start = stop + openTag.length
            stop = str.indexOf( closeTag, start )
            if ( stop === -1 ) {
                break
            }
            value = str.slice( start, stop )
            if ( value ) { //����{{ }}��ֵ���ʽ
                var leach = []
                value = trimFilter( value, leach )
                tokens.push( {
                    value: value,
                    expr: true,
                    filters: leach.length ? leach : void 0
                } )
            }
            start = stop + closeTag.length
        } while ( 1 )
        value = str.slice( start )
        if ( value ) { //}} �ұߵ��ı�
            tokens.push( {
                value: value,
                expr: false
            } )
        }

        return tokens
    }

    function scanText( textNode, vmodels ) {
        var bindings = []
        if ( textNode.nodeType === 8 ) {
            var leach = []
            var value = trimFilter( textNode.nodeValue, leach )
            var token = {
                expr: true,
                value: value
            }
            if ( leach.length ) {
                token.filters = leach
            }
            var tokens = [ token ]
        } else {
            tokens = scanExpr( textNode.data )
        }
        if ( tokens.length ) {
            for ( var i = 0, token; token = tokens[ i++ ]; ) {
                var node = DOC.createTextNode( token.value ) //���ı�ת��Ϊ�ı��ڵ㣬���滻ԭ�����ı��ڵ�
                if ( token.expr ) {
                    var filters = token.filters
                    var binding = {
                        type: "text",
                        element: node,
                        value: token.value,
                        filters: filters
                    }
                    if ( filters && filters.indexOf( "html" ) !== -1 ) {
                        avalon.Array.remove( filters, "html" )
                        binding.type = "html"
                        binding.group = 1
                        if ( !filters.length ) {
                            delete bindings.filters
                        }
                    }
                    bindings.push( binding ) //�ռ����в�ֵ���ʽ���ı�
                }
                hyperspace.appendChild( node )
            }
            textNode.parentNode.replaceChild( hyperspace, textNode )
            if ( bindings.length )
                executeBindings( bindings, vmodels )
        }
    }

    /*********************************************************************
     *                  avalon��ԭ�ͷ���������                            *
     **********************************************************************/

    function hyphen( target ) {
        //ת��Ϊ���ַ��߷��
        return target.replace( /([a-z\d])([A-Z]+)/g, "$1-$2" ).toLowerCase()
    }

    function camelize( target ) {
        //ת��Ϊ�շ���
        if ( target.indexOf( "-" ) < 0 && target.indexOf( "_" ) < 0 ) {
            return target //��ǰ�жϣ����getStyle�ȵ�Ч��
        }
        return target.replace( /[-_][^-_]/g, function ( match ) {
            return match.charAt( 1 ).toUpperCase()
        } )
    }

    var ClassListMethods = {
        _toString: function () {
            var node = this.node
            var cls = node.className
            var str = typeof cls === "string" ? cls : cls.baseVal
            return str.split( /\s+/ ).join( " " )
        },
        _contains: function ( cls ) {
            return (" " + this + " ").indexOf( " " + cls + " " ) > -1
        },
        _add: function ( cls ) {
            if ( !this.contains( cls ) ) {
                this._set( this + " " + cls )
            }
        },
        _remove: function ( cls ) {
            this._set( (" " + this + " ").replace( " " + cls + " ", " " ) )
        },
        __set: function ( cls ) {
            cls = cls.trim()
            var node = this.node
            if ( typeof node.className === "string" ) {
                node.className = cls
            } else { //SVGԪ�ص�className��һ������ SVGAnimatedString { baseVal="", animVal=""}��ֻ��ͨ��set/getAttribute����
                node.setAttribute( "class", cls )
            }
        } //toggle���ڰ汾���죬��˲�ʹ����
    }

    function ClassList( node ) {
        if ( !("classList" in node) ) {
            node.classList = {
                node: node
            }
            for ( var k in ClassListMethods ) {
                node.classList[ k.slice( 1 ) ] = ClassListMethods[ k ]
            }
        }
        return node.classList
    }


    "add,remove".replace( rword, function ( method ) {
        avalon.fn[ method + "Class" ] = function ( cls ) {
            var el = this[ 0 ]
            //https://developer.mozilla.org/zh-CN/docs/Mozilla/Firefox/Releases/26
            if ( cls && typeof cls === "string" && el && el.nodeType === 1 ) {
                cls.replace( /\S+/g, function ( c ) {
                    ClassList( el )[ method ]( c )
                } )
            }
            return this
        }
    } )
    avalon.fn.mix( {
        hasClass: function ( cls ) {
            var el = this[ 0 ] || {}
            return el.nodeType === 1 && ClassList( el ).contains( cls )
        },
        toggleClass: function ( value, stateVal ) {
            var className, i = 0
            var classNames = value.split( /\s+/ )
            var isBool = typeof stateVal === "boolean"
            while ( (className = classNames[ i++ ]) ) {
                var state = isBool ? stateVal : !this.hasClass( className )
                this[ state ? "addClass" : "removeClass" ]( className )
            }
            return this
        },
        attr: function ( name, value ) {
            if ( arguments.length === 2 ) {
                this[ 0 ].setAttribute( name, value )
                return this
            } else {
                return this[ 0 ].getAttribute( name )
            }
        },
        data: function ( name, value ) {
            name = "data-" + hyphen( name || "" )
            switch ( arguments.length ) {
                case 2:
                    this.attr( name, value )
                    return this
                case 1:
                    var val = this.attr( name )
                    return parseData( val )
                case 0:
                    var ret = {}
                    ap.forEach.call( this[ 0 ].attributes, function ( attr ) {
                        if ( attr ) {
                            name = attr.name
                            if ( !name.indexOf( "data-" ) ) {
                                name = camelize( name.slice( 5 ) )
                                ret[ name ] = parseData( attr.value )
                            }
                        }
                    } )
                    return ret
            }
        },
        removeData: function ( name ) {
            name = "data-" + hyphen( name )
            this[ 0 ].removeAttribute( name )
            return this
        },
        css: function ( name, value ) {
            if ( avalon.isPlainObject( name ) ) {
                for ( var i in name ) {
                    avalon.css( this, i, name[ i ] )
                }
            } else {
                var ret = avalon.css( this, name, value )
            }
            return ret !== void 0 ? ret : this
        },
        position: function () {
            var offsetParent, offset,
                elem = this[ 0 ],
                parentOffset = {
                    top: 0,
                    left: 0
                }
            if ( !elem ) {
                return
            }
            if ( this.css( "position" ) === "fixed" ) {
                offset = elem.getBoundingClientRect()
            } else {
                offsetParent = this.offsetParent() //�õ�������offsetParent
                offset = this.offset() // �õ���ȷ��offsetParent
                if ( offsetParent[ 0 ].tagName !== "HTML" ) {
                    parentOffset = offsetParent.offset()
                }
                parentOffset.top += avalon.css( offsetParent[ 0 ], "borderTopWidth", true )
                parentOffset.left += avalon.css( offsetParent[ 0 ], "borderLeftWidth", true )
            }
            return {
                top: offset.top - parentOffset.top - avalon.css( elem, "marginTop", true ),
                left: offset.left - parentOffset.left - avalon.css( elem, "marginLeft", true )
            }
        },
        offsetParent: function () {
            var offsetParent = this[ 0 ].offsetParent || root
            while ( offsetParent && (offsetParent.tagName !== "HTML") && avalon.css( offsetParent, "position" ) === "static" ) {
                offsetParent = offsetParent.offsetParent
            }
            return avalon( offsetParent || root )
        },
        bind: function ( type, fn, phase ) {
            if ( this[ 0 ] ) { //�˷���������
                return avalon.bind( this[ 0 ], type, fn, phase )
            }
        },
        unbind: function ( type, fn, phase ) {
            if ( this[ 0 ] ) {
                avalon.unbind( this[ 0 ], type, fn, phase )
            }
            return this
        },
        val: function ( value ) {
            var node = this[ 0 ]
            if ( node && node.nodeType === 1 ) {
                var get = arguments.length === 0
                var access = get ? ":get" : ":set"
                var fn = valHooks[ getValType( node ) + access ]
                if ( fn ) {
                    var val = fn( node, value )
                } else if ( get ) {
                    return (node.value || "").replace( /\r/g, "" )
                } else {
                    node.value = value
                }
            }
            return get ? val : this
        }
    } )

    function parseData( data ) {
        try {
            if ( typeof data === "object" )
                return data
            data = data === "true" ? true :
                data === "false" ? false :
                    data === "null" ? null : +data + "" === data ? +data : rbrace.test( data ) ? avalon.parseJSON( data ) : data
        } catch ( e ) {
        }
        return data
    }

    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g
    avalon.parseJSON = window.JSON ? JSON.parse : function ( data ) {
        if ( typeof data === "string" ) {
            data = data.trim();
            if ( data ) {
                if ( rvalidchars.test( data.replace( rvalidescape, "@" )
                        .replace( rvalidtokens, "]" )
                        .replace( rvalidbraces, "" ) ) ) {
                    return (new Function( "return " + data ))();
                }
            }
            avalon.error( "Invalid JSON: " + data );
        }
    }

//����avalon.fn.scrollLeft, avalon.fn.scrollTop����
    avalon.each( {
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function ( method, prop ) {
        avalon.fn[ method ] = function ( val ) {
            var node = this[ 0 ] || {}, win = getWindow( node ),
                top = method === "scrollTop"
            if ( !arguments.length ) {
                return win ? (prop in win) ? win[ prop ] : root[ method ] : node[ method ]
            } else {
                if ( win ) {
                    win.scrollTo( !top ? val : avalon( win ).scrollLeft(), top ? val : avalon( win ).scrollTop() )
                } else {
                    node[ method ] = val
                }
            }
        }
    } )

    function getWindow( node ) {
        return node.window && node.document ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
    }

//=============================css���=======================
    var cssHooks = avalon.cssHooks = {}
    var prefixes = [ "", "-webkit-", "-o-", "-moz-", "-ms-" ]
    var cssMap = {
        "float": "cssFloat"
    }
    avalon.cssNumber = oneObject( "columnCount,order,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom" )

    avalon.cssName = function ( name, host, camelCase ) {
        if ( cssMap[ name ] ) {
            return cssMap[ name ]
        }
        host = host || root.style
        for ( var i = 0, n = prefixes.length; i < n; i++ ) {
            camelCase = camelize( prefixes[ i ] + name )
            if ( camelCase in host ) {
                return (cssMap[ name ] = camelCase)
            }
        }
        return null
    }
    cssHooks[ "@:set" ] = function ( node, name, value ) {
        try { //node.style.width = NaN;node.style.width = "xxxxxxx";node.style.width = undefine �ھ�ʽIE�»����쳣
            node.style[ name ] = value
        } catch ( e ) {
        }
    }
    if ( window.getComputedStyle ) {
        cssHooks[ "@:get" ] = function ( node, name ) {
            if ( !node || !node.style ) {
                throw new Error( "getComputedStyleҪ����һ���ڵ� " + node )
            }
            var ret, styles = getComputedStyle( node, null )
            if ( styles ) {
                ret = name === "filter" ? styles.getPropertyValue( name ) : styles[ name ]
                if ( ret === "" ) {
                    ret = node.style[ name ] //�����������Ҫ�����ֶ�ȡ������ʽ
                }
            }
            return ret
        }
        cssHooks[ "opacity:get" ] = function ( node ) {
            var ret = cssHooks[ "@:get" ]( node, "opacity" )
            return ret === "" ? "1" : ret
        }
    } else {
        var rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i
        var rposition = /^(top|right|bottom|left)$/
        var ralpha = /alpha\([^)]*\)/i
        var ie8 = !!window.XDomainRequest
        var salpha = "DXImageTransform.Microsoft.Alpha"
        var border = {
            thin: ie8 ? '1px' : '2px',
            medium: ie8 ? '3px' : '4px',
            thick: ie8 ? '5px' : '6px'
        }
        cssHooks[ "@:get" ] = function ( node, name ) {
            //ȡ�þ�ȷֵ���������п����Ǵ�em,pc,mm,pt,%�ȵ�λ
            var currentStyle = node.currentStyle
            var ret = currentStyle[ name ]
            if ( (rnumnonpx.test( ret ) && !rposition.test( ret )) ) {
                //�٣�����ԭ�е�style.left, runtimeStyle.left,
                var style = node.style,
                    left = style.left,
                    rsLeft = node.runtimeStyle.left
                //�����ڢ۴���style.left = xxx��Ӱ�쵽currentStyle.left��
                //��˰���currentStyle.left�ŵ�runtimeStyle.left��
                //runtimeStyle.leftӵ��������ȼ�������style.leftӰ��
                node.runtimeStyle.left = currentStyle.left
                //�۽���ȷֵ������style.left��Ȼ��ͨ��IE����һ��˽������ style.pixelLeft
                //�õ���λΪpx�Ľ����fontSize�ķ�֧��http://bugs.jquery.com/ticket/760
                style.left = name === 'fontSize' ? '1em' : (ret || 0)
                ret = style.pixelLeft + "px"
                //�ܻ�ԭ style.left��runtimeStyle.left
                style.left = left
                node.runtimeStyle.left = rsLeft
            }
            if ( ret === "medium" ) {
                name = name.replace( "Width", "Style" )
                //border width Ĭ��ֵΪmedium����ʹ��Ϊ0"
                if ( currentStyle[ name ] === "none" ) {
                    ret = "0px"
                }
            }
            return ret === "" ? "auto" : border[ ret ] || ret
        }
        cssHooks[ "opacity:set" ] = function ( node, name, value ) {
            var style = node.style
            var opacity = isFinite( value ) && value <= 1 ? "alpha(opacity=" + value * 100 + ")" : ""
            var filter = style.filter || "";
            style.zoom = 1
            //����ʹ�����·�ʽ����͸����
            //node.filters.alpha.opacity = value * 100
            style.filter = (ralpha.test( filter ) ?
                filter.replace( ralpha, opacity ) :
            filter + " " + opacity).trim()
            if ( !style.filter ) {
                style.removeAttribute( "filter" )
            }
        }
        cssHooks[ "opacity:get" ] = function ( node ) {
            //�������Ļ�ȡIE͸��ֵ�ķ�ʽ������Ҫ���������ˣ�
            var alpha = node.filters.alpha || node.filters[ salpha ],
                op = alpha && alpha.enabled ? alpha.opacity : 100
            return (op / 100) + "" //ȷ�����ص����ַ���
        }
    }

    "top,left".replace( rword, function ( name ) {
        cssHooks[ name + ":get" ] = function ( node ) {
            var computed = cssHooks[ "@:get" ]( node, name )
            return /px$/.test( computed ) ? computed :
            avalon( node ).position()[ name ] + "px"
        }
    } )

    var cssShow = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }

    var rdisplayswap = /^(none|table(?!-c[ea]).+)/

    function showHidden( node, array ) {
        //http://www.cnblogs.com/rubylouvre/archive/2012/10/27/2742529.html
        if ( node.offsetWidth <= 0 ) { //opera.offsetWidth����С��0
            if ( rdisplayswap.test( cssHooks[ "@:get" ]( node, "display" ) ) ) {
                var obj = {
                    node: node
                }
                for ( var name in cssShow ) {
                    obj[ name ] = node.style[ name ]
                    node.style[ name ] = cssShow[ name ]
                }
                array.push( obj )
            }
            var parent = node.parentNode
            if ( parent && parent.nodeType === 1 ) {
                showHidden( parent, array )
            }
        }
    }

    "Width,Height".replace( rword, function ( name ) { //fix 481
        var method = name.toLowerCase(),
            clientProp = "client" + name,
            scrollProp = "scroll" + name,
            offsetProp = "offset" + name
        cssHooks[ method + ":get" ] = function ( node, which, override ) {
            var boxSizing = -4
            if ( typeof override === "number" ) {
                boxSizing = override
            }
            which = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ]
            var ret = node[ offsetProp ] // border-box 0
            if ( boxSizing === 2 ) { // margin-box 2
                return ret + avalon.css( node, "margin" + which[ 0 ], true ) + avalon.css( node, "margin" + which[ 1 ], true )
            }
            if ( boxSizing < 0 ) { // padding-box  -2
                ret = ret - avalon.css( node, "border" + which[ 0 ] + "Width", true ) - avalon.css( node, "border" + which[ 1 ] + "Width", true )
            }
            if ( boxSizing === -4 ) { // content-box -4
                ret = ret - avalon.css( node, "padding" + which[ 0 ], true ) - avalon.css( node, "padding" + which[ 1 ], true )
            }
            return ret
        }
        cssHooks[ method + "&get" ] = function ( node ) {
            var hidden = [];
            showHidden( node, hidden );
            var val = cssHooks[ method + ":get" ]( node )
            for ( var i = 0, obj; obj = hidden[ i++ ]; ) {
                node = obj.node
                for ( var n in obj ) {
                    if ( typeof obj[ n ] === "string" ) {
                        node.style[ n ] = obj[ n ]
                    }
                }
            }
            return val;
        }
        avalon.fn[ method ] = function ( value ) { //�������display
            var node = this[ 0 ]
            if ( arguments.length === 0 ) {
                if ( node.setTimeout ) { //ȡ�ô��ڳߴ�,IE9�������node.innerWidth /innerHeight����
                    return node[ "inner" + name ] || node.document.documentElement[ clientProp ]
                }
                if ( node.nodeType === 9 ) { //ȡ��ҳ��ߴ�
                    var doc = node.documentElement
                    //FF chrome    html.scrollHeight< body.scrollHeight
                    //IE ��׼ģʽ : html.scrollHeight> body.scrollHeight
                    //IE ����ģʽ : html.scrollHeight �����ڿ��Ӵ��ڶ�һ�㣿
                    return Math.max( node.body[ scrollProp ], doc[ scrollProp ], node.body[ offsetProp ], doc[ offsetProp ], doc[ clientProp ] )
                }
                return cssHooks[ method + "&get" ]( node )
            } else {
                return this.css( method, value )
            }
        }
        avalon.fn[ "inner" + name ] = function () {
            return cssHooks[ method + ":get" ]( this[ 0 ], void 0, -2 )
        }
        avalon.fn[ "outer" + name ] = function ( includeMargin ) {
            return cssHooks[ method + ":get" ]( this[ 0 ], void 0, includeMargin === true ? 2 : 0 )
        }
    } )
    avalon.fn.offset = function () { //ȡ�þ���ҳ�����ҽǵ�����
        var node = this[ 0 ],
            box = {
                left: 0,
                top: 0
            }
        if ( !node || !node.tagName || !node.ownerDocument ) {
            return box
        }
        var doc = node.ownerDocument,
            body = doc.body,
            root = doc.documentElement,
            win = doc.defaultView || doc.parentWindow
        if ( !avalon.contains( root, node ) ) {
            return box
        }
        //http://hkom.blog1.fc2.com/?mode=m&no=750 body��ƫ�����ǲ�����margin��
        //���ǿ���ͨ��getBoundingClientRect�����Ԫ�������client��rect.
        //http://msdn.microsoft.com/en-us/library/ms536433.aspx
        if ( node.getBoundingClientRect ) {
            box = node.getBoundingClientRect() // BlackBerry 5, iOS 3 (original iPhone)
        }
        //chrome/IE6: body.scrollTop, firefox/other: root.scrollTop
        var clientTop = root.clientTop || body.clientTop,
            clientLeft = root.clientLeft || body.clientLeft,
            scrollTop = Math.max( win.pageYOffset || 0, root.scrollTop, body.scrollTop ),
            scrollLeft = Math.max( win.pageXOffset || 0, root.scrollLeft, body.scrollLeft )
        // �ѹ�������ӵ�left,top��ȥ��
        // IEһЩ�汾�л��Զ�ΪHTMLԪ�ؼ���2px��border��������Ҫȥ����
        // http://msdn.microsoft.com/en-us/library/ms533564(VS.85).aspx
        return {
            top: box.top + scrollTop - clientTop,
            left: box.left + scrollLeft - clientLeft
        }
    }

//==================================val���============================

    function getValType( el ) {
        var ret = el.tagName.toLowerCase()
        return ret === "input" && /checkbox|radio/.test( el.type ) ? "checked" : ret
    }

    var roption = /^<option(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s+value[\s=]/i
    var valHooks = {
        "option:get": window.VBArray ? function ( node ) {
            //��IE11��W3C�����û��ָ��value����ônode.valueĬ��Ϊnode.text������trim��������IE9-10����ȡinnerHTML(ûtrim����)
            //specified�����ɿ������ͨ������outerHTML�ж��û���û����ʾ����value
            return roption.test( node.outerHTML ) ? node.value : node.text.trim()
        } : function ( node ) {
            return node.value
        },
        "select:get": function ( node, value ) {
            var option, options = node.options,
                index = node.selectedIndex,
                getter = valHooks[ "option:get" ],
                one = node.type === "select-one" || index < 0,
                values = one ? null : [],
                max = one ? index + 1 : options.length,
                i = index < 0 ? max : one ? index : 0
            for ( ; i < max; i++ ) {
                option = options[ i ]
                //��ʽIE��reset�󲻻�ı�selected����Ҫ����i === index�ж�
                //���ǹ�������disabled��optionԪ�أ�����safari5�£��������selectΪdisable����ô�����к��Ӷ�disable
                //��˵�һ��Ԫ��Ϊdisable����Ҫ������Ƿ���ʽ������disable���丸�ڵ��disable���
                if ( (option.selected || i === index) && !option.disabled ) {
                    value = getter( option )
                    if ( one ) {
                        return value
                    }
                    //�ռ�����selectedֵ������鷵��
                    values.push( value )
                }
            }
            return values
        },
        "select:set": function ( node, values, optionSet ) {
            values = [].concat( values ) //ǿ��ת��Ϊ����
            var getter = valHooks[ "option:get" ]
            for ( var i = 0, el; el = node.options[ i++ ]; ) {
                if ( (el.selected = values.indexOf( getter( el ) ) >= 0) ) {
                    optionSet = true
                }
            }
            if ( !optionSet ) {
                node.selectedIndex = -1
            }
        }
    }

    /*********************************************************************
     *                          ����ϵͳ                                  *
     **********************************************************************/
    var meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    }
    var quote = window.JSON && JSON.stringify || function ( str ) {
            return '"' + str.replace( /[\\\"\x00-\x1f]/g, function ( a ) {
                    var c = meta[ a ];
                    return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt( 0 ).toString( 16 )).slice( -4 );
                } ) + '"'
        }
    /*********************************************************************
     *                          ����ϵͳ                                  *
     **********************************************************************/
    var keywords =
        // �ؼ���
        "break,case,catch,continue,debugger,default,delete,do,else,false" +
        ",finally,for,function,if,in,instanceof,new,null,return,switch,this" +
        ",throw,true,try,typeof,var,void,while,with"
            // ������
        + ",abstract,boolean,byte,char,class,const,double,enum,export,extends" +
        ",final,float,goto,implements,import,int,interface,long,native" +
        ",package,private,protected,public,short,static,super,synchronized" +
        ",throws,transient,volatile"
            // ECMA 5 - use strict
        + ",arguments,let,yield" + ",undefined"
    var rrexpstr = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g
    var rsplit = /[^\w$]+/g
    var rkeywords = new RegExp( [ "\\b" + keywords.replace( /,/g, '\\b|\\b' ) + "\\b" ].join( '|' ), 'g' )
    var rnumber = /\b\d[^,]*/g
    var rcomma = /^,+|,+$/g
    var cacheVars = createCache( 512 )
    var getVariables = function ( code ) {
        var key = "," + code.trim()
        if ( cacheVars[ key ] ) {
            return cacheVars[ key ]
        }
        var match = code
            .replace( rrexpstr, "" )
            .replace( rsplit, "," )
            .replace( rkeywords, "" )
            .replace( rnumber, "" )
            .replace( rcomma, "" )
            .split( /^$|,+/ )
        return cacheVars( key, uniqSet( match ) )
    }
    /*��Ӹ�ֵ���*/

    function addAssign( vars, scope, name, data ) {
        var ret = []
        var prefix = " = " + name + "."
        var getter = data._value.trim()

        for ( var i = vars.length, prop; prop = vars[ --i ]; ) {
            if ( scope.hasOwnProperty( prop ) ) {
                var a = prop
                var fix$outer = false
                if ( rproxy.test( scope.$id ) ) {
                    fix$outer = prop === "$outer"
                    if ( typeof scope[ a ] === "function" && a !== "$remove" ) {
                        a += "()"
                    }
                    if ( Array.isArray( scope.$subscribers ) )
                        avalon.Array.ensure( scope.$subscribers, data )
                }
                ret.push( prop + prefix + a )
                if ( fix$outer ) {
                    data._value = getter.replace( /\$outer\.\S+\b/g, function ( _ ) {
                        try {
                            var fn = Function( "vm", "return vm." + _ )
                            if ( typeof fn( scope ) === "function" ) {
                                return _ + "()"
                            }
                        } catch ( e ) {
                        }
                        return _
                    } )
                }
                data.vars.push( prop )
                if ( data.type === "duplex" ) {
                    if ( prop !== a ) { //���a�������()��˵����ǰVM�Ǵ���VM
                        if ( prop !== getter ) { //����Ƕ������� <input ms-repeat="array" ms-duplex="el.name">
                            var setter = getter + " = duplexArgs"
                        } else { //����Ǽ��������͵����� <input ms-repeat="array" ms-duplex="el">
                            setter = name + "." + getter + "( duplexArgs )"
                        }
                    } else { // ����Ǽ���������<input ms-duplex="aaa">
                        setter = name + "." + getter + " = duplexArgs"
                    }
                    vars.duplex = ";\n\tif(!arguments.length){\n\t\treturn " + getter +
                    "\n\t}\n\t" + setter +
                    "\n\t}"
                }
                vars.splice( i, 1 )
            }
        }
        return ret
    }

    function uniqSet( array ) {
        var ret = [],
            unique = {}
        for ( var i = 0; i < array.length; i++ ) {
            var el = array[ i ]
            var id = el && typeof el.$id === "string" ? el.$id : el
            if ( !unique[ id ] ) {
                unique[ id ] = ret.push( el )
            }
        }
        return ret
    }


    function createCache( maxLength ) {
        var keys = []

        function cache( key, value ) {
            if ( keys.push( key ) > maxLength ) {
                delete cache[ keys.shift() ]
            }
            return cache[ key ] = value;
        }

        return cache;
    }

//������ֵ�������Ա�������
    var cacheExprs = createCache( 128 )
//ȡ����ֵ�������䴫��
    var rduplex = /\w\[.*\]|\w\.\w/
    var rproxy = /(\$proxy\$[a-z]+)\d+$/

    function parseExpr( code, scopes, data ) {
        var dataType = data.type
        var filters = data.filters ? data.filters.join( "" ) : ""
        data._value = code
        var exprId = scopes.map( function ( el ) {
                return String( el.$id ).replace( rproxy, "$1" )
            } ) + code + dataType + filters
        var vars = getVariables( code ).concat(),
            assigns = [],
            names = [],
            args = [],
            prefix = ""
        //args ��һ���������飬 names �ǽ�Ҫ���ɵ���ֵ�����Ĳ���
        scopes = uniqSet( scopes )
        data.vars = []
        for ( var i = 0, sn = scopes.length; i < sn; i++ ) {
            if ( vars.length ) {
                var name = "vm" + expose + "_" + i
                names.push( name )
                args.push( scopes[ i ] )
                assigns.push.apply( assigns, addAssign( vars, scopes[ i ], name, data ) )
            }
        }
        if ( !assigns.length && dataType === "duplex" ) {
            return
        }
        code = data._value
        if ( dataType !== "duplex" && (code.indexOf( "||" ) > -1 || code.indexOf( "&&" ) > -1) ) {
            //https://github.com/RubyLouvre/avalon/issues/583
            data.vars.forEach( function ( v ) {
                var reg = new RegExp( "\\b" + v + "(?:\\.\\w+|\\[\\w+\\])+", "ig" )
                code = code.replace( reg, function ( _ ) {
                    var c = _.charAt( v.length )
                    var method = /^\s*\(/.test( RegExp.rightContext )
                    if ( c === "." || c === "[" || method ) {//����vΪaa,����ֻƥ��aa.bb,aa[cc],��ƥ��aaa.xxx
                        var name = "var" + String( Math.random() ).replace( /^0\./, "" )
                        if ( method ) {//array.size()
                            var array = _.split( "." )
                            if ( array.length > 2 ) {
                                var last = array.pop()
                                assigns.push( name + " = " + array.join( "." ) )
                                return name + "." + last
                            } else {
                                return _
                            }
                        }
                        assigns.push( name + " = " + _ )
                        return name
                    } else {
                        return _
                    }
                } )
            } )
        }
        //---------------args----------------
        if ( filters ) {
            args.push( avalon.filters )
        }
        data.args = args
        //---------------cache----------------
        var fn = cacheExprs[ exprId ] //ֱ�Ӵӻ��棬����ظ�����
        if ( fn ) {
            data.evaluator = fn
            return
        }
        var prefix = assigns.join( ", " )
        if ( prefix ) {
            prefix = "var " + prefix
        }
        if ( filters ) { //�ı��󶨣�˫���󶨲��й�����
            code = "\nvar ret" + expose + " = " + code
            var textBuffer = [],
                fargs
            textBuffer.push( code, "\r\n" )
            for ( var i = 0, fname; fname = data.filters[ i++ ]; ) {
                var start = fname.indexOf( "(" )
                if ( start !== -1 ) {
                    fargs = fname.slice( start + 1, fname.lastIndexOf( ")" ) ).trim()
                    fargs = "," + fargs
                    fname = fname.slice( 0, start ).trim()
                } else {
                    fargs = ""
                }
                textBuffer.push( " if(filters", expose, ".", fname, "){\n\ttry{\nret", expose,
                    " = filters", expose, ".", fname, "(ret", expose, fargs, ")\n\t}catch(e){} \n}\n" )
            }
            code = textBuffer.join( "" )
            code += "\nreturn ret" + expose
            names.push( "filters" + expose )
        } else if ( dataType === "duplex" ) { //˫����
            var _body = "'use strict';\n" +
                "return function(duplexArgs){\n\t" + prefix + vars.duplex
            try {
                fn = Function.apply( noop, names.concat( _body ) )
                data.evaluator = cacheExprs( exprId, fn )
            } catch ( e ) {
                log( "debug: parse error," + e.message )
            }
            return
        } else if ( dataType === "on" ) { //�¼���
            if ( code.indexOf( "(" ) === -1 ) {
                code += ".call(this, $event)"
            } else {
                code = code.replace( "(", ".call(this," )
            }
            names.push( "$event" )
            code = "\nreturn " + code + ";" //IEȫ�� Function("return ")������ҪFunction("return ;")
            var lastIndex = code.lastIndexOf( "\nreturn" )
            var header = code.slice( 0, lastIndex )
            var footer = code.slice( lastIndex )
            code = header + "\n" + footer
        } else { //������
            code = "\nreturn " + code + ";" //IEȫ�� Function("return ")������ҪFunction("return ;")
        }
        try {
            fn = Function.apply( noop, names.concat( "'use strict';\n" + prefix + code ) )
            data.evaluator = cacheExprs( exprId, fn )
        } catch ( e ) {
            log( "debug: parse error," + e.message )
        } finally {
            vars = textBuffer = names = null //�ͷ��ڴ�
        }
    }


//parseExpr���������ô���

    function parseExprProxy( code, scopes, data, tokens, noregister ) {
        scopes.cb( -1 )
        if ( Array.isArray( tokens ) ) {
            code = tokens.map( function ( el ) {
                return el.expr ? "(" + el.value + ")" : quote( el.value )
            } ).join( " + " )
        }
        parseExpr( code, scopes, data )
        if ( data.evaluator && !noregister ) {
            data.handler = bindingExecutors[ data.handlerName || data.type ]
            //�������
            //����ǳ���Ҫ,����ͨ���ж���ͼˢ�º�����element�Ƿ���DOM������
            //�����Ƴ��������б�
            registerSubscriber( data )
        }
    }

    avalon.parseExprProxy = parseExprProxy
    /*********************************************************************
     *                         ����ָ��                                  *
     **********************************************************************/
//ms-skip���Ѿ���scanTag ������ʵ��
//ms-controller���Ѿ���scanTag ������ʵ��
//ms-important���Ѿ���scanTag ������ʵ��
    var bools = "autofocus,autoplay,async,allowTransparency,checked,controls,declare,disabled,defer,defaultChecked,defaultSelected" +
        "contentEditable,isMap,loop,multiple,noHref,noResize,noShade,open,readOnly,selected"
    var boolMap = {}
    bools.replace( rword, function ( name ) {
        boolMap[ name.toLowerCase() ] = name
    } )

    var propMap = {//������ӳ��
        "accept-charset": "acceptCharset",
        "char": "ch",
        "charoff": "chOff",
        "class": "className",
        "for": "htmlFor",
        "http-equiv": "httpEquiv"
    }

    var anomaly = "accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan," + "dateTime,defaultValue,frameBorder,longDesc,maxLength,marginWidth,marginHeight," + "rowSpan,tabIndex,useMap,vSpace,valueType,vAlign"
    anomaly.replace( rword, function ( name ) {
        propMap[ name.toLowerCase() ] = name
    } )

    var rnoscripts = /<noscript.*?>(?:[\s\S]+?)<\/noscript>/img
    var rnoscriptText = /<noscript.*?>([\s\S]+?)<\/noscript>/im

    var getXHR = function () {
        return new (window.XMLHttpRequest || ActiveXObject)( "Microsoft.XMLHTTP" )
    }

    var cacheTmpls = avalon.templateCache = {}

    bindingHandlers.attr = function ( data, vmodels ) {
        var text = data.value.trim(),
            simple = true
        if ( text.indexOf( openTag ) > -1 && text.indexOf( closeTag ) > 2 ) {
            simple = false
            if ( rexpr.test( text ) && RegExp.rightContext === "" && RegExp.leftContext === "" ) {
                simple = true
                text = RegExp.$1
            }
        }
        if ( data.type === "include" ) {
            var elem = data.element
            data.includeRendered = getBindingCallback( elem, "data-include-rendered", vmodels )
            data.includeLoaded = getBindingCallback( elem, "data-include-loaded", vmodels )
            var outer = data.includeReplaced = !!avalon( elem ).data( "includeReplace" )
            data.startInclude = DOC.createComment( "ms-include" )
            data.endInclude = DOC.createComment( "ms-include-end" )
            if ( outer ) {
                data.element = data.startInclude
                elem.parentNode.insertBefore( data.startInclude, elem )
                elem.parentNode.insertBefore( data.endInclude, elem.nextSibling )
            } else {
                elem.insertBefore( data.startInclude, elem.firstChild )
                elem.appendChild( data.endInclude )
            }
        }
        data.handlerName = "attr" //handleName���ڴ�����ְ󶨹���ͬһ��bindingExecutor�����
        parseExprProxy( text, vmodels, data, (simple ? 0 : scanExpr( data.value )) )
    }

    bindingExecutors.attr = function ( val, elem, data ) {
        var method = data.type,
            attrName = data.param
        if ( method === "css" ) {
            avalon( elem ).css( attrName, val )
        } else if ( method === "attr" ) {
            // ms-attr-class="xxx" vm.xxx="aaa bbb ccc"��Ԫ�ص�className����Ϊaaa bbb ccc
            // ms-attr-class="xxx" vm.xxx=false  ���Ԫ�ص���������
            // ms-attr-name="yyy"  vm.yyy="ooo" ΪԪ������name����
            if ( boolMap[ attrName ] ) {
                var bool = boolMap[ attrName ]
                if ( typeof elem[ bool ] === "boolean" ) {
                    // IE6-11��֧�ֶ�̬����fieldset��disabled���ԣ�IE11����ʽ����Ч�ˣ����޷���ֹ�û�������µ�inputԪ�ؽ�����ֵ����
                    return elem[ bool ] = !!val
                }
            }
            var toRemove = (val === false) || (val === null) || (val === void 0)

            if ( !W3C && propMap[ attrName ] ) { //��ʽIE����Ҫ��������ӳ��
                attrName = propMap[ attrName ]
            }
            if ( toRemove ) {
                return elem.removeAttribute( attrName )
            }
            //SVGֻ��ʹ��setAttribute(xxx, yyy), VMLֻ��ʹ��elem.xxx = yyy ,HTML�Ĺ������Ա���elem.xxx = yyy
            var isInnate = rsvg.test( elem ) ? false : (DOC.namespaces && isVML( elem )) ? true : attrName in elem.cloneNode( false )
            if ( isInnate ) {
                elem[ attrName ] = val
            } else {
                elem.setAttribute( attrName, val )
            }
        } else if ( method === "include" && val ) {
            var vmodels = data.vmodels
            var rendered = data.includeRendered
            var loaded = data.includeLoaded
            var replace = data.includeReplaced
            var target = replace ? elem.parentNode : elem
            vmodels.cb( 1 )
            function scanTemplate( text ) {
                if ( loaded ) {
                    text = loaded.apply( target, [ text ].concat( vmodels ) )
                }
                if ( rendered ) {
                    checkScan( target, function () {
                        rendered.call( target )
                    }, NaN )
                }
                while ( true ) {
                    var node = data.startInclude.nextSibling
                    if ( node && node !== data.endInclude ) {
                        target.removeChild( node )
                    } else {
                        break
                    }
                }
                var dom = avalon.parseHTML( text )
                var nodes = avalon.slice( dom.childNodes )
                target.insertBefore( dom, data.endInclude )
                scanNodeArray( nodes, vmodels )
                vmodels.cb( -1 )
            }

            if ( data.param === "src" ) {
                if ( cacheTmpls[ val ] ) {
                    avalon.nextTick( function () {
                        scanTemplate( cacheTmpls[ val ] )
                    } )
                } else {
                    var xhr = getXHR()
                    xhr.onreadystatechange = function () {
                        if ( xhr.readyState === 4 ) {
                            var s = xhr.status
                            if ( s >= 200 && s < 300 || s === 304 || s === 1223 ) {
                                scanTemplate( cacheTmpls[ val ] = xhr.responseText )
                            }
                        }
                    }
                    xhr.open( "GET", val, true )
                    if ( "withCredentials" in xhr ) {
                        xhr.withCredentials = true
                    }
                    xhr.setRequestHeader( "X-Requested-With", "XMLHttpRequest" )
                    xhr.send( null )
                }
            } else {
                //IEϵ���빻�µı�׼�����֧��ͨ��IDȡ��Ԫ�أ�firefox14+��
                //http://tjvantoll.com/2012/07/19/dom-element-references-as-global-variables/
                var el = val && val.nodeType === 1 ? val : DOC.getElementById( val )
                if ( el ) {
                    if ( el.tagName === "NOSCRIPT" && !(el.innerHTML || el.fixIE78) ) { //IE7-8 innerText,innerHTML���޷�ȡ�������ݣ�IE6��ȡ����innerHTML
                        var xhr = getXHR() //IE9-11��chrome��innerHTML��õ�ת������ݣ����ǵ�innerText����
                        xhr.open( "GET", location, false ) //ллNodejs ����Ⱥ ����-�����鹹
                        xhr.send( null )
                        //http://bbs.csdn.net/topics/390349046?page=1#post-393492653
                        var noscripts = DOC.getElementsByTagName( "noscript" )
                        var array = (xhr.responseText || "").match( rnoscripts ) || []
                        var n = array.length
                        for ( var i = 0; i < n; i++ ) {
                            var tag = noscripts[ i ]
                            if ( tag ) { //IE6-8��noscript��ǩ��innerHTML,innerText��ֻ����
                                tag.style.display = "none" //http://haslayout.net/css/noscript-Ghost-Bug
                                tag.fixIE78 = (array[ i ].match( rnoscriptText ) || [ "", "&nbsp;" ])[ 1 ]
                            }
                        }
                    }
                    avalon.nextTick( function () {
                        scanTemplate( el.fixIE78 || el.value || el.innerText || el.innerHTML )
                    } )
                }
            }
        } else {
            if ( !root.hasAttribute && typeof val === "string" && (method === "src" || method === "href") ) {
                val = val.replace( /&amp;/g, "&" ) //����IE67�Զ�ת�������
            }
            elem[ method ] = val
            if ( window.chrome && elem.tagName === "EMBED" ) {
                var parent = elem.parentNode //#525  chrome1-37��embed��ǩ��̬����src���ܷ�������
                var comment = document.createComment( "ms-src" )
                parent.replaceChild( comment, elem )
                parent.replaceChild( elem, comment )
            }
        }
    }

//�⼸��ָ�����ʹ�ò�ֵ���ʽ����ms-src="aaa/{{b}}/{{c}}.html"
    "title,alt,src,value,css,include,href".replace( rword, function ( name ) {
        bindingHandlers[ name ] = bindingHandlers.attr
    } )
//ms-include������ms-attr��ʵ��

//����VM������ֵ����ʽ��ֵ�л�������ms-class="xxx yyy zzz:flag" 
//http://www.cnblogs.com/rubylouvre/archive/2012/12/17/2818540.html
    bindingHandlers[ "class" ] = function ( data, vmodels ) {
        var oldStyle = data.param,
            text = data.value,
            rightExpr
        data.handlerName = "class"
        if ( !oldStyle || isFinite( oldStyle ) ) {
            data.param = "" //ȥ������
            var noExpr = text.replace( rexprg, function ( a ) {
                return a.replace( /./g, "0" )
                //return Math.pow(10, a.length - 1) //����ֵ���ʽ����10��N-1�η���ռλ
            } )
            var colonIndex = noExpr.indexOf( ":" ) //ȡ�õ�һ��ð�ŵ�λ��
            if ( colonIndex === -1 ) { // ���� ms-class="aaa bbb ccc" �����
                var className = text
            } else { // ���� ms-class-1="ui-state-active:checked" ����� 
                className = text.slice( 0, colonIndex )
                rightExpr = text.slice( colonIndex + 1 )
                parseExpr( rightExpr, vmodels, data ) //��������ӻ���ɾ��
                if ( !data.evaluator ) {
                    log( "debug: ms-class '" + (rightExpr || "").trim() + "' ��������VM��" )
                    return false
                } else {
                    data._evaluator = data.evaluator
                    data._args = data.args
                }
            }
            var hasExpr = rexpr.test( className ) //����ms-class="width{{w}}"�����
            if ( !hasExpr ) {
                data.immobileClass = className
            }
            parseExprProxy( "", vmodels, data, (hasExpr ? scanExpr( className ) : 0) )
        } else {
            data.immobileClass = data.oldStyle = data.param
            parseExprProxy( text, vmodels, data )
        }
    }

    bindingExecutors [ "class" ] = function ( val, elem, data ) {
        var $elem = avalon( elem ),
            method = data.type
        if ( method === "class" && data.oldStyle ) { //����Ǿɷ��
            $elem.toggleClass( data.oldStyle, !!val )
        } else {
            //�������ð�ž�����ֵ����
            data.toggleClass = data._evaluator ? !!data._evaluator.apply( elem, data._args ) : true
            data.newClass = data.immobileClass || val
            if ( data.oldClass && data.newClass !== data.oldClass ) {
                $elem.removeClass( data.oldClass )
            }
            data.oldClass = data.newClass
            switch ( method ) {
                case "class":
                    $elem.toggleClass( data.newClass, data.toggleClass )
                    break
                case "hover":
                case "active":
                    if ( !data.hasBindEvent ) { //ȷ��ֻ��һ��
                        var activate = "mouseenter" //���Ƴ�����ʱ�л�����
                        var abandon = "mouseleave"
                        if ( method === "active" ) { //�ھ۽�ʧ�����л�����
                            elem.tabIndex = elem.tabIndex || -1
                            activate = "mousedown"
                            abandon = "mouseup"
                            var fn0 = $elem.bind( "mouseleave", function () {
                                data.toggleClass && $elem.removeClass( data.newClass )
                            } )
                        }
                        var fn1 = $elem.bind( activate, function () {
                            data.toggleClass && $elem.addClass( data.newClass )
                        } )
                        var fn2 = $elem.bind( abandon, function () {
                            data.toggleClass && $elem.removeClass( data.newClass )
                        } )
                        data.rollback = function () {
                            $elem.unbind( "mouseleave", fn0 )
                            $elem.unbind( activate, fn1 )
                            $elem.unbind( abandon, fn2 )
                        }
                        data.hasBindEvent = true
                    }
                    break;
            }
        }
    }

    "hover,active".replace( rword, function ( method ) {
        bindingHandlers[ method ] = bindingHandlers[ "class" ]
    } )
// bindingHandlers.data ������if.js
    bindingExecutors.data = function ( val, elem, data ) {
        var key = "data-" + data.param
        if ( val && typeof val === "object" ) {
            elem[ key ] = val
        } else {
            elem.setAttribute( key, String( val ) )
        }
    }

// bindingHandlers.text ������if.js
    bindingExecutors.text = function ( val, elem ) {
        val = val == null ? "" : val //����ҳ������ʾundefined null
        if ( elem.nodeType === 3 ) { //�����ı��ڵ���
            try { //IE��������DOM����Ľڵ㸳ֵ�ᱨ��
                elem.data = val
            } catch ( e ) {
            }
        } else { //�������Խڵ���
            if ( "textContent" in elem ) {
                elem.textContent = val
            } else {
                elem.innerText = val
            }
        }
    }


// bindingHandlers.html ������if.js
    bindingExecutors.html = function ( val, elem, data ) {
        val = val == null ? "" : val
        var isHtmlFilter = "group" in data
        var parent = isHtmlFilter ? elem.parentNode : elem
        if ( val.nodeType === 11 ) { //��valת��Ϊ�ĵ���Ƭ
            var fragment = val
        } else if ( val.nodeType === 1 || val.item ) {
            var nodes = val.nodeType === 1 ? val.childNodes : val.item ? val : []
            fragment = hyperspace.cloneNode( true )
            while ( nodes[ 0 ] ) {
                fragment.appendChild( nodes[ 0 ] )
            }
        } else {
            fragment = avalon.parseHTML( val )
        }
        //����ռλ��, ����ǹ�����,��Ҫ�н��Ƶ��Ƴ�ָ��������,�����htmlָ��,ֱ�����
        var comment = DOC.createComment( "ms-html" )
        if ( isHtmlFilter ) {
            parent.insertBefore( comment, elem )
            avalon.clearHTML( removeFragment( elem, data.group ) )
            data.element = comment //��ֹ��CG
        } else {
            avalon.clearHTML( parent ).appendChild( comment )
        }
        data.vmodels.cb( 1 )
        avalon.nextTick( function () {
            if ( isHtmlFilter ) {
                data.group = fragment.childNodes.length || 1
            }
            var nodes = avalon.slice( fragment.childNodes )
            if ( nodes[ 0 ] ) {
                if ( comment.parentNode )
                    comment.parentNode.replaceChild( fragment, comment )
                if ( isHtmlFilter ) {
                    data.element = nodes[ 0 ]
                }
            }
            scanNodeArray( nodes, data.vmodels )
            data.vmodels && data.vmodels.cb( -1 )
        } )
    }

    bindingHandlers[ "if" ] =
        bindingHandlers.data =
            bindingHandlers.text =
                bindingHandlers.html =
                    function ( data, vmodels ) {
                        parseExprProxy( data.value, vmodels, data )
                    }

    bindingExecutors[ "if" ] = function ( val, elem, data ) {
        if ( val ) { //���DOM��
            if ( elem.nodeType === 8 ) {
                elem.parentNode.replaceChild( data.template, elem )
                elem = data.element = data.template //��ʱ����Ϊnull
            }
            if ( elem.getAttribute( data.name ) ) {
                elem.removeAttribute( data.name )
                scanAttr( elem, data.vmodels )
            }
            data.rollback = null
        } else { //�Ƴ�DOM��������ע�ͽڵ�ռ��ԭλ��
            if ( elem.nodeType === 1 ) {
                var node = data.element = DOC.createComment( "ms-if" )
                elem.parentNode.replaceChild( node, elem )
                data.template = elem //Ԫ�ؽڵ�
                ifGroup.appendChild( elem )
                data.rollback = function () {
                    if ( elem.parentNode === ifGroup ) {
                        ifGroup.removeChild( elem )
                    }
                }
            }
        }
    }


    function parseDisplay( nodeName, val ) {
        //����ȡ�ô����ǩ��Ĭ��displayֵ
        var key = "_" + nodeName
        if ( !parseDisplay[ key ] ) {
            var node = DOC.createElement( nodeName )
            root.appendChild( node )
            if ( W3C ) {
                val = getComputedStyle( node, null ).display
            } else {
                val = node.currentStyle.display
            }
            root.removeChild( node )
            parseDisplay[ key ] = val
        }
        return parseDisplay[ key ]
    }

    avalon.parseDisplay = parseDisplay

    bindingHandlers.visible = function ( data, vmodels ) {
        var elem = avalon( data.element )
        var display = elem.css( "display" )
        if ( display === "none" ) {
            var style = elem[ 0 ].style
            var has = /visibility/i.test( style.cssText )
            var visible = elem.css( "visibility" )
            style.display = ""
            style.visibility = "hidden"
            display = elem.css( "display" )
            if ( display === "none" ) {
                display = parseDisplay( elem[ 0 ].nodeName )
            }
            style.visibility = has ? visible : ""
        }
        data.display = display
        parseExprProxy( data.value, vmodels, data )
    }

    bindingExecutors.visible = function ( val, elem, data ) {
        elem.style.display = val ? data.display : "none"
    }

    var rdash = /\(([^)]*)\)/
    bindingHandlers.on = function ( data, vmodels ) {
        var value = data.value
        var eventType = data.param.replace( /-\d+$/, "" ) // ms-on-mousemove-10
        if ( typeof bindingHandlers.on[ eventType + "Hook" ] === "function" ) {
            bindingHandlers.on[ eventType + "Hook" ]( data )
        }
        if ( value.indexOf( "(" ) > 0 && value.indexOf( ")" ) > -1 ) {
            var matched = (value.match( rdash ) || [ "", "" ])[ 1 ].trim()
            if ( matched === "" || matched === "$event" ) { // aaa() aaa($event)����aaa����
                value = value.replace( rdash, "" )
            }
        }
        parseExprProxy( value, vmodels, data )
    }

    bindingExecutors.on = function ( callback, elem, data ) {
        data.type = "on"
        callback = function ( e ) {
            var fn = data.evaluator || noop
            return fn.apply( this, data.args.concat( e ) )
        }
        var eventType = data.param.replace( /-\d+$/, "" ) // ms-on-mousemove-10
        if ( eventType === "scan" ) {
            callback.call( elem, {
                type: eventType
            } )
        } else if ( typeof data.specialBind === "function" ) {
            data.specialBind( elem, callback )
        } else {
            var removeFn = avalon.bind( elem, eventType, callback )
        }
        data.rollback = function () {
            if ( typeof data.specialUnbind === "function" ) {
                data.specialUnbind()
            } else {
                avalon.unbind( elem, eventType, removeFn )
            }
        }
    }


    bindingHandlers.widget = function ( data, vmodels ) {
        var args = data.value.match( rword )
        var elem = data.element
        var widget = args[ 0 ]
        var id = args[ 1 ]
        if ( !id || id === "$" ) {//û�ж����Ϊ$ʱ��ȡ�����+�����
            id = widget + setTimeout( "1" )
        }
        var optName = args[ 2 ] || widget//û�ж��壬ȡ�����
        vmodels.cb( -1 )
        var constructor = avalon.ui[ widget ]
        if ( typeof constructor === "function" ) { //ms-widget="tabs,tabsAAA,optname"
            vmodels = elem.vmodels || vmodels
            for ( var i = 0, v; v = vmodels[ i++ ]; ) {
                if ( v.hasOwnProperty( optName ) && typeof v[ optName ] === "object" ) {
                    var vmOptions = v[ optName ]
                    vmOptions = vmOptions.$model || vmOptions
                    break
                }
            }
            if ( vmOptions ) {
                var wid = vmOptions[ widget + "Id" ]
                if ( typeof wid === "string" ) {
                    id = wid
                }
            }
            //��ȡdata-tooltip-text��data-tooltip-attr���ԣ����һ�����ö���
            var widgetData = avalon.getWidgetData( elem, widget )
            data.value = [ widget, id, optName ].join( "," )
            data[ widget + "Id" ] = id
            data.evaluator = noop
            elem.msData[ "ms-widget-id" ] = id
            var options = data[ widget + "Options" ] = avalon.mix( {}, constructor.defaults, vmOptions || {}, widgetData )
            elem.removeAttribute( "ms-widget" )
            var vmodel = constructor( elem, data, vmodels ) || {} //��ֹ���������VM
            if ( vmodel.$id ) {
                avalon.vmodels[ id ] = vmodel
                createSignalTower( elem, vmodel )
                if ( vmodel.hasOwnProperty( "$init" ) ) {
                    vmodel.$init( function () {
                        var nv = [ vmodel ].concat( vmodels )
                        nv.cb = vmodels.cb
                        avalon.scan( elem, nv )
                        if ( typeof options.onInit === "function" ) {
                            options.onInit.call( elem, vmodel, options, vmodels )
                        }
                    } )
                }
                if ( vmodel.hasOwnProperty( "$remove" ) ) {
                    function offTree() {
                        if ( !elem.msRetain && !root.contains( elem ) ) {
                            vmodel.$remove()
                            try {
                                vmodel.widgetElement = null
                            } catch ( e ) {
                            }
                            elem.msData = {}
                            delete avalon.vmodels[ vmodel.$id ]
                            return false
                        }
                    }

                    if ( window.chrome ) {
                        elem.addEventListener( "DOMNodeRemovedFromDocument", function () {
                            setTimeout( offTree )
                        } )
                    } else {
                        avalon.tick( offTree )
                    }
                }
            } else {
                avalon.scan( elem, vmodels )
            }
        } else if ( vmodels.length ) { //����������û�м��أ���ô���浱ǰ��vmodels
            elem.vmodels = vmodels
        }
    }
//������ bindingExecutors.widget
//˫����
    var duplexBinding = bindingHandlers.duplex = function ( data, vmodels ) {
        var elem = data.element,
            hasCast
        parseExprProxy( data.value, vmodels, data, 0, 1 )

        data.changed = getBindingCallback( elem, "data-duplex-changed", vmodels ) || noop
        if ( data.evaluator && data.args ) {
            var params = []
            var casting = oneObject( "string,number,boolean,checked" )
            if ( elem.type === "radio" && data.param === "" ) {
                data.param = "checked"
            }
            if ( elem.msData ) {
                elem.msData[ "ms-duplex" ] = data.value
            }
            data.param.replace( /\w+/g, function ( name ) {
                if ( /^(checkbox|radio)$/.test( elem.type ) && /^(radio|checked)$/.test( name ) ) {
                    if ( name === "radio" )
                        log( "ms-duplex-radio�Ѿ�����Ϊms-duplex-checked" )
                    name = "checked"
                    data.isChecked = true
                }
                if ( name === "bool" ) {
                    name = "boolean"
                    log( "ms-duplex-bool�Ѿ�����Ϊms-duplex-boolean" )
                } else if ( name === "text" ) {
                    name = "string"
                    log( "ms-duplex-text�Ѿ�����Ϊms-duplex-string" )
                }
                if ( casting[ name ] ) {
                    hasCast = true
                }
                avalon.Array.ensure( params, name )
            } )
            if ( !hasCast ) {
                params.push( "string" )
            }
            data.param = params.join( "-" )
            data.bound = function ( type, callback ) {
                if ( elem.addEventListener ) {
                    elem.addEventListener( type, callback, false )
                } else {
                    elem.attachEvent( "on" + type, callback )
                }
                var old = data.rollback
                data.rollback = function () {
                    avalon.unbind( elem, type, callback )
                    old && old()
                }
            }
            for ( var i in avalon.vmodels ) {
                var v = avalon.vmodels[ i ]
                v.$fire( "avalon-ms-duplex-init", data )
            }
            var cpipe = data.pipe || (data.pipe = pipe)
            cpipe( null, data, "init" )
            var tagName = elem.tagName
            duplexBinding[ tagName ] && duplexBinding[ tagName ]( elem, data.evaluator.apply( null, data.args ), data )
        }
    }
//������ bindingExecutors.duplex
    function fixNull( val ) {
        return val == null ? "" : val
    }

    avalon.duplexHooks = {
        checked: {
            get: function ( val, data ) {
                return !data.element.oldValue
            }
        },
        string: {
            get: function ( val ) { //ͬ����VM
                return val
            },
            set: fixNull
        },
        "boolean": {
            get: function ( val ) {
                return val === "true"
            },
            set: fixNull
        },
        number: {
            get: function ( val ) {
                return isFinite( val ) ? parseFloat( val ) || 0 : val
            },
            set: fixNull
        }
    }

    function pipe( val, data, action, e ) {
        data.param.replace( /\w+/g, function ( name ) {
            var hook = avalon.duplexHooks[ name ]
            if ( hook && typeof hook[ action ] === "function" ) {
                val = hook[ action ]( val, data )
            }
        } )
        return val
    }

    var TimerID, ribbon = [],
        launch = noop

    function W3CFire( el, name, detail ) {
        var event = DOC.createEvent( "Events" )
        event.initEvent( name, true, true )
        //event.isTrusted = false �������opera�ᱨ��
        if ( detail ) {
            event.detail = detail
        }
        el.dispatchEvent( event )
    }


    avalon.tick = function ( fn ) {
        if ( ribbon.push( fn ) === 1 ) {
            TimerID = setInterval( ticker, 60 )
        }
    }

    function ticker() {
        for ( var n = ribbon.length - 1; n >= 0; n-- ) {
            var el = ribbon[ n ]
            if ( el() === false ) {
                ribbon.splice( n, 1 )
            }
        }
        if ( !ribbon.length ) {
            clearInterval( TimerID )
        }
    }

    function newSetter( value ) {
        onSetter.call( this, value )
        onTree.call( this, value )
    }

    try {
        var inputProto = HTMLInputElement.prototype
        Object.getOwnPropertyNames( inputProto ) //��������IE6-8�����������
        var onSetter = Object.getOwnPropertyDescriptor( inputProto, "value" ).set //����chrome, safari,opera
        Object.defineProperty( inputProto, "value", {
            set: newSetter
        } )
    } catch ( e ) {
        launch = avalon.tick
    }
    function IE() {
        if ( window.VBArray ) {
            var mode = document.documentMode
            return mode ? mode : window.XMLHttpRequest ? 7 : 6
        } else {
            return 0
        }
    }

    var IEVersion = IE()
    if ( IEVersion ) {
        avalon.bind( DOC, "selectionchange", function ( e ) {
            var el = DOC.activeElement
            if ( el && typeof el.avalonSelectionChange === "function" ) {
                el.avalonSelectionChange()
            }
        } )
    }

    function onTree( value ) { //disabled״̬�¸Ķ�������input�¼�
        var newValue = arguments.length ? value : this.value
        if ( !this.disabled && this.oldValue !== newValue + "" ) {
            var type = this.getAttribute( "data-duplex-event" ) || "input"
            if ( /change|blur/.test( type ) ? this !== DOC.activeElement : 1 ) {
                if ( W3C ) {
                    W3CFire( this, type )
                } else {
                    try {
                        this.fireEvent( "on" + type )
                    } catch ( e ) {
                    }
                }
            }
        }
    }

//����radio, checkbox, text, textarea, password
    duplexBinding.INPUT = function ( element, evaluator, data ) {
        var type = element.type,
            bound = data.bound,
            $elem = avalon( element ),
            composing = false

        function callback( value ) {
            data.changed.call( this, value, data )
        }

        function compositionStart() {
            composing = true
        }

        function compositionEnd() {
            composing = false
        }

        //��value�仯ʱ�ı�model��ֵ

        function updateVModel() {
            if ( composing )  //�����������뷨��minlengh��������BUG
                return
            var val = element.oldValue = element.value //��ֹ�ݹ�����γ���ѭ��
            var lastValue = data.pipe( val, data, "get" )
            if ( $elem.data( "duplex-observe" ) !== false ) {
                evaluator( lastValue )
                callback.call( element, lastValue )
                if ( $elem.data( "duplex-focus" ) ) {
                    avalon.nextTick( function () {
                        element.focus()
                    } )
                }
            }
        }

        //��model�仯ʱ,���ͻ�ı�value��ֵ
        data.handler = function () {
            var val = data.pipe( evaluator(), data, "set" )
            if ( val !== element.value ) {
                element.value = val
            }
        }
        if ( data.isChecked || element.type === "radio" ) {
            var IE6 = IEVersion === 6
            updateVModel = function () {
                if ( $elem.data( "duplex-observe" ) !== false ) {
                    var lastValue = data.pipe( element.value, data, "get" )
                    evaluator( lastValue )
                    callback.call( element, lastValue )
                }
            }
            data.handler = function () {
                var val = evaluator()
                var checked = data.isChecked ? !!val : val + "" === element.value
                element.oldValue = checked
                if ( IE6 ) {
                    setTimeout( function () {
                        //IE8 checkbox, radio��ʹ��defaultChecked����ѡ��״̬��
                        //����Ҫ������defaultChecked������checked
                        //���ұ��������ӳ�
                        element.defaultChecked = checked
                        element.checked = checked
                    }, 100 )
                } else {
                    element.checked = checked
                }
            }
            bound( IE6 ? "mouseup" : "click", updateVModel )
        } else if ( type === "checkbox" ) {
            updateVModel = function () {
                if ( $elem.data( "duplex-observe" ) !== false ) {
                    var method = element.checked ? "ensure" : "remove"
                    var array = evaluator()
                    if ( !Array.isArray( array ) ) {
                        log( "ms-duplexӦ����checkbox��Ҫ��Ӧһ������" )
                        array = [ array ]
                    }
                    avalon.Array[ method ]( array, data.pipe( element.value, data, "get" ) )
                    callback.call( element, array )
                }
            }

            data.handler = function () {
                var array = [].concat( evaluator() ) //ǿ��ת��Ϊ����
                element.checked = array.indexOf( data.pipe( element.value, data, "get" ) ) >= 0
            }
            bound( W3C ? "change" : "click", updateVModel )
        } else {
            var events = element.getAttribute( "data-duplex-event" ) || element.getAttribute( "data-event" ) || "input"
            if ( element.attributes[ "data-event" ] ) {
                log( "data-eventָ���Ѿ������������data-duplex-event" )
            }

            function delay( e ) {
                setTimeout( function () {
                    updateVModel( e )
                } )
            }

            events.replace( rword, function ( name ) {
                switch ( name ) {
                    case "input":
                        if ( !window.VBArray ) { // W3C
                            bound( "input", updateVModel )
                            //��IE������������
                            bound( "compositionstart", compositionStart )
                            bound( "compositionend", compositionEnd )

                        } else { //onpropertychange�¼��޷������ǳ��򴥷������û�����
                            element.avalonSelectionChange = updateVModel//����IE���input�ұߵ�X�������Ϊ
                            if ( IEVersion > 8 ) {
                                bound( "input", updateVModel )//IE9ʹ��propertychange�޷�������������Ķ�
                            } else {
                                bound( "propertychange", function ( e ) {//IE6-8�µ�һ���޸�ʱ���ᴥ��,��Ҫʹ��keydown��selectionchange����
                                    if ( e.propertyName === "value" ) {
                                        updateVModel()
                                    }
                                } )
                            }
                            // bound("paste", delay)//IE9��propertychange������ճ�������У�ɾ�������ı䶯
                            // bound("cut", delay)
                            // bound("keydown", delay)
                            bound( "dragend", delay )
                            //http://www.cnblogs.com/rubylouvre/archive/2013/02/17/2914604.html
                            //http://www.matts411.com/post/internet-explorer-9-oninput/
                        }
                        break
                    default:
                        bound( name, updateVModel )
                        break
                }
            } )
        }
        element.oldValue = element.value
        launch( function () {
            if ( avalon.contains( root, element ) ) {
                onTree.call( element )
            } else if ( !element.msRetain ) {
                return false
            }
        } )
        registerSubscriber( data )
        callback.call( element, element.value )
    }
    duplexBinding.TEXTAREA = duplexBinding.INPUT


    duplexBinding.SELECT = function ( element, evaluator, data ) {
        var $elem = avalon( element )

        function updateVModel() {
            if ( $elem.data( "duplex-observe" ) !== false ) {
                var val = $elem.val() //�ַ������ַ�������
                if ( Array.isArray( val ) ) {
                    val = val.map( function ( v ) {
                        return data.pipe( v, data, "get" )
                    } )
                } else {
                    val = data.pipe( val, data, "get" )
                }
                if ( val + "" !== element.oldValue ) {
                    evaluator( val )
                }
                data.changed.call( element, val, data )
            }
        }

        data.handler = function () {
            var val = evaluator()
            val = val && val.$model || val
            if ( Array.isArray( val ) ) {
                if ( !element.multiple ) {
                    log( "ms-duplex��<select multiple=true>��Ҫ���Ӧһ������" )
                }
            } else {
                if ( element.multiple ) {
                    log( "ms-duplex��<select multiple=false>���ܶ�Ӧһ������" )
                }
            }
            //�������ַ�������ܱȽ�
            val = Array.isArray( val ) ? val.map( String ) : val + ""
            if ( val + "" !== element.oldValue ) {
                $elem.val( val )
                element.oldValue = val + ""
            }
        }
        data.bound( "change", updateVModel )
        checkScan( element, function () {
            registerSubscriber( data )
            data.changed.call( element, evaluator(), data )
        }, NaN )
    }


    bindingHandlers.repeat = function ( data, vmodels ) {
        var type = data.type
        parseExprProxy( data.value, vmodels, data, 0, 1 )
        var freturn = false
        vmodels.cb( -1 )
        try {
            var $repeat = data.$repeat = data.evaluator.apply( 0, data.args || [] )
            var xtype = avalon.type( $repeat )
            if ( xtype !== "object" && xtype !== "array" ) {
                freturn = true
                avalon.log( "warning:" + data.value + "��Ӧ���Ͳ���ȷ" )
            }
        } catch ( e ) {
            freturn = true
            avalon.log( "warning:" + data.value + "�������" )
        }
        var elem = data.element
        elem.removeAttribute( data.name )

        var comment = data.element = DOC.createComment( "ms-repeat" )
        var endRepeat = data.endRepeat = DOC.createComment( "ms-repeat-end" )

        hyperspace.appendChild( comment )
        hyperspace.appendChild( endRepeat )

        if ( type === "repeat" ) {
            data.template = elem.outerHTML.trim()
            elem.parentNode.replaceChild( hyperspace, elem )
            data.group = 1
        } else {
            data.template = elem.innerHTML.trim()
            avalon.clearHTML( elem ).appendChild( hyperspace )
        }

        data.rollback = function () {
            var elem = data.element
            if ( !elem )
                return
            bindingExecutors.repeat.call( data, "clear" )
            var parentNode = elem.parentNode
            var content = avalon.parseHTML( data.template )
            var target = content.firstChild
            parentNode.replaceChild( content, elem )
            parentNode.removeChild( data.endRepeat )
            target = data.element = data.type === "repeat" ? target : parentNode
            data.group = target.setAttribute( data.name, data.value )
        }
        var arr = data.value.split( "." ) || []
        if ( arr.length > 1 ) {
            arr.pop()
            var n = arr[ 0 ]
            for ( var i = 0, v; v = vmodels[ i++ ]; ) {
                if ( v && v.hasOwnProperty( n ) ) {
                    var events = v[ n ].$events || {}
                    events[ subscribers ] = events[ subscribers ] || []
                    events[ subscribers ].push( data )
                    break
                }
            }
        }
        if ( freturn ) {
            return
        }
        data.sortedCallback = getBindingCallback( elem, "data-with-sorted", vmodels )
        data.renderedCallback = getBindingCallback( elem, "data-" + type + "-rendered", vmodels )
        data.handler = bindingExecutors.repeat
        data.$outer = {}
        for ( var i = 0, p; p = vmodels[ i++ ]; ) {
            if ( rproxy.test( p.$id ) ) {
                data.$outer = p
                break
            }
        }
        var $list = ($repeat.$events || {})[ subscribers ]
        if ( $list && avalon.Array.ensure( $list, data ) ) {
            addSubscribers( data, $list )
        }
        if ( xtype === "object" ) {
            var $events = $repeat.$events || {}
            var pool = $events.$withProxyPool
            if ( !pool ) {
                pool = $events.$withProxyPool = {}
                for ( var key in $repeat ) {
                    if ( $repeat.hasOwnProperty( key ) && key !== "hasOwnProperty" ) {
                        pool[ key ] = withProxyFactory( key, $repeat )
                    }
                }
            }
            data.handler( "append", $repeat, pool )
        } else {
            data.handler( "add", 0, $repeat )
        }
    }

    "with,each".replace( rword, function ( name ) {
        bindingHandlers[ name ] = bindingHandlers.repeat
    } )

    bindingExecutors.repeat = function ( method, pos, el ) {
        if ( method ) {
            var data = this
            var parent = data.element.parentNode
            var transation = hyperspace.cloneNode( false )
            if ( method === "del" || method === "move" ) {
                var locatedNode = locateFragment( data, pos )
            }
            var group = data.group
            switch ( method ) {
                case "add": //��posλ�ú����el���飨posΪ���֣�elΪ���飩
                    var arr = el
                    var fragments = []
                    var hasProxy = "$proxies" in data.$repeat
                    var proxies = data.$repeat.$proxies || []
                    for ( var i = 0, n = arr.length; i < n; i++ ) {
                        var ii = i + pos
                        var proxy = hasProxy ? proxies[ ii ] : eachProxyFactory( ii, data.$repeat )
                        eachProxyDecorator( proxy, data )
                        shimController( data, transation, proxy, fragments )
                    }
                    locatedNode = locateFragment( data, pos )
                    parent.insertBefore( transation, locatedNode )
                    for ( var i = 0, fragment; fragment = fragments[ i++ ]; ) {
                        scanNodeArray( fragment.nodes, fragment.vmodels )
                        fragment.nodes = fragment.vmodels = null
                    }
                    calculateFragmentGroup( data, proxies )
                    break
                case "del": //��pos���el��Ԫ��ɾ��(pos, el��������)
                    var transation = removeFragment( locatedNode, group, el )
                    avalon.clearHTML( transation )
                    break
                case "clear":
                    while ( true ) {
                        var node = data.element.nextSibling
                        if ( node && node !== data.endRepeat ) {
                            parent.removeChild( node )
                        } else {
                            break
                        }
                    }
                    break
                case "move": //��proxies�еĵ�pos��Ԫ���ƶ�elλ����(pos, el��������)
                    transation = removeFragment( locatedNode, group )
                    locatedNode = locateFragment( data, el )
                    parent.insertBefore( transation, locatedNode )
                    break
                case "append": //��pos�ļ�ֵ�Դ�el��ȡ����posΪһ����ͨ����elΪԤ�����ɺõĴ���VM����أ�
                    var pool = el
                    var keys = []
                    var fragments = []
                    for ( var key in pos ) { //�õ����м���
                        if ( pos.hasOwnProperty( key ) && key !== "hasOwnProperty" ) {
                            keys.push( key )
                        }
                    }
                    if ( data.sortedCallback ) { //����лص���������������
                        var keys2 = data.sortedCallback.call( parent, keys )
                        if ( keys2 && Array.isArray( keys2 ) && keys2.length ) {
                            keys = keys2
                        }
                    }
                    for ( var i = 0, key; key = keys[ i++ ]; ) {
                        if ( key !== "hasOwnProperty" ) {
                            shimController( data, transation, pool[ key ], fragments )
                        }
                    }
                    data.proxySize = keys.length
                    parent.insertBefore( transation, data.element.nextSibling )
                    for ( var i = 0, fragment; fragment = fragments[ i++ ]; ) {
                        scanNodeArray( fragment.nodes, fragment.vmodels )
                        fragment.nodes = fragment.vmodels = null
                    }
                    calculateFragmentGroup( data )
                    break
            }
            var callback = data.renderedCallback || noop,
                args = arguments
            checkScan( parent, function () {
                callback.apply( parent, args )
                if ( parent.oldValue && parent.tagName === "SELECT" && method === "index" ) { //fix #503
                    avalon( parent ).val( parent.oldValue.split( "," ) )
                }
            }, NaN )
        }
    }


    function shimController( data, transation, proxy, fragments ) {
        var dom = avalon.parseHTML( data.template )
        var nodes = avalon.slice( dom.childNodes )
        transation.appendChild( dom )
        proxy.$outer = data.$outer
        var ov = data.vmodels
        var nv = [ proxy ].concat( ov )
        nv.cb = ov.cb
        var fragment = {
            nodes: nodes,
            vmodels: nv
        }
        fragments.push( fragment )
    }

//���ms-repeat������ms-repeat-end����ô�ͷ���ms-repeat-end
// ȡ�����ڶ�λ�Ľڵ㡣����group = 3,  �ṹΪ
// <div><!--ms-repeat--><br id="first"><br/><br/><br id="second"><br/><br/><!--ms-repeat-end--></div>
// ��posΪ0ʱ,���� br#first
// ��posΪ1ʱ,���� br#second
// ��posΪ2ʱ,���� ms-repeat-end

    function locateFragment( data, pos ) {
        var startRepeat = data.element
        var endRepeat = data.endRepeat
        var nodes = []
        var node = startRepeat.nextSibling
        if ( node !== endRepeat ) {
            do {
                if ( node !== endRepeat ) {
                    nodes.push( node )
                } else {
                    break
                }
            } while ( node = node.nextSibling )
        }
        return nodes[ data.group * pos ] || endRepeat
    }

    function removeFragment( node, group, pos ) {
        var n = group * (pos || 1)
        var nodes = [ node ],
            i = 1
        var view = hyperspace
        while ( i < n ) {
            node = node.nextSibling
            if ( node ) {
                nodes[ i++ ] = node
            }
        }
        for ( var i = 0; node = nodes[ i++ ]; ) {
            view.appendChild( node )
        }
        return view
    }

    function calculateFragmentGroup( data, proxies ) {
        if ( !isFinite( data.group ) ) {
            var nodes = data.element.parentNode.childNodes
            var length = nodes.length - 2 //ȥ������ע�ͽڵ�
            var n = "proxySize" in data ? data.proxySize : proxies.length
            data.group = length / n
        }
    }

// Ϊms-each, ms-repeat����һ���������ͨ��������ʹ��һЩ����������빦�ܣ�$index,$first,$last,$remove,$key,$val,$outer��

    function eachItemFactory( val, $model ) {
        if ( rcomplexType.test( avalon.type( val ) ) ) {
            val = val.$id ? val : modelFactory( val, 0, $model )
        }
        return val
    }

    function withProxyFactory( key, host ) {
        var $subscribers = !host.$events ? null : (host.$events[ key ] || (host.$events[ key ] = []))
        var proxy = {
            $id: ("$proxy$with" + Math.random()).replace( /0\./, "" ),
            $subscribers: $subscribers,
            toString: function () {
                return "[ProxyVModel]"
            },
            $key: key,
            $val: function ( v ) {
                var a = host[ proxy.$key ]
                if ( arguments.length ) {
                    host[ proxy.$key ] = v
                } else {
                    return a
                }
            },
            $outer: {}
        }
        return proxy
    }

//���������������������ֵ������ɣ� var $first = vm1112323_0.$first(); return $first
//����ʽ�����ʹ����ԭ�ͣ�this�����ָ��window
    function eachProxyFactory( index, host ) {
        var proxy = {
            $subscribers: [],
            $$index: index,
            $outer: {},
            toString: function () {
                return "[ProxyVModel]"
            },
            $index: function () {//1.3.8����
                if ( arguments.length ) {
                    proxy.$$index = index
                } else {
                    return proxy.$$index
                }
            },
            $odd: function () {//1.3.8����
                return proxy.$$index % 2
            },
            $even: function () {//1.3.8����
                return proxy.$$index & 1 === 0
            },
            $first: function () {
                return proxy.$$index === index
            },
            $last: function () {
                var last = host.length - 1
                return proxy.$$index === last
            },
            $remove: function () {
                return host.removeAt( proxy.$$index )
            }
        }
        return proxy
    }


    function eachProxyDecorator( proxy, data ) {
        var param = data.param || "el"
        proxy.$id = ("$proxy$" + data.type + Math.random()).replace( /0\./, "" )
        proxy[ param ] = function ( val ) {
            if ( arguments.length ) {
                data.$repeat.set( proxy.$$index, val )
            } else {
                return data.$repeat[ proxy.$$index ]
            }
        }
        return proxy
    }

    function proxyCinerator( array ) {
        var data
        for ( var i in array ) {
            var proxy = array[ i ]
            if ( proxy.$subscribers )
                while ( data = proxy.$subscribers.pop() ) {
                    disposeData( data )
                }
        }
        array.length = 0
    }

    /*********************************************************************
     *                             �Դ�������                            *
     **********************************************************************/
    var rscripts = /<script[^>]*>([\S\s]*?)<\/script\s*>/gim
    var ron = /\s+(on[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g
    var ropen = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/ig
    var rsanitize = {
        a: /\b(href)\=("javascript[^"]*"|'javascript[^']*')/ig,
        img: /\b(src)\=("javascript[^"]*"|'javascript[^']*')/ig,
        form: /\b(action)\=("javascript[^"]*"|'javascript[^']*')/ig
    }
    var rsurrogate = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
    var rnoalphanumeric = /([^\#-~| |!])/g;
    var filters = avalon.filters = {
        uppercase: function ( str ) {
            return str.toUpperCase()
        },
        lowercase: function ( str ) {
            return str.toLowerCase()
        },
        truncate: function ( target, length, truncation ) {
            //length�����ַ������ȣ�truncation�����ַ����Ľ�β���ֶ�,�������ַ���
            length = length || 30
            truncation = truncation === void(0) ? "..." : truncation
            return target.length > length ? target.slice( 0, length - truncation.length ) + truncation : String( target )
        },
        camelize: camelize,
        //https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
        //    <a href="javasc&NewLine;ript&colon;alert('XSS')">chrome</a> 
        //    <a href="data:text/html;base64, PGltZyBzcmM9eCBvbmVycm9yPWFsZXJ0KDEpPg==">chrome</a>
        //    <a href="jav	ascript:alert('XSS');">IE67chrome</a>
        //    <a href="jav&#x09;ascript:alert('XSS');">IE67chrome</a>
        //    <a href="jav&#x0A;ascript:alert('XSS');">IE67chrome</a>
        sanitize: function ( str ) {
            return str.replace( rscripts, "" ).replace( ropen, function ( a, b ) {
                var match = a.toLowerCase().match( /<(\w+)\s/ )
                if ( match ) { //����a��ǩ��href���ԣ�img��ǩ��src���ԣ�form��ǩ��action����
                    var reg = rsanitize[ match[ 1 ] ]
                    if ( reg ) {
                        a = a.replace( reg, function ( s, name, value ) {
                            var quote = value.charAt( 0 )
                            return name + "=" + quote + "javascript:void(0)" + quote
                        } )
                    }
                }
                return a.replace( ron, " " ).replace( /\s+/g, " " ) //�Ƴ�onXXX�¼�
            } )
        },
        escape: function ( html ) {
            //���ַ������� html ת��õ��ʺ���ҳ������ʾ������, �����滻 < Ϊ &lt 
            return String( html ).
                replace( /&/g, '&amp;' ).
                replace( rsurrogate, function ( value ) {
                    var hi = value.charCodeAt( 0 )
                    var low = value.charCodeAt( 1 )
                    return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';'
                } ).
                replace( rnoalphanumeric, function ( value ) {
                    return '&#' + value.charCodeAt( 0 ) + ';'
                } ).
                replace( /</g, '&lt;' ).
                replace( />/g, '&gt;' )
        },
        currency: function ( number, symbol ) {
            symbol = symbol || "\uFFE5"
            return symbol + avalon.filters.number( number )
        },
        number: function ( number, decimals, dec_point, thousands_sep ) {
            //��PHP��number_format��ȫ����
            //number	���裬Ҫ��ʽ��������
            //decimals	��ѡ���涨���ٸ�С��λ��
            //dec_point	��ѡ���涨����С������ַ�����Ĭ��Ϊ . ����
            //thousands_sep	��ѡ���涨����ǧλ�ָ������ַ�����Ĭ��Ϊ , ������������˸ò�������ô���������������Ǳ���ġ�
            // http://kevin.vanzonneveld.net
            number = (number + "").replace( /[^0-9+\-Ee.]/g, "" )
            var n = !isFinite( +number ) ? 0 : +number,
                prec = !isFinite( +decimals ) ? 0 : Math.abs( decimals ),
                sep = thousands_sep || ",",
                dec = dec_point || ".",
                s = "",
                toFixedFix = function ( n, prec ) {
                    var k = Math.pow( 10, prec )
                    return "" + Math.round( n * k ) / k
                }
            // Fix for IE parseFloat(0.55).toFixed(0) = 0 
            s = (prec ? toFixedFix( n, prec ) : "" + Math.round( n )).split( '.' )
            if ( s[ 0 ].length > 3 ) {
                s[ 0 ] = s[ 0 ].replace( /\B(?=(?:\d{3})+(?!\d))/g, sep )
            }
            if ( (s[ 1 ] || "").length < prec ) {
                s[ 1 ] = s[ 1 ] || ""
                s[ 1 ] += new Array( prec - s[ 1 ].length + 1 ).join( "0" )
            }
            return s.join( dec )
        }
    }
    /*
     'yyyy': 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
     'yy': 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
     'y': 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
     'MMMM': Month in year (January-December)
     'MMM': Month in year (Jan-Dec)
     'MM': Month in year, padded (01-12)
     'M': Month in year (1-12)
     'dd': Day in month, padded (01-31)
     'd': Day in month (1-31)
     'EEEE': Day in Week,(Sunday-Saturday)
     'EEE': Day in Week, (Sun-Sat)
     'HH': Hour in day, padded (00-23)
     'H': Hour in day (0-23)
     'hh': Hour in am/pm, padded (01-12)
     'h': Hour in am/pm, (1-12)
     'mm': Minute in hour, padded (00-59)
     'm': Minute in hour (0-59)
     'ss': Second in minute, padded (00-59)
     's': Second in minute (0-59)
     'a': am/pm marker
     'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
     format string can also be one of the following predefined localizable formats:

     'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
     'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
     'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
     'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010
     'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
     'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
     'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
     'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
     */
    new function () {
        function toInt( str ) {
            return parseInt( str, 10 )
        }

        function padNumber( num, digits, trim ) {
            var neg = ""
            if ( num < 0 ) {
                neg = '-'
                num = -num
            }
            num = "" + num
            while ( num.length < digits )
                num = "0" + num
            if ( trim )
                num = num.substr( num.length - digits )
            return neg + num
        }

        function dateGetter( name, size, offset, trim ) {
            return function ( date ) {
                var value = date[ "get" + name ]()
                if ( offset > 0 || value > -offset )
                    value += offset
                if ( value === 0 && offset === -12 ) {
                    value = 12
                }
                return padNumber( value, size, trim )
            }
        }

        function dateStrGetter( name, shortForm ) {
            return function ( date, formats ) {
                var value = date[ "get" + name ]()
                var get = (shortForm ? ("SHORT" + name) : name).toUpperCase()
                return formats[ get ][ value ]
            }
        }

        function timeZoneGetter( date ) {
            var zone = -1 * date.getTimezoneOffset()
            var paddedZone = (zone >= 0) ? "+" : ""
            paddedZone += padNumber( Math[ zone > 0 ? "floor" : "ceil" ]( zone / 60 ), 2 ) + padNumber( Math.abs( zone % 60 ), 2 )
            return paddedZone
        }

        //ȡ����������

        function ampmGetter( date, formats ) {
            return date.getHours() < 12 ? formats.AMPMS[ 0 ] : formats.AMPMS[ 1 ]
        }

        var DATE_FORMATS = {
            yyyy: dateGetter( "FullYear", 4 ),
            yy: dateGetter( "FullYear", 2, 0, true ),
            y: dateGetter( "FullYear", 1 ),
            MMMM: dateStrGetter( "Month" ),
            MMM: dateStrGetter( "Month", true ),
            MM: dateGetter( "Month", 2, 1 ),
            M: dateGetter( "Month", 1, 1 ),
            dd: dateGetter( "Date", 2 ),
            d: dateGetter( "Date", 1 ),
            HH: dateGetter( "Hours", 2 ),
            H: dateGetter( "Hours", 1 ),
            hh: dateGetter( "Hours", 2, -12 ),
            h: dateGetter( "Hours", 1, -12 ),
            mm: dateGetter( "Minutes", 2 ),
            m: dateGetter( "Minutes", 1 ),
            ss: dateGetter( "Seconds", 2 ),
            s: dateGetter( "Seconds", 1 ),
            sss: dateGetter( "Milliseconds", 3 ),
            EEEE: dateStrGetter( "Day" ),
            EEE: dateStrGetter( "Day", true ),
            a: ampmGetter,
            Z: timeZoneGetter
        }
        var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,
            NUMBER_STRING = /^\d+$/
        var riso8601 = /^(\d{4})-?(\d+)-?(\d+)(?:T(\d+)(?::?(\d+)(?::?(\d+)(?:\.(\d+))?)?)?(Z|([+-])(\d+):?(\d+))?)?$/
        // 1        2       3         4          5          6          7          8  9     10      11

        function jsonStringToDate( string ) {
            var match
            if ( match = string.match( riso8601 ) ) {
                var date = new Date( 0 ),
                    tzHour = 0,
                    tzMin = 0,
                    dateSetter = match[ 8 ] ? date.setUTCFullYear : date.setFullYear,
                    timeSetter = match[ 8 ] ? date.setUTCHours : date.setHours
                if ( match[ 9 ] ) {
                    tzHour = toInt( match[ 9 ] + match[ 10 ] )
                    tzMin = toInt( match[ 9 ] + match[ 11 ] )
                }
                dateSetter.call( date, toInt( match[ 1 ] ), toInt( match[ 2 ] ) - 1, toInt( match[ 3 ] ) )
                var h = toInt( match[ 4 ] || 0 ) - tzHour
                var m = toInt( match[ 5 ] || 0 ) - tzMin
                var s = toInt( match[ 6 ] || 0 )
                var ms = Math.round( parseFloat( '0.' + (match[ 7 ] || 0) ) * 1000 )
                timeSetter.call( date, h, m, s, ms )
                return date
            }
            return string
        }

        var rfixYMD = /^(\d+)\D(\d+)\D(\d+)/
        filters.date = function ( date, format ) {
            var locate = filters.date.locate,
                text = "",
                parts = [],
                fn, match
            format = format || "mediumDate"
            format = locate[ format ] || format
            if ( typeof date === "string" ) {
                if ( NUMBER_STRING.test( date ) ) {
                    date = toInt( date )
                } else {
                    var trimDate = date.trim()
                    date = trimDate.replace( rfixYMD, function ( a, b, c, d ) {
                        var array = d.length === 4 ? [ d, b, c ] : [ b, c, d ]
                        return array.join( "-" )
                    } )
                    date = jsonStringToDate( date )
                }
                date = new Date( date )
            }
            if ( typeof date === "number" ) {
                date = new Date( date )
            }
            if ( avalon.type( date ) !== "date" ) {
                return
            }
            while ( format ) {
                match = DATE_FORMATS_SPLIT.exec( format )
                if ( match ) {
                    parts = parts.concat( match.slice( 1 ) )
                    format = parts.pop()
                } else {
                    parts.push( format )
                    format = null
                }
            }
            parts.forEach( function ( value ) {
                fn = DATE_FORMATS[ value ]
                text += fn ? fn( date, locate ) : value.replace( /(^'|'$)/g, "" ).replace( /''/g, "'" )
            } )
            return text
        }
        var locate = {
            AMPMS: {
                0: "����",
                1: "����"
            },
            DAY: {
                0: "������",
                1: "����һ",
                2: "���ڶ�",
                3: "������",
                4: "������",
                5: "������",
                6: "������"
            },
            MONTH: {
                0: "1��",
                1: "2��",
                2: "3��",
                3: "4��",
                4: "5��",
                5: "6��",
                6: "7��",
                7: "8��",
                8: "9��",
                9: "10��",
                10: "11��",
                11: "12��"
            },
            SHORTDAY: {
                "0": "����",
                "1": "��һ",
                "2": "�ܶ�",
                "3": "����",
                "4": "����",
                "5": "����",
                "6": "����"
            },
            fullDate: "y��M��d��EEEE",
            longDate: "y��M��d��",
            medium: "yyyy-M-d ah:mm:ss",
            mediumDate: "yyyy-M-d",
            mediumTime: "ah:mm:ss",
            "short": "yy-M-d ah:mm",
            shortDate: "yy-M-d",
            shortTime: "ah:mm"
        }
        locate.SHORTMONTH = locate.MONTH
        filters.date.locate = locate
    }
    /*********************************************************************
     *                      AMD������                                   *
     **********************************************************************/
    var modules = avalon.modules = {
        "ready!": {
            exports: avalon
        },
        "avalon": {
            exports: avalon,
            state: 2
        }
    }


    new function () {
        var loadings = [] //���ڼ����е�ģ���б�
        var factorys = [] //������Ҫ��ID��factory��Ӧ��ϵ��ģ�飨��׼������£���parse��script�ڵ����onload��
        var basepath

        function cleanUrl( url ) {
            return (url || "").replace( /[?#].*/, "" )
        }

        plugins.js = function ( url, shim ) {
            var id = cleanUrl( url )
            if ( !modules[ id ] ) { //���֮ǰû�м��ع�
                modules[ id ] = {
                    id: id,
                    exports: {}
                }
                if ( shim ) { //shim����
                    innerRequire( shim.deps || "", function () {
                        loadJS( url, id, function () {
                            modules[ id ].state = 2
                            if ( shim.exports )
                                modules[ id ].exports = typeof shim.exports === "function" ?
                                    shim.exports() : window[ shim.exports ]
                            innerRequire.checkDeps()
                        } )
                    } )
                } else {
                    loadJS( url, id )
                }
            }
            return id
        }
        plugins.css = function ( url ) {
            var id = url.replace( /(#.+|\W)/g, "" ) ////���ڴ����href�е�hash�������������
            if ( !DOC.getElementById( id ) ) {
                var node = DOC.createElement( "link" )
                node.rel = "stylesheet"
                node.href = url
                node.id = id
                head.insertBefore( node, head.firstChild )
            }
        }
        plugins.css.ext = ".css"
        plugins.js.ext = ".js"

        plugins.text = function ( url ) {
            var xhr = getXHR()
            var id = url.replace( /[?#].*/, "" )
            modules[ id ] = {}
            xhr.onreadystatechange = function () {
                if ( xhr.readyState === 4 ) {
                    var status = xhr.status;
                    if ( status > 399 && status < 600 ) {
                        avalon.error( url + " ��Ӧ��Դ�����ڻ�û�п��� CORS" )
                    } else {
                        modules[ id ].state = 2
                        modules[ id ].exports = xhr.responseText
                        innerRequire.checkDeps()
                    }
                }
            }
            xhr.open( "GET", url, true )
            if ( "withCredentials" in xhr ) {
                xhr.withCredentials = true
            }
            xhr.setRequestHeader( "X-Requested-With", "XMLHttpRequest" )
            xhr.send()
            return id
        }


        var cur = getCurrentScript( true )
        if ( !cur ) { //����window safari��Errorû��stack������
            cur = avalon.slice( DOC.scripts ).pop().src
        }
        var url = cleanUrl( cur )
        basepath = kernel.base = url.slice( 0, url.lastIndexOf( "/" ) + 1 )

        function getCurrentScript( base ) {
            // �ο� https://github.com/samyk/jiagra/blob/master/jiagra.js
            var stack
            try {
                a.b.c() //ǿ�Ʊ���,�Ա㲶��e.stack
            } catch ( e ) { //safari�Ĵ������ֻ��line,sourceId,sourceURL
                stack = e.stack
                if ( !stack && window.opera ) {
                    //opera 9û��e.stack,����e.Backtrace,������ֱ��ȡ��,��Ҫ��e����ת�ַ������г�ȡ
                    stack = (String( e ).match( /of linked script \S+/g ) || []).join( " " )
                }
            }
            if ( stack ) {
                /**e.stack���һ��������֧�ֵ��������������:
                 *chrome23:
                 * at http://113.93.50.63/data.js:4:1
                 *firefox17:
                 *@http://113.93.50.63/query.js:4
                 *opera12:http://www.oldapps.com/opera.php?system=Windows_XP
                 *@http://113.93.50.63/data.js:4
                 *IE10:
                 *  at Global code (http://113.93.50.63/data.js:4:1)
                 *  //firefox4+ ������document.currentScript
                 */
                stack = stack.split( /[@ ]/g ).pop() //ȡ�����һ��,���һ���ո��@֮��Ĳ���
                stack = stack[ 0 ] === "(" ? stack.slice( 1, -1 ) : stack.replace( /\s/, "" ) //ȥ�����з�
                return stack.replace( /(:\d+)?:\d+$/i, "" ) //ȥ���к��������ڵĳ����ַ���ʼλ��
            }
            var nodes = (base ? DOC : head).getElementsByTagName( "script" ) //ֻ��head��ǩ��Ѱ��
            for ( var i = nodes.length, node; node = nodes[ --i ]; ) {
                if ( (base || node.className === subscribers) && node.readyState === "interactive" ) {
                    return node.className = node.src
                }
            }
        }

        function checkCycle( deps, nick ) {
            //����Ƿ����ѭ������
            for ( var id in deps ) {
                if ( deps[ id ] === "˾ͽ����" && modules[ id ].state !== 2 && (id === nick || checkCycle( modules[ id ].deps, nick )) ) {
                    return true
                }
            }
        }

        function checkDeps() {
            //����JSģ��������Ƿ��Ѱ�װ���,����װ����
            loop: for ( var i = loadings.length, id; id = loadings[ --i ]; ) {

                var obj = modules[ id ],
                    deps = obj.deps
                for ( var key in deps ) {
                    if ( ohasOwn.call( deps, key ) && modules[ key ].state !== 2 ) {
                        continue loop
                    }
                }
                //���deps�ǿն��������������ģ���״̬����2
                if ( obj.state !== 2 ) {
                    loadings.splice( i, 1 ) //�������Ƴ��ٰ�װ����ֹ��IE��DOM��������ֶ�ˢ��ҳ�棬����ִ����
                    fireFactory( obj.id, obj.args, obj.factory )
                    checkDeps() //����ɹ�,����ִ��һ��,�Է���Щģ��Ͳģ��û�а�װ��
                }
            }
        }

        function checkFail( node, onError, fuckIE ) {
            var id = cleanUrl( node.src ) //����Ƿ�����
            node.onload = node.onreadystatechange = node.onerror = null
            if ( onError || (fuckIE && !modules[ id ].state) ) {
                setTimeout( function () {
                    head.removeChild( node )
                    node = null // �����ʽIE�µ�ѭ����������
                } )
                log( "debug: ���� " + id + " ʧ��" + onError + " " + (!modules[ id ].state) )
            } else {
                return true
            }
        }

        var rdeuce = /\/\w+\/\.\./

        function loadResources( url, parent, ret, shim ) {
            //1. �ر���mass|ready��ʶ��
            if ( url === "ready!" || (modules[ url ] && modules[ url ].state === 2) ) {
                return url
            }
            //2.  ����text!  css! ����Դ
            var plugin
            url = url.replace( /^\w+!/, function ( a ) {
                plugin = a.slice( 0, -1 )
                return ""
            } )
            plugin = plugin || "js"
            plugin = plugins[ plugin ] || noop
            //3. ת��Ϊ����·��
            if ( typeof kernel.shim[ url ] === "object" ) {
                shim = kernel.shim[ url ]
            }
            if ( kernel.paths[ url ] ) { //��������
                url = kernel.paths[ url ]
            }

            //4. ��ȫ·��
            if ( /^(\w+)(\d)?:.*/.test( url ) ) {
                ret = url
            } else {
                parent = parent.substr( 0, parent.lastIndexOf( "/" ) )
                var tmp = url.charAt( 0 )
                if ( tmp !== "." && tmp !== "/" ) { //����ڸ�·��
                    ret = basepath + url
                } else if ( url.slice( 0, 2 ) === "./" ) { //������ֵ�·��
                    ret = parent + url.slice( 1 )
                } else if ( url.slice( 0, 2 ) === ".." ) { //����ڸ�·��
                    ret = parent + "/" + url
                    while ( rdeuce.test( ret ) ) {
                        ret = ret.replace( rdeuce, "" )
                    }
                } else if ( tmp === "/" ) {
                    ret = url //����ڸ�·��
                } else {
                    avalon.error( "������ģ���ʶ����: " + url )
                }
            }
            //5. ��ȫ��չ��
            url = cleanUrl( ret )
            var ext = plugin.ext
            if ( ext ) {
                if ( url.slice( 0 - ext.length ) !== ext ) {
                    ret += ext
                }
            }
            //6. ���洦��
            if ( kernel.nocache ) {
                ret += (ret.indexOf( "?" ) === -1 ? "?" : "&") + (new Date - 0)
            }
            return plugin( ret, shim )
        }

        function loadJS( url, id, callback ) {
            //ͨ��script�ڵ����Ŀ��ģ��
            var node = DOC.createElement( "script" )
            node.className = subscribers //��getCurrentScriptֻ��������Ϊsubscribers��script�ڵ�
            node[ W3C ? "onload" : "onreadystatechange" ] = function () {
                if ( W3C || /loaded|complete/i.test( node.readyState ) ) {
                    //mass Framework����_checkFail��������Ļص�������������ͷŻش棬����DOM0�¼�д����IE6��GC����
                    var factory = factorys.pop()
                    factory && factory.delay( id )
                    if ( callback ) {
                        callback()
                    }
                    if ( checkFail( node, false, !W3C ) ) {
                        log( "debug: �ѳɹ����� " + url )
                    }
                }
            }
            node.onerror = function () {
                checkFail( node, true )
            }
            node.src = url //���뵽head�ĵ�һ���ڵ�ǰ����ֹIE6��head��ǩû�պ�ǰʹ��appendChild�״�
            head.insertBefore( node, head.firstChild ) //chrome�µڶ�����������Ϊnull
            log( "debug: ��׼������ " + url ) //����Ҫ����IE6�¿�����խgetCurrentScript��Ѱ�ҷ�Χ
        }

        innerRequire = avalon.require = function ( list, factory, parent ) {
            // ���ڼ�����������Ƿ�Ϊ2
            var deps = {},
            // ���ڱ�������ģ��ķ���ֵ
                args = [],
            // ��Ҫ��װ��ģ����
                dn = 0,
            // �Ѱ�װ���ģ����
                cn = 0,
                id = parent || "callback" + setTimeout( "1" )
            parent = parent || basepath
            String( list ).replace( rword, function ( el ) {
                var url = loadResources( el, parent )
                if ( url ) {
                    dn++
                    if ( modules[ url ] && modules[ url ].state === 2 ) {
                        cn++
                    }
                    if ( !deps[ url ] ) {
                        args.push( url )
                        deps[ url ] = "˾ͽ����" //ȥ��
                    }
                }
            } )
            modules[ id ] = {//����һ������,��¼ģ��ļ��������������Ϣ
                id: id,
                factory: factory,
                deps: deps,
                args: args,
                state: 1
            }
            if ( dn === cn ) { //�����Ҫ��װ�ĵ����Ѱ�װ�õ�
                fireFactory( id, args, factory ) //��װ�������
            } else {
                //�ŵ�����ж���,�ȴ�checkDeps����
                loadings.unshift( id )
            }
            checkDeps()
        }

        /**
         * ����ģ��
         * @param {String} id ? ģ��ID
         * @param {Array} deps ? �����б�
         * @param {Function} factory ģ�鹤��
         * @api public
         */
        innerRequire.define = function ( id, deps, factory ) { //ģ����,�����б�,ģ�鱾��
            var args = aslice.call( arguments )

            if ( typeof id === "string" ) {
                var _id = args.shift()
            }
            if ( typeof args[ 0 ] === "function" ) {
                args.unshift( [] )
            } //���ߺϲ�����ֱ�ӵõ�ģ��ID,����Ѱ�ҵ�ǰ���ڽ����е�script�ڵ��src��Ϊģ��ID
            //���ڳ���safari�⣬���Ƕ���ֱ��ͨ��getCurrentScriptһ����λ�õ���ǰִ�е�script�ڵ㣬
            //safari��ͨ��onload+delay�հ���Ͻ��
            var name = modules[ _id ] && modules[ _id ].state >= 1 ? _id : cleanUrl( getCurrentScript() )
            if ( !modules[ name ] && _id ) {
                modules[ name ] = {
                    id: name,
                    factory: factory,
                    state: 1
                }
            }
            factory = args[ 1 ]
            factory.id = _id //���ڵ���
            factory.delay = function ( d ) {
                args.push( d )
                var isCycle = true
                try {
                    isCycle = checkCycle( modules[ d ].deps, d )
                } catch ( e ) {
                }
                if ( isCycle ) {
                    avalon.error( d + "ģ����֮ǰ��ģ�����ѭ���������벻Ҫֱ����script��ǩ����" + d + "ģ��" )
                }
                delete factory.delay //�ͷ��ڴ�
                innerRequire.apply( null, args ) //0,1,2 --> 1,2,0
            }

            if ( name ) {
                factory.delay( name, args )
            } else { //�Ƚ��ȳ�
                factorys.push( factory )
            }
        }
        innerRequire.define.amd = modules

        function fireFactory( id, deps, factory ) {
            for ( var i = 0, array = [], d; d = deps[ i++ ]; ) {
                array.push( modules[ d ].exports )
            }
            var module = Object( modules[ id ] ),
                ret = factory.apply( window, array )
            module.state = 2
            if ( ret !== void 0 ) {
                modules[ id ].exports = ret
            }
            return ret
        }

        innerRequire.config = kernel
        innerRequire.checkDeps = checkDeps
    }
    /*********************************************************************
     *                           DOMReady                               *
     **********************************************************************/

    var readyList = []

    function fireReady() {
        if ( DOC.body ) { //  ��IE8 iframe��doScrollCheck���ܲ���ȷ
            if ( innerRequire ) {
                modules[ "ready!" ].state = 2
                innerRequire.checkDeps()
            } else {
                readyList.forEach( function ( a ) {
                    a( avalon )
                } )
            }
            fireReady = noop //���Ժ�������ֹIE9���ε���_checkDeps
        }
    }

    function doScrollCheck() {
        try { //IE��ͨ��doScrollCheck���DOM���Ƿ���
            root.doScroll( "left" )
            fireReady()
        } catch ( e ) {
            setTimeout( doScrollCheck )
        }
    }

    if ( DOC.readyState === "complete" ) {
        setTimeout( fireReady ) //�����domReady֮�����
    } else if ( W3C ) {
        DOC.addEventListener( "DOMContentLoaded", fireReady )
    } else {
        DOC.attachEvent( "onreadystatechange", function () {
            if ( DOC.readyState === "complete" ) {
                fireReady()
            }
        } )
        if ( root.doScroll ) {
            doScrollCheck()
        }
    }
    avalon.bind( window, "load", fireReady )

    avalon.ready = function ( fn ) {
        if ( innerRequire ) {
            innerRequire( "ready!", fn )
        } else if ( fireReady === noop ) {
            fn( avalon )
        } else {
            readyList.push( fn )
        }
    }

    avalon.config( {
        loader: false,
        debug: true
    } )

    avalon.ready( function () {
        avalon.scan( DOC.body )
    } )


    // ����鿴������������, �������,Ҫ���� | html ����ȥ.��: { object | json | html }
    avalon.filters.json = function ( obj ) {
        obj = obj.$model ? obj.$model : obj;
        var JsonUti = {
            n: "\n", t: "	", convertToString: function ( a ) {
                return JsonUti.__writeObj( a, 1 )
            }, __writeObj: function ( a, b, c ) {
                var d, e, f, g, h, i, j, k, l, m, n;
                if ( null == a )return "null";
                if ( a.constructor == Number || a.constructor == Date || a.constructor == String || a.constructor == Boolean )return d = a.toString(), e = c ? JsonUti.__repeatStr( JsonUti.t, b - 1 ) : "", a.constructor == String || a.constructor == Date ? e + ('"' + d + '"') : a.constructor == Boolean ? e + d.toLowerCase() : e + d;
                f = [];
                for ( g in a ) {
                    if ( h = [], i = JsonUti.__repeatStr( JsonUti.t, b ), h.push( i ), h.push( g + " : " ), j = a[ g ], null == j )h.push( "null" ); else if ( k = j.constructor, k == Array ) {
                        for ( h.push( JsonUti.n + i + "[" + JsonUti.n ), l = b + 2, m = [], n = 0; n < j.length; n++ )m.push( JsonUti.__writeObj( j[ n ], l, !0 ) );
                        h.push( m.join( "," + JsonUti.n ) ), h.push( JsonUti.n + i + "]" )
                    } else k == Function ? h.push( "[Function]" ) : h.push( JsonUti.__writeObj( j, b + 1 ) );
                    f.push( h.join( "" ) )
                }
                return (b > 1 && !c ? JsonUti.n : "") + JsonUti.__repeatStr( JsonUti.t, b - 1 ) + "{" + JsonUti.n + f.join( "," + JsonUti.n ) + JsonUti.n + JsonUti.__repeatStr( JsonUti.t, b - 1 ) + "}"
            }, __isArray: function ( a ) {
                return a ? a.constructor == Array : !1
            }, __repeatStr: function ( a, b ) {
                var d, c = [];
                if ( b > 0 )for ( d = 0; b > d; d++ )c.push( a );
                return c.join( "" )
            }
        };
        JsonUti.n = "<br />";
        JsonUti.t = "&nbsp;&nbsp;&nbsp;&nbsp;";
        return JsonUti.convertToString( obj );
    }

})();