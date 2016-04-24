---
layout: post
title: XPath to Select Node Based on Child Node's Attribute
categories: [XPath]
---

Thankfully I don't use XPath frequently, but every time I do I end up having to google something.  Today was no different except that my googling turned up nothing on my problem.

I needed to select a node based on the attribute of one of it's child nodes. Simple right?
<!--more-->

In this case I'm trying to find all the topics where a certain image is used.

~~~ xml
<Topics>
	<Topic>
		<Title></Title>
		<Description></Description>
		<Content>
			<Image Id="123" />
			<ContentPart />
			<ContentPart />
		</Content>
	</Topic>
	<Topic>
		<Title></Title>
		<Description></Description>
		<Content>
			<ContentPart />
		</Content>
	</Topic>
</Topics>
~~~

It's simple as long as you know how deep to look for the attribute 

	/Topics/Topic[Content/Image[@Id='123']]

But in my situation those images could be anywhere in the topic. I couldn't specify the path to take through the tree to search for the image element.

~~~ xml
<Topics>
	<Topic>
		<Title></Title>
		<Description></Description>
		<Content>
			<Image Id="123" />
			<ContentPart />
			<ContentPart />
		</Content>
	</Topic>
	<Topic>
		<Title></Title>
		<Description></Description>
		<Content>
			<ContentPart>
				<Image Id="123" />
			</ContentPart>
		</Content>
	</Topic>
</Topics>
~~~

The answer was elusive for longer than I'd care to admit. I'd either get all the `Topic` elements or none. Here's one of the ways I got all the elements.

	/Topics/Topic[//Image[@Id='123']]

In hindsight I can see the `[//Image[@Id='123']]` was going to search the whole document for Image elements with Id of 123.  

There are a seemingly infinite number of ways to get no `Topic` elements returned. Including many ways that are just invalid XPath.

What finally did work was the `.` operator. It selects the current element

	/Topics/Topic[.//Image[@Id='123']]

In the end it was simple, but I couldn't google up an answer, so we get a blog post. Hopefully this will help the next person struggling with the same issue, and hopefully I'll never write another XPath query after this project ;)
