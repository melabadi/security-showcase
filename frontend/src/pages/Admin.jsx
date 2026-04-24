import React, { useState } from 'react';

// VULN: no authZ check, command passed raw to backend command exec.
export default function Admin() {
  const [cmd, setCmd] = useState('ls');
  const [out, setOut] = useState('');

  async function run() {
    const res = await fetch('/api/admin/exec?cmd=' + encodeURIComponent(cmd));
    setOut(await res.text());
  }

  return (
    <main className="container">
      <h1 className="danger">Admin Console</h1>
      <div className="card">
        <input value={cmd} onChange={(e) => setCmd(e.target.value)} style={{ width: '60%' }} />
        <button onClick={run} style={{ marginLeft: '0.5rem' }}>Run</button>
        <pre>{out}</pre>
      </div>
    </main>
  );
}
