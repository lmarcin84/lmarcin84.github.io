// while
function convert() {
  var textIn = document.getElementById("textIn").value;
  var textOut = document.getElementById("textOut").value; 
  var divider = document.getElementById("divider").value;
  var keepText = document.getElementById("keepText").value;
  
  if (!textOut) textOut = textIn 
  else textOut = "";

  var filterText = new RegExp("[^" + keepText + "]+", "gmu");
  //console.log(filter);
  // var i = 1;
  // while ((textIn.length) > i) {
    // i++;
  textOut = textOut.trim();
  textOut = textOut.replace(filterText, divider);
  document.getElementById("textOut").value = textOut.split(divider).filter(function (x, n, s) { return s.indexOf(x) == n }).join(divider);
  // }
}

