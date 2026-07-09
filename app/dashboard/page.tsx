'use client'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function Dashboard() {
    const [monthStats, setMonthStats] = useState([]);
    const [yearStats, setYearStats] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const getAnalytics = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error Status: ${response.status}`);
                }

                const data = await response.json();
                setMonthStats(data.stats[0].monthStats);
                setYearStats(data.stats[0].yearStats);
            } catch (err) {
                console.log(err);
            }
        }

        getAnalytics();
    }, []);

    async function logout() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error Status: ${response.status}`);
            }
            router.push("/");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', color: 'black' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            QueryPi
                        </Typography>
                        <Button color="inherit" onClick={() => router.push("/home")}>
                            Chats
                        </Button>
                        <Button color="inherit" onClick={logout}>
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    )
}