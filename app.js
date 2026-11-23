'use strict';

/* ---------- pomocnicze ---------- */
const app = document.getElementById('app');
const MAX_LEVEL = 10;
const CANCEL = Symbol('cancel');

function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  for (const k in props || {}) {
    const v = props[k];
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) e.setAttribute(k, v);
  }
  e.append(...kids.flat().filter((x) => x != null && x !== false));
  return e;
}
const rand = (n) => Math.floor(Math.random() * n);
function shuffle(a) {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const sample = (a, n) => shuffle(a).slice(0, n);

/* ---------- zapis postępów ---------- */
const STORE = 'madra-sowa-v2';
const state = (() => {
  const base = { mute: false, players: [], active: -1 };
  try {
    return Object.assign(base, JSON.parse(localStorage.getItem(STORE)) || {});
  } catch {
    return base;
  }
})();
function save() {
  try {
    localStorage.setItem(STORE, JSON.stringify(state));
  } catch { /* np. tryb prywatny – gra działa dalej bez zapisu */ }
}
const me = () => state.players[state.active];
const gs = (id) => (me().games[id] ??= { level: 1, plays: 0, best: 0 });

/* ---------- dźwięki ---------- */
let ac;
function tone(freqs, dur = 0.13) {
  if (state.mute) return;
  try {
    ac ??= new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state !== 'running') ac.resume().catch(() => {});
    let t = ac.currentTime;
    for (const f of freqs) {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + dur);
      t += dur * 0.9;
    }
  } catch { /* brak dźwięku nie przeszkadza w grze */ }
}

// iOS odtwarza dźwięk dopiero po „odblokowaniu” go dotknięciem ekranu
addEventListener('pointerdown', () => {
  if (ac && ac.state !== 'running') ac.resume().catch(() => {});
}, { passive: true });

/* ---------- gry ---------- */

// Błysk: słowo pojawia się na chwilę, potem trzeba je wskazać.
async function flashWords(ctx) {
  const tier = [2, 3, 3, 4, 5, 5, 5, 6, 6, 6][ctx.level - 1];
  const time = [600, 500, 250, 500, 600, 350, 250, 600, 400, 280][ctx.level - 1];
  // od poziomu 4: całe wyrażenia (2, 3, a od poziomu 8 – 4 słowa) – ćwiczą obejmowanie wzrokiem kilku słów naraz
  const groups = tier >= 4 ? sample(PHRASES[tier - 2], 8) : null;
  const pool = WORDS[tier] || [];
  const targets = groups ? groups.map((g) => g[rand(g.length)]) : sample(pool, 8);
  let score = 0;
  for (let i = 0; i < targets.length; i++) {
    ctx.progress(i, targets.length);
    const word = targets[i];
    const box = h('div', { class: groups ? 'flash phrase' : 'flash' }, '+');
    ctx.stage.replaceChildren(h('p', { class: 'hint' }, 'Patrz uważnie…'), box);
    await ctx.sleep(700);
    box.textContent = word;
    await ctx.sleep(time);
    box.textContent = '✱✱✱✱✱';
    await ctx.sleep(200);
    if (groups) {
      ctx.stage.replaceChildren(h('p', { class: 'hint' }, 'Co tam było napisane?'));
      if (await ctx.ask(shuffle(groups[i]), word, 'answers')) score++;
      continue;
    }
    const sim = (w) => (w[0] === word[0] ? 2 : 0) + (w[w.length - 1] === word[word.length - 1] ? 1 : 0) - Math.abs(w.length - word.length);
    const near = pool.filter((w) => w !== word).sort((a, b) => sim(b) - sim(a)).slice(0, 6);
    ctx.stage.replaceChildren(h('p', { class: 'hint' }, 'Jakie to było słowo?'));
    if (await ctx.ask(shuffle([word, ...sample(near, 3)]), word, 'words')) score++;
  }
  return { ratio: score / targets.length, text: `Dobre odpowiedzi: ${score} z ${targets.length}` };
}

