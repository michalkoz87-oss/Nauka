# 🦉 Mądra Sowa

Aplikacja dla dzieci w wieku szkolnym (ok. 7–11 lat), które już czytają: trening szybkiego czytania
i zapamiętywania. Każde dziecko ma własny profil z gwiazdkami i poziomami. Działa w przeglądarce
na telefonie, tablecie i komputerze. Nie wymaga instalacji, konta ani internetu po pierwszym otwarciu.

## Gry

**Czytanie**
- ⚡ **Błysk** – słowo (a na wyższych poziomach całe wyrażenie) miga na ułamek sekundy.
- 🧩 **Sylaby** – układanie długich słów z rozsypanych sylab wśród zmyłek.
- 📖 **Czytanie na czas** – tekst słowo po słowie w tempie 90–300 słów na minutę, potem pytania o treść.
- 🎯 **Tablica liczb** – szukanie liczb po kolei na czas; poszerza pole widzenia.

**Pamięć**
- 📝 **Lista słów** – zapamiętywanie listy słów i rozpoznawanie ich wśród innych.
- 🃏 **Pary** – szukanie par obrazków.
- 🔢 **Kolejność** – powtarzanie coraz dłuższych ciągów obrazków.
- 🙈 **Co zniknęło?** – który obrazek zniknął?
- 🔟 **Liczby** – zapamiętywanie coraz dłuższych liczb.

Każda gra ma 6 poziomów. Poziom rośnie sam po dobrym wyniku i spada, gdy jest za trudno;
można go też ustawić ręcznie przed startem. Gwiazdki i poziomy zapisują się na urządzeniu.

## Uruchomienie

Wystarczy otworzyć `index.html` w przeglądarce albo uruchomić prosty serwer:

```
python3 -m http.server 8000
```

i wejść na `http://localhost:8000`.

## Własne treści

Słowa, wyrażenia, sylaby i czytanki są w pliku `data.js` – można je tam swobodnie dopisywać.
