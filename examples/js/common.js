
/**
 * 富连网专题公共类
 */
var fl = fl || {};

//配置
fl.cf = {
    //更新价格的jquery对象
    $numbers: null,

    //更产品编号属性 data-num
    dataNumber: "num",

    //是否更新价格属性 data-update
    //默认更新 不用添加 
    //若 添加 data-update="false" 则不会更新该节点
    dataUpdate: "update",

    //商品容器class
    goodsCls: "brick",

    saledCls: "bricked",

    //空库存添加遮罩层
    addMask: true,

    //遮罩层html
    maskHtml: "<div class=\"zt-mask\"></div>",

    //移动端遮罩层html
    maskMbHtml: "<div class=\"zt-mask\"><i></i></div>",

    //是否进行调试
    debug: false

};


//更新价格
fl.updatePrice = function (options) {

    var $numbers,
        $numberA = [],
        productIDs = [],
        $numberErrorA = [];


    var cf = fl.cf;

    //专题容器
    var $container = $("#zt-container");



    if (options instanceof jQuery) {
        cf.$numbers = $numbers = options;
    }
    else {

        $.extend(cf, options);
        $numbers = cf.$numbers;
    }
    if (!$numbers || $numbers.length < 1) {

        return;
    }

    //移动端
    if ($container.width() <= 640) {

        cf.maskHtml = cf.maskMbHtml;
    }

    $numbers.each(function (i) {

        var $that = $(this),
            update = $that.data(cf.dataUpdate),
            number = $that.data(cf.dataNumber);

        //是否更新价格
        if (update != undefined && update == false) {
            return;
        }

        if (number && $.trim(number) != "") {
            productIDs.push($.trim(number));
            $numberA.push($numbers.eq(i));
        }
        else if (cf.debug) {

            var a = $numbers.eq(i).closest("a");

            $numberErrorA.push({
                title: a.attr("title"),
                html: a.html()
            });
        }

    });

    if (cf.debug && $numberErrorA.length > 0) {

        console.log("%cThe num is no data-" + cf.dataNumber + ".,font-size:20px;color:red");

        $.each($numberErrorA, function (i) {
            console.error((i + 1) + "、" + this.title);
        });

        console.log($numberErrorA);
    }



    //更新价格
    $.ajax({
        url: "http://interface.flnet.com/api/InventoryService.asmx/GetStockAndPrice?callback=?",
        type: "GET",
        data: {
            productID: productIDs.join(",")
        },
        dataType: "JSON",
        success: function (data) {

            $.each(data.msg, function (i) {
                /*
                productID : 商品编号
                stock : 库存状态
                price : 价格
                cdPrice : 促销价 (无促销价，值为-1)
                */
                $numberA[i].text(this.price);

                var $mask = $numberA[i].closest("." + cf.goodsCls).find("." + cf.maskCls);

                if (cf.addMask && !this.stock) {
                    var $goodbox = $numberA[i].parents("." + cf.goodsCls);

                    if (!$mask.length) {
                        $goodbox.append(cf.maskHtml);
                    }

                    if (cf.saledCls) {
                        $goodbox.addClass(cf.saledCls);
                    }
                }





            })

        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console && console.log(errorThrown);
        }
    });


    //判断是否有售罄

    if (options.hasSellout) {
        setTimeout(function () {

            $.getScript("http://sale.flnet.com/cdn/js/act/sellOutList.js", function (data) {
                //存在售罄商品

                if (!sellOutList) return;

                //手动添加售罄
                $numbers.each(function (i) {

                    var $that = $(this),
                        number = $that.data(cf.dataNumber),
                        sout = sellOutList[number];

                    if (sout && (sout["sellout"] === true ||
                        sout["sellout"] === undefined)) {

                        var $goodbox = $that.parents("." + cf.goodsCls);
                        var $mask = $numberA[i].closest("." + cf.goodsCls).find("." + cf.maskCls);

                        if (!$mask.length) {
                            $goodbox.append(cf.maskHtml);
                        }

                        if (cf.saledCls) {
                            $goodbox.addClass(cf.saledCls);
                        }
                    }


                });


            })

        }, 1);
    }


};


