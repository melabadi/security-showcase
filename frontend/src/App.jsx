import React, { useEffect, useState } from 'react';
import { marked } from 'marked';

// VULN: renders server-controlled markdown with an old marked version
// that doesn't sanitize, plus dangerouslySetInnerHTML => XSS.
export default function App() {
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch('/api/welcome')
      .then((r) => r.json())
      .then((d) => setHtml(marked(d.message)));
  }, []);

  return (
    <main className="container">
      <h1>Vulnerable Demo Store</h1>
      <p>Welcome message rendered directly from the backend:</p>
      <div
        className="card"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
