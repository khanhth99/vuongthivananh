/* =========================================================
   Thiệp 20/10 gửi vợ yêu
   Sửa tên, lời ký và nội dung thư ở CONFIG bên dưới.
   ========================================================= */
const CONFIG = {
  name: "Vợ yêu",
  from: "Chồng của em",
  letter: [
    "Cảm ơn em đã luôn ở bên anh.",
    "Chúc em 20/10 thật xinh đẹp, bình an và hạnh phúc. Anh thương hai mẹ con nhiều lắm.",
  ],
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const screenEl = $("#screen");
const app = $("#app");

$$(".js-name").forEach((el) => (el.textContent = CONFIG.name));
$$(".js-from").forEach((el) => (el.textContent = CONFIG.from));

/* ---------- Canvas helper ---------- */
function setupCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const size = { w: 0, h: 0 };
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = screenEl.getBoundingClientRect();
    size.w = r.width;
    size.h = r.height;
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);
  return { ctx, size };
}

/* ---------- Cánh hoa rơi ---------- */
const petals = (() => {
  const { ctx, size } = setupCanvas($("#petals"));
  const colors = ["#f7c6cc", "#f3a9b3", "#fbd9dc", "#e8818e", "#ffffff"];
  const count = reduceMotion ? 10 : 26;
  const list = [];

  const make = (initial) => ({
    x: Math.random() * size.w,
    y: initial ? Math.random() * size.h : -20,
    r: 6 + Math.random() * 7,
    vy: 0.35 + Math.random() * 0.7,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.01 + Math.random() * 0.02,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.04,
    flip: Math.random() * Math.PI * 2,
    color: colors[(Math.random() * colors.length) | 0],
  });

  const draw = (p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(1, Math.abs(Math.cos(p.flip)) * 0.7 + 0.3);
    ctx.beginPath();
    ctx.moveTo(0, -p.r);
    ctx.bezierCurveTo(p.r, -p.r, p.r * 0.9, p.r * 0.6, 0, p.r);
    ctx.bezierCurveTo(-p.r * 0.9, p.r * 0.6, -p.r, -p.r, 0, -p.r);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.restore();
  };

  let running = false;
  const tick = () => {
    ctx.clearRect(0, 0, size.w, size.h);
    for (const p of list) {
      p.sway += p.swaySpeed;
      p.x += Math.sin(p.sway) * 0.6;
      p.y += p.vy;
      p.rot += p.vr;
      p.flip += 0.03;
      if (p.y > size.h + 20) Object.assign(p, make(false));
      draw(p);
    }
    requestAnimationFrame(tick);
  };

  return {
    start() {
      if (running) return;
      running = true;
      for (let i = 0; i < count; i++) list.push(make(true));
      tick();
    },
  };
})();

/* ---------- Pháo hoa trái tim ---------- */
const fireworks = (() => {
  const { ctx, size } = setupCanvas($("#fireworks"));
  const colors = ["#b3182b", "#e23a50", "#f3a9b3", "#d9ad5b", "#ff7a8a", "#ffffff"];
  const parts = [];
  let running = false;

  const heartPath = (s) => {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(0, 0, -s * 0.5, 0, -s * 0.5, s * 0.3);
    ctx.bezierCurveTo(-s * 0.5, s * 0.6, 0, s * 0.8, 0, s);
    ctx.bezierCurveTo(0, s * 0.8, s * 0.5, s * 0.6, s * 0.5, s * 0.3);
    ctx.bezierCurveTo(s * 0.5, 0, 0, 0, 0, s * 0.3);
  };

  const tick = () => {
    ctx.clearRect(0, 0, size.w, size.h);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 0.06;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = Math.min(1, p.life / 40);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      heartPath(p.s);
      ctx.fill();
      ctx.restore();
    }
    if (parts.length) requestAnimationFrame(tick);
    else running = false;
  };

  return {
    burst(x, y, n = 70) {
      for (let i = 0; i < n; i++) {
        // Phân bố hạt theo hình trái tim
        const t = (i / n) * Math.PI * 2;
        const hx = 16 * Math.sin(t) ** 3;
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const speed = 0.32 + Math.random() * 0.08;
        parts.push({
          x, y,
          vx: hx * speed,
          vy: hy * speed,
          s: 8 + Math.random() * 8,
          rot: (Math.random() - 0.5) * 0.6,
          life: 90 + Math.random() * 40,
          color: colors[(Math.random() * colors.length) | 0],
        });
      }
      if (!running) { running = true; tick(); }
    },
  };
})();

