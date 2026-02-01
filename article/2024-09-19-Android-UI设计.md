---
title: "Android_UI设计"
date: "2024-09-19"
description: "控件是用户与应用交互的元素。常见的控件包括："
---

### [](#控件 "控件")控件

控件是用户与应用交互的元素。常见的控件包括：

1.  **按钮 (Button)**：用于执行动作。
2.  **文本框 (EditText)**：让用户输入文本。
3.  **复选框 (CheckBox)**：允许用户选择或取消选择某个选项。
4.  **单选按钮 (RadioButton)**：用于在多个选项中选择一个。
5.  **下拉列表 (Spinner)**：提供一个选择列表。
6.  **图像视图 (ImageView)**：显示图片。

### [](#容器 "容器")容器

容器用于组织和布局控件。常见的容器包括：

1.  **线性布局 (LinearLayout)**：按水平或垂直方向排列子控件。
2.  **相对布局 (RelativeLayout)**：子控件可以相对其他控件或父容器进行定位。
3.  **约束布局 (ConstraintLayout)**：灵活的布局方式，支持复杂的界面设计。
4.  **网格布局 (GridLayout)**：将控件排列成网格的形式

### [](#顶层容器 "顶层容器")顶层容器

顶层容器是整个界面的基础，通常是应用的主布局。常见的有：

*   **Activity**：代表一个单一的界面。
*   **Fragment**：可以在Activity内重用，便于管理不同的界面部分。

### [](#中间容器 "中间容器")中间容器

中间容器用于组织和布局控件，通常用于分组和控制排列方式。包括：

*   **LinearLayout**：可以垂直或水平排列子控件。
*   **RelativeLayout**：根据控件之间的关系进行布局。
*   **ConstraintLayout**：用于更复杂的布局，支持灵活的控件定位。

安卓UI设计中，容器控件是用于组织和管理其他控件的布局元素。以下是一些常见的容器控件及其特点：

### [](#1-LinearLayout "1. LinearLayout")1\. LinearLayout

*   **特点**：将子控件按线性方式排列，可以选择水平或垂直方向。
*   **用途**：简单的列表或表单布局。

### [](#2-RelativeLayout "2. RelativeLayout")2\. RelativeLayout

*   **特点**：允许子控件相对其他控件或父容器进行定位。
*   **用途**：适合需要灵活排列控件的复杂布局。

### [](#3-ConstraintLayout "3. ConstraintLayout")3\. ConstraintLayout

*   **特点**：通过约束方式实现灵活布局，能有效减少嵌套，提高性能。
*   **用途**：适合复杂界面，推荐用于现代应用。

### [](#4-FrameLayout "4. FrameLayout")4\. FrameLayout

*   **特点**：用于堆叠子控件，后添加的控件会覆盖前面的控件。
*   **用途**：适合需要重叠显示的元素，例如图像叠加。

### [](#5-GridLayout "5. GridLayout")5\. GridLayout

*   **特点**：将控件以网格形式排列，指定行和列。
*   **用途**：适合表格或卡片布局。

### [](#6-ScrollView "6. ScrollView")6\. ScrollView

*   **特点**：提供滚动功能，通常只能包含一个子控件。
*   **用途**：适合内容超出屏幕的情况，便于用户查看。

### [](#7-ViewPager "7. ViewPager")7\. ViewPager

*   **特点**：允许用户通过滑动手势在多个页面之间切换。
*   **用途**：常用于显示一系列的图像或界面。

### [](#8-TabLayout "8. TabLayout")8\. TabLayout

*   **特点**：显示选项卡，用户可以通过点击不同的标签切换内容。
*   **用途**：适合分类展示不同类型的信息。

一般来讲ui文件为xml ，同时保存在res 中的layout文件夹下。并且有两种模式一种还是text和一种视图状态。

###### [](#在Android界面XML中，根标签通常是一个布局控件，决定了界面的整体结构。常见的根标签包括： "在Android界面XML中，根标签通常是一个布局控件，决定了界面的整体结构。常见的根标签包括：")在Android界面XML中，根标签通常是一个布局控件，决定了界面的整体结构。常见的根标签包括：

### [](#1-LinearLayout-1 "1. LinearLayout")1. **LinearLayout**

*   用于线性排列子控件。

### [](#2-RelativeLayout-1 "2. RelativeLayout")2. **RelativeLayout**

*   允许控件相对定位。

### [](#3-ConstraintLayout-1 "3. ConstraintLayout")3. **ConstraintLayout**

*   提供灵活的约束布局，适合复杂界面。

### [](#4-FrameLayout-1 "4. FrameLayout")4. **FrameLayout**

*   用于简单堆叠子控件。

### [](#5-ScrollView "5. ScrollView")5. **ScrollView**

*   允许内容滚动，通常只包含一个直接子控件。

##### [](#android-和api "android 和api")android 和api

Android版本（如Android 9）指的是操作系统的整体版本，包含了一系列功能和用户界面更新。而API级别（如API 35）则是开发者用来编写应用的接口版本，定义了可用的编程功能和特性。

##### [](#实操ui设计 "实操ui设计")实操ui设计

![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240919153809.png)  
![image.png](https://raw.githubusercontent.com/k1t0111/blog/main/image/20240920113015.png)  
可以看到有很多控件，我们可以拖动。但是同样也可以修改对齐的标准。这一点只能靠自己摸索。感觉语言表达不出来。
