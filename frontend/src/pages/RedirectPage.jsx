import { useEffect, useState } from 'react';
export default function RedirectPage() {
    const SERVER_URL = 'http://localhost:3001';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function getAccessToken() {
            try{
                const params = new URLSearchParams(window.location.search);
                const response = await fetch(`${SERVER_URL}/auth?code=${params.get('code')}`, {
                    method: 'POST',
                });
                window.sessionStorage.setItem('token', response.access_token);
                setLoading(false);
                window.location.href = '/';
            } catch (err) {
                setLoading(false);
                setError(err.message);
            }
        }
        getAccessToken();
        console.log(window.sessionStorage.getItem('token'));
    }, [])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return null;
}