/* ---------- Nhạc ---------- */
const music = (() => {
  const song = $("#song");
  const btn = $("#musicBtn");
  let mode = null; // "song" | "synth"
  let playing = false;
  let ac, master, timer, nextTime, step;

  // Giai điệu hộp nhạc (nhịp 3/4): [nốt MIDI, số phách]
  const BEAT = 0.42;
  const melody = [
    [76,1],[79,1],[84,1], [83,2],[79,1], [81,1],[79,1],[77,1], [76,3],
    [74,1],[77,1],[81,1], [79,2],[77,1], [76,1],[74,1],[72,1], [74,3],
    [76,1],[79,1],[84,1], [83,2],[86,1], [84,1],[81,1],[77,1], [76,2],[79,1],
    [81,1],[79,1],[76,1], [77,1],[74,1],[71,1], [72,3], [0,3],
  ];
  const chords = [
    [48,55,64],[47,55,62],[45,53,60],[48,55,64],
    [50,57,65],[47,55,62],[48,55,64],[47,55,62],
    [48,55,64],[47,55,62],[45,53,60],[48,55,64],
    [45,52,60],[47,53,62],[48,55,64],[48,55,64],
  ];
  // Dựng sẵn danh sách nốt theo thời gian (tính bằng phách)
  const events = [];
  let beat = 0;
  for (const [n, d] of melody) {
    if (n) events.push({ at: beat, note: n, vol: 0.32, len: 1.8 });
    beat += d;
  }
  const LOOP = beat;
  chords.forEach((c, bar) =>
    c.forEach((n, i) => events.push({ at: bar * 3 + i, note: n, vol: 0.12, len: 1.4 }))
  );
  events.sort((a, b) => a.at - b.at);

  const freq = (m) => 440 * 2 ** ((m - 69) / 12);

  function initAudio() {
    if (ac) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    master = ac.createGain();
    master.gain.value = 0.5;
    // Tiếng vang nhẹ
    const delay = ac.createDelay();
    delay.delayTime.value = 0.28;
    const fb = ac.createGain();
    fb.gain.value = 0.28;
    const wet = ac.createGain();
    wet.gain.value = 0.3;
    master.connect(ac.destination);
    master.connect(delay);
    delay.connect(fb).connect(delay);
    delay.connect(wet).connect(ac.destination);
  }

  function pluck(note, time, vol, len) {
    const f = freq(note);
    const g = ac.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(vol, time + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, time + len);
    g.connect(master);
    [[f, "sine", 1], [f * 2, "triangle", 0.18], [f * 3, "sine", 0.06]].forEach(([fr, type, amt]) => {
      const o = ac.createOscillator();
      const og = ac.createGain();
      o.type = type;
      o.frequency.value = fr;
      og.gain.value = amt;
      o.connect(og).connect(g);
      o.start(time);
      o.stop(time + len + 0.05);
    });
  }

  function startSynth() {
    initAudio();
    if (!ac) return;
    ac.resume();
    nextTime = ac.currentTime + 0.15;
    step = 0;
    clearInterval(timer);
    timer = setInterval(scheduleLoop, 60);
    scheduleLoop();
  }

  // Lên lịch các nốt trong 0,3 giây tới
  function scheduleLoop() {
    const horizon = ac.currentTime + 0.3;
    for (;;) {
      const ev = events[step % events.length];
      const t = nextTime + ev.at * BEAT;
      if (t > horizon) break;
      pluck(ev.note, t, ev.vol, ev.len);
      step++;
      if (step % events.length === 0) nextTime += LOOP * BEAT;
    }
  }

  function stopSynth() {
    clearInterval(timer);
    if (ac) ac.suspend();
  }

  const setUI = () => btn.classList.toggle("is-playing", playing);

  return {
    // Gọi trong sự kiện chạm để trình duyệt cho phép phát âm thanh
    start() {
      btn.hidden = false;
      initAudio();
      if (ac) ac.resume();
      playing = true;
      setUI();
      song.volume = 0.8;
      song.play()
        .then(() => { mode = "song"; })
        .catch(() => { mode = "synth"; if (playing) startSynth(); });
    },
    toggle() {
      playing = !playing;
      setUI();
      if (mode === "song") playing ? song.play() : song.pause();
      else playing ? startSynth() : stopSynth();
    },
  };
})();

