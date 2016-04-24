---
layout: post
categories: [C#]
title: C#6 String Interpolation
---
Another feature I’m looking forward to in C#6 is string interpolation.  We’ve all had to create string messages to show the user that include data from the application, or maybe we’re just writing some debug information to the console.  We can build these messages a few ways right now.
<!--more-->

~~~ csharp    
//string concatenation
logMessage = "User '" + userName + "' logged in at " + loginDate.ToString();

//string.Format
logMessage = string.Format("User '{0}' logged in at {1}", userName, loginDate.ToString());
~~~ 

C#6 gives us a third method – String Interpolation.  This allows us to include expressions directly in our string literals.  Just place the value between 2 curly braces.

~~~ csharp
logMessage = $"User '{userName}' logged in at {loginDate}";
//User 'jrhutch' logged in at 3/31/2015 2:03:31 PM
~~~

You can also apply formatting to the values

~~~ csharp
myString = $"User 'I spent {54.235 :C2}' at {someDate : HH:mm}";
//I spent $54.24 at 14:04
~~~

Or if you really want to get crazy (and I’m not sure I’d take it this far), you can use a conditional expression to decide the content of your string

~~~ csharp
msg = $"{unreadCnt} unread {(unreadCnt == 1 ? "message" : "messages")}";
//1 unread message
//2 unread messages
~~~

I wouldn’t say I’ll be doing all my string generation with interpolation, but it sure is nice to have another tool in the box.


