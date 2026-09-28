const mongoose = require('mongoose');
require('dotenv').config();

async function investigate() {
    await mongoose.connect(process.env.MONGO_URL);
    
    const User = mongoose.model('User', new mongoose.Schema({}, {strict: false}));
    const CodingProfile = mongoose.model('CodingProfile', new mongoose.Schema({}, {strict: false}));
    
    // Count users with non-empty, non-NA Codeforces profiles
    const usersWithValidCF = await User.countDocuments({
        codeforcesProfile: { $exists: true, $ne: '', $ne: 'NA', $ne: null }
    });
    
    console.log('Users with valid Codeforces profiles:', usersWithValidCF);
    
    // Count users with 'NA' as Codeforces profile
    const usersWithNA = await User.countDocuments({
        codeforcesProfile: 'NA'
    });
    
    console.log('Users with "NA" as Codeforces:', usersWithNA);
    
    // Count total Codeforces profiles in DB
    const totalCFProfiles = await CodingProfile.countDocuments({
        platform: 'codeforces'
    });
    
    console.log('Total Codeforces profiles in database:', totalCFProfiles);
    
    // Check for duplicates
    const duplicates = await CodingProfile.aggregate([
        { $match: { platform: 'codeforces' } },
        { $group: { _id: '$userId', count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } }
    ]);
    
    console.log('Users with duplicate profiles:', duplicates.length);
    
    // Show sample of users that should sync but didn't
    const validUsers = await User.find({
        codeforcesProfile: { $exists: true, $ne: '', $ne: 'NA', $ne: null }
    }).select('fullName codeforcesProfile').limit(5);
    
    console.log('\n=== SAMPLE VALID USERS ===');
    for (const user of validUsers) {
        const profile = await CodingProfile.findOne({
            userId: user._id,
            platform: 'codeforces'
        });
        
        console.log(`${user.fullName} (${user.codeforcesProfile}): ${profile ? '✅ Synced' : '❌ Not synced'}`);
    }
    
    // Calculate actual success rate
    const actualSynced = Math.min(totalCFProfiles, usersWithValidCF);
    const successRate = usersWithValidCF > 0 ? ((actualSynced / usersWithValidCF) * 100).toFixed(1) : 0;
    
    console.log('\n=== CORRECT ANALYSIS ===');
    console.log('Users with valid Codeforces handles:', usersWithValidCF);
    console.log('Successfully synced profiles:', actualSynced);
    console.log('Failed to sync:', Math.max(0, usersWithValidCF - actualSynced));
    console.log('Success rate:', successRate + '%');
    
    process.exit(0);
}

investigate().catch(console.error);