---
layout: post
title: Visual Studio Tips - Breakpoints
categories: [VSTips]
date: 2019-03-28
published: true
codeproject: true
devto: true
---

Most of us know about Breakpoints and how to use them, but there are a few under-utilized features of breakpoints that you should be aware of.

<!--more-->

You can set a simple breakpoint in a number of ways
1. Move the cursor to the line you want to break on and hit the F9 key
2. Right click on the line of code 
3. Clicking in the gutter

Once you have a breakpoint set you can do a few things with it. First, you can disable it, if you don't need the breakpoint right now, but think you might come back to it.

![alt text](/img/2019/BreakpointDisable.gif "Visual of disabling a breakpoint.")

You can also disable all breakpoints from Debug -> Disable all breakpoint. This is handy for when you need to run and get reset, then re-enable all breakpoints and start your debugging again.

You can also make the breakpoint conditional based on the value of a variable or any boolean expression (yes, you can use the [No Side Effects](/2019/03/visual-studio-tips-no-side-effects-function-eval/) formatter). This can be helpful if you want to break when the value of a variable is a certain value. 

![alt text](/img/2019/BreakpointConditional.gif "Visual of creating a conditional breakpoint based on a boolean expression.")

You can also make the breakpoint conditional base on the number of times a breakpoint is hit. For example, you might know that the first time a breakpoint is hit isn't interesting to your debugging scenario but every time after that is interesting. You could set hit count > 1.

![alt text](/img/2019/BreakpointHitcount.gif "Visual of creating a conditional breakpoint based on hit count.")

You can also filter your breakpoints to a single thread or to exclude a thread, either by name or id.

