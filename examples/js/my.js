

 /*
 * 初始化
 */
fl.init = function () {

     //更新价格
     //fl.updatePrice($(".cn .num"));

     //转换为移动端的链接
     fl.toMbUrl();

     //图片懒加载
     fl.lzImg();

 };





$(function () {

    fl.init();

})