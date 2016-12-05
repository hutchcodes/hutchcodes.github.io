var menuVisible = false;

function menuButtonClick() {
	var nav = document.getElementById("NavSection");
    if (menuVisible) {
        nav.style.display = "";
        menuVisible = false;
        return;
    }
    nav.style.display = "block";
    menuVisible = true;
};

function menuClick() {
	var nav = document.getElementById("NavSection");
    nav.style.display = "";
    menuVisible = false;
}

var appInsights=window.appInsights||function(config){
    function i(config){t[config]=function(){var i=arguments;t.queue.push(function(){t[config].apply(t,i)})}}var t={config:config},u=document,e=window,o="script",s="AuthenticatedUserContext",h="start",c="stop",l="Track",a=l+"Event",v=l+"Page",y=u.createElement(o),r,f;y.src=config.url||"https://az416426.vo.msecnd.net/scripts/a/ai.0.js";u.getElementsByTagName(o)[0].parentNode.appendChild(y);try{t.cookie=u.cookie}catch(p){}for(t.queue=[],t.version="1.0",r=["Event","Exception","Metric","PageView","Trace","Dependency"];r.length;)i("track"+r.pop());return i("set"+s),i("clear"+s),i(h+a),i(c+a),i(h+v),i(c+v),i("flush"),config.disableExceptionTracking||(r="onerror",i("_"+r),f=e[r],e[r]=function(config,i,u,e,o){var s=f&&f(config,i,u,e,o);return s!==!0&&t["_"+r](config,i,u,e,o),s}),t
}({
    instrumentationKey:"ac20dda6-b446-4b2a-81b0-c4c521c06f6f"
    });
   
window.appInsights=appInsights;
appInsights.trackPageView();

function catSearchClick(cat){
    var search = getParameterByName('search');
    if (!search) search='';
    if (!cat) cat='';
    window.location.href = '/search?search=' + search + '&cat=' + cat;
}

function searchKeyPress(e){
    if (e.keyCode != 13) return;
    
    var cat = getParameterByName('cat');
    var tag = getParameterByName('tag');
    var catFilter = '';
    var tagFilter = '';
    searchText = document.getElementById('searchText').value;
    if (!searchText) searchText='';
    searchText = encodeURIComponent(searchText);
    if (cat) catFilter = '&cat=' + cat;
    if (tag) tagFilter = '&tag=' + tag;
    window.location.href = '/search?search=' + searchText + catFilter + tagFilter
}

function getSearchResults(searchText, cat, tag) {
    var searchUrl = 'https://blogpost.azurewebsites.net/api/HttpTriggerCSharp1';

	appInsights.trackEvent("Search", { search: searchText, category: cat, tag: tag });

    if (!searchText) searchText = '';
    if (!cat) cat = '';
    if (!tag) tag = '';

    searchUrl += '?search=' + searchText + '&cat=' + cat + '&tag=' + tag;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = searchCallback;
    
    xhr.open('GET', searchUrl, true);
    xhr.send('');
    document.xhr = xhr;

    function searchCallback(){
        if(xhr.readyState === 4) {
            if(xhr.status !== 200) {
                alert('Search failed! ' + xhr.status + xhr.responseText);
                return;
            }
    
            var searchResults = JSON.parse(xhr.responseText);
            window.searchResults = searchResults;
            displaySearchResults(searchResults);
        }
    }
}

function displaySearchResults(searchResults){

	var response = '';
	var main = document.getElementById('main');	
    var section = document.getElementById('main').getElementsByTagName("section")[0];

    for (var x=0; x < searchResults.Results.length; x++)
    {
    	var r = searchResults.Results[x];
        if (r.Document.Type == "post") {
            var categories = "";
            for (var y=0; y < r.Document.Categories.length; y++)
            {
            	var c = r.Document.Categories[y];
                categories += "<a href='/search/?search&cat=" + c + "'>" + c + "</a>&nbsp;";
            }
            if (!categories)
            {
                categories = " in " + categories;
            }
            response += "<article class='post'> <header class='jumbotron'> <h2 class='postTitle'><a href='" + r.Document.Url + "'>" + r.Document.Title + "</a></h2> <abbr class='postDate' title='" + r.Document.PublishDate + "'>" + new Date(r.Document.PublishDate).toLocaleDateString("en-us", {year: "numeric", month: "long", day: "numeric"}) + "</abbr> " + categories + "</header> <div class='articleBody'>" + r.Document.Excerpt + "</div><div><a href='" + r.Document.Url + "'>Continue Reading</a></div></article>";
        }
        else
        {
            response += "<article class='post'> <header class='jumbotron'> <h2 class='postTitle'><a href='" + r.Document.Url + "'>" + r.Document.Title + "</a></h2></header> <div class='articleBody'>" + r.Document.Excerpt + "</div><div><a href='" + r.Document.Url + "'>Continue Reading</a></div></article>";
        }
    }
    section.innerHTML = response;
}

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}