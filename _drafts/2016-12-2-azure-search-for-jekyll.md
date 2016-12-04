---
layout: post
title: Azure Search for Jekyll
categories: [Azure, Jekyll]
date: 2016-12-02	
published: true
---

I moved this blog off of WordPress 18 months ago. The main reason I left was performance. I can't justify paying for an always on server for this blog, and I don't have the traffic to keep a site hot. The result was first page load times of 6-10 seconds. 

Moving to Jekyll took some work, but hosting it on GitHub Pages has resulted in consistent half second page loads. The only downside has been search. I was using Google, but the UX was terrible. The user typed a search term in a textbox on my blog, was kicked out to a Google results page, clicking any link brought them back.

A mix of Azure Functions and Azure Search now provides a built in search capability, the best part it is totally free.

<!--more-->

The first thing I did was create a page in Jekyll to produce a JSON representation of all the Posts and Pages from my site. I added a new piece of meta-data to the front matter to indicate whether each page should be indexed for search. This way I can make sure that pages like my RSS feed, site map and my search.json don't get indexed.

~~~html
{% raw %}
---
layout: nil
includeInSearch: false
---
{% assign pages = site.pages | where:"includeInSearch", "true" %}
[
	{% for p in site.posts %}
	{
	"type": "post",
	"title": "{{ p.title }}",
	"publishDate": {{ p.date | jsonify }},
	"categories": [{% for cat in p.categories %}"{{ cat }}"{% unless forloop.last %},{% endunless %}{% endfor %}],
	"tags": [{% for tag in p.tags %}"{{ tag }}"{% unless forloop.last %},{% endunless %}{% endfor %}],
	"url": "{{ p.url }}",
	"content":{{ p.content | strip_html | json_escape | jsonify }},
	"excerpt": {{ p.excerpt | json_escape | jsonify | remove: '\n' }}
	}{% unless forloop.last %},{% endunless %}
	{% endfor %}

	{% for p in pages %},
	{
	"type": "page",
	"title": "{{ p.title }}",
	"categories": [{% for cat in p.categories %}"{{ cat }}"{% unless forloop.last %},{% endunless %}{% endfor %}],	
	"tags": [{% for tag in p.tags %}"{{ tag }}"{% unless forloop.last %},{% endunless %}{% endfor %}],
	"url": "{{ p.url }}",
	"content":{{ p.content | strip_html | json_escape | jsonify}},
	"excerpt": {{ p.excerpt | rstrip | json_escape | jsonify }},
	"description": {{ p.description | json_escape | jsonify }}
    }
    {% endfor %}
]
{% endraw % }
~~~

That's simple enough. I had actually created that over a year ago when I first started to think about using Azure Search. I abandoned that attempt partly because it was going to be a manual process. You can see the results at [http://hutchcodes.net/search.json](http://hutchcodes.net/search.json)

The next thing I needed to do was get that into Azure Search in some automated fasion. For this I used an Azure Function with GitHub Webhook for a trigger. I'm going to assume you'll be able to figure out how to setup a Function App and create the GitHub Webhook function from the Templates available when add a function.

The new function should look something like this:
![](/img/2016/GitHubWebHook.jpg)

