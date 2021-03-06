// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4",
                        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]

// Cached content from google drive that are permanently stored on the local device
const LOCALSTORE_REVISION_ID = 'revisionID'
const LOCALSTORE_YEAR_SPREADSHEET_IDS = 'yearSpreadSheetIDs'
const LOCALSTORE_PHOTO_YEAR_FOLDER_IDS = 'photoYearFolderIDs'
const LOCALSTORE_SEASON = 'season'

// Cached content from google drive that are stored as long as the browser is running
const SESSIONSTORE_HOME_PHOTO_ID_PREFIX = 'homePhotoID_'
const SESSIONSTORE_PHOTO_IDS_PREFIX = 'photoIDs_'
const SESSIONSTORE_BANNER = 'banner'

const MOHI_APIKEY = 'AIzaSyAF7M4rFbRQnh0L62aO3ANRT9bSqciBobw'
const MOHI_DRIVE_APIKEY= 'AIzaSyACWPr-jLvJeYPVEawCCfWsP_uzHE2xuNQ'
const PHOTO_FOLDER_ID = "'1zoSGrQTMX10X99eB71ORTaPMWeih_CL3'"

// Main spreadsheet contains data that isn't year specific
const MAIN_SPREADSHEET_ID = '1CCEfoIFaT4vt0jE6BusGqaK_EuTOzU1hqUNozylIh6g'

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly',
                'https://www.googleapis.com/auth/drive.readonly']

const DEFAULT_SEASON = '2016-2017'
const DEFAULT_SPREADSHEET_ID = '1mE65wuB4JSKGjC0fQK45InFoIiNtCynUNVo4BJ5r3NI'

// flag to delay loading of page if it needs to retrieve data from google
let gapi_init = false
let delayedPageLoadCB = null

let yearSpreadSheetIDs = new Map()
let photoYearFolderIDs = new Map()


/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client', initClient)
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  // note: this is called on every page change (reload)
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    apiKey: MOHI_APIKEY,
    scope: SCOPES
  }).then(function () {
    initClientStage1()
  }, function(reason) {
    alert('Error: ' + reason.result.error.message)
  })
}

// Some of these can be run in parallel
function initClientStage1() {
    retrieveRevisionID()
}

function initClientStage2() {
    retrieveYears()
}

function initClientStage3() {
    setYearDropdown()
    retrievePhotoFolderIds()
}

function initClientStage4() {
    retrievePhotosIds()
}

function initClientStage5() {
    retrieveBanner()
}

function initClientStage6() {
    gapi_init = true
    initClientDone()
}

function initClientDone() {
  if (delayedPageLoadCB) {
    delayedPageLoadCB()
    delayedPageLoadCB = null
  }
}


function loadHome(homeHandler) {
  if (!gapi_init) {
    delayedPageLoadCB = homeHandler.bind(null)
  } else {
    homeHandler()
  }
}

function loadSchedule(team, year) {
  if (!gapi_init) {
    delayedPageLoadCB = listSchedule.bind(null, team, year)
  } else {
    listSchedule(team, year)
  }
}

function loadRoster(team, year) {
  if (!gapi_init) {
    delayedPageLoadCB = listRoster.bind(null, team, year)
  } else {
    listRoster(team, year)
  }
}

function loadAdmin() {
  if (!gapi_init) {
    delayedPageLoadCB = listAdmin.bind(null)
  } else {
    listAdmin()
  }
}

function loadCoaches() {
  if (!gapi_init) {
    delayedPageLoadCB = listCoaches.bind(null)
  } else {
    listCoaches()
  }
}

function loadArticles() {
  if (!gapi_init) {
    delayedPageLoadCB = listArticles.bind(null)
  } else {
    listArticles()
  }
}

function loadPhotos(photoHandler) {
  if (!gapi_init) {
    delayedPageLoadCB = photoHandler.bind(null)
  } else {
    photoHandler()
  }
}

