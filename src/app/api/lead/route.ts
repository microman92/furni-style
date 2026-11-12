import { NextResponse } from "next/server";
import { estimate, parseEstimate } from "@/lib/calc";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.get("host"))
        return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }
  }
  const text = await request.text();
  if (text.length > 20000)
    return NextResponse.json(
      { error: "Слишком большой запрос" },
      { status: 413 },
    );
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }
  if (!data || typeof data !== "object")
    return NextResponse.json({ error: "Некорректная заявка" }, { status: 400 });
  if (data.website) return NextResponse.json({ ok: true });
  if (
    typeof data.name !== "string" ||
    data.name.trim().length < 2 ||
    data.name.length > 80 ||
    typeof data.phone !== "string" ||
    !/^998\d{9}$/.test(data.phone.replace(/\D/g, "")) ||
    data.consent !== true ||
    (data.message != null &&
      (typeof data.message !== "string" || data.message.length > 2000))
  )
    return NextResponse.json(
      { error: "Проверьте имя, телефон и согласие" },
      { status: 400 },
    );
  let summary;
  if (data.estimate) {
    try {
      summary = estimate(parseEstimate(data.estimate));
    } catch {
      return NextResponse.json(
        { error: "Некорректная смета" },
        { status: 400 },
      );
    }
  }
  // Точка подключения CRM/Telegram. Не объявлять доставленной до ответа интеграции.
  console.info("[Furni Style demo lead]", {
    name: data.name.trim(),
    phone: data.phone,
    message: data.message ?? "",
    estimate: summary,
    receivedAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true, mode: "demo" });
}
