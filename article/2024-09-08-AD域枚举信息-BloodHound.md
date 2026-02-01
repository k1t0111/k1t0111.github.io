---
title: "AD域枚举信息-BloodHound"
date: "2024-09-08"
description: "最后，我们将研究使用Bloodhound执行 AD 枚举。 Bloodhound 是迄今为止最强大的AD枚举工具，当它于 2016 年发布时，它永远改变了AD枚举格局。"
---

最后，我们将研究使用[Bloodhound](https://github.com/BloodHoundAD/BloodHound)执行 AD 枚举。 Bloodhound 是迄今为止最强大的AD枚举工具，当它于 2016 年发布时，它永远改变了AD枚举格局。

#### [](#Bloodhound-History-寻血猎犬的历史 "Bloodhound History 寻血猎犬的历史")Bloodhound History 寻血猎犬的历史

在相当长的一段时间内，红队队员（不幸的是，攻击者）占据了上风。以至于微软在其高级威胁防护解决方案中集成了他们自己版本的 Bloodhound。这一切都归结为以下这句话：

_“防御者用列表思考，攻击者用图表思考。” - 未知_

Bloodhound 允许攻击者（现在也包括防御者）通过互连节点以图形格式可视化AD环境。每个连接都是一条可能的路径，可用于实现目标。相比之下，防御者使用列表，例如域管理员列表或环境中所有主机的列表。  
这种基于图的思维为攻击者打开了一个世界。它允许进行两阶段攻击。在第一阶段，攻击者会执行网络钓鱼攻击以获得枚举AD信息的初始条目。这个初始有效负载通常非常嘈杂，并且会在攻击者执行除泄露枚举数据之外的任何操作之前被蓝队检测到并包含在内。然而，攻击者现在可以离线使用这些数据以图形格式创建攻击路径，准确显示所需的步骤和跳跃。在第二次网络钓鱼活动中利用这些信息，攻击者通常可以在突破后几分钟内达到他们的目标。它通常比蓝队收到第一个警报的速度还要快。这就是图表思维的力量，这就是为什么这么多蓝队也开始使用这些类型的工具来更好地了解他们的安全态势。

#### [](#Sharphound-猎犬 "Sharphound 猎犬")Sharphound 猎犬

您经常会听到用户将 Sharphound 和 Bloodhound 互换使用。然而，它们并不相同。 Sharphound是Bloodhound的枚举工具。它用于枚举 AD 信息，然后可以在 Bloodhound 中直观地显示这些信息。 Bloodhound 是用于显示AD攻击图的实际GUI 。因此，我们首先需要学习如何使用Sharphound来枚举AD ，然后才能使用Bloodhound直观地看到结果。

\*\*共有三种不同的 Sharphound

**Sharphound.ps1** - 用于运行 Sharphound 的PowerShell脚本。不过，最新版本的 Sharphound 已经停止发布 Powershell 脚本版本。该版本非常适合与 RAT 一起使用，因为脚本可以直接加载到内存中，从而逃避磁盘上的AV扫描。  
_解释一下AV扫描_ 防病毒软件是一个程序或一组程序，旨在防止、搜索、检测和删除软件病毒以及其他恶意软件（如蠕虫、木马、广告软件等）。

**Sharphound.exe** - 用于运行 Sharphound 的 Windows 可执行版本。

**AzureHound.ps1** - 用于运行 Sharphound for Azure（Microsoft 云计算服务）实例的PowerShell脚本。 Bloodhound 可以提取从 Azure 枚举的数据，以查找与 Azure 身份和访问管理配置相关的攻击路径。

_注意：您的 Bloodhound 和 Sharphound 版本必须匹配才能获得最佳结果。通常会对 Bloodhound 进行更新，这意味着旧的 Sharphound 结果无法被摄取。该网络是使用 Bloodhound v4.1.0 创建的。请确保将此版本与 Sharphound 结果一起使用。_

在评估中使用这些收集器脚本时，这些文件很可能被检测为恶意软件并向蓝队发出警报。这又是我们未加入域的 Windows 计算机可以提供帮助的地方。我们可以使用`runas`命令注入 AD 凭据并将 Sharphound 指向域控制器。由于我们控制这台 Windows 计算机，因此我们可以禁用AV或为特定文件或文件夹创建例外，这已在 THMJMP1 计算机上为您执行。您可以在该主机上的`C:\Tools\`目录中找到 Sharphound 二进制文件。我们将使用 SharpHound.exe 版本进行枚举，但也可以随意使用其他两个版本。我们将执行 Sharphound，如下所示：

因此可以看到想要使用猎狗 这个自动化AD工具我们可能还必须要找一个非域的机器,否则就会被杀掉或者是域发生警告.

```powershell
Sharphound.exe --CollectionMethods <Methods> --Domain za.tryhackme.com --ExcludeDCs
```

\*\*\*相关参数解释:

*   CollectionMethods - 确定 Sharphound 将收集哪种数据。最常见的选项是“默认”或“全部”。另外，由于 Sharphound 会缓存信息，因此一旦第一次运行完成，您只能使用 Session 收集方法来检索新的用户会话以加快该过程。
*   域 - 在这里，我们指定要枚举的域。在某些情况下，您可能想要枚举与您的现有域信任的父域或其他域。您可以通过更改此参数来告诉 Sharphound 应枚举​​哪个域。
*   ExcludeDCs - 这将指示 Sharphound 不要接触域控制器，从而降低 Sharphound 运行引发警报的可能性。

相关所有参数:[https://bloodhound.readthedocs.io/en/latest/data-collection/sharphound-all-flags.html](https://bloodhound.readthedocs.io/en/latest/data-collection/sharphound-all-flags.html)

[猎狗](%E7%8C%8E%E7%8B%97.md)

使用上一个任务中的 SSH PowerShell 会话，将 Sharphound 二进制文件复制到 AD 用户的文档目录，当然我不知道是不是必须把这个放到用户目录文档中，才能体现使用的相关域用户名义去运行。

```powershell
PS C:\> copy C:\Tools\Sharphound.exe ~\Documents\ PS C:\> cd ~\Documents\ PS C:\Users\gordon.stevens\Documents>
```

现在是一切都准备好了，虽然目前我们的服务器已经加入到了域中，但是此时我们使用的猎狗脚本。并未触发报警。我们直接使用 我们将使用 All 和 Session 收集方法运行 Sharphound：

```powershell
SharpHound.exe --CollectionMethods All --Domain za.tryhackme.com --ExcludeDCs
```

Sharphound 执行枚举大约需要 1 分钟。在较大的组织中，第一次执行可能需要更长的时间，甚至几个小时。完成后，您将在执行 Sharphound 的同一文件夹中获得一个带时间戳的 ZIP 文件。

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240831103147.png)  
我们现在可以使用 Bloodhound 提取此 ZIP，以直观地向我们展示攻击路径。这就是我们最开始提到的一种思想，图表的思想，我们使用猎狗去嗅探之后使用blood进行一个相关的信息的展示之后显示攻击路径。

#### [](#Bloodhound-寻血猎犬 "Bloodhound 寻血猎犬")Bloodhound 寻血猎犬

如前所述，Bloodhound 是一个 GUI，允许我们导入 Sharphound 捕获的数据并将其可视化到攻击路径中。 Bloodhound 使用 Neo4j 作为其后端数据库和图形系统。 Neo4j 是一个图形数据库管理系统。如果您使用 AttackBox，则可以使用 Dock 中的红色 Bloodhound 图标来启动它。在所有其他情况下，请确保您的攻击计算机上安装并配置了 Bloodhound 和 neo4j。无论哪种方式，了解后台发生的事情都是有好处的。在启动 Bloodhound 之前，我们需要加载 Neo4j：

```shell
neo4j console
```

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240831110258.png)  
此时已经启动数据库管理工具  
在另一个终端选项卡中，运行`bloodhound --no-sandbox` 。这将向您显示身份验证GUI ：  
![](https://tryhackme-images.s3.amazonaws.com/user-uploads/6093e17fa004d20049b6933e/room-content/39f261aecedccbaf118eb2ee69d55129.png)

neo4j 数据库的默认凭据为`neo4j:neo4j` 。使用它在 Bloodhound 中进行身份验证。要导入我们的结果，您需要从 Windows 主机恢复 ZIP 文件。最简单的方法是在 AttackBox 上使用 SCP 命令：

```shell
scp grace.brooks@THMJMP1.za.tryhackme.com:c:/Tools/20240831083709_BloodHound.zip .
```

一旦您提供密码，这会将结果复制到您当前的工作目录。将 ZIP 文件拖放到 Bloodhound GUI上以导入 Bloodhound。它将显示正在提取文件并启动导入。导入所有JSON文件后，我们可以开始使用 Bloodhound 枚举该特定域的攻击路径。

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240831110537.png)

#### [](#Attack-Paths-攻击路径 "Attack Paths 攻击路径")Attack Paths 攻击路径

Bloodhound 可以显示多种攻击路径。按“搜索节点”旁边的三个条纹将显示选项。第一个选项卡向我们显示有关当前进口的信息

![](https://tryhackme-images.s3.amazonaws.com/user-uploads/6093e17fa004d20049b6933e/room-content/5d695d25afebc2b1dfc7cb408704e755.png)  
Bloodhound 可以显示多种攻击路径。按“搜索节点”旁边的三个条纹将显示选项。第一个选项卡向我们显示有关当前进口的信息

![](https://tryhackme-images.s3.amazonaws.com/user-uploads/6093e17fa004d20049b6933e/room-content/a6e1af6f79653eeedb18ac9c3be7a038.png)

*   **Overview** - Provides summaries information such as the number of active sessions the account has and if it can reach high-value targets.  
    **概述**\- 提供摘要信息，例如帐户拥有的活动会话数以及是否可以达到高价值目标。
    
*   **Node Properties** - Shows information regarding the AD account, such as the display name and the title.  
    **节点属性**\- 显示有关AD帐户的信息，例如显示名称和标题。
    
*   **Extra Properties** - Provides more detailed AD information such as the distinguished name and when the account was created.  
    **额外属性**\- 提供更详细的AD信息，例如可分辨名称和创建帐户的时间。
    
*   **Group Membership** - Shows information regarding the groups that the account is a member of.  
    **组成员资格**\- 显示有关帐户所属组的信息。
    
*   **Local Admin Rights** - Provides information on domain-joined hosts where the account has administrative privileges.  
    **本地管理员权限**\- 提供有关帐户具有管理权限的已加入域的主机的信息。
    
*   **Execution Rights** - Provides information on special privileges such as the ability to RDP into a machine.  
    **执行权限**\- 提供有关特殊权限的信息，例如通过RDP访问计算机的能力。
    
*   **Outbound Control Rights** - Shows information regarding AD objects where this account has permissions to modify their attributes.  
    **出站控制权限**\- 显示有关此帐户有权修改其属性的AD对象的信息。
    
*   **Inbound Control Rights** -  Provides information regarding AD objects that can modify the attributes of this account.  
    **入站控制权限**\- 提供有关可修改此帐户属性的AD对象的信息。  
    如果您想了解每个类别的更多信息，可以按信息查询旁边的数字。例如，让我们看看与我们的帐户关联的组成员身份。通过按“First Degree Group Membership”旁边的数字，我们可以看到我们的帐户是两个组的成员。
    

接下来，我们将研究分析查询。这些是 Bloodhound 的创建者自己编写的查询，用于列举有用的信息  
![](https://tryhackme-images.s3.amazonaws.com/user-uploads/6093e17fa004d20049b6933e/room-content/247be9dc8f34b8de181516199b0664dd.png)

在“域信息”部分下，我们可以运行“查找所有域管理员”查询。请注意，您可以按 LeftCtrl 更改标签显示设置。

![Bloodhound](https://tryhackme-images.s3.amazonaws.com/user-uploads/6093e17fa004d20049b6933e/room-content/9e4a7afd2acd099df71dc70d9eccf705.png)

图标称为节点，线称为边。让我们更深入地了解 Bloodhound 向我们展示的内容。有一个用户名为**T0\_TINUS.GREEN**的AD用户帐户，它是**Tier 0 ADMINS**组的成员。但是，该组是**DOMAIN ADMINS**组中的嵌套组，这意味着属于**第 0 层 ADMINS**组的所有用户实际上都是 DA。  
此外，还有一个用户名为**ADMINISTRATOR**的附加AD帐户，该帐户属于**DOMAIN ADMINS**组。因此，如果我们想获得 DA 权限，我们的攻击面中可能会尝试破坏两个帐户。由于**管理员**帐户是内置帐户，因此我们可能会关注用户帐户。

前面的任务中讨论的每个AD对象都可以是 Bloodhound 中的一个节点，并且每个对象都有一个不同的图标来描述其对象类型。如果我们想制定攻击路径，我们需要查看当前位置和我们拥有的特权与我们想要去的地方之间的可用边缘。 Bloodhound 有各种可用的边缘，可以通过过滤器图标访问：

![Bloodhound](https://tryhackme-images.s3.amazonaws.com/user-uploads/6093e17fa004d20049b6933e/room-content/c21ccdbdd84a6e709d39fdff14764cea.png)

随着新攻击媒介的发现，这些内容也会不断更新。我们将考虑在未来的网络中利用这些不同的优势。但是，让我们看看仅使用默认边和一些特殊边的最基本的攻击路径。我们将在 Bloodhound 中运行搜索来枚举攻击路径。按路径图标即可进行路径搜索

我们的起始节点将是我们的AD用户名，我们的结束节点将是**第 1 层 ADMINS**组，因为该组对服务器具有管理权限。

![Bloodhound](https://tryhackme-images.s3.amazonaws.com/user-uploads/6093e17fa004d20049b6933e/room-content/b7ae2e4f8e1824e25e69fa69d95c4a4e.png)

如果使用所选边缘过滤器没有可用的攻击路径，Bloodhound 将显示“未找到结果”。**请注意，这也可能是由于 Bloodhound/Sharphound 不匹配造成的，这意味着结果未正确摄取。请使用 Bloodhound v4.1.0。**然而，在我们的例子中，Bloodhound 显示了一条攻击路径。它显示**T1 管理员 ACCOUNT**之一通过使用其凭据对**THMJMP1** （工作站）进行身份验证，破坏了分层模型。它还表明属于**DOMAIN USERS**组的任何用户（包括我们的 AD 帐户）都能够通过RDP连接到该主机。  
我们可以执行如下操作来利用这条路径：

1.  Use our AD credentials to RDP into **THMJMP1**.  
    使用我们的 AD 凭据通过RDP进入**THMJMP1** 。
2.  Look for a privilege escalation vector on the host that would provide us with Administrative access.  
    在主机上寻找可为我们提供管理访问权限的权限升级向量。
3.  Using Administrative access, we can use credential harvesting techniques and tools such as Mimikatz.  
    通过管理访问，我们可以使用凭据收集技术和工具，例如 Mimikatz。
4.  Since the T1 Admin has an active session on **THMJMP1**, our credential harvesting would provide us with the NTLM hash of the associated account.  
    由于 T1 管理员在**THMJMP1**上有一个活动会话，因此我们的凭据收集将为我们提供关联帐户的NTLM哈希值。

这是一个简单的例子。一般情况下，攻击路径可能比较复杂，需要采取多次行动才能达到最终目标。如果您对与每个边缘相关的漏洞感兴趣，以下[Bloodhound 文档](https://bloodhound.readthedocs.io/en/latest/data-analysis/edges.html)提供了很好的指南。 Bloodhound 是一款极其强大的AD枚举工具，可以深入了解攻击面的AD结构。值得花精力去尝试它并了解它的各种功能。

#### [](#Session-Data-Only-仅会话数据 "Session Data Only 仅会话数据")Session Data Only 仅会话数据

AD的结构没有改变 在大型组织中经常出现。可能会有几个新员工， 但 OU、组、用户和权限的整体结构将 保持不变。

然而，不断变化的一件事是活动会话和登录事件。由于 Sharphound 创建AD结构的时间点快照，因此活动会话数据并不总是准确的，因为某些用户可能已经注销了其会话，或者新用户可能已经建立了新会话。这是需要注意的重要事项，也是我们希望定期执行 Sharphound 的原因。  
一个好的方法是在评估开始时使用“全部”收集方法执行 Sharphound，然后使用“会话”收集方法每天至少执行两次 Sharphound。这将为您提供新的会话数据并确保这些运行速度更快，因为它们不会再次枚举整个AD结构。执行这些会话运行的最佳时间是在 10:00 左右，此时用户喝了第一杯咖啡并开始工作，然后在 14:00 左右，即他们午休回来但回家之前。

在从这些新的 Sharphound 运行中导入数据之前，您可以通过单击“清除会话信息”在“数据库信息”选项卡上清除 Bloodhound 中的停滞会话数据

Benefits 好处

\-  
提供用于AD枚举的GUI 。

\-  
能够显示枚举的AD信息的攻击路径。

\-  
提供对通常需要多次手动查询才能恢复的AD对象的更深刻见解。

Drawbacks 缺点

*   需要执行 Sharphound，该程序噪音较大，通常可以被 AV 或EDR解决方案检测到。

### [](#清楚数据 "清楚数据")清楚数据

### [](#步骤-1：停止-Neo4j-服务 "步骤 1：停止 Neo4j 服务")步骤 1：停止 Neo4j 服务

确保 Neo4j 数据库服务已经停止，以避免在删除文件时出现问题。根据你的系统配置，你可以使用以下命令停止 Neo4j 服务：

**在 Windows 上：**

powershellCopy Code

`Stop-Service -Name neo4j`

**在 Linux 上（如果你通过系统服务启动 Neo4j）：**

bashCopy Code

`sudo systemctl stop neo4j`

### [](#步骤-2：删除-Neo4j-数据库文件 "步骤 2：删除 Neo4j 数据库文件")步骤 2：删除 Neo4j 数据库文件

Neo4j 数据库通常存储在以下位置：

**在 Windows 上：**

Neo4j 数据库文件通常在 `C:\Program Files\Neo4j Community\neo4j-data\databases` 目录中。删除这个目录下的所有文件和子目录。

**在 Linux 上：**

Neo4j 数据库文件通常在 `/var/lib/neo4j/data/databases` 目录中。你可以使用以下命令删除该目录下的所有文件和子目录：

bashCopy Code

`sudo rm -rf /var/lib/neo4j/data/databases/*`
