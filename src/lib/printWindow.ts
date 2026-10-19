/**
 * A way back out of a print window.
 *
 * Every printable page here (order summary, invoice, purchase order, price
 * list…) is written into a window opened with window.open. In a browser
 * that is a tab, and the tab strip is the way back. In the installed app
 * (the PWA, standalone) there is no tab strip and no back button: the page
 * fills the screen, and once the print dialog is dismissed there was nothing
 * on it to leave by.
 *
 * So each one gets a bar across the top with Back and Print. It is screen-only
 * (@media print hides it), so nothing changes on paper.
 *
 * Back closes the window. A window this app opened is allowed to close itself
 * in a browser, but some standalone shells ignore it -- so if it is still
 * open a moment later, it is sent to the page it was opened from instead.
 * Either way the person ends up back where they pressed Print.
 */
export function addPrintToolbar(win: Window, backUrl: string = window.location.href) {
  try {
    const doc = win.document;
    if (!doc.body || doc.getElementById("mm-print-toolbar")) return;

    const style = doc.createElement("style");
    style.textContent = `
      #mm-print-toolbar {
        position: sticky; top: 0; z-index: 2147483647;
        display: flex; align-items: center; justify-content: space-between; gap: 8px;
        padding: 10px 12px; margin: -8px -8px 16px;
        background: #f3f8f5; border-bottom: 1px solid #c9a227;
        font-family: Arial, sans-serif;
      }
      #mm-print-toolbar button {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 10px 16px; border-radius: 8px; font-size: 15px; font-weight: bold;
        cursor: pointer; border: 2px solid #0a4a31;
      }
      #mm-print-toolbar .mm-back { background: #fff; color: #0a4a31; }
      #mm-print-toolbar .mm-print { background: #0a4a31; color: #fff; }
      @media print { #mm-print-toolbar { display: none !important; } }
    `;
    doc.head?.appendChild(style) ?? doc.body.appendChild(style);

    const bar = doc.createElement("div");
    bar.id = "mm-print-toolbar";

    const back = doc.createElement("button");
    back.type = "button";
    back.className = "mm-back";
    back.textContent = "← Back";
    back.onclick = () => {
      try {
        win.close();
      } catch {
        /* fall through to navigating */
      }
      setTimeout(() => {
        if (!win.closed) win.location.href = backUrl;
      }, 300);
    };

    const print = doc.createElement("button");
    print.type = "button";
    print.className = "mm-print";
    print.textContent = "Print";
    print.onclick = () => win.print();

    bar.append(back, print);
    doc.body.insertBefore(bar, doc.body.firstChild);
  } catch (err) {
    // A toolbar that cannot be drawn must never stop the page printing.
    console.error("Could not add the print toolbar:", err);
  }
}
