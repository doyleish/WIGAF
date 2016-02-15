var CLIENT_ID = '730100849179-n047mcmlc01nc9164e44334v4lmbeukn.apps.googleusercontent.com';
var SCOPE = "https://www.googleapis.com/auth/calendar.readonly";


//Init code

/**
 * Analyzing the total number of times and
 * obtaining availability in a blocking fashion
 */
var days_raw = document.getElementsByClassName("dateHeader weekday");
var times_raw = document.getElementsByClassName("proposed");
var times_by_id = new Array(); //starting these at 1 to prevent js thinking I'm obtaining .toString on a whole array

for(i=0;i<times_raw.length;i++){
    times_by_id.push(times_raw[i].id);
}
console.log(times_by_id);
console.log(times_by_id.length);




/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
    gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPE,
        'immediate': true
    }, handleAuthResult);
}

function handleClickAuth() {
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
    if (authResult && !authResult.error) {
        var header_obj = document.getElementById('pageTitle');
        try{
            document.getElementById("auth_button_temp").setAttribute("onClick","loadCalendarApi()");
            document.getElementById("auth_button_temp").innerText = "AUTOFILL";
            initSettings();
        }catch (e){
            header_obj.innerHTML = header_obj.innerHTML + '<br><button type="button" onClick="loadCalendarApi();">AUTOFILL</button>';
            initSettings();
        }
        
    } else {
        var header_obj = document.getElementById('pageTitle');
        header_obj.innerHTML = header_obj.innerHTML + '<br><button id="auth_button_temp" type="button" onClick="handleClickAuth();">AUTHENTICATE GCAL</button>';
    }

}

function initSettings(){
    var header_obj = document.getElementById('pageTitle');
    header_obj.innerHTML = header_obj.innerHTML + '<br><select multiple id="calendar_selection"></select>';
    var cal_select = document.getElementById('calendar_selection');
    gapi.client.load('calendar', 'v3', function(){

        var cal_req = gapi.client.calendar.calendarList.list();
        cal_req.execute(function(resp){
            for(i=0;i<resp['items'].length;i++){
                var option = document.createElement("option");
                option.text = resp['items'][i]['summary'];
                option.value = resp['items'][i]['id'];
                cal_select.add(option);
            }
        });

    });
}


function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', autofill);
}

function autofill() {
    for(i=0;i<times_by_id.length;i++){
        doAll(i);
    }
}

function doAll(i){
    
    var current_time = document.getElementById(times_by_id[i]);
    var time = current_time.childNodes[1].innerText;
    if(time==""){return;} //This is to catch potentially blank table entries
    
    var current_id = times_by_id[i];
    var current_day = days_raw[i%(days_raw.length)];
    var weekday = current_day.childNodes[1].innerText;
    var date = current_day.childNodes[3].innerText;
    var month = current_day.childNodes[5].innerText;
    var year = "2016";
    var date1 = new Date(dateify(weekday, date, month, year, time, false));
    var date2 = new Date(date1.getTime() + 60*60000); //looking over the next 60 minutes.

    var request = gapi.client.calendar.freebusy.query({
        'timeMin': date1.toISOString(),
        'timeMax': date2.toISOString(),
        'timeZone': 'EST',
        'items': [
            {'id':'rcdoyle@mtu.edu'}
        ]
    });
    request.execute(function(resp) {
        var retval;
        for (x in resp['calendars']){
            retval = resp['calendars'][x]['busy'].length;
            break;
        }

        if(retval == 0){ document.getElementById(times_by_id[i]).className = "canDo"; }
    });
    
}


function dateify(weekday, date, month, year, time){
    var hour = 0;
    var minute = 0;
    var hour_str = "";
    var min_str = "";

    var ampm = time.split(' ')[1];
    hour = parseInt(time.split(' ')[0].split(':')[0]);
    minute = parseInt(time.split(' ')[0].split(':')[1]);
    if(hour==12){hour=0;}
    
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
