import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HUD from '../components/HUD';
import BananaModal from '../components/BananaModal';
import { jpost } from '../lib/api';
import { me } from '../lib/auth';

const W = 900, H = 600;
const rand = (min, max) => Math.random() * (max - min) + min;

export default function Game() {
  const canvasRef = useRef(null);
  const nav = useNavigate();

  const [paused, setPaused] = useState(false);
  const [showBanana, setShowBanana] = useState(false);
  const [running, setRunning] = useState(true);
  const [timeSec, setTimeSec] = useState(0);
  const [score, setScore] = useState(0);
  const [lives] = useState(1);

  const [authChecked, setAuthChecked] = useState(false);

  const [viewSize, setViewSize] = useState({ w: W, h: H });
  useEffect(() => {
    const fit = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scale = Math.min((vw - 32) / W, (vh - 120) / H, 1);
      setViewSize({ w: Math.round(W * scale), h: Math.round(H * scale) });
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const startedRef = useRef(false);
  const rafIdRef = useRef(0);
  const pausedRef = useRef(false);
  const runningRef = useRef(true);
  const bananaUsedRef = useRef(false);
  const bananaActiveRef = useRef(false);
  const elapsedRef = useRef(0);
  const immunityRef = useRef(0);
  const [countdown, setCountdown] = useState(0);
  const statsRef = useRef({ dodges: 0, correct: 0, wrong: 0 });

  useEffect(() => {
    me()
      .then(() => setAuthChecked(true))
      .catch(() => {
        nav('/login');
      });
  }, [nav]);

  useEffect(() => {
    if (!authChecked) return;
    const cleanup = startGame();
    return () => {
      cleanup();
      startedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecked]);

  function startGame() {
    if (startedRef.current) return () => {};
    startedRef.current = true;

    pausedRef.current = false;
    runningRef.current = true;
    bananaUsedRef.current = false;
    bananaActiveRef.current = false;
    immunityRef.current = 0;
    elapsedRef.current = 0;
    statsRef.current = { dodges: 0, correct: 0, wrong: 0 };
    setPaused(false);
    setShowBanana(false);
    setRunning(true);
    setTimeSec(0);
    setScore(0);
    setCountdown(0);

    const canvas = canvasRef.current;
    if (!canvas) return () => {};
    const ctx = canvas.getContext('2d');

    const ship = { x: W / 2, y: H - 80, speed: 400 };
    const ast = [];
    const keys = new Set();
    let last = performance.now();
    let accSpawn = 0;

    function spawn() {
      ast.push({
        x: rand(20, W - 20),
        y: -40,
        r: rand(12, 28),
        vy: rand(120, 220)
      });
    }

    function onKey(e) {
      if (e.type === 'keydown') keys.add(e.key);
      else keys.delete(e.key);
    }

    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    function frame(t) {
      if (!runningRef.current) return;
      const dt = (t - last) / 1000;
      last = t;

      if (!pausedRef.current) {
        elapsedRef.current += dt;
        setTimeSec(elapsedRef.current);

        const rate = Math.min(1.5, 0.5 + elapsedRef.current / 60);
        accSpawn += dt * rate;
        while (accSpawn > 0.5) {
          accSpawn -= 0.5;
          spawn();
        }

        if (keys.has('ArrowLeft')) ship.x -= ship.speed * dt;
        if (keys.has('ArrowRight')) ship.x += ship.speed * dt;
        ship.x = Math.max(20, Math.min(W - 20, ship.x));

        for (const a of ast) a.y += a.vy * dt;

        const before = ast.length;
        for (let i = ast.length - 1; i >= 0; i--) {
          if (ast[i].y > H + 40) ast.splice(i, 1);
        }
        const removed = before - ast.length;
        if (removed > 0) {
          statsRef.current.dodges += removed;
          setScore((s) => s + removed * 10);
        }

        if (immunityRef.current > 0) {
          immunityRef.current = Math.max(0, immunityRef.current - dt);
          const c = Math.ceil(immunityRef.current);
          setCountdown(c > 0 ? c : 0);
        }

        for (const a of ast) {
          const dx = a.x - ship.x;
          const dy = a.y - ship.y;
          if (Math.hypot(dx, dy) < a.r + 24) {
            if (immunityRef.current > 0) break;
            if (bananaUsedRef.current) {
              gameOver();
              break;
            }
            if (!bananaActiveRef.current) {
              bananaActiveRef.current = true;
              pausedRef.current = true;
              setPaused(true);
              setShowBanana(true);
            }
            break;
          }
        }
      }

      render(ctx, ship, ast);
      rafIdRef.current = requestAnimationFrame(frame);
    }

    rafIdRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
  }

  function gameOver() {
    pausedRef.current = true;
    runningRef.current = false;
    setPaused(true);
    setRunning(false);
    submitRun(true);
  }

  function render(ctx, ship, ast) {
    ctx.canvas.width = W;
    ctx.canvas.height = H;

    const grd = ctx.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, '#0b1020');
    grd.addColorStop(1, '#10172a');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = 'rgba(255,255,255,.6)';
    for (let i = 0; i < 60; i++) {
      ctx.fillRect((i * 73) % W, (i * 131) % H, 2, 2);
    }

    if (immunityRef.current > 0) {
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 6;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#22d3ee';
      ctx.beginPath();
      ctx.arc(ship.x, ship.y, 34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#a78bfa';
    for (const a of ast) {
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  async function submitRun(final = false) {
    const payload = {
      durationMs: Math.round(elapsedRef.current * 1000),
      dodges: statsRef.current.dodges,
      correctAnswers: statsRef.current.correct,
      wrongAnswers: statsRef.current.wrong
    };
    try {
      await jpost('/api/scores/submit', payload);
    } catch {
      // ignore
    }
    if (final) {
      runningRef.current = false;
    }
  }

  function bananaCorrect() {
    statsRef.current.correct++;
    setShowBanana(false);
    bananaUsedRef.current = true;
    bananaActiveRef.current = false;
    immunityRef.current = 3;
    setCountdown(3);
    pausedRef.current = false;
    setPaused(false);
    setScore((s) => s + 50);
  }

  function bananaWrong() {
    statsRef.current.wrong++;
    setShowBanana(false);
    bananaUsedRef.current = true;
    bananaActiveRef.current = false;
    gameOver();
  }

  function playAgain() {
    nav('/game?r=' + Date.now());
  }

  if (!authChecked) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center text-white/70">
        Checking session…
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'grid', placeItems: 'center' }}>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ width: `${viewSize.w}px`, height: `${viewSize.h}px` }}
          className="border border-white/10 rounded-2xl"
        />
        <HUD timeSec={timeSec} score={score} lives={1} />

        {countdown > 0 && (
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-6xl font-bold text-white/80 drop-shadow">{countdown}</div>
          </div>
        )}

        {!running && (
          <div className="absolute inset-0 z-20 bg-black/70 grid place-items-center">
            <div className="card p-6 text-center space-y-4">
              <h3 className="text-xl font-semibold">Game Over</h3>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button className="btn-primary px-6" onClick={playAgain}>
                  Play Again
                </button>
                <Link className="btn-ghost px-6" to="/">
                  Exit
                </Link>
                <Link className="btn-ghost px-6" to="/leaderboards">
                  Leaderboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <BananaModal
        open={showBanana}
        onCorrect={() => {
          bananaCorrect();
          submitRun(false);
        }}
        onWrong={bananaWrong}
      />
    </div>
  );
}
