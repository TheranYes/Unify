import { useEffect, useState, useRef } from 'react';
export default function RedirectPage() {
    const SERVER_URL = 'http://localhost:5001';
    const REDIRECT_URI = 'http://localhost:5173/callback';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const CLIENT_ID = 'e79f3d3f007545a1a45f490cc789f63f';

    const hasToken = localStorage.getItem('token');
    useEffect(() => {
        if (hasToken) {
            window.location.href = "/";
            return;
        }
        async function getAccessToken() {
            try{
                const params = new URLSearchParams(window.location.search);
                const code = params.get('code');
                console.log(code);
                const body = await fetch("https://accounts.spotify.com/api/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({
                        client_id: CLIENT_ID,
                        grant_type: "authorization_code",
                        code: code,
                        redirect_uri: REDIRECT_URI,
                        code_verifier: localStorage.getItem('code_verifier')
                    })
                });

                if (!body.ok) {
                    localStorage.setItem('code', body.status)
                    localStorage.setItem('message', body.statusText)
                    throw new Error("Failed to get access token");
                    return
                }
                const response = await body.json();
                const body_2 = await fetch(`${SERVER_URL}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        access_token: response.access_token,
                        refresh_token: response.refresh_token,
                        expires_in: response.expires_in
                    })
                });
                
                console.log("logging in")

                if (!body_2.ok) {
                    throw new Error("Failed to login");
                }

                const response_2 = await body_2.json();
                localStorage.setItem('token', response_2.token);
                setLoading(false);
                window.location.href = "/";
            } catch (err) {
                setLoading(false);
                setError(err.message);
            }
        }
        getAccessToken();
    }, [])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return null;
}