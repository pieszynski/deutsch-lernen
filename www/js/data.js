var TestData = [
    {pl: 'decydować się na coś / rozmyślić się', de: 'entschließen(sich) > entschloss sich > hat sich entschlossen'},
    {pl: 'naradzać / komentować / omawiać', de: 'besprechen > besprach > hat besprochen'}
];

var Data1of3 = [
    {pl: 'burzyć / niszczyć / zrywać / odrywać', de: 'abreißen > riss ab > hat abgerissen'},
    {pl: 'przypiekać', de: 'anbraten > briet an > hat angebraten'},
    {pl: 'zaczynać', de: 'anfangen > fing an > hat angefangen'},
    {pl: 'postanowić / zakończyć / decydować / uchwalać', de: 'beschließen > beschloss > hat beschlossen'},
    {pl: 'naradzać / komentować / omawiać', de: 'besprechen > besprach > hat besprochen'},
    {pl: 'zdać / przetrwać / istnieć', de: 'bestehen > bestand > hat bestanden'},
    {pl: 'wynosić / zachowywać się', de: 'betragen > betrug > hat betragen'},
    {pl: 'piec', de: 'backen > backte/buk > hat gebacken'},
    {pl: 'zaczynać', de: 'beginnen > begann > hat begonnen'},
    {pl: 'otrzymać / nabyć / dostać', de: 'bekommen > bekam > hat bekommen'},
    {pl: 'wymieniać / nadawać nazwę', de: 'benennen > benannte > hat bennant'},
    {pl: 'doradzać / omawiać', de: 'beraten > beriet > hat beraten'},
    {pl: 'opisywać / zapisywać / kreślić', de: 'beschreiben > beschrieb > hat beschrieben'},
    {pl: 'ubiegać / starać się o', de: 'bewerben(sich) > bewarb sich > hat sich beworben'},
    {pl: 'oferować / dawać', de: 'bieten > bot > hat geboten'},
    {pl: 'prosić', de: 'bitten > bat > hat gebeten'},
    {pl: 'zostawać / pozostawać', de: 'bleiben > blieb > ist geblieben'},
    {pl: 'łamać / skręcać', de: 'brechen > brach > hat gebrochen'},
    {pl: 'płonąć', de: 'brennen > brannte > hat gebrannt'},
    {pl: 'przynosić / serwować / odnosić', de: 'bringen > brachte > hat gebracht'},
    {pl: 'myśleć / sądzić / uważać', de: 'denken > dachte > hat gedacht'},
    {pl: 'móc coś zrobić', de: 'dürfen > durfte > hat gedurft'},
    {pl: 'zapraszać / ładować / nakładać', de: 'einladen > lud ein > hat eingeladen'},
    {pl: 'czuć / odczuwać', de: 'empfinden > empfand > hat empfunden'},
    {pl: 'wyjaśnić / decydować / wygrać', de: 'entscheiden > entschied > hat entschieden'},
    {pl: 'decydować się na coś / rozmyślić się', de: 'entschließen(sich) > entschloss sich > hat sich entschlossen'},
    {pl: 'powstawać / wybuchać / rozgorzeć', de: 'entstehen > entstand > ist entstanden'},
    {pl: 'rozróżniać / rozpoznawać', de: 'erkennen > erkannte > hat erkannt'},
    {pl: 'ukazywać / pojawiać', de: 'erscheinen > erschien > ist erschienen'},
    {pl: 'wychowywać / uczyć', de: 'erziehen > erzog > hat erzogen'},
    {pl: 'jeść', de: 'essen > aß > hat gegessen'},
    {pl: 'jechać', de: 'fahren > fur > ist gefahren'},
    {pl: 'spaść / padać / oblać (egzamin)', de: 'fallen > fiel > ist gefallen'},
    {pl: 'oglądać telewizję', de: 'fernsehen > sah fern > hat ferngesehen'},
    {pl: 'znaleźć / odnaleźć', de: 'finden > fand > hat gefunden'},
    {pl: 'lecieć / frunąć', de: 'fliegen > flog > ist geflogen'},
    {pl: 'płynąć / ciec', de: 'fließen > floss > ist geflossen'},
    {pl: 'dawać', de: 'geben > gab > hat gegeben'},
    {pl: 'podobać się', de: 'gefallen > gefiel > hat gefallen'},
    {pl: 'iść / chodzić / wyruszać', de: 'gehen > ging > ist gegangen'},
    {pl: 'rozkoszować się / delektować / otrzymać', de: 'genießen > genoss > hat genossen'},
    {pl: 'wygrywać', de: 'gewinnen > gewann > hat gewonnen'},
    {pl: 'podlewać / wylewać', de: 'gießen > goss > hat gegossen'}
];

