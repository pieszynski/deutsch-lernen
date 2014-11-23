
(function () {

    var app = angular.module('root', ['ngSanitize', 'ngTouch']);

    app.controller('mainCtrl', ['$scope', function ($scope) {

        var self = this;

        self.data = window.Data;
        self.learn = [];
        self.btnTexts = ['znaczenie', 'następne'];

        self.title = 'Deutsch mit Spaß lernen';
        self.chevron = '<span class="md md-chevron-right"></span>';

        self.shown = null;
        self.prev = null;
        self.nextBtn = self.btnTexts[0];

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
                self.shown.info = self.shown.info.replace(/>/gi, self.chevron, 'g');
                self.shown.state = 1;
                self.nextBtn = self.btnTexts[self.shown.state];
                return;

            }

        }

        self.tap();

    }]);

    //document.addEventListener('deviceready', function() { console.log('rdy!'); navigator.splashscreen.hide(); }, false);

})();
