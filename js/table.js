// Array of API discovery doc URLs for APIs used by the quickstart
let DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
let MOHI_APIKEY = 'AIzaSyAF7M4rFbRQnh0L62aO3ANRT9bSqciBobw'

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
let SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly"

let gapi_init = false
let delayedSpreadsheetAPICall = null


/**
 *  On load, called to load the auth2 library and API client library.
 */
// TODO: What if we call this before OnLoad?
function handleClientLoad() {
  gapi.load('client', initClient)
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  // NOTE: This is done on every page switch
  // FIXME: Could try and do this only on an initial load
  //        (Also seems to be called after the page attempts to load)
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    apiKey: MOHI_APIKEY,
    scope: SCOPES
  }).then(function () {
    gapi_init = true
    checkForCookieReset()
    retrieveYears()
    if (delayedSpreadsheetAPICall) {
      delayedSpreadsheetAPICall()
      delayedSpreadsheetAPICall = null
    }
  }, function(reason) {
    alert('Error: ' + reason.result.error.message)
  })
}

// TODO: call this Map to distinguish from yearSpreadSheetID!!! as well as localStorage
let yearSpreadSheetIDs = new Map()
const DEFAULT_SEASON = '2016-2017'
const DEFAULT_SPREADSHEET_ID = '1mE65wuB4JSKGjC0fQK45InFoIiNtCynUNVo4BJ5r3NI'


// TODO:
//       Replace html

// Spreadsheets that are independent of the year
// (note: these currently reference a single spreadsheet that has multiple tabs.  The variables here are just to
//        give extra flexibility in case the tabs are turned into their own spreadsheets.)
// TODO: constants should be capitalized or something; localstorage names should be constants
let mainSpreadSheetID = '1CCEfoIFaT4vt0jE6BusGqaK_EuTOzU1hqUNozylIh6g'
let websiteContactSpreadSheetID = mainSpreadSheetID
let articlesSpreadSheetID = mainSpreadSheetID
let adminSpreadSheetID = mainSpreadSheetID
let coachesSpreadSheetID = mainSpreadSheetID
let eventsSpreadSheetID = mainSpreadSheetID
let yearSpreadSheetID = mainSpreadSheetID
let cookieResetSpreadSheetID = mainSpreadSheetID


function checkForCookieReset() {
  let cells = 'A6'
  let pagename = 'Clear-Cookies'
  let pageRange = pagename + "!" + cells
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: cookieResetSpreadSheetID,
    key: MOHI_APIKEY,
    range: pageRange
  }).then(function(response) {
    let rows = response.result
    if (rows.values.length > 0) {
      let entry = rows.values[0]
      let cookieID = entry[0]
      if (localStorage.getItem('cookieID') !== cookieID) {
        localStorage.removeItem('photoIdx')
        localStorage.removeItem('season')
        localStorage.removeItem('yearSpreadSheetIDs')
        localStorage.setItem('cookieID', cookieID)
      }
    } else {
      yearSpreadSheetIDs.clear()
      yearSpreadSheetIDs.set(DEFAULT_SEASON, DEFAULT_SPREADSHEET_ID)
    }
  }, function(reason) {
    alert('error: ' + reason.result.error.message)
  })
}


function retrieveYears() {
  // Get list of seasons and the spreadsheet IDs associated with each
  if (localStorage.getItem('yearSpreadSheetIDs')) {
    yearSpreadSheetIDs = new Map(JSON.parse(localStorage.getItem('yearSpreadSheetIDs')));
  } else {
    let cells = 'A8:B'
    let pagename = 'Seasons'
    let pageRange = pagename + "!" + cells
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: yearSpreadSheetID,
      key: MOHI_APIKEY,
      range: pageRange
    }).then(function(response) {
      yearSpreadSheetIDs.clear()
      let rows = response.result
      if (rows.values.length > 0) {
        let dataArray = new Array()
        for (row = 0; row < rows.values.length; row++) {
          let entry = rows.values[row]
          let dataRow = new Array()
          let season = entry[0]
          let link = entry[1];
          let id = link.split("/")[5]
          yearSpreadSheetIDs.set(season, id)
        }
        localStorage.setItem('yearSpreadSheetIDs', JSON.stringify(Array.from(yearSpreadSheetIDs)))
      } else {
        yearSpreadSheetIDs.set(DEFAULT_SEASON, DEFAULT_SPREADSHEET_ID)
      }
    }, function(reason) {
      alert('error: ' + reason.result.error.message)
    })
  }
  setYearDropdown()
}

// 
// Load functions are for any menu item(s) that needs access to the google APIs 
//
function loadSchedule(team, year) {
  if (!gapi_init) {
    delayedSpreadsheetAPICall = listSchedule.bind(null, team, year)
  } else {
    listSchedule(team, year)
  }
}

function loadRoster(team, year) {
  if (!gapi_init) {
    delayedSpreadsheetAPICall = listRoster.bind(null, team, year)
  } else {
    listRoster(team, year)
  }
}

function loadAdmin() {
  if (!gapi_init) {
    delayedSpreadsheetAPICall = listAdmin.bind(null, adminSpreadSheetID)
  } else {
    listAdmin(adminSpreadSheetID)
  }
}

function loadCoaches() {
  if (!gapi_init) {
    delayedSpreadsheetAPICall = listCoaches.bind(null, coachesSpreadSheetID)
  } else {
    listCoaches(coachesSpreadSheetID)
  }
}

function loadArticles() {
  if (!gapi_init) {
    delayedSpreadsheetAPICall = listArticles.bind(null, articlesSpreadSheetID)
  } else {
    listArticles(articlesSpreadSheetID)
  }
}

