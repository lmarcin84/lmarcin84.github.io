// while
function convert() {
      var textIn = document.getElementById("textIn").value;
      var textOut = document.getElementById("textOut").value; 
      var divider = document.getElementById("divider").value;
      var keepText = document.getElementById("keepText").value;
      var filterText = new RegExp("[^" + keepText + "]+", "gmu");
      (!textOut) ? textOut = textIn : textOut = "";
      textOut = textOut.trim().replace(filterText, divider);
      document.getElementById("textOut").value = textOut.split(divider).filter(function (x, n, s) { return s.indexOf(x) == n }).join(divider);
}

