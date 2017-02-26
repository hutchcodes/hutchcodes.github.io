---
layout: post
categories: [C#, Mobile, XPlat]
title: Sharing Code with Linked Files
---
This is a multipart series on how to share code between .Net platforms.  All the examples will be showing how to share between Windows 8 Store applications and Windows Phone 8 application, but the techniques are useful for sharing code between any .Net/Xamarin platforms.
<ol>
	<li><a href="http://hutchcodes.net/linked-files/">Linked Files</a></li>
	<li><a href="http://hutchcodes.net/conditional-compilation/">Conditional Compilation</a></li>
	<li><a href="http://hutchcodes.net/partial-classes/">Partial Classes</a></li>
	<li><a href="http://hutchcodes.net/sharing-code-with-inheritance/">Inheritance</a></li>
	<li><a href="http://hutchcodes.net/sharing-code-with-dependency-injection/">Dependency Injection</a></li>
</ol>
<h3> What are Linked Files?</h3>
Linked files are a way for two or more projects to both reference the same file.  One project generally keeps that file under it’s file structure, other projects reference the file there.  You can open the file from any of the projects as you normally would and edit it.  All changes are saved to the one file.
<!--more-->

<h3>Be Aware</h3>
<ul>
	<li>You need to manually link the files.  If you have 50 code files you want to share between project, you need to add those 50 files as links individually.</li>
	<li>If you rename a file that has been shared, you need to delete the old link and add the new link.</li>
</ul>
<h3>How do I do it?</h3>
Go through the regular process for adding an existing file, but after you’ve selected the file you need to select “Add as Link” from the dropdown at the bottom.

![add existing item dialog](/img/2015/linkfiles.png)
