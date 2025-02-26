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
    Collapse,
    IconButton,
    Container,
    Card,
    Tooltip
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const Row = ({ row, index }) => {
    const [open, setOpen] = useState(false);
    const [showReferrers, setShowReferrers] = useState(false);
    
    const getPositionColor = (position) => {
        switch (position) {
            case 0: return '#FFD700';
            case 1: return '#C0C0C0';
            case 2: return '#CD7F32';
            default: return 'white';
        }
    };

    return (
        <>
            <TableRow
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}
            >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                        sx={{ color: getPositionColor(index) }}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ color: getPositionColor(index) }}>{index + 1}</TableCell>
                <TableCell sx={{ color: getPositionColor(index) }}>{row.name}</TableCell>
                <TableCell sx={{ color: getPositionColor(index) }}>{row.reference}</TableCell>
                <TableCell sx={{ color: getPositionColor(index) }}>
                    Last Reference: {new Date(row.lastReferralTime).toLocaleString()}
                </TableCell>
                <TableCell align="right" sx={{ color: getPositionColor(index) }}>
                    {row.count}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" component="div" sx={{ color: '#2ab3ea' }}>
                                    {showReferrers ? 'Referenced By' : 'Referrals Made'}
                                </Typography>
                                <Tooltip title="Switch View">
                                    <IconButton 
                                        onClick={() => setShowReferrers(!showReferrers)}
                                        sx={{ color: '#2ab3ea' }}
                                    >
                                        <SwapVertIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: '#2ab3ea' }}>Name</TableCell>
                                        <TableCell sx={{ color: '#2ab3ea' }}>Admission Number</TableCell>
                                        {!showReferrers && (
                                            <TableCell sx={{ color: '#2ab3ea' }}>Submitted At</TableCell>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {showReferrers ? (
                                        row.referredBy.map((referrer) => (
                                            <TableRow key={referrer.admissionNumber}>
                                                <TableCell sx={{ color: 'white' }}>{referrer.name}</TableCell>
                                                <TableCell sx={{ color: 'white' }}>{referrer.admissionNumber}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        row.referrals.map((referral) => (
                                            <TableRow key={referral.admissionNumber}>
                                                <TableCell sx={{ color: 'white' }}>{referral.name}</TableCell>
                                                <TableCell sx={{ color: 'white' }}>{referral.admissionNumber}</TableCell>
                                                <TableCell sx={{ color: 'white' }}>
                                                    {new Date(referral.submittedAt).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const AdminLeaderBoard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/reference/admin-leaderboard/`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('core-token')}`
                        }
                    }
                );
                setLeaderboard(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load leaderboard');
                setLoading(false);
            }
        };

        fetchLeaderboard();
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
                    <Typography variant="h4" 
                        sx={{ 
                            textAlign: 'center',
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                        Reference Leaderboard (Admin View)
                    </Typography>
                </Box>

                <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: '#2ab3ea' }}></TableCell>
                                <TableCell sx={{ color: '#2ab3ea' }}>Rank</TableCell>
                                <TableCell sx={{ color: '#2ab3ea' }}>Name</TableCell>
                                <TableCell sx={{ color: '#2ab3ea' }}>Admission Number</TableCell>
                                <TableCell sx={{ color: '#2ab3ea' }}>First Reference Time</TableCell>
                                <TableCell align="right" sx={{ color: '#2ab3ea' }}>References</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leaderboard.map((row, index) => (
                                <Row key={row.reference} row={row} index={index} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Container>
    );
};

export default AdminLeaderBoard;
