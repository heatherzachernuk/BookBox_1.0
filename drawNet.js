// values for width, height and depth of the bookbox
var x;
var y;
var z;
var holder;

// object where the cover image is drawn on the net
var coverImage = document.getElementById("image-canvas");
var coverImageExists = false;

// the actual cover image element
var image = document.getElementById("image");
image.crossOrigin = "Anonymous";


var imageHeight;
var imageWidth;
var margin;
var stripes = "off";
var frontStripes = "off";
var stripeClose = document.getElementById("stripe-close");

var rect1 = document.getElementById("rect-1");
var rect2 = document.getElementById("rect-2");
var rect3 = document.getElementById("rect-3");
var rect4 = document.getElementById("rect-4");
var rect5 = document.getElementById("rect-5");
var rect6 = document.getElementById("rect-6");

var line1 = document.getElementById("line-1");
var line2 = document.getElementById("line-2");
var line3 = document.getElementById("line-3");
var line4 = document.getElementById("line-4");

var coverLine1 = document.getElementById("cover-line-1"); 
var coverLine2 = document.getElementById("cover-line-2");
var coverLine3 = document.getElementById("cover-line-3");
var coverLine4 = document.getElementById("cover-line-4");
// var stripePicker = document.getElementById("stripe-picker");

var spine = document.getElementById("spine");
var title = document.getElementById("spine-title");
var author = document.getElementById("spine-author");
var netSpine;

var config = {};

function saveConfig(){
  localStorage.setItem("configItem", JSON.stringify(config));
}

function loadConfig(){
  config = JSON.parse(localStorage.getItem("configItem"));
}

window.addEventListener("load", updateDimensions, false);
// window.addEventListener("load", () => spineCoordinates("landscape"), false);
document.getElementById("gat").addEventListener("click", updateDimensions, false);
document.getElementById("cover-file").addEventListener("change", loadCover);

function updateDimensions(){
  document.getElementById("landscape").checked = "true";
  spine.style.transform = "none";
  x = 75;
  y = 100;
  z = 25;
  var wordCount = document.getElementById("count-input").value;
  y = (y * Math.log(wordCount)/Math.log(100000) - y) * 2 + y;
  z = (z * Math.log(wordCount)/Math.log(100000) - z) * 2 + z;
  x *= 2;
  y *= 2;
  z *= 2;
  drawColorPicker();
  drawNet();
  coverContent();
}

function coverContent(){
  clearNetSpine();
  imageCoordinates();
  // even if the user doesn't want stripes, it makes more sense to draw them only once
  foreEdgePattern();
  drawStripes();
  titleFit();
  authorFit();
}

function loadCover(changeEvent){
  var file = changeEvent.target.files[0];
  var reader = new FileReader();
  reader.addEventListener("load", onCoverFileLoaded);
  reader.readAsDataURL(file); 
  document.getElementById("image-picker-div").style.visibility = "visible";
  coverImageExists = true;
}

function onCoverFileLoaded(fileLoadEvent){
  // coverImage.style.display = "block";
  image.src = fileLoadEvent.target.result;
  image.onload = coverContent;
}

function drawNet(){
  setAttributes("net", {width:2*z + 2*x, height:2*z + y});
  setAttributes("rect-1", {x:z, y:0, width:x, height:z});
  setAttributes("rect-2", {x:0, y:z, width:z, height:y});
  setAttributes("rect-3", {x:z, y:z, width:x, height:y});
  setAttributes("rect-4", {x:z+x, y:z, width:z, height:y});
  setAttributes("rect-5", {x:2*z+x, y:z, width:x, height:y});
  setAttributes("rect-6", {x:z, y:z+y, width:x, height:z});
  spine.style.width = y*2 + "px";
  spine.style.height = z*2 + "px";
  
}

function setAttributes(objectId, attributes){
  var object = document.getElementById(objectId);
  for(var prop in attributes){
    object.setAttribute(prop, attributes[prop]);
  }
}

