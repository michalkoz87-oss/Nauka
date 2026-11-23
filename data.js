'use strict';
// Treści do gier. Żeby dodać własne słowa lub czytanki, wystarczy dopisać je tutaj.

const WORDS = {
  // krótkie (3–4 litery)
  1: ['kot', 'dom', 'las', 'lis', 'nos', 'oko', 'ser', 'sok', 'rak', 'mak', 'lok', 'bok', 'rok', 'kos',
    'koc', 'noc', 'moc', 'lew', 'lek', 'lot', 'mama', 'tata', 'lala', 'woda', 'noga', 'ryba', 'kura',
    'koza', 'kosa', 'rosa', 'sowa', 'sofa', 'mapa', 'łapa', 'buda', 'buty', 'nuty', 'okno', 'słoń', 'ręka'],
  // średnie (5–6 liter)
  2: ['domek', 'kotek', 'balon', 'baran', 'banan', 'rower', 'robot', 'ekran', 'ogród', 'zamek', 'zegar',
    'zebra', 'żabka', 'lampa', 'lalka', 'ławka', 'łapka', 'mleko', 'motyl', 'morze', 'pilot', 'piłka',
    'rybka', 'rzeka', 'papuga', 'szafa', 'szkoła', 'słowo', 'słoma', 'trawa', 'kredka', 'kratka', 'kwiat',
    'świat', 'świnka', 'śliwka', 'malina', 'maluch'],
  // długie (7+ liter)
  3: ['samolot', 'samochód', 'parasol', 'policjant', 'pomidor', 'pomarańcza', 'telefon', 'telewizor',
    'czekolada', 'biedronka', 'księżyc', 'książka', 'komputer', 'kapelusz', 'kanapka', 'truskawka',
    'tornister', 'motylek', 'marchewka', 'dinozaur', 'delfinek', 'krokodyl', 'królewna', 'wiewiórka',
    'wieloryb', 'hulajnoga', 'huśtawka', 'tramwaj', 'rakieta', 'rodzina'],
};

// [obrazek, sylaby]
const SYLLABLES = [
  ['🐱', ['ko', 'tek']], ['🚲', ['ro', 'wer']], ['🐟', ['ry', 'ba']], ['🏠', ['do', 'mek']],
  ['🎈', ['ba', 'lon']], ['🍌', ['ba', 'nan']], ['🦓', ['ze', 'bra']], ['🦉', ['so', 'wa']],
  ['🐐', ['ko', 'za']], ['🌙', ['księ', 'życ']], ['🍉', ['ar', 'buz']], ['🐴', ['ko', 'nik']],
  ['🐶', ['pie', 'sek']], ['🐭', ['mysz', 'ka']], ['🐸', ['żab', 'ka']], ['🌳', ['drze', 'wo']],
  ['⭐', ['gwiaz', 'da']], ['🍐', ['grusz', 'ka']], ['🍎', ['jabł', 'ko']], ['🐧', ['ping', 'win']],
  ['🐝', ['pszczo', 'ła']],
  ['✈️', ['sa', 'mo', 'lot']], ['🍅', ['po', 'mi', 'dor']], ['🦜', ['pa', 'pu', 'ga']],
  ['📱', ['te', 'le', 'fon']], ['🐞', ['bie', 'dron', 'ka']], ['🍓', ['trus', 'kaw', 'ka']],
  ['🥕', ['mar', 'chew', 'ka']], ['🐊', ['kro', 'ko', 'dyl']], ['🦋', ['mo', 'ty', 'lek']],
  ['🐿️', ['wie', 'wiór', 'ka']], ['🐳', ['wie', 'lo', 'ryb']], ['☂️', ['pa', 'ra', 'sol']],
  ['🚗', ['sa', 'mo', 'chód']], ['🥪', ['ka', 'nap', 'ka']], ['🍋', ['cy', 'try', 'na']],
  ['🦒', ['ży', 'ra', 'fa']], ['🚀', ['ra', 'kie', 'ta']], ['🎸', ['gi', 'ta', 'ra']],
  ['🥒', ['o', 'gó', 'rek']], ['🌻', ['sło', 'necz', 'nik']],
  ['🍫', ['cze', 'ko', 'la', 'da']], ['🛴', ['hu', 'laj', 'no', 'ga']], ['📺', ['te', 'le', 'wi', 'zor']],
  ['🦖', ['di', 'no', 'zaur']], ['🚂', ['lo', 'ko', 'mo', 'ty', 'wa']],
  ['🦛', ['hi', 'po', 'po', 'tam']], ['🐛', ['gą', 'sie', 'ni', 'ca']], ['🚁', ['he', 'li', 'kop', 'ter']],
  ['🍊', ['po', 'ma', 'rań', 'cza']], ['🦏', ['no', 'so', 'ro', 'żec']], ['🧑‍🚀', ['as', 'tro', 'nau', 'ta']],
  ['🦄', ['jed', 'no', 'ro', 'żec']], ['🏎️', ['wy', 'ści', 'gów', 'ka']],
  ['🌽', ['ku', 'ku', 'ry', 'dza']], ['🎠', ['ka', 'ru', 'ze', 'la']], ['🍇', ['wi', 'no', 'gro', 'na']],
  ['🥑', ['a', 'wo', 'ka', 'do']], ['🍀', ['ko', 'ni', 'czy', 'na']], ['🍳', ['ja', 'jecz', 'ni', 'ca']],
  ['🐙', ['oś', 'mior', 'ni', 'ca']], ['🏀', ['ko', 'szy', 'ków', 'ka']],
];

