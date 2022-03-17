aJax笔记总结
===========

## 服务端 express基本使用

```js
// 1. 引入express
const express = require('express');

// 2. 创建应用对象
const app = express();

// 3. 创建路由规则
// app.get/app.post/app.all方式
// request是对请求报文的封装，获取请求参数。response是对响应报文的封装
app.get('/server', (request, response) => {
    // 设置响应头，设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    // 表示任意请求头(自定义请求头)都接受
    response.setHeader('Access-Control-Allow-Headers', '*');

    // 设置响应
    response.send('服务端发送数据...'); //参数可以是Buffer对象，String，对象或Array
    response.end('block.innerText=\'发送一些数据\''); //参数只限定字符串和Buffer

    // 响应一个页面
    response.sendFile(__dirname + '/重复请求问题.html');  //绝对路径

    // 发送对象
    let data = {
        name: '武大郎',
        favor: '吃烧饼'
    };
    let str = JSON.stringify(data); //将对象转换为json格式再发送
    response.send(str);

    // jsonp的使用，以js代码函数的形式发送数据
    let callback = request.query.callback; //函数名
    response.end(`${callback}(${str})`); //返回一个函数调用的形式，str就是函数的参数
});
```

## 前端

### 1. 一般形式

```js
// 下面的代码一般放在事件函数里面
// 1. 创建对象
const xhr = new XMLHttpRequest();

// 2. 初始化，设置请求方法和URL
xhr.open('GET', 'http://127.0.0.1:8000/server');
// xhr.open('GET', 'http://127.0.0.1:8000/server?name=lidazhao&age=99'); //设置两参数
//附加当前时间，表示请求的时间，用来解决IE浏览器缓存问题，当服务端更新响应体内容时，IE浏览器可能仍然会使用缓存的响应体(之前返回的)
// xhr.open('POST', 'http://127.0.0.1:8000/server?t='+Date.now());

// 3. 设置
// 设置响应体数据的类型
xhr.responseType = 'json';
// 设置请求头
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
// xhr.setRequestHeader('name','zhangchao'); //自定义请求头，要发送必须在服务端设置允许自定义请求才行
// 超时设置2s，2s中得不到响应就取消请求
xhr.timeout = 2000;


// 4. 发送，数据的格式不同，后端的处理方式也应该不同
xhr.send();
// xhr.send('a=100&b=200&c=300');
// xhr.send('a:100&b:200&c:300');
// xhr.send('任意字符串');

// 手动取消请求，当请求失败或请求超时都会自动取消请求
// 手动取消请求还可以放在解决重复请求问题，设置一个布尔值来判断当前是否有正在申请的请求并控制是否取消请求和重新发送请求
xhr.abort();

// 5. 事件绑定
// readystate表示xhr对象中的属性，表示状态0，1，2，3，4
// 0表示未初始化，最开始的值就是0；1表示open()已经调用完毕；2表示send()已经调用完毕；3表示返回了部分结果；4表示返回了所有结果
xhr.onreadystatechange = function () {
    // 判断
    if (xhr.readyState === 4) {
        // 判断响应状态码，2开头的都表示成功
        if (xhr.status >= 200 && xhr.status < 300) {
            // 手动处理响应体字符串变对象，如果前面设置了responseType，这里就不用再写了
            let person = JSON.parse(xhr.response);


            // 处理结果，行 头 空行 体
            console.log(xhr.status); //状态码
            console.log(xhr.statusText); //状态字符串
            console.log(xhr.getAllResponseHeaders()); //所有响应头
            console.log(xhr.response); //响应体
        } else {

        }
    }
};
// 请求超时
xhr.ontimeout = function () {
    alert("请求超时");
};
// 未联网
xhr.onerror = function () {
    alert("你的网络出现了一些问题");
};
```

### 2. jQuery申请aJax请求

```js
// get/post方式
$.get('http://localhost:8000/server_jquery', {a: 100, b: 200}, (data) => {
    // 处理响应体
});

// 通用形式
$('button').eq(2).click(() => {
    // 通用型方法ajax
    $.ajax({                                            //ajax请求
        url: 'http://localhost:8000/server_jquery',     //控制器的验证操作
        type: 'post',                                   //发送数据方式
        data: {a: 100, b: 200},                         //发送的数据
        dataType: 'json',                               //返回数据的类型
        headers: {                                      //头信息
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 2000,                                  //请求超时
        success: function (result) {                    //请求成功以后执行函数，result为返回的数据对象
            console.log(result);
        },
        error: function () {
            console.log('出错');
        },
    });
});
```

### 3. fetch申请aJax请求

```js
// 可以加上URL参数
fetch('http://localhost:8000/server_jquery?id=2', {
    method: 'post',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    // 请求体，字符串形式
    body: 'username=123456789&password=123456789',
}).then(response => { //请求体
    // console.log(response); //包含请求、响应、状态的一些信息，但是无法直接获取响应体
    return response.json(); //json形式，如果响应体是json形式就用这个
    // return response.text(); //字符串
}).then(response => { //json形式的数据还需要一个then()，不是json就不用
    console.log(response);
});
```

### 4. axios申请aJax请求

```js
// 配置baseURL
axios.defaults.baseURL = 'http://localhost:8000';
// GET请求
axios.get('/server_jquery', {
    // url参数
    params: {
        name: '李小龙',
        favor: '喜欢功夫',
    },
    // 请求头信息
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}).then(value => {
    console.log(value); //返回了很多信息，包括请求信息、响应信息、配置、状态码、状态字符串等
    // console.log(value.data); 
});

// POST请求 ，post(URL, 请求体, 其他信息)
axios.post('/server_jquery', {
    // 表单数据
    username: '123456',
    password: '123456',
}, {
    // URL参数
    params: {
        name: '李小龙',
        favor: '喜欢功夫',
    },
    // 请求头
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}).then(value => {
    console.log(value.data);
});

// 通用方式
axios({
    method: 'post',
    url: '/server_jquery',
    // URL参数
    params: {
        name: '李小龙'
    },
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    // 请求体
    data: {
        username: '123456',
        password: '123456',
    }
}).then(value => {
    console.log(value.status); //响应行的状态码
    console.log(value.headers); //响应头
    console.log(value.data); //响应体
});
```

## 解决跨域问题

### 方法一：jsonp

+ jsonp解决跨域问题，原理是利用script引入自带跨域功能，这就可以让script指定服务端，并接收响应消息
+ 条件：请求方式必须是get方式，并且响应体必须是js代码，不然会报错
+ 一般返回函数的使用比较好，比较节省代码

#### 原理介绍
```html
<!--方法一、直接引入-->
<script src="http://localhost:8000/jsonp"></script>
```

```js
// 方法二、事件生成script引入，来进行请求
let btn = document.querySelectorAll('button')[0];
btn.onclick = function () {
    let script = document.createElement('script');
    script.src = 'http://localhost:8000/jsonp';
    document.body.append(script);
};
```

#### jsonp的使用
```js
// URL参数里面会有函数调用的一个函数(callback的值)，只要服务端返回 函数名(数据) 就可以被接收到
$.getJSON('http://localhost:8000/jsonp_use?callback=?', function (data) {
    $('#result').html(`
                名称：${data.name}<br>
                位置：${data.location}
            `);
});

// 在服务端返回数据时，以js代码函数的形式发送数据
let str = "返回的数据";
let callback = request.query.callback; //函数名
response.end(`${callback}(${str})`); //返回一个函数调用的形式，str就是函数的参数
```

