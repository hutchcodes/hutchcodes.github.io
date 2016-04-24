---
layout: post
title: Blog Engines Compared
categories: [Random]
---

I loved WordPress in so many ways. There were hundreds of styles to choose from, a huge library of plugins, analytics, and performance problems. I'm not saying that WordPress can't be configured to give adequate (or even excellent) performance, but I either didn't have the knowledge or the money to do so. 
<!--more-->

**tl;dr:** I went with PieCrust CMS which is a static site generator. It's easy and it is fast as hell. The downside is no built in search, but we always have Google. 

*Disclaimer: I'm a .Net Developer and currently have some credits laying around in Azure so I was really looking to take advantage of that and so that probably limited my options.*

So, I went looking for other blog engines, and here's what I found.

I'm just going to list the blog engines I tried and why I didn't use them. This is roughly the order that I tried them and I might have landed somewhere else if I had gone in a different order.

###<a href="https://wordpress.org/" target="_blank">WordPress</a>###

This is where I started. WordPress is ubiquitous for a reason. It's really easy to get running and easy to operate. There's an enormous number of plugins and themes to choose from, and it can really run just about anything. I started on WordPress years ago exactly because it was easy.

The problem for me was performance. I was seeing page load times between 4-5 seconds, sometimes longer. I did put a lot of effort into optimizing WordPress. And I had some great success. I cut my page weight and number of requests by 75%, and my page load time dropped by more than half down to a hair less than 2 seconds. In the process I got really focused on performance and more importantly realized WordPress was much more than I needed.

###<a href="https://umbraco.com/" target="_blank">Umbraco</a>###

I actually played a key role in choosing this as the CMS system for a previous employer. It replace Dot Net Nuke, and the developers really liked it (I actually didn't develop with it). One of the things I was trying to get away from was the cost of a database. If a few years down the road I no longer have Azure credits, this option gets really expensive. I didn't even stand up an instance, but it might be worth investigating yourself.

###<a href="https://dasblog.codeplex.com/" target="_blank">DasBlog</a>###

If it's good enough for Scott Hanselman it's good enough for me right? Nope. I found the admin UI fairly impenetrable, or maybe I just didn't want to try to penetrate it. It just looked old and clunky. And it is old. A quick look at CodePlex shows it was last updated in 2012. I didn't give it a fair shake, I just moved on.

###<a href="https://ghost.org/" target="_blank">Ghost</a>###

This felt like a nice fast blog. And this is where I started to really start measuring. But I couldn't see how to setup a theme or modify the CSS. Did I need to FTP in, and make changes there? Again I just kind of moved on without giving it a fair shake. But I will say this, it was fast.

###<a href="http://dotnetblogengine.net/" target="_blank">BlogEngine.net</a>###

I was strongly considering going with BlogEngine.net. Aside from WordPress, it was the only one that had search built in. That struck me as a bit odd because I probably search my own blog 5-6 times per year. And use search on other people's blogs more frequently than that. It had some free themes, but nothing I really liked. While looking at building my own theme I stumbled on MiniBlog and since they are both built by Mads Kristensen (yes, of Web Essentials fame) and both use the same format for storing their posts I figured I'd use the newer MiniBlog and I could easily switch back if I decided I really wanted built in search.

###<a href="https://github.com/madskristensen/MiniBlog" target="_blank">MiniBlog</a>###

I really liked MiniBlog. It was really stripped down and really fast. I went as far as building out my whole theme (based on the theme I was using with WordPress). This is a big deal for me. I usually just hand anything CSS related off to a front end guy. I had chosen MiniBlog. I even had a few pull requests merged to fix some bugs I found (my first open source contributions!)

One of the things I really liked was Windows Live Writer integration. This was one of the biggest selling points. It also turned out to be the reason I ditched MiniBlog.

The nice thing about Windows Live Writer is that you can write locally then click the publish button and whoosh, your post is live. But the post was just stored on disk in the cloud. There wasn't any backup mechanism like I had with WordPress. And to make matters worse, I was modifying the source, so there was a chance that during one of my deploys I could wipe out my history.

The best I could come up with was to run locally, publish to the local instance from Windows Live Writer then push the whole thing live.

###<a href="http://code52.org/pretzel.html" target="_blank">Pretzel</a>###

This was my first look at static site generation. The idea is that instead of rendering the blog post when the user comes to your site you render it locally then push the rendered page up. The blogging is done in MarkDown.  It's pretty nice, and it's supposed to be a Jekyll clone, but there's not a lot of documentation or examples and some things from Jekyll that I tried didn't work.

###<a href="http://jekyllrb.com/" target="_blank">Jekyll</a>###

"Pretzel seemed to be missing some features, maybe I should try going right to Jekyll." - Me 45 minutes before giving up.

As I said at the start, I'm a .Net Developer. And though I think I could figure out how to get Ruby installed, and Jekyll and it's dependencies. After 45 minutes I gave up. If it's that hard to get to "Hello World", I'm not sure I want to go further.

Also, since posts are written in MarkDown, if I used another MarkDown based static site generator I'd have little trouble switching.

###<a href="http://bolt80.com/piecrust/" target="_blank">PieCrust</a>###

Like Pretzel and Jekyll, PieCrust is a static site generator. And it mostly "Just worked". I ran into a few problems, but when I reached out to it's author, <a href="http://ludovic.chabant.com/" target="_blank">Ludovic</a>, on twitter he responded with fixes and workarounds within an hour or two.

Again, it's a static site, so to create a post you create a MarkDown file in a specif folder (or tell PieCrust to create it for you).  Write your post in that file, then tell PieCrust to build the site for you. Then you upload the whole site.

And of course, since it's a static site, it's as fast as file transfer.  My home page is 36k and takes about a half second to load. I'm hoping you noticed ;)

The only downside is there is no built in search. Because it's static. I've seen some interesting workarounds doing a string matching search in clientside JS, but I went with Google. I think the only problem there would be recent posts might not be indexed. Trade-offs, there are always trade-offs.

