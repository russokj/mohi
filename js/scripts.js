var season = '2016-2017';


function showMenuDiv(menuID) {
  switch (menuID) {
    case "home": displayHome(); break;
    case "practices": displayPractices(); break;
    case "games": displayGames(); break;
    case "events": displayEvents(); break;
    case "varsityteam": displayVarsityTeam(); break;
    case "jvteam": displayJvTeam(); break;
    case "cteam": displayCTeam(); break;
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
  showMenuDiv(menuParam);
}

function jumpto(page) {
  var path = window.location.pathname;
  var url = path + '?page=' + page;
  document.location.href = url;
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


let photoIdx = -1;
let startTimer = true;

function displayPhotos() {
  photoIdx = photoIdx + 1;
  photoIdx = photoIdx % 40;
  let photoPath = "img/games-2016/" + photoIdx.toString() + ".jpg"; 
  let innerHtml = '<img class="campSlide" src="' + photoPath + '", style="width:100%">';
  document.getElementById("menucontent").innerHTML = innerHtml;
  if (startTimer) {
    setTimeout(displayPhotos, 3000);
  }
}


function displayPractices() {
  document.getElementById("menucontent").innerHTML = `
    <table> 
      <tr>
         <th>Event</th>
         <th>Date</th>
         <th>Time</th>
      </tr>
      <tr>
         <td>Open Gym</td>
         <td>Sat Nov 4th</td>
         <td>8:00-10:00 AM</td>
      </tr>
      <tr>
         <td>Open Gym</td>
         <td>Tue Nov 7th</td>
         <td>3:30-5:30 PM</td>
      </tr>
      <tr>
         <td>Open Gym</td>
         <td>Thu Nov 9th</td>
         <td>3:30-5:30 PM</td>
      </tr>
    <table>
  `;
}


function displayGames() {
  document.getElementById("menucontent").innerHTML = 'This page is under construction';
}


function displayEvents() {
  document.getElementById("menucontent").innerHTML = `
    Tryouts will be held at the Monarch High School gym on the following days:
    <table> 
      <tr>
         <td>Fri Nov 10th</td>
         <td>10:00 AM - 12:00 PM</td>
      </tr>
      <tr>
         <td>Sat Nov 11th</td>
         <td>8:00 AM - 10:00 AM</td>
      </tr>
    </table> 
    <br>
    If you plan to try out, you must complete the following two steps before tryouts begin:
    <ol>
      <li>Register with <a href="http://moh.bvsd.org/AandA/athletics/Pages/Registration-Fees.aspx" target="_blank">BVSD Athletics</a></li>
      <li>Bring a copy of your current physical to the Athletics office.</li>
    </ol>
  `;
}


function displayVarsityTeam() {
  document.getElementById("menucontent").innerHTML = 'This page is under construction';
}


function displayJvTeam() {
  document.getElementById("menucontent").innerHTML = 'This page is under construction';
}


function displayCTeam() {
  document.getElementById("menucontent").innerHTML = 'This page is under construction';
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
  document.getElementById("menucontent").innerHTML = 'This page is under construction';
}


function displayAdministration() {
  document.getElementById("menucontent").innerHTML = 'This page is under construction';
}


function displayWebsite() {
  document.getElementById("menucontent").innerHTML = 'This page is under construction';
}
