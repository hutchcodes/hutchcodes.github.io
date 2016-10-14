---
layout: post
title: AWS Cloudsearch vs Azure Search
categories: [AWS, Azure]
date: 2016-10-12
published: true
---

We recently started moving some of our bits from AWS to Azure. One of the first bits to go was the Search. Below is my comparison of the two.

### tl;dr
Azure has the ability to automatically index data stored in SQL, DocumentDB, and Azure Table Storage as well as documents stored in Azure Blob Storage. Azure's API is strongly typed and much more expressive than AWS's.

<!--more-->

### Document Searching
This is a huge gap that AWS Cloudsearch currently has and is the whole reason we started moving to Azure. We needed to be able to search the contents of PDFs and Word Documents. In order to do this with AWS, we had 2 choices:

1. Buy a 3rd party library to allow us to read the contents out of the documents.
2. Pay for a service to watch our S3 storage and update a CloudSearch index for us.

The first option was prohibitively expensive both in time and money (not to mention added complexity). When I read the cost of the second option I almost fell out of my chair (ask me about it if you want a giggle).

Azure's document search was still in preview, but I took a spike to see if was feasible and had a working prototype in less than a day.

So, document searching is real, decently well documented and was fairly painless to implement. It's also totally automatic through Indexers.

### Indexers
This is another feature only available in Azure. Indexers watch a datasource for new or changed data and update the search index as needed. It currently supports Azure SQL, SQL Server on Azure VMs, DocumentDB, Azure Blob Storage and Azure Table Storage.

Because our database still lives over on AWS we haven't used this for our other search content, but if we did we could delete quite a bit of code that manages keeping the search index in sync with the source data.

The only downside is that (at least for Blob Storage) when you delete a document you need to mark it as deleted, wait for the indexer to run, then delete the document (or not, storage is cheap $.06/GB/month).

### Creating the index
We did not script our index creation in AWS. We just created them through the AWS website. Really with our indexes, it's hardly worth the effort to script them.

With Azure I started off the same way, but once I realized the only way to setup an Indexer for a Blob Datasource was through the REST API, I scripted everything. It took a little longer to get everything running the first time, but when in the process of development I realized I made a mistake in the config it was nice to just be able to delete it all, make one change and have all my environments updated. 

### Populating the index
With AWS Cloudsearch you need to create a JSON representation of the object you're adding to the index. You can either upload that directly through their REST API or you can use their .Net API.

With Azure you can upload a strongly typed object to be indexed. Or you could build an indexer to handle all that for you.

### Searching
This is where I really noticed a difference (We used the REST API for AWS so it might be a better experience with the .Net API). With AWS we needed to assemble a Lucene query in a URL query string. That means we're doing a lot of string concatenation and managing when parentheses close.

With Azure the .Net API has properties for Skip, Top, Select,  OrderBy and others that we were including in URL for AWS. That means instead of having to mange this:

``` &start=0&size=50 ```

We just had to manage this:

```
searchParams.Skip = (int)search.StartRecord-1;
searchParams.Top = (int)search.EndRecord;
```
But the biggest boon was the seperation of Search and Filters. With AWS, everything was search. With Azure you have the concept of Filters. All of our filter fields are controlled by us, and they are just concatenated together using Azure's 'simple query syntax' and added to the searchParams object. The search string the user enters is converted to a Lucene query (I open sourced my converter [here](https://github.com/hutchcodes/SearchParser)).

This little bit of seperation has made a big difference and making the code easier to reason about.

### Results
Again AWS is not strongly typed and just sends back a JSON document. We're treating it as a ```dynamic``` and mapping it to something useful. You could also build a class to match the JSON and deserialize it.

With Azure the ```Search``` method is generic. Each search result contains a ```Document``` property that is the type you specified. Simple use the same type as the object that was uploaded and Bobs your uncle.

### Summary
We really had no choice but to move to Azure because of its ability to index office documents. But the addition of automatic indexers and the strongly typed and well thought out API make me glad we made the move. The move from AWS Cloudsearch to Azure Search took a couple of days work (excluding moving document storage from S3 to Azure Blob).