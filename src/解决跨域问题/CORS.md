## CORS

+ CORS是官方的解决方案，特点是完全不需要客户端做任务特殊的操作，完全在服务器中进行处理，支持get和post请求。
+ 跨域资源共享标准新增了一组HTTP首部字段，允许服务器声明哪些源站通过浏览器有权限访问哪些资源
+ 比民间的cors好用

可以在服务端的函数中添加：

```js

response.setHeader('Access-Control-Allow-Origin', '*'); //允许任何跨域请求
response.setHeader('Access-Control-Allow-Origin', 'http:..../5050'); //允许指定端口跨域

response.setHeader('Access-Control-Allow-Headers', '*');//*表示任意请求头(自定义请求头)都接受

//等等...
```

