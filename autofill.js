var CLIENT_ID = '730100849179-idf30ma4u31kqj6l14ahoirjj6719vcu.apps.googleusercontent.com';
var SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  console.log("hooorraay");
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPE,
      'immediate': true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var header_obj = document.getElementById('pageTitle');
  if (authResult && !authResult.error) {
      header_obj.innerHTML = header_obj.innerHTML + ["<br>",
      "<button id=\"autofiller\" onClick=\"autofill();\">"
      ].join('\n')
      ;
  }
}

