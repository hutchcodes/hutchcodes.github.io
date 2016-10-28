---
layout: post
title: Azure Function to Detect Failed Search Indexer
categories: [Azure]
date: 2016-10-28
published: true
---

Azure Functions are a light weight way to deploy code. It's part of the "serverless" craze. While I admit I was suspect of serverless,  after just this tiny foray, I can definitely see it's usefulness.

So here's my real world example of something simple you can do with Azure Functions. It's just the tip of the iceberg, but it's better than a ```Hello Word```. 

<!--more-->

The problem I was trying to solve was that Azure Search Indexers don't alert you when they fail to index a document. Depending on how you have your indexer configured it either ignores the document or it keeps retrying and gets stuck. In my case it got stuck. Luckily it was in our Test environment.

The goal of this was to create a watcher to periodically check the status of the indexer and send me an email if there were any errors. 

### Creating the Function App
The first step is of course to create the Function App through the Azure Portal. The setup is similar to setting up an Azure Web App right down to the [yoursite].azurewebsites.net. The Function App also creates a Storage Account that is used to store the code files.

### Creating the Function
Whether you create your function through the portal or build it locally and deploy through continuous integration the file layout is the same, but not immediately obvious for some things.

```
[root]
| - host.json
| - IndexerWatcher 
| | - run.csx 
| | - function.json
| | - project.json (I had to add this file manually)
```
**host.json** allows you to control some settings at the Function App level (could contain multiple functions). By default it is an empty JSON. I'd prefer a file populated with the defaults, but you can see what settings are available and their defaults [here](https://github.com/Azure/azure-webjobs-sdk-script/wiki/host.json).

**function.json** contains settings for the function include bindings which you can use to add inputs and outputs to the function. In this case we have a binding the timer trigger that runs the job at the top of every hour, and SendGrid send emails.

```
{
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 0 * * * *"
    },
    {
      "type": "sendGrid",
      "name": "message",
      "to": "default@SendToEmailAddress",
      "from": "send@FromEmailAddress",
      "subject": "Default Subject",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

**project.json** allows you to reference Nuget packages. In this case I'm referencing the Azure Search SDK so that I can get the status of the indexer. We could also do this through the Rest API, but I'm a big fan of strong typing and intellisense...

```
{
  "frameworks": {
    "net46":{
      "dependencies": {
        "Microsoft.Azure.Search": "1.1.3"
      }
    }
   }
} 
```

**run.csx** is the main script file. In this case it is C#, but it can be F#, Javascript, Powershell, Python etc. In C# it contains a function with the signature ```public static void Run()```.

We have additional parameters for the TimerInfo, TraceWriter and a SendGridMessage. We don't need to configure any bindings for TraceWriter, it is always available to be passed into your function. The other two are configured in the function.json.

Because we're using SendGrid and SendGrid is not automatically referenced, we need to tell the host to add the reference. We do that with the ```#r "SendGridMail"``` at the top. There's a handful of external assemblies you can this way [reference](https://azure.microsoft.com/en-us/documentation/articles/functions-reference-csharp/#referencing-external-assemblies).

After that we just call the Search Service, request the Indexer Status and generate an email if needed. If I don't need to send an email I just pass a null SendGridMessage back. That throws an error in the console, but I didn't see any other way to not send the email. If there is a better way please let me know.

```
#r "SendGridMail"

using System;
using SendGrid;
using Microsoft.Azure.Search;

public static void Run(TimerInfo myTimer, TraceWriter log, out SendGridMessage message)
{
    var apiKey = GetEnvironmentVariable("SearchApiKey");
    //log.Info(apiKey);
    var searchService = "mySearchService";
    var searchIndexer = "myBlobIndexer";
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

    message = null;
    if (!string.IsNullOrEmpty(body))
    {
        message = new SendGridMessage()
        {
            Text = body
        };
    }
}

public static string GetEnvironmentVariable(string name)
{
    return System.Environment.GetEnvironmentVariable(name, EnvironmentVariableTarget.Process);
}
```

### App Settings

From the Function App blade in the portal under ```Function App Settings``` there is ```Configure App Settings``` button. Click that and you can set your app settings just like you would for a Web App.   
 
There are two app settings that you'll need to configure to make this work.

- AzureWebJobsSendGridApiKey - This is the SendGrid API Key and the setting name has to match or you get an error.
- SearchApiKey - This is API Key for your Azure Search service. You can name this setting anything you like, but make sure you update the call to ```GetEnvironmentVariable``` in the run.csx.

### TODO
- As it is I'll need to create a seperate function for each indexer I have (Prod, Test, Dev) which would mean duplicate code, which we all know is going to bite me in the ass. There is a way to share code between functions, but I haven't explored it yet.

- It wasn't until after I had my first working Azure Function that I found the [Azure-Functions-CLI](https://www.npmjs.com/package/azure-functions-cli). This should allow you to test the functions locally before deploying them to Azure.

### Gotchas
I started developing this in a console app, and I needed to install the SendGrid v6.3.4 package to get it working there. Neither the 7.* nore the 8.* packages had the SendGridMessage.