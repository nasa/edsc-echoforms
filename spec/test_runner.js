(function () {
    "use strict";
    var system = require("system");
    var url = system.args[1];
 
    phantom.viewportSize = {width: 800, height: 600};
 
    console.log("Opening " + url);
 
    var page = new WebPage();
 
    // This is required because PhantomJS sandboxes the website and it does not
    // show up the console messages form that page by default
    page.onConsoleMessage = function (msg) {
        console.log(msg);
 
        // Exit as soon as the last test finishes.
        if (msg && msg.indexOf("progressFinish") !== -1) {
            phantom.exit();
        }
    };
 
    page.open(url, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
            phantom.exit(-1);
        } else {
            // Timeout - kill PhantomJS if still not done after 2 minutes.
            window.setTimeout(function () {
                phantom.exit();
            }, 120 * 1000); // NB: use accurately, tune up referring to your needs
        }
    });
}());