function loadEvents() {
  if (!gapi_init) {
    delayedPageLoadCB = listEvents.bind(null)
  } else {
    listEvents()
  }
}

function loadWebsiteContact() {
  if (!gapi_init) {
    delayedPageLoadCB = listWebsiteContact.bind(null)
  } else {
    listWebsiteContact()
  }
}

function listRoster(team, year) {
  let page = team + '_ROSTER'
  listTable(page, yearSpreadSheetIDs.get(year), 'roster', 'rosterId', 'A1:E')
}

function listSchedule(team, year) {
  let page = team + '_SCHEDULE'
  listTable(page, yearSpreadSheetIDs.get(year), 'schedule', 'scheduleId', 'A1:G')
}

// TODO: Make links for email/website so they are clickable
function listAdmin() {
  let page = 'Contacts-Admin'
  listTable(page, MAIN_SPREADSHEET_ID, 'admin', 'adminId', 'A3:D')
}

function listArticles() {
  let page = 'Articles'
  listLinkTable(page, MAIN_SPREADSHEET_ID, 'article', 'articleId', 'A3:D', 2, 4)
}

// TODO: Events & Articles seem to not have a bold title with black background (coaches too)
function listEvents() {
  let page = 'Events'
  listTable(page, MAIN_SPREADSHEET_ID, 'events', 'eventsId', 'A4:C')
}

// TODO: We probably don't want this in table form
function listCoaches() {
  let page = 'Contacts-Coaches'
  listTable(page, MAIN_SPREADSHEET_ID, 'coaches', 'coachesId', 'A3:D')
}

function listWebsiteContact() {
  let range = 'A3'
  let pageName = 'Contacts-Other'
  let pageRange = String(pageName) + "!" + range
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: MAIN_SPREADSHEET_ID,
    key: MOHI_APIKEY,
    range: pageRange
  }).then(function(response) {
    let range = response.result
    if (range.values.length > 0) {
      let entry = range.values[0]
      if (entry.length > 0) {
        let content = entry[0]
        document.getElementById("menucontent").innerHTML = content
      }
    }
    appendPre('Could not retrieve data')
  }, function(response) {
    console.log("Failed to retrieve website contact information: " + response.result.error)
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

function listLinkTable(pagename, spreadSheetId, tableClass, tableId, range, linkToCol, linkFromCol) {
  let linkToColIdx = linkToCol - 1
  let linkFromColIdx = linkFromCol - 1
  let pageRange = String(pagename) + "!" + range
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadSheetId,
    key: MOHI_APIKEY,
    range: pageRange
  }).then(function(response) {
    let range = response.result
    if (range.values.length > 0) {
      let dataArray = new Array()
      for (let row = 0; row < range.values.length; row++) {
        let entry = range.values[row]
        let dataRow = new Array()
        for (let col = 0; col < entry.length; col++) {
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
    console.log("Failed to retrieve list-link table information: " + response.result.error)
    document.getElementById("menucontent").innerHTML = 'No information found'
  })
}

function listTable(pagename, spreadSheetId, tableClass, tableId, range) {
  let pageRange = String(pagename) + "!" + range
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadSheetId,
    key: MOHI_APIKEY,
    range: pageRange
  }).then(function(response) {
    let range = response.result
    if (range.values.length > 0) {
      let dataArray = new Array()
      for (let row = 0; row < range.values.length; row++) {
        let entry = range.values[row]
        let dataRow = new Array()
        for (let col = 0; col < entry.length; col++) {
          dataRow.push(entry[col])
        }
        dataArray.push(dataRow)
      }
      generateTable(dataArray, tableClass, tableId)
    } else {
      appendPre('Could not retrieve data')
    }
  }, function(response) {
    console.log("Failed to retrieve table information: " + response.result.error)
    document.getElementById("menucontent").innerHTML = 'No information found'
  })
}


function retrieveRevisionID() {
  let cells = 'A6'
  let pagename = 'Clear-Cache'
  let pageRange = pagename + "!" + cells
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: MAIN_SPREADSHEET_ID,
    key: MOHI_APIKEY,
    range: pageRange
  }).then(function(response) {
    let rows = response.result
    if (rows.values  &&  rows.values.length > 0) {
      let entry = rows.values[0]
      let revisionID = entry[0]
      if (localStorage.getItem(LOCALSTORE_REVISION_ID) !== revisionID) {
        localStorage.removeItem(LOCALSTORE_YEAR_SPREADSHEET_IDS)
        localStorage.removeItem(LOCALSTORE_PHOTO_YEAR_FOLDER_IDS)
        localStorage.setItem(LOCALSTORE_REVISION_ID, revisionID)
      }
    } else {
      yearSpreadSheetIDs.clear()
      yearSpreadSheetIDs.set(DEFAULT_SEASON, DEFAULT_SPREADSHEET_ID)
    }
    initClientStage2()
  }, function(reason) {
    alert('error: ' + reason.result.error.message)
    initClientStage2()
  })
}


