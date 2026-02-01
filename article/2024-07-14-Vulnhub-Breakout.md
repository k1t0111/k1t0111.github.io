---
title: "Vulnhub-Breakout"
date: "2024-07-14"
description: "Port 80/tcp:"
---

机器信息

Breakout

系统

Linux

详细信息

源代码存在密码 445 端口smb 爆破出来用户 可以得到 webmin 系统管理页面的账号密码可以直接getshell 本地tar命令存在cap 可以直接读取备份文件root密码

### [](#0x01信息收集 "0x01信息收集")0x01信息收集

#### [](#0x02端口扫描 "0x02端口扫描")0x02端口扫描

```shell
开放情况Starting Nmap 7.93 ( https://nmap.org ) at 2024-07-12 17:55 CSTNmap scan report for 192.168.49.128Host is up (0.00078s latency).Not shown: 995 closed tcp ports (reset)PORT      STATE SERVICE80/tcp    open  http139/tcp   open  netbios-ssn445/tcp   open  microsoft-ds10000/tcp open  snet-sensor-mgmt20000/tcp open  dnpMAC Address: 00:0C:29:55:B3:1A (VMware)指纹扫描netbios-ns://192.168.49.128:137 netbios-ns  Port:137Info:workgroup:WORKGROUP,Digest:"CKAAAAAAAAAAAAAAAAAAAA,Length:229,Hostname:BREAKOUT,ProductName:Sambanmbdnetbios-ns"http://192.168.49.128:80     Apache2DebianDefaultPage:Itworks FoundDomain:www.w3.org、httpd.apache.org、bugs.debian.org,Port:80FingerPrint:Apache2Debian默认页;Perl;Debian;Apache;Apachehttpd/2.4.51;Apachehttpd;v;(Debian),Digest:th:2px;\nborder-col,Length:11396netbios://192.168.49.128:139   netbios                    Version:4.6.2,DeviceType:v,Digest:"%SMBr@@\x00\x00\x00% SM,Port:139,Length:41,ProductName:Sambasmbd"smb://192.168.49.128:445       smb                        Port:445,Digest:00\x00\x00\x00\x00\x00\x,Length:77http://192.168.49.128:10000    200—Documentfollows       Digest:"acktr:not(:first-child,Port:10000,FingerPrint:MiniServ/([\d.]+)\r\n|sp;MiniServ;Webminhttpd,Length:1779"http://192.168.49.128:20000    200—Documentfollows       Length:474,Port:20000,Digest:"runninginSSLmode.Tr"
```

#### [](#0x03-详细信息 "0x03 详细信息")0x03 详细信息

