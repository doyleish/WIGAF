var CLIENT_ID = '730100849179-n047mcmlc01nc9164e44334v4lmbeukn.apps.googleusercontent.com';
var SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

var days_raw = document.getElementsByClassName("dateHeader weekday");
var times_raw = document.getElementsByClassName("proposed");
var num_times = times_raw.length; //number of times per day(including blanks)
var times_by_id = [num_times+1];

times_by_id[0] = "";
for(i=1;i<=num_times;i++){
    times_by_id[i] = (times_raw[i-1].id);
}
console.log(times_by_id);

var num_days = days_raw.length; //number of days shown
console.log(times_by_id.length);

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
    
    var calendars = [{}];
    
    var request = gapi.client.calendar.calendarList.list({});
    request.execute(function(resp){
        var len = resp['items'].length;
        for(i=0;i<len;i++){
            if(resp['items'][i]['accessRole'] == "owner"){
                calendars.push({'id': resp['items'][i]['id']});
            }
        }
    })

    console.log(calendars);
    

    for(i=1;i<times_by_id.length;i++){
        var current_time = document.getElementById(times_by_id[i].toString());
        var current_id = times_by_id[i].toString();
        console.log(i+ " " + current_id);
        var current_day = days_raw[i%num_days];
        var weekday = current_day.childNodes[1].innerText;
        var date = current_day.childNodes[3].innerText;
        var month = current_day.childNodes[5].innerText;
        var year = "2016";
        var time = current_time.childNodes[1].innerText;
        if(time==""){break;}
        console.log(dateify(weekday, date, month, year, time, false));
        console.log(dateify(weekday, date, month, year, time, true));
        var date1 = new Date(dateify(weekday, date, month, year, time, false)).toISOString();
        var date2 = new Date(dateify(weekday, date, month, year, time, true)).toISOString();
        
                                                                                                     //   for(j=1;j<calendars.length;j++){
            request = gapi.client.calendar.freebusy.query({
                'timeMin': date1,
                'timeMax': date2,
                'timeZone': 'EST',
                'items': [
                    {'id':'rcdoyle@mtu.edu'}
                
                ]
            });
            request.execute(function(resp) {
                for (x in resp['calendars']){
                    if(resp['calendars'][x]['busy'].length == 0){
                        document.getElementById(times_by_id[i]).className="canDo";
                    }
                }
            })
                                                                                                          //      if(busy){break;}
        console.log(i);                                                                                                  //  }

    }
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
