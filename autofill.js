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
            header_obj.innerHTML = header_obj.innerHTML + '<br><br><button style="font-size:20pt" type="button" onClick="loadCalendarApi();">AUTOFILL</button>';
            initSettings();
        }
        
    } else {
        var header_obj = document.getElementById('pageTitle');
        header_obj.innerHTML = header_obj.innerHTML + '<br><br><button style="font-size:20pt" id="auth_button_temp" type="button" onClick="handleClickAuth();">AUTHENTICATE GCAL</button>';
    }

}

function initSettings(){
    var header_obj = document.getElementById('pageTitle');
    header_obj.innerHTML = header_obj.innerHTML + '<br><br>Calendars (ctrl-click to multi-select): <select multiple id="calendar_selection"></select>';
    header_obj.innerHTML = header_obj.innerHTML + '<br><br>Start Time (do not schedule before): <select id="starttime_selection"></select>';
    header_obj.innerHTML = header_obj.innerHTML + '<br><br>End Time (do not schedule after): <select id="endtime_selection"></select>';
    header_obj.innerHTML = header_obj.innerHTML + '<br><br>Event Length (minutes): <select id="lengthtime_selection"></select>';
    var start_array = [
        '6:00 am',
        '7:00 am',
        '8:00 am',
        '9:00 am',
       '10:00 am',
       '11:00 am'
    ];
    
    var end_array = [
       '11:00 pm',
       '10:00 pm',
        '9:00 pm',
        '8:00 pm',
        '7:00 pm',
        '6:00 pm',
        '5:00 pm',
        '4:00 pm',
        '3:00 pm'
    ];
    
    var len_array = [
        '60',
        '120',
        '30',
        '15'
    ]
    
    var start = document.getElementById('starttime_selection');
    var end = document.getElementById('endtime_selection');
    var lentime = document.getElementById('lengthtime_selection');
    for(i=0;i<start_array.length;i++){
        var option = document.createElement("option");
        option.text = start_array[i];
        start.add(option);
    }
    for(i=0;i<end_array.length;i++){
        var option = document.createElement("option");
        option.text = end_array[i];
        end.add(option);
    }
    for(i=0;i<len_array.length;i++){
        var option = document.createElement("option");
        option.text = len_array[i];
        lentime.add(option);
    }


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
        document.getElementById(times_by_id[i]).className="canDo";
    }

    for(i=0;i<times_by_id.length;i++){
        doAll(i);
    }
}

function doAll(i){
    var calendars = document.getElementById("calendar_selection");
    var start_time = document.getElementById("starttime_selection").options[document.getElementById("starttime_selection").selectedIndex].text;
    var end_time = document.getElementById("endtime_selection").options[document.getElementById("endtime_selection").selectedIndex].text;
    var length_time = parseInt(document.getElementById("lengthtime_selection").options[document.getElementById("lengthtime_selection").selectedIndex].text);
    calendars.selectedOptions
    var current_time = document.getElementById(times_by_id[i]);
    var time = current_time.childNodes[1].innerText;
    if(time==""){return;} //This is to catch potentially blank table entries
    
    var current_id = times_by_id[i];
    var current_day = days_raw[i%(days_raw.length)];
    var weekday = current_day.childNodes[1].innerText;
    var date = current_day.childNodes[3].innerText;
    var month = current_day.childNodes[5].innerText;
    var year = "2016";
    var startdate = new Date(dateify(weekday, date, month, year, start_time));
    var enddate = new Date(dateify(weekday, date, month, year, end_time));
    var date1 = new Date(dateify(weekday, date, month, year, time));
    var date2 = new Date(date1.getTime() + length_time*60000); //looking over the next 60 minutes.
    if(date1.getTime()<startdate.getTime()){document.getElementById(times_by_id[i]).className = "proposed"; return;}
    if(date2.getTime()>enddate.getTime()){document.getElementById(times_by_id[i]).className = "proposed"; return;}
    
    for(j=0;j<calendars.selectedOptions.length;j++){
        var request = gapi.client.calendar.freebusy.query({
            'timeMin': date1.toISOString(),
            'timeMax': date2.toISOString(),
            'timeZone': 'EST',
            'items': [
                {'id':calendars.selectedOptions[j]['value']}
            ]
        });
        request.execute(function(resp) {
            var retval;
            for (x in resp['calendars']){
                retval = resp['calendars'][x]['busy'].length;
                break;
            }
    
            if(retval > 0){ document.getElementById(times_by_id[i]).className = "proposed";}
        });
    }
    
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
