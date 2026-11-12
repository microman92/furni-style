import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/api/lead/route";
function request(body: unknown, origin = "http://127.0.0.1:3001") {
  return new Request("http://localhost:3001/api/lead", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      host: "127.0.0.1:3001",
      origin,
    },
    body: JSON.stringify(body),
  });
}
test("форма принимает локальный запрос с корректным Host через Next.js", async () => {
  const response = await POST(
    request({
      name: "Тест",
      phone: "+998 (90) 123-45-67",
      consent: true,
      message: "Проверка",
    }),
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, mode: "demo" });
});
test("форма отклоняет запросы без согласия и с неверным номером", async () => {
  assert.equal(
    (
      await POST(
        request({ name: "Тест", phone: "+998901234567", consent: false }),
      )
    ).status,
    400,
  );
  assert.equal(
    (await POST(request({ name: "Тест", phone: "123", consent: true }))).status,
    400,
  );
});
test("форма отклоняет чужой origin и повреждённую смету", async () => {
  assert.equal((await POST(request({}, "https://example.com"))).status, 403);
  assert.equal(
    (
      await POST(
        request({
          name: "Тест",
          phone: "+998901234567",
          consent: true,
          estimate: { items: [{ product: "unknown" }], services: {} },
        }),
      )
    ).status,
    400,
  );
});
test("honeypot не выдаёт боту сведения о валидации", async () => {
  assert.equal((await POST(request({ website: "bot" }))).status, 200);
});