// TODO: Can this be cached??
function retrieveBanner() {
  let cells = 'A6:B6'
  let pagename = 'Banner'
  let pageRange = pagename + "!" + cells
  let banner = new Map()
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: MAIN_SPREADSHEET_ID,
    key: MOHI_APIKEY,
    range: pageRange
  }).then(function(response) {
    let rows = response.result
    if (rows.values  &&  rows.values.length > 0) {
      let entry = rows.values[0]
      banner.set('text', entry[0])
      banner.set('page', entry[1])
    }
    sessionStorage.setItem(SESSIONSTORE_BANNER, JSON.stringify(Array.from(banner)))
    initClientStage6()
  }, function(reason) {
    alert('error: ' + reason.result.error.message)
    sessionStorage.setItem(SESSIONSTORE_BANNER, JSON.stringify(Array.from(banner)))
    initClientStage6()
  })
}


function retrieveYears() {
  // Get list of seasons and the spreadsheet IDs associated with each
  if (localStorage.getItem(LOCALSTORE_YEAR_SPREADSHEET_IDS)) {
    yearSpreadSheetIDs = new Map(JSON.parse(localStorage.getItem(LOCALSTORE_YEAR_SPREADSHEET_IDS)))
    initClientStage3()
  } else {
    let cells = 'A8:B'
    let pagename = 'Seasons'
    let pageRange = pagename + "!" + cells
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: MAIN_SPREADSHEET_ID,
      key: MOHI_APIKEY,
      range: pageRange
    }).then(function(response) {
      yearSpreadSheetIDs.clear()
      let rows = response.result
      if (rows.values  &&  rows.values.length > 0) {
        let dataArray = new Array()
        for (row = 0; row < rows.values.length; row++) {
          let entry = rows.values[row]
          let dataRow = new Array()
          let season = entry[0]
          let link = entry[1];
          let id = link.split("/")[5]
          yearSpreadSheetIDs.set(season, id)
        }
        localStorage.setItem(LOCALSTORE_YEAR_SPREADSHEET_IDS, JSON.stringify(Array.from(yearSpreadSheetIDs)))
      } else {
        yearSpreadSheetIDs.set(DEFAULT_SEASON, DEFAULT_SPREADSHEET_ID)
      }
      initClientStage3()
    }, function(reason) {
      alert('error: ' + reason.result.error.message)
      initClientStage3()
    })
  }
}


