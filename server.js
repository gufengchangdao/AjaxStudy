const express = require('express');

const app = express();

app.get('/server', (request, response) => {
    // 设置响应头，设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    // 设置响应
    response.send('服务端发送数据...get');
});

app.all('/server', (request, response) => {
    // 设置响应头，设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');//*表示任意请求头(自定义请求头)都接受

    // 设置响应
    response.send('<div style="color: red">post请求已收到，正在处理...</div>');
});

app.all('/404page', (request, response) => {
    // 响应一个页面
    response.sendFile(__dirname + '/重复请求问题.html'); //跳转到指定html上
});

app.post('/server_json', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');

    let data = {
        name: '武大郎',
        favor: '吃烧饼'
    };

    response.send(JSON.stringify(data)); //将对象进行字符串转换再发送
});

// 请求超时和网路异常处理
app.post('/delay', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    // 延时3秒
    setTimeout(() => {
        response.send("服务端收到请求三秒后再响应");
    }, 3000);
});

// jquery、axios使用
app.all('/server_jquery', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    let data = {status: "JQuery的GET请求"};
    response.send(JSON.stringify(data));
});

// jsonp原理演示，这里必须是get类型
app.get('/jsonp', (request, response) => {
    // 可以改成调用函数的形式，这样还可以减少代码量
    response.end('block.innerText=\'发送一些数据\'');
});

// jsonp使用
app.get('/jsonp_use', (request, response) => {
    data = {
        name: '绯世之玉',
        location: '终焉之地',
    };
    let str = JSON.stringify(data);
    let callback = request.query.callback;
    response.end(`${callback}(${str})`); //返回一个函数调用的形式，str就是函数的参数

});

app.listen(8000, () => {
    console.log("服务已经启动，8000端口监听中....");
});


