import React, { useState, useEffect } from 'react';

const CodeforcesProfile = ({ codeforcesId }) => {
    const [userData, setUserData] = useState(null);
    const [ratingData, setRatingData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCodeforcesData = async () => {
        setLoading(true);
        try {
            
            const [userResponse, ratingResponse] = await Promise.all([
                fetch(`https://codeforces.com/api/user.info?handles=${codeforcesId}`),
                fetch(`https://codeforces.com/api/user.rating?handle=${codeforcesId}`)
            ]);

            const userData = await userResponse.json();
            const ratingData = await ratingResponse.json();

            if (userData.status === 'OK') {
                setUserData(userData.result[0]);
            }
            if (ratingData.status === 'OK') {
                setRatingData(ratingData.result);
            }
        } catch (error) {
            console.error('Error fetching Codeforces data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (codeforcesId) {
            fetchCodeforcesData();
        }
    }, [codeforcesId]);

    const getRatingColor = (rating) => {
        if (!rating) return 'text-gray-600';
        if (rating >= 2400) return 'text-red-600';
        if (rating >= 2100) return 'text-orange-600';
        if (rating >= 1900) return 'text-purple-600';
        if (rating >= 1600) return 'text-blue-600';
        if (rating >= 1400) return 'text-cyan-600';
        if (rating >= 1200) return 'text-green-600';
        return 'text-gray-600';
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (!userData) return null;

    return (
        <div className="space-y-6">
            {/* Profile Overview */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <img
                        src={userData.titlePhoto}
                        alt="Profile"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
                    />
                    <div className="text-center sm:text-left">
                        <h1 className="text-xl sm:text-2xl font-bold">
                            {userData.firstName} {userData.lastName}
                        </h1>
                        <div className="flex items-center justify-center sm:justify-start mt-2">
                            <span className={`text-lg font-semibold ${getRatingColor(userData.rating)}`}>
                                {userData.rank || 'Unrated'}
                            </span>
                            {userData.organization && (
                                <span className="ml-4 text-gray-600">
                                    {userData.organization}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded">
                        <h3 className="text-sm sm:text-base text-gray-600">Current Rating</h3>
                        <p className={`text-lg sm:text-xl font-bold ${getRatingColor(userData.rating)}`}>
                            {userData.rating || 'Unrated'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <h3 className="text-sm sm:text-base text-gray-600">Max Rating</h3>
                        <p className={`text-lg sm:text-xl font-bold ${getRatingColor(userData.maxRating)}`}>
                            {userData.maxRating || 'Unrated'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <h3 className="text-sm sm:text-base text-gray-600">Max Rank</h3>
                        <p className="text-lg sm:text-xl font-bold capitalize">
                            {userData.maxRank || 'Unrated'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <h3 className="text-sm sm:text-base text-gray-600">Contribution</h3>
                        <p className={`text-lg sm:text-xl font-bold ${
                            userData.contribution >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {userData.contribution}
                        </p>
                    </div>
                </div>
            </div>

            {/* Rating History */}
            {ratingData && ratingData.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Contest History</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Contest</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Rank</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Rating Change</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">New Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {ratingData.slice().reverse().map((contest, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <a 
                                                href={`https://codeforces.com/contest/${contest.contestId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                {contest.contestName}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 text-sm">#{contest.rank}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={contest.newRating > contest.oldRating ? 'text-green-600' : 'text-red-600'}>
                                                {contest.newRating - contest.oldRating > 0 ? '+' : ''}
                                                {contest.newRating - contest.oldRating}
                                            </span>
                                        </td>
                                        <td className={`px-4 py-3 text-sm ${getRatingColor(contest.newRating)}`}>
                                            {contest.newRating}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodeforcesProfile; 