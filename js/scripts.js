currentMenuID = "home";


function showMenuDiv(menuID) {
  currentMenuID = menuID;
  switch (menuID) {
    case "home": displayHome(); break;
    case "calendar": displayCalendar(); break;
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
    default: displayTBD(); break;
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


function displayTBD() {
  document.getElementById("menucontent").innerHTML = "This page is under construction";
}


function displayHome() {
  document.getElementById("menucontent").innerHTML =
    '<img id="homeimg" src="img/home.jpg" border="0" alt="Monarch Proud">';
}


localStorage.setItem("photoIdx", 0);

const maxPhoto = {
 "2016-2017": 40,
 "2017-2018": 4,
};


let timeoutId = null;

function displayPhotos() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  let year = getYear();
  let photoIdx = parseInt(localStorage.getItem("photoIdx"));
  photoIdx = photoIdx + 1;
  photoIdx = photoIdx % maxPhoto[year];
  localStorage.setItem("photoIdx", photoIdx);

  let photoPath = "img/" + year + "/" + photoIdx.toString() + ".jpg";
  let innerHtml = '<img class="photoGallary" src="' + photoPath + '", style="width:100%">';
  document.getElementById("menucontent").innerHTML = innerHtml;
  timeoutId = setTimeout(displayPhotos, 5500);
}


function displayCalendar() {
  document.getElementById("menucontent").innerHTML = 'Coming soon!';
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
  document.getElementById("menucontent").innerHTML = `
    <table>
      <tr>
         <th>Date</th>
         <th>Link</th>
      </tr>
      <tr>
        <td>Oct 28, 2017</td>
        <td><a href="http://www.9news.com/sports/college/carter-quickly-changes-the-plan-in-boulder/486460730", target="_blank">Carter changes plan at CU Boulder</a></td>
      <tr>
         <td>Feb 26, 2017</td>
         <td><a href="http://www.9news.com/sports/high-school/monarchs-super-seven-make-improbable-basketball-run/414843895", target="_blank">Super 7 make improbable run</a></td>
      </tr>
      <tr>
         <td>Jan 15, 2017</td>
         <td><a href="http://www.rockiesbasketball.com/news_article/show/752585?referrer_id=2145892", target="_blank">Carter develops into an elite point guard</a></td>
      </tr>
    <table>
  `;
}


function displayCoaches() {
  document.getElementById("menucontent").innerHTML = 'Coming Soon!';
}


function displayAdministration() {
  document.getElementById("menucontent").innerHTML = 'Coming Soon!';
}


function displayWebsite() {
  document.getElementById("menucontent").innerHTML = 'Coming Soon!';
}
