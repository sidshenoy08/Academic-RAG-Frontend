'use client'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';

import { useRouter } from 'next/navigation';
import { useEffect, useState, SyntheticEvent } from 'react';

import MonthBarplot from './MonthBarplot';
import MonthStackedBarplot from './MonthStackedBarplot';
import YearBarplot from './YearBarplot';
import YearStackedBarplot from './YearStackedBarplot';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function Dashboard() {
    const [monthStats, setMonthStats] = useState([]);
    const [yearStats, setYearStats] = useState([]);
    const [value, setValue] = useState(0);

    const router = useRouter();

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

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
            {/* <Box sx={{ flexGrow: 1 }}> */}
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
            {/* </Box> */}
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper elevation={3} sx={{ p: 2, minWidth: 150, textAlign: 'center' }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                All-Time Questions Asked
                            </Typography>
                            <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                                {yearStats.reduce((accumulator, currentValue) => accumulator + currentValue.totalPrompts, 0).toLocaleString()}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper elevation={3} sx={{ p: 2, minWidth: 150, textAlign: 'center' }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Total Likes
                            </Typography>
                            <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                                {yearStats.reduce((accumulator, currentValue) => accumulator + currentValue.totalLikes, 0).toLocaleString()}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper elevation={3} sx={{ p: 2, minWidth: 150, textAlign: 'center' }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Total Dislikes
                            </Typography>
                            <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                                {yearStats.reduce((accumulator, currentValue) => accumulator + currentValue.totalDislikes, 0).toLocaleString()}
                            </Typography>
                        </Paper >
                    </Grid>
                </Grid >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} centered textColor='primary' indicatorColor='primary'>
                        <Tab label="Monthly Stats" {...a11yProps(0)} />
                        <Tab label="Yearly Stats" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Total Questions Asked by Month
                                </Typography>
                                <MonthBarplot
                                    data={monthStats}
                                    width={550}
                                    height={400}
                                />
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Total Likes and Dislikes by Month
                                </Typography>
                                <MonthStackedBarplot
                                    data={monthStats}
                                    width={550}
                                    height={400}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Total Questions Asked by Year
                                </Typography>
                                <YearBarplot
                                    data={yearStats}
                                    width={550}
                                    height={400}
                                />
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Total Likes and Dislikes by Year
                                </Typography>
                                <YearStackedBarplot
                                    data={yearStats}
                                    width={550}
                                    height={400}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </CustomTabPanel>
            </Container>
        </>
    )
}