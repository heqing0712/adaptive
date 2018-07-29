var fl = {};

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


 /*
 * 初始化
 */
fl.init = function () {

  

     fl.lzImg();

 };





$(function () {

    fl.init();

})