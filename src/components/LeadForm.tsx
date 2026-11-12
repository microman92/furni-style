"use client";
import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { estimate as calculate, money, type EstimateState } from "@/lib/calc";
export default function LeadForm({ estimate }: { estimate?: EstimateState }) {
  const [phone, setPhone] = useState("+998");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const phoneRef = useRef<HTMLInputElement>(null);
  const errorId = useId();
  function formatPhone(raw: string) {
    let digits = raw.replace(/\D/g, "");
    if (digits.startsWith("998")) digits = digits.slice(3);
    digits = digits.slice(0, 9);
    return (
      "+998" +
      (digits.length ? ` (${digits.slice(0, 2)}` : "") +
      (digits.length >= 2 ? ") " : "") +
      digits.slice(2, 5) +
      (digits.length > 5 ? `-${digits.slice(5, 7)}` : "") +
      (digits.length > 7 ? `-${digits.slice(7, 9)}` : "")
    );
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    if (phone.replace(/\D/g, "").length !== 12) {
      setPhoneError("Телефон: введите 9 цифр номера после +998.");
      setStatus("error");
      phoneRef.current?.focus();
      return;
    }
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    setError("");
    setPhoneError("");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone,
          message: data.get("message"),
          website: data.get("website"),
          consent: data.get("consent") === "on",
          estimate,
        }),
      });
      if (!response.ok)
        throw new Error("Не удалось записать заявку. Попробуйте ещё раз.");
      setStatus("success");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ошибка соединения. Попробуйте ещё раз.",
      );
      setStatus("error");
    }
  }
  if (status === "success")
    return (
      <div role="status" className="success-message">
        <span>✓</span>
        <h3>Демо-заявка записана</h3>
        <p>
          Форма работает в тестовом режиме. Данные переданы в серверный журнал;
          отправка менеджеру пока не подключена.
        </p>
        <button className="copy-button" onClick={() => setStatus("idle")}>
          Создать ещё заявку ↗︎
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className="lead-form">
      <p>Оставьте номер. Обсудим размеры, материалы и ваши идеи.</p>
      {estimate && <p>Ваша смета: {money(calculate(estimate).total)} UZS</p>}
      <div className="fields-grid">
        <label className="field">
          Ваше имя
          <input
            name="name"
            autoComplete="given-name"
            required
            minLength={2}
            maxLength={80}
            placeholder="Как к вам обращаться"
          />
        </label>
        <label className="field">
          Телефон
          <input
            ref={phoneRef}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            aria-invalid={Boolean(phoneError)}
            aria-describedby={phoneError ? errorId : undefined}
            required
          />
          {phoneError && (
            <span className="field-error" id={errorId}>
              {phoneError}
            </span>
          )}
        </label>
      </div>
      <label className="field">
        Пара слов о проекте <small>(необязательно)</small>
        <textarea
          name="message"
          maxLength={2000}
          rows={2}
          placeholder="Например: угловая кухня 4 метра, фасады под дерево"
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Сайт
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          Я согласен на обработку данных согласно{" "}
          <Link href="/politika">политике конфиденциальности</Link>.
        </span>
      </label>
      <button className="button" disabled={status === "sending"}>
        {status === "sending" ? "Отправляем…" : "Обсудить проект"}{" "}
        <span>↗︎</span>
      </button>
      <p className="form-message" role="status">
        {error}
      </p>
      <small className="demo-note">
        Демо-форма: заявки сохраняются только в серверный журнал.
      </small>
    </form>
  );
}
