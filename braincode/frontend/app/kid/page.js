"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import "../kid.css";

export default function KidPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    birthYear: "",
    birthDate: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const handleSubmit = () => {
    const name = form.name.trim();
    const birthYear = form.birthYear.trim();
    const birthDate = form.birthDate.trim();

    if (!name) {
      setErrorMessage("아이 이름을 입력해 주세요.");
      return;
    }

    if (!birthYear) {
      setErrorMessage("태어난 연도를 입력해 주세요.");
      return;
    }

    if (!birthDate) {
      setErrorMessage("태어난 월일을 입력해 주세요.");
      return;
    }

    sessionStorage.setItem("kidName", name);
    sessionStorage.setItem("kidBirthYear", birthYear);
    sessionStorage.setItem("kidBirthDate", birthDate);

    router.push("/avatar");
  };

  return (
    <div className="kid-page">
      <div className="form-card">
        <div className="card-header">
          <h2>아이 정보 입력</h2>
          <p>입력한 정보를 바탕으로 맞춤형 학습을 시작해요.</p>
        </div>

        <div className="form-section">
          <div className="section-label">
            <div className="icon">📝</div>
            기본 정보
          </div>

          <div className="input-group">
            <label htmlFor="user-name">아이 이름</label>
            <input
              type="text"
              id="user-name"
              name="name"
              value={form.name}
              placeholder="이름을 입력해 주세요"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="birth-year">태어난 연도</label>
            <input
              type="number"
              id="birth-year"
              name="birthYear"
              value={form.birthYear}
              placeholder="예: 2018"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="birth-date">태어난 월일</label>
            <input
              type="text"
              id="birth-date"
              name="birthDate"
              value={form.birthDate}
              placeholder="예: 0520"
              onChange={handleChange}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSubmit();
              }}
            />
          </div>

          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        </div>

        <div className="form-footer">
          <button className="submit-btn" type="button" onClick={handleSubmit}>
            다음: 캐릭터 선택
          </button>
        </div>
      </div>
    </div>
  );
}
