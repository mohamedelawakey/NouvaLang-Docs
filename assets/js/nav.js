const NAV_ITEMS = [
  {
    category: "Getting Started",
    items: [
      { title: "Introduction & Overview", path: "index.html" },
      { title: "Installation & Setup", path: "pages/installation.html" },
      { title: "CLI & REPL Usage", path: "pages/cli-and-repl.html" },
    ]
  },
  {
    category: "Language Basics",
    items: [
      { title: "Printing Output (print)", path: "pages/first-program-print.html" },
      { title: "Variables & Types", path: "pages/variables-and-types.html" },
      { title: "Operators & Expressions", path: "pages/operators-and-expressions.html" },
      { title: "Type Casting (as)", path: "pages/type-casting.html" },
      { title: "Comments & Syntax", path: "pages/syntax-and-comments.html" },
    ]
  },
  {
    category: "Control Flow",
    items: [
      { title: "If / Else Conditionals", path: "pages/conditionals.html" },
      { title: "While Loops", path: "pages/while-loops.html" },
      { title: "For Loops & Ranges", path: "pages/for-loops.html" },
      { title: "Break & Continue", path: "pages/break-and-continue.html" },
    ]
  },
  {
    category: "Functions & Execution",
    items: [
      { title: "Function Declarations", path: "pages/functions.html" },
      { title: "Closures & Scopes", path: "pages/closures-and-scopes.html" },
      { title: "Recursion", path: "pages/recursion.html" },
      { title: "Built-in Standard Library", path: "pages/builtins.html" },
    ]
  },
  {
    category: "Examples",
    items: [
      { title: "Algorithms & Benchmarks", path: "pages/demo-programs.html" },
    ]
  }
];

function renderNavigation(activeFile, rootPrefix = "") {
  const sidebarContainer = document.getElementById("sidebar-nav");
  if (!sidebarContainer) return;

  let html = "";
  for (const group of NAV_ITEMS) {
    html += '<div class="sidebar-section">' +
      '<div class="sidebar-title">' + group.category + '</div>' +
      '<ul class="sidebar-links">';
    for (const item of group.items) {
      const href = rootPrefix + item.path;
      const isActive = item.path.endsWith(activeFile) ? 'class="active"' : '';
      html += '<li><a href="' + href + '" ' + isActive + '>' + item.title + '</a></li>';
    }
    html += '</ul></div>';
  }
  sidebarContainer.innerHTML = html;
}
