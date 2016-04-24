---
layout: post
title: Prematurely Optimizing My Blog
categories: [Random]
---

This blog isn't what you'd call 'high traffic'. My big problem wasn't load, it was keeping the site 'warm', so each user didn't have to wait for WordPress to spin up and before serving the first page. Of course once I started looking at performance I went fully down the rabbit hole <!--more--> and came out on a different [blogging platform](http://hutchcodes.net/blog-engines-compared/).  

I have an MSDN subscription and some unused Azure credits, so the first thing I did was move my WordPress site to Azure.  It was as simple as spinning up an WordPress site on Azure through the wizard, exporting from my old site and importing at the new one. I used the azure credits to host it in an 'Always On', Small, Basic, Web Application paid for by Azure credits. I quickly learned that the free MySql DB provided needed to be upgraded to a paid level costing $10/month.

I actually perceived this to be slower, especially in the admin screens which frequently took 7+ seconds to load. The main site was a little faster.

![Wordpress non-optimized performance on Azure](/img/2015/WordPressPreOpt.png)


I wasn't worried about the slow admin screens (though it was driving me crazy), but I did want to improve speed for users.

I added a [W3 Total Cache](https://wordpress.org/plugins/w3-total-cache/) which was supposed to be able to handle bundling, minifying CSS and JavaScript, moving script tags to the end of the page, and caching the site to static pages. It failed both on bundlig, minifying and moving the tags (I also tried other caching plugins which failed similarly.

I added [Autoptimize](https://wordpress.org/plugins/autoptimize/) which bundled and minified the CSS and JavaScript. And I added [Speed Booster Pack](https://wordpress.org/plugins/speed-booster-pack/) which moved my script files to the end of the page.

At the end of all this I had decent performance.

![Wordpress non-optimized performance on Azure](/img/2015/WordPressOptCold.png)

I was still getting things flagged by Google's [PageSpeed](https://developers.google.com/speed/pagespeed/insights/) as well as in [YSlow](http://yslow.org/).  There were things that I just couldn't easily control that I really wanted to fix. And it started to bother me that I had increased my hosting costs when I was expecting them to decrease.

I looked at a bunch of [blogging platforms](http://hutchcodes.net/blog-engines-compared/) and ended up settling on [PieCrust CMS](http://bolt80.com/piecrust) which is a static site generator.

A static site generator creates you're site in plain HTML on your machine and you upload that to your webhost. You can serve it out of any web host, or some interesting alternatives like Amazon S3, DropBox, or the one I eventually settled on [GitHub Pages](https://pages.github.com/).

Once I went to a static site, performance went through the roof. First I tried hosting it in Azure in a a Small, Basic, Web Application.

![Static Site n Azure](/img/2015/AzureWeb.png)

This is where I started to get a little obsessive. I tried putting a CDN in front of my static site in Azure.

![Static Site on Azure with CDN](/img/2015/AzureCDN.png)

Then just for giggles I tried GitHub Pages. And was shocked to see it was faster still

![Static Site on GitHub](/img/2015/GitHub.png)

>Your website is **faster than 99%** of all tested websites

I should have stopped there, but I felt there was still a lot I could do. I removed all the fancy web fonts. I returned excerpts instead of full posts. I removed FontAwesome and instead hunted down jpegs for the few social icons. I stripped out any unused CSS.

I brought the total pageweight down 297k to 39k and reduced the number of requests by 18. In the end my results were almost everything I hoped for.

![Static Site optimized on GitHub](/img/2015/Final.png)

You'll notice my score is still **88/100**. This is because GitHub pages doesn't let you set `expires headers`, so assets you should only have to request once (my picture, social icons, css and js) get requested every time and every the response is [304](http://httpcats.herokuapp.com/304)

I'd love to see that fixed, but I think it's time to leave well enough alone, besides I have this to hang my hat on

>Your website is **faster than 100%** of all tested websites

*The look and feel of my new website is essentially the same as it was when on WordPress. It's based on the [Author](https://wordpress.org/themes/author/) theme.*