// Wyrażenia do gry Błysk. W każdej grupie są podobne do siebie – jedno miga, reszta to zmyłki.
const PHRASES = {
  2: [
    ['zielona żaba', 'zielona trawa', 'zielona ławka', 'zimowa zabawa'],
    ['mały kotek', 'mały domek', 'miły kotek', 'mały kołek'],
    ['szybki pociąg', 'szybki pojazd', 'długi pociąg', 'szybki pościg'],
    ['ciepła zupa', 'ciepła kurtka', 'ciemna zupa', 'ciepła zima'],
    ['stary zamek', 'stary zegar', 'szary zamek', 'stary zakręt'],
    ['biała chmura', 'biała kreda', 'mała chmura', 'biała chata'],
    ['dobry kolega', 'drogi kolega', 'dobry kolarz', 'dobra kolacja'],
    ['wesoły piesek', 'wesoły pajac', 'wąski pasek', 'wesoły spacer'],
    ['krótka bajka', 'krótka bluzka', 'gorzka bajka', 'krótka lekcja'],
    ['nowy zeszyt', 'nowy zegar', 'mały zeszyt', 'nowy zestaw'],
    ['czarny kot', 'czarny koc', 'czarny kos', 'czysty koc'],
    ['słodki sok', 'słodki ser', 'słony ser', 'zimny sok'],
    ['długa droga', 'długa deska', 'druga droga', 'długa noga'],
    ['ciężki plecak', 'ciężki plaster', 'ciemny plecak', 'ciężki placek'],
    ['głośna muzyka', 'głośna mucha', 'główna muzyka', 'głośna mowa'],
    ['pusta szklanka', 'pusta szufla', 'prosta szklanka', 'pusta skrzynka'],
  ],
  3: [
    ['kot pije mleko', 'kot lubi mleko', 'kot pije wodę', 'koń pije mleko'],
    ['pies goni kota', 'pies goni koła', 'pies gryzie kość', 'kot goni psa'],
    ['mama piecze ciasto', 'mama kroi ciasto', 'mama piecze chleb', 'babcia piecze ciasto'],
    ['tata czyta gazetę', 'tata czyta książkę', 'tata kupił gazetę', 'dziadek czyta gazetę'],
    ['ptak śpiewa rano', 'ptak śpiewa ładnie', 'ptak lata rano', 'rak śpiewa rano'],
    ['pada drobny deszcz', 'pada gęsty deszcz', 'pada drobny śnieg', 'spada drobny deszcz'],
    ['Ola rysuje dom', 'Ola rysuje kota', 'Ala rysuje dom', 'Ola maluje dom'],
    ['statek płynie szybko', 'statek płynie daleko', 'stateczek płynie szybko', 'samolot leci szybko'],
    ['babcia robi obiad', 'babcia robi sweter', 'babcia je obiad', 'ciocia robi obiad'],
    ['chłopiec kopie piłkę', 'chłopiec łapie piłkę', 'chłopiec kopie dołek', 'chłopak kopie piłkę'],
    ['zając skacze wysoko', 'zając skacze daleko', 'zając biegnie wysoko', 'żaba skacze wysoko'],
    ['wujek naprawia rower', 'wujek naprawia zegar', 'wujek kupuje rower', 'dziadek naprawia rower'],
    ['dzieci lepią bałwana', 'dzieci lubią bałwana', 'dzieci lepią pierogi', 'dziewczynki lepią bałwana'],
    ['wiatr porwał czapkę', 'wiatr porwał kartkę', 'wiatr zerwał czapkę', 'wilk porwał czapkę'],
    ['koń biegnie łąką', 'koń biegnie drogą', 'koń biega łąką', 'kot biegnie łąką'],
    ['słońce mocno grzeje', 'słońce mocno świeci', 'słonko mocno grzeje', 'słońce słabo grzeje'],
  ],
  4: [
    ['mój kot lubi mleko', 'mój kot pije mleko', 'mój pies lubi mleko', 'twój kot lubi mleko'],
    ['mama ma nowy rower', 'mama ma stary rower', 'tata ma nowy rower', 'mama ma nowy robot'],
    ['pies śpi pod stołem', 'pies śpi pod płotem', 'kot śpi pod stołem', 'pies je pod stołem'],
    ['w lesie rosną grzyby', 'w lesie rosną dęby', 'w lesie rosły grzyby', 'w lecie rosną grzyby'],
    ['Ola idzie do szkoły', 'Ola idzie do sklepu', 'Ala idzie do szkoły', 'Ola jedzie do szkoły'],
    ['na stole leży chleb', 'na stole leży klucz', 'na stole stoi chleb', 'na stołku leży chleb'],
    ['tata kupił dwa bilety', 'tata kupił trzy bilety', 'tata zgubił dwa bilety', 'tata kupił dwa balony'],
    ['ptaki lecą na wschód', 'ptaki lecą na zachód', 'ptaki wracają na wschód', 'raki idą na wschód'],
    ['dziś pada zimny deszcz', 'dziś pada ciepły deszcz', 'dziś pada zimny śnieg', 'dziś padał zimny deszcz'],
    ['kot wszedł na drzewo', 'kot wszedł na krzesło', 'pies wszedł na drzewo', 'kot wskoczył na drzewo'],
    ['mała mysz zjadła ser', 'mała mysz zgubiła ser', 'biała mysz zjadła ser', 'mała mysz zjadła sen'],
    ['brat czyta mi bajkę', 'brat czyta mi książkę', 'brat pisze mi bajkę', 'tata czyta mi bajkę'],
  ],
};

