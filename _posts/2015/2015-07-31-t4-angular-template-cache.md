---
layout: post
title: T4 Angular Template Cache
categories: [Angular, T4]
date: 2015-07-31
published: true
---

There's a few ways to handle you're angular directives and they all suck for different reasons.

### Store them inline in your directives
The advantage to this method is you don't have to make a separate web request, and it's the simplest way to approach templates. This is where I started putting my templates, and I continue to put some templates here if they are very small and more important, simple.
<!--more-->

The downside is that your HTML is stored as strings, so you lose any syntax highlighting and checking your IDE might provide. It can also result in some duplication if by chance you have two directives that would have the same HTML, but different logic, but that's probably an edge case.

### Store each in it's own HTML file
This basically the exact opposite side of the coin from storing them inline.  You have to make a separate request, but you pick up the syntax highlighting and checking from the IDE.

This is what I used for larger templates when they become too big or complex to keep inline. 

### Add them to the template cache 
This option can avoid the extra HTTP request assuming you either put all your templates in one file, or bundle all the template JS files. But again, your templates are strings, so you lose all IDE support.

~~~ javascript
$templateCache.put('templates/search', 
    '<input type="text" ng-model="searchText" ng-enter="search()"/>'
);
~~~ 

## Best of Both Worlds Through the Magic of T4
With a fairly simple T4 script we can store our templates in their own separate HTML files the way we want to work while developing. Then on build we can process those files to generate a single script file with all of the templates in it the way we want to deploy.

~~~ csharp
<#@ import namespace="System.Diagnostics" #>
<#@ import namespace="System.Linq" #>
<#@ import namespace="System.Collections" #>
<#@ import namespace="System.Collections.Generic" #> 
<#
#>
appModule.run(['$templateCache', function($templateCache) {
<#
	var projectPath = Directory.GetCurrentDirectory();

	if (projectPath.EndsWith(@"\bin"))
	{
		projectPath = projectPath.Substring(0, projectPath.Length - 3);
    }
	else
	{
		projectPath = Host.ResolvePath("");
		projectPath = projectPath.Substring(0, projectPath.Length - 11);
    }

	var templateDirectory = new DirectoryInfo(projectPath + @"templates");
	var files = templateDirectory.GetFiles("*.html");

	foreach(var file in files)	
	{
		
		var reader = file.OpenText();
		var template = "";
		while(!reader.EndOfStream)
		{
			var line = reader.ReadLine();
			template = template + line.Replace("'", @"\'");
        }

#>
$templateCache.put('templates/<#= file.Name #>', '<#= template #>');
<#}#>
}]);
~~~

### A Couple of Things Worth Noting in This Script
1. The line `if (projectPath.EndsWith(@"\bin"))` is checking where we are running. If the path doesn't ends in `\bin`, we know we're building from inside Visual Studio and can use `Host.ResolvePath("")` to get the directory the `.tt` file is running and walk back from there `substring` isn't ideal, but the traditional `..` didn't work so...).

If we're running from outside Visual Studio we get the bin directory and just need to back up from there.

2. After that we just get the list of `*.html` files, read then into strings and add those strings to the cache.

3. Notice that I include the whole file name as my template name. This means that if my directive already had `templateURL: 'templates\search.html'` it will find that template in the `templateCache` and not make a request to the server.

### Running the Template on Build

I added a Pre-Build Event to do the transform. I did this so that the template.js that is checked into source control matches what is in production. And to make sure any changes made to the HTML files are automatcially included. 

~~~ common_lisp
"%PROGRAMFILES(x86)%\Common Files\microsoft shared\TextTemplating\11.0\TextTransform.exe" $(ProjectDir)Scripts\App\Templates.tt
~~~

### For Easier Debugging
Lastly, for easier debugging I added a compiler directive in my bundle config  around the `templates.js`.

~~~ csharp
    bundles.Add(new ScriptBundle("~/bundles/app.js").Include(
        "~/Scripts/app/app.js",
#if !DEBUG
        "~/Scripts/app/Templates.js",
#endif
~~~

This means that when I'm working locally in `DEBUG` mode I can load the template straight from the HTML and not have to worry about re-running the T4 Transform after every change. That keeps my loop short during development and keeps the number of requests down during production.