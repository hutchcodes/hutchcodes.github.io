---
layout: post
title: Debugging IIS App Pool Crashes
categories: [C#,IIS]
date: 2016-05-27
published: true
---

We had a problem where a stack overflow error was crashing our App Pool in IIS. Other than that we didn't have any information about what was cause was, what code was causing the crash or even what request. 

This was my first time taking a crash dump and using it to debug and I was surprised at how painless it was. I'll definitely be using this technique again.

<!--more-->

### Enable Crash Dumps in Windows Error Reporting ###
The first thing you need to do is change some registry settings to tell Windows Error Reporting to save a crash dump.

Open RegEdit and Create this key 

~~~
[HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\Windows Error Reporting]
~~~

Then set the following values:

Name         | Type  | Value   
------------ | ----- | ------- 
DumpFolder   | Expandable String| c:\temp 
DumpCount    | DWORD | 10      
DumpType     | DWORD | 2       

I found the DumpType setting to be the critical. The default is 1, which is Minidump, but that didn't seem to be enough information to get me to the offending code. For reference my minidump was 48MB, my full dump was 800MB

### Crash ###
At this point you can just sit back and wait for the next crash or you can cause it if you know how. When a file shows up, copy it to your dev machine and rename the key to `LocalDumps_NO` to prevent further dumps from accumulating while you work.

### Debug ###
1. Open your solution in Visual Studio and checkout the same code that is running on the server. Build with your production configuration.
2. Drag the `.dmp` file into Visual Studio to open it.
3. Click `Set symbol paths` and add your project's `/bin` folder
4. Click `Debug with Managed Only`

At this point you should be brought to the line that threw the exception. You can't step though the code at this point, but you can see the values of your variables, and you can see how you got to that point with the call stack window (Debug->Windows->Call Stack or ctrl+D,C).
