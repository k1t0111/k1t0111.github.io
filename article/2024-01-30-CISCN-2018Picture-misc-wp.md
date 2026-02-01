---
title: "CISCN_2018Picture_misc_wp"
date: "2024-01-30"
description: "@[TOC]"
---

@\[TOC\]

_**CISCN\_2018Picture\_misc\_wp**_

# [](#思路 "思路")思路

## [](#第一关-文件分离 "第一关 文件分离")第一关 文件分离

> 拿到一张图片,看到jpeg 格式文件结尾之后依旧还有数据,猜想可能是隐藏了某些文件  
> 直接拿到binwalk中分析一下  
> ![](https://img2.imgtp.com/2024/01/30/Nn90WIdJ.jpg)  
> 可以看到里面又一个zlib压缩包  
> 直接binwalk -e –run-as=root ‘\[CISCN 2018\]Picture.jpg’  
> 直接得到压缩包的结果

## [](#第二关-编码-文件格式 "第二关 编码&文件格式")第二关 编码&文件格式

> zlib解压之后 S1ADBBQAAQAAADkwl0xs4x98WgAAAE4AAAAEAAAAY29kZePegfAPrkdnhMG2gb86/AHHpS0GMqCrR9s21bP43SqmesL+oQGo50ljz4zIctqxIsTHV25+1mTE7vFc9gl5IUif7f1/rHIpHql7nqKPb+2M6nRLuwhU8mb/w1BLAQI/ABQAAQAAADkwl0xs4x98WgAAAE4AAAAEACQAAAAAAAAAIAAAAAAAAABjb2RlCgAgAAAAAAABABgAAFvDg4Xa0wE8gAmth9rTATyACa2H2tMBUEsFBgAAAAABAAEAVgAAAHwAAADcAFtQeXRob24gMi43XQ0KPj4+IKh9qH2ofQ0KDQpUcmFjZWJhY2sgKG1vc3QgcmVjZW50IGNhbGwgbGFzdCk6DQogIEZpbGUgIjxweXNoZWxsIzA+IiwgbGluZSAxLCBpbiA8bW9kdWxlPg0KICAgIKh9qH2ofQ0KWmVyb0RpdmlzaW9uRXJyb3I6IKh9qH2ofah9qH2ofah9qH2ofah9qH2ofah9qH2ofah9qH2ofah9qH2ofah9qH2ofah9qH2ofah9qH2ofSA8LSBwYXNzd29yZCA7KQ0KPj4+IAA=  
> 之后利用base64 解压  
> ![](https://img2.imgtp.com/2024/01/30/DVGCscaG.jpg)

**PS:** 虽然看着像乱码 但是这种 还是有提示 所以判断应该就是base64

> 查看文件由两部分构成 根据 PK 50 4B 03 04 可以判断是一个zip压缩包和python报?错,将base64解码之后直接导入 到zip文件  
> _**注意 :**_ 不要在在线网站解码后复制进入1.zip中 有不可见字符

_**Python脚本:**_

```python
import base64str1="""S1ADBBQAAQAAADkwl0xs4x98WgAAAE4AAAAEAAAAY29kZePegfAPrkdnhMG2gb86/AHHpS0GMqCrR9s21bP43SqmesL+oQGo50ljz4zIctqxIsTHV25+1mTE7vFc9gl5IUif7f1/rHIpHql7nqKPb+2M6nRLuwhU8mb/w1BLAQI/ABQAAQAAADkwl0xs4x98WgAAAE4AAAAEACQAAAAAAAAAIAAAAAAAAABjb2RlCgAgAAAAAAABABgAAFvDg4Xa0wE8gAmth9rTATyACa2H2tMBUEsFBgAAAAABAAEAVgAAAHwAAADcAFtQeXRob24gMi43XQ0KPj4+IKh9qH2ofQ0KDQpUcmFjZWJhY2sgKG1vc3QgcmVjZW50IGNhbGwgbGFzdCk6DQogIEZpbGUgIjxweXNoZWxsIzA+IiwgbGluZSAxLCBpbiA8bW9kdWxlPg0KICAgIKh9qH2ofQ0KWmVyb0RpdmlzaW9uRXJyb3I6IKh9qH2ofah9qH2ofah9qH2ofah9qH2ofah9qH2ofah9qH2ofah9qH2ofah9qH2ofah9qH2ofah9qH2ofSA8LSBwYXNzd29yZCA7KQ0KPj4+IAA="""str1=base64.b64decode(str1.encode())with open("d:/1.zip","wb") as file:    file.write(str1)
```

> 此时我们发现1.zip可以打开但是无法提取code 回头发现在010中发现KP 反了  
> 第一个KP修改为PK

## [](#第三关-密码 "第三关 密码")第三关 密码

> 1.zip 压缩之后开开是code 需要密码可以看到python报错已经提示:  
> ZeroDivisionError: �}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�} <- password ;) 搜索ZeroDivisionError得到 integer division or modulo by zero就是密码  
> 打开得到G0TE30TY\[,C,X.$%&,C@Y,T5”.#5%0C%”-#,Y04)&1C8Q-S,Q.49\]  
> \`直接uuencode解码

## [](#总结 "总结:")总结:

> 主要是文件格式的问题 以及一些细节要注意
