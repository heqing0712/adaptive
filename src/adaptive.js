
var timer, scale,
    width = 640,
    doc = window.document,
    meta = doc.querySelector("[name=viewport]"),
    resize = function () {
        var content = "",
            isMb = navigator.userAgent.match(/mobile/i);
        scale = isMb ? window.screen.availWidth / width : 1;
        content += "width=" + width + ",";
        content += "maximum-scale=" + scale + ",";
        content += "user-scalable=no";
        meta.setAttribute("content", content);
    };

if (!meta) {
    meta = doc.createElement("meta");
    doc.querySelector("head").appendChild(meta);
}

meta.setAttribute("name", "viewport");

window.addEventListener("resize", function () {
    resize();
})
window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        resize();
    }
})

resize();