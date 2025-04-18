import React, { useState, useEffect } from 'react';

const LeetcodeProfile = ({ leetcodeId }) => {
    const [leetcodeData, setLeetcodeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchLeetcodeData = async () => {
        if (!leetcodeId) {
            setError('No LeetCode ID provided');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_LEETCODE_API_URL}/${leetcodeId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch LeetCode data');
            }
            const data = await response.json();
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid data received from LeetCode API');
            }
            setLeetcodeData(data);
        } catch (error) {
            console.error('Error fetching Leetcode data:', error);
            setError('Failed to load LeetCode profile');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLeetcodeData();
    }, [leetcodeId]);

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading LeetCode profile...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    if (!leetcodeData) return null;

    // Safely access nested properties with optional chaining and fallbacks
    const totalSubmissions = leetcodeData?.totalSubmissions?.find?.(s => s?.difficulty === 'All')?.submissions ?? 0;
    const acceptedSubmissions = leetcodeData?.matchedUserStats?.acSubmissionNum?.find?.(s => s?.difficulty === 'All')?.submissions ?? 0;
    const acceptanceRate = totalSubmissions ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1) : 0;

    // Check if required data exists
    if (!leetcodeData.totalSubmissions || !leetcodeData.matchedUserStats) {
        return (
            <div className="text-center py-8">
                <div className="bg-yellow-50 text-yellow-600 px-4 py-3 rounded-lg">
                    Unable to load complete profile data. Some information might be missing.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Overall Stats</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600">Total Solved</p>
                            <p className="text-2xl font-bold">{leetcodeData.totalSolved ?? 0}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Global Ranking</p>
                            <p className="text-2xl font-bold">#{leetcodeData.ranking ?? 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Contribution Points</p>
                            <p className="text-2xl font-bold">{leetcodeData.contributionPoint ?? 0}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Acceptance Rate</p>
                            <p className="text-2xl font-bold">{acceptanceRate}%</p>
                        </div>
                    </div>
                </div>

                {/* Problem Solving Progress */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Problem Solving</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-green-600">Easy</span>
                                <span className="text-sm text-gray-600">{leetcodeData.easySolved ?? 0}/{leetcodeData.totalEasy ?? 0}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${leetcodeData.easySolved && leetcodeData.totalEasy ? (leetcodeData.easySolved / leetcodeData.totalEasy) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-yellow-600">Medium</span>
                                <span className="text-sm text-gray-600">{leetcodeData.mediumSolved ?? 0}/{leetcodeData.totalMedium ?? 0}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-yellow-500 h-2 rounded-full"
                                    style={{ width: `${leetcodeData.mediumSolved && leetcodeData.totalMedium ? (leetcodeData.mediumSolved / leetcodeData.totalMedium) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-red-600">Hard</span>
                                <span className="text-sm text-gray-600">{leetcodeData.hardSolved ?? 0}/{leetcodeData.totalHard ?? 0}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-red-500 h-2 rounded-full"
                                    style={{ width: `${leetcodeData.hardSolved && leetcodeData.totalHard ? (leetcodeData.hardSolved / leetcodeData.totalHard) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-gray-600 mb-2">Total Questions Available</p>
                            <p className="text-2xl font-bold">{leetcodeData.totalQuestions ?? 0}</p>
                        </div>
                    </div>
                </div>

                {/* Submission Details */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Submission Stats</h3>
                    <div className="space-y-4">
                        {(leetcodeData.totalSubmissions ?? []).map((submission, index) => (
                            <div key={index} className="border-b pb-2 last:border-0">
                                <p className="text-sm text-gray-600">{submission?.difficulty ?? 'Unknown'}</p>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-sm">Submissions</p>
                                        <p className="text-lg font-semibold">{submission?.submissions ?? 0}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm">Problems</p>
                                        <p className="text-lg font-semibold">{submission?.count ?? 0}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            {leetcodeData.recentSubmissions && leetcodeData.recentSubmissions.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Recent Submissions</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Problem</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Language</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Submitted</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {leetcodeData.recentSubmissions.map((submission, index) => {
                                    const timestamp = submission?.timestamp ? new Date(submission.timestamp * 1000) : new Date();
                                    return (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <a 
                                                    href={`https://leetcode.com/problems/${submission?.titleSlug ?? ''}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    {submission?.title ?? 'Unknown Problem'}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    submission?.statusDisplay === 'Accepted' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {submission?.statusDisplay ?? 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">{submission?.lang ?? 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {timestamp.toLocaleDateString()} {timestamp.toLocaleTimeString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Submission Calendar */}
            {leetcodeData.submissionCalendar && Object.keys(leetcodeData.submissionCalendar).length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity Calendar</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(leetcodeData.submissionCalendar)
                            .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
                            .slice(0, 8)
                            .map(([timestamp, count]) => {
                                const date = new Date(parseInt(timestamp) * 1000);
                                return (
                                    <div key={timestamp} className="bg-gray-50 p-4 rounded">
                                        <p className="text-sm text-gray-600">
                                            {date.toLocaleDateString('en-US', { 
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-xl font-bold mt-1">{count ?? 0} submissions</p>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeetcodeProfile;