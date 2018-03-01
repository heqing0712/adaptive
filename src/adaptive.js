
var timer, scale,
    width = 640,
    doc = window.document,
    query = doc.querySelector,
    setAtr = meta.setAttribute,
    meta = query("[name=viewport]"),
    resize = function () {
        var content = "",
            isMb = navigator.userAgent.match(/mobile/i);
        scale = isMb ? window.screen.availWidth / width : 1;
        content += "width=" + width + ",";
        content += "maximum-scale=" + scale + ",";
        content += "user-scalable=no";
        setAtr("content", content);
    };

if (meta) {
    width = +(meta.getAttribute("width") || width);
}else {
    meta = doc.createElement("meta");
    setAtt("name", "viewport");
    query("head").appendChild(meta);
}

window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(resize, 1);
})

resize();