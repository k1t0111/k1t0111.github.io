---
title: "vulnhub-vegeta"
date: "2024-02-01"
description: "@[TOC]"
---

@\[TOC\]

![](https://img2.imgtp.com/2024/03/06/V1HMZa8d.jpg)

# [](#阅读须知： "阅读须知：")阅读须知：

```
探索者安全团队技术文章仅供参考,未经授权请勿利用文章中的技术资料对任何计算机系统进行入侵操作,由于传播、利用本公众号所提供的技术和信息而造成的任何直接或者间接的后果及损失，均由使用者
本人负责，公众号及作者不为此承担任何责任,如有侵权烦请告知，我们会立即删除并致歉,创作不易转载请标明出处.感谢!
```

**vulnhub** -_vegeta 靶机_

> *   攻击机kali
> *   受害机 vulnhub靶场 vegeta机器

## [](#主机发现 "主机发现")主机发现

> 利用kali 自带 arp-scan 扫描网段
> 
> 获得受害机器ip 192.168.49.134

## [](#主机信息收集 "主机信息收集")主机信息收集

先用masscan 扫描开放端口 再利用nmap 做端口信息的进一步收集  
![在这里插入图片描述](https://img2.imgtp.com/2024/01/22/z9XjEXEe.jpg)

> **masscan探测到靶机有两个端口 22 端口 80端口 对靶机端口进行进一步的详细信息收集**

![在这里插入图片描述](https://img2.imgtp.com/2024/01/22/zGZ7TXee.jpg)

> 扫描到端口具体信息 访问80端口服务

## [](#web目录探测 "web目录探测")web目录探测

![在这里插入图片描述](https://img2.imgtp.com/2024/01/22/kxmp25uK.jpg)

> dirserch工具扫描网站目录  
> 扫描了很多目录 依次访问寻找突破点

![在这里插入图片描述](https://img2.imgtp.com/2024/01/22/3tvB1WC0.jpg)

> 发现有robots.txt泄露访问一下 看到一个/find\_me下的目录

![在这里插入图片描述](https://img2.imgtp.com/2024/01/22/EJGPwv9E.jpg)

> 访问find\_me.html 源代码 起初很正常但是仔细往后看一直下拉才会发现惊喜!!!  
> 这个就告诉我们不要放过每一个细节  
> 要看仔细  
> 源代码一直往下拉可以看到一串字符串

aVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1nQUFBRElDQVlBQUFDdFdLNmVBQUFIaGtsRVFWUjRuTzJad1k0c09RZ0U1LzkvK3UyMU5TdTdCd3JTaVN0QzhoR2M0SXBMOTg4L0FGanljem9BZ0RNSUFyQUJRUUEySUFqQUJnUUIySUFnQUJzUUJHQURnZ0JzUUJDQURRZ0NzQUZCQURhRUJmbjUrUmwvbk9aTFAxeER6K3g5VTA1cWJoWjFkcjRzSFQyejkwMDVxYmxaMU5uNXNuVDB6TjQzNWFUbVpsRm41OHZTMFRONzM1U1RtcHRGblowdlMwZlA3SDFUVG1wdUZuVjJ2aXdkUGJQM1RUbXB1Vm5VMmZteWRQVE0zamZscE9hdVhKUVRUamxkSHZ0YmxvNDZOUWp5UjV4eUlvZ09CUGtqVGprUlJBZUMvQkdubkFpaUEwSCtpRk5PQk5HQklIL0VLU2VDNkVDUVArS1VFMEYwakJWRS9aSGM4SEhkUHZ1RWQwZVF3N003MWFtelRIaDNCRGs4dTFPZE9zdUVkMGVRdzdNNzFhbXpUSGgzQkRrOHUxT2RPc3VFZDBlUXc3TTcxYW16VEhoM0JEazh1MU9kT3N1RWQwZVFJcWJNNENUcmhKMGhTQkZUWmtDUUdBaFN4SlFaRUNRR2doUXhaUVlFaVlFZ1JVeVpBVUZpSUVnUlUyWkFrQmdJVXNTVUdSQWtCb0lVMFRHZjAxN2UrdTRJVXNScEtSRGtXYzVsdjNEQlN4ZjFqZE5TSU1pem5NdCs0WUtYTHVvYnA2VkFrR2M1bC8zQ0JTOWQxRGRPUzRFZ3ozSXUrNFVMWHJxb2I1eVdBa0dlNVZ6MkN4ZThkRkhmT0MwRmdqekx1ZXdYTGhCL2VGazZjcm84Mm9rc2IzMTNCQkgwdkNITFc5OGRRUVE5YjhqeTFuZEhFRUhQRzdLODlkMFJSTkR6aGl4dmZYY0VFZlM4SWN0YjN4MUJCRDF2eVBMV2R5OFZaTXJwV1BDYjY2YWNEQWdTbUkrNjJTY0RnZ1RtbzI3MnlZQWdnZm1vbTMweUlFaGdQdXBtbnd3SUVwaVB1dGtuQTRJRTVxTnU5c25nOVNPMkFjcmxQN212SXd2OEg3YjVDd1NCVDlqbUx4QUVQbUdidjBBUStJUnQvZ0pCNEJPMitRc0VnVS9ZNWk4UUJENlIvUS9pMURPTFU4OHBkV3FxY3lKSTBlenFubFBxMUNBSWdveXFVNE1nQ0RLcVRnMkNJTWlvT2pVSWdpQ2o2dFFnQ0lLTXFsTnpYQkExYnhZeWk5TU1UbStVeWwvZXNSZ0VpZU0wZzlNYnBmS1hkeXdHUWVJNHplRDBScW44NVIyTFFaQTRUak00dlZFcWYzbkhZaEFranRNTVRtK1V5bC9lc1JnRWllTTBnOU1icGZLWGR5d0dRZUk0emVEMFJxbjhwYzJTUTcxWkFxZlpwd2pTVWJmc2w2cEtoRU1RajV3SUVzeWZxa3FFUXhDUG5BZ1N6SitxU29SREVJK2NDQkxNbjZwS2hFTVFqNXdJRXN5ZnFrcUVReENQbkFnU3pKK3FTb1JERUkrY0NCTE1uNm9xRHVleWpLNmVhcHdFNmNpWjdabkttS29xRHVleWpLNmVhaEFFUVI3VnFYdXFRUkFFZVZTbjdxa0dRUkRrVVoyNnB4b0VRWkJIZGVxZWFoQUVRUjdWcVh1cVFaQ0JncWcvNWpmZjEvRngzUzdXOHE2cHdia1BRUkNFK3hDa01HZnFycW5CdVE5QkVJVDdFS1F3WitxdXFjRzVEMEVRaFBzUXBEQm42cTdLY0ZtY0hzYnBvM1RLMlpGbEFnaHlPQXVDZUlNZ2g3TWdpRGNJY2pnTGduaURJSWV6SUlnM0NISTRDNEo0Z3lDSHN5Q0lONldDM1A0d1RvL3RKTEo2TDhvc0NGSjBueG9FUVpDMkxCMzNxVUVRQkduTDBuR2ZHZ1JCa0xZc0hmZXBRUkFFYWN2U2NaOGFCRUdRdGl3ZDk2bEJrSUdDZE5TcGUyYnZVMzk0Nm5mb3lPazAzN0pmdU1Ba2VGZlA3SDFPSDE3MlBuVk9wL21XL2NJRkpzRzdlbWJ2Yy9yd3N2ZXBjenJOdCt3WExqQUozdFV6ZTUvVGg1ZTlUNTNUYWI1bHYzQ0JTZkN1bnRuN25ENjg3SDNxbkU3ekxmdUZDMHlDZC9YTTN1ZjA0V1h2VStkMG1tL1pMMXhnRXJ5clovWStwdzh2ZTU4NnA5Tjh5MzdoQXZHSGZzUHlPN0pNMmFkNlp3aGkrbWdkODkyd1R3UzU3RUU3WmtjUUJMbm1RVHRtUnhBRXVlWkJPMlpIRUFTNTVrRTdaa2NRQkxubVFUdG1SNUFYQ1hJNzZnKzJBN1dRSFZrNnhFcmxUMVZkRElKNFpFRVFVeERFSXd1Q21JSWdIbGtReEJRRThjaUNJS1lnaUVjV0JERUZRVHl5akJXa1kyRDFjV0xLQitUeXdYNERRUkFFUVlUM0ljaGhFS1FXQkVFUUJCSGVoeUNIUVpCYUVBUkJFRVI0SDRJY0JrRnFzUmJFaVk2Y04zek1UaCtzK28xUy9VNEg2QUpCRUFSQk5pQUlnaURJQmdSQkVBVFpnQ0FJZ2lBYkVBUkJFR1FEZ2lESUtFRnUrTGc2NW5QSzRuVFV1MTdlRlM0d2VqUjF6bzc1bkxJNEhmV3VsM2VGQzR3ZVRaMnpZejZuTEU1SHZldmxYZUVDbzBkVDUreVl6eW1MMDFIdmVubFh1TURvMGRRNU8rWnp5dUowMUx0ZTNoVXVNSG8wZGM2TytaeXlPQjMxcnBkM2hRdU1IazJkczJNK3B5eE9SNzNyNVYzaEFxTkhVK2QwMnN1VUxOTnpJb2h4M1ExWnB1ZEVFT082RzdKTXo0a2d4blUzWkptZUUwR002MjdJTWowbmdoalgzWkJsZWs0RU1hNjdJY3YwbkFoU3hKUVoxRDJuZkMvTEhKWExjQm9ZUVR4NlR2bGVsamtxbCtFME1JSjQ5Snp5dlN4elZDN0RhV0FFOGVnNTVYdFo1cWhjaHRQQUNPTFJjOHIzc3N4UnVReW5nUkhFbytlVTcyV1pvM0laVGdNamlFZlBLZC9MTWtmbE1weVk4bEVxSC9zSlRoODZnaFNBSUxVZ1NQT2kxQ0JJTFFqU3ZDZzFDRklMZ2pRdlNnMkMxSUlnell0U2d5QzFJRWp6b3RRZ1NDMElVckNvS1NjN245TmVzcHplZmNVTTJmbFMvU29EVERrZEMzYWF3U2tuZ2d3OEhRdDJtc0VwSjRJTVBCMExkcHJCS1NlQ0REd2RDM2Fhd1NrbmdndzhIUXQybXNFcEo0SU1QQjBMZHByQktlZnJCQUY0RXdnQ3NBRkJBRFlnQ01BR0JBSFlnQ0FBR3hBRVlBT0NBR3hBRUlBTkNBS3dBVUVBTmlBSXdBWUVBZGp3SHlVRnd2VnIwS3ZGQUFBQUFFbEZUa1N1UW1DQw==

> 感觉像是base64 在线[烹饪一下](https://cyberchef.org/)  
> 果然两次base64 然后得到二维码  
> 这个地方想请教各位大佬怎么自己解码可以得到二维码. 我是直接自己在烹饪时候他自动识别二维码得到了一个密码,但是两次base我没办法得到二维码。

![在这里插入图片描述](https://img2.imgtp.com/2024/01/22/Rvr3A6X0.jpg)

> 怀疑可能是ssh的密码但是不知道用户名试了很多都不对  
> 线索断了 ，没事继续信息收集

## [](#继续识别 "继续识别")继续识别

> 这回咱们用个大字典扫描目录  
> **建议可以装一个seclists 字典**  
> ![在这里插入图片描述](https://img2.imgtp.com/2024/01/22/D6S9mt6Y.jpg)
> 
> > 发现一个新目录 访问是一个音频 摩斯电码  
> > 好好好 ctf 是吧……  
> > misc 杂项隐写 音频直接

[在线音频识别](https://morsecode.world/international/decoder/audio-decoder-expert.html)

_识别到密码和账号 U S E R : T R U N K S P A S S W G R D : U S 3 R ( S I N D O L L A R S S Y M B O L )_

> _**注意**_: s改成$ 括号内的提示

## [](#提权 "提权")提权

> ssh 连接 靶机  
> ssh $[trunks@192.168.49.134](mailto:trunks@192.168.49.134)  
> ![在这里插入图片描述](https://img2.imgtp.com/2024/01/22/NK6mG2z8.jpg)

> 访问passwd 文件 发现其属于我们登陆的用户那么就可以用passwd提权  
> 用openssl 生成密码 将新用户写入passwd文件 提权  
> ![在这里插入图片描述](https://img2.imgtp.com/2024/01/22/AAZrAYqH.jpg)  
> ![在这里插入图片描述](https://img2.imgtp.com/2024/01/22/Iq4gGSD2.jpg)

## [](#总结 "总结")总结

> 本次vulhub 靶场的 vegeta靶机相对来说还是比较简单的,其实还是很有ctf的风格的,主要就是一个web的脑洞寻找细节以及misc题目的音频隐写的学习,  
> 最后就是ssh简单连接和passwd提权，对于新手还是很推荐来练练手的
