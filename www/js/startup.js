
(function (window,document) {

    'use strict';

    function onDeviceReady() {

        var buildJsScript = document.createElement('script');
        buildJsScript.type = 'text/javascript';
        buildJsScript.src = 'js/built-app.js';
        document.head.appendChild(buildJsScript);
    }

    function onPause() {

    }

    //document.addEventListener('deviceready', function() { console.log('rdy!'); navigator.splashscreen.hide(); }, false);

    document.addEventListener('deviceready', onDeviceReady, false);
    document.addEventListener('pause', onPause, false);

})(window,document);
