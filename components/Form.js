import { html } from "../utils.js";

export const Form = () => {
  return html`<section id="camp-activities-inquiry">
    <h1>Camp Activities Inquiry</h1>
    <hz-boost data-target="#camp-activities-inquiry" data-swap="replaceWith">
      <form action="/submit-form" method="POST">
        <label for="activity-select">
          Which camp activities are you most looking forward to?
        </label>
        <select id="activity-select" name="activity">
          <option value="">--Please choose an option--</option>
          <option value="hiking">Hiking</option>
          <option value="canoeing">Canoeing</option>
          <option value="fishing">Fishing</option>
          <option value="crafts">Crafts</option>
          <option value="archery">Archery</option>
        </select>
        <label for="food-allergies">Food Allergies (if any)</label>
        <textarea
          id="food-allergies"
          name="food_allergies"
          rows="4"
          cols="50"
        ></textarea>
        <label for="additional-info">
          Additional things the counselor should know
        </label>
        <textarea
          id="additional-info"
          name="additional_info"
          rows="4"
          cols="50"
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </hz-boost>
  </section>`;
};
