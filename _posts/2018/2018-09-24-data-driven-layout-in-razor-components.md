---
layout: post
title: Data Driven Layout in Server-side Blazor
categories: [C#, Blazor, Razor Components]
date: 2018-09-24
published: true
codeproject: true
---

One thing I stumbled on with Blazor was how to create a layout that changed based on the data on the page. For example, you may want to include bread crumbs in the header of your page. You could get the URL and try to parse out where in the application from your MainLayout, and then figure out what you need to figure out to create your breadcrumbs. But ideally you'd have each page figure out it's own breadcrumbs and pass that data to the header. 

<!--more-->

In Razor Pages you could do this with a an `RenderSection` in your layout, then defining the `Section` in your page, which could be a component that you pass some values to. But, `RenderSection` hasn't been implemented in Blazor (I'm not sure if it's coming or not). Here's two alternative techniques.

First thing we'll need to do is open the `_ViewImports.cshtml` and comment out or delete the `@layout MainLayout` that defines the layout for all the pages in the folder.

Then we'll create an AppState class to hold the data we want to pass between the page and the layout. For now we'll just capture the page name. This piece will be common between both techniques.

~~~csharp
    public class AppState
    {
        public string CurrentPageName { get; set; }
    }
~~~

The two techniques also share the `NavMenu` which takes `AppState` and uses that to display the `CurrentPageName`

~~~
@if (!string.IsNullOrEmpty(appState.CurrentPageName))
{
    <div class=@(collapseNavMenu ? "collapse" : null) onclick=@ToggleNavMenu>
        <ul class="nav flex-column">
            <li class="nav-item px-3" style="color:white;">
                Current Page: @appState.CurrentPageName
            </li>
        </ul>
    </div>
}

@functions {
    [Parameter] protected AppState appState { get; set; }

    bool collapseNavMenu = true;

    void ToggleNavMenu()
    {
        collapseNavMenu = !collapseNavMenu;
    }
}
~~~

#### Layout Component

For the Layout Component technique we'll create a Blazor Component called `MainLayout2 ` that takes it's child content from the calling markup. It has two key parameters, `AppState` and `ChildContent`. It just passes the `AppState` along to the `NavMenu` component. 

~~~
@inherits BlazorLayoutComponent

<div class="sidebar">
    <NavMenu appState="@appState" />
</div>

<div class="main">
    <div class="top-row px-4">
        <a href="https://blazor.net" target="_blank" class="ml-md-auto">About</a>
    </div>

    <div class="content px-4">
        @ChildContent
    </div>
</div>

@functions
{
    [Parameter] protected AppState appState { get; set; }
    [Parameter] protected RenderFragment ChildContent { get; set; }
}
~~~

Not that the `RenderFragment` must be named `ChildContent` in order for Blazor to get the content correctly later.

Then from the page we wrap the content of the page in a `<MainLayout>` tag and from the `OnInit` set the `AppState.CurrentPageName` to the name of the page'

~~~
@page "/counter"
@inherits BlazorComponent
<MainLayout2 AppState="@appState">
    <h1>Counter</h1>

    <p>Current count: @currentCount</p>

    <button class="btn btn-primary" onclick="@IncrementCount">Click me</button>    
</MainLayout2>
@functions {
    int currentCount = 0;

    void IncrementCount()
    {
        currentCount++;
    }

    protected AppState appState { get; set; } = new AppState();

    protected override void OnInit()
    {
        appState.CurrentPageName = "Counter";
        base.OnInit();
    }
}
~~~

### Dependency Injection

Another possibility is to use Dependency Injection to inject a single instance of the AppState into both the page and the layout, then updates to that object in the page will be visible to the layout.

First we need register the `AppState` class in the `StartUp.ConfigureServices`. We need to register this as a Scoped lifetime. See my post on [Blazor DI Lifetimes](/2018/09/dependency-injection-lifetimes-in-razor-components) for a better understanding of the various lifetimes in Blazor.

~~~csharp
services.AddScoped<AppState>();
~~~

Then in the `MainLayout.cshtml` we inject the `AppState` and pass that to the `NavMenu`

~~~
@inherits BlazorLayoutComponent
@inject AppState appState

<div class="sidebar">
    <NavMenu appState="@appState" />
</div>

<div class="main">
    <div class="top-row px-4">
        <a href="https://blazor.net" target="_blank" class="ml-md-auto">About</a>
    </div>

    <div class="content px-4">
        @Body
    </div>
</div>
~~~

We also need to inject the `AppState` into the page, and set the `CurrentPageName` in the `OnInit` method. In this case since we've removed the `@layout` directive from the `_ViewImports.cshtml` we need specify the layout in the page.

~~~
@page "/counter2"
@inject AppState appState
@layout MainLayout

<h1>Counter2</h1>

<p>Current count: @currentCount</p>

<button class="btn btn-primary" onclick="@IncrementCount">Click me</button>
@functions {
    int currentCount = 0;

    void IncrementCount()
    {
        currentCount++;
    }
    protected override void OnInit()
    {
        appState.CurrentPageName = "Counter";
        base.OnInit();
    }
}
~~~

### Which is better

The biggest difference is the lifetime of the `AppState`. With the Layout Component technique you create a new instance of the `AppState` each time the page loads. With the Dependency Injection technique you keep the same `AppState` until the user refreshes. 

This is a double edged sword. On the one hand, if you need to retrieve some data from the database or an API, you have built in caching. On the other hand you need to keep in mind that data might be stale.

For an example of this you can download and run the complete project, navigate to /Counter2, then to FetchData. You'll see that the current page is still listed as Counter2 because the line to set the `CurrentPageName` is commented out.

The Layout Component technique on requires you to wrap your content in the layout tag. Not only is this extra boilerplate in every page, it's may make it more difficult to do things like nested layouts.

Full source [https://github.com/hutchcodes/Blazor.DataDrivenLayout]()
