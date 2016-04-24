---
layout: post
categories: [Random]
title: Show File Extension in Sharepoint Document Library
---
I was recently tasked with changing the view in our TFS Project Portal's document library to show the file extension so you knew whether you were opening a PDF, Word Document, PowerPoint or something else for which you might not have the software installed.  There is an easy way and a hard way, and the guidance I received from a few Google searches skipped a few steps on the hard way.
<!--more-->

<h2>Easy Way</h2>
<ol>
	<li>Open the Document Library</li>
	<li>Click on the Library Tools -&gt; Library tab at the top</li>
	<li>Scroll to the bottom and click the view you wish to change</li>
	<li>Check "Name used in forms" column</li>
</ol>
This adds a new column with the full file name and extension, but it's not clickable to view the document, so you end up with two columns for document name, the name and the name with extension.  This is why I ended up going down the hard way.
<h2>Hard Way</h2>
<ol>
	<li>Open the site in SharePoint Designer</li>
	<li>Click Lists and Libraries and open the Document Library you want to modify</li>
	<li>Open the View you want to modify</li>
	<li>Right click on the first row in the Name column and select Insert Formula</li>
	<li>In the Edit XPath expression box enter something that is easily searchable ie. xxxxxxxx</li>
	<li>Click OK</li>
	<li>Switch to the Code View</li>
	<li>Search for your xxxxxxx and delete the element it created</li>
	<li>Right above or below that should be an element like so <em>&lt;xsl:value-of select="$thisNode/@FileLeafRef.Name" /&gt;</em></li>
	<li>Replace that with <em>&lt;xsl:value-of select="$thisNode/@FileLeafRef.Name" /&gt;&lt;xsl:if test="$thisNode/@FileLeafRef.Suffix!=''"&gt;.&lt;xsl:value-of select="$thisNode/@FileLeafRef.Suffix" /&gt;&lt;/xsl:if&gt;</em></li>
	<li>Save, exit and you're done</li>
</ol>
The examples I found online left out steps 4-8, and until I did those the &lt;xsl:value-of select="$thisNode/@FileLeafRef.Name" /&gt; element didn't exist.

