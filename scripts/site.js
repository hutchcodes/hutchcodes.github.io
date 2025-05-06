
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