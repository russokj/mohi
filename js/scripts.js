let currentMenuID = "home";
let photoTimeoutID = null;
let imageIdx = -1;
let preLoadedImages = new Array();


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
    case "droster": displayDRoster(); break;
    case "varsityschedule": displayVarsitySchedule(); break;
    case "jvschedule": displayJvSchedule(); break;
    case "cschedule": displayCSchedule(); break;
    case "dschedule": displayDSchedule(); break;
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
    let temp = params[i].split("=");
    if ( [temp[0]] == sname ) { sval = temp[1]; }
  }
  return sval;
}


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


function yearChanged(year) {
  setYear(year);

  // Force retrieval and redisplay page
  imageIdx = -1
  gapi_init = false
  clearPhotoTimer()
  showMenuDiv(currentMenuID);
  initClientStage1()
}


function setYear(year) {
  let element = document.getElementById("selectYear");
  let changed = element.value != year;
  element.value = year;
  setCurrentSeason(year)
  return changed;
}

function getYear() {
  let year = getCurrentSeason()
  if (!year || year === '') {
    year = document.getElementById("selectYear").value;
    setCurrentSeason(year)
  }
  return year;
}


function clearBannerDiv() {
  document.getElementById('bannerwrapper').innerHTML = ""
}

function setBannerDiv() {
  let banner = getBanner()
  if (banner.get('text') && banner.get('page')) {
    document.getElementById('bannerwrapper').innerHTML = "<div id=\"bannerdiv\"><a id=\"bannerlink\" href=\"javascript:jumpto('" + banner.get('page') + "');\">" + banner.get('text') + "</a></div>"
  }
}


