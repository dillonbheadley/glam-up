document.addEventListener("click", (e) => {
  const url = e.target.getAttribute("href");
  if (
    url &&
    (url.startsWith(window.location.origin) || !url.startsWith("http"))
  ) {
    const destination = new URL(url, window.location);
    if (destination.toString() !== window.location.href) {
      console.log("pushstate");
      history.pushState(null, null, url);
    }
    spaUpgrade(e);
  }
});

document.addEventListener("submit", (e) => {
  const url = e.target.getAttribute("action");
  if (
    url &&
    (url.startsWith(window.location.origin) || !url.startsWith("http"))
  ) {
    spaUpgrade(e);
  }
});

// These URL params (which are inspired by htmx) could instead be included right in the form url or pulled from data- attributes.
// Since for this challenge the html shouldn't be directly edited I'm modifying the form action on load instead.
void (function enhanceForm() {
  const form = document.querySelector("[action]");
  const url = new URL(form.action);
  url.searchParams.set("target", "camp-activities-inquiry");
  url.searchParams.set("swap", "replaceWith");
  // url.searchParams.set("select", "");
  form.action = url.toString();
})();

// view transition patch ---------
document.startViewTransition = document.startViewTransition || ((fn) => fn());
// --------

function spaUpgrade(e) {
  e.target.setAttribute("target", "spa");
  const iframe = `<iframe hidden name="spa" onload="window.swapContent(this)"></iframe>`;
  document.body.insertAdjacentHTML("beforeend", iframe);
}

function swapContent(frame) {
  if (frame.contentWindow.location.href === "about:blank") {
    return false;
  }
  const params = new URLSearchParams(frame.contentWindow.location.search);
  const target =
    document.getElementById(params.get("target") || null) || document.body;

  if (target) {
    const transition = document.startViewTransition(() =>
      target?.[
        // "replaceWith | replaceChildren | prepend | append | before | after | remove"
        params.get("swap") || "replaceChildren"
      ](
        ...(frame.contentDocument.getElementById(params.get("select"))
          ?.children || frame.contentDocument.body.children)
      )
    );
    try {
      transition.updateCallbackDone?.then(() => {
        frame.remove();
      });
    } catch (error) {
      frame.remove();
    }
  }
}
