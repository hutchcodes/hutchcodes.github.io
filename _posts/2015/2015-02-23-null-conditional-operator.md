---
layout: post
categories: [C#]
title: Null Conditional Operator
---
<p>There are a bunch of cool features coming in C#6, but the one I’m looking forward to the most is the Null Conditional Operator.&nbsp; Developers write a lot of code to check if a value is null.&nbsp; Sometimes it creates a deep and ugly nest of if statements.&nbsp; Let’s say you are trying to find a customer’s primary contact’s city, it might look like this:</p>
<!--more-->

~~~ csharp
string primaryContactCity;
if (customer.PrimaryContact != null)
{
    if (customer.PrimaryContact.Address != null)
    {
        primaryContactCity = customer.PrimaryContact.Address.City;
    }
}
~~~

<p>Or maybe you prefer less nesting and instead use a longer if statement:</p>

~~~ csharp
string primaryContactCity;
if (customer.PrimaryContact != null && customer.PrimaryContact.Address != null)
{
    primaryContactCity = customer.PrimaryContact.Address.City;
}
~~~

With the new Null Conditional Operator you can just put <strong>?.</strong> in place of the <strong>.</strong>.  If the value to the left of the <strong>?.</strong> is null it returns null otherwise it returns the property to the right.  These two bits of code return the same thing:
	
~~~ csharp
Address primaryContactAddress;
if (customer.PrimaryContact != null)
{
    primaryContactAddress = null;
}
else
{
    primaryContactAddress = customer.PrimaryContact.Address;
}

Person primaryContactAddress = customer?.primaryContact.Address;
~~~

So the deep nest from above can be re-written as:

~~~ csharp
string primaryContact = customer?.primaryContact?.Address?.City;
~~~

It starts to get some real power when you use it in combination with the Null Coalescing Operator <strong>??</strong>  In the following code we return the City as 'Unknown' if the PrimaryContact is null, or if the Address is null, or the City is null.

~~~ csharp
string primaryContactCity = customer.primaryContact?.Address?.City ?? "Unknown";
~~~
