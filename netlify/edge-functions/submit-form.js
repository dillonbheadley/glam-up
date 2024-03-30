import { Layout } from "../../components/Layout.js";
import { ThankYou } from "../../components/ThankYou.js";

export const config = { path: "/submit-form" };

export default (req, context) => {
  if (req.method === "POST") {
    // validation here

    let body;
    if (req.headers.get("Sec-Fetch-Dest") === "document") {
      body = Layout({ content: ThankYou() });
    } else {
      body = ThankYou();
    }

    return new Response(body, {
      headers: { "content-type": "text/html" },
    });
  }
  return Response.redirect("/");
};
