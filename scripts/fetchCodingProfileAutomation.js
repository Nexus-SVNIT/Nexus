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

const getStatus = (admissionNumber) => {
    const year = admissionNumber.slice(1, 3);
    const program = admissionNumber.slice(0, 1);

    switch (program) {
        case 'U':
            return year <= (new Date().getFullYear() - 4) % 2000 ? 'alumni' : 'current';
        case 'P':
            return year <= (new Date().getFullYear() - 2) % 2000 ? 'alumni' : 'current';
        case 'D':
        case 'I':
            return year <= (new Date().getFullYear() - 5) % 2000 ? 'alumni' : 'current';
        default:
            return 'current';
    }
};

const requiredData = (profile, index, platform) => {
    switch (platform) {
        case 'codeforces':
            return {
                sortingKey: profile.sortingKey,
                userId: profile.userId,
                fullName: profile.fullName,
                admissionNo: profile.admissionNumber,
                year: profile.admissionNumber.slice(1, 3),
                program: profile.admissionNumber.slice(0, 1),
                branch: profile.admissionNumber.slice(3, 5),
                status: getStatus(profile.admissionNumber),
                updatedAt: new Date(),
                nexusRank: index + 1,
                maxRating: profile?.data?.[0]?.maxRating || "N/A",
                rating: profile?.data?.[0]?.rating || "N/A",
                rank: profile?.data?.[0]?.rank || "N/A",
            }
        case 'leetcode':
            return {
                sortingKey: profile.sortingKey,
                userId: profile.userId,
                fullName: profile.fullName,
                admissionNo: profile.admissionNumber,
                year: profile.admissionNumber.slice(1, 3),
                program: profile.admissionNumber.slice(0, 1),
                branch: profile.admissionNumber.slice(3, 5),
                status: getStatus(profile.admissionNumber),
                updatedAt: new Date(),
                nexusRank: index + 1,
                globalRanking: profile?.data?.userContestRanking?.globalRanking || "N/A",
                rating: profile?.data?.userContestRanking?.rating ? Number(profile.data.userContestRanking.rating).toFixed(2) : "N/A",
                totalSolved: profile?.data?.matchedUser?.submitStats?.acSubmissionNum?.[0]?.count || "N/A",
                attendedContestsCount: profile?.data?.userContestRanking?.attendedContestsCount || "N/A",
                profileId: profile.profileId,
            };
        case "codechef":
            return {
                sortingKey: profile.sortingKey,
                userId: profile.userId,
                fullName: profile.fullName,
                admissionNo: profile.admissionNumber,
                year: profile.admissionNumber.slice(1, 3),
                program: profile.admissionNumber.slice(0, 1),
                branch: profile.admissionNumber.slice(3, 5),
                status: getStatus(profile.admissionNumber),
                updatedAt: new Date(),
                nexusRank: index + 1,
                rating_number: profile?.data?.rating_number || "N/A",
                rating: profile?.data?.rating || "N/A",
                globalRank: profile?.data?.global_rank || "N/A",
                profileId: profile.profileId,
            };
        default:
            return {};
    }
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
                console.log(`Error ${userDoc.admissionNo} ${platform} profile: ${e.message}`);
            }
        }));
        if (profiles.length === 0) {
            console.log(`No coding profiles found for ${platform}`);
            return;
        }

        // sort profiles by sortingKey in descending order
        profiles.sort((a, b) => b.sortingKey - a.sortingKey);

        await Promise.all(profiles.map((profile, index) =>
            mongoose.connection.db.collection('codingprofiles').findOneAndUpdate(
                { platform, profileId: profile.profileId },
                {
                    $set: requiredData(profile, index, platform)
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
    console.log('Connecting to MongoDB with URL:');
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
