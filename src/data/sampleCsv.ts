export const sampleCsv = `name,email,website,signup_date,phone,company
"  AVERY STONE  ","AVERY@example.COM","example.com","4/2/2026","555-010-2000","  North Pier Studio "
"Mina Fox","mina@example.com","https://mina.example","2026-04-03","5550102001","Fox & Hen"
"Mina Fox Duplicate"," MINA@example.com ","mina.example","April 3, 2026","+1 (555) 010-2001","Fox & Hen"
"No Email","","https://missing.example","2026-04-05","5550102002","Missing Mail LLC"
"Bad Link","bad-email","not a url","32/14/2026","12345","Bad Data Co"`;

export const useCases = [
  "Email list import prep",
  "CRM dedupe review",
  "URL inventory cleanup",
  "Client spreadsheet QA",
];

export const projectHealth = [
  {
    label: "Two ways to run",
    value: "Browser + CLI",
    detail: "Use the static app for review or the Node CLI for repeatable handoffs.",
  },
  {
    label: "Validation scope",
    value: "Profiles",
    detail: "Email lists, contact imports, content inventories, or local custom rules.",
  },
  {
    label: "Review outputs",
    value: "CSV, JSON, Markdown",
    detail: "Export cleaned rows, issue reports, and copy-ready handoff notes.",
  },
  {
    label: "Contributor path",
    value: "MIT + CI",
    detail: "Roadmap, contribution guide, issue templates, and build checks are included.",
  },
];

export const publicSafeNotes = [
  "Browser-only parsing",
  "Local Node CLI included",
  "No backend, auth, tracking, credentials, or uploads",
];
