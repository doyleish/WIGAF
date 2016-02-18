/**
 * This script is executed in an isolated, chrome-created environment
 * having access to chrome js entrypoints and the loaded document. In
 * this case, the loaded document is the whenisgood page.  The only purpose
 * of this script is to load up the autofill.js source and subsequently,
 * the google client script with an onload callback to the authentication
 * entrypoint in autofill.js
 */

var script = document.createElement('script');
var gscript = document.createElement('script');


script.type = 'text/javascript';
script.src = chrome.extension.getURL("autofill.js");
document.head.appendChild(script);

gscript.type = 'text/javascript';
gscript.src = "https://apis.google.com/js/client.js?onload=checkAuth";
(document.head || document.documentElement).appendChild(gscript);


var title = document.getElementById("pageTitle");
title.innerHTML = title.innerHTML + "<br><br><u>Autofiller</u>";
        
        
        
