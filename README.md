# adaptive

adaptive 是一个移动端自适应的插件，引用插件放到html头部head即可。
原理是，根据屏幕分辨率来修改meta标签的缩放值，从而来实现页面自适应。优点是不需要修改原来px单位的css代码，解决rem布局css逐帧动画1像素缺陷问题 ，缺点是在android下2张切开的图片合并时会有1px的缝隙，ios没有该问题。



# template
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta  name="viewport" content="width=640,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
		<meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <title>template</title>
        <script src="adaptive.js"></script>
        </head>
    <body>
    <div class="wrap">

    </div>
    </body>
    </html>

# demo
[专题测试demo](https://heqing0712.github.io/adaptive/examples)