/*
绑定悬浮菜单
*/
fl.menu = (function () {


    $.extend($.easing, {
        easeOutExpo: function (x, t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        }
    })

    return function (id, unSetTop, showFn) {

        id = id || "flmenu";
        var $menu = $("#" + id);


        if (!$menu.length) {
            return;
        }

        var $doc = $(document),
            $as = $("a", $menu),
            $footer = $("#footers"),
            menuT = ($(window).height() - $menu.height()) / 2,
            menuH = $menu.height(),
            menuHT = menuH + menuT - 10,
            speed = 800,
            waitTime = 50,
            top = 0,
            isHide = -1;

        var defaultMenuTop = $menu.css("top");

        var bindScroll = function () {

            var sTop = $doc.scrollTop(),
                fTop = $footer.length ? $footer.offset().top : -1;


            if (sTop < 550) {
                $menu.hide().removeClass("bounceInDown");
            }
            else {
                $menu.show().addClass("bounceInDown");
                if (isHide == 1) {
                    $menu.css({
                        "top": unSetTop ? defaultMenuTop : menuT,
                        "opacity": 1
                    });
                }

                isHide = 0;
            }

            if (fTop > 0) {

                if (fTop <= (sTop + menuHT)) {
                    isHide = 1;


                    $menu.css({
                        "display": "none",
                        "top": menuT + 100,
                        "opacity": 0
                    });

                    $menu.animate({ opacity: 1 }, 1);
                }


            }
        };

        if (!unSetTop) {
            $menu.css("top", menuT);
        }

        if (showFn) {
            showFn.call($menu);
        }

        $menu.hide();

        fl.goAc($as);

        $(".flmenu_close", $menu).click(function () {
            $menu.remove();
        });


        $(window).bind("scroll", function () {
            bindScroll();
        });

        bindScroll();

    }


}());


//内容块切换
fl.bindTab = function ($menu, $cn, cls, callback) {
    if ($menu.length < 1 || $cn.length < 1) { return; }
    var $lis = $menu.children(), $divs = $cn.children();
    cls = cls || "active";
    $lis.mouseover(function () {

        var $that = $(this),
            index = $lis.index($that),
            $div = $divs.eq(index);
        $div.addClass(cls).siblings().removeClass(cls);
        $that.addClass(cls).siblings().removeClass(cls);

        if (callback) callback.call(window, $div, $that, index)
    });
};


/*
* 绑定悬浮导航 菜单加光标
*/
fl.bindNav = function ($as) {

    var $doc = $(document),
        $navAs = $as || $("#flmenu .lk"),
        length = $navAs.length,
        cns = [],
        setNav = function () {

            var $floor, $a,
                i = length - 1,
                sTop = $doc.scrollTop();

            for (; i >= 0; i--) {

                $floor = cns[i];
                $a = $navAs.eq(i);

                if (sTop >= $floor.offset().top - 100) {

                    $a.addClass("active").siblings().removeClass("active");

                    break;
                }
            }
        };


    $navAs.each(function () {
        cns.push($($(this).data("it")));
    });

    $(window).bind("scroll", setNav);

    setNav();
};


/*
*滚动到指定节点
*/
fl.goAc = function ($as) {

    $as.click(function () {

        var $that = $(this),
            _top = +($that.data("top") || 0),
            it = $that.data("it");

        if (it) {

            $("html, body").stop().animate({
                scrollTop: $(it).offset().top + _top
            }, {
                    easing: "easeOutExpo",
                    duration: 600,
                    complete: function () {

                    }
                });
        }



    });


};


