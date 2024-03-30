import { Form } from "../../components/Form.js";
import { Layout } from "../../components/Layout.js";

export const config = { path: "/" };

export default (req, context) => {
  let body;
  if (req.headers.get("Sec-Fetch-Dest") === "document") {
    body = Layout({ content: Form() });
  } else {
    body = Form();
  }

  return new Response(body, {
    headers: { "content-type": "text/html" },
  });
};
