currentMenuID = "home";


function showMenuDiv(menuID) {
  currentMenuID = menuID;
  switch (menuID) {
    case "home": displayHome(); break;
    case "calendar": displayCalendar(); break;
    case "events": displayEvents(); break;
    case "varsityroster": displayVarsityRoster(); break;
    case "jvroster": displayJvRoster(); break;
    case "croster": displayCRoster(); break;
    case "varsityschedule": displayVarsitySchedule(); break;
    case "jvschedule": displayJvSchedule(); break;
    case "cschedule": displayCSchedule(); break;
    case "articles": displayArticles(); break;
    case "photos": displayPhotos(); break;
    case "coaches": displayCoaches(); break;
    case "administration": displayAdministration(); break;
    case "website": displayWebsite(); break;
    default: displayUnknown(); break;
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

  let year = getYear();
  setYear(year);

  showMenuDiv(menuParam);
}

function jumpto(page) {
  var path = window.location.pathname;
  var url = path + '?page=' + page;
  document.location.href = url;
}


// Called when user selects a new year
function yearChanged(year) {
  setYear(year);
  showMenuDiv(currentMenuID);
}


function setYear(year) {
  element = document.getElementById("selectYear");
  changed = element.value != year;
  element.value = year;
  localStorage.setItem("season", year);
  localStorage.setItem("photoIdx", -1);
  return changed;
}


function getYear() {
  let year = localStorage.getItem("season");
  if (!year || year === '') {
    year = document.getElementById("selectYear").value;
    localStorage.setItem("season", year);
  }
  return year;
}


function nop() {
  return true;
}


function displayHome() {
  let year = getYear();
  let photoPath = "img/" + year + "/" + "home.jpg";
  document.getElementById("menucontent").innerHTML =
    '<img id="homeimg" src="' + photoPath + '" border="0" alt="Monarch Proud">';
}


// TODO: Must retrieve these from spreadsheet (as well as images, and not depend on naming convention!)
const maxPhoto = {
 "2016-2017": 41,
 "2017-2018": 31,
 "2018-2019": 52,
 "2019-2020": 9,
};


let timeoutId = null;

function displayPhotos() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  let year = getYear();
  let photoCnt = maxPhoto[year]
  if (photoCnt === 0) {
    displayUnknown();
    return
  }

  let idxStr = localStorage.getItem("photoIdx");
  let photoIdx = (idxStr) ? parseInt(idxStr) : 0
  photoIdx = photoIdx + 1;
  photoIdx = photoIdx % photoCnt;
  localStorage.setItem("photoIdx", photoIdx);

  let photoPath = "img/" + year + "/" + photoIdx.toString() + ".jpg";
  let innerHtml = '<img class="photoGallary" src="' + photoPath + '", style="width:100%">';
  document.getElementById("menucontent").innerHTML = innerHtml;
  timeoutId = setTimeout(displayPhotos, 5500);
}


// TODO: Need to fix for IOS: see https://stackoverflow.com/questions/23083462/how-to-get-an-iframe-to-be-responsive-in-ios-safari (search for #wrap)
function displayCalendar() {
  document.getElementById("menucontent").innerHTML = '<iframe src="https://calendar.google.com/calendar/embed?src=mohigirlsbasketball%40gmail.com&ctz=America%2FDenver&showTitle=1&showPrint=0&showTabs=1&showCalendars=1&showTz=0&height=600" style="border: 0" frameborder="0" height="600" width="100%" scrolling="no"></iframe>';
}


function displayEvents() {
  document.getElementById("menucontent").innerHTML =
    '<center>Upcoming Events</center>' + '<div id="eventsId" class="events">retrieving ...</div>';
  loadEvents();
}


function displayVarsityRoster() {
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' Varsity Team Roster</center><div id="rosterId" class="roster">retrieving ...</div>';
  loadRoster('VARSITY', getYear());
}


function displayJvRoster() {
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' JV Team Roster</center><div id="rosterId" class="roster">retrieving ...</div>';
  loadRoster('JV', getYear());
}


function displayCRoster() {
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' C Team Roster</center><div id="rosterId" class="roster">retrieving ...</div>';
  loadRoster('C', getYear());
}


function displayVarsitySchedule() {
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' Varsity Team Schedule</center><div id="scheduleId" class="schedule">retrieving ...</div>';
  loadSchedule('VARSITY', getYear());
}


function displayJvSchedule() {
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' JV Team Schedule</center><div id="scheduleId" class="schedule">retrieving ...</div>';
  loadSchedule('JV', getYear());
}


function displayCSchedule() {
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' C Team Schedule</center><div id="scheduleId" class="schedule">retrieving ...</div>';
  loadSchedule('C', getYear());
}


function displayArticles() {
  document.getElementById("menucontent").innerHTML =
    '<center>Monarch Girls in the News</center>' + '<div id="articleId" class="article">retrieving ...</div>';
  loadArticles();
}


function displayCoaches() {
  document.getElementById("menucontent").innerHTML =
    '<center>Monarch Girls Basketball Program Coaches</center>' + '<div id="coachesId" class="coaches">retrieving ...</div>';
  loadCoaches();
}


function displayAdministration() {
  document.getElementById("menucontent").innerHTML =
    '<center>Monarch Girls Basketball Program Contacts</center>' + '<div id="adminId" class="admin">retrieving ...</div>';
  loadAdmin();
}


function displayWebsite() {
  document.getElementById("menucontent").innerHTML = '';
  loadWebsiteContact();
}


function displayUnknown() {
  document.getElementById("menucontent").innerHTML = 'Coming Soon!';
}
