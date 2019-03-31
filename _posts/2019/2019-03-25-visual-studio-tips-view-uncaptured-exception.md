---
layout: post
title: Visual Studio Tips - View Uncaptured Exception
categories: [VSTips]
date: 2019-03-25
published: true
codeproject: true
devto: true
---

Ever have code where you catch an exception because to handle it, but you don't need to use the exception itself? Maybe just knowing the exception type is enough for you. But then you sometimes want to see it while debugging? 

Previously I would just capture the exception and just live with the warning about an unused variable, but now I do this.

<!--more-->

First, what do I mean when I say caught but not captured? In the code below I have caught the `InvalidOperationException` thrown by trying to get the first item from an empty collection. But I haven't captured the exception in a variable.

~~~ csharp
var foo = new List<string>();

string bar;
try
{
    bar = foo.First();
}
catch (InvalidOperationException)
{
    //Do something like logging or retry
    bar = null;
}
~~~

Without having to change the code at all we can view the exception by viewing the contents of the `$exception` pseudovariable which holds the value of the most recent exception. You can either get the value by adding it to your watch list or by evaluating it in the immediate window.

![alt text](/img/2019/UncapturedExceptionWatch.jpg "Watch window showing the value of $exception")