// Sylaby: ułóż słowo z rozsypanych sylab.
async function syllables(ctx) {
  const L = ctx.level;
  const lens = [[2, 3], [2, 3], [3, 4], [3, 4], [4, 5], [4, 5]][L - 1] || [4, 5];
  const extra = [1, 3, 1, 3, 5, 5, 6, 6, 7, 7][L - 1];
  const hideAfter = [0, 0, 0, 0, 0, 1500, 1500, 1000, 1000, 600][L - 1];
  const items = sample(SYLLABLES.filter((s) => lens.includes(s[1].length)), 6);
  const allSyl = [...new Set(SYLLABLES.flatMap((s) => s[1]))];
  let score = 0;
  for (let i = 0; i < items.length; i++) {
    ctx.progress(i, items.length);
    const [pic, syl] = items[i];
    const decoys = sample(allSyl.filter((s) => !syl.includes(s)), extra);
    const slots = h('div', { class: 'slots' }, syl.map(() => h('span', { class: 'slot' })));
    const tiles = h('div', { class: 'options syl' });
    const picture = h('div', { class: 'pic' }, pic);
    ctx.stage.replaceChildren(picture, slots, tiles);
    // na wyższych poziomach obrazek znika coraz szybciej – trzeba go zapamiętać
    if (hideAfter) setTimeout(() => (picture.style.visibility = 'hidden'), hideAfter);
    let pos = 0;
    let clean = true;
    await new Promise((done) => {
      for (const s of shuffle([...syl, ...decoys])) {
        const b = h('button', { class: 'opt' }, s);
        b.addEventListener('click', () => {
          if (s === syl[pos]) {
            slots.children[pos].textContent = s;
            slots.children[pos].classList.add('filled');
            b.disabled = true;
            b.classList.add('used');
            tone([520 + pos * 80]);
            if (++pos === syl.length) done();
          } else {
            clean = false;
            tone([200]);
            b.classList.remove('shake');
            void b.offsetWidth;
            b.classList.add('shake');
          }
        });
        tiles.append(b);
      }
    });
    if (clean) score++;
    await ctx.feedback(clean);
  }
  return { ratio: score / items.length, text: `Bez pomyłki: ${score} z ${items.length}` };
}

// Czytanie na czas: tekst słowo po słowie, potem pytania.
async function speedRead(ctx) {
  const wpm = [90, 120, 150, 190, 240, 300, 350, 400, 450, 500][ctx.level - 1];
  // jedna krótsza i jedna dłuższa czytanka: zawsze 5 pytań, więc jedna pomyłka nie blokuje awansu
  const stories = shuffle([2, 3].map((k) => sample(STORIES.filter((st) => st.q.length === k), 1)[0]));
  let score = 0;
  let total = 0;
  let step = 0;
  const steps = stories.reduce((n, st) => n + 1 + st.q.length, 0);
  for (const story of stories) {
    ctx.progress(step++, steps);
    await new Promise((go) => {
      ctx.stage.replaceChildren(
        h('p', { class: 'hint' }, `Słowa będą się pojawiać jedno po drugim (${wpm} słów na minutę). Czytaj uważnie – potem będą pytania!`),
        h('button', { class: 'big', onclick: go }, '▶ Czytam!')
      );
    });
    const box = h('div', { class: 'flash read' }, '');
    const bar = h('div', { class: 'readbar' }, h('i'));
    ctx.stage.replaceChildren(box, bar);
    await ctx.sleep(600);
    const words = story.text.split(' ');
    // dłuższe pauzy po przecinkach i kropkach są wliczone w tempo, żeby zgadzało się z podanym
    const weight = (w) => (/[.!?]$/.test(w) ? 1.8 : /,$/.test(w) ? 1.3 : 1);
    const base = (60000 / wpm) * (words.length / words.reduce((sum, w) => sum + weight(w), 0));
    for (let i = 0; i < words.length; i++) {
      box.textContent = words[i];
      bar.firstChild.style.width = `${((i + 1) / words.length) * 100}%`;
      await ctx.sleep(base * weight(words[i]));
    }
    for (const [question, answers] of story.q) {
      ctx.progress(step++, steps);
      ctx.stage.replaceChildren(h('p', { class: 'question' }, question));
      if (await ctx.ask(shuffle(answers), answers[0], 'answers')) score++;
      total++;
    }
  }
  return { ratio: score / total, text: `Dobre odpowiedzi: ${score} z ${total} przy ${wpm} słowach na minutę` };
}

