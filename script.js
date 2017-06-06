// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var MOHI_APIKEY = 'AIzaSyAF7M4rFbRQnh0L62aO3ANRT9bSqciBobw'

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

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
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    apiKey: MOHI_APIKEY,
    scope: SCOPES
  }).then(function () {
    // For now, just print a roster - later on we will select 
    listSchedule('A', '1mE65wuB4JSKGjC0fQK45InFoIiNtCynUNVo4BJ5r3NI');
  }, function(reason) {
    alert('Error: ' + reason.result.error.message);
  });
}

function generateTable(dataArray, tableClass, id) {
  // pass in two dimensional array for rows/columns
  // TODO: pass in title, table name

  //Create a HTML Table element.
  var table = document.createElement('TABLE');
  // TODO: Should tie name to class 
  table.setAttribute('class', tableClass);

  //Get the count of columns.
  var columnCount = dataArray[0].length;

  //Add the header row.
  var row = table.insertRow(-1);
  row.setAttribute('class', 'roster');
  for (var i = 0; i < columnCount; i++) {
      var headerCell = document.createElement("TH");
      headerCell.setAttribute('class', 'roster');
      headerCell.innerHTML = dataArray[0][i];
      row.appendChild(headerCell);
  }

  //Add the data rows.
  for (var i = 1; i < dataArray.length; i++) {
    row = table.insertRow(-1);
    row.setAttribute('class', 'roster');
    for (var j = 0; j < columnCount; j++) {
      var cell = row.insertCell(-1);
      cell.setAttribute('class', 'roster');
      cell.innerHTML = dataArray[i][j];
    }
  }

  var dvTable = document.getElementById(id);
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
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit/#gid=58192009
 */
// TODO: Might want to make this more generic
//       Add table name, and range, spreadsheetId, key)
function listRoster(team, spreadSheetId) {
  listTable(String(team) + '-ROSTER', spreadSheetId, 'roster', 'A1:D')
}

function listSchedule(team, spreadSheetId) {
  listTable(String(team) + '-SCHEDULE', spreadSheetId, 'schedule', 'A1:F')
}

function listTable(pagename, spreadSheetId, tableClass, range) {
  rosterRange = pagename + '!' + range;
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadSheetId,
    key: MOHI_APIKEY,
    range: rosterRange
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      var dataArray = new Array();
      for (row = 0; row < range.values.length; row++) {
        var entry = range.values[row];
        var dataRow = new Array();
        for (col = 0; col < entry.length; col++) {
          dataRow.push(entry[col])
        }
        dataArray.push(dataRow);
      }
      generateTable(dataArray, tableClass, 'tableId');
    } else {
      appendPre('No roster is available');
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
}
