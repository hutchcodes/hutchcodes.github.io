---
layout: post
categories: [Angular, JavaScript]
title: AngularJS URLs missing trailing slash
---
I ran across this problem trying to deploy an Asp.Net MVC website with an AngularJS front end. &nbsp;Everything worked fine as long as the site was deployed as it's own website within IIS, but when we deployed to an Application folder within an existing site things started going wrong.

The problem was that the URLs were not getting their trailing slashes properly. &nbsp;IIS adds a trailing slash&nbsp;to URLs when the last segment of the address refers to a folder rather than a file.
<!--more-->

<a href="http://somesite.com/AngularApp">http://somesite.com/AngularApp</a> should have been converted to&nbsp;<a href="http://somesite.com/AngularApp/">http://somesite.com/AngularApp/</a>

Since it wasn't getting converted I was getting <a href="http://somesite.com/AngularApp#/">http://somesite.com/AngularApp#/</a> rather than&nbsp;<a href="http://somesite.com/AngularApp/#/">http://somesite.com/AngularApp/#/</a>

The fix I settled on was to check the URL of the request when it came in and if it matched the root url, but didn't have the trailing slash, add the trailing slash. &nbsp;I just added the following code to the Global.asax

~~~ csharp
protected void Application_BeginRequest()
{
    if (Request.ApplicationPath != "/" 
            && Request.ApplicationPath.Equals(Request.Path, StringComparison.CurrentCultureIgnoreCase))
    {
        var redirectUrl = VirtualPathUtility.AppendTrailingSlash(Request.ApplicationPath);
        Response.RedirectPermanent(redirectUrl);
    }
}
~~~

