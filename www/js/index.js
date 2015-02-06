
(function ($, window) {

    var app = angular.module('root', ['ngSanitize', 'ngTouch', 'dmsBestimmte']);

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

                // BUG: nie działa...
                // $('#' + attrs.afFocus).focus();
            })
        }
    })

    app.controller('mainCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

        var self = this;

        self.isLoaded = true;

        self.data = window.Data;

        self.learn = [];

        self.btnTexts = ['znaczenie', 'następne'];
        self.applicationModes = [
            {name : 'allIrregularVerbs', selected: true, text : 'Wszystkie czasowniki'},
            {name : 'starredIrregularVerbs', selected: false, text : 'Tylko oznaczone "<span class="md-star"></span>"'},
            {name : 'bestimmteArtikel', selected: false, text : 'Odmiana przymiotnika'}
        ];
        self.currentApplicationMode = self.applicationModes[0];

        self.title = 'Deutsch mit Spaß lernen';
        self.chevron = '<span class="md md-chevron-right"></span>';

        self.appSettings = {
            applicationMode : self.applicationModes[0].name,
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
        };

        self.toChevron = function (text) {

            if (!text)
                return text;

            var response = text.replace(/>/gi, self.chevron, 'g');
            return response;
        };

        self.fillLearnData = function () {

            if (0 < self.learn.length)
                return;

            var onlyStarredMode = 'starredIrregularVerbs' === self.appSettings.applicationMode;

            for(var i = 0; i < self.data.length; i++) {

                var obj = {pl : self.data[i].pl, de : self.data[i].de, hasStar : false};

                // sprawdzenie czy obiektu nie ma na liście oznaczonych gwiazdką
                obj.hasStar = !(-1 == self.getStarredIndex(obj));

                // jeśli tryb aplikacji jest ustawiony na słówka tylko z gwiazdką to nie dodajemy innych
                if (!obj.hasStar && onlyStarredMode)
                    continue;

                self.learn.push(obj);
            }
        };

        self.getStarredIndex = function (wordModel) {

            // sprawdzenie istnienia słówka na liście
            var wordExistsAtIdx = -1;
            if (undefined === wordModel || null == wordModel || undefined === wordModel.pl)
                return wordExistsAtIdx;

            for (var i = 0; i < self.appSettings.starredIrregularVerbs.length; i++) {

                if (wordModel.pl === self.appSettings.starredIrregularVerbs[i]) {

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

        self.onMenuButton = function () {

            // jeśli jest włączona wyszukiwarka to nie można pokazać menu
            if (self.isSearchModeOn)
                return;

            self.menuClick();
            $scope.$applyAsync();
        };

        self.updateAppSettingsFromSaveState = function (appSettings) {

            // aktualizacja obiektu ustawień dostępnego dla kontrolera

            if (undefined === appSettings)
                return;

            self.appSettings = appSettings;

            // wyszukianie odpowiedniego trybu aplikacji lub przejście do domyślnego
            var appMode = self.getApplicationModeByName(self.appSettings.applicationMode);
            self.currentApplicationMode = appMode ? appMode : self.applicationModes[0];
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

            if (0 == self.learn.length)
                return undefined;

            var elIdx = self.learn.length * Math.random();
            elIdx = Math.floor(elIdx);

            var el = self.learn.splice(elIdx, 1);

            return el[0];
        };

        self.tap = function() {

            if (!self.shown || 1 === self.shown.state) {

                if (self.shown)
                    self.prev = self.shown;

                var nitem = self.getNewItem();
                if (!nitem) {

                    self.shown = undefined;
                    self.prev = undefined;
                    return;
                };

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
        };

        self.getApplicationModeByName = function (modeName) {

            for (var i = 0; i < self.applicationModes.length; i++) {

                if (modeName === self.applicationModes[i].name)
                    return self.applicationModes[i];
            }

            return undefined;
        };

        self.changeApplicationMode = function (modeName, modeModel, hideMenuPanel) {

            // akcja domyślna
            if (!modeName)
                modeName = self.appSettings.applicationMode;

            if (!modeModel)
                modeModel = self.getApplicationModeByName(modeName);

            if (modeModel) {

                // zmiana flagi stanu
                for (var i = 0; i < self.applicationModes.length; i++)
                    self.applicationModes[i].selected = false;

                modeModel.selected = true;
                self.appSettings.applicationMode = modeModel.name;

                // zapisanie aktualnego trybu aplikacji
                self.saveAllAppSettings();
            }

            // wyczyszczenie pól
            self.shown = undefined;
            self.prev = undefined;

            // wyczyszczenie danych dla pól
            if (0 < self.learn.length)
                self.learn.splice(0, self.learn.length);

            // wykonanie pierwszej akcji dla konkretnych trybów aplikacji
            if ('allIrregularVerbs' === self.appSettings.applicationMode
                || 'starredIrregularVerbs' === self.appSettings.applicationMode) {

                // pobranie pierwszego elementu
                self.tap();

            } else if ('bestimmteArtikel' === self.appSettings.applicationMode) {

                // pobranie pierwszego elementu
                //BUG: self.tapBestimmteArtikel();
            }

            // ukrycie paska menu
            if (hideMenuPanel) {

                self.menuClick(true);
            }

            // odświeżenie interfejsu
            $scope.$applyAsync();
        };

        self.starClick = function (evt, viewElementModel) {

            evt.stopPropagation();

            if (!viewElementModel)
                return;

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

        self.showInCurrentMode = function (mode) {

            if (!self.isLoaded || self.isSearchModeOn) {

                return false;
            }

            if ('string' === typeof mode) {

                return mode === self.appSettings.applicationMode;
            }

            if (mode instanceof Array) {

                for (var im = 0; im < mode.length; im++) {

                    if (mode[im] === self.appSettings.applicationMode) {

                        return true;
                    }
                }
            }

            return false;
        }


        window.registerBack(self.onBackButton);
        window.registerMenu(self.onMenuButton);
        self.readAllAppSettings();
        self.changeApplicationMode();
        self.initSearchObject();

    }]);

})(window.liteQuery, window);
