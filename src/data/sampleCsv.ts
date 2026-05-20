export const sampleCsv = `name,email,website,signup_date,phone,company
"  AVERY STONE  ","AVERY@example.COM","example.com","4/2/2026","555-010-2000","  North Pier Studio "
"Mina Fox","mina@example.com","https://mina.example","2026-04-03","5550102001","Fox & Hen"
"Mina Fox Duplicate"," MINA@example.com ","mina.example","April 3, 2026","+1 (555) 010-2001","Fox & Hen"
"No Email","","https://missing.example","2026-04-05","5550102002","Missing Mail LLC"
"Bad Link","bad-email","not a url","32/14/2026","12345","Bad Data Co"`;

export const useCases = [
  "Newsletter list cleanup before import",
  "CRM contact dedupe handoff",
  "Content URL inventory review",
  "Spreadsheet QA package for a client",
];

export const publicSafeNotes = [
  "Runs locally in the browser or Node CLI",
  "Uses fictional fixture data only",
  "No backend, auth, tracking, secrets, or uploads",
];
