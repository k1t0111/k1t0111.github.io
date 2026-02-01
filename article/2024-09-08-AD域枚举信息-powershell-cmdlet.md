---
title: "AD域枚举信息-powershell-cmdlet"
date: "2024-09-08"
description: "安装 Active Directory 远程管理工具（AD-RSAT，Active Directory Remote Server Administration Tools）后，系统会自动安装一组用于管理 Active Directory 的 PowerShell cmdlet。这些 cmdlet "
---

安装 Active Directory 远程管理工具（AD-RSAT，Active Directory Remote Server Administration Tools）后，系统会自动安装一组用于管理 Active Directory 的 PowerShell cmdlet。这些 cmdlet 允许你通过 PowerShell 执行各种 Active Directory 相关的管理任务，如用户和计算机管理、组策略、域控制器等。

### [](#常见的-AD-RSAT-cmdlet "常见的 AD-RSAT cmdlet")常见的 AD-RSAT cmdlet

以下是一些常见的 AD-RSAT cmdlet，通常会在安装了这些工具后可用：

1.  **用户和计算机管理**:
    
    *   `Get-ADUser`：获取 Active Directory 用户的详细信息。
    *   `Set-ADUser`：修改 Active Directory 用户的属性。
    *   `New-ADUser`：创建新的 Active Directory 用户。
    *   `Remove-ADUser`：删除 Active Directory 用户。
    *   `Get-ADComputer`：获取 Active Directory 计算机的详细信息。
    *   `Set-ADComputer`：修改 Active Directory 计算机的属性。
    *   `New-ADComputer`：创建新的 Active Directory 计算机。
    *   `Remove-ADComputer`：删除 Active Directory 计算机。
2.  **组管理**:
    
    *   `Get-ADGroup`：获取 Active Directory 组的详细信息。
    *   `Set-ADGroup`：修改 Active Directory 组的属性。
    *   `New-ADGroup`：创建新的 Active Directory 组。
    *   `Remove-ADGroup`：删除 Active Directory 组。
3.  **域控制器和域管理**:
    
    *   `Get-ADDomainController`：获取域控制器的详细信息。
    *   `Get-ADDomain`：获取 Active Directory 域的详细信息。
4.  **组策略**:
    
    *   `Get-GPO`：获取组策略对象的信息。
    *   `New-GPO`：创建新的组策略对象。
    *   `Set-GPO`：修改组策略对象的设置。
    *   `Remove-GPO`：删除组策略对象。
5.  **组织单位 (OU) 管理**:
    
    *   `Get-ADOrganizationalUnit`：获取 Active Directory 组织单位的详细信息。
    *   `New-ADOrganizationalUnit`：创建新的 Active Directory 组织单位。
    *   `Remove-ADOrganizationalUnit`：删除 Active Directory 组织单位。

### [](#如何确认安装的-cmdlet "如何确认安装的 cmdlet")如何确认安装的 cmdlet

要查看安装的 AD-RSAT cmdlet，你可以在 PowerShell 中运行以下命令：

```powershell
Get-Command -Module ActiveDirectory
```

这个命令会列出所有来自 `ActiveDirectory` 模块的 cmdlet。如果你发现没有安装某些 cmdlet，可能需要确认 RSAT 工具是否正确安装或是否需要更新。

### [](#安装和启用-AD-RSAT "安装和启用 AD-RSAT")安装和启用 AD-RSAT

在 Windows 10 及更高版本中，可以通过以下步骤安装和启用 AD-RSAT 工具：

1.  **打开设置**: 进入 `设置` > `应用` > `可选功能`。
2.  **添加功能**: 点击 `添加功能`，然后搜索 `RSAT`。
3.  **安装所需组件**: 勾选相关的 RSAT 组件（如 Active Directory 域服务和 Lightweight Directory Tools），然后点击 `安装`。

