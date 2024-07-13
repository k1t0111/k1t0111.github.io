---
title: ctf-逆向刷题
date: 2024-03-27 20:19:09
categories:
- CTF-逆向
thumbnail: https://img-blog.csdnimg.cn/direct/234fd0c4e06f41988d012ab298acf3c0.png#pic_center
---
![](https://img2.imgtp.com/2024/03/09/RHPXj7nO.png)

 
# 阅读须知：

>探索者安全团队技术文章仅供参考,未经授权请勿利用文章中的技术资料对任何计算机系统进行入侵操作,由于传播、利用本公众号所提供的技术和信息而造成的任何直接或者间接的后果及损失，均由使用者
本人负责，作者不为此承担任何责任,如有侵权烦请告知，我们会立即删除并致歉,创作不易转载请标明出处.感谢!
## 波克比QWQ师傅

原文出处:  https://blog.csdn.net/yjh_fnu_ltn?type=blog
## 题目
### 题目地址：[polyre](https://adworld.xctf.org.cn/challenges/list?rwNmOdr=1710932754481)
1. 拿到题目后无壳，直接拖入ida反汇编，从start函数直接跳到main函数：![](https://img-blog.csdnimg.cn/direct/234fd0c4e06f41988d012ab298acf3c0.png#pic_center)
![](https://img-blog.csdnimg.cn/direct/8ac9dfa6982b4a5f88ec2d7d21333d17.png#pic_center)
2. 明显的虚假控制流平坦化，这里简单讲一下什么是平坦化，平坦化就是将原本嵌套多层的语句，改为只用1个switch加while循环来实现，下面使用python语句来表现一个循环语句平坦化：

```
#原程序
res=[1,-1,2,-2,3,-3]
for i in range(len(res)):
    if res[i] < 0:
        res[i]<<=1
        res[i]+=10
        if res[1]&1==1:
            res[i]*=2
    else :
        res[i]^=13
        res[i]*=4
        # if res[1]
print(res)

res=[1,-1,2,-2,3,-3]
#手动添加平坦换后
i=0
while i<len(res):
    b=(int(res[i]<0)^1)+1
    while True:
        match b:
            case 0:
                break
            case 1:
                res[i]<<=1
                b=3
                
            case 2:
                res[i]^=13
                b=4
                
            case 3:
                res[i]+=10
                b=(res[i]&1)*5
                
            case 4:
                res[i]*=4
                break
                
            case 5:
                res[i]*=2
                break
    i+=1
print(res)
```
![](https://img-blog.csdnimg.cn/direct/803b835372ae4709afbfe58556869987.png#pic_center)
4. 其实现的功能仍然是一样的，只不过将一个循环里的多个语句放在了不同的子模块中，再通过子模块之间的相互控制，来达到原有程序的效果。详细的平坦换请看下面这篇文章：[控制流平坦化](https://security.tencent.com/index.php/blog/msg/112)
5. 知道控制流平坦化后，可以使用符号化执行来简化程序，使程序的可读性增强，便于反汇编，使用deflat.py脚本即可去除平坦化：命令如下![](https://img-blog.csdnimg.cn/direct/f3d2880d316648b48d15e42bced043ea.png#pic_center)
6. -f后是文件名，--addr后是要平坦化的函数首地址，执行后效果如下：![](https://img-blog.csdnimg.cn/direct/34b9a66b035f4681989b68ffe00c3972.png#pic_center)![汇编视图](https://img-blog.csdnimg.cn/direct/b06b4e252e54467cbc14b321e2ee61d8.png#pic_center)![](https://img-blog.csdnimg.cn/direct/ba1d174db1924760b4a662bcc41354aa.png#pic_center)
7. 这里可以看到，去平坦化后的程序刻度性增强，不过其中还有一些出题人塞进去的虚假指令(恒真/假)，永远不会执行。
8. 例如：第一个if语句后面的 **((((_BYTE)dword_603054 - 1) * (_BYTE)dword_603054) & 1) != 0**条件就永远为假**(n*(n-1))&1**这个结果恒等于0，所以前面的条件恒假，即if语句里面的程序根本不会执行，类似的虚指令后面还有16个，需要清除：![](https://img-blog.csdnimg.cn/direct/70b7f74dbf0741e3b484058591930b9c.png#pic_center)
9. 这里使用idapython脚本来快速去除，这里**脚本的逻辑**：将jnz指令的条件跳转修改为直接跳转，因为后面的**jmp语句永远不会执行**，后面的while循环同理，只会执行一次，因此利用脚本将**jnz的条件跳转**直接改为**jmp进行直接跳转**(顺跳)，源程序相当于：![](https://img-blog.csdnimg.cn/direct/c60d17b7d03b47458ae7386681bf7ca0.png#pic_center)
```
st = 0x0000000000400620 #main开始
end = 0x0000000000402144 #main结束
 
def patch_nop(start,end):
    for i in range(start,end):
        ida_bytes.patch_byte(i, 0x90)		#修改指定地址处的指令  0x90是最简单的1字节nop
 
def next_instr(addr):
    return addr+idc.get_item_size(addr)		#获取指令或数据长度，这个函数的作用就是去往下一条指令
    
 
 
addr = st
while(addr<end):
    next = next_instr(addr)
    if "ds:dword_603054" in GetDisasm(addr):	#GetDisasm(addr)得到addr的反汇编语句
        while(True):
            addr = next
            next = next_instr(addr)
            if "jnz" in GetDisasm(addr):
                dest = idc.get_operand_value(addr, 0)		#得到操作数，就是指令后的数
                ida_bytes.patch_byte(addr, 0xe9)     #0xe9 jmp后面的四个字节是偏移
                ida_bytes.patch_byte(addr+5, 0x90)   #nop第五个字节
                offset = dest - (addr + 5)  #调整为正确的偏移地址 也就是相对偏移地址 - 当前指令后的地址
                ida_bytes.patch_dword(addr + 1, offset) #把地址赋值给jmp后
                print("patch bcf: 0x%x"%addr)
                addr = next
                break
    else:
        addr = next
```
8. 利用脚本修改后的汇编指令，反编译程序如下，去除掉后面16个虚指令：![](https://img-blog.csdnimg.cn/direct/f0f2eb0b673d4372980bc8d6fc961a6f.png#pic_center)![](https://img-blog.csdnimg.cn/direct/38567dc54bbb4cb7b8bf20827f8c1209.png#pic_center)
9. 前期准备结束，正式开始分析函数实现的功能，**第一个循环**的逻辑是将最后输入的回车符"\n"转化为0，**第二个循环**：将输入的字符串每8个一组(共64个bit)进行一下处理，**大于零**则左移1位(乘2)，**小于零**则左移1位后与0xB0004B7679FA26B3异或。这里由于变量v4是**64位的有符号数**，左移根据其最高位来判定符号，1为负数，0为正数：![](https://img-blog.csdnimg.cn/direct/4d41f332e5d540edad9e57072a6792c6.png#pic_center)
10. 最后，Jami后的字符串与程序给定的数据相比较，因为8个字节一组，所以将程序给定的48个字节分为6组整合到一起：![](https://img-blog.csdnimg.cn/direct/6bec91170feb4732a555c5fe2d34d00d.png#pic_center)
11. 最后解密脚本如下，脚本里面使用到的**逻辑**：原先的**正数**(最高位的符号位为0)左移1后一定是**偶数**(左移后低位自动用0补充)，而原先的**负数**(最高位的符号位为1)左移1后(变为偶数)再与0xB0004B7679FA26B3(奇数)异或，结果一定是奇数，也就是说，最后结果(加密一次)里面的偶数原先一定是正数，而结果里面的奇数原先一定是负数，所以根据**每次结果奇偶性**即可判定上一次该值是否为正或者负,如果是负数则需要给最高位(第64为)补上1(补上因为加密是左移而**溢出的1**)，为正数不用补(加密是左移溢出的是0，相当于没有溢出)：

```
a=[0xBC8FF26D43536296,0x520100780530EE16,0x4DC0B5EA935F08EC,0x342B90AFD853F450,
0x8B250EBCAA2C3681,0x55759F81A2C68AE4]
key=0xB0004B7679FA26B3
for res in a:
    for j in range(64): #循环64次
        tmp=res&1
        if tmp == 1:#判定是否为奇数(为奇数则上轮加密是为负数)，在二进制下最低为为1则是奇数
            res ^= key
        res>>=1
        if tmp==1:
            res+=0x8000000000000000 #如果该次加密前是负数()，把左移漏掉的最高位1补回来

    #输出，大小端续转化输出
    k=0
    while k<8:
        print(chr(res&0xff),end="")
        res>>=8
        k+=1
#flag{6ff29390-6c20-4c56-ba70-a95758e3d1f8}
```
### 总结：控制流平坦换的题需要将程序还原，增强程序的可读性，程序中存在永真(或永假)指令时可以利用idapython将条件跳转(jz,jnz)修改为直接跳转(jmp)，进一步增强可读性。

## 题目 ：maze
### 题目地址 ：[maze](https://adworld.xctf.org.cn/challenges/list)
1. 查壳无，直接使用ida打开，这应该时一道迷宫的题，打开后如下。![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/65a8adf785b3439b9f61e4d235878ca4.png#pic_center)
2. 分析，发现这是一道直线迷宫的题，解这类题目只需要找到该直线迷宫，分析键盘输入对应的移动操作即可，迷宫如下：![](https://img-blog.csdnimg.cn/direct/e854a83ed491478885297488a8d4a8fe.png#pic_center)
3. 在主循环中分析输入的flag对应的移动操作，可以看到0 后退1=79，前进1=111，后退8=46，前进8=48，由cmp函数可以看见只能停留在**空格**和 **#**：![](https://img-blog.csdnimg.cn/direct/f50fe5fed6f64f50af64656efd81439c.png#pic_center)
4. 分析出输入对应的移动操作后，即可走完迷宫，操作对应如下，代码附上：

```
'  *******   *  **** * ****  * ***  *#  *** *** ***     *********'
# 0 后退1=79
# 1 前进1=111
# 2 后退8=46
# 3 前进8=48
key=[79,111,46,48]
#    0 , 1 , 2,3
res=[1,3,1,1,3,3,0,3,3,3,1,1,1,1,2,2,0,0]
for i in range(len(res)):
    print(chr(key[res[i]]),end="")
flag="o0oo00O000oooo..OO"
print(len(flag))
```
最后flag=**nctf{o0oo00O000oooo..OO}**

## 题目：easy_go
### 题目地址：[easy_go](https://adworld.xctf.org.cn/challenges/list)
1. 无壳，直接ida打开：![=](https://img-blog.csdnimg.cn/direct/d87e3626051a47f486e7799f377fe07f.png#pic_center)
2. 能看到的关键信息由一个字符串 **“tGRBtXMZgD6ZhalBtCUTgWgZfnkTgqoNsnAVsmUYsGtCt9pEtDEYsql3”**，外加一个encode_base64的加密函数，看到了base64直接去找base64表，字符串里面直接看，搜索**abcdefgABCDEFG....**,查询base64表：![](https://img-blog.csdnimg.cn/direct/179e0c719225473299d10fabb0f3f479.png#pic_center)
3. 其中发现三个比较像的字符串，三个字符串一个一个用脚本(网站)试一下，最后真正的base64表是**6789_-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012345**：![](https://img-blog.csdnimg.cn/direct/9e5152e189f64da5a9449040a19c8d42.png#pic_center)
4. 总结：有关于base64的题目都可以直接去找base64表和密文。

## 题目：polyre
### 题目地址：[polyre](https://adworld.xctf.org.cn/challenges/list)





