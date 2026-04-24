import React, { useState } from 'react';
import axios from 'axios';

// VULN: credentials logged to console, token stored in localStorage,
// uses an old axios version with known CVEs.
export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    console.log('Logging in with', user, pass); // VULN: credential logging
    try {
      const res = await axios.post('/api/login', { user, pass });
      localStorage.setItem('token', res.data.token); // VULN: localStorage JWT
      setMsg(`Welcome ${res.data.user}`);
    } catch (err) {
      setMsg('Login failed');
    }
  }

  return (
    <main className="container">
      <h1>Login</h1>
      <form onSubmit={submit} className="card">
        <div>
          <input
            placeholder="username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <input
            placeholder="password"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
        <button type="submit" style={{ marginTop: '0.75rem' }}>Sign in</button>
      </form>
      <p>{msg}</p>
    </main>
  );
}
