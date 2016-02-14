var title = document.getElementById("pageTitle");
title.innerHTML = title.innerHTML + "<br><br>Successfully Injected";

var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');

script.type = 'text/javascript';
script.src = chrome.extension.getURL("autofill.js");
head.appendChild(script);

script.src = "https://apis.google.com/js/client.js?onload=checkAuth";
head.appendChild(script);



