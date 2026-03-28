"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../avatar.css";

const AVATARS = [
  { src: "/img/dog.png", name: "강아지", emoji: "🐶" },
  { src: "/img/cat.png", name: "고양이", emoji: "🐱" },
  { src: "/img/axolotl.png", name: "우파루파", emoji: "🦎" },
  { src: "/img/raccoon.png", name: "라쿤", emoji: "🦝" },
  { src: "/img/bear.png", name: "곰", emoji: "🐻" },
];

export default function AvatarPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  function handleSelect(av) {
    setSelected(av);
  }

  function handleSubmit() {
    if (!selected) {
      alert("캐릭터를 선택해 주세요.");
      return;
    }
    sessionStorage.setItem("selectedAvatar", selected.src);
    sessionStorage.setItem("selectedAvatarName", selected.name);
    router.push("/profile");
  }

  return (
    <div className="avatar-page">
      <div className="form-card">
        <div className="card-header">
          <h2>아바타 선택</h2>
          <p>나를 대표할 캐릭터를 골라보세요</p>
        </div>

        <div className="preview-section">
          <div className={`preview-wrap ${selected ? "has-selection" : ""}`}>
            {!selected ? (
              <div className="preview-placeholder">
                <span className="preview-icon">👆</span>
                <span className="preview-hint">캐릭터를 선택해 주세요</span>
              </div>
            ) : (
              <div className="preview-selected">
                <img src={selected.src} alt={selected.name} />
              </div>
            )}
          </div>
          <p className="preview-name">{selected ? selected.name : "\u00A0"}</p>
        </div>

        <div className="form-section">
          <div className="section-label">
            <div className="icon">🐾</div>
            캐릭터 선택
          </div>
        </div>

        <div className="avatar-section">
          <div className="avatar-grid">
            {AVATARS.map((av) => (
              <div
                key={av.name}
                className={`avatar-item ${selected?.name === av.name ? "selected" : ""}`}
                onClick={() => handleSelect(av)}
              >
                <div className="avatar-img-wrap">
                  <img
                    src={av.src}
                    alt={av.name}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <span className="avatar-emoji" style={{ display: "none" }}>
                    {av.emoji}
                  </span>
                </div>
                <span className="avatar-name">{av.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-footer">
          <button className="submit-btn" onClick={handleSubmit}>
            이 캐릭터로 시작하기 →
          </button>
        </div>
      </div>
    </div>
  );
}
