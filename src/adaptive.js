var
    timer, minH, maxH, minHw, maxHw, scale,
    width = 640,
    minHeight = 1008,
    maxHeight = 1136,
    setHeight = false,
    bodyClass = "all",
    doc = window.document,
    docEl = doc.documentElement,
    head = doc.querySelector("head"),
    meta = doc.querySelector("[name=viewport]"),
    resize = function () {
        var
            winHw, osName, className, classList, styleAll,
            style = {},
            content = {},
            styleStr = "",
            contentStr = "",
            height = maxHeight,
            u = navigator.userAgent,
            winWidth = window.screen.availWidth,
            winHeight = window.screen.availHeight,
            isMb = u.match(/mobile/i),
            os = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? "ios" :
                (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) ? "android" : "";


        scale = 1;

        if (!meta) {
            meta = doc.createElement("meta");
            meta.setAttribute("name", "viewport");
            head.appendChild(meta);
        }

        if (isMb) {

            scale = winWidth / width;

            if (setHeight) {

                winHw = winHeight / winWidth;
                height = winHw < minHw ? minHeight :
                    winHw > maxHw ? maxHeight :
                        winHeight / scale;

                height = height.toFixed(2);
            }

            content["width"] = width;

        }

        content["maximum-scale"] = content["minimum-scale"] = scale;
        content["user-scalable"] = "no";

        for (var o in content) {
            if (contentStr) contentStr += ",";
            contentStr += o + "=" + content[o];
        }

        meta.setAttribute("content", contentStr);

        if (setHeight) {

            style["height"] = height + "px";
            styleAll = doc.querySelector("style[name='adp-style']");

            for (var o in style) {
                styleStr += o + ":" + style[o] + ";";
            }

            if (!styleAll) {

                styleAll = doc.createElement("style");
                styleAll.setAttribute("name", "adp-style")
                head.appendChild(styleAll)
            }

            styleStr = "." + bodyClass + "{" + styleStr + "};";
            styleAll.innerHTML = styleStr;
        }

        if (os) {

            osName = "os-" + os;
            className = docEl.className || "";
            classList = className ? className.split(" ") : [];

            if (className.indexOf("os-") > -1) {

                for (var i = 0; i < classList.length; i++) {

                    if (classList[i].indexOf("os-") > -1) {
                        classList[i] = osName;
                        break;
                    }
                }

            } else {

                classList.push(osName);
            }

            docEl.setAttribute("class", classList.join(' '));
        }
    };

if (meta) {

    minH = meta.getAttribute("min-height");
    maxH = meta.getAttribute("max-height");
    width = +(meta.getAttribute("width") || width);
    bodyClass = meta.getAttribute("body-class") || bodyClass;

    if (minH || maxH) {

        if (minH) minHeight = +minH;
        if (maxH) maxHeight = +maxH;

        setHeight = true;
    }
}

minHw = minHeight / width;
maxHw = maxHeight / width;

window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(resize, 1);
})

resize();