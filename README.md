# 🦉 Mądra Sowa

Aplikacja dla dzieci do nauki szybkiego czytania i ćwiczenia pamięci. Działa w przeglądarce
na telefonie, tablecie i komputerze. Nie wymaga instalacji, konta ani internetu po pierwszym otwarciu.

## Gry

**Czytanie**
- ⚡ **Błysk** – słowo miga na ułamek sekundy, trzeba je rozpoznać jednym spojrzeniem.
- 🧩 **Sylaby** – układanie nazwy obrazka z rozsypanych sylab.
- 📖 **Czytanie na czas** – historyjka słowo po słowie w zadanym tempie, potem pytania o treść.

**Pamięć**
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

Słowa, sylaby i czytanki są w pliku `data.js` – można je tam swobodnie dopisywać.
