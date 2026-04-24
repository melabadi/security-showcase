import React, { useState } from 'react';

// VULN: reflected XSS - query rendered via dangerouslySetInnerHTML.
export default function Search() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);

  async function run() {
    // VULN: SSRF-style open redirect through URL-controlled path.
    const res = await fetch('/api/search?q=' + q);
    setResults(await res.json());
  }

  return (
    <main className="container">
      <h1>Search products</h1>
      <div className="card">
        <input value={q} onChange={(e) => setQ(e.target.value)} />
        <button onClick={run} style={{ marginLeft: '0.5rem' }}>Go</button>
        <p>
          You searched for:{' '}
          <span dangerouslySetInnerHTML={{ __html: q }} />
        </p>
      </div>
      <ul>
        {results.map((r, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: r.name }} />
        ))}
      </ul>
    </main>
  );
}