var Data = [
    {pl: 'trzymać / zatrzymywać', de: 'halten > hielt > hat gehalten'},
    {pl: 'wisieć / zwisać', de: 'hängen > hing > hat gehangen'},
    {pl: 'podnosić / unosić / wydobywać', de: 'heben > hob > hat gehoben'},
    {pl: 'nazywać się / znaczyć / brzmieć', de: 'heißen > hieß > hat geheißen'},
    {pl: 'pomagać / przydawać się komuś', de: 'helfen > half > hat geholfen'},
    {pl: 'znać / poznawać', de: 'kennen > kannte > hat gekannt'},
    {pl: 'dzwonić / rozbrzmiewać', de: 'klingen > klang > hat geklungen'},
    {pl: 'przychodzić / podchodzić', de: 'kommen > kam > ist gekommen'},
    {pl: 'móc coś uczynić', de: 'können > konnte > hat gekonnt'},
    {pl: 'pozwalać / dopuszczać / zostawić / zaprzestawać czegoś', de: 'lassen > ließ > hat gelassen'},
    {pl: 'biec / pracować (o silniku) / chodzić (o zegarze)', de: 'laufen > lief > ist gelaufen'},
    {pl: 'cierpieć / chorować', de: 'leiden > litt > hat gelitten'},
    {pl: 'być przykro', de: 'leidtun > es tat ihr leid > hat ihr leidgetan'},
    {pl: 'czytać', de: 'lesen > las > hat gelesen'},
    {pl: 'leżeć / spoczywać', de: 'liegen > lag > hat gelegen'},
    {pl: 'wybiegać / zaczynać biec', de: 'losrennen > rannte los > ist losgerannt'},
    {pl: 'kłamać / podglądać / wyjrzeć', de: 'lügen > log > hat gelogen'},
    {pl: 'lubić / woleć / życzyć sobie', de: 'mögen > mochte > hat gemocht'},
    {pl: 'musieć', de: 'müssen > musste > hat gemusst'},
    {pl: 'brać / wziąć / pozbawić kogoś czegoś', de: 'nehmen > nahm > hat genommen'},
    {pl: 'nazywać / polecać', de: 'nennen > nannte > hat genannt'},
    {pl: 'gwizdać', de: 'pfeifen > pfiff > hat gepfiffen'},
    {pl: 'radzić / zgadywać / doradzać', de: 'raten > riet > hat geraten'},
    {pl: 'jeździć konno', de: 'reiten > ritt > ist geritten'},
    {pl: 'czuć / pachnieć / wąchać', de: 'riechen > roch > hat gerochen'},
    {pl: 'dzwonić / wykrzykiwać', de: 'rufen > rief > hat gerufen'},
    {pl: 'spać / nocować', de: 'schlafen > schlief > hat geschlafen'},
    {pl: 'zamykać / kończyć', de: 'schließen > schloss > hat geschlossen'},
    {pl: 'świecić / zdawać się', de: 'scheinen > schien > hat geschienen'},
    {pl: 'prowadzić / pchać / przesuwać', de: 'schieben > schob > hat geschoben'},
    {pl: 'strzelać / wystrzelić', de: 'schießen > schoss > hat geschossen'},
    {pl: 'topić / topnieć', de: 'schmelzen > schmolz > ist geschmolzen'},
    {pl: 'ciąć / kroić', de: 'schneiden > schnitt > hat geschnitten'},
    {pl: 'pisać / zapisać', de: 'schreiben > schrieb > hat geschrieben'},
    {pl: 'krzyczeć / wrzeszczeć', de: 'schreien > schrie > hat geschrien'},
    {pl: 'milczeć', de: 'schweigen > schwieg > hat geschwiegen'},
    {pl: 'pływać', de: 'schwimmen > schwamm > ist geschwommen'},
    {pl: 'widzieć / oglądać', de: 'sehen > sah > gat gesehen'},
    {pl: 'być', de: 'sein > war > ist gewesen'},
    {pl: 'śpiewać', de: 'singen > sang > hat gesungen'},
    {pl: 'tonąć / opadać', de: 'sinken > sank > ist gesunken'},
    {pl: 'siedzieć', de: 'sitzen > saß > hat gesessen'},
    {pl: 'prząść / bajdurzyć / ściemniać', de: 'spinnen > spann > hat gesponnen'},
    {pl: 'rozmawiać', de: 'sprechen > sprach > hat gesprochen'},
    {pl: 'skakać / przeskakiwać', de: 'springen > sprang > ist gesprungen'},
    {pl: 'stać', de: 'stehen > stand > hat gestanden'},
    {pl: 'kraść / wymigiwać się od', de: 'stehlen > stahl > hat gestohlen'},
    {pl: 'wchodzić / wspinać się / wsiadać', de: 'steigen > stieg > ist gestiegen'},
    {pl: 'umierać', de: 'sterben > starb > ist gestorben'},
    {pl: 'malować / smarować (bułkę)', de: 'streichen > strich > hat gestrichen'},
    {pl: 'sprzeczać / kłucić się', de: 'streiten > stritt > hat gestritten'},
    {pl: 'nosić / dźwigać', de: 'tragen > trug > hat getragen'}
];
