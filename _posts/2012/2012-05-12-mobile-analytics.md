---
layout: post
categories: [Mobile]
title: Mobile Analytics
---
<p>In my previous <a href="http://hutchcodes.net/microsofts-app-reporting/" target="_blank">post</a> I complained about the 6 day delay in getting download number from Microsoft. &nbsp;Since then I have done a little bit of research into other ways of getting that information in a more timely manner. &nbsp;I found two good options <a href="http://mtiks.com/" target="_blank">MTIKS</a> and <a href="http://www.flurry.com/" target="_blank">Flurry</a>. &nbsp;They both provide much more information than I was looking for from Microsoft, and I will be using one or the other unless I find something better.</p>
<!--more-->

<p>They are both very easy to use. &nbsp;All you need to do is add a reference to their dll, then add one line of code to Application_Launching and Application_Activated to tell them to start a session, and another line to Application_Deactivated and Application_Closing to tell them to end the session.</p>
<p>They both also allow you to report exceptions and events. &nbsp;This would allow me to see how many problems users are playing, or what percentage of users turn off time based scoring in Chess Tactics.</p>
<p>Of course each has their strength and weakness.</p>
<p><strong>MTIKS</strong></p>
<p>MTIKS biggest strength is that it can detect pirated apps so you can see how big of a problem pirated apps are for you. &nbsp;My apps are all free at this point, so I&rsquo;m not worried about pirates, and this feature isn&rsquo;t a great selling point for me.</p>
<p>The other thing I really like about MTIKS was that it was real time (or very close to it). &nbsp;I could start up a session in the emulator, click refresh on their site and see the session.</p>
<p>The one problem I did see with MTIKS is in their exception handling. &nbsp;The stack trace gets overwritten if you log the error for Application_UnhandledException. &nbsp;I contacted them about this and they responded quickly and are looking into the problem. &nbsp;I&rsquo;ll update this when they fix it.</p>
<p><strong>Flurry</strong></p>
<p>Flurry looks like it does a great job on the reporting side. &nbsp;They allow you to compare your app to the aggregate data of other apps collecting the same info. &nbsp;It lets you segment your reporting based on your users age, gender, language, location and even custom events (user who clicked the review this app button for example). &nbsp;If you&rsquo;re not collecting this information, Flurry will make some estimates for you.</p>
<p>The downside here is that Flurry runs on a about a 1 hour delay. &nbsp;I of course would prefer instant gratification, but 1 hour isn&rsquo;t too long to wait. &nbsp;Right now I&rsquo;m facing a 6 day delay in download numbers and a 3 day delay in exception reporting, so one hour seems totally resonable.</p>