function loadEvents() {
  if (!gapi_init) {
    delayedSpreadsheetAPICall = listEvents.bind(null, eventsSpreadSheetID)
  } else {
    listEvents(eventsSpreadSheetID)
  }
}

function loadWebsiteContact() {
  if (!gapi_init) {
    delayedSpreadsheetAPICall = listWebsiteContact.bind(null, websiteContactSpreadSheetID)
  } else {
    listWebsiteContact(websiteContactSpreadSheetID)
  }
}

function listRoster(team, year) {
  let page = team + '_ROSTER'
  let spreadSheetId = yearSpreadSheetIDs.get(year)
  listTable(page, spreadSheetId, 'roster', 'rosterId', 'A1:E')
}

function listSchedule(team, year) {
  let page = team + '_SCHEDULE'
  let spreadSheetId = yearSpreadSheetIDs.get(year)
  listTable(page, spreadSheetId, 'schedule', 'scheduleId', 'A1:G')
}

// TODO: Make links for email/website
function listAdmin(spreadSheetId) {
  let page = 'Contacts-Admin'
  listTable(page, spreadSheetId, 'admin', 'adminId', 'A3:D')
}

function listArticles(spreadSheetId) {
  let page = 'Articles'
  listLinkTable(page, spreadSheetId, 'article', 'articleId', 'A3:D', 2, 4)
}

function listEvents(spreadSheetId) {
  let page = 'Events'
  listTable(page, spreadSheetId, 'events', 'eventsId', 'A3:C')
}

// TODO: WE DONT WANT THIS IN TABLE FORM
function listCoaches(spreadSheetId) {
  let page = 'Contacts-Coaches'
  listTable(page, spreadSheetId, 'coaches', 'coachesId', 'A3:D')
}

function listWebsiteContact(spreadSheetId) {
  let cells = 'A3'
  let pageName = 'Contacts-Other'
  let pageRange = String(pageName) + "!" + cells
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadSheetId,
    key: MOHI_APIKEY,
    range: pageRange
  }).then(function(response) {
    let rows = response.result
    if (rows.values.length > 0) {
      let entry = rows.values[0]
      if (entry.length > 0) {
        let content = entry[0]
        document.getElementById("menucontent").innerHTML = content
        return
      }
    }
    appendPre('Could not retrieve data')
  }, function(response) {
    document.getElementById("menucontent").innerHTML = 'No information found'
  })
}

function generateTable(dataArray, tableClass, tableId) {
  // pass in two dimensional array for rows/columns
  // TODO: pass in title, table name

  // Create a HTML Table element.
  let table = document.createElement('TABLE')
  // TODO: Should tie name to class
  table.setAttribute('class', tableClass)

  //Get the count of columns.
  let columnCount = dataArray[0].length

  //Add the header row.
  let row = table.insertRow(-1)
  row.setAttribute('class', tableClass)
  for (let i = 0; i < columnCount; i++) {
      let headerCell = document.createElement("TH")
      headerCell.setAttribute('class', tableClass)
      headerCell.innerHTML = dataArray[0][i]
      row.appendChild(headerCell)
  }

  //Add the data rows.
  for (let i = 1; i < dataArray.length; i++) {
    row = table.insertRow(-1)
    row.setAttribute('class', tableClass)
    for (let j = 0; j < columnCount; j++) {
      let cell = row.insertCell(-1)
      cell.setAttribute('class', tableClass)
      let data = dataArray[i][j]
      if (data === undefined) {
         data = ''
      }
      cell.innerHTML = data
    }
  }

  let dvTable = document.getElementById(tableId)
  dvTable.innerHTML = ""
  dvTable.appendChild(table)
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  let pre = document.getElementById('content')
  let textContent = document.createTextNode(message + '\n')
  pre.appendChild(textContent)
}

function listLinkTable(pagename, spreadSheetId, tableClass, tableId, cells, linkToCol, linkFromCol) {
  let linkToColIdx = linkToCol - 1
  let linkFromColIdx = linkFromCol - 1
  let pageRange = String(pagename) + "!" + cells
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadSheetId,
    key: MOHI_APIKEY,
    range: pageRange
  }).then(function(response) {
    let rows = response.result
    if (rows.values.length > 0) {
      let dataArray = new Array()
      for (row = 0; row < rows.values.length; row++) {
        let entry = rows.values[row]
        let dataRow = new Array()
        for (col = 0; col < entry.length; col++) {
          if (col == linkToColIdx) {
            let link = entry[col]
            if (row > 0) {
              link = '<a href="' + entry[linkFromColIdx] + '" target="_parent">' + entry[col] + '</a>'
            }
            dataRow.push(link)
          } else if (col != linkFromColIdx) {
            dataRow.push(entry[col])
          }
        }
        dataArray.push(dataRow)
      }
      generateTable(dataArray, tableClass, tableId)
    } else {
      appendPre('Could not retrieve data')
    }
  }, function(response) {
    document.getElementById("menucontent").innerHTML = 'No information found'
  })
}

function listTable(pagename, spreadSheetId, tableClass, tableId, cells) {
  let pageRange = String(pagename) + "!" + cells
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadSheetId,
    key: MOHI_APIKEY,
    range: pageRange
  }).then(function(response) {
    let rows = response.result
    if (rows.values.length > 0) {
      let dataArray = new Array()
      for (row = 0; row < rows.values.length; row++) {
        let entry = rows.values[row]
        let dataRow = new Array()
        for (col = 0; col < entry.length; col++) {
          dataRow.push(entry[col])
        }
        dataArray.push(dataRow)
      }
      generateTable(dataArray, tableClass, tableId)
    } else {
      appendPre('Could not retrieve data')
    }
  }, function(response) {
    document.getElementById("menucontent").innerHTML = 'No information found'
  })
}

