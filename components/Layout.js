import { html } from "../utils.js";

/**
 *
 * @param {Object} props description
 * @param {number} props.content inserted into the body element
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
        ${content}
      </body>
    </html>`;
};