// Pary: klasyczne szukanie par obrazków.
async function pairs(ctx) {
  const n = [6, 8, 10, 12, 15, 18, 20, 21, 24, 28][ctx.level - 1];
  const cards = shuffle(sample(EMOJI, n).flatMap((e) => [e, e]));
  // na szerokim ekranie więcej kolumn, na wysokim – więcej rzędów, żeby plansza mieściła się bez przewijania
  const N = cards.length;
  const wide = innerWidth > innerHeight;
  const cols = N <= 16 ? 4 : N <= 20 ? 5 : N <= 36 ? 6 : wide ? (N <= 42 ? 7 : 8) : (N === 40 ? 5 : N <= 48 ? 6 : 7);
  const grid = h('div', { class: 'grid', style: `--cols:${cols}` });
  const info = h('p', { class: 'hint' }, 'Znajdź wszystkie pary!');
  ctx.stage.replaceChildren(info, grid);
  let open = [];
  let found = 0;
  let moves = 0;
  let lock = false;
  await new Promise((done) => {
    cards.forEach((emoji) => {
      const c = h('button', { class: 'card', 'aria-label': 'karta' }, h('span', null, emoji));
      c.addEventListener('click', async () => {
        if (lock || c.classList.contains('open')) return;
        c.classList.add('open');
        open.push({ c, emoji });
        if (open.length < 2) return;
        moves++;
        const [a, b] = open;
        open = [];
        if (a.emoji === b.emoji) {
          a.c.classList.add('done');
          b.c.classList.add('done');
          tone([660, 880]);
          ctx.progress(++found, n);
          if (found === n) done();
        } else {
          lock = true;
          try {
            await ctx.sleep(800);
          } catch {
            return;
          }
          a.c.classList.remove('open');
          b.c.classList.remove('open');
          lock = false;
        }
        info.textContent = `Ruchy: ${moves}`;
      });
      grid.append(c);
    });
  });
  await ctx.sleep(500);
  const ratio = moves <= n * 2 ? 1 : moves <= n * 3 ? 0.7 : moves <= n * 4 ? 0.45 : 0.3;
  return { ratio, text: `Wszystkie pary w ${moves} ruchach` };
}

// Kolejność: zapamiętaj ciąg obrazków i odtwórz go.
async function sequence(ctx) {
  const len = [4, 5, 6, 7, 8, 9, 9, 10, 10, 11][ctx.level - 1];
  const speed = [900, 900, 900, 700, 700, 700, 550, 550, 450, 450][ctx.level - 1];
  const rounds = 5;
  let score = 0;
  for (let r = 0; r < rounds; r++) {
    ctx.progress(r, rounds);
    const palette = sample(EMOJI, ctx.level <= 3 ? 6 : ctx.level <= 6 ? 9 : 12);
    const seq = Array.from({ length: len }, () => palette[rand(palette.length)]);
    const box = h('div', { class: 'flash emoji' }, '');
    ctx.stage.replaceChildren(h('p', { class: 'hint' }, 'Zapamiętaj kolejność!'), box);
    await ctx.sleep(600);
    for (const e of seq) {
      box.textContent = e;
      tone([500]);
      await ctx.sleep(speed);
      box.textContent = '';
      await ctx.sleep(180);
    }
    const slots = h('div', { class: 'slots' }, seq.map(() => h('span', { class: 'slot' })));
    const tiles = h('div', { class: 'options emo' });
    ctx.stage.replaceChildren(h('p', { class: 'hint' }, 'Teraz Ty – po kolei!'), slots, tiles);
    let pos = 0;
    const ok = await new Promise((done) => {
      for (const e of palette) {
        tiles.append(h('button', {
          class: 'opt',
          onclick: () => {
            slots.children[pos].textContent = e;
            slots.children[pos].classList.add('filled');
            if (e !== seq[pos]) {
              slots.children[pos].classList.add('wrong');
              return done(false);
            }
            tone([520 + pos * 60]);
            if (++pos === seq.length) done(true);
          },
        }, e));
      }
    });
    tiles.querySelectorAll('button').forEach((b) => (b.disabled = true));
    if (ok) score++;
    else tiles.replaceWith(h('p', { class: 'hint' }, 'Było tak: ' + seq.join(' ')));
    await ctx.feedback(ok);
    if (!ok) await ctx.sleep(1400);
  }
  return { ratio: score / rounds, text: `Zapamiętane ciągi (długość: ${len}): ${score} z ${rounds}` };
}