// checks whether your cover image is taller or wider
function imageCoordinates(){
  holder = rect3.getBoundingClientRect();
  var coverRectX = holder.x;
  var coverRectY = holder.y;
  if(coverImageExists === false){
    coverImage.style.top = coverRectY + "px"; 
    coverImage.style.left = coverRectX + "px";
    var textCover = document.getElementById("text-only");
    textCover.style.height = holder.height; 
    textCover.style.width = holder.width; 
    textCover.style.top = coverRectX + "px";
    textCover.style.left = coverRectY + "px";
    textCover.style.outline = "solid thin red";
    textCover.style.position = "fixed";
  }
  else{
    coverImage.width = x;
    coverImage.height = y;
    //what are the 4px on the left from?
    var ctx = coverImage.getContext("2d");
    var targetAspect = image.width/image.height;
    // if the cover image is proportionally shorter and wider than the net cover
    if(targetAspect > x/y){
      imageHeight = x/targetAspect; 
      imageWidth = x;
      margin = (y - imageHeight)/2;    
      coverImage.style = ("top: " + (coverRectY + margin) + "px; left: " + coverRectX + "px;");
      ctx.drawImage(image, 0, 0, x, imageHeight);
    }
    // if the cover image is proportionally taller and skinner than the net cover
    else if(targetAspect <= x/y){
      imageHeight = y;
      imageWidth = y * targetAspect;
      margin = (x - imageWidth)/2;
      coverImage.style = ("top: " + coverRectY + "px; left: " + (coverRectX + margin) + "px;");
      ctx.drawImage(image, 0, 0, imageWidth, y);
    } 
    if(0.85*targetAspect > x/y){
      frontStripes = "on";
    }
    else {
      frontStripes = "off";
    }
  }
  drawStripes();
}

// gets the co-ordinates for adding stripes, whether the user wants stripes or not
function drawStripes(){
  var lineSpace = 4;
  
  if(frontStripes === "on"){
    setAttributes("cover-line-1", {x1:z, y1:z+margin/2-lineSpace, x2:z+x, y2:z+margin/2-lineSpace}); 
    setAttributes("cover-line-2", {x1:z, y1:z+margin/2, x2:z+x, y2:z+margin/2}); 
    setAttributes("cover-line-3", {x1:z, y1:y+z-margin/2, x2:z+x, y2:y+z-margin/2}); 
    setAttributes("cover-line-4", {x1:z, y1:y+z-margin/2+lineSpace, x2:z+x, y2:y+z-margin/2+lineSpace}); 
    line1.style.width = margin-2*lineSpace +"px";
    line2.style.width = margin +"px";
    line3.style.width = 2*y-margin +"px";
    line4.style.width = 2*y-margin + 2*lineSpace +"px";
  }  
  if(frontStripes === "off") {
    setAttributes("cover-line-1", {x1:z, y1:z+y/30, x2:z, y2:z+y/30});
    setAttributes("cover-line-2", {x1:z, y1:z+y/30+lineSpace, x2:z, y2:z+y/30+lineSpace}); 
    setAttributes("cover-line-3", {x1:z, y1:y+z-y/30-lineSpace, x2:z, y2:y+z-y/30-lineSpace}); 
    setAttributes("cover-line-4", {x1:z, y1:y+z-y/30, x2:z, y2:y+z-y/30}); 
    line1.style.width = 2*(y/10)+"px";
    line2.style.width = 2*(y/10)+2*lineSpace+"px";
    line3.style.width = 2*(y-y/10)-2*lineSpace+"px";
    line4.style.width =  2*(y-y/10)+"px";
  }
  
  var spineHeight = 2*z+"px"; 
  line1.style.height = spineHeight;
  line2.style.height = spineHeight;
  line3.style.height = spineHeight;
  line4.style.height = spineHeight;
}

