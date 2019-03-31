---
layout: post
title: Visual Studio Tips - Trace Points
categories: [VSTips]
date: 2019-04-02
published: true
codeproject: true
devto: true
---

Tracepoints are not a new feature, they've been in Visual Studio since 2005, but they are a new feature to me. I just stumbled on them while researching for this series of posts. Tracepoints allow you to turn a Breakpoint into what is essentially a call to `Debug.WriteLine()`.

<!--more-->

A Tracepoint is just a special kind of Breakpoint that allows you to log a message to the Output window and continue execution. This can be really helpful in situations where stopping at a breakpoint makes reproducing a bug difficult or impossible.

And since Tracepoints are just a kind of Breakpoint, you can also put conditions on them and manage them just like Breakpoints. To learn more about Breakpoints see this [post](/2019/03/visual-studio-break-points/).

To set a Tracepoint, you set a normal breakpoint, then go into the settings of that Breakpoint and check `Actions`. That will display a textbox for you to create your log message and another checkbox to specify whether execution should stop or continue.

![alt text](/img/2019/Tracepoints.gif "Visual of creating and using a Tracepoint.")






