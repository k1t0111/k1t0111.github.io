---
title: "Rick_pickle"
date: "2024-03-13"
description: "探索者安全团队技术文章仅供参考,未经授权请勿利用文章中的技术资料对任何计算机系统进行入侵操作,由于传播、利用本公众号所提供的技术和信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任,如有侵权烦请告知，我们会立即删除并致歉,创作不易转载请标明出处.感谢!"
---

# [](#阅读须知： "阅读须知：")阅读须知：

> 探索者安全团队技术文章仅供参考,未经授权请勿利用文章中的技术资料对任何计算机系统进行入侵操作,由于传播、利用本公众号所提供的技术和信息而造成的任何直接或者间接的后果及损失，均由使用者  
> 本人负责，作者不为此承担任何责任,如有侵权烦请告知，我们会立即删除并致歉,创作不易转载请标明出处.感谢!

* * *

![](https://img2.imgtp.com/2024/03/03/9YuPkhCM.jpg)

> **今天K1t0带来Pickle Rick**

# [](#0x01-信息收集 "0x01 信息收集")0x01 信息收集

## [](#0x02-tcp端口扫描 "0x02 tcp端口扫描")0x02 tcp端口扫描

> 我直接用了全端口扫描 扫描全部端口 并且扫描操作系统  
> ![](https://img2.imgtp.com/2024/03/13/vLjT3dQO.png)

## [](#0x03-udp端口扫描以及服务版本识别 "0x03 udp端口扫描以及服务版本识别")0x03 udp端口扫描以及服务版本识别

> 这部分不做赘述 还是老套路 -sV…..

## [](#0x04-端口查看 "0x04 端口查看")0x04 端口查看

> 发现主机开放80 22 端口 22端口先放一边 ssh爆破最后的选择  
> 访问 80端口

# [](#1x01-web突破 "1x01 web突破")1x01 web突破

![](https://img2.imgtp.com/2024/03/13/B4DFX8i7.png)

> 好好好Rick急需帮助 **BURRRRRRRRP**这玩意就很奇特  
> 发现它是口头语

## [](#1x02-web信息收集 "1x02 web信息收集")1x02 web信息收集

> 继续找找还是老套路 各种信息识别

```plaintext
Web 服务器Apache HTTP Server 2.4.18操作系统UbuntuJavaScript 库jQuery 3.3.1用户界面（UI）框架Bootstrap 3.4.0
```

> 对味了,扫个目录吧

![](https://img2.imgtp.com/2024/03/14/6fvD0G5n.png)

> 扫完目录之后发现了 一些新东西 但是先等等 我们不放过任何蛛丝马迹  
> 一眼定睛 源代码:
> 
> ```html
> <!--   Note to self, remember username!   Username: R1ckRul3s -->
> ```

## [](#1x03-web利用 "1x03 web利用")1x03 web利用

> 得到一个用户名 才开始猜测可能是ssh的 试了一下发现ssh只能允许私钥连接  
> 回到目录 找找别的资产robots.txt 老目录了 看一眼  
> Wubbalubbadubdub  
> 又是口头禅  
> 看看login.php 需要登陆

![](https://img2.imgtp.com/2024/03/14/pfDtE5Td.png)

> 用户名:R1ckRul3s 密码:Wubbalubbadubdub

## [](#1x04-rce漏洞 "1x04 rce漏洞")1x04 rce漏洞

> 进去之后只有commands 标签有命令执行的功能点:  
> 其他都是禁止访问  
> ls 一下

![](https://img2.imgtp.com/2024/03/14/RKC30Ni0.png)

> 试了一下 cat命令被ban了用tac  
> 读了
> 
> *   denied.php
> *   index.html
> *   login.php
> *   portal.php  
>     其他都没啥用 看看portal

```php
<?phpfunction contains($str, array $arr){    foreach ($arr as $a) {        if (stripos($str, $a) !== false)            return true;    }    return false;}// Cant use cat$cmds = array("cat", "head", "more", "tail", "nano", "vim", "vi");if (isset($_POST["command"])) {    if (contains($_POST["command"], $cmds)) {        echo "</br><p><u>Command disabled</u> to make it hard for future <b>PICKLEEEE RICCCKKKK</b>.</p><img src='assets/fail.gif'>";    } else {        $output = shell_exec($_POST["command"]);        echo "</br><pre>$output</pre>";    }}?><!-- Vm1wR1UxTnRWa2RUV0d4VFlrZFNjRlV3V2t0alJsWnlWbXQwVkUxV1duaFZNakExVkcxS1NHVkliRmhoTVhCb1ZsWmFWMVpWTVVWaGVqQT0== --> 
```

> 这个是显示了ban了什么命令  
> 最后一串多层base64 解出来是 rabbit hole…，没啥用 激动半天

# [](#2x01-flag1 "2x01 flag1")2x01 flag1

> 但是Sup3rS3cretPickl3Ingred.txt 是我们的第一个flag

# [](#3x01-flag2 "3x01 flag2")3x01 flag2

> 除此之外 clue.txt给了剩下两个flag的线索  
> “Look around the file system for the other ingredient” 的翻译可以是 “在文件系统中寻找其他的成分  
> 直接去找/home下或者root下的文件  
> **我是不会告诉你**我用了nc msf等想要打一个通道 方便操作反而浪费了二十分钟的事情，直接找吧………  
> 在/home/rick下找到第二个成分  
> **second ingredients**

# [](#4x01-提权又不像提权 "4x01 提权又不像提权")4x01 提权又不像提权

> 其实第二个盲猜就在 root下  
> 又扯到linux 提权了 直接sudo -l 先看看

```shell
Matching Defaults entries for www-data on ip-10-10-151-49.eu-west-1.compute.internal:    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/binUser www-data may run the following commands on ip-10-10-151-49.eu-west-1.compute.internal:    (ALL) NOPASSWD: ALL
```

> 咳咳 这还提个damn 啊我就是自由的王 任意 遨游 看到all了吗?看到了吗?那是我驰骋江湖的名片啊…..

# [](#5x01-flag3 "5x01 flag3")5x01 flag3

> sudo ls /root  
> ![](https://img2.imgtp.com/2024/03/14/FPF7Lpp2.png)  
> 直接读了sudo tac /root/3rd.txt

# [](#6x01-总结 "6x01 总结")6x01 总结

> 真的很简单没啥说的……….

* * *

### [](#同时感兴趣的小伙伴可以多多关注我们团队哦 "同时感兴趣的小伙伴可以多多关注我们团队哦!!!")同时感兴趣的小伙伴可以多多关注我们团队哦!!!

![](https://img2.imgtp.com/2024/03/12/rj39LDE8.png)
