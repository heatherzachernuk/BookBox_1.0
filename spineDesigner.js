document.getElementById("get-details").addEventListener("click", addText, false);

function addText(){
  clearNetSpine();
  var titleText = document.getElementById("title-input").value;
  var authorText = document.getElementById("author-input").value;

  config.titleText = titleText;
  config.titleText = authorText;
  saveConfig();
  title.innerHTML = titleText;
  author.innerHTML = authorText;
  // updates all the fonts in the list to be the input title
  Array.from(document.querySelectorAll(".font")).forEach(el => el.innerHTML = titleText);
  titleFit();
  authorFit();
}

function titleFit(){
  // figures out where the stripes are gonna be, if there are any
  if(stripes === "off"){
    title.style.left = "1em";
  }
  else {
    title.style.left = line2.getBoundingClientRect().width + 5 + "px"; 
  }
  
  var spineHeight = spine.getBoundingClientRect().height;
  var emSize = 6;
  title.style.fontSize = emSize + "em";
  var titleHeight = title.getBoundingClientRect().height;
  if(title.innerHTML.length < 25){
    title.style.whiteSpace = "nowrap";
  }
  else{
    title.style.whiteSpace = "normal";
  }
  while(titleHeight > spineHeight || title.clientWidth < title.scrollWidth){
    emSize -= 0.25;
    title.style.fontSize = emSize + "em";
    titleHeight = title.getBoundingClientRect().height;
  }
}

function authorFit(){
  // finds the size of the space between the book title and the first bottom stripe
  var authorSpace = line3.getBoundingClientRect().right - title.getBoundingClientRect().right;
  var emSize = 3;
  author.style.fontSize = emSize + "em";
  
  // refers to the "height" - pre-rotation
  // author.style.height = authorSpace + "px";
  // what's the point in setting this if it changes?
  author.style.width = spine.getBoundingClientRect().height - 6 + "px";
  
  var textBoxHeight = author.getBoundingClientRect().width;
  while(textBoxHeight > authorSpace || author.clientHeight < author.scrollHeight || author.clientWidth < author.scrollWidth){
    // debugger;
    emSize -= 0.15;
    author.style.fontSize = emSize + "em";
    textBoxHeight = author.getBoundingClientRect().width;
  }
  // sets the position of the author to just above the spine line below
  if(stripes === "on"){
  author.style.left = line3.getBoundingClientRect().width - 2 + "px";
  }
  else{
  author.style.left = spine.getBoundingClientRect().width - 8 + "px";
  }
  // centers the author text
  authorMargin = ((spine.getBoundingClientRect().height - author.getBoundingClientRect().height)/2);
  author.style.bottom = authorMargin + "px";
  // debugger;
  buildNetSpine();
}

document.getElementById("portrait").addEventListener("click", onclickSpineOrientation, false);
document.getElementById("landscape").addEventListener("click", onclickSpineOrientation, false);

function onclickSpineOrientation(event){
  spineRotate(event.target.value);
}

function spineRotate(value){
  if(value === "landscape"){
    spine.style.transform = "none";
  }
  if(value === "portrait"){
    spine.style.transformOrigin = "0 0";
    spine.style.transform = "translate("+x+"px, 0) rotate(90deg)"; 
  }
}

function buildNetSpine(){

  var top = rect2.getBoundingClientRect().top;
  var left = rect2.getBoundingClientRect().left;
  netSpine = spine.cloneNode(true);
  netSpine.id = "net-spine";
  document.getElementById("left-page").appendChild(netSpine);
  netSpine.style.position = "fixed";
  netSpine.style.transformOrigin = "0 0";
  netSpine.style.transform = "rotate(90deg) scale(0.5)";
  netSpine.style.top = top + "px";
  netSpine.style.left = left + z + "px";
}

function clearNetSpine(){
  if(netSpine){
    netSpine.remove();
  }
}
