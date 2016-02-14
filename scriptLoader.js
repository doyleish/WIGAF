var script = document.createElement('script');
var gscript = document.createElement('script');

script.type = 'text/javascript';
script.src = chrome.extension.getURL("autofill.js");
(document.head || document.documentElement).appendChild(script);

gscript.type = 'text/javascript';
gscript.src = "https://apis.google.com/js/client.js?onload=checkAuth";
document.head.appendChild(gscript);


var title = document.getElementById("pageTitle");
title.innerHTML = title.innerHTML + "<br><br>Successfully Injected";