// Co zniknęło: jeden z obrazków znika.
async function missing(ctx) {
  const n = [4, 5, 6, 7, 8, 9, 10, 11, 12, 12][ctx.level - 1];
  const perItem = [600, 600, 600, 600, 600, 600, 500, 450, 400, 350][ctx.level - 1];
  const rounds = 6;
  let score = 0;
  for (let r = 0; r < rounds; r++) {
    ctx.progress(r, rounds);
    const items = sample(EMOJI, n);
    const gone = items[rand(n)];
    const row = h('div', { class: 'row' }, items.map((e) => h('span', null, e)));
    ctx.stage.replaceChildren(h('p', { class: 'hint' }, 'Zapamiętaj wszystkie obrazki!'), row);
    await ctx.sleep(1500 + n * perItem);
    row.replaceChildren(h('span', null, '🙈'));
    await ctx.sleep(800);
    const rest = items.filter((e) => e !== gone);
    row.replaceChildren(...(ctx.level >= 4 ? shuffle(rest) : rest).map((e) => h('span', null, e)));
    ctx.stage.firstChild.textContent = 'Co zniknęło?';
    // podpowiedzi: brakujący obrazek + takie, których w ogóle nie było
    const fakes = sample(EMOJI.filter((e) => !items.includes(e)), 3);
    if (await ctx.ask(shuffle([gone, ...fakes]), gone, 'emo')) score++;
  }
  return { ratio: score / rounds, text: `Dobre odpowiedzi: ${score} z ${rounds}` };
}

// Liczby: zapamiętaj liczbę i wpisz ją.
async function numbers(ctx) {
  const len = [4, 5, 6, 7, 8, 9, 10, 11, 12, 12][ctx.level - 1];
  const perDigit = [500, 500, 500, 500, 500, 500, 500, 500, 500, 350][ctx.level - 1];
  const rounds = 5;
  let score = 0;
  for (let r = 0; r < rounds; r++) {
    ctx.progress(r, rounds);
    let num = String(1 + rand(9));
    while (num.length < len) num += rand(10);
    const box = h('div', { class: len > 9 ? 'flash digits long' : 'flash digits' }, num);
    ctx.stage.replaceChildren(h('p', { class: 'hint' }, 'Zapamiętaj liczbę!'), box);
    await ctx.sleep(1000 + len * perDigit);
    box.textContent = '';
    ctx.stage.firstChild.textContent = 'Wpisz liczbę';
    const pad = h('div', { class: 'pad' });
    ctx.stage.append(pad);
    box.classList.add('typing');
    let typed = '';
    let timer;
    await new Promise((done) => {
      const press = (k) => {
        if (k === '⌫') typed = typed.slice(0, -1);
        else if (typed.length < len) typed += k;
        box.textContent = typed;
        // chwila na poprawienie ostatniej cyfry, zanim odpowiedź zostanie sprawdzona
        clearTimeout(timer);
        if (typed.length === len) timer = setTimeout(done, 600);
      };
      // na komputerze można pisać z klawiatury
      const onKey = (e) => {
        if (!pad.isConnected) return document.removeEventListener('keydown', onKey);
        if (/^[0-9]$/.test(e.key)) press(e.key);
        else if (e.key === 'Backspace') {
          e.preventDefault();
          press('⌫');
        }
      };
      document.addEventListener('keydown', onKey);
      for (const k of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0']) {
        pad.append(h('button', { class: 'opt', onclick: () => press(k) }, k));
      }
    });
    pad.remove();
    const ok = typed === num;
    box.classList.add(ok ? 'good' : 'wrong');
    if (ok) score++;
    else ctx.stage.firstChild.textContent = `Było: ${num}`;
    await ctx.feedback(ok);
    if (!ok) await ctx.sleep(2000);
  }
  return { ratio: score / rounds, text: `Zapamiętane liczby (cyfr: ${len}): ${score} z ${rounds}` };
}

