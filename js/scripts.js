
let currentMenuID = "home";
let photoTimeoutID = null;
let preLoadedImage = new Image()


function pageReload() {
  // This unfortunately comes before Google API CB is called
  // (so we need to defer the action for displaying in showMenuDiv
  // if it requires access to a google spreadsheet/doc)
  var menuParam = getMenuParam('page');
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

function getMenuParam(sname) {
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

function yearChanged(year) {
  setYear(year);
  showMenuDiv(currentMenuID);
}


function setYear(year) {
  element = document.getElementById("selectYear");
  changed = element.value != year;
  element.value = year;
  localStorage.setItem("season", year);
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

function clearBanner() {
  document.getElementById('bannerwrapper').innerHTML = ""
}


function showPhotosCB(photoList) {
  let photoCnt = photoList.length
  if (photoCnt === 0) {
    displayUnknown();
    return
  }

  let photoIdx = Math.floor(Math.random() * photoCnt + 1)

  // TODO: if preloadedImage.src is not set  then set it; 
  let photoPath = "https://drive.google.com/uc?export=view&id=" + photoList[photoIdx]
  let innerHtml = '<img class="photoGallary" src="' + photoPath + '", style="width:100%">';
  document.getElementById("menucontent").innerHTML = innerHtml;
  photoTimeoutID = setTimeout(showPhotos, 5500);
}

function showPhotos() {
  if (photoTimeoutID) {
    clearTimeout(photoTimeoutID);
  }

  // TODO: If year changes, need to clear photo list so we re-retrieve it
  // What if there are no files? What i
  let year = getYear();
  retrievePhotosList(year, showPhotosCB)
}

function displayPhotos() {
  clearBanner()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' Photo Gallery</center><div id="photosId" class="photos">retrieving ...</div>';
  loadPhotos(showPhotos);
}


// TODO: Need to fix for IOS: see https://stackoverflow.com/questions/23083462/how-to-get-an-iframe-to-be-responsive-in-ios-safari (search for #wrap)
function displayCalendar() {
  clearBanner()
  document.getElementById("menucontent").innerHTML = '<iframe src="https://calendar.google.com/calendar/embed?src=mohigirlsbasketball%40gmail.com&ctz=America%2FDenver&showTitle=1&showPrint=0&showTabs=1&showCalendars=1&showTz=0&height=600" style="border: 0" frameborder="0" height="600" width="100%" scrolling="no"></iframe>';
}


function displayEvents() {
  clearBanner()
  document.getElementById("menucontent").innerHTML =
    '<center>Upcoming Events</center>' + '<div id="eventsId" class="events">retrieving ...</div>';
  loadEvents();
}


function displayVarsityRoster() {
  clearBanner()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' Varsity Team Roster</center><div id="rosterId" class="roster">retrieving ...</div>';
  loadRoster('VARSITY', getYear());
}


function displayJvRoster() {
  clearBanner()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' JV Team Roster</center><div id="rosterId" class="roster">retrieving ...</div>';
  loadRoster('JV', getYear());
}


function displayCRoster() {
  clearBanner()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' C Team Roster</center><div id="rosterId" class="roster">retrieving ...</div>';
  loadRoster('C', getYear());
}


function displayVarsitySchedule() {
  clearBanner()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' Varsity Team Schedule</center><div id="scheduleId" class="schedule">retrieving ...</div>';
  loadSchedule('VARSITY', getYear());
}


function displayJvSchedule() {
  clearBanner()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' JV Team Schedule</center><div id="scheduleId" class="schedule">retrieving ...</div>';
  loadSchedule('JV', getYear());
}


function displayCSchedule() {
  clearBanner()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' C Team Schedule</center><div id="scheduleId" class="schedule">retrieving ...</div>';
  loadSchedule('C', getYear());
}


function displayArticles() {
  clearBanner()
  document.getElementById("menucontent").innerHTML =
    '<center>Monarch Girls in the News</center>' + '<div id="articleId" class="article">retrieving ...</div>';
  loadArticles();
}


function displayCoaches() {
  clearBanner()
  document.getElementById("menucontent").innerHTML =
    '<center>Monarch Girls Basketball Program Coaches</center>' + '<div id="coachesId" class="coaches">retrieving ...</div>';
  loadCoaches();
}


function displayAdministration() {
  clearBanner()
  document.getElementById("menucontent").innerHTML =
    '<center>Monarch Girls Basketball Program Contacts</center>' + '<div id="adminId" class="admin">retrieving ...</div>';
  loadAdmin();
}


function displayWebsite() {
  clearBanner()
  document.getElementById("menucontent").innerHTML = '';
  loadWebsiteContact();
}


function displayUnknown() {
  document.getElementById("menucontent").innerHTML = 'Coming Soon!';
}
