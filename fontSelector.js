var fontButton = document.getElementById("font-button");
var fontList = document.getElementById("font-list");

var fontClick = fontList.addEventListener("click", chooseFont, false);

function chooseFont(fontClick){
  // debugger;
  clearNetSpine();
  fontButton.style.fontFamily = fontClick.target.id;
  author.style.fontFamily = fontClick.target.id;
  clearNetSpine();
  title.style.fontFamily = fontClick.target.id;
  coverTitle.fontFamily = fontClick.target.id;
  coverAuthor.fontFamily = fontClick.target.id;
  titleFit();
  authorFit();
}