// Tablica liczb: znajdź liczby po kolei, patrząc na środek – poszerza pole widzenia.
async function numberGrid(ctx) {
  const size = [3, 4, 4, 5, 5, 5, 6, 6, 7, 7][ctx.level - 1];
  const perCell = [2, 2, 1.4, 1.8, 1.3, 1, 1.6, 1.2, 1.4, 1][ctx.level - 1];
  const n = size * size;
  const keepMarks = ctx.level <= 2;
  const info = h('p', { class: 'question' }, 'Szukaj: 1');
  const grid = h('div', { class: 'grid cells', style: `--cols:${size}` });
  ctx.stage.replaceChildren(h('p', { class: 'hint' }, 'Patrz na środek tablicy i klikaj liczby po kolei.'), info, grid);
  let next = 1;
  let slips = 0;
  const t0 = performance.now();
  await new Promise((done) => {
    for (const num of shuffle(Array.from({ length: n }, (_, i) => i + 1))) {
      const b = h('button', { class: 'cell' }, String(num));
      b.addEventListener('click', () => {
        if (num === next) {
          tone([500 + next * 12], 0.06);
          if (keepMarks) b.classList.add('hit');
          ctx.progress(next, n);
          if (++next > n) done();
          else info.textContent = `Szukaj: ${next}`;
        } else if (num > next) {
          slips++;
          b.classList.remove('shake');
          void b.offsetWidth;
          b.classList.add('shake');
        }
      });
      grid.append(b);
    }
  });
  const t = (performance.now() - t0) / 1000 + slips; // każda pomyłka to sekunda kary
  const target = Math.round(n * perCell);
  const ratio = t <= target ? 1 : t <= target * 1.5 ? 0.7 : t <= target * 2.5 ? 0.45 : 0.3;
  await ctx.feedback(ratio === 1);
  const penalty = slips ? `, w tym ${slips} s kary za pomyłki` : '';
  return { ratio, text: `Twój czas: ${t.toFixed(1).replace('.', ',')} s${penalty} (cel: ${target} s)` };
}

// Lista słów: zapamiętaj listę, potem zaznacz słowa, które na niej były.
async function wordList(ctx) {
  const n = ctx.level + 3;
  const rounds = 3;
  const pool = [...WORDS[1], ...WORDS[2], ...(ctx.level > 6 ? WORDS[3] : [])];
  const deck = shuffle(pool); // każde słowo najwyżej raz w całej sesji
  let points = 0;
  for (let r = 0; r < rounds; r++) {
    ctx.progress(r, rounds);
    const words = deck.slice(r * n * 2, (r + 1) * n * 2);
    const targets = new Set(words.slice(0, n));
    ctx.stage.replaceChildren(
      h('p', { class: 'hint' }, 'Zapamiętaj te słowa! Możesz ułożyć z nich w głowie historyjkę.'),
      h('div', { class: 'chips' }, [...targets].map((w) => h('span', null, w))));
    await ctx.sleep(2000 + n * 1500);
    const tiles = h('div', { class: 'options list' });
    const check = h('button', { class: 'big' }, 'Sprawdź');
    ctx.stage.replaceChildren(h('p', { class: 'hint' }, `Zaznacz ${n} ${n < 5 ? 'słowa' : 'słów'}, które były na liście.`), tiles, check);
    for (const w of shuffle(words)) {
      tiles.append(h('button', { class: 'opt small', onclick: (e) => e.currentTarget.classList.toggle('sel') }, w));
    }
    await new Promise((done) => check.addEventListener('click', done));
    check.remove();
    let hits = 0;
    let wrong = 0;
    for (const b of tiles.children) {
      const sel = b.classList.contains('sel');
      const was = targets.has(b.textContent);
      b.disabled = true;
      b.classList.remove('sel');
      if (sel && was) hits++;
      if (sel && !was) wrong++;
      if (was) b.classList.add(sel ? 'good' : 'missed');
      else if (sel) b.classList.add('wrong');
    }
    const got = Math.max(0, hits - wrong);
    points += got;
    await ctx.feedback(got === n);
    await ctx.sleep(got === n ? 400 : 2200);
  }
  return { ratio: points / (n * rounds), text: `Zapamiętane słowa: ${points} z ${n * rounds}` };
}

