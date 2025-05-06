var menuVisible = false;
var searchUrl = 'https://hutchcodesblog.azurewebsites.net/api/Search';

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
    window.location.href = '/search?search=' + searchText + catFilter + tagFilter;
}

function getSearchResults(searchText, cat, tag) {
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

    for (var x=0; x < searchResults.length; x++)
    {
    	var r = searchResults[x];
        if (r.document.type == "post") {
            var categories = "";
            for (var y=0; y < r.document.categories.length; y++)
            {
            	var c = r.document.categories[y];
                categories += "<a href='/search/?search&cat=" + c + "'>" + c + "</a>&nbsp;";
            }
            if (!categories)
            {
                categories = " in " + categories;
            }
            response += "<article class='post'> <header class='jumbotron'> <h2 class='postTitle'><a href='" + r.document.url + "'>" + r.document.title + "</a></h2> <abbr class='postDate' title='" + r.document.publishDate + "'>" + new Date(r.document.publishDate).toLocaleDateString("en-us", {year: "numeric", month: "long", day: "numeric"}) + "</abbr> " + categories + "</header> <div class='articleBody'>" + r.document.excerpt + "</div><div><a href='" + r.document.url + "'>Continue Reading</a></div></article>";
        }
        else
        {
            response += "<article class='post'> <header class='jumbotron'> <h2 class='postTitle'><a href='" + r.document.url + "'>" + r.document.title + "</a></h2></header> <div class='articleBody'>" + r.document.excerpt + "</div><div><a href='" + r.document.url + "'>Continue Reading</a></div></article>";
        }
    }
    if (response){
        section.innerHTML = response;
    }
    else{
        document.getElementById("searchMessage").innerHTML = "No results found."
    }
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