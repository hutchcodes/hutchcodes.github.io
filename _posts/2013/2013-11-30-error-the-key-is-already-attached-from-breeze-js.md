---
layout: post
categories: [JavaScript]
title: 'Error: The Key is Already Attached from Breeze.js'
---
First let me say if you're reading this and you haven't checked out <a href="http://www.breezejs.com/" target="_blank"> Breeze.js</a>, you should.  It's a nice little library.  I'm using it in an <a href="http://angularjs.org/" target="_blank">Angular.js</a> based application and it has greatly simplified data access.  Now on to the show.

I'm using Breeze.js for data access and as part of that I am registering some constructors like so.
<!--more-->

~~~ javascript
var AddressCtor = function () {
    this.CompanyId = document.getElementById('CompanyId').value;
};

var NoteCtor = function () {
    this.CompanyId = document.getElementById('CompanyId').value;
};

metadataStore.registerEntityTypeCtor('Address', AddressCtor);
metadataStore.registerEntityTypeCtor('Note', NoteCtor);
~~~

Everything was working fine then I tried to do a little code cleanup.  The constructors for Note and Address were identical.   So, of course I, re-factored them into a single generically named function.

~~~ javascript
var CompanyEntity = function () {
    this.CompanyId = document.getElementById('CompanyId').value;
};

metadataStore.registerEntityTypeCtor('Address', CompanyEntity);
metadataStore.registerEntityTypeCtor('Note', CompanyEntity);
~~~

Well, it appears that you cannot register 2 constructors that call the same function like that.  If you do you the error "The Key is Already Attached: Note:Webapplication1", and no data loaded in the Angular app.

When I finally found the cause, I couldn't believe it.  The fix that I came up with was to pass null as the constructor parameter and move that CompanyId assignment into a function that is passed as the init parameter.  This has the added bonus that entities that need to do a series of things AND set the CompanyId can just call the companyEntityInit function from inside their initializers.

~~~ javascript
function companyEntityInit(entity) {
    entity.CompanyId = document.getElementById('CompanyId').value;
};

metadataStore.registerEntityTypeCtor('Address', null, companyEntityInit);
metadataStore.registerEntityTypeCtor('Note', null, companyEntityInit);
~~~
