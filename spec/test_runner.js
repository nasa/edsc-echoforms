console.log('Loading a web page');
var page = new WebPage();
//This was tricky, this is the way to open LOCAL files
var url = "file://SpecRunner.html";
phantom.viewportSize = {width: 800, height: 600};
//This is required because PhantomJS sandboxes the website and it does not show up the console messages form that page by default
page.onConsoleMessage = function (msg) { console.log(msg); };
//Open the website
page.open(url, function (status) {
    //Page is loaded!
        if (status !== 'success') {
                console.log('Unable to load the address!');
            } else {
                 //Using a delay to make sure the JavaScript is executed in the browser
               window.setTimeout(function () {
                    page.render("output.png");
                    phantom.exit();
               }, 200);
                }
});
