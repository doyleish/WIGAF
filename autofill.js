var CLIENT_ID = '730100849179-n047mcmlc01nc9164e44334v4lmbeukn.apps.googleusercontent.com';
var SCOPE = "https://www.googleapis.com/auth/calendar.readonly";



/**
 * Analyzing the total number of times and
 * obtaining availability in a blocking fashion
 */
var days_raw = document.getElementsByClassName("dateHeader weekday");
times_raw = document.getElementsByClassName("proposed");
times_by_id = new Array(); //starting these at 1 to prevent js thinking I'm obtaining .toString on a whole array
return_val_req = 0;

times_by_id.push("");
for(i=1;i<=times_raw.length;i++){
    times_by_id.push(times_raw[i-1].id);
}
console.log(times_by_id);
console.log(times_by_id.length);
console.log(document.getElementById(times_by_id[1]));



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
        header_obj.innerHTML = header_obj.innerHTML + '<br><button type="button" onClick="handleClickAuth();">AUTHENTICATE GCAL</button>';
    }

}

function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', autofill);
}

function autofill() {
    for(i=1;i<times_by_id.length;i++){
        doAll(i);
    }
}

function doAll(i){
    //var temparr = [];
    var current_id;
    var current_day;
    var weekday;
    var date;
    var month;
    var year;
    var time;
    var date1;
    var date2;
    var request;
    var value;
    
    current_time = document.getElementById(times_by_id[i]);
    current_id = times_by_id[i];
    console.log(i+ " " + current_id);
    current_day = days_raw[i%(days_raw.length)];
    weekday = current_day.childNodes[1].innerText;
    date = current_day.childNodes[3].innerText;
    month = current_day.childNodes[5].innerText;
    year = "2016";
    time = current_time.childNodes[1].innerText;
    if(time==""){return;}
    console.log(dateify(weekday, date, month, year, time, false));
    date1 = new Date(dateify(weekday, date, month, year, time, false)).toISOString();
    date2 = new Date(dateify(weekday, date, month, year, time, true)).toISOString();

    request = gapi.client.calendar.freebusy.query({
        'timeMin': date1,
        'timeMax': date2,
        'timeZone': 'EST',
        'items': [
            {'id':'rcdoyle@mtu.edu'}
        ]
    });
    request.execute(function(resp) {
        var retval;
        for (x in resp['calendars']){
            retval = resp['calendars'][x]['busy'].length;
        }

        afterExec(i, retval);
    });
    
}


function afterExec(id, bool){
    console.log(id + " asdf " + bool);
    if(bool == 0){ document.getElementById(times_by_id[id]).className = "canDo"; }
}

function dateify(weekday, date, month, year, time, offset){
    var hour = 0;
    var minute = 0;
    var hour_str = "";
    var min_str = "";

    var ampm = time.split(' ')[1];
    hour = parseInt(time.split(' ')[0].split(':')[0]);
    minute = parseInt(time.split(' ')[0].split(':')[1]);
    if(hour==12){hour=0;}
    if(offset){hour+=1}
    
    if(ampm=="pm"){ hour+=12; }
    
    if(hour<10){
        hour_str = "0" + hour.toString();
    } else {
        hour_str = hour.toString();
    }
    
    if(minute<10){
        min_str = "0" + minute.toString();
    } else {
        min_str = minute.toString();
    }

    if(parseInt(date)<10){
        date = '0' + date;
    }
    

    return weekday + ', ' + date + " " + month + " " + year + " " + hour_str + ":" + min_str + ":00 EST";
}
