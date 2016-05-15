var prefs = require('sdk/simple-prefs');
var { setInterval, clearInterval } = require("sdk/timers");
var tabs = require("sdk/tabs");
var globalPref = require("sdk/preferences/service");

var redirectUrl = globalPref.get('browser.startup.homepage', 'about:home');
var repeatInterval = 30;
// var exceptionUrl = /about:\w+/;

var intervalId = setInterval(function () {
    redirectUrl = globalPref.get('browser.startup.homepage', 'about:home');
    if (tabs.length == 0) {
        tabs.open(redirectUrl);
    }
    else if (tabs.length == 1) {
        if (tabs[0].url != redirectUrl)
            tabs[0].url = redirectUrl;
    }
    else {
        while (tabs.length > 1) {
            tabs[0].close();
        }
        if (tabs[0].url != redirectUrl)
            tabs[0].url = redirectUrl;
    }
}, repeatInterval * 1000);

function onPrefChange(prefName) {
    //redirectUrl = prefs.prefs['redirectUrl'];
    repeatInterval = prefs.prefs['repeatInterval'];
    if (repeatInterval >= 30) {
        clearInterval(intervalId);
        intervalId = setInterval(function () {
            redirectUrl = globalPref.get('browser.startup.homepage', 'about:home');
            if (tabs.length == 0) {
                tabs.open(redirectUrl);
            }
            else if (tabs.length == 1) {
                if (tabs[0].url != redirectUrl)
                    tabs[0].url = redirectUrl;
            }
            else {
                while (tabs.length > 1) {
                    tabs[0].close();
                }
                if (tabs[0].url != redirectUrl)
                    tabs[0].url = redirectUrl;
            }
        }, repeatInterval * 1000);

    }
}
require("sdk/simple-prefs").on("somePreference", onPrefChange);
require("sdk/simple-prefs").on("someOtherPreference", onPrefChange);

// `""` listens to all changes in the extension's branch
require("sdk/simple-prefs").on("", onPrefChange);