const GAMES = [
  { id: 'flash', group: 'Czytanie', icon: '⚡', name: 'Błysk', how: 'Słowo mignie na ekranie tylko na chwilę. Przeczytaj je jednym spojrzeniem i wybierz właściwe. Na wyższych poziomach migają całe wyrażenia!', run: flashWords },
  { id: 'syl', group: 'Czytanie', icon: '🧩', name: 'Sylaby', how: 'Popatrz na obrazek i ułóż jego nazwę z sylab. Klikaj sylaby po kolei.', run: syllables },
  { id: 'read', group: 'Czytanie', icon: '📖', name: 'Czytanie na czas', how: 'Przeczytaj krótką historyjkę, która pojawia się słowo po słowie, i odpowiedz na pytania.', run: speedRead },
  { id: 'grid', group: 'Czytanie', icon: '🎯', name: 'Tablica liczb', how: 'Znajdź liczby po kolei, od 1 do ostatniej, jak najszybciej. Sztuczka: patrz na środek tablicy i szukaj kątem oka – to poszerza pole widzenia przy czytaniu.', run: numberGrid },
  { id: 'words', group: 'Pamięć', icon: '📝', name: 'Lista słów', how: 'Zapamiętaj listę słów. Potem wskaż je wśród innych. Pomaga wymyślenie historyjki, która łączy słowa.', run: wordList },
  { id: 'pairs', group: 'Pamięć', icon: '🃏', name: 'Pary', how: 'Odkrywaj po dwie karty i znajdź wszystkie pary w jak najmniejszej liczbie ruchów.', run: pairs },
  { id: 'seq', group: 'Pamięć', icon: '🔢', name: 'Kolejność', how: 'Obrazki pokażą się jeden po drugim. Zapamiętaj kolejność i powtórz ją.', run: sequence },
  { id: 'miss', group: 'Pamięć', icon: '🙈', name: 'Co zniknęło?', how: 'Zapamiętaj obrazki. Jeden z nich zniknie – zgadnij który!', run: missing },
  { id: 'num', group: 'Pamięć', icon: '🔟', name: 'Liczby', how: 'Zapamiętaj liczbę, a kiedy zniknie – wpisz ją z pamięci.', run: numbers },
];

/* ---------- ekrany ---------- */
let current = null; // znacznik trwającej gry; zmiana ekranu ją przerywa

