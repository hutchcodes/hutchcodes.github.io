---
layout: post
title: Removing Items From a List
categories: [C#]
date: 2018-08-08
published: true
codeproject: true
---

It's not at all uncommon to need to iterate through a List to remove an item. And about half the time when I do so I get a "Collection was modified; enumeration operation may not execute." exception the first time I run the code. Then I do something fancy like use a for loop to iterate through the list backward and remove the items from the list. Something like this:

<!--more-->

```
var foo = new List<string>();
foo.Add("Fizz");
foo.Add("Zebra");
foo.Add("Buzz");
foo.Add("Bazz");

for(var i=foo.Count()-1; i>=0; i--)
{
    if (foo[i].Equals("Zebra")){
        foo.Remove(foo[i]);
    }
}
```

But somehow after an embarrassingly long time of doing that I've found a much simpler way, that I suspect everyone else has known about for a while, but just in case, here it is.

Just take your list and cal `ToList()`, iterate through the new list and remove items from the original.

```
foreach (var s in foo.ToList())
{
    if (s.Equals("Zebra")){
        foo.Remove(s);
    }
}
```

Of course, this technique may have some memory or performance consequences. If I run into a case where that becomes a problem I can go back and optimize then. From here forward I'll optimize for readability.