---
layout: post
title: Moving from AWS Cloudsearch to Azure Search
categories: [AWS, Azure]
date: 2016-10-03
published: true
---

We recently started moving from AWS to Azure. It's something I had been pushing for, but the reason we finally started was because of the ability to index and search documents stored in Azure Blob storage, so the first things to move have been document storage and search. We expect to move our website, API and SQL database next, but we haven't scheduled anything.

Below are some of the differences and lessons I found/learned in the process. I'll also try to post some specifics about each service we move for comparison sake.

<!--more-->

### Documentation

The first thing I noticed when moving from AWS to Azure is the documentation gap. Finding documentation and examples for AWS seems exceedingly difficult. Both at [docs.aws.amazon.com](http://docs.aws.amazon.com) as well as on [StackOverflow](https://stackoverflow.com) and through Google searches. 

In contrast both Google and StackOverflow both bring up the examples I need when searching for questions about Azure, but even better is the Azure documentation. When you create a new resource in Azure the first blade that opens in the portal has QuickStart icon ![QuickStart Icon](/img/2016/QuickStart.png) that will take you to the documentation including example code for how to create and interact with the services.

### API
The next thing I noticed is that with AWS almost everything we're doing is going through their REST API, with almost nothing happening through their SDK. I suspect that at least some of this has to do with how the original developer implemented it in our product. But some of the blame goes to AWS because the examples of how to interact with their services are by default through their REST API, and it takes some digging to find any documentation on how to do the same through their .NET SDK.

Also, the AWS .NET SDK is really just a wrapper around their REST API to the point that when uploading a document to Cloudsearch you upload an ```UploadDocumentRequest``` object which has 3 properties:

    - ContentType (JSON or XML)
    - Documents (System.IO.Stream of JSON or HTML representation of documents)
    - FilePath (Path to a JSON or HTML representation of documents)

So they basically have an SDK that takes some strings.

In contrast, Azure's SDK allows you to upload an ```IndexAction<T>```. You create a strongly typed object, pass it to the SDK and it maps itself to your search index.    

### Organization
Both Azure and AWS have something called Resource Groups, but they aren't really the same thing. In Azure Resource Groups are required when creating a service. I created Dev, Test and Prod Resource Groups in Azure to keep our services organized. Each service can only be in one Resource Group, so even though we have all our environments piggy backing on our Production search instance (separate indexes), that Search service can only live in one Resource Group. I put it in Prod so no one does anything stupid.

In AWS Resource Groups are optional. We haven't been using them, but they look pretty neat. It's all based on Tags, so one resource could be in multiple groups. You can also require multiple tags when selecting the items in a resource group. Again, we're not using this feature but I assume that if I add a new service with a tag that is already part of a group that service will just appear in that group.

The one thing Azure Resource Groups has been invaluable for is experimenting. Want to play around or build a demo? Create a resource group for that, when you're done, delete the Resource Group and all of your services are automatically deleted for you.

Azure also has the concept of Tags, but I couldn't find a way to view the intersection of 2 tags. 

### Correct Me If I'm Wrong
Did I get something wrong here? Did something change? Let me know and I'll get this updated.