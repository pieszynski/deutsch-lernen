deutsch-lernen
==============

Aplikacja do nauki języka niemieckiego

* [W sklepie Google Play](https://play.google.com/store/apps/details?id=com.pieszynski.hybrid.deutchlernen&hl=pl)
* [W sklepie Windows Phone Store](http://www.windowsphone.com/pl-pl/store/app/deutsch-mit-spa%C3%9F-lernen/545acf18-34c1-49ca-981c-508a204695b5)


####Pomocnik
* Aktualizacja aplikacji bez utraty ustawień: ```adb install -r plik.apk```
* Cordova zmienia ```<Identity Name="..."``` w manifeście dla Windows Phone (```package.phone.appxmanifest```) dlatego należy zakomentować w pliku ```deutsch-lernen\platforms\windows\cordova\lib\prepare.js``` linię zawierającą ```pkgName && (identityNode.attrib.Name = pkgName);```.

####ToDo
1) Nowy tryb nauki - końcówki przymiotników przy rodzajniku określonym, nieokreśonym i bez rodzajnika

   * sprawdzanie następuje od razu po kliknięciu - brak dodatkowego przycisku start
   * podmiana rodzajników i końcówek przymiotnika w zależności od przypadku
   * przeniesienie modułu nauki odmiany do innego modułu
   * nietrywialna funkcja losująca odpowiednią formę
