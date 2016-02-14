var CLIENT_ID = '730100849179-n047mcmlc01nc9164e44334v4lmbeukn.apps.googleusercontent.com';
var SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

/**
 * Check if current user has authorized this application.
 */
function checkAuth(event) {

    console.log("hooorraay");
    gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPE,
        'immediate': false
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    console.log(authResult);
    if (authResult && !authResult.error) {
        loadCalendarApi();
    }
}

function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', autofill);
}

function autofill() {
    console.log("run autofiller");
}


var header_obj = document.getElementById('pageTitle');
header_obj.innerHTML = header_obj.innerHTML + '<br><button id="autofiller" onClick="checkAuth(event);">AUTOFILL</button>';
