---
title: Searching...
layout: page
includeInSearch: false
permalink: /search/
published: true
---

<script>
var query = getParameterByName('search');
var facet = getParameterByName('facet');

window.onload = function(){
	var query = getParameterByName('search');
	document.getElementById('searchText').value = query;
};

getSearchResults(query, facet);
</script>


