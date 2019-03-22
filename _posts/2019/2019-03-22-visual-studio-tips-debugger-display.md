---
layout: post
title: Visual Studio Tips - DebuggerDisplay
categories: [VSTips]
date: 2019-03-22
published: true
codeproject: true
---

When you look at an object in the Watch window what you see is whatever comes out of the `ToString()` method. But what if you could control what was displayed so that you could see some meaningful value? Well, you can.

<!--more-->

If we have a `Person` class define like this

~~~ csharp
namespace VSTips.DebuggerDisplay
{
    class Person
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
~~~

If we create an instance and look at it in the watch window all we see is `{VSTips.DebuggerDisplay.Person}`. We can of course drill in to see the individual properties, and that isn't so bad when you're looking at a single object, but when you look at a `List<Person>` and see this, you know you're going to spend a lot of time clicking to find the object you're looking for.

![alt text](/img/2019/NoDebuggerDisplay.jpg "Ojects dispalyed without DebuggerDisplay attribute")

If we go back to the definition of the `Person` class and add an attribute we can make the watch window display whatever we want. In this case, we'll display the last name and the first 5 characters of the first name (taking the first 5 just to show the flexability).

~~~ csharp
using System.Diagnostics;

namespace VSTips.DebuggerDisplay
{
   [DebuggerDisplay("{LastName,nq}, {FirstName.Length >= 5 ? FirstName.Substring(0, 5) : FirstName,nq}")]
    class Person
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
~~~

When you look at the watch list with this Debugger Display what you see is much more helpful.

![alt text](/img/2019/WithDebuggerDisplay.jpg "Ojects dispalyed without DebuggerDisplay attribute")