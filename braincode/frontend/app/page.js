'use client'
import { useRouter } from 'next/navigation'
import './main.css'

export default function MainPage() {
  const router = useRouter()

  return (
    <>
      {/* NAV */}
      <nav className="navbar">
        <a href="/" className="nav-left">
          <span className="logo-text">브레인 코드</span>
        </a>
        <ul className="menu">
          <li><a onClick={() => router.push('/login')}>로그인</a></li>
          <li><a onClick={() => router.push('/signup')}>회원가입</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">발달장애 아동을 위한 학습 플랫폼</div>
        <h1>발달장애 아동을 위한<br />인지 훈련 게임 플랫폼</h1>
        <p>아이의 인지능력과 소통능력을 키워요!<br />다양한 게임으로 즐겁게 학습해요!</p>
        <button className="hero-btn" onClick={() => router.push('/login')}>
          지금 무료로 시작하기 →
        </button>
      </section>

      {/* PROBLEM CARDS */}
      <section className="section">
        <h2 className="section-title">이런 어려움을 함께 해결해요</h2>
        <div className="cards-grid">
          <div className="card">
            <div className="card-icon">💬</div>
            <h3>의사소통 어려움</h3>
            <p>말 이해와 표현 능력 저하로 인한 소통의 어려움</p>
          </div>
          <div className="card">
            <div className="card-icon">📚</div>
            <h3>기초학습 어려움</h3>
            <p>놀이 학습 집중력 부족으로 인한 학습 어려움</p>
          </div>
          <div className="card">
            <div className="card-icon">👨‍👩‍👧</div>
            <h3>부모님의 부담</h3>
            <p>일상적인 학습 지도에서 오는 심리적·시간적 부담</p>
          </div>
          <div className="card">
            <div className="card-icon">✨</div>
            <h3>동기 부족</h3>
            <p>학습에 흥미를 느끼기 어려워 지속이 힘든 상황</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-banner">
          <p>발달장애 아동의 두뇌 발달 게임으로<br />아이학습 오늘부터 시작해 보세요!</p>
          <button className="cta-btn" onClick={() => router.push('/login')}>
            지금 시작하기 →
          </button>
        </div>
      </section>

      <footer>© 2026 브레인 코드. 발달장애 아동을 위한 인지 훈련 플랫폼.</footer>
    </>
  )
}