import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Container,
    Card,
    Grid
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import increamentCounter from "../../libs/increamentCounter";

const LeaderBoard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/forms/reference/leaderboard/`);
                setLeaderboard(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load leaderboard');
                setLoading(false);
            }
        };

        fetchLeaderboard();
        increamentCounter();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
                <CircularProgress sx={{ color: 'white' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    const getPositionColor = (position) => {
        switch (position) {
            case 0: return '#FFD700';
            case 1: return '#C0C0C0';
            case 2: return '#CD7F32';
            default: return 'white';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Card sx={{ 
                backgroundColor: 'black',
                color: 'white',
                borderRadius: 2,
                p: 3
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 4
                }}>
                    <EmojiEventsIcon sx={{ fontSize: 40, color: '#FFD700', mr: 2 }} />
                    <Typography variant={isMobile ? "h5" : "h4"} 
                        sx={{ 
                            textAlign: 'center',
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                        Reference Leaderboard
                    </Typography>
                </Box>

                {isMobile ? (
                    <Grid container spacing={2}>
                        {leaderboard.map((item, index) => (
                            <Grid item xs={12} key={item.reference}>
                                <Card sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    color: getPositionColor(index),
                                    p: 2,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6">#{index + 1}</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {item.count} refs
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1">{item.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.reference}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                        Latest: {new Date(item.lastReferralTime).toLocaleString()}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: '#2ab3ea', fontWeight: 'bold' }}>Rank</TableCell>
                                    <TableCell sx={{ color: '#2ab3ea', fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell sx={{ color: '#2ab3ea', fontWeight: 'bold' }}>Admission No.</TableCell>
                                    <TableCell sx={{ color: '#2ab3ea', fontWeight: 'bold', textAlign: 'center' }}>
                                        References
                                    </TableCell>
                                    <TableCell sx={{ color: '#2ab3ea', fontWeight: 'bold' }}>Latest Reference</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leaderboard.map((item, index) => (
                                    <TableRow
                                        key={item.reference}
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            transition: 'background-color 0.2s',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                            }
                                        }}
                                    >
                                        <TableCell sx={{ color: getPositionColor(index) }}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell sx={{ color: getPositionColor(index) }}>
                                            {item.name}
                                        </TableCell>
                                        <TableCell sx={{ color: getPositionColor(index) }}>
                                            {item.reference}
                                        </TableCell>
                                        <TableCell sx={{ color: getPositionColor(index) }}>
                                            {item.count}
                                        </TableCell>
                                        <TableCell sx={{ color: getPositionColor(index) }}>
                                            {new Date(item.lastReferralTime).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Card>
        </Container>
    );
};

export default LeaderBoard;
