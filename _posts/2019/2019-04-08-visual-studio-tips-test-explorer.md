---
layout: post
title: Visual Studio Tips - Test Explorer
categories: [VSTips]
date: 2019-04-08
published: true
codeproject: true
devto: true
---

The Test Explorer has a great ability to filter tests in a number of different ways so you don't have to run your whole test suite when you're just working on something that only affects a handful of tests.

<!--more-->

First when running tests, remember the few handy keyboard shortcuts
- `Ctrl+R,T` - Run all tests
- `Ctrl+R,Ctrl+T` - Debug all tests
- `Ctrl+R,L` - Re-run last test run
- `Ctrl+R,Ctrl+L` - Debug last test run
 
The ability to re-run the last test run can be very handy if you don't want to take the time to filter your test run down. You can right click and run the test or group of tests that makes sense, then use the keyboard shortcut re-run that set of tests until you're ready to move on.

### Group By

By default, the Test Explorer window uses the 'Test Hierarchy' view which displays tests based on Project, Namespace, Class, Test, TestCase. If you turn off the 'Test Hierarchy' view you have the option to change the grouping to one of the following views:
- Class - Groups tests by Class, Test, TestCase. Though the namespace isn't displayed classes with the same name in different namespaces are shown separately.
- Duration - Groups tests into 3 buckets. Fast (<100ms), Medium, Slow (>1s)
- Namespace - Grouped by Namespace, Class, Test, TestCase
- Project - Grouped by Project, Test, TestCase (ignores Namespace)
- Outcome - Groups tests by Passed, Failed and Not Run. This is handy when you're trying to fix a handful of failing tests.
- Trait - Groups tests by various traits about the tests. Tests can be listed in this multiple times and combined with filters this can be a very powerful view.

![alt text](/img/2019/TestExplorerGroups.gif "Animation of selecting various group by options")

### Traits

How you assign Traits for tests differs depending on what unit testing framework you choose. This example shows some basic traits from nUnit. 

~~~csharp
[Category("Integration_Tests")]
[Property("Priority", 2)]
public class BazTests
{
    [Test]
    public void BazTest1()
    {
        Thread.Sleep(200);
        Assert.Fail();
    }

    [Test]
    [Explicit]
    [Category("Slow_Tests")]
    [Category("Useless_Tests")]
    public void BazTest2()
    {
        Thread.Sleep(2000);
        Assert.Fail();
    }
}
~~~

I've assigned all of the tests in the TestClass to the 'Integration_Tests' category, and also labeled that as 'Priority 2'. The `BazTest2` test has been also marked as `Explicit`, and it has been assigned that test to both the 'Slow_Tests' and the 'Useless_Tests' category. 

Now, when I view my test suite from the Test Explorer it looks like this

![alt text](/img/2019/TestExploreTraits.jpg "Tests grouped by Traits")

I can then apply a filter to that view to narrow it down. Let's say I wanted to look at just 'Integration_Tests', I can add the `Trait:"Integration_Tests"` filter to the search area of the Test Explorer. That removes all the tests that don't meet that criteria, which still leaves me with 2 tests, but it still shows the other `Traits` related to those tests. I could just right click on the 'Slow_Tests' node and choose 'Run Selected Tests' and I would just run the BazTest2.

### Playlists

Playlists allow you to create a custom group of tests by whatever criteria you decide. Maybe you have a group of tests that you want to run whenever you're working on a certain part of the code. You can add those tests to a playlist then select the playlist to filter your tests. You can also check in these playlists for others to use.

![alt text](/img/2019/TestExplorerPlaylist.gif "Animation of adding tests to a playlist")

### Run Tests After Build

Once you have your list of tests filtered just the way you want it, I recommend clicking the 'Run Tests After Build' button to ensure that your filtered list of tests runs after every build (tests marked `Explicit` will not run). 

![alt text](/img/2019/TestExplorerRunOnBuild.jpg "Run on build button")

Depending on how many tests you have in your filtered list, their performance and how well isolated they are, you may also want to have them run in parallel.

![alt text](/img/2019/TestExplorerRunParallel.jpg "Run Parallel button")
