// for
// function przepisz() {
//   if (!document.form1.pole2.value) document.form1.pole2.value = document.form1.pole1.value
//   else document.form1.pole2.value = ''

//   for (i = 1; i < document.form1.pole1.value.length - 1; i++) {
//     document.form1.pole2.value = document.form1.pole2.value.trim();
//     var filter = new RegExp("[^" + document.getElementById('filtr').value + "]+", "gmu");
//     console.log(filter);
//     document.form1.pole2.value = document.form1.pole2.value.replace(filter, document.form1.pole3.value);
//     document.form1.pole2.value = document.form1.pole2.value.split(document.form1.pole3.value).filter(function (x, n, s) { return s.indexOf(x) == n }).join(document.form1.pole3.value);
//   }
// }

// while
function przepisz() {
  if (!document.form1.pole2.value) document.form1.pole2.value = document.form1.pole1.value
  else document.form1.pole2.value = '';
  var filter = new RegExp("[^" + document.getElementById('filtr').value + "]+", "gmu");
  //console.log(filter);
  var i = 1;
  while ((document.form1.pole1.value.length) > i) {
    i++;
    document.form1.pole2.value = document.form1.pole2.value.trim();
    document.form1.pole2.value = document.form1.pole2.value.replace(filter, document.form1.pole3.value);
    document.form1.pole2.value = document.form1.pole2.value.split(document.form1.pole3.value).filter(function (x, n, s) { return s.indexOf(x) == n }).join(document.form1.pole3.value);
  }
}

