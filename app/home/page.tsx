'use client'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlineSharpIcon from '@mui/icons-material/InfoOutlineSharp';
import InfoSharpIcon from '@mui/icons-material/InfoSharp';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { TypeAnimation } from 'react-type-animation';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';

interface Chat {
    chatId?: string,
    userId?: string,
    userPrompt: string,
    queryResponse: string
};

export default function Page() {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [isHydrating, setIsHydrating] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [chatHistory, setChatHistory] = useState<Chat[]>([]);
    const [currentChat, setCurrentChat] = useState<Chat[]>([]);
    const [chatId, setChatId] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {chatHistory.map((chat, index) => (
                    <ListItem key={chat._id} onClick={() => {
                        setIsHydrating(true);
                        setCurrentChat(chat.messages);
                        setChatId(chat._id);
                    }}
                        disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InfoOutlineSharpIcon /> : <InfoSharpIcon />}
                            </ListItemIcon>
                            <ListItemText primary={chat.messages[0].userPrompt} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    // useEffect(() => {
    //     const retrieveChats = async () => {
    //         try {
    //             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/retrieve`, {
    //                 method: 'GET',
    //                 credentials: 'include',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 }
    //             });

    //             if (!response.ok) {
    //                 throw new Error(`Error Status: ${response.status}`);
    //             }

    //             const data = await response.json();
    //             setChatHistory(data.userChats);
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     }

    //     retrieveChats();
    // }, []);

    useEffect(() => {
        if (isHydrating) {
            setIsHydrating(false);
            return;
        }

        if (currentChat.length > 0) {
            const saveChat = async () => {
                const chat = currentChat.at(-1);
                chat.chatId = chatId;

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(chat)
                    });

                    if (!response.ok) {
                        throw new Error(`Error Status: ${response.status}`);
                    }

                    const data = await response.json();
                    setChatId(data.message);
                } catch (err) {
                    console.log(err);
                }
            };
            saveChat();
        }
    }, [currentChat]);

    function createNewChat() {
        setIsHydrating(true);
        setCurrentChat([]);
        setChatId('');
        setOpen(false);
    }

    function handlePromptChange(event: any) {
        setPrompt(event.target.value);
    }

    // async function sendPrompt() {
    //     let finalPrompt = "";

    //     if (!prompt) {
    //         finalPrompt = "Tell me a funny joke";
    //     } else {
    //         finalPrompt = prompt;
    //     }

    //     try {
    //         setLoading(true);
    //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/query`, {
    //             method: 'POST',
    //             credentials: 'include',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ userPrompt: finalPrompt })
    //         });
    //         if (!response.ok) {
    //             throw new Error(`Error Status: ${response.status}`);
    //         }
    //         const data = await response.json();
    //         setCurrentChat([...currentChat, { userPrompt: finalPrompt, queryResponse: data.response }]);
    //         setPrompt("");
    //     } catch (err) {
    //         console.log(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // async function clearChat() {
    //     try {
    //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete`, {
    //             method: 'POST',
    //             credentials: 'include',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ chat: chatId })
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Error Status: ${response.status}`);
    //         }

    //         setChatHistory(prev =>
    //             prev.filter(chat => chat._id !== chatId)
    //         );

    //         setCurrentChat([]);
    //         setChatId('');
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // async function logout() {
    //     try {
    //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
    //             method: 'POST',
    //             credentials: 'include',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Error Status: ${response.status}`);
    //         }
    //         router.push("/");
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', color: 'black' }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer open={open} onClose={toggleDrawer(false)}>
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                                <Button variant="contained" startIcon={<AddIcon />} onClick={createNewChat}>
                                    New Chat
                                </Button>
                            </Box>
                            {DrawerList}
                        </Drawer>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            QueryPi
                        </Typography>
                        <Button color="inherit">Logout</Button>
                    </Toolbar>
                </AppBar>
            </Box>

            <Box>
                {currentChat.length == 0 ?
                    <Container sx={{ height: '70vh', overflowY: 'auto' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <Typography style={{ textAlign: 'center' }} variant="h3" component="div">
                                What would you like to ask today?
                            </Typography>
                            <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 2 }}>
                                Ask a question and get your answer right away! You can upload a research paper if you are looking for something specific.
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                <IconButton
                                    component="label"
                                    role={undefined}
                                    tabIndex={-1}
                                    color="primary"
                                    aria-label="upload file"
                                >
                                    <UploadFileOutlinedIcon color='secondary' />
                                    <VisuallyHiddenInput
                                        type="file"
                                    // accept="image/*" // Optional: restrict to specific file types
                                    // multiple // Optional: allow multiple files
                                    />
                                </IconButton>
                                <TextField
                                    id="outlined-basic"
                                    label="Your prompt"
                                    variant="outlined"
                                    sx={{ flexGrow: 1 }}
                                    value={prompt}
                                    onChange={handlePromptChange}
                                    disabled={loading}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton aria-label="send" disabled={loading}>
                                                        <SendOutlinedIcon color='info' />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }
                                    }} />
                                {/* <IconButton aria-label="send" color='primary' disabled={loading}>
                                    <SendIcon />
                                </IconButton> */}
                            </Box>
                            {loading && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                                    <Box
                                        sx={{
                                            bgcolor: 'grey.200',
                                            px: 2,
                                            py: 1,
                                            borderRadius: '16px',
                                            maxWidth: '70%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}
                                    >
                                        <CircularProgress size={16} />
                                        <Typography variant="body2">Thinking...</Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Container>
                    :
                    <Container sx={{ height: '70vh', overflowY: 'auto' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            {currentChat.map((chat, index) => (
                                <Box key={index}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Box
                                            sx={{
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                px: 2,
                                                py: 1,
                                                borderRadius: '16px',
                                                maxWidth: '70%',
                                            }}
                                        >
                                            {chat.userPrompt}
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                                        <Box
                                            sx={{
                                                bgcolor: 'grey.200',
                                                px: 2,
                                                py: 1,
                                                borderRadius: '16px',
                                                maxWidth: '70%',
                                            }}
                                        >
                                            {chat.queryResponse}
                                        </Box>
                                    </Box>
                                </Box>
                            ))}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                <TextField
                                    id="outlined-basic"
                                    label="Your prompt"
                                    variant="outlined"
                                    // InputProps={{ sx: { borderRadius: "20px" } }}
                                    sx={{ flexGrow: 1, borderRadius: "20px" }}
                                    value={prompt}
                                    onChange={handlePromptChange}
                                    disabled={loading} />
                                <IconButton aria-label="send" color='primary' disabled={loading}>
                                    <SendIcon />
                                </IconButton>
                                <IconButton aria-label="clear" color='error' disabled={loading}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                            {loading && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                                    <Box
                                        sx={{
                                            bgcolor: 'grey.200',
                                            px: 2,
                                            py: 1,
                                            borderRadius: '16px',
                                            maxWidth: '70%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}
                                    >
                                        <CircularProgress size={16} />
                                        <Typography variant="body2">Thinking...</Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Container>
                }
            </Box>
        </>
    );
}