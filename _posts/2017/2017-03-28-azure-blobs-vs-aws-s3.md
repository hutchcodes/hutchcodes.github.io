---
layout: post
title: Azure Blobs vs AWS S3
categories: [Azure, AWS]
date: 2017-03-28
published: true
codeproject: true
---

Part of my ongoing series comparing AWS and Azure for the services where I've used both in production. In this post I'll be looking at the differences between Azure Blob Storage and Amazon S3 for storing and retrieving files. 

**tl;dr**

- Azure's logical structure allows you to manage multiple *containers* at the same time. 
- AWS allows default documents and with that you can host a static site for pennies per month in S3.
- Azure Blob can integrate Azure Search to allow searching the content of some documents   

<!--more-->

### Management
In Azure Blob you have a *Storage Account*, within that storage account you can store Blobs, Files (think shared drive), Tables and Queues.  Within the Blobs you have logical groupings called *Containers*.  *Containers* are roughly equivalent to AWS S3 *Buckets*.

In both AWS and Azure you can exposes these *Containers*\*Buckets* publicly or require a key to access them. The urls look like this:

s3.amazonaws.com/[*BucketName*]/[*FileName*]

[*StorageAccount*].blob.core.windows.net/[*Container*]/[*FileName*]

Notice that *StorageAccount* becomes the sub-domain while all *buckets* are under the same S3 domain. This means that bucket names must be unique in AWS, while in Azure it is the Storage Account Name that must be unique.

This means with Azure you can create dev/test/prod Storage Accounts and keep the Container names consistent. So if you have multiple buckets that is less you need to manage when switching environments.

AWS S3 manages everything at the *Bucket* level. So if you have 3 buckets that all have the same access rules, you need to manage those rules 3 times. In Azure Blob you could put all those *Containers* in the same *Storage Account*, and manage them once. Multiply those 3 *Buckets* by 3 environments (dev/test/prod) and you're starting to save quite a bit of time managing permissions with Azure Blob.

### Uploading/Downloading Documents

In previous comparisons I've gotten into the differences in working with the services through the SDKs. In this case they are both very similar, and straight forward. Azure does require an extra step because you need to get a reference to the *Storage Account* before getting the reference to the *Container*, but it's a single line of code.

### Static Website Hosting

AWS S3 lets you host a static website in an S3 Bucket. To do this you set a default document, and if a request is made to the root of the bucket or to a "folder" it will try to return the default document. 

This is something that Azure does not have. It was request 3 years ago and they now have it on their backlog. You can vote it up or check the status [here](https://feedback.azure.com/forums/217298-storage/suggestions/6417741-static-website-hosting-in-azure-blob-storage).

### Document Searching

Azure Blob Storage can be integrated with Azure Search allowing you to search the contents of stored documents including PDF, Word, PowerPoint and Excel documents. Doing this in AWS required a 3rd party services that cost $36k for the first year. This feature was the driving force in our move from AWS to Azure.

The documentation for [Searching Azure Blob Storage](/2016/10/aws-cloudsearch-to-azure-search/) is execellent.

### Summary

AWS S3's main advantage is that you can host a static site very cheaply, but that advantage looks like it is going to have a short shelf life. 

If hosting a static site isn't your goal Azure Blob Storage's streamlining of management and it's ability to search the contents of it's documents are big advantages.  