function who() {
  current = null;
  const input = h('input', { type: 'text', maxlength: '14', placeholder: 'Imię', 'aria-label': 'Imię nowego gracza', autocomplete: 'off' });
  const add = (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    const same = state.players.findIndex((p) => p.name.toLowerCase() === name.toLowerCase());
    if (same < 0) state.players.push({ name, stars: 0, games: {} });
    state.active = same < 0 ? state.players.length - 1 : same;
    save();
    // prośba do przeglądarki, żeby nie kasowała zapisanych postępów
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    home();
  };
  app.replaceChildren(
    h('header', { class: 'top' }, h('h1', null, '🦉 Mądra Sowa')),
    h('div', { class: 'panel' },
      h('p', { class: 'how' }, state.players.length ? 'Kto teraz gra?' : 'Cześć! Jak masz na imię?'),
      state.players.map((p, i) => h('div', { class: 'player' },
        h('button', { class: 'big', onclick: () => { state.active = i; save(); home(); } }, `${p.name}  ⭐ ${p.stars}`),
        h('button', {
          class: 'icon',
          'aria-label': `Usuń gracza ${p.name}`,
          onclick: (e) => {
            // potwierdzenie drugim stuknięciem (okienka systemowe nie wszędzie działają)
            const btn = e.currentTarget;
            if (!btn.classList.contains('sure')) {
              btn.classList.add('sure');
              btn.textContent = 'Usuń?';
              setTimeout(() => {
                btn.classList.remove('sure');
                btn.textContent = '✕';
              }, 3000);
              return;
            }
            state.players.splice(i, 1);
            state.active = -1;
            save();
            who();
          },
        }, '✕'))),
      h('form', { class: 'addplayer', onsubmit: add }, input, h('button', { class: 'big ghost', type: 'submit' }, '+ Dodaj gracza')))
  );
}

function home() {
  current = null;
  if (!me()) return who();
  const groups = [...new Set(GAMES.map((g) => g.group))];
  app.replaceChildren(
    h('header', { class: 'top' },
      h('h1', null, '🦉 Mądra Sowa'),
      h('div', { class: 'topright' },
        h('span', { class: 'stars', title: 'Zebrane gwiazdki' }, `⭐ ${me().stars}`),
        h('button', {
          class: 'icon',
          'aria-label': state.mute ? 'Włącz dźwięk' : 'Wyłącz dźwięk',
          onclick: () => { state.mute = !state.mute; save(); home(); },
        }, state.mute ? '🔇' : '🔊'))),
    h('p', { class: 'lead' },
      `Cześć, ${me().name}! Ćwicz codziennie kilka minut. `,
      h('button', { class: 'link', onclick: who }, 'Zmień gracza')),
    ...groups.map((group) => h('section', null,
      h('h2', null, group),
      h('div', { class: 'tiles' }, GAMES.filter((g) => g.group === group).map((g) => {
        const s = gs(g.id);
        return h('button', { class: 'tile', onclick: () => intro(g) },
          h('span', { class: 'ticon' }, g.icon),
          h('span', { class: 'tname' }, g.name),
          h('span', { class: 'tmeta' }, `Poziom ${s.level}  ${'⭐'.repeat(s.best)}${'☆'.repeat(3 - s.best)}`));
      }))))
  );
}

function gameHeader(g, extra) {
  return h('header', { class: 'top' },
    h('button', { class: 'icon', 'aria-label': 'Wróć do menu', onclick: home }, '←'),
    h('h1', null, `${g.icon} ${g.name}`),
    extra || h('span'));
}

function intro(g) {
  current = null;
  // wpis w historii, żeby systemowy przycisk „wstecz” wracał do menu, a nie zamykał aplikację
  if (!history.state) history.pushState(1, '');
  const s = gs(g.id);
  const setLevel = (d) => {
    s.level = Math.min(MAX_LEVEL, Math.max(1, s.level + d));
    s.best = 0; // gwiazdki na kafelku dotyczą bieżącego poziomu
    save();
    intro(g);
  };
  app.replaceChildren(
    gameHeader(g),
    h('div', { class: 'panel' },
      h('div', { class: 'bigicon' }, g.icon),
      h('p', { class: 'how' }, g.how),
      h('div', { class: 'levelpick' },
        h('button', { class: 'icon', 'aria-label': 'Łatwiej', disabled: s.level === 1, onclick: () => setLevel(-1) }, '−'),
        h('span', null, `Poziom ${s.level} z ${MAX_LEVEL}`),
        h('button', { class: 'icon', 'aria-label': 'Trudniej', disabled: s.level === MAX_LEVEL, onclick: () => setLevel(1) }, '+')),
      h('button', { class: 'big', onclick: () => play(g) }, '▶ Start'))
  );
}

