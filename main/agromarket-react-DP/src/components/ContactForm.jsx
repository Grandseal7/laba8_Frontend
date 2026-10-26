
import { apiFetch } from "../api.js";

function ContactForm() {
  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const data = Object.fromEntries(new FormData(form));

    try {
      const result = await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify(data),
      });

      alert(`Заявка №${result.id} принята!`);
      form.reset();
    } catch (error) {
      alert(`Не удалось отправить заявку: ${error.message}`);
    }
  }

  return (
    <section id="contact" className="contact">
      <h2>Оптовая заявка</h2>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Имя / организация</label>
        <input id="name" name="name" type="text" required />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="farmer@mail.kz"
        />

        <label htmlFor="phone">Телефон</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+7 7XX XXX XX XX"
        />

        <label htmlFor="quantity">Объём заказа, кг</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min="10"
          required
        />

        <label htmlFor="date">Желаемая дата доставки</label>
        <input id="date" name="date" type="date" />

        <label htmlFor="comment">Комментарий</label>
        <textarea id="comment" name="comment" rows="4" />

        <button type="submit">Отправить заявку</button>
      </form>
    </section>
  );
}

export default ContactForm;
