---
layout: post
title: App Settings in Client-Side Blazor
categories: [Blazor]
date: 2019-12-17
published: true
codeproject: true
devto: true
---

I've been spoiled by Asp.Net and expect app settings to just work, but there is no easily configured app settings story for client-side Blazor *yet*. What I'm looking for is the ability to set some settings on a per-environment (dev/test/beta/prod) through Azure App Service Application Settings. The goal is one build artifact that moves from environment to environment with zero changes.

If you host the Blazor app as static files you'd need to change the app settings file for each different environment. So, I've gone with Asp.Net Core Web Hosted. I've named the app AppSettingsExample, so in the solution we have AppSettingsExample.Client (the WASM app), AppSettingsExample.Server (the host app), and AppSettingExample.Shared (code that is shared between the Client and Server)

<!--more-->

### Loading Client App Settings 

We'll store and access the client app settings through the built-in configuration in AppSettingsExample.Server. To do that we'll add an `appsettings.json` with the following values.

~~~
{
  "ClientAppSettings": {
    "BaseApiUrl": "http://somesite.com/api"
  }
}
~~~

We'll also create a class in the AppSettingsExample.Shared project to hold those configurations.

~~~
public class ClientAppSettings
{
    public string BaseApiUrl { get; set; }
}
~~~

Then in the AppSettingsExample.Server's Startup we'll get a reference to the application's configuration and store it in a local variable.

~~~
private readonly IConfiguration _configuration;

public Startup(IConfiguration configuration)
{
    _configuration = configuration;
}
~~~

This allows us to use that config to load the settings from `appsettings.json` and add it to the dependency injection config as a singleton.

~~~
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton(_configuration.GetSection("ClientAppSettings").Get<ClientAppSettings>());
~~~

### Exposing the Settings to the Client

There isn't an easy way to just pass the settings into the client-side Blazor app, so we'll need the app to request them from the server. We'll create a `ClientAppSettingsController` to AppSettingsExample.Server to serve up these settings.

~~~
[Route("api/[controller]")]
[ApiController]
public class ClientAppSettingsController : ControllerBase
{
    private readonly ClientAppSettings _clientAppSettings;

    public ClientAppSettingsController(ClientAppSettings clientAppSettings)
    {
        _clientAppSettings = clientAppSettings;
    }

    [HttpGet]
    public ClientAppSettings GetClientAppSettings()
    {
        return _clientAppSettings;
    }
}
~~~

### Getting the Settings from the Client

This is where I had the most trouble. I need to completely load these settings before the application can move on. If I did it asynchronously, it would start running the Initialization and ParameterSet methods on the current page before the settings load completed. If I tried to force the asynchronous web request to complete synchronously by calling `.Wait()`, the application locked up.

To get around this we can create a component that loads the settings and once loaded displays its child content. Then we can wrap our content in this component to make sure it doesn't start initializing or setting parameters until the settings are loaded. First, we create `AppSettingsLoader.razor`

~~~
@using AppSettingExample.Shared
@inject HttpClient http

@if (IsLoaded)
{
    @ChildContent
}


@code 
{
    [Parameter]
    public RenderFragment ChildContent { get; set; }

    public bool IsLoaded { get; set; }

    protected override async Task OnInitializedAsync()
    {
        await base.OnInitializedAsync();
        if (!IsLoaded)
        {
            var appSettings = await http.GetJsonAsync<ClientAppSettings>("api/ClientAppSettings");
            AppSettings.BaseApiUrl = appSettings.BaseApiUrl;
            IsLoaded = true;
        }
    }
}
~~~


Because we can't (or I couldn't) load the `ClientAppSettings` instance into the Dependency Injection to make it available throughout the application, I'm just putting the values in a static `AppSettings` class. 

Now, in the MainLayout.razor we can wrap the `@body` with the `AppSettingsLoader`

~~~
<AppSettingsLoader>
@Body
</AppSettingsLoader>
~~~

And finally, from the `Index.razor` page we can reference the `AppSettings.BaseApiUrl`. To prove it out, I'll just display it on the page.

~~~
@page "/"
<h1>Hello, world!</h1>

@AppSettings.BaseApiUrl
~~~

And now we can set any setting we like in the ClientAppSettings sections of the AppSettings.json and it will be treated just like a normal app setting, including being able to set the setting through Configuration section of an Azure App Service.