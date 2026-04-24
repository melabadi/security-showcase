import React, { useEffect, useState } from 'react';
import _ from 'lodash';

// VULN: prototype pollution via lodash < 4.17.21 merge.
export default function Profile() {
  const [profile, setProfile] = useState({ name: 'guest' });

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('p');
    if (raw) {
      try {
        const patch = JSON.parse(raw); // VULN: untrusted JSON from URL
        const next = _.merge({}, profile, patch); // VULN: prototype pollution
        setProfile(next);
      } catch {}
    }
  }, []);

  return (
    <main className="container">
      <h1>Profile</h1>
      <pre className="card">{JSON.stringify(profile, null, 2)}</pre>
    </main>
  );
}
