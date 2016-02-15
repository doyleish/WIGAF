var sscript = document.createElement('script'); //settings
var script = document.createElement('script');
var gscript = document.createElement('script');

//global variable settings
sscript.type = 'text/javascript';

var tmp_text = [];
sscript.text = tmp_text.join('\n');



script.type = 'text/javascript';
script.src = chrome.extension.getURL("autofill.js");
document.head.appendChild(script);

gscript.type = 'text/javascript';
gscript.src = "https://apis.google.com/js/client.js?onload=checkAuth";
(document.head || document.documentElement).appendChild(gscript);


var title = document.getElementById("pageTitle");
title.innerHTML = title.innerHTML + "<br><br><u>Autofiller</u>";
        
        
        
