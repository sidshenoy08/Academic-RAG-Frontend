'use client'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { useState, SyntheticEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';

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

export default function Home() {
  const router = useRouter();

  const [value, setValue] = useState(0);

  const initialNewUserState = {
    email: '',
    password: '',
    cpassword: ''
  };

  const initialExistingUserState = {
    email: '',
    password: ''
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const [newUserData, setNewUserData] = useState(initialNewUserState);
  const [existingUserData, setExistingUserData] = useState(initialExistingUserState);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  useEffect(() => {
    const logout = async () => {
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
    };
    logout();
  }, []);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  function toggleCPasswordVisibility() {
    setShowCPassword(!showCPassword);
  }

  function handleNewUserDataChange(event: any) {
    const { name, value } = event.target;
    setNewUserData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleExistingUserDataChange(event: any) {
    const { name, value } = event.target;
    setExistingUserData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleClose() {
    setErrorDialogOpen(false);
  }

  async function registerUser() {
    if (!(newUserData.password === newUserData.cpassword)) {
      setErrorDialogOpen(true);
      setNewUserData(initialNewUserState);
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserData)
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        throw new Error(`Error Status: ${response.status}`);
      }
      setNewUserData(initialNewUserState);
      if (response.status === 201) {
        try {
          router.push("/home");
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }

  }

  async function loginUser() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(existingUserData)
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        throw new Error(`Error Status: ${response.status}`);
      }
      setExistingUserData(initialExistingUserState);
      if (response.status === 200) {
        try {
          router.push("/home");
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', color: 'black' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ContextLens
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f5f5f5'
      }}
      >
        <Box sx={{
          width: 400,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: 3,
          p: 3
        }}
        >
          <Typography variant="h5">
            Welcome to QueryPi
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} centered textColor='primary' indicatorColor='primary'>
              <Tab label="Register" {...a11yProps(0)} />
              <Tab label="Login" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 2
              }}
            >
              <TextField fullWidth id="email" name="email" label="Email" value={newUserData.email} onChange={handleNewUserDataChange} variant="outlined" sx={{ borderRadius: "20px" }} />
              <TextField fullWidth id="password" name="password" type={showPassword ? 'text' : 'password'} label="password" value={newUserData.password} onChange={handleNewUserDataChange} variant="outlined" sx={{ borderRadius: "20px" }} slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }} />
              <TextField fullWidth id="confirm-password" name="cpassword" type={showCPassword ? 'text' : 'password'} value={newUserData.cpassword} onChange={handleNewUserDataChange} label="Confirm Password" variant="outlined" sx={{ borderRadius: "20px" }} slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }} />
              <Button
                variant="contained"
                size="large"
                sx={{
                  mt: 1,
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 600
                }}
                onClick={registerUser}
              >
                Sign Up
              </Button>
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 2
              }}
            >
              <TextField fullWidth id="email" name="email" type='email' value={existingUserData.email} onChange={handleExistingUserDataChange} label="Email" variant="outlined" sx={{ borderRadius: "20px" }} />
              <TextField fullWidth id="password" name="password" type={showPassword ? 'text' : 'password'} value={existingUserData.password} onChange={handleExistingUserDataChange} label="Password" variant="outlined" sx={{ borderRadius: "20px" }} slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </InputAdornment>
                  ),
                },
              }} />
              <Button
                variant="contained"
                size="large"
                sx={{
                  mt: 1,
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 600
                }}
                onClick={loginUser}
              >
                Login
              </Button>
            </Box>
          </CustomTabPanel>
          <Dialog
            open={errorDialogOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Your passwords do not match!"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Please check your passwords. It looks like you have not entered the same passwords.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Got it!</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
}