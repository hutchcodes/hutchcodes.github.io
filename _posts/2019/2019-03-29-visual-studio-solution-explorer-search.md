---
layout: post
title: Visual Studio Tips - Solution Explorer Search
categories: [VSTips]
date: 2019-03-29
published: true
codeproject: true
devto: true
---

Solution Explorer Search has been in Visual Studio for a while, but there are a few features that I think many developers overlook (myself included). Here are a few that you might have missed.

<!--more-->

By default, the search will search `Ctrl+;` both the file names and the contents. This is what we want most of the time, but it is possible to search just the file names.

![alt text](/img/2019/SolutionExplorerSearchNoContents.gif "Visual of disabling search within file contents.")

Some other filters you can apply to your search are Open Files `Ctrl+[,O` and Pending Changes `Ctrl+[,P`. These can be particularly useful when you're working on a feature that requires changes across multiple files in different layers of your solution. In the gif below I show these filters being used via the UI.

![alt text](/img/2019/SolutionExplorerSearchFilters.gif "Visual of using search search filters.")


