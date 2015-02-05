
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

                // BUG: nie działa...
                // $('#' + attrs.afFocus).focus();
            })
        }
    })

    app.controller('mainCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

        var self = this;

        self.isLoaded = true;

        self.data = window.Data;
        self.dataBestimmteArtikel = window.DataBestimmteArtikel;

        self.learn = [];
        self.learnBestimmteArtikel = [];

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

        self.bestimmtePopupVisible = 'invisibleElement';
        self.shownBestimmteArtikel = null;

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

        self.randomizeNounCase = function (nounModel) {

            // STARE
            //var cases = {
            //        list: ['Nominativ'/*, 'Genitiv', 'Dativ', 'Akkusativ'*/],
            //        Nominativ: {
            //            bestimmteArt: 'd',
            //            bestimmte: ['der', 'die', 'das'],
            //            bestimmteEnd: ['-er', '-e', '-es'],
            //            bestimmteMap: { der: 'der', die: 'die', das: 'das'},
            //
            //            unBestimmteArt: '(k)ei',
            //            unBestimmte: ['(k)ein', '(k)eine', '(k)ein'],
            //            unBestimmteEnd: ['-er', '-e', '-es'],
            //            unBestimmteMap: { der: '(k)ein', die: '(k)eine', das: '(k)ein'},
            //
            //            ohneArt: null,
            //            onhe: null,
            //            ohneEnd: ['-er', '-e', '-es'],
            //            ohneMap: null
            //        }
            //    },
            //    form = ['Singular'/*, 'Plural'*/],
            //    caseProbability = Math.random(),
            //    response = null;

            // * wybieramy przypadek
            // * wybieramy rodzajnik: określony, nieokreślony, brak
            // * wybieramy liczbę: pojedyncza czy mnoga

            return {
                fall: null,
                artikel: null,
                endungen: null,
                art: null,
                subs: null,
                field1: null,
                field2: null,
                field3: null
            }
        };

        self.fillLearnBestimmteArtikelData = function () {

            if (0 < self.learnBestimmteArtikel.length)
                return false;

            var substs = self.dataBestimmteArtikel.Substantiv,
                adjs = self.dataBestimmteArtikel.Adjektiv,
                esub = null,
                eadj = null,
                elem = null;

            for (var isub = 0; isub < substs.length; isub++) {
                for (var iadj = 0; iadj < adjs.length; iadj++) {

                    esub = substs[isub];
                    eadj = adjs[iadj];

                    self.randomizeNounCase(esubs);

                    // model dla bestimmteArtikel
                    elem = {
                        fall : 'Nominativ, Singular',
                        artikel : ['der', 'die', 'das'],
                        endungen : ['-er', '-e', '-es'],
                        art : 'd',
                        subs : esub.de,
                        adj : eadj.de,
                        field1 : esub.art,
                        field1Ignore : false,
                        field2 : '-e',
                        field2Ignore : false,
                        field3 : '',
                        field3Ignore : false
                    };

                    self.learnBestimmteArtikel.push(elem);
                }
            }

            return true;
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

        self.getNewBestimmteArtikelItem = function () {

            self.fillLearnBestimmteArtikelData();

            if (0 === self.learnBestimmteArtikel.length)
                return undefined;

            var elIdx = self.learnBestimmteArtikel.length * Math.random();
            elIdx = Math.floor(elIdx);

            var el = self.learnBestimmteArtikel.splice(elIdx, 1);

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

        self.tapBestimmteArtikel = function (fld, num, val) {

            var getNewElement = undefined === fld;

            // sprawdzenie poprawności wyboru
            if (self.shownBestimmteArtikel && undefined !== fld) {

                // sprawdzenie wyboru
                var fElem = self.shownBestimmteArtikel[fld];
                if (fElem && !fld.ignore) {

                    // wyczyszczenie styli
                    fElem.aClass = fElem.bClass = fElem.cClass = '';

                    var fClass = '';
                    if (fElem.correct === val) {

                        fElem.isOk = true;
                        fClass = 'm3selected m3ok';

                    } else {

                        fElem.isOk = false;
                        fClass = 'm3error';
                    }

                    // ustawienie odpowiedniego stylu w CSS
                    fElem[num + 'Class'] = fClass;
                }

                // pobieramy nowy element jeśli wszyskie zaznaczenia są w porządku
                getNewElement = self.shownBestimmteArtikel.field1.isOk
                    && self.shownBestimmteArtikel.field2.isOk
                    && self.shownBestimmteArtikel.field3.isOk;

                // pokazanie komunikatu o poprawnym wyborze wszystkich elementów
                if (getNewElement) {

                    self.bestimmtePopupVisible = '';
                    $timeout(function () {

                        self.bestimmtePopupVisible = 'invisibleElement';
                    }, 500);
                }
            }

            // wylosowanie klejnego elementu
            if (getNewElement) {

                var nitem = self.getNewBestimmteArtikelItem();

                if (undefined === nitem) {

                    self.shownBestimmteArtikel = null;
                    return;
                }

                //  klasy: m3selected|m3error|m3ok

                self.shownBestimmteArtikel = {
                    fall: nitem.fall,
                    artikel: nitem.artikel,
                    endungen: nitem.endungen,
                    art: nitem.art,
                    adj: nitem.adj,
                    subs: nitem.subs,
                    field1: {
                        ignore: nitem.field1Ignore,
                        correct: nitem.field1,
                        isOk: nitem.field1Ignore,
                        aClass: '',
                        bClass: '',
                        cClass: ''
                    },
                    field2: {
                        ignore: nitem.field2Ignore,
                        correct: nitem.field2,
                        isOk: nitem.field2Ignore,
                        aClass: '',
                        bClass: '',
                        cClass: ''
                    },
                    field3: {
                        ignore: nitem.field3Ignore,
                        correct: nitem.field3,
                        isOk: nitem.field3Ignore,
                        aClass: '',
                        bClass: '',
                        cClass: ''
                    }
                };
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
                self.tapBestimmteArtikel();
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