PowerShell 是命令提示符的升级版。Microsoft 于 2006 年首次发布。虽然 PowerShell 具有命令提示符提供的所有标准功能，但它也提供对 cmdlet（发音为 command-lets）的访问，这些 cmdlet 是用于执行特定功能的 .NET 类。虽然我们可以像 [PowerView](https://github.com/PowerShellEmpire/PowerTools/tree/master/PowerView) 的创建者那样编写自己的 cmdlet，但我们已经可以使用内置的 cmdlet 走得很远。

由于我们在任务 3 中安装了 AD-RSAT 工具，因此它会自动为我们安装关联的 cmdlet。已安装 50+ 个 cmdlet。我们将查看其中的一些，但请参阅 [此列表以获取 cmdlet 的完整列表。](https://docs.microsoft.com/en-us/powershell/module/activedirectory/?view=windowsserver2022-ps)

\*\*由于剧情模拟需要我们今天需要模拟我们已经拿到了一个服务器的权限。

```shell
ssh za.tryhackme.com\\<AD Username>@thmjmp1.za.tryhackme.com
```

###### [](#验证cmdlet "验证cmdlet")验证cmdlet

[如何确认安装的 cmdlet](powershelll%E6%9E%9A%E4%B8%BE.md#%E5%A6%82%E4%BD%95%E7%A1%AE%E8%AE%A4%E5%AE%89%E8%A3%85%E7%9A%84%20cmdlet)  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240830201932.png)

可以看到根据结果我们已经找到相关的cmdlet证明我们此时这台服务器上已经安装了一个rsat 之后就带上了cmdlet

##### [](#Users-用户 "Users 用户")Users 用户

我们可以使用`Get-ADUser` cmdlet 来枚举AD用户：

```powershell
Get-ADUser -Identity beth.nolan -Server za.tryhackme.com -Properties *
```

这是一个 PowerShell 命令，用于从 Active Directory 中获取用户信息。`-Identity` 用于指定用户，`-Server` 指定域控制器，`-Properties *` 表示获取所有属性  
这些参数用于以下用途：

*   \-Identity  
    \-Identity - 我们正在枚举的帐户名
*   \-Properties
    *   属性 - 将显示与帐户关联的哪些属性，\* 将显示所有属性
*   \-Server  
    \-Server - 由于我们没有加入域，因此我们必须使用此参数将其指向我们的域控制器  
    ![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240830202852.png)

对于大多数这些 cmdlet，我们还可以使用`-Filter`参数来对枚举进行更多控制，并使用`Format-Table` cmdlet 整齐地显示结果，如下所示：

```powershell
Get-ADUser -Filter 'Name -like "*stevens"' -Server za.tryhackme.com | Format-Table Name,SamAccountName -A
```

*   **`Get-ADUser -Filter 'Name -like "*stevens"' -Server za.tryhackme.com`**:
    
    *   `Get-ADUser`：获取用户账户的 cmdlet。
    *   `-Filter 'Name -like "*stevens"'`：使用筛选器来查找名称中包含 “stevens” 的用户。`*` 是通配符，表示在 “stevens” 前面可以有任何字符。
    *   `-Server za.tryhackme.com`：指定 Active Directory 服务器（在这里是 `za.tryhackme.com`）来执行查询。
*   **`| Format-Table Name,SamAccountName -A`**:
    
    *   `|`：管道符号，用于将前面的命令结果传递给下一个命令。
    *   `Format-Table`：将结果格式化为表格形式。
    *   `Name,SamAccountName`：指定要在表格中显示的属性，`Name` 是用户的全名，`SamAccountName` 是用户的登录名（SAM 帐户名）。
    *   `-A`（或 `-AutoSize`）：自动调整列宽，以便更好地显示数据。

##### [](#Groups-团体 "Groups 团体")Groups 团体

我们可以使用`Get-ADGroup` cmdlet 来枚举AD组：

```powershell
Get-ADGroup -Identity Administrators -Server za.tryhackme.com -Properties *
```

还可以使用`Get-ADGroupMember` cmdlet 枚举组成员身份：

```powershell
Get-ADGroupMember -Identity Administrators -Server za.tryhackme.com -Properties *
```

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240830203845.png)

##### [](#AD-Objects "AD Objects")AD Objects

可以使用`Get-ADObject` cmdlet 对任何AD对象执行更通用的搜索。例如，如果我们正在查找在特定日期之后更改的所有AD对象：

```powershell
$ChangeDate = New-Object DateTime(2022, 02, 28, 12, 00, 00)Get-ADObject -Filter 'whenChanged -gt $ChangeDate' -includeDeletedObjects -Server za.tryhackme.com
```

*   **`-Filter 'whenChanged -gt $ChangeDate'`**：过滤器，用于找到 `whenChanged` 属性（最后修改时间）晚于 `$ChangeDate` 的对象。
*   **`-includeDeletedObjects`**：包括已删除的对象在内。
*   **`-Server za.tryhackme.com`**：指定 Active Directory 服务器。

因此在我看来这个AD这个对象的更改的查看更像是一个相关的一个所有域中的更改状态，就是这些组或者账户或者计算机什么时候被做了什么操作。  
但是我们可以看到我们都是用filter 进行了过滤。 都是根据据get-adobject 这条命令之后得到的相关属性的某一个特性进行独特的过滤。  
\*\*\*例如，如果我们想在不锁定帐户的情况下执行密码喷射攻击，我们可以使用它来枚举 badPwdCount 大于 0 的帐户，以避免这些帐户参与我们的攻击：

因为`badPwdCount` 是 Active Directory 用户对象的一个属性，表示用户帐户尝试登录时输入错误密码的次数。如果达到或超过设定的阈值，帐户可能会被锁定。记录的是输入错误的次数。

```powershell
Get-ADObject -Filter 'badPwdCount -gt 0' -Server za.tryhackme.com 
```

找到相关输入次数的账户将其排除我们的密码喷射的范围账户之内.

##### [](#Domains-域名 "Domains 域名")Domains 域名

我们可以使用`Get-ADDomain`来检索有关特定域的附加信息：

```powershell
Get-ADDomain -Server za.tryhackme.com
```

##### [](#更改AD对象 "更改AD对象")更改AD对象

AD -RSAT cmdlet 的优点在于，有些 cmdlet 甚至允许您创建新的或更改现有的AD对象。然而，我们对该网络的关注点是枚举。创建新对象或更改现有对象将被视为AD开发，稍后将在AD模块中介绍。  
但是，我们将通过使用`Set-ADAccountPassword` cmdlet 强制更改AD用户的密码来展示此示例：  
相当于我感觉就是使用命令行去进去对于ad的一些更改工作,直接去修改内网相关配置权限.

这个 PowerShell 命令用于在 Active Directory 中更改用户 `gordon.stevens` 的密码。详细解释如下：

```powershell
Set-ADAccountPassword -Identity gordon.stevens -Server za.tryhackme.com -OldPassword (ConvertTo-SecureString -AsPlaintext "old" -force) -NewPassword (ConvertTo-SecureString -AsPlainText "new" -Force)
```

*   **`Set-ADAccountPassword`**：用于更改用户账户密码的 cmdlet。
*   **`-Identity gordon.stevens`**：指定要更改密码的用户账户（在这里是 `gordon.stevens`）。
*   **`-Server za.tryhackme.com`**：指定 Active Directory 服务器来执行操作。
*   **`-OldPassword (ConvertTo-SecureString -AsPlaintext "old" -Force)`**：指定当前的旧密码。`ConvertTo-SecureString` 将密码字符串 `"old"` 转换为安全字符串格式，`-Force` 允许将明文密码转换为安全字符串。
*   **`-NewPassword (ConvertTo-SecureString -AsPlainText "new" -Force)`**：指定新密码。类似地，将 `"new"` 转换为安全字符串格式。

此命令会将用户 `gordon.stevens` 的密码从 `"old"` 更改为 `"new"`，通过指定的 Active Directory 服务器来执行这一操作。

\*\*Benefits 好处

\-  
PowerShell cmdlet 可以枚举比命令提示符中的 net 命令更多的信息。

*   我们可以指定服务器和域来使用未加入域的计算机上的 runas 执行这些命令。
*   我们可以创建自己的 cmdlet 来枚举特定信息。
*   我们可以使用AD -RSAT cmdlet 直接更改AD对象，例如重置密码或将用户添加到特定组。

\*\*Drawbacks 缺点

\-  
与命令提示符相比，蓝队通常更多地监控PowerShell 。

\-  
我们必须安装 AD-RSAT 工具或使用其他可能可检测的脚本进行PowerShell枚举。
