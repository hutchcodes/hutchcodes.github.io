---
layout: post
title: Random Value Per Row in SQL
categories: [Sql]
date: 2019-01-08
published: true
codeproject: true
---

Occasionally you need to update a table with a random value per row. And thanks to some optimizations SQL Server does, it's not exactly straight forward.

<!--more-->

If you just try to update with a random value like this, every row ends up with the same 'random' value.

~~~ sql
update MyTable
   set SomeValue = rand()   
~~~

This is because SQL Server only runs the `rand()` once because it doesn't depend on any value from the row. My next thought was to see the `rand()` with a value from each row.

~~~ sql
update MyTable
   set SomeValue = rand(Id) --Where Id is in Int
~~~

This wasn't as random as I had hoped. Since my `Id` column was an identity column the 'random' numbers were almost sequential as well. For example, I got the following 'random' numbers for the following `Id` values:

 Id | Rand(Id)
----|----
101 | 0.715436657367485
102 | 0.715455290338744
103 | 0.715473923310002
104 | 0.715473923310002

So, I needed to come up with a way to get the seed value to vary for each row. So I decided to get the MD5 hash of the `Id` column.  

~~~ sql
update MyTable
   set SomeValue = rand(HASHBYTES('md5', convert(varchar, Id))) 
~~~

That results in these values:

 Id | rand(HASHBYTES('md5', convert(varchar, Id)))
----|----
101 | 0.954016112182829
102 | 0.249482833129777
103 | 0.863832691946289
104 | 0.751055796147016

And that was random enough for my needs.



