var CLIENT_ID = '730100849179-n047mcmlc01nc9164e44334v4lmbeukn.apps.googleusercontent.com';
var SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {

    console.log("hooorraay");
    gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPE,
        'immediate': true
    }, handleAuthResult);
    console.log("hooorraay2");
}

function handleClickAuth() {

    console.log("hooorraay");
    gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPE,
        'immediate': false
    }, handleAuthResult);
    console.log("hooorraay2");
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    console.log(authResult);
    if (authResult && !authResult.error) {
        var header_obj = document.getElementById('pageTitle');
        header_obj.innerHTML = header_obj.innerHTML + '<br><button type="button" onClick="loadCalendarApi();">AUTOFILL</button>';
        
    } else {
        var header_obj = document.getElementById('pageTitle');
        header_obj.innerHTML = header_obj.innerHTML + '<br><button onClick="handleClickAuth();">AUTHENTICATE GCAL</button>';
    }

}

function loadCalendarApi() {
    console.log("do nothing");
    //gapi.client.load('calendar', 'v3', autofill);
}

function autofill() {
    console.log("run autofiller");
}

