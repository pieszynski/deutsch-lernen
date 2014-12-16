
(function (window,document) {

    'use strict';

    var backCallback = null;

    function onDeviceReady() {

        document.addEventListener('pause', onPause, false);
        document.addEventListener('backbutton', onBack, false);
        document.addEventListener('menubutton', onMenu, false);

        var buildJsScript = document.createElement('script');
        buildJsScript.type = 'text/javascript';
        buildJsScript.src = 'js/built-app.js';
        document.head.appendChild(buildJsScript);
    }

    function onPause() {

    }

    window.registerBack = function (callback) {

        backCallback = callback;
    }

    function onBack() {

        if (undefined !== backCallback && null != backCallback) {

            backCallback();
            return;
        }

        // jeśli nie zdefiniowano funkcji to zamykamy aplikację
        navigator.app.exitApp();
    }

    function onMenu() {

        //document.getElementById('idTest').innerText = 'menuuzzz';
    }

    //document.addEventListener('deviceready', function() { console.log('rdy!'); navigator.splashscreen.hide(); }, false);

    document.addEventListener('deviceready', onDeviceReady, false);

})(window,document);
