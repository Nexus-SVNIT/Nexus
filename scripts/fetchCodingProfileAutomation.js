// This script is intended to be run by GitHub Actions to mark users as alumni for a given year.
// Usage: node scripts/markAlumniGithubAction.js [year]

require('dotenv').config();

const mongoose = require('mongoose');
const axios = require('axios');


const MONGO_URL = process.env.MONGO_URL;
const CODING_PROFILE_API = process.env.CODING_PROFILE_BASE_URL;
if (!MONGO_URL) {
    console.error('Error: MONGO_URL environment variable is not set. Please set it before running this script.');
    process.exit(1);
}

const fetchAllCodingProfiles = async (platform) => {
    try {
        const users = await mongoose.connection.db.collection('users').find({}, { fullName: 1, admissionNumber: 1, [platform + 'Profile']: 1 }).toArray();
        const profiles = [];
        await Promise.all(users.map(async (userDoc) => {
            try {
                if (!userDoc[platform + 'Profile']) return;
                const userId = userDoc[platform + "Profile"];
                const response = await axios.get(`${CODING_PROFILE_API}/user/${platform}/${userId}`);
                const data = platform === 'leetcode' ? response?.data?.data : response?.data;

                if (!data) return;
                let sortingKey = 0;
                switch (platform) {
                    case 'codeforces':
                        sortingKey = data[0]?.rating || 0;
                        break;
                    case 'codechef':
                        sortingKey = data?.rating_number || 0;
                        break;
                        case 'leetcode':
                        sortingKey = data?.userContestRanking?.rating || 0;
                        break;
                    default:
                }

                profiles.push({
                    data,
                    sortingKey,
                    profileId: userId,
                    userId: userDoc._id,
                    fullName: userDoc.fullName,
                    admissionNumber: userDoc.admissionNumber
                });
            } catch (e) {
                console.log(e);
            }
        }));
        if (profiles.length === 0) {
            console.log(`No coding profiles found for ${platform}`);
            return;
        }

        await Promise.all(profiles.map(profile => 
            mongoose.connection.db.collection('codingProfiles').findOneAndUpdate(
                { platform, profileId: profile.profileId },
                {
                    $set: {
                        data: profile.data,
                        sortingKey: profile.sortingKey,
                        userId: profile.userId,
                        fullName: profile.fullName,
                        admissionNo: profile.admissionNumber,
                        updatedAt: new Date()
                    }
                },
                { returnDocument: 'after', upsert: true }
            )
        ));

        console.log(`Successfully fetched and updated ${profiles.length} coding profiles for platform: ${platform}`);
        return; 
    } catch (error) {
        console.log(`Error fetching coding profiles: ${error}`);
        return;
    }
}

async function main() {
    console.log('Connecting to MongoDB with URL:', MONGO_URL);
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
        console.log('MongoDB connection established.');
    } catch (connErr) {
        console.error('MongoDB connection error:', connErr);
        mongoose.disconnect();
        process.exit(1);
    }
    try {
        const platforms = ['codeforces', 'codechef', 'leetcode']; // Add other platforms as needed
        for (const platform of platforms) {
            await fetchAllCodingProfiles(platform);
        }
        console.log('All coding profiles fetched and updated successfully.');
    } catch (queryErr) {
        console.error('Error during user query/update:', queryErr);
    }
    mongoose.disconnect();
}

main().catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
});