/*
*弹出窗体
*/
fl.openWin = function (obj, callBack) {



    var cf = {
        obj: null,     //jquery对象 弹出层对象
        width: null,   //宽
        height: null,  //高
        lock: true,    //是否锁屏
        close: null    //回调函数
    };

    if (!obj) return;

    if (typeof obj === "string") {
        cf.obj = $(obj);
    }
    else if (obj instanceof jQuery) {
        cf.obj = obj;
    }
    else if (typeof obj === "object" && obj.obj) {
        cf = $.extend(true, cf, obj);
    }

    obj = cf.obj;

    var speed = 400,

        mTop = 50,

        $body = $("body"),

        getBg = function () {
            return $("#win-bg");
        },

        $wbg = function () {

            if (!getBg().length) {
                $("body").append("<a class=\"win-bg\" id=\"win-bg\"></a>");
            }
            return getBg();
        }(),


        hideWbg = function () {

        },
        showWin = function () {

            $body.addClass("win-show");
            obj.addClass("active");
        },
        hideWin = function () {

            obj.removeClass("active");
            $body.removeClass("win-show");

        },

        close = function () {

            hideWin();
            cf.lock && unLock();
            cf.close && cf.close(obj);
        },

        lock = function () {
            $body.addClass("win-lock");

        },

        unLock = function () {
            $body.removeClass("win-lock");
            hideWbg();
        },

        setly = function () {

            var topx = parseInt(($(parent.window).height() - (obj.height() / 1)) / 2) + $(parent.window).scrollTop();
            var leftx = parseInt(($(parent.window).width() - (obj.width() / 1)) / 2) + $(parent.window).scrollLeft();

            if (topx < 0) { topx = 20; }

            obj.css({
                left: leftx,
                top: topx,
                position: "absolute"
            });


        },

        backApi = {
            obj: obj,
            bg: $wbg,
            close: close
        },

        init = function () {
            cf.width && obj.width(cf.width);
            cf.height && obj.height(cf.height);
            cf.lock && lock();
            obj.find(".win-close").unbind().bind("click", close);

            $("#win-bg").unbind().bind("click", close);
            $(window).resize(setly);
            setly();
            showWin();
            callBack && callBack.call(backApi);

        };

    init();

    return backApi;
};

/*
* 图片懒加载
*/
fl.lzImg = function () {

    var attr = "original",
        $imgs = $("img[data-" + attr + "]"),
        length = $imgs.length;

    if (!length || !$.fn.lazyload) return;

    $imgs.lazyload({

        //effect: "fadeIn",
        //effect_speed: 200,
        data_attribute: attr,

        //连续判断所有图片 是否在可视区 
        failure_limit: length,

        //700高度前 提前加载
        threshold: 700,

        //加载完毕移除源路径
        load: function () {

            $(this).removeAttr("data-" + attr);
        }
    });


};


//百度统计              
fl.baiduHm = function () {


    var _hmt = _hmt || [];
    (function () {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?4a3e7fc1d1445322ffa8f87b73a9be81";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();

    (function () {
        var bp = document.createElement("script");
        bp.src = "//push.zhanzhang.baidu.com/push.js";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(bp, s);
    })();

};

//打开appl链接
fl.callapp = function (list_a) {

    var gDevice;
    //設備列舉
    var devicesEnum = {
        webSite: 0,
        Android: 1,
        iOS: 2
    }

    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i) ? true : false;
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i) ? true : false;
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i) ? true : false;
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
        },
        nowDevice: function () {
            if (this.Android()) {
                return devicesEnum.Android;
            } else if (this.iOS()) {
                return devicesEnum.iOS;
            } else {
                return devicesEnum.webSite;
            }
        }
    };

    //取得目前裝置
    gDevice = isMobile.nowDevice();

    var mybridge, data;
    //iOS橋接使用
    function setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
    }

    //初始化iOS橋接
    if (gDevice == devicesEnum.iOS) {
        setupWebViewJavascriptBridge(function (bridge) {
            mybridge = bridge;
        });
    }

    list_a.bind("click", function () {
        var _href = $(this).attr("href"),
            getStr = _href.indexOf('?') > 0 ? _href.split('?')[1] : 0,
            _getStr, num;
        if (_href.indexOf('?') > 0 && getStr.length > 40) {
            _getStr = fl.Base64.decode(getStr);
            num = _getStr.split("&")[0].split("No=")[1];
            // 開啟商品詳情頁
            // CallProduceDetail: 方法名稱可變動
            // data參數設置:
            // Android, data = 'xxxxx'
            // iOS, data = { productSysNo = 'xxxxxxx'}
            if (gDevice == devicesEnum.Android) {   //Android
                data = num;
                if (window.appjsobj) {
                    window.appjsobj.sendToAppDetail(data);
                    return false;
                }
            } else if (gDevice == devicesEnum.iOS) { //iOS

                data = { 'productSysNo': num };
                //v1.1.33版本更換了方法名稱，兼容老版本
                if (!mybridge) {
                    //初始化iOS橋接
                    if (gDevice == devicesEnum.iOS) {
                        setupWebViewJavascriptBridge(function (bridge) {
                            mybridge = bridge;
                        });
                    }
                    if (mybridge) {
                        mybridge.callHandler('CallProductDetail', data, function (response) {

                        });
                        return false;
                    }
                }
                if (mybridge) {
                    mybridge.callHandler('AppCallProductDetail', data, function (response) {

                    });
                    return false;
                }
            }
        }
    });
};

