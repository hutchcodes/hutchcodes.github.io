---
layout: post
title: Visual Studio Tips - Using Data Tips
categories: [VSTips]
date: 2019-04-01
published: true
codeproject: true
---

Data tips, the Visual Studio feature that allows you to hover over a variable and see its value while debugging, can be super useful. Here are a few tricks that you may not know about them.

<!--more-->

Have you ever been looking in the DataTips then need to look at the code behind them? Great news, you can. Just press and hold `Ctrl` key, the DataTips become transparent until you release the `Ctrl` key. This is particularly useful when you've drilled down a bit in the DataTip or you're trying to compare 

![alt text](/img/2019/DataTipsTransparent.gif "Visual of making the data tips transparent.")

Another thing you can do is either pin the DataTips. This persists the DataTip so you can navigate to other code, restart debugging or even restart Visual Studio and still have the DataTip be there when you break in that block the next time. Once you've pinned a DataTip you can move the data tip around by clicking and dragging, you can remove it by clicking the `x`, or you can float the DataTip by clicking the pin icon. This allows you to view that DataTip while you scroll the code or view another file.

![alt text](/img/2019/DataTipsPinFloat.gif "Visual of pinning, floating and closing a DataTip")

Once you've pinned a DataTip, you can add expressions to that DataTip by right-clicking on the DataTip and choosing "Add Expression". This can let you pin something more useful than what might normally display for an object. In this case, the [DebuggerDisplay](/2019/03/visual-studio-tips-debugger-display/) shows `LastName, FirstName`, but we can add an expression to display the Person object as `FirstName LastName`. This is really handy for when you can't change the `DebuggerDisplay` of an object.

![alt text](/img/2019/DataTipsAddExpression.gif "Visual of adding a DataTip comment")


The other interesting feature of DataTips is that you can add comments to them.

![alt text](/img/2019/DataTipsComment.gif "Visual of adding a DataTip comment")

But what good are comments if you can't share them? Well, you can export your DataTips to an XML file and either share them or check them in with your source. You could have a set of DataTips that you load up whenever you're facing a common debugging scenario.

![alt text](/img/2019/DataTipsImportExport.jpg "Visual of adding a DataTip comment")

You might also notice there are options in there to "Clear All DataTips", and "Clear All DataTips from [CurrentFileName]". 