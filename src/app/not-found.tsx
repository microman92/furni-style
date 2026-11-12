import { Button } from "@/components/ui";
export default function NotFound() {
  return (
    <section className="wrap not-found">
      <p className="eyebrow">Ошибка 404</p>
      <h1>
        Этой комнаты
        <br />
        <em>пока нет.</em>
      </h1>
      <p>
        Возможно, ссылка изменилась. Вернитесь на главную и найдите нужное
        направление.
      </p>
      <Button href="/">На главную</Button>
    </section>
  );
}
