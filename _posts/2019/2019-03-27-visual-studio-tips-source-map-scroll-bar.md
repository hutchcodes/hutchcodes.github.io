---
layout: post
title: Visual Studio Tips - Source Map in the Scroll Bar
categories: [VSTips]
date: 2019-03-27
published: true
codeproject: true
devto: true
---

Do you find yourself scrolling up and down in a large file in Visual Studio? "Show Source Maps in Scroll Bar" gives you a 1000 foot view of your code and allows you to navigate with a simple click.

<!--more-->

To turn this feature on go to Tool -> Options -> Text Editor -> Scroll Bars. In the Behavior section select "Use map mode for vertical scroll bar". I also like to select "Show Preview Tooltip" as well. You can choose your own width, but I've been happy with "Medium".

![alt text](/img/2019/TurnOnSourceMap.jpg "Visual of turning on Source Map scroll bar.")

Once that's done you can navigate your code like this

![alt text](/img/2019/SourceMapScrollBar.gif "Visual of turning on using the Source Map scroll bar.")

Note that both there are 3 artifacts on the Source Map.
1. A white bar that indicates where you are in the document
2. A white block on the left side of the source map to indicate a bookmark
3. A red block on the left side of the source map to indicate a breakpoint