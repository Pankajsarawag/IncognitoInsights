'use client';
import { useEffect, useState } from 'react';

export default function Home() {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const pathSegments = window.location.pathname.split('/');
        const usernameFromPath = pathSegments[pathSegments.length - 1];
        setUsername(usernameFromPath || "");
    }, []);

    return (
        <div>
            <h1>Reset Password Page</h1>
            <h2>{username}</h2>
        </div>
    );
}