function foreEdgePattern(){
  document.getElementById("page");
  var pageCtx = page.getContext("2d");
  var pageGradient = pageCtx.createLinearGradient(40, 0, 40, 3);
  pageGradient.addColorStop(0, 'rgb(211, 218, 209)');
  pageGradient.addColorStop(1, 'rgb(190, 173, 121)');
  pageCtx.fillStyle = pageGradient;
  pageCtx.fillRect(0, 0, 3, 3);
  
  var topPage = document.getElementById("top-page");
  
  topPage.height = z;
  topPage.width = x;
  topPage.style.top = rect1.getBoundingClientRect().top + "px";
  topPage.style.left = rect1.getBoundingClientRect().left + "px";
  
  var topPageCtx = topPage.getContext("2d");
  var pagePattern = topPageCtx.createPattern(page, "repeat");
  topPageCtx.fillStyle = pagePattern;
  topPageCtx.fillRect(0,0, topPage.width, topPage.height); 
  
  var bottomPage = document.getElementById("bottom-page");
  
  bottomPage.height = z;
  bottomPage.width = x;
  bottomPage.style.top = rect6.getBoundingClientRect().top + "px";
  bottomPage.style.left = rect6.getBoundingClientRect().left + "px";
  
  var bottomPageCtx = bottomPage.getContext("2d");
  bottomPageCtx.fillStyle = pagePattern;
  bottomPageCtx.fillRect(0,0, bottomPage.width, bottomPage.height); 
  
  var vertPage = document.getElementById("page");
  var vertPageCtx = vertPage.getContext("2d");
  var vertPageGradient = vertPageCtx.createLinearGradient(0, 30, 3, 30);
  vertPageGradient.addColorStop(0, 'rgb(211, 218, 209)');
  vertPageGradient.addColorStop(1, 'rgb(190, 173, 121)');
  vertPageCtx.fillStyle = vertPageGradient;
  vertPageCtx.fillRect(0, 0, 30, 30);
  
  var foreEdge = document.getElementById("fore-edge");
  
  foreEdge.height = y;
  foreEdge.width = z;
  foreEdge.style.top = rect4.getBoundingClientRect().top + "px";
  foreEdge.style.left = rect4.getBoundingClientRect().left + "px";
  
  var foreEdgeCtx = foreEdge.getContext("2d");
  var vertPagePattern = foreEdgeCtx.createPattern(vertPage, "repeat");
  foreEdgeCtx.fillStyle = vertPagePattern;
  foreEdgeCtx.fillRect(0,0, foreEdge.width, foreEdge.height); 
}

function drawColorPicker(){
  var ctx = gradient.getContext("2d");           
  var rainbowGradient = ctx.createLinearGradient( 10, 200, 200, 200);
  rainbowGradient.addColorStop(0, '#ff0000');
  rainbowGradient.addColorStop(1/8, '#ff8000');
  rainbowGradient.addColorStop(2/8, '#ffff00');
  rainbowGradient.addColorStop(3/8, '#00ff00');
  rainbowGradient.addColorStop(4/8, ' #0066ff');
  rainbowGradient.addColorStop(5/8, '#6600ff');
  rainbowGradient.addColorStop(6/8, '#ff00ff');
  rainbowGradient.addColorStop(7/8, '#ff0000');
  rainbowGradient.addColorStop(1, '#000000');
  ctx.fillStyle = rainbowGradient;
  ctx.fillRect(10, 10, 200, 200);
  
  var whiteGradient = ctx.createLinearGradient(200, 200, 200, 10);
  whiteGradient.addColorStop(0, 'hsla(0, 0%, 100%, 0)');
  whiteGradient.addColorStop(1, 'hsla(0, 0%, 100%, 0.95)');
  ctx.fillStyle = whiteGradient;
  ctx.fillRect(10, 10, 200, 200);
  
  var blackGradient = ctx.createLinearGradient(200, 200, 200, 10);
  blackGradient.addColorStop(0, 'hsla(0, 0%, 0%, 1)');
  blackGradient.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
  ctx.fillStyle = blackGradient;
  ctx.fillRect(10, 10, 200, 200);
}

