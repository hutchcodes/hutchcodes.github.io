---
layout: post
title: Visual Studio Tips - Code Definition Keyboard Shortcuts
categories: [VSTips]
date: 2019-04-24
published: true
codeproject: true
devto: true
---

Often when we're coding, we need to take a look at the definition or sometimes the implementation of a method we're calling. Visual Studio has a few great ways to speed these tasks.

<!--more-->

### Goto Definition

To see the definition of a variable, class, interface or method, you place your cursor on the thing you want to see the definition of, and either press `F12` or right click and choose `Goto Definition`.

One catch with Goto Definition is that when you use it to go to a definition of a property or method, it goes it goes to the definition of the object as it is declared. That means that if you hit `F12` on all of the `SayHello()` methods below you would go to `IGreeter.SayHello` for `greeter1`, `SimpleGreeter.SayHello` for `greeter2` and `greeter3` and `WorldGreeter.SayHello()` for `greeter4`.

~~~ csharp
            IGreeter greeter1 = new SimpleGreeter();
            Console.WriteLine(greeter1.SayHello());

            SimpleGreeter greeter2 = new SimpleGreeter();
            Console.WriteLine(greeter2.SayHello());

            SimpleGreeter greeter3 = new WorldGreeter();
            Console.WriteLine(greeter3.SayHello());

            WorldGreeter greeter4 = new WorldGreeter();
            Console.WriteLine(greeter4.SayHello());
~~~

### Peek Definition

If you wanted to take a peek at the definition without navigating to its definition, you can use `Alt+F12` or right click and choose `Peek Definition`. This brings up the definition in a little window within the code editor. You can still scroll through the code of the definition without losing your place in the code you are editing. `Esc` closes the Peek window. 

![alt text](/img/2019/PeekDefinition.jpg "View hierarchy window")

### Goto Implementation

If you want to view the implementation of a method or property rather than its definition you can press `Ctrl+F12` or right click and choose `Goto Implementation`. If there is only one implementation for a method, Visual Studio takes you directly to the implementation. If there are multiple implementations, it brings up a window that lists the implementations. You can view the implementations by using your arrow keys or by clicking on them.

For the code above it would go directly to the implementation for `greeter4.SayHello()`, for all the others it would bring up the implementation selector window.

### Find All References

Sometimes it's helpful to see what other code is referencing a method or property. For that, you can use the official shortcut `Ctrl+K+R`, or the unlisted shortcut `Shift+F12`, or you can right click and choose `Find All References`. This brings up a window that lists all the references to that method. This displays the same list regardless of how the object is declared.

### View Call Hierarchy

Sometimes it is handy to be able to see what code is calling a method or property, and what code led to that call. To see that you can right click on the method or property you're interested in and choose 'View Call Hierarchy' or `Ctrl+K, Ctrl+T`. This brings up a tree view with the method or property you're interested in and allows you to dig in until you get to the initial action that caused the method or property to be called. In the case below we can see that the `SayHello()` method was called by the `Run()` method which was called by the `Main([string])`. In the right pane, we can see the line and column that `Run()` is called from and double-clicking that takes us to that location.

![alt text](/img/2019/ViewCallHierarchy.jpg "View hierarchy window")
