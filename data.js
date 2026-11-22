'use strict';
// Treści do gier. Żeby dodać własne słowa lub czytanki, wystarczy dopisać je tutaj.

const WORDS = {
  // krótkie (3–4 litery)
  1: ['kot', 'dom', 'las', 'lis', 'nos', 'oko', 'ser', 'sok', 'rak', 'mak', 'lok', 'bok', 'rok', 'kos',
    'koc', 'noc', 'moc', 'lew', 'lek', 'lot', 'mama', 'tata', 'lala', 'woda', 'noga', 'ryba', 'kura',
    'koza', 'kosa', 'rosa', 'sowa', 'sofa', 'mapa', 'łapa', 'buda', 'buty', 'nuty', 'okno', 'słoń'],
  // średnie (5–6 liter)
  2: ['domek', 'kotek', 'balon', 'baran', 'banan', 'rower', 'robot', 'ekran', 'ogród', 'zamek', 'zegar',
    'zebra', 'żabka', 'lampa', 'lalka', 'ławka', 'łapka', 'mleko', 'motyl', 'morze', 'pilot', 'piłka',
    'rybka', 'rzeka', 'ręka', 'szafa', 'szkoła', 'słowo', 'słoma', 'trawa', 'kredka', 'kratka', 'kwiat',
    'świat', 'świnka', 'śliwka', 'malina', 'maluch'],
  // długie (7+ liter)
  3: ['samolot', 'samochód', 'parasol', 'papuga', 'pomidor', 'pomarańcza', 'telefon', 'telewizor',
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
  ['🦖', ['di', 'no', 'za', 'ur']], ['🚂', ['lo', 'ko', 'mo', 'ty', 'wa']],
];

// Czytanki: tekst + pytania. Pierwsza odpowiedź jest zawsze poprawna (gra je miesza).
const STORIES = [
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
