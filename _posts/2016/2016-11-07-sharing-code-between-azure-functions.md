---
layout: post
title: Sharing Code Between Azure Functions
categories: [Azure]
date: 2016-11-07
published: true
---

Once I had my Azure Search Indexer Failure Notifier working as an Azure Function I needed to make it run on all of our Indexers. I had 3 choices for sharing common code:

1. Copy/Paste
2. Have one big function that checked every indexer
3. Find some way to share code between functions

<!--more-->

Option #1 was right out. I've seen that turn ugly in the past and have no desire to create such a mess for future me or anyone else.

Option #2 is a pretty good option, and would have been the simplest path to done. I went with option #3 mostly to learn how to share code. I know that knowledge will come in handy some day.

Looking at the Samples of the [azure-webjobs-sdk-script](https://github.com/Azure/azure-webjobs-sdk-script) repository and noticed the `Shared` folder.

First thing I moved was my `GetEnvironmentVariable` method. I created a file called Settings.csx in the Shared folder and created a public static class to hold the method.

~~~ csharp
using System;

public static class Settings 
{
	public static string GetSetting(string settingName)
	{
        return System.Environment.GetEnvironmentVariable(settingName, EnvironmentVariableTarget.Process);
	}
}
~~~

Then at the top of the `run.csx` just put `#load "../shared/settings.csx"

I can then replace my calls to `GetEnvironmentVariable("settingName")` with `Settings.GetSetting("settingName")`

That worked great, so I continued to try to move the meat of the index watcher code. I created a folder `SearchIndexerWatcher` under in the `Shared` folder and created an `IndexerWatcher.csx` there and moved all of the code for checking the index status to that file.

~~~ csharp
#load "../Settings.csx"

using System;
using SendGrid.Helpers.Mail;
using Microsoft.Azure.Search;

public static class IndexerWatcher {

    public static Mail GetFailureNotification(string searchService, string searchIndexer, TraceWriter log)
    {
        var apiKey = Settings.GetSetting("SearchApiKey");
        string body = "";

        var client = new SearchServiceClient(searchService, new SearchCredentials(apiKey));

        var status = client.Indexers.GetStatus(searchIndexer);

        foreach (var hist in status.ExecutionHistory)
        {
            if (hist.EndTime > DateTime.UtcNow.AddMinutes(-65) && !string.IsNullOrWhiteSpace(hist.ErrorMessage))
            {
                body += hist.ErrorMessage + Environment.NewLine;
            }
        }

        Mail message = null;
        if (!string.IsNullOrEmpty(body))
        {
            message = new Mail();

            Content content = new Content
            {
                Type = "text/plain",
                Value = body
            };

            message.AddContent(content);
        }
        return message;
    }
}
~~~  

Notice that this code references the `Settings.csx` from the Shared folder.

Now my main function is just setting specifying the `SearchService` and `SearchIndexer`, then calling this function.

~~~ csharp
#r "SendGrid"
#load "..\Shared\SearchIndexerWatcher\IndexerWatcher.csx"

using SendGrid.Helpers.Mail; 

public static void IndexWatcher_Prod(SearchIndexer input, TraceWriter log, out Mail message)
{
    var searchService = "mySearchService";
    var searchIndexer = "myBlobIndexer";

    message = null;IndexerWatcher.GetFailureNotification(searchService, searchIndexer, log);    
}
~~~

So this mostly works as expected. The Run.csx has the `#r` to pull in the SendGrid reference and the #load to pull in IndexerWatcher.csx. IndexerWatcher.csx then pulls in Settings.csx.

Except when I created a new function for another one of our indexers it failed to compile because I forgot the project.json. And that's where things get tricky. That project.json pull the `Microsoft.Azure.Search` down from Nuget. We have no references to Microsoft.Azure.Search in the run.csx, so logically I'd like to put that in the `Shared/SearchIndexerWatcher` folder. But it doesn't work from there, it has to be in the root of the function's folder.

That's not ideal because if I use those files, I may not realize what dependencies need to be added to the project.json. I decided to leave the project.json in the `Shared/SearchIndexerWatcher` folder as a reference for what would need to be added to the function's project.json.

Things I'm thinking about going forward:

1. Add a readme.md to the `Shared/SearchIndexerWatcher` folder to document how to use that file and what needs to be added to the project.json. Then remove the project.json.
2. Split the IndexerWatcher from the SendGrid Mail generation so that code can be shared more broadly. 