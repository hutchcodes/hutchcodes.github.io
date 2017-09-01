---
layout: post
title: Simple Deploy to Azure from Command Line
categories: [Azure, DevOps]
date: 2017-09-01
published: true
codeproject: true
---

I'm currently working on moving our product from AWS to Azure and as part of the planning for that move, one of the problems I needed to solve was deployment. Our current deployments are handled by an automated build on Bamboo, but Bamboo doesn't have a "Deploy to Azure" task. I needed to do the deploy from the command line (CMD or Powershell), and I wanted to avoid including publish profiles in the projects.

The first part, running from the command line was easy to find through with a Google search. You can just tell MSBuild to publish to Azure

```
msbuild MyWeb\MyWeb.csproj /t:TransformWebConfig;Publish /p:TargetProfile=ProdMyWebApp /p:Configuration=AzDev

```

But the catch is that you can't do it without a publish profile as part of your project or at least I wasn't able to make it work.

<!--more-->

Instead of trying to do it with just MSBuild I used MSBuild to build a deployment package.

```
MSBuild MyWeb\MyWeb.csproj 
	/target:TransformWebConfig;Package 
	/p:Configuration=Prod;PackageLocation="Deployment\Prod.zip"
```

That transforms the `web.config` and creates a `.cmd` executable that we can call and tell to publish to Azure or IIS is WebDeploy is enabled. 

```
Deployment\Prod.Deploy.cmd 
	/M:https://mywebapp.scm.azurewebsites.net:443/MSDeploy.axd 
	/a:basic 
	/U:$mywebapp 
	/P:[userPWD from your publish profile] 
	/Y
```

You do still need to download the publish profile from the Azure portal and open it in a text editor to pull out the `publishUrl`, `userName` and `userPWD`. The `/Y` means that it will go through with the deploy. You can also use `/T` to do a 'What If'.

With these commands, I was able to automatically deploy our web app to Azure during our build process. And since I didn't need to store the publish profile in the `.csproj` file, I don't need to worry about someone deploying something from their machine without checking the code into source control.