function retrievePhotoFolderIds() {
  photoYearFolderIDs.clear()
  let photoYearFolderIDsJSON = localStorage.getItem(LOCALSTORE_PHOTO_YEAR_FOLDER_IDS)
  if (photoYearFolderIDsJSON) {
    let photoYearFolderIDsArr = JSON.parse(photoYearFolderIDsJSON)
    if (photoYearFolderIDsArr.length > 0) {
      photoYearFolderIDs = new Map(photoYearFolderIDsArr)
      initClientStage4()
      return
    }
  }

  // the google drive ID for the 'photos' folder
  let photoFolderSpreadsheetID = PHOTO_FOLDER_ID
  gapi.client.drive.files.list({
    key: MOHI_DRIVE_APIKEY,
    pageSize: 1000,
    q: photoFolderSpreadsheetID + " in parents and mimeType = 'application/vnd.google-apps.folder'",
    fields: "files(id, name)"
  }).then(function(response) {
    var seasons = response.result.files
    if (seasons && seasons.length > 0) {
      for (var i = 0; i < seasons.length; i++) {
        var season = seasons[i]
        photoYearFolderIDs.set(season.name, season.id)
      }
    } else {
      console.log('No seasons found for photos.')
    }
    photoYearFolderIDsJSON = JSON.stringify(Array.from(photoYearFolderIDs))
    localStorage.setItem(LOCALSTORE_PHOTO_YEAR_FOLDER_IDS, photoYearFolderIDsJSON)
    initClientStage4()
  }, function(response) {
    console.log(response)
    initClientStage4()
  })
}


// Retrieves the list of photos for the current season as well as the home page image
// 1. If we previously retrieved these values, use the values from the local storage
// 2. Otherwise retrieve the list (array) of photos and also determine the homepage image.
function retrievePhotosIds() {
   season = getYear()

  // See if we already retrieved the home photo ID and list of photos for the season
  let photoIDs = []
  let homePhotoID = sessionStorage.getItem(SESSIONSTORE_HOME_PHOTO_ID_PREFIX + season)
  let photoIDsJSON = sessionStorage.getItem(SESSIONSTORE_PHOTO_IDS_PREFIX + season)
  if (photoIDsJSON) {
    photoIDs = JSON.parse(photoIDsJSON)
  }
  if (photoIDs && photoIDs.length > 0  && homePhotoID) {
    initClientStage5()
    return
  }

  // Retrieve photos from google
  let photoFolderID = photoYearFolderIDs.get(season)
  if (!photoFolderID) {
    console.log('Cannot find season folder for ' + season)
    initClientStage5()
    return
  }

  let query = "'" + photoFolderID + "' in parents and mimeType = 'image/jpeg'"
  gapi.client.drive.files.list({
    key: MOHI_DRIVE_APIKEY,
    pageSize: 1000,
    q: query,
    fields: "files(name, id)"
  }).then(function(response) {
    let results = response.result.files
    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        photoIDs.push(results[i].id)
        if (results[i].name.toLowerCase() === 'home.jpg') {
          homePhotoID = results[i].id
        }
      }
    } else {
      console.log('No photos found for season ' + season)
    }
    if (homePhotoID) {
      sessionStorage.setItem(SESSIONSTORE_HOME_PHOTO_ID_PREFIX + season, homePhotoID)
    } else {
      sessionStorage.removeItem(SESSIONSTORE_HOME_PHOTO_ID_PREFIX + season)
    }
    photoIDsJSON = JSON.stringify(photoIDs)
    sessionStorage.setItem(SESSIONSTORE_PHOTO_IDS_PREFIX + season, photoIDsJSON)
    initClientStage5()
  }, function(response) {
    console.log(response)
    initClientStage5()
  })
}


function getPhotoList(season) {
  let photoIDs = []
  let photoIDsJSON = sessionStorage.getItem(SESSIONSTORE_PHOTO_IDS_PREFIX + season)
  if (photoIDsJSON) {
    photoIDs = JSON.parse(photoIDsJSON)
  }
  return photoIDs
}

function getHomePagePhoto(season) {
  let homePhotoID = sessionStorage.getItem(SESSIONSTORE_HOME_PHOTO_ID_PREFIX + season)
  return homePhotoID
}

function getBanner() {
  let banner = new Map(JSON.parse(sessionStorage.getItem(SESSIONSTORE_BANNER)))
  return banner
}

function setCurrentSeason(year) {
  localStorage.setItem(LOCALSTORE_SEASON, year)
}

function getCurrentSeason() {
  let year = localStorage.getItem(LOCALSTORE_SEASON)
  return year
}
