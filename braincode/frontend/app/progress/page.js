"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../progress.css";

const areaData = {
  전두엽: {
    streak: 7,
    complete: 42,
    challenge: 18,
    play: 60,
    good: "전두엽",
    goodPct: 82,
    bad: "소뇌",
    badPct: 38,
    prevScore: 40,
    thisScore: 60,
    scores: [55, 60, 58, 70, 65, 75, 60],
    prevScores: [40, 42, 38, 45, 50, 42, 40],
  },
  소뇌: {
    streak: 3,
    complete: 28,
    challenge: 10,
    play: 38,
    good: "소뇌",
    goodPct: 65,
    bad: "측두엽",
    badPct: 44,
    prevScore: 35,
    thisScore: 42,
    scores: [40, 38, 42, 45, 50, 44, 42],
    prevScores: [30, 32, 28, 35, 38, 34, 35],
  },
  해마: {
    streak: 5,
    complete: 35,
    challenge: 14,
    play: 49,
    good: "해마",
    goodPct: 75,
    bad: "두정엽",
    badPct: 50,
    prevScore: 50,
    thisScore: 65,
    scores: [58, 62, 60, 68, 65, 72, 65],
    prevScores: [48, 50, 46, 52, 55, 50, 50],
  },
  후두엽: {
    streak: 1,
    complete: 15,
    challenge: 6,
    play: 21,
    good: "후두엽",
    goodPct: 60,
    bad: "해마",
    badPct: 48,
    prevScore: 38,
    thisScore: 42,
    scores: [40, 38, 44, 42, 46, 44, 42],
    prevScores: [36, 34, 38, 36, 40, 38, 38],
  },
  두정엽: {
    streak: 2,
    complete: 20,
    challenge: 8,
    play: 28,
    good: "두정엽",
    goodPct: 70,
    bad: "전두엽",
    badPct: 55,
    prevScore: 45,
    thisScore: 50,
    scores: [48, 50, 52, 55, 50, 54, 50],
    prevScores: [42, 44, 40, 46, 48, 44, 45],
  },
};

const SIDEBAR_ITEMS = [
  { icon: "🧠", name: "전두엽" },
  { icon: "⚡", name: "소뇌" },
  { icon: "🎯", name: "해마" },
  { icon: "🌟", name: "두정엽" },
  { icon: "🌈", name: "후두엽" },
];

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

