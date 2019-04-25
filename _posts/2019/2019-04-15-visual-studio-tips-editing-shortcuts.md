---
layout: post
title: Visual Studio Tips - Bulk Editing Shortcuts
categories: [VSTips]
date: 2019-04-15
published: true
codeproject: true
devto: true
---

One of the most tedious things we do as developers is making repetitive changes. Maybe we need to set a handful of properties on a single object, or perhaps we want to add a property to the instantiation of a bunch of test objects. Here are a few shortcuts to help you with that.

<!--more-->

### Multi-Caret Editing

Let's start with adding a property to the instantiation of some test objects. This is often the perfect scenario for "muti-caret editing." To start this you can do two things. The first is to position your caret where you'd like to start editing on the first line, then hold `Shift+Alt` and either use your arrows or the mouse to select a column or area. The beautiful thing about this method is it allows you to select a block of text to replace.

![alt text](/img/2019/MultiCaretReplace.gif "Using Shift Alt to replace text on multiple lines")

The drawback of using `Shift+Alt` is that the columns you want to edit must line up vertically. But frequently that isn't the case, and that's where `Ctrl+Alt` comes into play. With `Ctrl+Alt` you set the multiple carets by holding `Ctrl+Alt` and clicking where you want to edit. You can then insert text in all those places, even multiple times on the same line.

![alt text](/img/2019/MultiCaretInsert.gif "Using Control Alt to insert text on multiple lines")

### Duplicate Line

Those work great if the lines you want to edit already exist, or if you know how many lines you need to create at once. But I often find myself wanting to duplicate a line and make a few changes to it. For that, you can use the `Ctrl+E, Ctrl+V` keyboard shortcut which duplicates the line your cursor is on.

![alt text](/img/2019/DuplicateLine.gif "Duplicate line with Control E, Control V")

### Clipboard Ring

Another feature I find very useful when I'm making repeated edits is the Clipboard Ring. When you hit `Ctrl+Shift+V`, it brings up your clipboard ring which includes the last nine things you've copied or cut (more recently used at the top). You can then select the item you want to paste by typing the number, using your arrow keys or clicking with your mouse.

![alt text](/img/2019/ClipboardRing.gif "Using Clipboard Ring")

This can be useful when you need to copy multiple things from one file to another. You no longer need to flip back and forth, just copy, copy, paste, paste.

### Insert File as Text

This last feature I just stumbled upon while looking for something in the Edit menu. It's not something I expect to use a lot, but it might be useful. In the edit menu is a command "Insert File as Text", and the command does just what it says.

![alt text](/img/2019/InsertFileAsText.gif "Using Edit, Insert File as Text to insert a file as text")