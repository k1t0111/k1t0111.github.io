---
title: "AD域枚举信息-Microsoft控制台MMC"
date: "2024-09-08"
description: "我们将使用 Microsoft 管理控制台 （MMC） 和远程服务器管理工具 （RSAT） AD 管理单元。如果您使用提供的 Windows VM （THMJMP1），则已为您安装该 VM。但是，如果您使用的是自己的 Windows 计算机，则可以执行以下步骤来安装管理单元："
---

##### [](#Enumeration-through-Microsoft-Management-Console "Enumeration through Microsoft Management Console")Enumeration through Microsoft Management Console

我们将使用 Microsoft 管理控制台 （MMC） 和[远程服务器管理工具](https://docs.microsoft.com/en-us/powershell/module/activedirectory/?view=windowsserver2022-ps) （RSAT） AD 管理单元。如果您使用提供的 Windows VM （THMJMP1），则已为您安装该 VM。但是，如果您使用的是自己的 Windows 计算机，则可以执行以下步骤来安装管理单元：

1.  Press **Start** 按\*\*“开始\*\*”
2.  Search **“Apps & Features”** and press enter  
    搜索\*\*“应用和功能”\*\*，然后按回车键
3.  Click **Manage Optional Features**  
    单击“**管理可选功能**”
4.  Click **Add a feature**  
    单击\*\*“添加功能\*\*”
5.  Search for **“RSAT”**  
    搜索 **“RSAT”**
6.  Select “**RSAT: Active Directory Domain Services and Lightweight Directory Tools”** and click **Install**  
    选择“**RSAT：Active Directory 域服务和轻量级目录工具”**，然后单击“**安装**”

\*只有安装了rsat才可以继续使用MMC  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240907200746.png)  
可以看到不是说逆向安装就能安装的rsat 因此可以看到如果我们拿不到本地管理员的权限我们就无法安装rsat 那么此时我们的 cmdlet 以及 mmc 都是无法使用的。

您可以通过使用 Windows“开始”按钮、搜索“运行”和键入 MMC 来启动 MMC。如果我们只是正常运行 MMC，它将无法工作，因为我们的计算机未加入域，并且我们的本地帐户不能用于对域进行身份验证。

![](https://tryhackme-images.s3.amazonaws.com/user-uploads/6093e17fa004d20049b6933e/room-content/dd93acc5bf807d120eb083d2250e77ef.png)

这就是上一个任务的 Runas 窗口发挥作用的地方。在该窗口中，我们可以启动 MMC，这将确保所有 MMC 网络连接都将使用我们注入的 AD 凭据。  
就相当于说我们使用刚才的[凭证注入](%E5%87%AD%E8%AF%81%E6%B3%A8%E5%85%A5.md)的作用，我们打开mmc时候是以凭据身份通过网络进行验证。我们就可以加入域中就可以使用mmc。

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240818155636.png)  
此时我们使用了mmc进行操作。进入了mmc，开始配置:  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240907195611.png)

1.  Click **File** -> **Add/Remove Snap-in**  
    单击\*\*“文件\*\*”->**“添加/删除管理单元**”
2.  Select and **Add** all three Active Directory Snap-ins  
    选择并**添加**所有三个 Active Directory 管理单元
3.  Click through any errors and warnings  
    点击查看任何错误和警告
4.  Right-click on **Active Directory Domains and Trusts** and select **Change Forest**  
    右键单击\*\*“Active Directory 域和信任关系\*\*”，然后选择“**更改林**”
5.  Enter _za.tryhackme.com_ as the **Root domain** and Click **OK**  
    输入 _za.tryhackme.com_ 作为**根域**，然后单击**确定**
6.  Right-click on **Active Directory Sites and Services** and select **Change Forest**  
    右键单击\*\*“Active Directory 站点和服务”\*\*，然后选择“**更改林**”
7.  Enter _za.tryhackme.com_ as the **Root domain** and Click OK  
    输入 _za.tryhackme.com_ 作为**根域**，然后单击确定
8.  Right-click on **Active Directory Users and Computers** and select **Change Domain**  
    右键单击\*\*“Active Directory 用户和计算机\*\*”，然后选择\*\*“更改域”\*\*
9.  Enter _za.tryhackme.com_ as the **Domain** and Click **OK**  
    输入 _za.tryhackme.com_ 作为**域**，然后单击**确定**
10.  Right-click on **Active Directory Users and Computers** in the left-hand pane  
     右键单击左侧窗格中的\*\*“Active Directory 用户和计算机\*\*”
11.  Click on **View** -> **Advanced Features**  
     点击查看 -> 高级功能

如果到目前为止一切正常，则现在应指向目标域，并针对目标域进行身份验证：现在，我们可以在此处开始列举有关 AD 结构的信息。

#### [](#Users-and-Computers-用户和计算机 "Users and Computers 用户和计算机")Users and Computers 用户和计算机

让我们看一下 Active Directory 结构。对于此任务，我们将重点关注 AD 用户和计算机。展开该管理单元并展开 za 域以查看初始组织单元 （OU） 结构：

![MMC AD Snap-in](https://tryhackme-images.s3.amazonaws.com/user-uploads/6093e17fa004d20049b6933e/room-content/a5fc9efbd6a77ee9ea72a25d7ba13240.png)

让我们看一下 People 目录。在这里，我们看到用户是按照部门 OU 划分的。单击这些 OU 中的每一个都将显示属于该部门的用户。

![MMC AD Snap-in](https://tryhackme-images.s3.amazonaws.com/user-uploads/6093e17fa004d20049b6933e/room-content/993c161b6d86d61bf5ecc31a0ce0fa54.png)

单击这些用户中的任何一个都将允许我们查看他们的所有属性和属性。我们还可以看到他们属于哪些组：

![MMC AD Snap-in](https://tryhackme-images.s3.amazonaws.com/user-uploads/6093e17fa004d20049b6933e/room-content/659127fd61749667192a19e0fb71ad55.png)

我们还可以使用 MMC 在环境中查找主机。如果我们单击“服务器”或“工作站”，将显示已加入域的计算机列表。

![MMC AD Snap-in](https://tryhackme-images.s3.amazonaws.com/user-uploads/6093e17fa004d20049b6933e/room-content/9e353f21616effb4a9cca2f3e86e65ad.png)

如果我们有相关的权限，我们也可以使用MMC直接对AD进行更改，例如更改用户的密码或向特定组添加帐户。尝试使用 MMC 以更好地了解 AD 域结构。利用搜索功能查找对象。

Benefits 好处

\-  
GUI 提供了一种出色的方法来全面了解 AD 环境。

\-  
可以对不同的AD对象进行快速搜索。

*   它提供了一种直接的方法来查看 AD 对象的特定更新。
*   如果我们有足够的权限，我们可以直接更新现有的 AD 对象或添加新的 AD 对象。

Drawbacks 缺点

\-  
GUI 需要对执行它的计算机进行 RDP 访问。

\-  
尽管搜索对象的速度很快，但无法收集 AD 范围的属性或属性。

所以MMC的方式前提是我们能拿到rdp的gui界面才可以。