function setYearDropdown() {
  let select = document.getElementById("selectYear");
  let seasons = [...yearSpreadSheetIDs.keys()]
  select.options.length = 0
  for (var i = 0; i < seasons.length; i++) {
    var opt = seasons[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
  }
  let year = getCurrentSeason()
  if (!seasons.includes(year)) {
    year = seasons[seasons.length - 1]
    setCurrentSeason(year)
  }
  document.getElementById("selectYear").value = year;
}


function nop() {
  return true;
}


function showHome() {
  setBannerDiv()
  let year = getYear()
  let photoID = getHomePagePhoto(year)
  let innerHtml
  if (photoID) {
    let photoPath = "https://drive.google.com/uc?export=view&id=" + photoID
    innerHtml = '<img class="photoGallary" src="' + photoPath + '", style="width:100%">'
  } else {
    innerHtml = '<div id="homeId" class="home">Cannot find the home page image for ' + getYear() + '</div>'
  }
  document.getElementById("menucontent").innerHTML = innerHtml
}

function displayHome() {
  let year = getYear();
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' Home Page</center><div id="homeId" class="home">retrieving ...</div>'
  loadHome(showHome)
}


function clearPhotoTimer() {
    clearTimeout(photoTimeoutID)
    photoTimeoutID = null
}

// TODO: Add fade in and out (is this CSS code?)
function showPhotos() {
  if (photoTimeoutID) {
    clearPhotoTimer()
  }

  let year = getYear()
  let photoList = getPhotoList(year)
  let photoCnt = photoList.length
  if (photoCnt === 0) {
    displayUnknown()
    return
  }

  // first time, pre-load image
  let photoIdx
  let photoPath
  if (imageIdx == -1) {
    imageIdx = 0
    photoIdx = Math.floor(Math.random() * photoCnt)
    photoPath = "https://drive.google.com/uc?export=view&id=" + photoList[photoIdx]
    preLoadedImages[imageIdx] = new Image()
    preLoadedImages[imageIdx].src = photoPath
  }

  // show image pointed to by imageIdx
  let innerHtml = '<img class="photoGallary" src="' + preLoadedImages[imageIdx].src + '", style="width:100%">'
  document.getElementById("menucontent").innerHTML = innerHtml
  photoTimeoutID = setTimeout(showPhotos, 5500)

  // get next image (toggle between array indice 0 & 1
  imageIdx = imageIdx % 2
  photoIdx = Math.floor(Math.random() * photoCnt)
  photoPath = "https://drive.google.com/uc?export=view&id=" + photoList[photoIdx]
  preLoadedImages[imageIdx] = new Image()
  preLoadedImages[imageIdx].src = photoPath
}

function displayPhotos() {
  clearBannerDiv()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' Photo Gallery</center><div id="photosId" class="photos">retrieving ...</div>'
  loadPhotos(showPhotos)
}


// TODO: Need to fix for IOS: see https://stackoverflow.com/questions/23083462/how-to-get-an-iframe-to-be-responsive-in-ios-safari (search for #wrap)
function displayCalendar() {
  clearBannerDiv()
  document.getElementById("menucontent").innerHTML = '<iframe src="https://calendar.google.com/calendar/embed?src=mohigirlsbasketball%40gmail.com&ctz=America%2FDenver&showTitle=1&showPrint=0&showTabs=1&showCalendars=1&showTz=0&height=600" style="border: 0" frameborder="0" height="600" width="100%" scrolling="no"></iframe>';
}


function displayEvents() {
  clearBannerDiv()
  document.getElementById("menucontent").innerHTML =
    '<center>Upcoming Events</center>' + '<div id="eventsId" class="events">retrieving ...</div>';
  loadEvents();
}


function displayVarsityRoster() {
  clearBannerDiv()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' Varsity Team Roster</center><div id="rosterId" class="roster">retrieving ...</div>';
  loadRoster('VARSITY', getYear());
}


function displayJvRoster() {
  clearBannerDiv()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' JV Team Roster</center><div id="rosterId" class="roster">retrieving ...</div>';
  loadRoster('JV', getYear());
}


function displayCRoster() {
  clearBannerDiv()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' C Team Roster</center><div id="rosterId" class="roster">retrieving ...</div>';
  loadRoster('C', getYear());
}


function displayDRoster() {
  clearBannerDiv()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' D Team Roster</center><div id="rosterId" class="roster">retrieving ...</div>';
  loadRoster('D', getYear());
}


function displayVarsitySchedule() {
  clearBannerDiv()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' Varsity Team Schedule</center><div id="scheduleId" class="schedule">retrieving ...</div>';
  loadSchedule('VARSITY', getYear());
}


function displayJvSchedule() {
  clearBannerDiv()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' JV Team Schedule</center><div id="scheduleId" class="schedule">retrieving ...</div>';
  loadSchedule('JV', getYear());
}


function displayCSchedule() {
  clearBannerDiv()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' C Team Schedule</center><div id="scheduleId" class="schedule">retrieving ...</div>';
  loadSchedule('C', getYear());
}


function displayDSchedule() {
  clearBannerDiv()
  document.getElementById("menucontent").innerHTML =
    '<center>' + getYear() + ' D Team Schedule</center><div id="scheduleId" class="schedule">retrieving ...</div>';
  loadSchedule('D', getYear());
}


function displayArticles() {
  clearBannerDiv()
  document.getElementById("menucontent").innerHTML =
    '<center>Monarch Girls in the News</center>' + '<div id="articleId" class="article">retrieving ...</div>';
  loadArticles();
}


function displayCoaches() {
  clearBannerDiv()
  document.getElementById("menucontent").innerHTML =
    '<center>Monarch Girls Basketball Program Coaches</center>' + '<div id="coachesId" class="coaches">retrieving ...</div>';
  loadCoaches();
}


function displayAdministration() {
  clearBannerDiv()
  document.getElementById("menucontent").innerHTML =
    '<center>Monarch Girls Basketball Program Contacts</center>' + '<div id="adminId" class="admin">retrieving ...</div>';
  loadAdmin();
}


function displayWebsite() {
  clearBannerDiv()
  document.getElementById("menucontent").innerHTML = '';
  loadWebsiteContact();
}


function displayUnknown() {
  document.getElementById("menucontent").innerHTML = 'Not Available';
}
