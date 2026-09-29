// Robust Vanilla Tokenizer & Highlighter for NouvaLang (Zero Dependencies, Zero Bugs)
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightNouva(code) {
  // Regex to match tokens in priority order:
  // 1. Single-line & Multi-line Comments
  // 2. Strings
  // 3. Builtin / Function calls
  // 4. Function definitions
  // 5. Keywords
  // 6. Types
  // 7. Booleans & Null
  // 8. Numbers
  const tokenRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*")|(\b(?:print)\b(?=\s*\())|(\bfun\s+([a-zA-Z_][a-zA-Z0-9_]*))|(\b(?:let|const|fun|return|if|else|while|for|in|to|break|continue|as)\b)|(\b(?:int|float|str|bool|auto)\b)|(\b(?:true|false|null)\b)|(\b\d+(?:\.\d+)?\b)/g;

  let lastIndex = 0;
  let html = "";
  let match;

  while ((match = tokenRegex.exec(code)) !== null) {
    // Append unmatched text escaped
    if (match.index > lastIndex) {
      html += escapeHtml(code.slice(lastIndex, match.index));
    }

    const [
      full,
      comment,
      string,
      builtin,
      funDef,
      funName,
      keyword,
      type,
      booleanOrNull,
      number
    ] = match;

    if (comment) {
      html += `<span class="tok-com">${escapeHtml(comment)}</span>`;
    } else if (string) {
      html += `<span class="tok-str">${escapeHtml(string)}</span>`;
    } else if (builtin) {
      html += `<span class="tok-fn">${escapeHtml(builtin)}</span>`;
    } else if (funDef) {
      html += `<span class="tok-kw">fun</span> <span class="tok-fn">${escapeHtml(funName)}</span>`;
    } else if (keyword) {
      html += `<span class="tok-kw">${escapeHtml(keyword)}</span>`;
    } else if (type) {
      html += `<span class="tok-type">${escapeHtml(type)}</span>`;
    } else if (booleanOrNull) {
      html += `<span class="tok-bool">${escapeHtml(booleanOrNull)}</span>`;
    } else if (number) {
      html += `<span class="tok-num">${escapeHtml(number)}</span>`;
    }

    lastIndex = tokenRegex.lastIndex;
  }

  // Append remaining text
  if (lastIndex < code.length) {
    html += escapeHtml(code.slice(lastIndex));
  }

  return html;
}

// Global App Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Syntax Highlight All Pre Code safely
  document.querySelectorAll("pre code").forEach((el) => {
    el.innerHTML = highlightNouva(el.textContent);
  });

  // Sidebar Toggle (Desktop & Mobile)
  const sidebarToggleBtn = document.getElementById("sidebar-toggle");
  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener("click", () => {
      if (window.innerWidth <= 860) {
        document.body.classList.toggle("sidebar-open-mobile");
      } else {
        document.body.classList.toggle("sidebar-collapsed");
        localStorage.setItem("nouva-sidebar-collapsed", document.body.classList.contains("sidebar-collapsed"));
      }
    });
  }

  // Restore Desktop Sidebar State
  if (window.innerWidth > 860) {
    const isCollapsed = localStorage.getItem("nouva-sidebar-collapsed") === "true";
    if (isCollapsed) {
      document.body.classList.add("sidebar-collapsed");
    }
  }

  // Theme Switcher Component
  const themeToggle = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("nouva-theme") || "light";
  
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nouva-theme", theme);
    if (themeToggle) {
      themeToggle.innerHTML = theme === "dark" 
        ? `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2"/><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2"/></svg> Light`
        : `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Dark`;
    }
  }

  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const activeTheme = document.documentElement.getAttribute("data-theme");
      applyTheme(activeTheme === "dark" ? "light" : "dark");
    });
  }

  // Copy Code Button on All Blocks
  document.querySelectorAll("pre").forEach((preBlock) => {
    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.style.position = "absolute";
    copyButton.style.top = "10px";
    copyButton.style.right = "10px";
    copyButton.style.padding = "5px 10px";
    copyButton.style.fontSize = "0.78rem";
    copyButton.style.fontWeight = "600";
    copyButton.style.border = "1px solid var(--border-color)";
    copyButton.style.borderRadius = "6px";
    copyButton.style.backgroundColor = "var(--bg-secondary)";
    copyButton.style.color = "var(--text-primary)";
    copyButton.style.cursor = "pointer";
    copyButton.style.transition = "all 0.15s ease";

    copyButton.addEventListener("click", async () => {
      const code = preBlock.querySelector("code") ? preBlock.querySelector("code").innerText : preBlock.innerText;
      await navigator.clipboard.writeText(code);
      copyButton.textContent = "Copied!";
      copyButton.style.borderColor = "var(--accent-color)";
      copyButton.style.color = "var(--accent-color)";
      setTimeout(() => {
        copyButton.textContent = "Copy";
        copyButton.style.borderColor = "var(--border-color)";
        copyButton.style.color = "var(--text-primary)";
      }, 2000);
    });

    preBlock.style.position = "relative";
    preBlock.appendChild(copyButton);
  });
});
