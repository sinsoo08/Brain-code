"use client";

import { useEffect } from "react";
import "./game.css";
import { initGamePage } from "./runtime";

export default function GamePage() {
  useEffect(() => initGamePage(), []);

  return (
    <div className="game-page">
      <nav className="navbar">
        <button className="nav-logo" id="logoBtn" type="button">
          <img
            src="/img/brain-blue.png"
            className="brain-logo"
            alt="브레인 코드 로고"
          />
          <span className="logo-text">브레인 코드</span>
        </button>
        <div className="nav-right">
          <button className="nav-btn" id="openStatsBtn" type="button">
            통계
          </button>
          <button className="nav-btn" id="openSettingsBtn" type="button">
            설정
          </button>
        </div>
      </nav>

      <main className="page-body">
        <div className="page-inner">
          <div id="brainSelectView">
            <div className="page-hero">
              <h1>어떤 게임을 할까요?</h1>
              <p>뇌의 영역에 마우스를 올리고 클릭해 보세요!</p>
            </div>
            <div className="brain-stage" id="brainStage">
              <img className="brain-img" src="/img/brain.png" alt="뇌 그림" />
              <svg
                className="brain-svg"
                id="brainSvg"
                viewBox="0 0 1280 698"
                preserveAspectRatio="none"
              >
                <defs>
                  <mask id="dimMask">
                    <rect x="0" y="0" width="1280" height="698" fill="white" />
                    <polygon id="brightRegion" points="" fill="black" />
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
                  style={{ display: "none", pointerEvents: "none" }}
                />
              </svg>
              <div className="brain-label" id="brainLabel">
                <span className="brain-label-name" id="brainLabelName"></span>
                <span className="brain-label-desc" id="brainLabelDesc"></span>
                <span className="brain-label-hint">클릭해서 게임 시작!</span>
              </div>
            </div>
          </div>

          <div id="gameView">
            <div className="game-card">
              <div className="game-header-bar">
                <div className="game-region-info">
                  <img
                    className="game-region-thumb"
                    id="gameRegionThumb"
                    src="/img/brain-blue.png"
                    alt=""
                  />
                  <span className="game-region-name" id="gameRegionName"></span>
                  <span className="score-display" id="todayScoreDisplay">
                    점수: 0
                  </span>
                </div>
                <button className="btn ghost" id="backToBrainBtn" type="button">
                  ← 영역 다시 선택
                </button>
              </div>
              <div className="game-shell" id="gameShell">
                <div className="center-box" style={{ minHeight: "300px" }}>
                  <div className="game-inner-title">영역을 선택해 주세요</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div style={{ display: "none" }}>
        <div id="totalPlaysValue">0</div>
        <div id="bestScoreValue">0</div>
        <div id="accuracyValue">0%</div>
        <div id="bestReactionValue">-</div>
      </div>

      <div className="modal-backdrop" id="settingsModal">
        <div className="modal">
          <div className="modal-head">
            <h3>설정</h3>
            <button
              className="btn ghost"
              id="closeSettingsBtn"
              style={{ fontSize: "15px", padding: "10px 18px" }}
              type="button"
            >
              닫기
            </button>
          </div>
          <p>게임 진행에 필요한 기본 옵션입니다.</p>
          <div className="modal-grid">
            <div className="setting-item">
              <label htmlFor="soundToggle">효과 문구 표시</label>
              <select className="select" id="soundToggle" defaultValue="on">
                <option value="on">켜기</option>
                <option value="off">끄기</option>
              </select>
            </div>
            <div className="setting-item">
              <label htmlFor="autoShowStats">결과 후 통계 문구</label>
              <select className="select" id="autoShowStats" defaultValue="on">
                <option value="on">켜기</option>
                <option value="off">끄기</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop" id="statsModal">
        <div className="modal stats-modal">
          <div
            className="modal-head"
            style={{
              position: "sticky",
              top: 0,
              background: "white",
              zIndex: 10,
              paddingBottom: "12px",
              borderBottom: "1.5px solid var(--blue-pale)",
            }}
          >
            <h3>플레이 통계</h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="btn ghost"
                id="resetStatsBtn"
                style={{ fontSize: "14px", padding: "9px 16px" }}
                type="button"
              >
                초기화
              </button>
              <button
                className="btn ghost"
                id="closeStatsBtn"
                style={{ fontSize: "14px", padding: "9px 16px" }}
                type="button"
              >
                닫기
              </button>
            </div>
          </div>
          <div
            className="modal-grid"
            id="quickStatsModalBody"
            style={{ marginTop: "20px" }}
          ></div>
          <div
            style={{
              marginTop: "28px",
              borderTop: "1.5px solid var(--blue-pale)",
              paddingTop: "20px",
            }}
          >
            <h4>게임별 세부 기록</h4>
            <div id="detailStatsInModal"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
