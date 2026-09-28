const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

async function analyzeSync() {
    await mongoose.connect(process.env.MONGO_URL);
    
    const User = mongoose.model('User', new mongoose.Schema({}, {strict: false}));
    const CodingProfile = mongoose.model('CodingProfile', new mongoose.Schema({}, {strict: false}));
    
    // Get all users with Codeforces profiles
    const usersWithCF = await User.find({
        codeforcesProfile: { $exists: true, $ne: '' }
    }).select('fullName admissionNumber codeforcesProfile');
    
    console.log('Total users with Codeforces profiles:', usersWithCF.length);
    
    // Get users that successfully synced
    const syncedProfiles = await CodingProfile.find({
        platform: 'codeforces'
    }).select('userId');
    
    const syncedUserIds = new Set(syncedProfiles.map(p => p.userId.toString()));
    
    console.log('Successfully synced profiles:', syncedProfiles.length);
    console.log('Failed to sync:', usersWithCF.length - syncedProfiles.length);
    
    // Find users who failed to sync
    const failedUsers = usersWithCF.filter(user => !syncedUserIds.has(user._id.toString()));
    
    console.log('\n=== FAILED SYNCS (First 10) ===');
    
    let invalidHandles = 0;
    let apiErrors = 0;
    let otherErrors = 0;
    
    for (let i = 0; i < Math.min(10, failedUsers.length); i++) {
        const user = failedUsers[i];
        console.log(`\nChecking: ${user.fullName} (${user.codeforcesProfile})`);
        
        try {
            const response = await axios.get(
                `https://codeforces.com/api/user.info?handles=${encodeURIComponent(user.codeforcesProfile)}`,
                { timeout: 5000 }
            );
            
            if (response.data?.status === 'OK') {
                console.log('  ✅ Valid handle - might be API rate limit issue');
                apiErrors++;
            } else {
                console.log('  ❌ Invalid API response');
                otherErrors++;
            }
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('  ❌ Invalid handle');
                invalidHandles++;
            } else {
                console.log('  ❌ API Error:', error.message);
                apiErrors++;
            }
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n=== ANALYSIS SUMMARY ===');
    console.log('Total users with Codeforces:', usersWithCF.length);
    console.log('Successfully synced:', syncedProfiles.length);
    console.log('Failed to sync:', usersWithCF.length - syncedProfiles.length);
    console.log('Success rate:', ((syncedProfiles.length / usersWithCF.length) * 100).toFixed(1) + '%');
    
    console.log('\n=== FAILURE REASONS (Sample of 10) ===');
    console.log('Invalid handles:', invalidHandles);
    console.log('API/Rate limit errors:', apiErrors);
    console.log('Other errors:', otherErrors);
    
    console.log('\n=== RECOMMENDATIONS ===');
    if (invalidHandles > 0) {
        console.log('• Some users have invalid Codeforces handles');
    }
    if (apiErrors > 0) {
        console.log('• Consider reducing concurrency or adding delays for rate limiting');
    }
    
    process.exit(0);
}

analyzeSync().catch(console.error);