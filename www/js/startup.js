
(function (window,document) {

    'use strict';

    var backCallback = null,
        menuCallback = null;

    function onDeviceReady() {

        document.addEventListener('pause', onPause, false);
        document.addEventListener('backbutton', onBack, false);
        document.addEventListener('menubutton', onMenu, false);

        //var buildJsScript = document.createElement('script');
        //buildJsScript.type = 'text/javascript';
        //buildJsScript.src = 'js/built-app.js';
        //document.head.appendChild(buildJsScript);
    }

    function onPause() {

    }

    window.registerBack = function (callback) {

        backCallback = callback;
    }

    function onBack() {

        var backResponse = undefined;
        if (undefined !== backCallback && null != backCallback) {

            backResponse = backCallback();
        }

        // jeśli nie zdefiniowano funkcji lub zwróciła FALSE to zamykamy aplikację
        if (!backResponse)
            navigator.app.exitApp();
    }

    window.registerMenu = function (callback) {

        menuCallback = callback;
    };

    function onMenu() {

        if (menuCallback)
            menuCallback();
    }

    //document.addEventListener('deviceready', function() { console.log('rdy!'); navigator.splashscreen.hide(); }, false);

    document.addEventListener('deviceready', onDeviceReady, false);

})(window,document);