export default function ProgressPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    difficulty: "쉬움",
    hint: true,
    timer: false,
    sfx: true,
    bgm: true,
    volume: 70,
  });
  const [currentArea, setCurrentArea] = useState("전두엽");
  const [settingTab, setSettingTab] = useState("game");
  const [modalOpen, setModalOpen] = useState(false);

  const d = areaData[currentArea];
  const diff = d.thisScore - d.prevScore;
  const max = Math.max(...d.scores, ...d.prevScores) * 1.1;

  return (
    <div className="progress-page">
      {/* TOP BAR */}
      <div className="topbar">
        <button className="back-btn" onClick={() => router.back()}>
          ← 돌아가기
        </button>
        <div className="topbar-title">
          우리
          <span className="topbar-divider">|</span>
          <span className="team-badge">프로필</span>
          <span className="topbar-profile-info">
            <span className="topbar-profile-name">이름</span>
            <span className="topbar-profile-birth">생일</span>
          </span>
          의
        </div>
        <button className="settings-btn" onClick={() => setModalOpen(true)}>
          ⚙️ 설정
        </button>
      </div>

      {/* LAYOUT */}
      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-label">목록</div>
          {SIDEBAR_ITEMS.map((item, idx) => (
            <div key={item.name}>
              <div
                className={`sidebar-item ${currentArea === item.name ? "active" : ""}`}
                onClick={() => setCurrentArea(item.name)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.name}</span>
              </div>
              {idx < SIDEBAR_ITEMS.length - 1 && (
                <div className="sidebar-waves">
                  <div className="wave-line"></div>
                  <div className="wave-line"></div>
                  <div className="wave-line"></div>
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* HERO BANNER */}
          <div className="hero-banner">
            <div className="hero-banner-left">
              <h2>{currentArea}</h2>
              <p>인지·집중 훈련 영역 · 연속훈련 🔥 D+{d.streak}</p>
            </div>
            <div className="hero-streak">
              <span className="streak-num">🔥 {d.streak}</span>
              <span className="streak-label">연속 훈련일</span>
            </div>
          </div>

          {/* STATS */}
          <div className="section-title">📊 플레이 통계</div>
          <div className="stats-grid">
            <div className="stat-card blue">
              <span className="stat-tag blue">완료 플레이</span>
              <div className="stat-value">
                {d.complete}
                <span>H</span>
              </div>
            </div>
            <div className="stat-card green">
              <span className="stat-tag green">도전</span>
              <div className="stat-value">
                {d.challenge}
                <span>H</span>
              </div>
            </div>
            <div className="stat-card orange">
              <span className="stat-tag orange">플레이</span>
              <div className="stat-value">
                {d.play}
                <span>회</span>
              </div>
            </div>
          </div>

          {/* INSIGHT */}
          <div className="section-title">💡 인사이트</div>
          <div className="insight-grid">
            <div className="insight-card">
              <span className="insight-tag good">잘하는 영역</span>
              <div className="insight-area">강점 뇌 영역</div>
              <div className="insight-name">{d.good}</div>
              <div className="insight-bar-wrap">
                <div
                  className="insight-bar good"
                  style={{ width: d.goodPct + "%" }}
                ></div>
              </div>
              <div className="insight-desc">
                정답률 <strong>{d.goodPct}%</strong> · 최고 기록 🏆
              </div>
            </div>

            <div className="insight-card">
              <span className="insight-tag bad">부족한 영역</span>
              <div className="insight-area">개선이 필요한 뇌 영역</div>
              <div className="insight-name">{d.bad}</div>
              <div className="insight-bar-wrap">
                <div
                  className="insight-bar bad"
                  style={{ width: d.badPct + "%" }}
                ></div>
              </div>
              <div className="insight-desc">
                정답률 <strong>{d.badPct}%</strong> · 더 연습해봐요 💪
              </div>
            </div>

            <div className="insight-card">
              <span className="insight-tag compare">이번 vs 지번</span>
              <div className="insight-area">점수 비교</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  margin: "6px 0",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--text-light)",
                      marginBottom: "2px",
                    }}
                  >
                    지난주
                  </div>
                  <div className="compare-num" style={{ fontSize: "22px" }}>
                    {d.prevScore}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "Jua,sans-serif",
                    fontSize: "18px",
                    color: diff >= 0 ? "var(--green)" : "var(--danger)",
                  }}
                >
                  {diff >= 0 ? `↑ +${diff}` : `↓ ${diff}`}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--text-light)",
                      marginBottom: "2px",
                    }}
                  >
                    이번주
                  </div>
                  <div
                    className="compare-num"
                    style={{
                      fontSize: "22px",
                      color: diff >= 0 ? "var(--green)" : "var(--danger)",
                    }}
                  >
                    {d.thisScore}
                  </div>
                </div>
              </div>
              <div className="compare-sub">
                {diff >= 0
                  ? `이번 주가 ${diff}점 올랐어요 📈`
                  : `이번 주가 ${Math.abs(diff)}점 내렸어요 📉`}
              </div>
            </div>
          </div>

          {/* CHART */}
          <div className="section-title">📈 최근 7일 점수</div>
          <div className="chart-card">
            <div className="chart-header">
              <span className="chart-title">일별 훈련 점수</span>
              <div className="chart-legend">
                <div className="legend-item">
                  <div
                    className="legend-dot"
                    style={{ background: "var(--blue-dark)" }}
                  ></div>
                  이번 주
                </div>
                <div className="legend-item">
                  <div
                    className="legend-dot"
                    style={{ background: "var(--blue-pale)" }}
                  ></div>
                  지난 주
                </div>
              </div>
            </div>
            <div className="chart-area">
              {DAYS.map((day, i) => {
                const thisH = Math.round((d.scores[i] / max) * 90);
                const prevH = Math.round((d.prevScores[i] / max) * 90);
                return (
                  <div key={day} className="bar-col">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "3px",
                        height: "90px",
                      }}
                    >
                      <div
                        className="bar prev"
                        style={{ height: prevH + "px", flex: 1 }}
                      ></div>
                      <div
                        className="bar this"
                        style={{ height: thisH + "px", flex: 1 }}
                      ></div>
                    </div>
                    <div className="bar-label">{day}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* 설정 모달 */}
      {modalOpen && (
        <div
          className="s-modal open"
          onClick={(e) => {
            if (e.target.classList.contains("s-modal")) setModalOpen(false);
          }}
        >
          <div className="s-modal-content">
            <div className="s-modal-header">
              <span className="s-modal-title">설정</span>
              <button
                className="s-close-btn"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="s-tab-bar">
              {["game", "sound", "account"].map((tab) => (
                <button
                  key={tab}
                  className={`s-tab-btn ${settingTab === tab ? "active" : ""}`}
                  onClick={() => setSettingTab(tab)}
                >
                  <span className="s-tab-icon">
                    {tab === "game" ? "🎮" : tab === "sound" ? "🔊" : "👤"}
                  </span>
                  <span className="s-tab-label">
                    {tab === "game"
                      ? "게임"
                      : tab === "sound"
                        ? "소리"
                        : "계정"}
                  </span>
                </button>
              ))}
            </div>

            {settingTab === "game" && (
              <div className="s-tab-panel active">
                <div className="s-row">
                  <div className="s-info">
                    <span className="s-label">난이도</span>
                    <span className="s-desc">문제의 어려움을 조절해요</span>
                  </div>
                  <div className="s-seg">
                    {["쉬움", "보통", "어려움"].map((d) => (
                      <button
                        key={d}
                        className={`s-seg-btn ${settings.difficulty === d ? "active" : ""}`}
                        onClick={() =>
                          setSettings({ ...settings, difficulty: d })
                        }
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="s-row">
                  <div className="s-info">
                    <span className="s-label">힌트 보기</span>
                    <span className="s-desc">문제 풀 때 힌트를 보여줘요</span>
                  </div>
                  <label className="s-toggle">
                    <input
                      type="checkbox"
                      checked={settings.hint}
                      onChange={(e) =>
                        setSettings({ ...settings, hint: e.target.checked })
                      }
                    />
                  </label>
                </div>
                <div className="s-row">
                  <div className="s-info">
                    <span className="s-label">타이머</span>
                    <span className="s-desc">제한 시간을 표시해요</span>
                  </div>
                  <label className="s-toggle">
                    <input
                      type="checkbox"
                      checked={settings.timer}
                      onChange={(e) =>
                        setSettings({ ...settings, timer: e.target.checked })
                      }
                    />
                  </label>
                </div>
              </div>
            )}

            {settingTab === "sound" && (
              <div className="s-tab-panel active">
                <div className="s-row">
                  <div className="s-info">
                    <span className="s-label">효과음</span>
                    <span className="s-desc">버튼 클릭·정답 효과음</span>
                  </div>
                  <label className="s-toggle">
                    <input
                      type="checkbox"
                      checked={settings.sfx}
                      onChange={(e) =>
                        setSettings({ ...settings, sfx: e.target.checked })
                      }
                    />
                  </label>
                </div>
                <div className="s-row">
                  <div className="s-info">
                    <span className="s-label">배경음악</span>
                    <span className="s-desc">게임 중 배경음악을 틀어요</span>
                  </div>
                  <label className="s-toggle">
                    <input
                      type="checkbox"
                      checked={settings.bgm}
                      onChange={(e) =>
                        setSettings({ ...settings, bgm: e.target.checked })
                      }
                    />
                  </label>
                </div>
                <div className="s-row s-row-col">
                  <div className="s-info">
                    <span className="s-label">전체 볼륨</span>
                    <span className="s-desc">소리 크기를 조절해요</span>
                  </div>
                  <div className="s-slider-wrap">
                    <span className="s-slider-icon">🔈</span>
                    <input
                      type="range"
                      className="s-slider"
                      min="0"
                      max="100"
                      value={settings.volume}
                      onChange={(e) =>
                        setSettings({ ...settings, volume: e.target.value })
                      }
                    />
                    <span className="s-slider-icon">🔊</span>
                  </div>
                </div>
              </div>
            )}

            {settingTab === "account" && (
              <div className="s-tab-panel active">
                <div className="s-row">
                  <div className="s-info">
                    <span className="s-label">이름</span>
                    <span className="s-desc">프로필에 표시되는 이름</span>
                  </div>
                  <input
                    type="text"
                    className="s-input"
                    placeholder="이름 입력"
                  />
                </div>
                <div className="s-row">
                  <div className="s-info">
                    <span className="s-label">아바타 변경</span>
                    <span className="s-desc">캐릭터를 다시 골라요</span>
                  </div>
                  <button
                    className="s-link-btn"
                    onClick={() => router.push("/avatar")}
                  >
                    변경 →
                  </button>
                </div>
                <div className="s-row">
                  <div className="s-info">
                    <span className="s-label">기록 초기화</span>
                    <span className="s-desc">모든 학습 기록을 지워요</span>
                  </div>
                  <button className="s-danger-btn">초기화</button>
                </div>
              </div>
            )}

            <div className="s-modal-footer">
              <button
                className="s-save-btn"
                onClick={() => {
                  localStorage.setItem("settings", JSON.stringify(settings));
                  setModalOpen(false);
                }}
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
