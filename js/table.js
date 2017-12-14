// Array of API discovery doc URLs for APIs used by the quickstart
let DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
let MOHI_APIKEY = 'AIzaSyAF7M4rFbRQnh0L62aO3ANRT9bSqciBobw'

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
let SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

let gapi_init = false;
let delayedTableCall = null;


/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  // TODO: only do first time
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    apiKey: MOHI_APIKEY,
    scope: SCOPES
  }).then(function () {
    gapi_init = true;
    if (delayedTableCall) {
      delayedTableCall();
      delayedTableCall = null;
    }
  }, function(reason) {
    alert('Error: ' + reason.result.error.message);
  });
}

// Need to pull these from master selector spreadsheet and base it off of year
let rosterSpreadSheetID = '1mE65wuB4JSKGjC0fQK45InFoIiNtCynUNVo4BJ5r3NI';
let scheduleSpreadSheetID = '1mE65wuB4JSKGjC0fQK45InFoIiNtCynUNVo4BJ5r3NI';

function loadSchedule(team, year) {
  if (!gapi_init) {
    delayedTableCall = listSchedule.bind(null, team, year, scheduleSpreadSheetID);
  } else {
    listSchedule(team, year, scheduleSpreadSheetID);
  }
}

function loadRoster(team, year) {
  if (!gapi_init) {
    delayedTableCall = listRoster.bind(null, team, year, rosterSpreadSheetID);
  } else {
    listRoster(team, year, rosterSpreadSheetID);
  }
}

function listRoster(team, year, spreadSheetId) {
  let page = year + '_' + team + '_ROSTER';
  listTable(page, spreadSheetId, 'roster', 'rosterId', 'A1:E')
}

function listSchedule(team, year, spreadSheetId) {
  let page = year + '_' + team + '_SCHEDULE';
  listTable(page, spreadSheetId, 'schedule', 'scheduleId', 'A1:F')
}

function generateTable(dataArray, tableClass, tableId) {
  // pass in two dimensional array for rows/columns
  // TODO: pass in title, table name

  // Create a HTML Table element.
  let table = document.createElement('TABLE');
  // TODO: Should tie name to class 
  table.setAttribute('class', tableClass);

  //Get the count of columns.
  let columnCount = dataArray[0].length;

  //Add the header row.
  let row = table.insertRow(-1);
  row.setAttribute('class', tableClass);
  for (let i = 0; i < columnCount; i++) {
      let headerCell = document.createElement("TH");
      headerCell.setAttribute('class', tableClass);
      headerCell.innerHTML = dataArray[0][i];
      row.appendChild(headerCell);
  }

  //Add the data rows.
  for (let i = 1; i < dataArray.length; i++) {
    row = table.insertRow(-1);
    row.setAttribute('class', tableClass);
    for (let j = 0; j < columnCount; j++) {
      let cell = row.insertCell(-1);
      cell.setAttribute('class', tableClass);
      let data = dataArray[i][j];
      if (data === undefined) {
         data = '';
      }
      cell.innerHTML = data;
    }
  }

  let dvTable = document.getElementById(tableId);
  dvTable.innerHTML = "";
  dvTable.appendChild(table);
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  let pre = document.getElementById('content');
  let textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

function listTable(pagename, spreadSheetId, tableClass, tableId, range) {
  let pageRange = String(pagename) + "!" + range;
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadSheetId,
    key: MOHI_APIKEY,
    range: pageRange
  }).then(function(response) {
    let range = response.result;
    if (range.values.length > 0) {
      let dataArray = new Array();
      for (row = 0; row < range.values.length; row++) {
        let entry = range.values[row];
        let dataRow = new Array();
        for (col = 0; col < entry.length; col++) {
          dataRow.push(entry[col]);
        }
        dataArray.push(dataRow);
      }
      generateTable(dataArray, tableClass, tableId);
    } else {
      appendPre('Could not retrieve data');
    }
  }, function(response) {
    document.getElementById("menucontent").innerHTML = 'No information found';
  });
}
