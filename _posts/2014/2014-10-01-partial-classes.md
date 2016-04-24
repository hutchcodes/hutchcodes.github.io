---
layout: post
categories: [C#, Mobile]
title: Sharing Code with Partial Classes
---
This is a multipart series on how to share code between .Net platforms.  All the examples will be showing how to share between Windows 8 Store applications and Windows Phone 8 application, but the techniques are useful for sharing code between any .Net/Xamarin platforms.
<ol>
	<li><a href="http://hutchcodes.net/linked-files/">Linked Files</a></li>
	<li><a href="http://hutchcodes.net/conditional-compilation/">Conditional Compilation</a></li>
	<li><a href="http://hutchcodes.net/partial-classes/">Partial Classes</a></li>
	<li><a href="http://hutchcodes.net/sharing-code-with-inheritance/">Inheritance</a></li>
	<li><a href="http://hutchcodes.net/sharing-code-with-dependency-injection/">Dependency Injection</a></li>
</ol>
<h3>What are Partial Classes?</h3>
Partial Classes are a way to split a class up into multiple files. It is frequently used when one part of your class is generated code and another part is written by hand.  In this case we’ll use partial classes to separate code that is shared between platforms and code that is platform specific.
<!--more-->

<h3>How do I do it?</h3>
First you would need to use <a href="http://hutchcodes.net/linked-files/">linked files</a> to share the code between your projects. Then you need to change the class declaration to include the keyword partial.

~~~ csharp
partial class MainPageViewModel
~~~

Then you create a new files in each of your projects.  In this example we’ll create MainPageViewModel.WP8.cs and MainPageViewModel.W8.cs.  The WP8 file would be created in the Windows Phone project and the W8 file would be created in the Window 8 project.  We then need to include that same class declaration in those files.

Then we just move the methods with platform specific code into those platform specific partial classes.

The WP8 file would look like this:

~~~ csharp
partial class MainPageViewModel
{
    private void Load()
    {
        object name = null;
        if (IsolatedStorageSettings.ApplicationSettings.Contains("Name"))
        {
            name = IsolatedStorageSettings.ApplicationSettings["Name"];
        }
        if (name != null)
        {
            HelloMessage = "Load " + name.ToString();
        }
    }
}
~~~

The W8 file would look like this:

~~~ csharp
partial class MainPageViewModel
{
    private void Load()
    {
        object name = null;
        if (ApplicationData.Current.LocalSettings.Values.ContainsKey("Name"))
        {
            name = ApplicationData.Current.LocalSettings.Values["Name"];
        }

        if (name != null)
        {
            HelloMessage = "Hello " + name.ToString();
        }
    }
}
~~~

