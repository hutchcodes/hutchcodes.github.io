---
layout: post
categories: [NoSql]
title: My First NoSQL Table
---
I come from a relational database background. Specifically I’ve been using Microsoft SQL for 18 years. At this point data modeling for a relational database is second nature.  Data modeling in NoSQL on the other hand has been somewhat mysterious to me. I’ve read up on some of the strategies for where to break NoSQL data into separate tables, but have had little real world experience.
<!--more-->

The lack of real world experience has been two-fold. First I haven’t seen a NoSQL database designed by someone who <em>really</em> knew their NoSQL data modeling, and I haven’t done much NoSQL data modeling which might allow me to see where things become problematic from being too normalized or too denormalized.

At my job we are using some NoSQL (AWS DynamoDB). The main application uses an MSSQL database and we mostly use DynamoDB for it’s ability to replicate some performance critical data across regions so that our European customers don’t have the latency of crossing the Atlantic for everything.

But, recently I had a bit of an epiphany when I was adding a rule builder to our project. Each rule could have multiple conditions and groups of conditions., and the groups could also contain other groups. By default I put the data into a Rules, Groups, and Conditions tables in the database.  That was working fine initially, but the recursion started to become a problem.

Recursive data structures can be problematic in SQL. You need do a series of left joins for each level of recursion, and you need to decide in advance how many levels of recursion you’re going to allow.

~~~ sql
select *
  from Rules r
  left join Conditions c1 on r.RuleId = c1.RuleId --Level 1 Conditions
  left join Groups g1 on r.RuleId = g1.RuleId --Level 1 Group
  left join Conditions c2 on r.GroupId = c1.GroupId --Level 1 Group Conditions
  left join Groups g2 on g1.GroupId = g2.ParentGroupId --Level 2 Group
  left join Conditions c3 on r.GroupId = c3.GroupId --Level 2 Group Conditions
~~~

To do this with Entity Framework you need to do something like

~~~ csharp
var rules = from rule in db.Rules
    .Include("Conditions, Groups.Conditions, Groups.Groups.Conditions")
    select rule;
~~~

You could of course lazy load the groups and conditions, but that’s a recipe for performance disaster. This is going to be the classic <a href="http://www.davepaquette.com/archive/2013/02/05/writing-efficient-queries-with-entity-framework-code-first-part-1.aspx" target="_blank">N+1 problem</a>, only since it’s recursive it’s the N1+N2+N3+1.

After a night of chewing on the problem I decided that the answer was to store the Rules in DynamoDB. I simply created a Rules collection and plopped the whole Rule right in. Each rule is now one object in the a NoSQL table. No joins necessary and no worry about N+1 performance issues.

It’s so blindingly obvious in hindsight that I’m surprised I never thought of it before, and I almost certainly won’t attempt to store a recursive data structure in a relational database again.

