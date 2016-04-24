---
layout: post
categories: [C#]
title: 401 Unauthorized error on MERGE operations IIS 7 with WCF Data Service
---
<p>I was getting this error when using WCF Data Services and trying to save an update to an object. &nbsp;After quite a bit of googling, I found a work around that I didn&rsquo;t like. &nbsp;Allow the users write access to the .svc file.</p>
<p>I have a hard time believing that anyone would accept &ldquo;allow the user write access to the file&rdquo; as an answer in web situation. &nbsp;In my case I was able to use that as a temporary fix because the website in question was internal and behind a firewall, but I knew there had to be a better answer.</p>
<!--more-->

<p><strong>UsePostTunneling</strong></p>
<p>Post tunneling allows you to use your REST service with just the Post and Get verbs, and puts a little something extra in the header so that the service knows to treat the Post as a Merge, Put or Delete verb. &nbsp;For WCF Data Services, all you need to do is set the UsePostTunneling property on the Context to true.</p>
<p>Here&rsquo;s sample code from anonymized from my dataservice factory:</p>
<p></p>

~~~ cs
public static MyDataSvc.MyDataEntities GetDataSvc()
{
    Uri SvcUri = new Uri(string.Format("http://myserver.com/", "dataservice.svc"));
    var context = new MyDataSvc.MyDataEntities (SvcUri);
    context.UsePostTunneling = true;
    return context;
}
~~~ 