//Base64转码
fl.Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (e) {

        var t = "",
            n, r, i, s, o, u, a, f = 0;
        e = fl.Base64._utf8_encode(e);
        while (f < e.length) n = e.charCodeAt(f++), r = e.charCodeAt(f++), i = e.charCodeAt(f++), s = n >> 2, o = (n & 3) << 4 | r >> 4, u = (r & 15) << 2 | i >> 6, a = i & 63, isNaN(r) ? u = a = 64 : isNaN(i) && (a = 64), t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
        return t
    },
    decode: function (e) {
        var t = "",
            n, r, i, s, o, u, a, f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) s = this._keyStr.indexOf(e.charAt(f++)), o = this._keyStr.indexOf(e.charAt(f++)), u = this._keyStr.indexOf(e.charAt(f++)), a = this._keyStr.indexOf(e.charAt(f++)), n = s << 2 | o >> 4, r = (o & 15) << 4 | u >> 2, i = (u & 3) << 6 | a, t += String.fromCharCode(n), u != 64 && (t += String.fromCharCode(r)), a != 64 && (t += String.fromCharCode(i));
        return t = fl.Base64._utf8_decode(t), t
    },
    _utf8_encode: function (e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            r < 128 ? t += String.fromCharCode(r) : r > 127 && r < 2048 ? (t += String.fromCharCode(r >> 6 | 192), t += String.fromCharCode(r & 63 | 128)) : (t += String.fromCharCode(r >> 12 | 224), t += String.fromCharCode(r >> 6 & 63 | 128), t += String.fromCharCode(r & 63 | 128))
        }
        return t
    },
    _utf8_decode: function (e) {
        var t = "",
            n = 0,
            r = c1 = c2 = 0;
        while (n < e.length) r = e.charCodeAt(n), r < 128 ? (t += String.fromCharCode(r), n++) : r > 191 && r < 224 ? (c2 = e.charCodeAt(n + 1), t += String.fromCharCode((r & 31) << 6 | c2 & 63), n += 2) : (c2 = e.charCodeAt(n + 1), c3 = e.charCodeAt(n + 2), t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63), n += 3);
        return t
    }
};


/*
*转换成移动端的链接
*/
fl.toMbUrl = function ($as) {

    var tomburl = function (url) {
        url = $.trim(url);

        var _num = url.indexOf("item-"),
            num = url.split(".html")[0].split("-")[1];

        if (url.length < 35 || _num < 0 || isNaN(num)) {
            return url;
        }

        var str = "productSysNo=" + num + "&IsPromotions=1";
        url = "http://m.flnet.com/product/detail.htm?" + fl.Base64.encode(str);

        return url;
    };

    if ($as == undefined) {
        $as = $(".zt-container a");
    }

    $as.each(function () {
        var $t = $(this);
        $t.attr("href", tomburl($t.attr("href")));
        $t.removeAttr("target");
    });

    if (window.location.href.indexOf('app=') > -1) {
        fl.callapp($as);
    }


};


/*
* 上下滚动
*/
fl.bindMarq = function () {

    var box = document.getElementById("marq"), can = true;
    var height = box.clientHeight;
    box.innerHTML += box.innerHTML;
    box.onmouseover = function () { can = false };
    box.onmouseout = function () { can = true };
    new function () {
        var stop = box.scrollTop % height == 0 && !can;
        if (!stop) box.scrollTop == parseInt(box.scrollHeight / 2) ? box.scrollTop = 0 : box.scrollTop++;
        setTimeout(arguments.callee, box.scrollTop % height ? 10 : 1500);
    };
};