1.  **Port 80/tcp**:
    
    *   Service: HTTP
    *   版本信息: Apache httpd 2.4.51 (Debian)
    *   HTTP服务器标题: “Apache2 Debian Default Page: It works”
    *   说明: 这是一个运行在Debian系统上的Apache HTTP服务器，版本为2.4.51。默认页面表明服务器已经正确配置并运行。
    *   ```
        - **Apache2DebianDefaultPage**: Apache2在Debian系统上的默认页面。
        ```
        
    *   **FoundDomain**: 列出了一些发现的域名（[www.w3.org](http://www.w3.org/)、[httpd.apache.org](http://httpd.apache.org/)、[bugs.debian.org](http://bugs.debian.org/)）。
    *   **Port:80**: 端口号80，HTTP服务的标准端口。
    *   **FingerPrint**: 指纹信息显示为Apache2在Debian上的配置，版本号为Apachehttpd/2.4.51。
2.  **Port 139/tcp** 和 **Port 445/tcp**:
    
    *   Service: NetBIOS-SSN (Samba)
    *   版本信息: Samba smbd 4.6.2
    *   说明: 这两个端口都显示为运行Samba的服务，版本为4.6.2。Samba用于提供文件和打印服务，允许与Windows网络进行互操作。
    *   **smb**: SMB服务的端口。
    *   **Port:445**: 端口号445，用于SMB服务（文件和打印共享）的标准端口。
    *   ```
        - **netbios**: NetBIOS服务的另一个端口。
        ```
        
    *   **Version**: 版本号为4.6.2。
    *   **DeviceType**: 设备类型为v。
    *   **ProductName**: 产品名称为Sambasmbd。
3.  **Port 10000/tcp**:
    
    *   Service: HTTP
    *   版本信息: MiniServ 1.981 (Webmin httpd)
    *   HTTP服务器标题: “200 — Document follows”
    *   说明: 这是一个运行在端口10000上的Webmin管理界面，版本为1.981。Webmin是一个用于管理Unix系统的Web界面工具。
    *   *   **200—Documentfollows**: HTTP响应码200，表示请求成功。
    *   **Digest**: 包含有关服务的信息，如端口号（10000）、指纹（MiniServ/(\[\\d.\]+)）、服务类型（Webminhttpd）等。
4.  **Port 20000/tcp**:
    
    *   Service: HTTP
    *   版本信息: MiniServ 1.830 (Webmin httpd)
    *   HTTP服务器标题: “200 — Document follows”
    *   说明: 另一个运行Webmin的端口，版本为1.830。同样用于Unix系统的管理。
    *   *   **200—Documentfollows**: HTTP响应码200，表示请求成功。
    *   **Length**: 返回的文档长度为474字节。
    *   **Port:20000**: 端口号20000。
    *   **Digest**: 包含了一些描述服务运行状态的信息，如运行在SSL模式下等。

其他信息还包括：

*   MAC地址: 00:0C:29:55:B3:1A，指向VMware虚拟机的虚拟MAC地址。
*   设备类型: 通用设备，可能是一台通用用途的Linux主机。
*   运行系统细节: 运行Linux内核版本在4.15到5.6之间。

#### [](#0x04-信息筛选 "0x04 信息筛选")0x04 信息筛选

由于端口扫描可以得到相关信息

系统

Linux debian 运行Linux内核版本在4.15到5.6之间。

中间件)

Apache httpd 2.4.51 (Debian)

139 端口 netbios 445端口

Samba smbd 4.6.2

10000 端口

MiniServ 1.981 (Webmin httpd)

20000 端口

MiniServ 1.830 (Webmin httpd)

### [](#0x10-渗透 "0x10 渗透")0x10 渗透

445端口

[smb 445](smb%20445.md)

GG 扫不到445 一些共享目录 针对 samba找一些版本 漏洞

但是可以看到我们都无法利用

包括一些 webmin的unix的系统web管理平台 我们只能看到一些

框架但是都没有利用成功

之后看了wp之后才发现 在 主页 80端口有一个 brainfuck编码的

```shell
++++++++++[>+>+++>+++++++>++++++++++<<<<-]>>++++++++++++++++.++++.>>+++++++++++++++++.----.<++++++++++.-----------.>-----------.++++.<<+.>-.--------.++++++++++++++++++++.<------------.>>---------.<<++++++.++++++.  
```

解码之后可以得到密码 .2uqPEfj3D<P’a-3  
但是此时 我们可以看到 我们缺少用户  
这时候只能是使用 enum4linux 去枚举一些可疑的用户了  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240712212604.png)

### [](#0x11 "0x11")0x11

> \*\*\*445 没有共享文件 那么只可能 是一个webmin中的一个 的登陆账号  
> 在20000端口找到了

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240713104407.png)

这里有文件管理但是我写木马上不去 ，之后发现 他既然是个系统管理工具那么他必然就有终端

#### [](#0x20-post "0x20 post")0x20 post

> nc 打一个通道 直接进入

getcap -r /  
可以看到由我们的老熟人 tar命令

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240713105457.png)

tar

[tar of suid](suid.md#tar%20of%20suid)

但是 带cap的 tar只能读取文件不可以直接提权

#### [](#0x30-权限提升 "0x30 权限提升")0x30 权限提升

tar 命令读取 backup 目录下的 密码文件

```shell
tar cvf 1.tar /var/backups/.old_pass.bak之后解压tar xf 1.tar 便可以看到文件
```

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240714102106.png)

得到 root 密码  
拿到权限 下机
