// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4",
                        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]

const MOHI_APIKEY = 'AIzaSyAF7M4rFbRQnh0L62aO3ANRT9bSqciBobw'
const PHOTO_FOLDER_ID = "'1zoSGrQTMX10X99eB71ORTaPMWeih_CL3'"

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly',
                'https://www.googleapis.com/auth/drive.readonly']

const DEFAULT_SEASON = '2016-2017'
const DEFAULT_SPREADSHEET_ID = '1mE65wuB4JSKGjC0fQK45InFoIiNtCynUNVo4BJ5r3NI'

let gapi_init = false
let delayedSpreadsheetAPICall = null
let photoYearSpreadsheetIDs = new Map()


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
    gapi_init = true
    // retrieveYears()
    retrievePhotoFolderIds()
    if (delayedSpreadsheetAPICall) {
      delayedSpreadsheetAPICall()
      delayedSpreadsheetAPICall = null
    }
  }, function(reason) {
    alert('Error: ' + reason.result.error.message)
  })
}

// TODO: Need to pull these from master selector spreadsheet and base it off of year
// let spreadSheetIDsNew = new map()
let spreadSheetIDs = {
'2019-2020': '129axJ7uPVBkac6ZTSbR0UQecN67RUeXV62G8FdFHTUU',
'2018-2019': '19zaPGXGRSTMDu4qk9MKA6RjFtZZ9JvFyBRXdn5v0WoQ',
'2017-2018': '1OLYwhlO7Lmhw-mP4W6ugY2RMA5JZjG-cGGMPa6ZjC64',
'2016-2017': '1mE65wuB4JSKGjC0fQK45InFoIiNtCynUNVo4BJ5r3NI'
}


// TODO: Figure out why it throws exception after first entry.
//       Convert to proper map
//       Extract ID from link
//       Replace list above
//       Replace html

// Spreadsheets that are independent of the year
// (note: these currently reference a single spreadsheet that has multiple tabs.  The variables here are just to
//        give extra flexibility in case the tabs are turned into their own spreadsheets.)
let mainSpreadSheetID = '1CCEfoIFaT4vt0jE6BusGqaK_EuTOzU1hqUNozylIh6g'
let websiteContactSpreadSheetID = mainSpreadSheetID
let articlesSpreadSheetID = mainSpreadSheetID
let adminSpreadSheetID = mainSpreadSheetID
let coachesSpreadSheetID = mainSpreadSheetID
let eventsSpreadSheetID = mainSpreadSheetID
let yearSpreadSheetID = mainSpreadSheetID


function retrieveYears() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: mainSpreadSheetID,
    key: MOHI_APIKEY,
    range: 'A8:B'
  }).then(function(response) {
    spreadSheetIDsNew.clear()
    let range = response.result
    if (range.values.length > 0) {
      let dataArray = new Array()
      for (row = 0; row < range.values.length; row++) {
        let entry = range.values[row]
        let dataRow = new Array()
        let season = entry[0]
        let link = entry[1]
        spreadSheetIDsNew.set(season, link)
      }
    } else {
      spreadSheetIDsNew.set(DEFAULT_SEASON, DEFAULT_SPREADSHEET_ID)
    }
  })
}

function loadSchedule(team, year) {
  if (!gapi_init) {
    delayedSpreadsheetAPICall = listSchedule.bind(null, team, year, spreadSheetIDs[year])
  } else {
    listSchedule(team, year, spreadSheetIDs[year])
  }
}

function loadRoster(team, year) {
  if (!gapi_init) {
    delayedSpreadsheetAPICall = listRoster.bind(null, team, year, spreadSheetIDs[year])
  } else {
    listRoster(team, year, spreadSheetIDs[year])
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

function loadPhotos(photoHandler) {
  if (!gapi_init) {
    delayedSpreadsheetAPICall = photoHandler.bind(null)
  } else {
    photoHandler()
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

function listRoster(team, year, spreadSheetId) {
  let page = team + '_ROSTER'
  listTable(page, spreadSheetId, 'roster', 'rosterId', 'A1:E')
}

function listSchedule(team, year, spreadSheetId) {
  let page = team + '_SCHEDULE'
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
  let range = 'A3'
  let pageName = 'Contacts-Other'
  let pageRange = String(pageName) + "!" + range
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadSheetId,
    key: MOHI_APIKEY,
    range: pageRange
  }).then(function(response) {
    let range = response.result
    if (range.values.length > 0) {
      let entry = range.values[0]
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
      for (row = 0; row < range.values.length; row++) {
        let entry = range.values[row]
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
      for (row = 0; row < range.values.length; row++) {
        let entry = range.values[row]
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


let MOHI_DRIVE_APIKEY= 'AIzaSyACWPr-jLvJeYPVEawCCfWsP_uzHE2xuNQ'
// TODO: move to photos file?
// Remove the need for a spreadsheet to do this but add documentation about the directory names
// When photos are selected, index into map to get ID, if nothing found print appropriate error
// Get list of files (want the URL list this time).  Then run periodic update and randomly select a photo to display
// https://drive.google.com/uc?export=view&id=
// FUTURE: fade in and out

// SEEMS TO BE CALLED TWICE

function retrievePhotoFolderIds() {
  photoYearSpreadsheetIDs.clear()
  let photoYearSpreadsheetIDsJSON = sessionStorage.getItem('photoYearSpreadsheetIDs')
  if (photoYearSpreadsheetIDsJSON) {
    photoYearSpreadsheetIDsArr = JSON.parse(photoYearSpreadsheetIDsJSON)
    if (photoYearSpreadsheetIDsArr.length > 0) {
      photoYearSpreadsheetIDs = new Map(photoYearSpreadsheetIDsArr)
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
        photoYearSpreadsheetIDs.set(season.name, season.id)
      }
    } else {
      console.log('No seasons found for photos.')
    }
    photoYearSpreadsheetIDsJSON = JSON.stringify(Array.from(photoYearSpreadsheetIDs))
    sessionStorage.setItem('photoYearSpreadsheetIDs', photoYearSpreadsheetIDsJSON)
  }, function(response) {
    console.log(response)
  })
}

// We have the season list (map of season folders, now we need to get any images
// from that particular season
// TODO: possible optimization is to store list locally and clear on year select
//       change. Only then do we retrieve the new list.
function retrievePhotosList(season, retrievePhotosListCB) {
  let photosArr = []
  let photoFolderID = photoYearSpreadsheetIDs.get(season)
  if (!photoFolderID) {
    console.log('Cannot find season folder for ' + season)
    return photosArr
  }
 
  let query = "'" + photoFolderID + "' in parents and mimeType = 'image/jpeg'"
  gapi.client.drive.files.list({
    key: MOHI_DRIVE_APIKEY,
    pageSize: 1000,
    q: query,
    fields: "files(name, id)"
  }).then(function(response) {
    var photos = response.result.files
    if (photos && photos.length > 0) {
      for (var i = 0; i < photos.length; i++) {
        var photo = photos[i]
        photosArr.push(photo.id)
      }
    } else {
      console.log('No photos found for season ' + season)
    }
    retrievePhotosListCB(photosArr)
  }, function(response) {
    console.log(response)
    retrievePhotosListCB(photosArr)
  })
}
