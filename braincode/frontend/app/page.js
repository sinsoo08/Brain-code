"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./main.css";

export default function MainPage() {
  const router = useRouter();

  const images = [
    "/img/phone1.png",
    "/img/phone2.png",
    "/img/phone3.png",
    "/img/phone4.png",
    "/img/phone5.png",
    "/img/phone6.png",
  ];

  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  const changeSlide = (nextIndex) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(nextIndex);
      setFade(true);
    }, 150);
  };

  const nextSlide = () => changeSlide((current + 1) % images.length);
  const prevSlide = () => changeSlide((current - 1 + images.length) % images.length);

  return (
    <div className="main-page">

      {/* ── NAV ── */}
      <nav className="navbar">
        <Link href="/" className="nav-left">
          <img src="/img/brain-blue.png" className="brain-logo" alt="브레인 코드 로고" />
          <span className="logo-text">브레인 코드</span>
        </Link>
        <ul className="menu">
          <li><Link href="/login">로그인</Link></li>
          <li><Link href="/signup">회원가입</Link></li>
        </ul>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-badge">발달장애 아동을 위한 인지 훈련 플랫폼</div>
        <h1>
          발달장애 아동을 위한
          <br />
          인지 훈련 게임 플랫폼
        </h1>
        <p>
          아이의 인지 능력과 소통 능력을 키우고
          <br />
          다양한 게임으로 즐겁게 학습해요.
        </p>
        <button className="hero-btn" type="button" onClick={() => router.push("/login")}>
          지금 무료로 시작하기
        </button>
      </section>

      {/* ── PROBLEM CARDS ── */}
      <section className="section">
        <h2 className="section-title">이런 어려움을 함께 해결해요</h2>
        <div className="cards-grid">
          <div className="card">
            <div className="card-icon">💬</div>
            <h3>의사소통 어려움</h3>
            <p>말 이해와 표현 능력 저하로 인한 소통의 어려움을 돕습니다.</p>
          </div>
          <div className="card">
            <div className="card-icon">📘</div>
            <h3>기초학습 어려움</h3>
            <p>주의 집중과 기억력 부족으로 생기는 학습 부담을 줄여요.</p>
          </div>
          <div className="card">
            <div className="card-icon">👨‍👩‍👧</div>
            <h3>부모님의 부담</h3>
            <p>일상적인 학습 지원에서 느끼는 심리적, 시간적 부담을 덜어냅니다.</p>
          </div>
          <div className="card">
            <div className="card-icon">🧠</div>
            <h3>흥미 부족</h3>
            <p>학습을 놀이처럼 느끼도록 도와 지속하기 쉬운 환경을 만듭니다.</p>
          </div>
        </div>
      </section>

      {/* ── PHONE SLIDER SECTION ── */}
      <section className="phone-section">
        <h2 className="section-title">발달장애 아동의 학습 흐름을 쉽게 확인할 수 있어요</h2>

        <div className="phone-wrap">
          {/* 슬라이더 */}
          <div className="slider-area">
            <div className="slider-row">
              <button className="slide-btn prev" type="button" onClick={prevSlide}>←</button>
              <div className="slider-img-wrap">
                <img
                  src={images[current]}
                  alt={`앱 화면 미리보기 ${current + 1}`}
                  style={{ opacity: fade ? 1 : 0, transition: "opacity 0.15s ease" }}
                />
              </div>
              <button className="slide-btn next" type="button" onClick={nextSlide}>→</button>
            </div>
            <div className="slide-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`slide-dot${i === current ? " active" : ""}`}
                  onClick={() => changeSlide(i)}
                  aria-label={`${i + 1}번 이미지로 이동`}
                />
              ))}
            </div>
          </div>

          {/* feature list */}
          <div className="feature-list">
            <h3>부모 연동 기능</h3>
            <hr className="feature-divider" />
            <div className="feature-item">
              <img src="/img/check.png" alt="체크 아이콘" />
              <span>학습 진행 상황 확인</span>
            </div>
            <div className="feature-item">
              <img src="/img/check.png" alt="체크 아이콘" />
              <span>아이별 점수 확인</span>
            </div>
            <div className="feature-item">
              <img src="/img/check.png" alt="체크 아이콘" />
              <span>변화 기록 확인</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-banner">
          <p>
            발달장애 아동 맞춤 발달 게임으로
            <br />
            아이 학습을 오늘부터 시작해 보세요.
          </p>
          <button className="cta-btn" type="button" onClick={() => router.push("/login")}>
            지금 시작하기
          </button>
        </div>
      </section>

      <footer>© 2026 브레인 코드. 발달장애 아동을 위한 인지 훈련 플랫폼.</footer>
    </div>
  );
}