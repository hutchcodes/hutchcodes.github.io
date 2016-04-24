---
layout: post
categories: [C#, T4]
title: T4 Generated Wrapper for a WCF Client
---
<h3>Background</h3>
The idea for this article came from two places:

I’m writing an application that gets all of its data from a WCF service. Each time I call the WCF service, I end up having to write a bunch of duplicate code and of course I don’t like to type, so I was trying to find a way to not have to write that code.

The app I’m developing is an internal business application, and we release weekly. Each release to the WCF services could be incompatible with the previous client. That means that I need to do the release during off hours. I don’t like working nights, so I wanted to find a way to have multiple copies of the service running and have the client choose which service to access based on its version<!--more-->, but I didn’t want to have to keep changing the config file for the client with each release.
First I’ll solve those two problems, and then I’ll demonstrate how to use T4 to generate this wrapper from the WCF service reference.
<h3>Prerequisites</h3>
To run the code, you’ll need to download and install the <a href="http://t4toolbox.codeplex.com/" target="_blank">T4Toolbox</a>.
<h4>Problem #1</h4>
A typical WCF call looks like this:

~~~ cs
var proxy = new WCFServiceWrapper.WcfSvc.Service1Client()
try
{
    returnValue = proxy.GetData(value);
    proxy.Close();
}
catch
{
    proxy.Abort();
    throw;
}
Proxy = null;
~~~ 

To keep from having to write all that code every time I make a call to the WCF service, I created a <em>static class</em> that has a <em>static</em> method with the same signature as the WCF method I’m calling.

~~~ cs
public static partial class SvcWrapper
{   
    public static string GetData(int value)
    {
        var proxy = GetServiceClient()
        try
        {
            var returnValue = proxy.GetData(value);
            proxy.Close();
            return returnValue;
        }
        catch
        {
            proxy.Abort();
            throw;
        }
    }
}
~~~ 

Now that same call that took 12 lines of code is now just this one line:

~~~ cs
returnValue = SvcWrapper.GetData(value);
~~~ 

<h4>Problem #2</h4>
To solve the second problem, I just added another method that creates an instance of the service client for me.

~~~ cs
public partial class SvcWrapper
{
    private static string _serviceAddress;
    private static string _configName;
    private static bool _needsConfig = true;
    internal static WcfSvc.Service1Client GetServiceClient()
    {
        if (_needsConfig)
        {
            //At this point I'd do some hoopajoop to determine what the
            //current service address is for this version
            //something like:
  
            //ServiceConfig config = SomeWCFService.GetServiceConfig(versionNo);
            //_serviceAddress = config.Address;
            //_configName = config.ClientEndPointName;
            //The address of the service endpoint
            _serviceAddress = "http://localhost:50324/Service1.svc"

            //This string is the Name of the Client Endpoint
            //as defined in the running EXE's app.config
            _configName = "WSHttpBinding_IService1";
        }
        return new WCFServiceWrapper.WcfSvc.Service1Client(_configName, _serviceAddress);
    }
}
~~~ 

There’s nothing earth shattering about that code, and I haven’t even implemented the look of the address and config yet, but the shell is there for me to finish at a later date. But now if I want to add another endpoint configuration to the <em>app.config</em> file for this service, I can do that and have only one place to change which endpoint the app uses.
<h3>Using T4 to Generate Wrapper Methods</h3>
Now, I’ve solved my original 2 problems, but I’ve created another one. I’m going to have to create and maintain a wrapper method for every method exposed by the WCF Service. This is the perfect opportunity to do a little code generation with T4.

First thing you need to do is add references to the EnvDTE and T4ToolBox. Then add a new text file called <em>GenerateServiceWrapper.t4</em>. This file holds the code that is not specific to the service we’re wrapping, and the t4 extension doesn’t create the child <em>.cs</em> file that the .tt extension creates.

This file has 5 methods:

<em>GetServiceInterface</em> – takes the name of the service and searches the project for a file that matches. Then it calls <em>FindInterface</em>.
<em>FindInterface</em> – takes a project item and searches it for an interface. It returns the first one it finds, and nullif it doesn’t find one. It could maybe use some error handling but…
<em>GetMethodSignature</em> – this takes one of the <em>public</em> methods found on the interface and returns a string that will be the method signature of the wrapper method.
<em>GetMethodCall</em> – this takes one of the <em>public</em> methods found on the interface and returns a string that will be the call to that method on the WCF Service.
<em>GetServiceWrapper</em> – is where the rubber meets the road. This calls <em>GetServiceInterface</em> to get the interface, loops through the public methods and generates the wrapper methods.
Here’s the contents of that file, you’ll need to get a third-party plugin to get syntax highlighting in Visual Studio.

~~~ cs
<#@ Template Language="C#" #>
<#@ import namespace="EnvDTE" #>
<#@ include File="T4Toolbox.tt" #>
<#+
public void GetServiceWrapper(string LocalServiceName)
{
    EnvDTE.CodeInterface svcInterface =
    GetServiceInterface(LocalServiceName + @"reference.cs");
    foreach (var ce in svcInterface.Members)
    {
        var meth = ce as CodeFunction;
        if (meth != null)
        {
            if (meth.Access == vsCMAccess.vsCMAccessPublic)
            {
                string methodSignature = GetMethodSignature(meth);
                string methodCall = GetMethodCall(meth);
                bool returnsVoid = false;
                if (meth.Type.AsString.Equals("void"))
                {
                    returnsVoid = true;
                }
                #>
        <#=methodSignature #>
        {
            var proxy = GetServiceClient();
            try
            {
            <#+
                if (returnsVoid)
                {
                       #>    proxy.<#=methodCall #>;
                            proxy.Close();
            <#+
                }
                else
                {
            #>    var returnValue = proxy.<#=methodCall #>;
                proxy.Close();
                return returnValue;
<#+
                }
#>
            }
            catch
            {
                proxy.Abort();
                throw;
            }
        }
         
<#+
            }
        }
    }
}

public EnvDTE.CodeInterface GetServiceInterface(string interfaceFile)
{
    ProjectItem projectItem = TransformationContext.FindProjectItem(interfaceFile);
    FileCodeModel codeModel = projectItem.FileCodeModel;
    return FindInterface(codeModel.CodeElements);
}
 
public CodeInterface FindInterface(CodeElements elements)
{
    foreach (CodeElement element in elements)
    {
        CodeInterface myInterface = element as CodeInterface;
        if (myInterface != null)
            return myInterface;
        myInterface = FindInterface(element.Children);
        if (myInterface != null)
            return myInterface;
    }
    return null;
}
 
public string GetMethodSignature(CodeFunction method)
{
    var methodSignature = new System.Text.StringBuilder();
    methodSignature.Append("public static ");
    methodSignature.Append(method.Type.AsString);
    methodSignature.Append(" ");
    methodSignature.Append(method.Name);
    methodSignature.Append("(");

    bool isFirstParameter = true;

    foreach (var prm in method.Parameters)
    {
        CodeParameter p = prm as CodeParameter;
        if (!isFirstParameter)
        {
            methodSignature.Append(", ");
        }
        else
        {
            isFirstParameter = false;
        }

        methodSignature.Append(p.Type.AsString);
        methodSignature.Append(" ");
        methodSignature.Append(p.Name);
    }

    methodSignature.Append(")");

    return methodSignature.ToString();
}
 
public string GetMethodCall(CodeFunction method)
{
    var methodCall = new System.Text.StringBuilder();
    methodCall.Append(method.Name);
    methodCall.Append("(");

    bool isFirstParameter = true;

    foreach (var prm in method.Parameters)
    {
        CodeParameter p = prm as CodeParameter;

        if (!isFirstParameter)
        {
            methodCall.Append(", ");
        }
        else
        {
            isFirstParameter = false;
        }
        methodCall.Append(p.Name);
    }
    methodCall.Append(")");
    return methodCall.ToString();
}      
#>
~~~ 

Lastly create a text file named <em>ServiceWrapper.tt</em>, or something less generic as this will define the actual wrapper for the WCF Service.

It contains a link to our <em>GenerateServiceWrapper.t4</em> file, the definition of our class, and a call to <em>GetServiceWrapper</em> to which we pass the name of the WCF Service Reference.

~~~ cs
<#@ template language="C#v3.5" hostspecific="True" #>
<#@ include File="T4TemplatesGenerateServiceWrapper.t4" #>
using System;
 
namespace WCFServiceWrapper
{
    public static partial class SvcWrapper
    {   
<#      GetServiceWrapper("WcfSvc");#>
    }
}
~~~ 

Once you save, it should generate a <em>SvcWrapper.cs</em> file with <em>static</em> methods to wrap all of your calls. Now if I want to do something like add logging to each WCF call, all I have to do is add that code to the <em>GetServiceWrapper</em> method in the <em>GenerateService.t4</em> file, poof all my methods WCF calls are logged.

Notice that I created this class as a partial class, this allows us to put the <em>GetServiceClient</em> method in the same class, but in a separate file. We could have either created that method in a completely separate class, or within the <em>ServiceWrapper.tt</em> file. You never want to edit the generated file, as those edits will be overwritten.

<h3>Points of Interest</h3>
Syntax highlight for T4 requires a 3rd party plugin. I’ve tried a few, and they are all pretty weak.

You can’t step through T4 code (or I haven’t figured out how), so it can take some serious guess and check to figure out what’s going wrong when something goes wrong. The output window is your friend.
