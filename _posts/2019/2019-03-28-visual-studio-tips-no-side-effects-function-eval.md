---
layout: post
title: Visual Studio Tips - Evaluate a Function Without Side Effects
categories: [VSTips]
date: 2019-03-25
published: true
codeproject: true
---

Ever been debugging and wanted to know what the result a function call would but calling it would change the state in a way that would make continuing difficult or impossible? Well, you can evaluate it and specify that it does not have any side effects.

<!--more-->

Take this simple class that tracks a count and has a method for incrementing that count. 

~~~ csharp
class Foo
{
    public int Count { get; private set; } = 0;

    public int AddOne()
    {
        Count++;
        return Count;
    }
}
~~~

If we want to see what the result of the `AddOne()` method would be, but we don't want to actually increment the count because we can't set it back we can use the `nse` (no side effects) format specifier in both the watch window and the Immediate Window.

~~~ csharp
foo.AddOne(), nse
~~~



