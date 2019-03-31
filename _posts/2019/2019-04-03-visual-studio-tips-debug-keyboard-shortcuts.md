---
layout: post
title: Visual Studio Tips - Keyboard Shortcuts for Debugging
categories: [VSTips]
date: 2019-04-03
published: true
codeproject: true
devto: true
---

There are literally hundreds of keyboard shortcuts in Visual Studio, and few people have them all memorized, but it is definitely worthwhile to memorize at least a few. Here are some that are useful while you're debugging.

<!--more-->

* `F5` - Run - This both starts the debugging session and continues the debugging session if the session is paused.
* `F10` - Step Over - This runs just the next statement. If the next statement is a function call, it runs the whole function before pausing execution again (unless there is a breakpoint in the function).
* `F11` - Step Into - This runs just the next statement. If the next statement is a function call, it will bring you to that function and pause before the first statement in there is run.
* `Shift+F11` - Step Out - This runs until the code returns from the currently running function. It's really handy when you are done debugging a function, but that function still has a lot of statements to execute.
* `Ctrl+F10` - Run to Cursor - This allows you to move the cursor to a line of code then run until the debugger gets there. This is handy if you want to skip over a block of code. You could also press `F9` then `F5` which would add a Breakpoint at your cursor, then run to it.
* `Ctrl+Shift+F10` - Set Next Statement - This sets the line your cursor is on as the next statement the debugger will run. Really handy if you missed something and want to backup and debug it again.
* `Alt+Num *` - Show Next Statement - Sorry laptop users, this one only works with the `*` on the number pad. This one takes you to the next statement that will run. Really handy if you've been sifting through code and want to quickly return to your debugging without executing any statements. 
* `Shift+F5` - Stop Debugging - Ends your debugging session.
* `Ctrl+Shift+F5` - Restart Debugging - Getting the message "Edits were made to the code which cannot be applied while debugging"? This will quickly restart the debug session and have you on your way.
  
All of these are of course available through the UI, but if you often find yourself looking for them in the command bar, or right clicking and trying to find them in the context menu, memorizing at least some of these shortcuts will keep you focused on the debugging.





