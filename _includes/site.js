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

function facetSearchClick(facet){
    var search = getParameterByName('search');
    if (!search) search='';
    if (!facet) facet='';
    window.location.href = '/search?search=' + search + '&facet=' + facet;
}

function searchKeyPress(e){
    if (e.keyCode != 13) return;
    
    var facet = getParameterByName('facet');
    searchText = document.getElementById('searchText').value;
    if (!searchText) searchText='';
    if (!facet) facet='';
    window.location.href = '/search?search=' + searchText + '&facet=' + facet;
}

function getSearchResults(searchText, facet) {
    var searchUrl = 'https://hutchcodes.azurewebsites.net/api/Search';

    if (!searchText) searchText = '';
    if (!facet) facet = '';

    searchUrl += '?search=' + searchText + '&facet=' + facet;

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
    
            var main = document.getElementById('main');
            var section = document.getElementById('main').getElementsByTagName("section")[0];
            
            var results = xhr.responseText;
            section.innerHTML = results.substring(1, results.length -1) ;
        }
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