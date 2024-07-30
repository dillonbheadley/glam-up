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
      this.abortController = new AbortController();
      ["click", "submit"].forEach((event) =>
        this.addEventListener(event, this, {
          signal: this.abortController.signal,
        })
      );
    }
    disconnectedCallback() {
      this.abortController.abort();
    }
    handleEvent(e) {
      e.stopPropagation();
      const actionUrl = e.target.getAttribute("action");
      const hrefUrl = e.target.getAttribute("href");
      const url = hrefUrl || actionUrl;

      if (url && this.#isLocalUrl(url)) {
        this.dataset.isLoading = true;
        if (
          hrefUrl &&
          new URL(url, window.location).toString() !== window.location.href
        ) {
          history.pushState(null, null, url);
        }
        this.spaUpgrade(e);
      }
    }
    #isLocalUrl(url) {
      return (
        url?.startsWith(window.location.origin) ||
        !url.startsWith("http") ||
        !url.startsWith("mailto") ||
        !url.startsWith("sms")
      );
    }
    spaUpgrade(e) {
      e.target.setAttribute("target", "spa");
      const iframe = document.createElement("iframe");
      iframe.name = "spa";
      iframe.hidden = true;
      iframe.onload = () => this.swapContent(iframe);
      this.iframe = iframe;
      document.body.insertAdjacentElement("beforeend", this.iframe);
    }
    swapContent() {
      if (this.iframe.contentWindow?.location?.href === "about:blank") {
        return false;
      }
      const target =
        document.querySelector(this.dataset.target || null) || document.body;
      if (!target) {
        this.afterSwap();
        return false;
      }
      // view transition patch
      document.startViewTransition =
        document.startViewTransition || ((fn) => fn());

      const transition = document.startViewTransition(() => {
        // oob swaps
        const elements = [
          ...this.iframe.contentDocument.querySelectorAll(
            "[data-oob-swap], [data-oob-target]"
          ),
        ];
        // reverse order so we extract children before parents
        for (const element of elements.reverse()) {
          const oobTarget =
            document.querySelector(element.dataset.oobTarget) ||
            document.getElementById(element.id);
          oobTarget?.[element.dataset.oobSwap || "replaceChildren"](element);
          delete element.dataset.oobSwap;
          delete element.dataset.oobTarget;
        }
        // main swap
        return target[
          // replaceChildren | replaceWith | prepend | append | before | after | remove
          this.dataset.swap || "replaceChildren"
        ](
          ...(this.dataset.select
            ? this.iframe.contentDocument.querySelectorAll(this.dataset.select)
            : this.iframe.contentDocument.body.children)
        );
      });
      try {
        transition.updateCallbackDone?.then(() => {
          this.afterSwap();
        });
      } catch (error) {
        this.afterSwap();
      }
    }
    afterSwap() {
      this.iframe?.remove();
      delete this.dataset.isLoading;
    }
  }
);
