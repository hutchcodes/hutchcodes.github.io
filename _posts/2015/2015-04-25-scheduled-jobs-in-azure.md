---
layout: post
categories: [Azure]
title: Scheduled Jobs in Azure
---
Have a process you need to run periodically on your Azure hosted application? It’s simple to do with Azure Scheduler.

From the Azure Management screen (not currently available in the new portal) click New-&gt;App Services-&gt;Scheduler-&gt;Custom Create
<!--more-->

![create schedule](/img/2015/Scheduler.png)

This will open up the job creation wizard.  First you need to create a Job Collection.  You can choose your region, you probably want it to be located in the same Region as your Web Site, but you may have a reason you want it hosted somewhere else.

![Create job](/img/2015/Schedule11.png)

Give your job a name, select the type of job HTTP, HTTPS, or Storage Queue.  For this example I’ve just chosen an HTTP Get call to a URL that doesn’t actually exist on my blog.

![Job Action](/img/2015/Schedule2.png)

Then select the schedule.

![Define Schedule](/img/2015/Schedule3.png)

So in this example the Azure Schedule is going send a Get request to /jobs/dostuff every minute.  All I need to do is implement what I need done in that controller action.

A couple things to note:
<ul>
	<li>By default it puts you on the Standard plan which is $13.99/month.  You can use the free tier if you have 5 or less jobs and they don’t need to run more frequently than hourly. You need to edit the job after you create it to switch to the Free tier.</li>
	<li>When you’re editing a job you have the option to add headers and/or basic auth.</li>
	<li>You can call any public URL, so you're not limited to only calling URLs that are hosted on Azure.</li>
</ul>

