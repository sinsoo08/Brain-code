"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "./game.css";
import {
  SETTINGS_KEY,
  STORAGE_KEY,
  TODAY_SCORE_KEY,
  defaultSettings,
  defaultStats,
  defaultTodayScores,
  occipitalShapes,
  regionData,
  regionImages,
  temporalWords,
} from "./gameData";

function ptsToString(points) {
  return points.map((point) => point.join(",")).join(" ");
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function formatReaction(ms) {
  return ms == null ? "-" : `${ms}ms`;
}

function formatAccuracy(correct, attempts) {
  return attempts ? `${Math.round((correct / attempts) * 100)}%` : "0%";
}

function loadStats() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed?.regions) return parsed;
  } catch {}
  return defaultStats();
}

function loadSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (parsed) return parsed;
  } catch {}
  return defaultSettings();
}

function loadTodayScores() {
  try {
    const parsed = JSON.parse(localStorage.getItem(TODAY_SCORE_KEY));
    const today = new Date().toISOString().slice(0, 10);
    if (parsed?.date === today && parsed.scores) {
      return {
        ...defaultTodayScores(),
        ...parsed.scores,
      };
    }
  } catch {}
  return defaultTodayScores();
}

function createFrontalGame() {
  const answer = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("");
  return {
    type: "frontal",
    phase: "memorize",
    answer,
    input: "",
  };
}

function createParietalGame() {
  return {
    type: "parietal",
    targetIndex: Math.floor(Math.random() * 9),
  };
}

function createTemporalGame() {
  const selectedWords = shuffle(temporalWords).slice(0, 3);
  return {
    type: "temporal",
    phase: "memorize",
    selectedWords,
    choices: [],
    pickedWords: [],
  };
}

function createOccipitalGame() {
  const target = occipitalShapes[Math.floor(Math.random() * occipitalShapes.length)];
  const pool = [target];

  while (pool.length < 9) {
    const shape = occipitalShapes[Math.floor(Math.random() * occipitalShapes.length)];
    if (shape !== target) pool.push(shape);
  }

  return {
    type: "occipital",
    target,
    board: shuffle(pool),
    clickedIndexes: [],
  };
}

function createCerebellumGame() {
  return {
    type: "cerebellum",
    ready: false,
    startedAt: null,
    tooSoon: false,
  };
}

function createResultGame(regionKey, title, subtitle, emoji, label) {
  return {
    type: "result",
    regionKey,
    title,
    subtitle,
    emoji,
    label,
  };
}

function buildStatsWithOutcome(previousStats, regionKey, outcome) {
  const regionStats = previousStats.regions[regionKey];
  const nextRegionStats = {
    ...regionStats,
    attempts: regionStats.attempts + 1,
    correct: regionStats.correct + (outcome.correct ? 1 : 0),
    plays: regionStats.plays + (outcome.cleared ? 1 : 0),
    bestScore: Math.max(regionStats.bestScore, outcome.score),
    bestReaction: outcome.reaction == null
      ? regionStats.bestReaction
      : regionStats.bestReaction == null || outcome.reaction < regionStats.bestReaction
        ? outcome.reaction
        : regionStats.bestReaction,
  };

  return {
    ...previousStats,
    totalAttempts: previousStats.totalAttempts + 1,
    totalCorrect: previousStats.totalCorrect + (outcome.correct ? 1 : 0),
    totalPlays: previousStats.totalPlays + (outcome.cleared ? 1 : 0),
    bestScore: Math.max(previousStats.bestScore, outcome.score),
    bestReaction: outcome.reaction == null
      ? previousStats.bestReaction
      : previousStats.bestReaction == null || outcome.reaction < previousStats.bestReaction
        ? outcome.reaction
        : previousStats.bestReaction,
    regions: {
      ...previousStats.regions,
      [regionKey]: nextRegionStats,
    },
  };
}