// Czytanki: tekst + pytania. Pierwsza odpowiedź jest zawsze poprawna (gra je miesza).
const STORIES = [
  {
    text: 'Księżyc krąży wokół Ziemi i potrzebuje na jedno okrążenie około dwudziestu siedmiu dni. Nie świeci własnym światłem, tylko odbija światło Słońca. Na Księżycu nie ma powietrza ani wiatru, dlatego ślady astronautów sprzed ponad pięćdziesięciu lat wciąż są tam widoczne. Pierwszy człowiek stanął na Księżycu w tysiąc dziewięćset sześćdziesiątym dziewiątym roku. Nazywał się Neil Armstrong.',
    q: [['Dlaczego Księżyc świeci?', ['bo odbija światło Słońca', 'bo ma własne światło', 'bo płonie na nim ogień']],
      ['Dlaczego ślady astronautów wciąż widać?', ['bo nie ma tam wiatru', 'bo są z betonu', 'bo ktoś je odnawia']],
      ['Kto pierwszy stanął na Księżycu?', ['Neil Armstrong', 'Jurij Gagarin', 'Mikołaj Kopernik']]],
  },
  {
    text: 'Ośmiornica to jedno z najmądrzejszych zwierząt w oceanie. Ma osiem ramion, trzy serca i niebieską krew. Potrafi zmieniać kolor skóry, żeby ukryć się przed wrogiem. Kiedy jest w niebezpieczeństwie, wypuszcza chmurę ciemnego atramentu i szybko ucieka. Ośmiornice umieją nawet odkręcać słoiki, żeby dostać się do jedzenia.',
    q: [['Ile serc ma ośmiornica?', ['trzy', 'jedno', 'osiem']],
      ['Jakiego koloru jest jej krew?', ['niebieska', 'czerwona', 'zielona']],
      ['Co robi w niebezpieczeństwie?', ['wypuszcza atrament', 'udaje martwą', 'zakopuje się w piasku']]],
  },
  {
    text: 'Maja znalazła na strychu starą mapę. Czerwony krzyżyk był narysowany obok dębu w ogrodzie dziadka. Razem z bratem Antkiem wzięli łopatę i zaczęli kopać. Po godzinie łopata uderzyła w coś twardego. Była to metalowa skrzynka, a w niej stare monety, zdjęcie i list. List napisał ich dziadek, kiedy sam miał dziesięć lat.',
    q: [['Gdzie Maja znalazła mapę?', ['na strychu', 'w piwnicy', 'w bibliotece']],
      ['Obok jakiego drzewa był krzyżyk?', ['obok dębu', 'obok jabłoni', 'obok brzozy']],
      ['Kto napisał list ze skrzynki?', ['dziadek', 'pirat', 'sąsiad']]],
  },
  {
    text: 'Mrówki żyją w wielkich rodzinach, które nazywamy koloniami. Każda mrówka ma swoje zadanie: jedne opiekują się jajami, inne szukają jedzenia, a jeszcze inne bronią mrowiska. Mrówka potrafi unieść ciężar wiele razy większy niż jej własna waga. Drogę do domu znajduje dzięki zapachowym śladom, które zostawiają jej siostry.',
    q: [['Jak nazywa się rodzina mrówek?', ['kolonia', 'stado', 'ławica']],
      ['Jak mrówki znajdują drogę do domu?', ['po zapachowych śladach', 'patrząc na gwiazdy', 'licząc kroki']],
      ['Ile potrafi unieść mrówka?', ['wiele razy więcej, niż sama waży', 'tyle, ile sama waży', 'prawie nic']]],
  },
  {
    text: 'W czwartek klasa trzecia pojechała na wycieczkę do Krakowa. Najpierw dzieci zwiedziły zamek na Wawelu, a potem zeszły do Smoczej Jamy. Franek trochę się bał, bo w jaskini było ciemno i zimno. Przed jaskinią stał smok z metalu, który co kilka minut zionął prawdziwym ogniem. Na koniec wszyscy zjedli obwarzanki na rynku.',
    q: [['Kiedy klasa pojechała na wycieczkę?', ['w czwartek', 'w poniedziałek', 'w sobotę']],
      ['Dlaczego Franek się bał?', ['bo w jaskini było ciemno i zimno', 'bo zgubił swoją grupę', 'bo smok głośno ryczał']],
      ['Co dzieci zjadły na rynku?', ['obwarzanki', 'lody', 'pierogi']]],
  },
  {
    text: 'Serce to mięsień wielkości zaciśniętej pięści. Pracuje bez przerwy przez całe życie i pompuje krew do każdej części ciała. U dziecka uderza około dziewięćdziesięciu razy na minutę, a podczas biegu jeszcze szybciej. Krew niesie tlen i składniki odżywcze. Żeby serce było silne, potrzebuje ruchu, snu i zdrowego jedzenia.',
    q: [['Jakiej wielkości jest serce?', ['jak pięść', 'jak głowa', 'jak orzech']],
      ['Ile razy na minutę uderza serce dziecka?', ['około dziewięćdziesięciu', 'około dwudziestu', 'około trzystu']],
      ['Co niesie krew?', ['tlen i składniki odżywcze', 'tylko wodę', 'powietrze i światło']]],
  },
  {
    text: 'Kapitan Borys płynął swoim statkiem przez trzy dni i trzy noce. Czwartego dnia zerwał się sztorm i fale zalały pokład. Załoga chciała zawrócić, ale papuga Kleks zauważyła w oddali światło latarni morskiej. Dzięki niej statek bezpiecznie dopłynął do portu. W nagrodę Kleks dostała cały worek orzechów.',
    q: [['Kiedy zerwał się sztorm?', ['czwartego dnia', 'pierwszego dnia', 'siódmego dnia']],
      ['Kto zauważył światło latarni?', ['papuga Kleks', 'kapitan Borys', 'kucharz']],
      ['Co Kleks dostała w nagrodę?', ['worek orzechów', 'złotą monetę', 'nową klatkę']]],
  },
  {
    text: 'Drzewa są najdłużej żyjącymi roślinami na Ziemi. Niektóre dęby rosną ponad tysiąc lat. Wiek ściętego drzewa można policzyć po słojach, czyli kręgach widocznych na pniu: jeden słój to jeden rok. Drzewa wytwarzają tlen, którym oddychamy, i dają schronienie ptakom, owadom i wiewiórkom. Jesienią liście zmieniają kolor, bo drzewo przygotowuje się do zimy.',
    q: [['Jak policzyć wiek ściętego drzewa?', ['po słojach na pniu', 'po liczbie gałęzi', 'po wysokości']],
      ['Co wytwarzają drzewa?', ['tlen', 'deszcz', 'wiatr']],
      ['Ile lat mogą rosnąć niektóre dęby?', ['ponad tysiąc', 'najwyżej sto', 'około dziesięciu']]],
  },
  {
    text: 'Ola ma małego kota. Kot nazywa się Puszek. Puszek jest szary i ma białe łapki. Codziennie rano pije mleko z niebieskiej miski. Potem śpi na ciepłym parapecie.',
    q: [['Jak nazywa się kot?', ['Puszek', 'Mruczek', 'Filemon']],
      ['Jakiego koloru jest miska?', ['niebieska', 'czerwona', 'żółta']]],
  },
  {
    text: 'Tomek dostał na urodziny czerwony rower. W sobotę pojechał z tatą do parku. Jechali wzdłuż rzeki i widzieli trzy kaczki. Na koniec zjedli lody truskawkowe.',
    q: [['Co Tomek dostał na urodziny?', ['rower', 'hulajnogę', 'piłkę']],
      ['Ile kaczek widzieli?', ['trzy', 'dwie', 'pięć']]],
  },
  {
    text: 'W lesie mieszka ruda wiewiórka. Jesienią zbiera orzechy i chowa je w dziupli. Zimą, kiedy pada śnieg, ma co jeść. Jej najlepszym przyjacielem jest mały jeż.',
    q: [['Gdzie wiewiórka chowa orzechy?', ['w dziupli', 'pod kamieniem', 'w gnieździe']],
      ['Kto jest przyjacielem wiewiórki?', ['jeż', 'zając', 'lis']]],
  },
  {
    text: 'Zosia i babcia piekły ciasto. Zosia wsypała mąkę, a babcia dodała cztery jajka. Ciasto piekło się godzinę. Było z jabłkami i pachniało cynamonem. Dziadek zjadł aż dwa kawałki.',
    q: [['Ile jajek dodała babcia?', ['cztery', 'dwa', 'sześć']],
      ['Z czym było ciasto?', ['z jabłkami', 'ze śliwkami', 'z truskawkami']]],
  },
  {
    text: 'Mały robot Bip mieszkał w starej szopie. Umiał naprawiać zegary i gotować zupę. Pewnego dnia zgubił zieloną śrubkę. Szukał jej cały dzień, a znalazł ją pod łóżkiem psa.',
    q: [['Co zgubił robot?', ['zieloną śrubkę', 'czerwony guzik', 'złoty klucz']],
      ['Gdzie znalazł zgubę?', ['pod łóżkiem psa', 'w zegarze', 'w garnku z zupą']]],
  },
  {
    text: 'Latem Kuba pojechał nad morze. Rano budował zamek z piasku, a po południu szukał muszelek. Znalazł ich siedem. Największą dał swojej siostrze Hani. Wieczorem oglądali zachód słońca.',
    q: [['Ile muszelek znalazł Kuba?', ['siedem', 'pięć', 'dziesięć']],
      ['Komu dał największą muszelkę?', ['siostrze Hani', 'mamie', 'koledze']]],
  },
  {
    text: 'Pszczoły mieszkają w ulu. Latają od kwiatka do kwiatka i zbierają nektar. Z nektaru robią miód. W jednym ulu mieszka jedna królowa i tysiące robotnic. Zimą pszczoły grzeją się nawzajem.',
    q: [['Z czego pszczoły robią miód?', ['z nektaru', 'z wody', 'z liści']],
      ['Ile królowych mieszka w ulu?', ['jedna', 'dwie', 'sto']]],
  },
  {
    text: 'Smok Feliks nie umiał ziać ogniem. Zamiast ognia z jego paszczy leciały bańki mydlane. Inne smoki się śmiały, ale dzieci z wioski go uwielbiały. W każdą niedzielę Feliks urządzał dla nich pokaz baniek.',
    q: [['Co leciało z paszczy smoka?', ['bańki mydlane', 'ogień', 'woda']],
      ['Kiedy Feliks urządzał pokaz?', ['w niedzielę', 'w sobotę', 'w piątek']]],
  },
];

const EMOJI = ['🐶', '🐱', '🐭', '🐰', '🦊', '🐻', '🐼', '🐸', '🐵', '🐔', '🐧', '🦉', '🦋', '🐢', '🐙', '🐳',
  '🍎', '🍌', '🍓', '🍒', '🍉', '🥕', '🍕', '🍩', '⚽', '🚗', '🚀', '🎈', '🌈', '⭐', '🌻', '🎸'];