async function play(g) {
  const token = (current = {});
  const s = gs(g.id);
  const bar = h('div', { class: 'progress' }, h('i'));
  const stage = h('div', { class: 'stage' });
  app.replaceChildren(gameHeader(g, h('span', { class: 'stars' }, `Poziom ${s.level}`)), bar, stage);
  // drugie stuknięcie z podwójnego kliknięcia w „Start” nie może trafić w grę
  stage.style.pointerEvents = 'none';
  setTimeout(() => (stage.style.pointerEvents = ''), 400);
  // ekran nie gaśnie w trakcie gry (np. podczas czytania bez dotykania ekranu)
  let wakeLock = null;
  if ('wakeLock' in navigator) navigator.wakeLock.request('screen').then((l) => (wakeLock = l), () => {});

  const sleep = (ms) => new Promise((res, rej) => setTimeout(() => (current === token ? res() : rej(CANCEL)), ms));
  const ctx = {
    level: s.level,
    stage,
    sleep,
    progress: (i, total) => (bar.firstChild.style.width = `${(i / total) * 100}%`),
    async feedback(ok) {
      tone(ok ? [660, 880] : [220, 180]);
      const f = h('div', { class: 'fb' }, ok ? '👍' : '🙈');
      stage.append(f);
      await sleep(750);
      f.remove();
    },
    // przyciski z odpowiedziami; zwraca true, jeśli wybrano poprawną
    async ask(options, correct, cls) {
      const wrap = h('div', { class: `options ${cls || ''}` });
      stage.append(wrap);
      const picked = await new Promise((done) => {
        for (const o of options) wrap.append(h('button', { class: 'opt', onclick: (e) => done(e.currentTarget) }, o));
      });
      for (const b of wrap.children) {
        b.disabled = true;
        if (b.textContent === correct) b.classList.add('good');
      }
      const ok = picked.textContent === correct;
      if (!ok) picked.classList.add('wrong');
      await ctx.feedback(ok);
      if (!ok) await sleep(2000); // czas, żeby zobaczyć poprawną odpowiedź
      return ok;
    },
  };

  let result;
  try {
    result = await g.run(ctx);
  } catch (e) {
    if (e === CANCEL) return;
    throw e;
  } finally {
    if (wakeLock) wakeLock.release().catch(() => {});
  }
  if (current !== token) return;

  const stars = result.ratio >= 0.9 ? 3 : result.ratio >= 0.6 ? 2 : result.ratio > 0.3 ? 1 : 0;
  const before = s.level;
  if (result.ratio >= 0.8) s.level = Math.min(MAX_LEVEL, s.level + 1);
  else if (result.ratio < 0.4) s.level = Math.max(1, s.level - 1);
  s.plays++;
  s.best = s.level !== before ? 0 : Math.max(s.best, stars);
  me().stars += stars;
  save();
  if (stars) tone([523, 659, 784, 1047], 0.16);

  const note = s.level > before ? `Brawo! Wskakujesz na poziom ${s.level}! 🚀`
    : s.level < before ? `Spróbujmy trochę łatwiej – poziom ${s.level}.`
      : stars === 3 && before === MAX_LEVEL ? 'Mistrzostwo! To najwyższy poziom! 🏆'
        : stars === 0 ? 'Nie poddawaj się – spróbuj jeszcze raz!'
          : 'Ćwicz dalej, idzie Ci coraz lepiej!';
  app.replaceChildren(
    gameHeader(g),
    h('div', { class: 'panel' },
      h('div', { class: 'result' }, '⭐'.repeat(stars) + '☆'.repeat(3 - stars)),
      h('p', { class: 'how' }, result.text),
      h('p', { class: 'note' }, note),
      h('button', { class: 'big', onclick: () => play(g) }, '🔁 Jeszcze raz'),
      h('button', { class: 'big ghost', onclick: home }, 'Menu'))
  );
}

// gdy graczy jest więcej, zaczynamy od pytania „kto gra?”, żeby nie grać na cudzym profilu
if (state.players.length > 1) who();
else home();
addEventListener('popstate', home);
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