export default function GamePage() {
  const router = useRouter();
  const inputRef = useRef(null);
  const timersRef = useRef([]);
  const loadedRef = useRef(false);

  const [selectedRegionKey, setSelectedRegionKey] = useState(null);
  const [hoveredRegionKey, setHoveredRegionKey] = useState(null);
  const [activeGame, setActiveGame] = useState(null);
  const [stats, setStats] = useState(defaultStats());
  const [settings, setSettings] = useState(defaultSettings());
  const [todayScores, setTodayScores] = useState(defaultTodayScores());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const selectedRegion = selectedRegionKey ? regionData[selectedRegionKey] : null;
  const hoveredRegion = hoveredRegionKey ? regionData[hoveredRegionKey] : null;

  const clearTimers = () => {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timersRef.current = [];
  };

  const schedule = (callback, delay) => {
    const timerId = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((id) => id !== timerId);
      callback();
    }, delay);

    timersRef.current.push(timerId);
  };

  useEffect(() => {
    setStats(loadStats());
    setSettings(loadSettings());
    setTodayScores(loadTodayScores());
    loadedRef.current = true;

    return () => {
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if (!loadedRef.current) return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!loadedRef.current) return;
    localStorage.setItem(
      TODAY_SCORE_KEY,
      JSON.stringify({
        date: new Date().toISOString().slice(0, 10),
        scores: todayScores,
      }),
    );
  }, [todayScores]);

  useEffect(() => {
    if (activeGame?.type === "frontal" && activeGame.phase === "input") {
      inputRef.current?.focus();
    }
  }, [activeGame]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;
      setIsSettingsOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const applyOutcome = (regionKey, outcome) => {
    setStats((previousStats) => buildStatsWithOutcome(previousStats, regionKey, outcome));

    if (outcome.score > 0) {
      setTodayScores((previousScores) => ({
        ...previousScores,
        [regionKey]: previousScores[regionKey] + outcome.score,
      }));
    }
  };

  const startGame = (regionKey = selectedRegionKey) => {
    if (!regionKey) return;
    clearTimers();

    if (regionKey === "frontal") {
      const game = createFrontalGame();
      setActiveGame(game);
      schedule(() => {
        setActiveGame((previousGame) => {
          if (previousGame?.type !== "frontal" || previousGame.phase !== "memorize") {
            return previousGame;
          }

          return {
            ...previousGame,
            phase: "input",
          };
        });
      }, 2000);
      return;
    }

    if (regionKey === "parietal") {
      setActiveGame(createParietalGame());
      return;
    }

    if (regionKey === "temporal") {
      const game = createTemporalGame();
      setActiveGame(game);
      schedule(() => {
        setActiveGame((previousGame) => {
          if (previousGame?.type !== "temporal" || previousGame.phase !== "memorize") {
            return previousGame;
          }

          const wrongWords = shuffle(
            temporalWords.filter((word) => !previousGame.selectedWords.includes(word)),
          ).slice(0, 5);

          return {
            ...previousGame,
            phase: "select",
            choices: shuffle([...previousGame.selectedWords, ...wrongWords]),
          };
        });
      }, 2500);
      return;
    }

    if (regionKey === "occipital") {
      setActiveGame(createOccipitalGame());
      return;
    }

    if (regionKey === "cerebellum") {
      const game = createCerebellumGame();
      setActiveGame(game);
      const waitMs = Math.floor(Math.random() * 1500) + 1200;

      schedule(() => {
        setActiveGame((previousGame) => {
          if (previousGame?.type !== "cerebellum" || previousGame.tooSoon) {
            return previousGame;
          }

          return {
            ...previousGame,
            ready: true,
            startedAt: Date.now(),
          };
        });
      }, waitMs);
    }
  };

  const handleSelectRegion = (regionKey) => {
    setSelectedRegionKey(regionKey);
    setHoveredRegionKey(null);
    setIsSettingsOpen(false);
    startGame(regionKey);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToBrain = () => {
    clearTimers();
    setSelectedRegionKey(null);
    setHoveredRegionKey(null);
    setActiveGame(null);
    setIsSettingsOpen(false);
  };

  const handleLogoClick = () => {
    if (selectedRegionKey) {
      handleBackToBrain();
    }
  };

  const handleFrontalSubmit = () => {
    if (activeGame?.type !== "frontal" || activeGame.phase !== "input") return;

    const value = activeGame.input.replace(/\s/g, "");
    const ok = value === activeGame.answer;

    applyOutcome("frontal", {
      cleared: ok,
      correct: ok,
      score: ok ? 40 : 0,
      reaction: null,
    });

    setActiveGame(
      createResultGame(
        "frontal",
        ok ? "정답이에요! 🎉" : "아쉽지만 다시 해봐요!",
        ok ? "기억력이 정말 좋네요!" : `정답은 [${activeGame.answer}] 이었어요`,
        ok ? "⭐" : "💪",
        ok ? "정 답!" : "오 답",
      ),
    );
  };

  const handleParietalSelect = (index) => {
    if (activeGame?.type !== "parietal") return;

    const ok = index === activeGame.targetIndex;
    const answerText = `${Math.floor(activeGame.targetIndex / 3) + 1}행 ${(activeGame.targetIndex % 3) + 1}열`;

    applyOutcome("parietal", {
      cleared: ok,
      correct: ok,
      score: ok ? 30 : 0,
      reaction: null,
    });

    setActiveGame(
      createResultGame(
        "parietal",
        ok ? "정답이에요! 🎉" : "아쉽지만 다시 해봐요!",
        ok ? "위치를 잘 찾았어요!" : `정답은 ${answerText} 이었어요`,
        ok ? "⭐" : "💪",
        ok ? "정 답!" : "오 답",
      ),
    );
  };

  const handleToggleTemporalWord = (word) => {
    if (activeGame?.type !== "temporal" || activeGame.phase !== "select") return;

    setActiveGame((previousGame) => {
      if (previousGame?.type !== "temporal" || previousGame.phase !== "select") {
        return previousGame;
      }

      const pickedWords = previousGame.pickedWords.includes(word)
        ? previousGame.pickedWords.filter((pickedWord) => pickedWord !== word)
        : [...previousGame.pickedWords, word];

      return {
        ...previousGame,
        pickedWords,
      };
    });
  };

  const handleTemporalSubmit = () => {
    if (activeGame?.type !== "temporal" || activeGame.phase !== "select") return;

    const answerSet = new Set(activeGame.selectedWords);
    const pickedSet = new Set(activeGame.pickedWords);
    const ok =
      answerSet.size === pickedSet.size &&
      [...answerSet].every((word) => pickedSet.has(word));

    applyOutcome("temporal", {
      cleared: ok,
      correct: ok,
      score: ok ? 30 : 0,
      reaction: null,
    });

    setActiveGame(
      createResultGame(
        "temporal",
        ok ? "정답이에요! 🎉" : "아쉽지만 다시 해봐요!",
        `정답 단어: ${activeGame.selectedWords.join(", ")}`,
        ok ? "⭐" : "💪",
        ok ? "정 답!" : "오 답",
      ),
    );
  };

  const handleToggleOccipitalIndex = (index) => {
    if (activeGame?.type !== "occipital") return;

    setActiveGame((previousGame) => {
      if (previousGame?.type !== "occipital") return previousGame;

      const clickedIndexes = previousGame.clickedIndexes.includes(index)
        ? previousGame.clickedIndexes.filter((clickedIndex) => clickedIndex !== index)
        : [...previousGame.clickedIndexes, index];

      return {
        ...previousGame,
        clickedIndexes,
      };
    });
  };

  const handleOccipitalSubmit = () => {
    if (activeGame?.type !== "occipital") return;

    const answerIndexes = activeGame.board
      .map((shape, index) => (shape === activeGame.target ? index : -1))
      .filter((index) => index >= 0);

    const selectedIndexes = new Set(activeGame.clickedIndexes);
    const ok =
      answerIndexes.length === selectedIndexes.size &&
      answerIndexes.every((index) => selectedIndexes.has(index));

    applyOutcome("occipital", {
      cleared: ok,
      correct: ok,
      score: ok ? 30 : 0,
      reaction: null,
    });

    setActiveGame(
      createResultGame(
        "occipital",
        ok ? "정답이에요! 🎉" : "아쉽지만 다시 해봐요!",
        `찾아야 했던 모양: ${activeGame.target}`,
        ok ? "⭐" : "💪",
        ok ? "정 답!" : "오 답",
      ),
    );
  };

  const handleCerebellumClick = () => {
    if (activeGame?.type !== "cerebellum") return;

    if (!activeGame.ready) {
      clearTimers();
      applyOutcome("cerebellum", {
        cleared: false,
        correct: false,
        score: 0,
        reaction: null,
      });

      setActiveGame(
        createResultGame(
          "cerebellum",
          "아직 이른걸요! 😅",
          "파란색으로 바뀔 때까지 기다려 주세요!",
          "⏳",
          "조금 빨랐어요",
        ),
      );
      return;
    }

    const reaction = Date.now() - activeGame.startedAt;
    const score = reaction <= 300 ? 30 : reaction <= 500 ? 20 : reaction <= 800 ? 10 : 5;

    clearTimers();
    applyOutcome("cerebellum", {
      cleared: true,
      correct: true,
      score,
      reaction,
    });

    setActiveGame(
      createResultGame(
        "cerebellum",
        reaction <= 400 ? "엄청 빠르네요! 🎉" : reaction <= 700 ? "잘했어요! 😊" : "다음엔 더 빠르게!",
        `반응 속도: ${reaction}밀리초`,
        `${reaction}`,
        `이번 점수: ${score}점`,
      ),
    );
  };

  const renderGameBody = () => {
    if (!selectedRegionKey || !activeGame) {
      return (
        <div className="center-box" style={{ minHeight: "300px" }}>
          <div className="game-inner-title">영역을 선택해 주세요</div>
        </div>
      );
    }

    if (activeGame.type === "result") {
      return (
        <div className="center-box">
          <div className="game-inner-title">{activeGame.title}</div>
          <div className="game-inner-sub">{activeGame.subtitle}</div>
          <div className="result-emoji">{activeGame.emoji}</div>
          <div className="result-msg">{activeGame.label}</div>
          <button className="btn strong" type="button" onClick={() => startGame(activeGame.regionKey)}>
            다시하기 🔄
          </button>
        </div>
      );
    }

    if (activeGame.type === "frontal") {
      return (
        <div className="center-box">
          <div className="game-inner-title">전두엽 게임 · 숫자 기억</div>
          <div className="game-inner-sub">
            {activeGame.phase === "memorize"
              ? "아래 숫자를 잘 기억해 주세요!"
              : "기억한 숫자를 순서대로 입력해 보세요!"}
          </div>
          {activeGame.phase === "memorize" ? (
            <>
              <div className="big-number">{activeGame.answer.split("").join("  ")}</div>
              <div style={{ fontSize: "18px", color: "var(--text-light)" }}>2초 뒤 사라져요</div>
            </>
          ) : (
            <div className="answer-row">
              <input
                ref={inputRef}
                className="text-input"
                value={activeGame.input}
                placeholder="숫자 입력"
                autoComplete="off"
                inputMode="numeric"
                onChange={(event) =>
                  setActiveGame((previousGame) =>
                    previousGame?.type === "frontal"
                      ? { ...previousGame, input: event.target.value }
                      : previousGame,
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleFrontalSubmit();
                }}
              />
              <button className="btn strong" type="button" onClick={handleFrontalSubmit}>
                확인 ✓
              </button>
            </div>
          )}
        </div>
      );
    }

    if (activeGame.type === "parietal") {
      return (
        <div className="center-box">
          <div className="game-inner-title">두정엽 게임 · 위치 찾기</div>
          <div className="game-inner-sub">
            ⭐ 칸을 찾아서 눌러 주세요! ({Math.floor(activeGame.targetIndex / 3) + 1}행{" "}
            {(activeGame.targetIndex % 3) + 1}열)
          </div>
          <div className="quiz-grid">
            {Array.from({ length: 9 }, (_, index) => (
              <button
                key={index}
                className="quiz-cell"
                type="button"
                onClick={() => handleParietalSelect(index)}
              >
                {index === activeGame.targetIndex ? "⭐" : "○"}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (activeGame.type === "temporal") {
      return (
        <div className="center-box">
          <div className="game-inner-title">측두엽 게임 · 단어 기억</div>
          <div className="game-inner-sub">
            {activeGame.phase === "memorize"
              ? "아래 단어들을 잘 기억해 주세요!"
              : "아까 본 단어를 모두 눌러서 선택해 주세요!"}
          </div>
          {activeGame.phase === "memorize" ? (
            <>
              <div className="big-word" style={{ fontSize: "44px", letterSpacing: "6px" }}>
                {activeGame.selectedWords.join("  ·  ")}
              </div>
              <div style={{ fontSize: "18px", color: "var(--text-light)" }}>
                잠시 뒤 선택 화면으로 바뀌어요
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  justifyContent: "center",
                  maxWidth: "480px",
                }}
              >
                {activeGame.choices.map((word) => (
                  <button
                    key={word}
                    type="button"
                    className={`btn ghost temporal-choice ${
                      activeGame.pickedWords.includes(word) ? "selected" : ""
                    }`}
                    style={{ fontSize: "20px", padding: "16px 22px", minWidth: "110px" }}
                    onClick={() => handleToggleTemporalWord(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
              <button className="btn strong" type="button" onClick={handleTemporalSubmit}>
                확인 ✓
              </button>
            </>
          )}
        </div>
      );
    }

    if (activeGame.type === "occipital") {
      return (
        <div className="center-box">
          <div className="game-inner-title">후두엽 게임 · 모양 찾기</div>
          <div className="game-inner-sub">"{activeGame.target}" 모양을 모두 찾아서 눌러 주세요!</div>
          <div className="visual-grid">
            {activeGame.board.map((shape, index) => (
              <button
                key={`${shape}-${index}`}
                type="button"
                className={`visual-card ${
                  activeGame.clickedIndexes.includes(index) ? "selected" : ""
                }`}
                onClick={() => handleToggleOccipitalIndex(index)}
              >
                {shape}
              </button>
            ))}
          </div>
          <button className="btn strong" type="button" onClick={handleOccipitalSubmit}>
            확인 ✓
          </button>
        </div>
      );
    }

    if (activeGame.type === "cerebellum") {
      return (
        <div className="center-box">
          <div className="game-inner-title">소뇌 게임 · 반응속도</div>
          <div className="game-inner-sub">화면이 바뀌면 바로 눌러 주세요!</div>
          <button
            className="reaction-box"
            type="button"
            onClick={handleCerebellumClick}
            style={
              activeGame.ready
                ? {
                    background: "var(--blue-pale)",
                    borderColor: "var(--blue-dark)",
                    borderStyle: "solid",
                    color: "var(--blue-dark)",
                    fontSize: "36px",
                  }
                : undefined
            }
          >
            {activeGame.ready ? "지금 눌러요! 👆" : "⏳ 기다려 주세요..."}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="game-page">
      <nav className="navbar">
        <button className="nav-logo" id="logoBtn" type="button" onClick={handleLogoClick}>
          <img src="/img/brain-blue.png" className="brain-logo" alt="브레인 코드 로고" />
          <span className="logo-text">브레인 코드</span>
        </button>
        <div className="nav-right">
          <button className="nav-btn" id="openStatsBtn" type="button" onClick={() => router.push("/progress")}>
            통계
          </button>
          <button
            className="nav-btn"
            id="openSettingsBtn"
            type="button"
            onClick={() => setIsSettingsOpen(true)}
          >
            설정
          </button>
        </div>
      </nav>

      <main className="page-body">
        <div className="page-inner">
          <div id="brainSelectView" style={{ display: selectedRegionKey ? "none" : "block" }}>
            <div className="page-hero">
              <h1>어떤 게임을 해볼까요?</h1>
              <p>뇌의 영역에 마우스를 올리고 클릭해서 게임을 시작해 보세요.</p>
            </div>
            <div className="brain-stage" id="brainStage">
              <img className="brain-img" src="/img/brain.png" alt="뇌 그림" />
              <svg className="brain-svg" id="brainSvg" viewBox="0 0 1280 698" preserveAspectRatio="none">
                <defs>
                  <mask id="dimMask">
                    <rect x="0" y="0" width="1280" height="698" fill="white" />
                    <polygon id="brightRegion" points={hoveredRegion ? ptsToString(hoveredRegion.pts) : ""} fill="black" />
                  </mask>
                </defs>
                <rect
                  id="dimOverlay"
                  x="0"
                  y="0"
                  width="1280"
                  height="698"
                  fill="rgba(10,25,60,0.58)"
                  mask="url(#dimMask)"
                  style={{
                    display: hoveredRegion ? "block" : "none",
                    pointerEvents: "none",
                  }}
                />
                {Object.values(regionData).map((region) => (
                  <polygon
                    key={region.key}
                    className="region"
                    points={ptsToString(region.pts)}
                    onMouseEnter={() => setHoveredRegionKey(region.key)}
                    onMouseLeave={() => setHoveredRegionKey((previousKey) => (previousKey === region.key ? null : previousKey))}
                    onClick={() => handleSelectRegion(region.key)}
                  />
                ))}
              </svg>
              <div
                className="brain-label"
                id="brainLabel"
                style={{ display: hoveredRegion ? "flex" : "none" }}
              >
                <span className="brain-label-name" id="brainLabelName">
                  {hoveredRegion?.name ?? ""}
                </span>
                <span className="brain-label-desc" id="brainLabelDesc">
                  {hoveredRegion?.desc ?? ""}
                </span>
                <span className="brain-label-hint">클릭해서 게임 시작!</span>
              </div>
            </div>
          </div>

          <div id="gameView" style={{ display: selectedRegionKey ? "block" : "none" }}>
            <div className="game-card">
              <div className="game-header-bar">
                <div className="game-region-info">
                  <img
                    className="game-region-thumb"
                    id="gameRegionThumb"
                    src={selectedRegion ? regionImages[selectedRegion.key] : "/img/brain-blue.png"}
                    alt={selectedRegion?.name ?? ""}
                  />
                  <span className="game-region-name" id="gameRegionName">
                    {selectedRegion?.name ?? ""}
                  </span>
                  <span className="score-display" id="todayScoreDisplay">
                    점수: {selectedRegionKey ? todayScores[selectedRegionKey] : 0}
                  </span>
                </div>
                <button className="btn ghost" id="backToBrainBtn" type="button" onClick={handleBackToBrain}>
                  ← 영역 다시 선택
                </button>
              </div>
              <div className="game-shell" id="gameShell">
                {renderGameBody()}
              </div>
            </div>
          </div>
        </div>
      </main>

      <div
        className={`modal-backdrop ${isSettingsOpen ? "show" : ""}`}
        id="settingsModal"
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsSettingsOpen(false);
        }}
      >
        <div className="modal">
          <div className="modal-head">
            <h3>설정</h3>
            <button
              className="btn ghost"
              id="closeSettingsBtn"
              style={{ fontSize: "15px", padding: "10px 18px" }}
              type="button"
              onClick={() => setIsSettingsOpen(false)}
            >
              닫기
            </button>
          </div>
          <p>게임 진행에 필요한 기본 옵션입니다.</p>
          <div className="modal-grid">
            <div className="setting-item">
              <label htmlFor="soundToggle">효과 문구 표시</label>
              <select
                className="select"
                id="soundToggle"
                value={settings.effectText}
                onChange={(event) =>
                  setSettings((previousSettings) => ({
                    ...previousSettings,
                    effectText: event.target.value,
                  }))
                }
              >
                <option value="on">켜기</option>
                <option value="off">끄기</option>
              </select>
            </div>
            <div className="setting-item">
              <label htmlFor="autoShowStats">결과 뒤 통계 문구</label>
              <select
                className="select"
                id="autoShowStats"
                value={settings.resultHint}
                onChange={(event) =>
                  setSettings((previousSettings) => ({
                    ...previousSettings,
                    resultHint: event.target.value,
                  }))
                }
              >
                <option value="on">켜기</option>
                <option value="off">끄기</option>
              </select>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
