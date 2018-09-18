---
layout: post
title: Dependency Injection Lifetimes in Blazor
categories: [C#, Blazor, Razor Components]
date: 2018-09-17
published: true
codeproject: true
---

I've been playing with Server-side Blazor for a few days and I've been really impressed. I can see that this will be an immensely powerful technology and I hope to make it my main web platform going forward. But it's model does change some things. Since you're running the app on the server and just using SignalR to update the browser's UI it changes the lifetime of Scoped objects in Asp.Net's dependency injection.

<!--more-->

For a great analysis of DI scopes and lifetimes checkout Michal Dudak's [post](https://blog.dudak.me/2018/dependency-lifetime-in-asp-net-core/).

I based my testing of scopes off of his simple scenario to see how the scopes differed in Server-side Blazor.

First I created 3 services
```
public class SingletonService
{
    public int Counter;
}
 
public class ScopedService
{
    public int Counter;
}
 
public class TransientService
{
    public int Counter;
}
```

Then I registered those services with Asp.Net in startup.cs.

```
public void ConfigureServices(IServiceCollection services)
{
    // Since Blazor is running on the server, we can use an application service
    // to read the forecast data.
    services.AddSingleton<WeatherForecastService>();

    services.AddSingleton<SingletonService>();
    services.AddScoped<ScopedService>();
    services.AddTransient<TransientService>();
}
```
Then in the Configure method of startup.cs I requested an instance of the services and incremented the counters.

```
public void Configure(IBlazorApplicationBuilder app)
{
    app.AddComponent<App>("app");

    app.Services.GetService<SingletonService>().Counter++;
    app.Services.GetService<ScopedService>().Counter++;
    app.Services.GetService<TransientService>().Counter++;
}
```        

Then I added a new page that gets those services injected, increments the counters and displays the results.

```
@page "/dilifetimes"
@using Blazor.DI.Lifetimes.App.Services
@inject SingletonService singletonService
@inject ScopedService scopedService
@inject TransientService transientService

<table class="table">
    <thead>
        <tr>
            <td>Lifetime Type</td>
            <td>Count</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Singleton</td>
            <td>@singletonService.Counter</td>
        </tr>
        <tr>
            <td>Scoped</td>
            <td>@scopedService.Counter</td>
        </tr>
        <tr>
            <td>Transient</td>
            <td>@transientService.Counter</td>
        </tr>
    </tbody>
</table>

@functions
{
    protected override void OnInit()
    {
        singletonService.Counter++;
        scopedService.Counter++;
        transientService.Counter++;

        base.OnInit();
    }
}
```

As you would expect the values of counters are:

```
Singleton: 2
Scoped: 2
Transient: 1
```

And if you refresh, the values match what you see in a normal Asp.Net application

```
Singleton: 4
Scoped: 2
Transient: 1
```

But if you then navigate to a different page, then back to the DILifetimes page you get an odd result (literally);
```
Singleton: 5
Scoped: 3
Transient: 1
```

Transient works just as we'd expect. Every time we request an instance of that service we get a new instance. The instance that is incremented in the Configure method is different from the instance we get injected in the DILifetimes page.

And when we refresh the page both Singleton and Scoped work as we'd expect. The singleton service is the same instance that has already been incremented twice when we loaded the page. It gets incremented again in Configure and again in DILifetimes. We get a new Scoped service in the Configure method and increment it a second time in DILifetimes.

The _odd_ thing happens. We navigate away from the page and back, and we only increment Singleton and Scoped once, from the DILifetimes page. This is because we haven't actually done a full web request when we navigated. We actually sent a message through SignalR to tell Server-side Blazor that we navigated. Blazor then did the navigation at the server and sent back the changes to the DOM which are then updated on the screen. The Configure method is never run.

The message here is that Scoped services have a much longer lifetime in Server-side Blazor than they did in a traditional Asp.Net application. This can be good or bad, but it's definitely good to be aware of.