Note that the *GitHub Secret* that is listed is action the *_master* admin key, and what you really need is the *default* function key ([more info](http://stackoverflow.com/questions/40615743/invalid-webhook-signature)). Also, that Function App will be gone before I post this, so don't worry about me sharing that key :)

Next step is to go over to GitHub and create the WebHook:
![](/img/2016/CreateGitHubWebhook.jpg)

Then scroll down a bit more and choose **Let me select individual events**
That opens up of the list of events that will trigger the WebHook. Uncheck **Push** and check **Page Build**. That will trigger the WebHook to index the blog everytime the Jekyll site gets built. For debug purposes I also put a check in Watch. When I wanted to test everything I could just UnStar/Star my repo.

At this point we can test everything to ensure that the Webhook is working properly and our function is running. Once you confirm that is working you can it's time to glue it all together. 

First thing we need to do is bring in a reference to the Azure Search SDK. To do this you need to create a `project.json` file in the BlogIndexer folder. 

~~~javascript
{
  "frameworks": {
    "net46":{
      "dependencies": {
        "Microsoft.Azure.Search": "1.1.3"
      }
    }
   }
} 
~~~

After that it's just a matter of creating and populating the index.

~~~csharp
#r "Newtonsoft.Json"

using System.Net;
using Newtonsoft.Json;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    WebClient client = new WebClient();
    client.Encoding = System.Text.Encoding.UTF8;
    string value = client.DownloadString("https://hutchcodes.net/search.json");
    var searchTopics = JsonConvert.DeserializeObject<List<Page>>(value);

    var indexClient = RecreateIndex();

    var batch = IndexBatch.Upload(searchTopics);
    indexClient.Documents.Index(batch);    
}

private static SearchIndexClient RecreateIndex()
{
    var queryApiKey = "[Your API Key]";
    var searchServiceName = "[You Search Service Name]";
    var searchIndexName = "[Your Index Name]";

    var searchServiceClient = new SearchServiceClient(searchServiceName, new SearchCredentials(queryApiKey));

    if (searchServiceClient.Indexes.Exists(searchIndexName))
    {
        searchServiceClient.Indexes.Delete(searchIndexName);
    }

    var definition = new Index()
    {
        Name = searchIndexName,
        Fields = new[]
        {
            new Field("Id", DataType.String) { IsFilterable = true, IsKey = true },
            new Field("Url", DataType.String) { IsRetrievable = true },
            new Field("Type", DataType.String) { IsFilterable = true, IsRetrievable = true, IsFacetable = true },
            new Field("Title", DataType.String) { IsSearchable = true, IsRetrievable = true, Analyzer = AnalyzerName.EnMicrosoft },
            new Field("Categories", DataType.Collection(DataType.String)) { IsFilterable = true, IsRetrievable = true, IsFacetable = true },
            new Field("Tags", DataType.Collection(DataType.String)) { IsFilterable = true, IsRetrievable = true, IsFacetable = true },
            new Field("Content", DataType.String) { IsSearchable = true, Analyzer = AnalyzerName.EnMicrosoft },
            new Field("Excerpt", DataType.String) { IsSearchable = true, IsRetrievable = true, Analyzer = AnalyzerName.EnMicrosoft },
            new Field("PublishDate", DataType.String) { IsRetrievable = true }
        }
    };
    searchServiceClient.Indexes.Create(definition);
    var indexClient = searchServiceClient.Indexes.GetClient(searchIndexName);
    return indexClient;
}

public class Page
{
    public string Id { get { return Url.GetHashCode().ToString(); } }
    public string Url { get; set; }
    public string Type { get; set; }
    public string Title { get; set; }
    public DateTime? PublishDate { get; set; }
    public string Content { get; set; }
    public string Excerpt { get; set; }
    public List<string> Categories { get; set; }
    public List<string> Tags { get; set; }

}
~~~

Starting from the bottom, the `Page` class represents the JSON objects that output in the `search.json`, and the properties need to match 1 for 1 with the fields in the Index.

Each time we update the index we delete and recreate the index. We need to do this because if we delete a post or a page it gets removed from the `search.json`, but there is no way to trigger it's removal from the Index.

Lastly (or firstly), the `Run` method gets the `search.json` from the blog, deserializes it into a `List<Page>` and uploads that list to the Search Index. Last I looked there was a limit of 1000 items per batch. I handle that potential problem in my GitHub example, but left that out here for simplicity.

### Searching

Finally, we're able to start searching. First thing to do is create a `Search` function. To do this create an `Http Trigger` function and change the Authorization level from Function to Anonymous access.. By default the Url for this function will be /api/search. Again we'll need to include a `project.json` with the same reference to the Azure Search SDK. We're also going to have a bit of duplicate code for the `Page` class and `IndexClient`. 

~~~csharp
#r "Newtonsoft.Json"
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using Newtonsoft.Json;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    // parse query parameter
    string search = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "search", true) == 0)
        .Value;

    string facet = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "facet", true) == 0)
        .Value;        

    var results = Search(search, facet); 
 
    return req.CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(results)); 
}

private static List<Page> Search(string search, string facet)
{
    var queryApiKey = "[Your API Key]";
    var searchServiceName = "[You Search Service Name]";
    var searchIndexName = "[Your Index Name]";

    var indexClient = new SearchIndexClient(searchServiceName, searchIndexName, new SearchCredentials(queryApiKey));

    string facetFilter = "";
    if (!string.IsNullOrEmpty(facet))
    {
        facetFilter = $"Categories/any(c: c eq '{facet}')";
    }

    var searchParams = new SearchParameters();
    searchParams.IncludeTotalResultCount = true;
    searchParams.QueryType = QueryType.Full;
    searchParams.SearchMode = SearchMode.Any;
    searchParams.Top = 10000;
    searchParams.Select = new[] { "Url", "Type", "Title", "Excerpt", "Categories", "PublishDate" };
    searchParams.Filter = facetFilter;
    searchParams.Facets = new[] { "Categories" };

    var searchResults = indexClient.Documents.Search<Page>(search, searchParams);

    var pages = new List<Page>();
    foreach (var r in searchResults.Results)
    {
        pages.Add(r.Document);
    }
    return pages; 
}

public class Page
{
    public string Id { get { return Url.GetHashCode().ToString(); } }
    public string Url { get; set; }
    public string Type { get; set; }
    public string Title { get; set; }
    public DateTime? PublishDate { get; set; }
    public string Content { get; set; }
    public string Excerpt { get; set; }
    public List<string> Categories { get; set; }
    public List<string> Tags { get; set; }
}
~~~

Once that's in place you can just go to [You function app URL]/api/search?search=foo&facet=bar and you should see some results. Don't be shocked if it comes back as Xml, when you make the request from javascript on your page you can specify that you want JSON.

To do the actual search from my Jekyll based site I created a page that looked for a `search` and `facet` query string and made a call to the API. In this example we're returning JSON for simplicity, so you'd need to turn that JSON into some HTML on the client side. In the code I have running I am processing the results some HTML inside the function so that I can just take what I get back and insert it as the `innerHtml` of the appropriate element on the page.

That is working great for me, but it is hard coded in the function. I'd like to find way for it to be more flexible. At this point I'm deciding between having some template on the site that the function will try to pull, or maybe having the `search.json` include the display HTML for each page.

Addition resources:
- [Source code](https://github.com/hutchcodes/Jekyll-Search-With-Azure-Functions) for the Azure Functions that are handling search on this site
- [Source code](https://github.com/hutchcodes/hutchcodes.github.io) for this blog including the
	- [search.json](https://github.com/hutchcodes/hutchcodes.github.io/blob/master/search.json) - JSON representation of searchable pages
	- [search.md](https://github.com/hutchcodes/hutchcodes.github.io/blob/master/search.md) - Page that runs the search and return the results
	- [site.js](https://github.com/hutchcodes/hutchcodes.github.io/blob/master/_includes/site.js) - Javascript that actually runs the search



