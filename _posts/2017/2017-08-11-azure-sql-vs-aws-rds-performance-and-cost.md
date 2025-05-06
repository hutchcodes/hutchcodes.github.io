---
layout: post
title: Azure SQL vs AWS RDS Performance and Cost	
categories: [Azure, AWS, Sql]
date: 2017-08-11
published: true
codeproject: true
---

I've been doing a series of blog posts comparing Azure and AWS services that I've used in production. This post is before production usage, but I've been researching and experimenting in preparation for proposing moving our databases to Azure and wanted to share my results so far.

Before I could propose this move I needed to understand the cost differences. To do that I needed to know which level of Azure SQL was equivalent to our m1.medium instance at AWS.

**tl;dr** 

An AzureSQL Standard Tier S3 database performs is about 7% faster than a SQL Server SE 2008 R2 database running on an m1.medium instance of AWS RDS. Price comparison are hard because AWS RDS has a sea of options to choose from, but if you meet the requirements for SQL Server Web licensing then pricing is similar.
  
<!--more-->

### Performance
Performance in Azure is measured in DTUs (Database Transaction Units), a 100DTU database is twice as powerful as a 50DTU database and ten times as powerful as a 10DTU database. 

At AWS you are purchasing an EC2 instance with SQL Server installed. They provide some guidance about how various instance will perform via their ECU ratings (EC2 Compute Unit), but it's pretty coarse. An m1.Large is rated at 2ECU, and an m1.medium is 1ECU, but an m1.small is also rated 1ECU and is ~half as fast as the m1.medium, so it's not a great comparison.

Since AWS and Azure don't use the same measure for performance I did some benchmarking with [TPCCBench](https://github.com/SQLServerIO/TPCCBench). This tool runs an industry standard workload against a database. I ran it without the "thinking time" that the official TPC-C benchmarks would normally run with, but it with the same settings on both clouds.  

On Azure I benchmarked a ton of different performance levels. All the way from Basic(5DTUs $5/month) up to a the Premium P15(400DTUs $16,000/month). As advertised, the performance at different levels went up in lockstep with the DTUs. A 100DTUs is ~10 times as fast as 10DTUs. When I got up to the Premium tiers, the load test utility couldn't max out the instances. So at 250DTUs I was only able to use ~85% of the DTUs and with the P15 4000DTU instance I was only able to ~7% of the DTUs.  

On AWS there you can choose from Express, Standard, Web and Enterprise licensing for SQL Server. These all have different costs, but should perform the same for the loads we're looking at (look for someone to correct me in the comments). You can also choose between versions from 2008 R2 up to 2016, but once you get to 2016 you start to be limited in which EC2 instances you can choose. 

I only benchmarked m1.small and m1.medium instance running SQL Server SE 2008 R2 on AWS because that's all I had standing up at the time, and though I wouldn't mind looking at the performance of some other instance sizes and SQL versions, I didn't have time/money to go through the setup and config.

| Cloud | Tier/Pricing Level | Orders/min 
| :- | :- | -:|
| AWS | m1.small | 2875| 
| AWS | m1.medium | 5690 | 
| Azure | Standard S3 (100 DTUs) | 6103 | 
| Azure | Standard S2 (50 DTUs) | 3051 |

Our production database runs on SQL Server SE 2008 R2 on an m1.medium instance, that load can easily be handled by an AzureSQL Standard Tier database with 100DTUs (either an S3 or as part of an Elastic Database Pool). That answers my first question.

### Costs
Both licensing and instance size play into pricing on AWS. We are running SQL Server SE which costs $575/month for an m1.medium. If we ran SQL Server Web instead that would cost $195/month. If we used SQL Server Web on an  m3.medium we would it would cost $150/month.

There are two pricing models in Azure. One is a Single Database pricing, the other is Elastic Database. With Elastic Database pricing the DTUs can be shared between multiple databases. This is similar to having multiple databases on one instance in AWS.  

| Cloud | Tier/Pricing Level | $/month | Notes
| :- | :- | -:| :- 
| AWS | m1.small SQL Server Express | 67| Our dev/test environment 
| AWS | m1.medium SQL Server SE| 575 | Our prod environment
| AWS | m4.medium SQL Server Web| 196 | What we should be running our prod environment on
| AWS | m4.large SQL Server Web| 229 | What we'd need to run our prod environment to use SQL Server 2016
| Azure | Standard S2 (50 DTUs) | 75 
| Azure | Standard S3 (100 DTUs) | 150  
| Azure | Elastic (50 DTUs) | 112 
| Azure | Elastic (100 DTUs) | 225  

As you can see the cost of AWS RDS varies greatly based on the licensing. If you're running a publicly available website with a single database the cost is the same at both AWS and Azure. If your DB is for an internal application Azure is much cheaper. If you have multiple databases AWS might be cheaper, would be cheaper than the same power in Azure Elastic DB, but if you can split those database into two S2s or 10 S0s the cost is the same. 

I'm not sure how we'll manage our database in Azure. We may be able to run our dev\test database on the Basic tier (5DTU $5/month) or the Standard S0 tier (10DTU $15/month), or maybe it would make more sense to put them all in a 50DTU elastic pool ($112/month). For production we'll probably start out with a Standard S3 for our main DB and a Standard S0 or S1 for our auditing DB. Then depending on the loads scale them back or possibly put them in an Elastic Pool together.

### Conclusion

The people I spoke with who dodged the question and told me I needed to do my own testing were right. In the end there are too many variables on the AWS side to make a comparison. If you're considering moving from one cloud to the other you're going to have to get a benchmark tool and benchmark where you are coming from and where you think you might end up. I'm thinking of a follow up post to cover the actual steps I took in benchmarking.

### This ain't science
I can see that I'm not comparing apples and oranges on a few levels here. AzureSQL isn't running SQL Server SE 2008R2, it's running something closer to but not exactly SQL Server 2016. Maybe upgrading RDS to SQL Server 2014 would have provided better results. I also compared SQL Server Express on an m1.small to SQL Server SE on the m1.medium again not ideal.

In the end I just compared what I was currently using in AWS to see where it would fit in Azure.