
(function ($) {

    var app = angular.module('root', ['ngSanitize', 'ngTouch']);

    app.directive('afEnter', function () {

        return function (scope, elem, attrs) {

            elem.bind('keypress keydown', function (evt) {

                if (13 === evt.which) {
                    scope.$applyAsync(function () {
                        scope.$eval(attrs.afEnter);
                    });

                    evt.preventDefault();
                }
            });
        };
    });

    app.directive('afFocus', function () {

        return function (scope, elem, attrs) {

            elem.bind('click', function () {

                $('#' + attrs.afFocus).focus();
            })
        }
    })

    app.controller('mainCtrl', ['$scope', function ($scope) {

        var self = this;

        self.data = window.Data;
        self.learn = [];
        self.btnTexts = ['znaczenie', 'następne'];

        self.title = 'Deutsch mit Spaß lernen';
        self.chevron = '<span class="md md-chevron-right"></span>';

        self.isSearchModeOn = false;
        self.searchValue = '';
        self.searchResults = [];

        self.shown = null;
        self.prev = null;
        self.nextBtn = self.btnTexts[0];

        self.cl = function () {
            console.log.apply(console, arguments);
            return 'u';
        }

        self.toChevron = function (text) {
            if (!text)
                return text;

            var response = text.replace(/>/gi, self.chevron, 'g');
            return response;
        }

        self.fillLearnData = function () {

            if (0 < self.learn.length)
                return;

            for(var i = 0; i < self.data.length; i++) {

                var obj = {pl : self.data[i].pl, de : self.data[i].de};
                self.learn.push(obj);

            }
        }

        self.getNewItem = function () {

            self.fillLearnData();

            var elIdx = self.learn.length * Math.random();
            elIdx = Math.floor(elIdx);

            var el = self.learn.splice(elIdx, 1);

            return el[0];
        }

        self.tap = function() {

            if (!self.shown || 1 === self.shown.state) {

                if (self.shown)
                    self.prev = self.shown;

                var nitem = self.getNewItem();
                self.shown = {item:nitem, text:nitem.pl, info:'...', state:0};
                self.nextBtn = self.btnTexts[self.shown.state];
                return;

            }

            if (0 == self.shown.state) {

                self.shown.info = self.shown.item.de;
                self.shown.info = self.toChevron(self.shown.info);
                self.shown.state = 1;
                self.nextBtn = self.btnTexts[self.shown.state];
                return;

            }

        }

        self.changeToSearchMode = function (isOn) {

            self.searchValue = '';
            self.searchResults = [];

            self.isSearchModeOn = isOn;
        }

        self.selectSearchedWord = function (delem) {

            self.shown = {item:delem, text:delem.pl, info:delem.info, state:1};
            self.nextBtn = self.btnTexts[self.shown.state];

            self.changeToSearchMode(false);
        }

        self.searchWord = function (keyword) {

            self.searchResults = [];

            if (!self.data)
                return;

            // ToDo: tymczasowo - wszystko
            for (var idx = 0; idx < self.data.length; idx++) {

                var delem = {pl : self.data[idx].pl, de : self.data[idx].de, info : self.toChevron(self.data[idx].de)};

                // tylko zaczynające się na daną frazę
                if (0 === delem.de.indexOf(keyword))
                    self.searchResults.push(delem);
            }
        }

        self.tap();

    }]);

    //document.addEventListener('deviceready', function() { console.log('rdy!'); navigator.splashscreen.hide(); }, false);

    document.addEventListener('deviceready', function() {
    }, false);

    document.addEventListener('pause', function() {
    }, false);

})(window.liteQuery);
