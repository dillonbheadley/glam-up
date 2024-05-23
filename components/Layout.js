import { html } from "../utils.js";

/**
 *
 * @param {object} props description
 * @param {string} props.content inserted into the body element
 */
export const Layout = ({ content }) => {
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Glam up challenge</title>
        <link rel="stylesheet" href="style.css" />
        <script src="script.js" defer></script>
        <meta name="view-transition" content="same-origin" />
      </head>
      <body>
        <div id="test">test</div>
        <hz-boost data-target="#test" data-swap="append" data-select="h1">
          <a href="/">boost me</a>
        </hz-boost>
        ${content}
      </body>
    </html>`;
};
