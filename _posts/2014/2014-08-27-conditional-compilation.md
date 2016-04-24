---
layout: post
categories: [C#, Mobile]
title: Sharing Code with Conditional Compilation
---
This is a multipart series on how to share code between .Net platforms.  All the examples will be showing how to share between Windows 8 Store applications and Windows Phone 8 application, but the techniques are useful for sharing code between any .Net/Xamarin platforms.
<ol>
	<li><a href="http://hutchcodes.net/linked-files/">Linked Files</a></li>
	<li><a href="http://hutchcodes.net/conditional-compilation/">Conditional Compilation</a></li>
	<li><a href="http://hutchcodes.net/partial-classes/">Partial Classes</a></li>
	<li><a href="http://hutchcodes.net/sharing-code-with-inheritance/">Inheritance</a></li>
	<li><a href="http://hutchcodes.net/sharing-code-with-dependency-injection/">Dependency Injection</a></li>
</ol>

<h3>What is Conditional Compilation?</h3>
Conditional Compilation tells the compiler to selectively compile code.  Many developers use these to run certain code only while in debug that they don’t want to run in production.
<!--more-->

~~~ csharp
#if DEBUG
    //do some stuff
#endif
~~~    

<h3>How do I do it?</h3>
The first step would be to link a file between two projects.  Then you can either use an existing Conditional Compilation Symbol or create your own.  For example Windows Phone 8 defines SILVERLIGHT and WINDOWS_PHONE as Conditional Compilation Symbols.  You see see what symbols have been defined by your project and even add your own by going to the Build tab in Project Properties.

![Build Options Dialog](/img/2015/CompilerDirective.png)

To use the Conditional Compilation Symbols you just use the #if statement.  For example if you are using a namespace exists in Windows Phone, but doesn’t exist in Windows 8 you could do this:

~~~ csharp   
#if WINDOWS_PHONE
    using System.IO.IsolatedStorage;
#else
    using Windows.Storage;
#endif
~~~    

The System.IO.IsolatedStorage using statement will only be compiled in the Windows Phone projects.  The Windows.Storage using statement will be compiled in all other projects.


