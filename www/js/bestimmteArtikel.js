(function(angular, window, undefined) {
    "use strict";

    var dmsBestimmteArtikel = ['$scope', '$timeout', function ($scope, $timeout) {

        var self = this;
        $scope.dmsBestimmteMain = self;

        self.dataBestimmteArtikel = window.DataBestimmteArtikel;
        self.learnBestimmteArtikel = [];

        self.shownBestimmteArtikel = {};

        self.bestimmtePopupVisible = 'invisibleElement';
        self.shownBestimmteArtikel = null;

        self.randomizeNounCase = function (nounModel) {

            var declination = {
                    nominativ: {
                        bestimmte: ['der', 'die', 'das', 'die'],
                        unBestimmte: ['ein', 'eine', 'ein', null]
                    },
                    genitiv: {
                        bestimmte: ['des', 'der', 'des', 'der'],
                        unBestimmte: ['eines', 'einer', 'eines', null]
                    },
                    dativ: {
                        bestimmte: ['dem', 'der', 'dem', 'den'],
                        unBestimmte: ['einem', 'einer', 'einem']
                    },
                    akkusativ: {
                        bestimmte: ['den', 'die', 'das', 'die'],
                        unBestimmte: ['einen', 'eine', 'ein', null]
                    }
                }

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

                    self.randomizeNounCase(esub);

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

        self.getNewBestimmteArtikelItem = function () {

            self.fillLearnBestimmteArtikelData();

            if (0 === self.learnBestimmteArtikel.length)
                return undefined;

            var elIdx = self.learnBestimmteArtikel.length * Math.random();
            elIdx = Math.floor(elIdx);

            var el = self.learnBestimmteArtikel.splice(elIdx, 1);

            return el[0];
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

        self.tapBestimmteArtikel();

    }];

    var app = angular.module('dmsBestimmte', []);

    app.directive('bestimmteArtikel', function () {

        return {
            controller: dmsBestimmteArtikel,
            restrict: 'E',
            scope: {},
            templateUrl: 'bestimmteArtikel.html'
        };
    });

})(angular, window);
