// Manual fix script for Yugesh's Codeforces profile
// Run this in MongoDB console or as a Node.js script

const mongoose = require('mongoose');
const CodingProfile = require('./server/models/codingProfileModel');
const User = require('./server/models/userModel');

async function fixYugeshProfile() {
    try {
        // Connect to MongoDB (if running as standalone script)
        // await mongoose.connect(process.env.MONGO_URL);
        
        // Find Yugesh's user record
        const yugesh = await User.findOne({ 
            admissionNumber: 'U25AI093' 
        });
        
        if (!yugesh) {
            console.log('User not found with admission number U25AI093');
            return;
        }
        
        console.log(`Found user: ${yugesh.fullName}`);
        console.log(`Current Codeforces profile: ${yugesh.codeforcesProfile}`);
        
        // Remove old Codeforces profile data
        const deleteResult = await CodingProfile.deleteOne({
            userId: yugesh._id,
            platform: 'codeforces'
        });
        
        console.log(`Deleted ${deleteResult.deletedCount} old Codeforces profile records`);
        
        // The profile will be re-synced when the external API is available
        console.log('Profile cleared. New data will be synced when external API is restored.');
        
    } catch (error) {
        console.error('Error fixing profile:', error);
    }
}

// Run the fix
fixYugeshProfile();