import React, { useState, useEffect } from 'react';

const CodechefProfile = ({ codechefId }) => {
    const [codechefData, setCodechefData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCodechefData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://codechef-api.vercel.app/handle/${codechefId}`);
            const data = await response.json();
            setCodechefData(data);
        } catch (error) {
            console.error('Error fetching CodeChef data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (codechefId) {
            fetchCodechefData();
        }
    }, [codechefId]);

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (!codechefData) return null;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <img
                        src={codechefData.profile}
                        alt="Profile"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
                    />
                    <div className="text-center sm:text-left">
                        <h1 className="text-xl sm:text-2xl font-bold">{codechefData.name}</h1>
                        <div className="flex items-center justify-center sm:justify-start mt-2">
                            <img
                                src={codechefData.countryFlag}
                                alt={codechefData.countryName}
                                className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
                            />
                            <span className="text-sm sm:text-base">{codechefData.countryName}</span>
                            <span className="ml-4 text-yellow-500">{codechefData.stars}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded">
                        <h3 className="text-sm sm:text-base text-gray-600">Current Rating</h3>
                        <p className="text-lg sm:text-xl font-bold">{codechefData.currentRating}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <h3 className="text-sm sm:text-base text-gray-600">Highest Rating</h3>
                        <p className="text-lg sm:text-xl font-bold">{codechefData.highestRating}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <h3 className="text-sm sm:text-base text-gray-600">Global Rank</h3>
                        <p className="text-lg sm:text-xl font-bold">{codechefData.globalRank}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <h3 className="text-sm sm:text-base text-gray-600">Country Rank</h3>
                        <p className="text-lg sm:text-xl font-bold">{codechefData.countryRank}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Contest History</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm">Contest</th>
                                <th className="px-4 py-2 text-left text-sm">Date</th>
                                <th className="px-4 py-2 text-left text-sm">Rating</th>
                                <th className="px-4 py-2 text-left text-sm">Rank</th>
                                <th className="px-4 py-2 text-left text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {codechefData.ratingData.map((contest, index) => (
                                <tr key={index} className={contest.reason ? 'bg-red-50' : ''}>
                                    <td className="px-4 py-2 text-sm">{contest.name}</td>
                                    <td className="px-4 py-2 text-sm">
                                        {`${contest.getyear}-${contest.getmonth}-${contest.getday}`}
                                    </td>
                                    <td className="px-4 py-2 text-sm" style={{ color: contest.color }}>
                                        {contest.rating}
                                    </td>
                                    <td className="px-4 py-2 text-sm">{contest.rank}</td>
                                    <td className="px-4 py-2 text-sm text-red-600">
                                        {contest.reason || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Activity History</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm">Date</th>
                                <th className="px-4 py-2 text-left text-sm">Submissions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {codechefData.heatMap.map((activity, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 text-sm">{activity.date}</td>
                                    <td className="px-4 py-2 text-sm">{activity.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CodechefProfile; 