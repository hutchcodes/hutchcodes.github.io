---
layout: post
categories: [C#]
title: Burned by Ternary Operators
---
<p>First let me say that I&rsquo;m not a fan of ternary operators.&nbsp; I try to avoid them because I feel that an explicit if/else is much more readable.&nbsp; I do use them on occasion and this seemed like the perfect place for them.</p>
<p>I ran into a interesting problem while trying to get a Linq where clause to work with ternary operators.&nbsp; <!--more--> In hindsight the problem is pretty obvious, but it stumped me and one of my coworkers for a few minutes.&nbsp; It wasn&rsquo;t until we solved the problem in a different way that I realized what I had initially missed.</p>
<p>First the setup:</p>

~~~cs
var books = new List<Book>();
books.Add(new Book { Title = "To Kill a Mockingbird", Description = null });
books.Add(new Book { Title = "Catcher in the Rye", Description = null });
~~~

<p>There where clause I was building was part of some basic search functionality.&nbsp; It would take a passed in value and check to see if the Title or the Description contained that value:</p>

~~~cs
var qry = books.Where(u =>;
        u.Description == null ? false : u.Description.ToUpper().Contains(searchStr)
        || u.Title == null ? false : u.Title.ToUpper().Contains(searchStr)
        );
~~~

<p>Attempts to search for the letter T were returning no results.&nbsp; Like I said, I struggled with it, called in a second set of eyes and they couldn&rsquo;t see the problem.&nbsp; We then re-wrote where clause like this:</p>

~~~cs
var qry = books.Where(u =>;
        (u.Description != null &amp;&amp; u.Description.ToUpper().Contains(searchStr))
        || (u.Title != null &amp;&amp; u.Title.ToUpper().Contains(searchStr))
        );
~~~

<p>This returned 2 results as expected.&nbsp; After a bit of rumination I realized the problem was my lack of parentheses.&nbsp; I thought I had written this:</p>

~~~cs
var qry = books.Where(u =>;
        (u.Description == null ? false : u.Description.ToUpper().Contains(searchStr))
        || (u.Title == null ? false : u.Title.ToUpper().Contains(searchStr))
        );
~~~

<p>When I had essentially written this:</p>

~~~cs
var qry = books.Where(u =>
        u.Description == null ? false : 
                (
                u.Description.ToUpper().Contains(searchStr)
                || u.Title == null ? false : u.Title.ToUpper().Contains(searchStr)
                )
        );
~~~

<p>This was clearly just my misunderstanding of how ternary operators are interpreted, and I&rsquo;m unlikely to ever forget this, but I&rsquo;m also going to continue to avoid ternary operators wherever I can and encourage others to do the same.</p>

