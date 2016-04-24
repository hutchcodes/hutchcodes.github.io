---
layout: post
categories: [C#, Mobile]
title: WP7 Application Capabilities
---
<p><a href="http://wmpoweruser.com/95-of-wp7-apps-can-access-the-internet-13-can-make-calls-and-16-can-track-you/" target="_blank">WMPoserUser</a> posted some interesting stats on what capabilities applications are requesting.&nbsp; Interesting stuff, but they clearly haven&rsquo;t published an app, or at least not an ad supported app.</p>
<p>First let me say that I have only published a single app so far, so I&rsquo;m not some amazing expert.&nbsp; My app, <a href="http://www.windowsphone.com/en-US/apps/225f7d20-6067-49ee-9142-b4b89658b4b2?wa=wsignin1.0">Chess Tactics</a>, doesn&rsquo;t actually need any capabilities by itself.&nbsp; That being said I have quite a few capabilities listed.&nbsp; Most of these capabilities are required by Microsoft<!--more-->&rsquo;s ad control, with one additional capability required by <a href="http://mtiks.com/">MTIKS</a> (a utility I&rsquo;m using usage and error detail).</p>
<p>Here&rsquo;s my capabilities list and why I include it and why I think it&rsquo;s required:</p>
<ul>
<li>Phone Dialer
<ul>
<li>MS Ad Control &ndash; so you can dial a phone number direct from an advertisement</li>
</ul>
</li>
<li>Networking
<ul>
<li>MS Ad Control &ndash; to download ads for display and report any clicks</li>
<li>MTIKS &ndash; Send data back for reporting</li>
</ul>
</li>
<li>Web Browser
<ul>
<li>MS Ad Control &ndash; to display the ads</li>
</ul>
</li>
<li>User Identity
<ul>
<li>MS Ad Control &ndash; to track what the users interests are across apps</li>
<li>MTIKS &ndash; Track user loyalty across app versions and user device upgrades</li>
</ul>
</li>
<li>Media Library
<ul>
<li>MS Ad Control &ndash; No idea at all</li>
</ul>
</li>
<li>Device Identity
<ul>
<li>MTIKS &ndash; To track what devices are using my app in case a particular one become problematic</li>
</ul>
</li>
</ul>
<p>None of these capabilities indicate an app is trying to do anything nefarious.&nbsp; I would expect pretty much every app to need these capabilities.&nbsp; Now if an app wants access to my microphone, it better have a damned good reason.</p>
<p>Between collecting stats, serving ads, and apps that use network service to provide value, I think it&rsquo;s out of line to say that 95% requesting network services is &ldquo;larger than necessary&rdquo;.&nbsp; In fact, it makes me wonder what the 5% of apps that don&rsquo;t require network access are.</p>
<p>If you know why the MS ad control needs access to the Media Library please let me know in the comments.</p>
