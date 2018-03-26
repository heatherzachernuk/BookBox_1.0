var gradient = document.getElementById("gradient");
var coverImage = document.getElementById("image-canvas");
var coverSwatch = document.getElementById("cover-swatch");
var detailsSwatch = document.getElementById("details-swatch");
var colorPath = "background";
var rgba = "rgba(0, 0, 0, 1)";

var imagePicker = document.getElementById("image-picker");
var gradientPicker = document.getElementById("gradient-picker");

var selector;

document.getElementById("stripes").addEventListener("change", stripesOn);

function stripesOn(){
  clearNetSpine();
  if(stripes === "off"){
    stripeColor = title.style.color;
    stripes = "on";
    config.stripes = "on";
    config.stripeCheck = "true";
    saveConfig();
    line1.style.borderRight = "3px solid "+stripeColor; 
    line2.style.borderRight = "3px solid "+stripeColor; 
    line3.style.borderRight = "3px solid "+stripeColor; 
    line4.style.borderRight = "3px solid "+stripeColor;
  }
  else{ 
    stripes = "off";
    config.stripeCheck = "false";
    config.stripes = "off";
    saveConfig();
    line1.style.borderStyle = "none";
    line2.style.borderStyle = "none";
    line3.style.borderStyle = "none";
    line4.style.borderStyle = "none";
  }
  titleFit();
  authorFit();
}

gradient.addEventListener("click", whichColors, false);
coverImage.addEventListener("click", whichColors, false);
coverSwatch.addEventListener("click", whichColors, false);
detailsSwatch.addEventListener("click", whichColors, false);

// determines whether the user is changing the color of the background or the details
function whichColors(){
  if(event.target === coverSwatch){
    coverSwatch.style.border = "thin solid red";
    detailsSwatch.style.border = "none";
    colorPath = "background";
  }
  if(event.target === detailsSwatch){
    coverSwatch.style.border = "none";
    detailsSwatch.style.border = "thin solid red";
    colorPath = "detail";
  }
  if(event.target === gradient){
    gradientPicker.checked = true;
    // gradient.style.visibility = "visible";
    selector = gradient;
  }
  if(event.target === coverImage){
    imagePicker.checked = true;
    selector = coverImage;
  }
  if(gradientPicker.checked){
    // gradient.style.visibility = "visible";
    // console.log(gradient.style.visibility);
    selector = gradient;
  }
  if(imagePicker.checked){
  //   gradient.style.visibility = "hidden";
    // console.log("clack");
    selector = coverImage;
  }
  colorListeners();
}

function colorListeners(){
  selector.addEventListener("mousemove", pickColor);
  selector.addEventListener("click", stopLooking, false);
  gradient.removeEventListener("click", whichColors);
  coverImage.removeEventListener("click", whichColors);
  coverSwatch.removeEventListener("click", whichColors);
  detailsSwatch.removeEventListener("click", whichColors);
}

function pickColor(color){
  clearNetSpine();
  selector.style.cursor = "crosshair";
  var context = selector.getContext("2d");
  var offsetX = selector.getBoundingClientRect().left;
  var offsetY = selector.getBoundingClientRect().top;
  var colorValue = context.getImageData(color.clientX - offsetX, color.clientY - offsetY, 1, 1).data;
  rgba = 'rgba(' + colorValue[0] + ', ' + colorValue[1] + ', ' + colorValue[2] + ', ' + (colorValue[3] / 255) + ')';

  if(colorPath === "background"){
    backgroundColor = rgba;
    coverSwatch.style.backgroundColor = rgba; 
    spine.style.backgroundColor = rgba; 
    var rects  = document.getElementsByClassName("net");
    for(var i = 0; i < rects.length; i++){
      rects[i].setAttribute("fill", rgba); 
    }
    buildNetSpine();
  }
  if(colorPath === "detail"){
    detailsSwatch.style.backgroundColor = rgba; 
    coverTitle.style.color = rgba;
    coverAuthor.style.color = rgba;
    title.style.color = rgba; 
    author.style.color = rgba; 
    if(stripes === "on"){
      line1.style.borderRight = "3px solid "+rgba; 
      line2.style.borderRight = "3px solid "+rgba; 
      line3.style.borderRight = "3px solid "+rgba; 
      line4.style.borderRight = "3px solid "+rgba;
    }
    if(coverImageExists === false){
    coverFit();
    }
    titleFit();
    document.getElementById("landscape").checked = "true";
    spine.style.transform = "none";
    authorFit();
  }
}

function stopLooking(){
  selector.removeEventListener("mousemove", pickColor);
  selector.removeEventListener("click", stopLooking);
  gradient.addEventListener("click", whichColors, false);
  coverImage.addEventListener("click", whichColors, false);
  coverSwatch.addEventListener("click", whichColors, false);
  detailsSwatch.addEventListener("click", whichColors, false);
}