$("#musicBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  music.toggle();
});

/* ---------- Mở thư ---------- */
const intro = $("#intro");
const envelope = $("#envelope");
let opened = false;

envelope.addEventListener("click", () => {
  if (opened) return;
  opened = true;
  envelope.classList.add("is-open");
  music.start();
  petals.start();
  setTimeout(() => {
    intro.classList.add("is-hidden");
    app.setAttribute("aria-hidden", "false");
  }, 1600);
});

/* ---------- Hiện dần khi cuộn ---------- */
const revealIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("is-in");
      revealIO.unobserve(e.target);
    }
  },
  { root: app, threshold: 0.15 }
);
// Hiệu ứng lần lượt cho các phần tử cùng nhóm
$$(".wish-list").forEach((group) =>
  $$(".reveal", group).forEach((el, i) => el.style.setProperty("--d", `${i * 0.1}s`))
);
$$(".reveal").forEach((el) => revealIO.observe(el));

/* ---------- Thư tự gõ ---------- */
const letterBox = $("#letterText");
let typingDone = false;
let skipTyping = false;

async function typeLetter() {
  const caret = document.createElement("span");
  caret.className = "caret";
  for (const para of CONFIG.letter) {
    const p = document.createElement("p");
    letterBox.appendChild(p);
    const text = document.createTextNode("");
    p.append(text, caret);
    for (const ch of para) {
      text.data += ch;
      if (!skipTyping) await new Promise((r) => setTimeout(r, ch === "," || ch === "." ? 220 : 38));
    }
    if (!skipTyping) await new Promise((r) => setTimeout(r, 400));
  }
  caret.remove();
  typingDone = true;
}

const letterIO = new IntersectionObserver(
  (entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      letterIO.disconnect();
      if (reduceMotion) skipTyping = true;
      typeLetter();
    }
  },
  { root: app, threshold: 0.35 }
);
letterIO.observe($(".paper"));
$(".paper").addEventListener("click", () => { if (!typingDone) skipTyping = true; });

/* ---------- Video em bé: tự phát (không tiếng) khi cuộn tới ---------- */
const babyVideo = $(".baby video");
new IntersectionObserver(
  ([e]) => {
    if (e.isIntersecting) babyVideo.play().catch(() => {});
    else babyVideo.pause();
  },
  { root: app, threshold: 0.5 }
).observe(babyVideo);

/* ---------- Trái tim cuối ---------- */
const loveMsg = $("#loveMsg");
$("#heartBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  const s = screenEl.getBoundingClientRect();
  const b = e.currentTarget.getBoundingClientRect();
  const x = b.left + b.width / 2 - s.left;
  const y = b.top + b.height / 2 - s.top;
  fireworks.burst(x, y, 80);
  setTimeout(() => fireworks.burst(x - s.width * 0.28, y - 120, 50), 350);
  setTimeout(() => fireworks.burst(x + s.width * 0.28, y - 160, 50), 650);
  loveMsg.classList.add("is-shown");
  if (navigator.vibrate) navigator.vibrate([60, 60, 120]);
});

/* ---------- Chạm đâu cũng nở tim ---------- */
screenEl.addEventListener("pointerdown", (e) => {
  if (!opened || reduceMotion) return;
  const h = document.createElement("span");
  h.className = "tap-heart";
  h.textContent = ["❤", "💕", "🌸", "💗"][(Math.random() * 4) | 0];
  h.style.left = `${e.clientX}px`;
  h.style.top = `${e.clientY}px`;
  h.style.setProperty("--dx", `${(Math.random() - 0.5) * 40}px`);
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 1000);
});
