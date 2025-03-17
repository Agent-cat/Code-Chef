import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentStats = () => {
    const { handle } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`https://codechef-api.vercel.app/handle/${handle}`);
                console.log('API Response:', response.data);
                setUserData(response.data);
            } catch (err) {
                setError('Failed to fetch user data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [handle]);

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-600">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-2 sm:p-4">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center"
            >
                <span>← Back</span>
            </button>

            
            <div className="bg-white rounded-lg shadow p-3 sm:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <img
                        src={userData.profile}
                        alt="Profile"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
                    />
                    <div className="text-center sm:text-left">
                        <h1 className="text-xl sm:text-2xl font-bold">{userData.name}</h1>
                        <div className="flex items-center justify-center sm:justify-start mt-2">
                            <img
                                src={userData.countryFlag}
                                alt={userData.countryName}
                                className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
                            />
                            <span className="text-sm sm:text-base">{userData.countryName}</span>
                            <span className="ml-4 text-yellow-500">{userData.stars}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                    <div className="p-2 sm:p-4 bg-gray-50 rounded">
                        <h3 className="text-sm sm:text-base text-gray-600">Current Rating</h3>
                        <p className="text-lg sm:text-xl font-bold">{userData.currentRating}</p>
                    </div>
                    <div className="p-2 sm:p-4 bg-gray-50 rounded">
                        <h3 className="text-sm sm:text-base text-gray-600">Highest Rating</h3>
                        <p className="text-lg sm:text-xl font-bold">{userData.highestRating}</p>
                    </div>
                    <div className="p-2 sm:p-4 bg-gray-50 rounded">
                        <h3 className="text-sm sm:text-base text-gray-600">Global Rank</h3>
                        <p className="text-lg sm:text-xl font-bold">{userData.globalRank}</p>
                    </div>
                    <div className="p-2 sm:p-4 bg-gray-50 rounded">
                        <h3 className="text-sm sm:text-base text-gray-600">Country Rank</h3>
                        <p className="text-lg sm:text-xl font-bold">{userData.countryRank}</p>
                    </div>
                </div>
            </div>

            
            <div className="bg-white rounded-lg shadow p-3 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4">Contest History</h2>
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Contest</th>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Date</th>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Rating</th>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Rank</th>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userData.ratingData.map((contest, index) => (
                                    <tr key={index} className={contest.reason ? 'bg-red-50' : ''}>
                                        <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{contest.name}</td>
                                        <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                                            {`${contest.getyear}-${contest.getmonth}-${contest.getday}`}
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm" style={{ color: contest.color }}>
                                            {contest.rating}
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{contest.rank}</td>
                                        <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-red-600">
                                            {contest.reason || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

    
            <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4">Activity History</h2>
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Date</th>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Submissions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userData.heatMap.map((activity, index) => (
                                    <tr key={index}>
                                        <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{activity.date}</td>
                                        <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{activity.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentStats;
