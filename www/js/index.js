
(function ($, window) {

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

        self.isLoaded = true;

        self.data = window.Data;
        self.learn = [];
        self.btnTexts = ['znaczenie', 'następne'];
        self.applicationModes = ['allIrregularVerbs', 'starredIrregularVerbs'];

        self.title = 'Deutsch mit Spaß lernen';
        self.chevron = '<span class="md md-chevron-right"></span>';
        self.defaultApplicationMode = self.applicationModes[0];

        self.appSettings = {
            applicationMode : self.defaultApplicationMode,
            starredIrregularVerbs : []
        };

        self.isMenuHidden = true;
        self.menuButtonButtonClass = 'md-menu menu-button menu-button-hidden';
        self.menuButtonTitleClass = '';

        self.isSearchModeOn = false;
        self.searchValue = '';
        self.searchResults = null;

        self.shown = null;
        self.prev = null;
        self.nextBtn = self.btnTexts[0];

        self.cl = function () {

            console.log.apply(console, arguments);
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

                var obj = {pl : self.data[i].pl, de : self.data[i].de, hasStar : false};

                // sprawdzenie czy obiektu nie ma na liście oznaczonych gwiazdką
                obj.hasStar = !(-1 == self.getStarredIndex(obj));

                self.learn.push(obj);
            }
        }

        self.getStarredIndex = function (wordModel) {

            // sprawdzenie istnienia słówka na liście
            var wordExistsAtIdx = -1;
            if (undefined === wordModel || null == wordModel || undefined === wordModel.pl)
                return wordExistsAtIdx;

            for (var i = 0; i < self.appSettings.starredIrregularVerbs.length; i++) {

                if (wordModel.pl == self.appSettings.starredIrregularVerbs[i]) {

                    wordExistsAtIdx = i;
                    break;
                }
            }

            return wordExistsAtIdx;
        };


        self.onBackButton = function () {

            var response = false;

            if (self.isSearchModeOn) {

                self.changeToSearchMode(false);
                response = true;
            }

            if (!self.isMenuHidden) {

                self.menuClick(true);
                response = true;
            }

            if (response)
                    $scope.$applyAsync();

            return response;
        };

        self.updateAppSettingsFromSaveState = function (appSettings) {

            // aktualizacja obiektu ustawień dostępnego dla kontrolera

            if (undefined === appSettings)
                return;

            self.appSettings = appSettings;
        };

        self.readAllAppSettings = function () {

            // odczytanie ustawień
            var sAppSettings = window.localStorage.getItem('appSettings');

            if (undefined === sAppSettings || null == sAppSettings)
                return;

            var appSettings = JSON.parse(sAppSettings);

            // aktualizacja obiektu ustawień
            self.updateAppSettingsFromSaveState(appSettings);
        };

        self.saveAllAppSettings = function () {

            var sAppSettings = JSON.stringify(self.appSettings);

            window.localStorage.setItem('appSettings', sAppSettings);
        };

        self.setAppSettingsStar = function (wordModel, hasStar) {

            // sprawdzenie istnienia słówka na liście
            var wordExistsAtIdx = self.getStarredIndex(wordModel);

            // usunięcie lub dodanie słówka do listy oznaczonych gwiazdką
            if (hasStar) {

                // dodanie do listy
                if (-1 == wordExistsAtIdx) {

                    self.appSettings.starredIrregularVerbs.push(wordModel.pl);
                }
            } else {

                // usunięcie z listy
                if (0 <= wordExistsAtIdx) {

                    self.appSettings.starredIrregularVerbs.splice(wordExistsAtIdx, 1);
                }
            }

            // zapis obiektu ustawień
            self.saveAllAppSettings();

            // wizualna podmiana zaznaczenia gwiazdki
            wordModel.hasStar = hasStar;
        };

        self.menuClick = function (doHideMenuOverride) {

            if (undefined !== doHideMenuOverride)
                self.isMenuHidden = doHideMenuOverride;
            else
                self.isMenuHidden = !self.isMenuHidden;

            if (self.isMenuHidden) {

                self.menuButtonButtonClass = 'md-menu menu-button menu-button-hidden';
                self.menuButtonTitleClass = '';
            } else {

                self.menuButtonButtonClass = 'md-arrow-back menu-button';
                self.menuButtonTitleClass = 'title-text-menu-shown';
            }
        };

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

        self.changeApplicationMode = function (modeName) {

            // akcja domyślna
            if (!modeName)
                modeName = self.appSettings.applicationMode;

            // wyczyszczenie pól
            self.shown = undefined;
            self.prev = undefined;

            // wyczyszczenie danych dla pól
            if (0 < self.learn.length)
                self.learn.splice(0, self.learn.length);

            // pobranie pierwszego elementu
            self.tap();

            // odświeżenie interfejsu
            $scope.$applyAsync();
        };

        self.starClick = function (evt, viewElementModel) {

            evt.stopPropagation();

            // zapisanie wartości w ustawieniach
            self.setAppSettingsStar(viewElementModel.item, !viewElementModel.item.hasStar);
        };

        self.changeToSearchMode = function (isOn) {

            self.searchValue = '';
            self.isSearchModeOn = isOn;

            self.searchWord();
        }

        self.selectSearchedWord = function (delem) {

            self.shown = {item:delem, text:delem.pl, info:delem.info, state:1};
            self.nextBtn = self.btnTexts[self.shown.state];

            // sprawdzenie oznaczenie gwiazdki następuje dopiero po wybraniu słówka
            self.shown.item.hasStar = !(-1 == self.getStarredIndex(self.shown.item));

            self.changeToSearchMode(false);
        }

        self.initSearchObject = function () {

            if (!self.data)
                return;

            // tablica wyników jest pusta - uzupełnienie
            if (!self.searchResults) {

                self.searchResults = [];

                for (var idx = 0; idx < self.data.length; idx++) {

                    var delem = {
                        pl : self.data[idx].pl,
                        de : self.data[idx].de,
                        info : self.toChevron(self.data[idx].de),
                        hasStar : false,
                        visible : true
                    };
                    self.searchResults.push(delem);
                }
            }
        }

        self.searchWord = function (keyword) {

            if (!self.searchResults)
                return;

            if (keyword)
                keyword = keyword.trim();

            for (var idx = 0; idx < self.searchResults.length; idx++) {

                var delem = self.searchResults[idx];

                if (!keyword) {

                    delem.visible = true;
                    continue;
                }

                delem.visible = (0 === delem.de.indexOf(keyword));
            }
        }


        window.registerBack(self.onBackButton);
        self.readAllAppSettings();
        self.changeApplicationMode();
        self.initSearchObject();

    }]);

})(window.liteQuery, window);
