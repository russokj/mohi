function showMenuDiv(menuID) {
  var x = document.getElementsByClassName('menuDiv');
  for (i = 0; i < x.length; i++) {
    if (x[i].id === menuID) {
      x[i].style.display = 'block';
    } else {
      x[i].style.display = 'none';
    }
  }
}

function getParam(sname) {
  var params = location.search.substr(location.search.indexOf("?")+1);
  var sval = "";
  params = params.split("&");

  // split param and value into individual pieces
  for (var i=0; i<params.length; i++) {
    temp = params[i].split("=");
    if ( [temp[0]] == sname ) { sval = temp[1]; }
  }
  return sval;
}

function onload() {
  var menuParam = getParam('page');
  if (!menuParam) {
    menuParam = 'home';
  }
  showMenuDiv(menuParam);
}
