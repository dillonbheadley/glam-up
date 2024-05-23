// document.addEventListener("click", (e) => {
//   const url = e.target.getAttribute("href");
//   if (
//     url &&
//     (url.startsWith(window.location.origin) || !url.startsWith("http"))
//   ) {
//     const destination = new URL(url, window.location);
//     if (destination.toString() !== window.location.href) {
//       history.pushState(null, null, url);
//     }
//     spaUpgrade(e);
//   }
// });

// document.addEventListener("submit", (e) => {
//   const url = e.target.getAttribute("action");
//   if (
//     url &&
//     (url.startsWith(window.location.origin) || !url.startsWith("http"))
//   ) {
//     spaUpgrade(e);
//   }
// });

// view transition patch ---------
// document.startViewTransition = document.startViewTransition || ((fn) => fn());
// --------

// inspired by htmz https://leanrada.com/htmz/
// function spaUpgrade(e) {
//   e.target.setAttribute("target", "spa");
//   const iframe = `<iframe hidden name="spa" onload="window.swapContent(this)"></iframe>`;
//   document.body.insertAdjacentHTML("beforeend", iframe);
// }

// function swapContent(frame) {
//   if (frame.contentWindow.location.href === "about:blank") {
//     return false;
//   }
//   const params = new URLSearchParams(frame.contentWindow.location.search);
//   const target =
//     document.getElementById(params.get("target") || null) || document.body;

//   if (target) {
//     const transition = document.startViewTransition(() =>
//       target?.[
//         // replaceChildren | replaceWith | prepend | append | before | after | remove
//         params.get("swap") || "replaceChildren"
//       ](
//         ...(frame.contentDocument.getElementById(params.get("select"))
//           ?.children || frame.contentDocument.body.children)
//       )
//     );
//     try {
//       transition.updateCallbackDone?.then(() => {
//         frame.remove();
//       });
//     } catch (error) {
//       frame.remove();
//     }
//   }
// }

customElements.define(
  "hz-boost",
  class HzBoost extends HTMLElement {
    connectedCallback() {
      this.addEventListener("click", this);
      this.addEventListener("submit", this);
    }
    disconnectedCallback() {
      this.removeEventListener("click", this);
      this.removeEventListener("submit", this);
    }
    _eventToUrl = {
      click: "href",
      submit: "action",
    };
    handleEvent(e) {
      e.stopPropagation();
      const url = e.target.getAttribute(this._eventToUrl[e.type]);
      if (url && this._isLocalUrl(url)) {
        if (
          e.type === "click" &&
          new URL(url, window.location).toString() !== window.location.href
        ) {
          history.pushState(null, null, url);
        }
        this.spaUpgrade(e);
      }
    }
    _isLocalUrl(url) {
      return url?.startsWith(window.location.origin) || !url.startsWith("http");
    }
    spaUpgrade(e) {
      e.target.setAttribute("target", "spa");
      const iframe = document.createElement("iframe");
      iframe.name = "spa";
      iframe.hidden = true;
      iframe.onload = () => this.swapContent(iframe);
      document.body.insertAdjacentElement("beforeend", iframe);
    }
    swapContent(frame) {
      if (frame.contentWindow?.location?.href === "about:blank") {
        return false;
      }
      const target =
        document.querySelector(this.dataset.target || null) || document.body;
      if (!target) {
        return false;
      }

      // view transition patch
      document.startViewTransition =
        document.startViewTransition || ((fn) => fn());

      const transition = document.startViewTransition(() => {
        // oob swaps
        const elements = [
          ...frame.contentDocument.querySelectorAll("[data-oob-swap]"),
        ];
        // reverse order so we extract children before parents
        for (const element of elements.reverse()) {
          document
            .getElementById(element.id)
            ?.[element.dataset.oobSwap || "replaceChildren"](element);
          delete element.dataset.oobSwap;
        }

        // main swap
        return target[
          // replaceChildren | replaceWith | prepend | append | before | after | remove
          this.dataset.swap || "replaceChildren"
        ](
          ...(this.dataset.select
            ? frame.contentDocument.querySelectorAll(this.dataset.select)
            : frame.contentDocument.body.children)
        );
      });
      try {
        transition.updateCallbackDone?.then(() => {
          frame.remove();
        });
      } catch (error) {
        frame.remove();
      }
    }
  }
);
