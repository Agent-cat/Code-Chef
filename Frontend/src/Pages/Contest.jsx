import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ContestCard = ({ contest, type }) => {
    const getCardColor = () => {
        return type === 'future' ? 'bg-green-700 ' : 'bg-gray-700';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className={`${getCardColor()} rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200`}>
            <h3 className="text-xl font-bold mb-2 truncate">{contest.contest_name}</h3>
            <div className="space-y-2">
                <div>
                    <p className="text-sm opacity-80">Start Date</p>
                    <p className="font-medium">{formatDate(contest.contest_start_date)}</p>
                </div>
                <div>
                    <p className="text-sm opacity-80">End Date</p>
                    <p className="font-medium">{formatDate(contest.contest_end_date)}</p>
                </div>
                <div>
                    <p className="text-sm opacity-80">Duration</p>
                    <p className="font-medium">{contest.contest_duration} minutes</p>
                </div>
                {type === 'past' && (
                    <div>
                        <p className="text-sm opacity-80">Participants</p>
                        <p className="font-medium">{contest.distinct_users.toLocaleString()}</p>
                    </div>
                )}
                <div className="flex flex-col space-y-2 mt-4">
                    <a
                        href={`https://www.codechef.com/${contest.contest_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-md text-center transition-all duration-200"
                    >
                        View Contest
                    </a>
                    <Link
                        to={`/contest-attendance/${contest.contest_code}`}
                        className="inline-block bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-md text-center transition-all duration-200"
                    >
                        View Attendance
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Contest = () => {
    const navigate = useNavigate();
    const [contests, setContests] = useState({
        future: [],
        past: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3000/api/codechef/contests');
                setContests({
                    future: response.data.future_contests,
                    past: response.data.past_contests
                });
            } catch (err) {
                setError('Failed to fetch contests. Please try again later.');
                console.error('Error fetching contests:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchContests();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading contests...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-xl font-semibold text-red-600 mb-2">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-5rem)] p-6 bg-gray-50">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 px-4 py-2 text-black rounded-md hover:bg-text-800 transition-colors duration-200 flex items-center"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
            </button>

            
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Upcoming Contests</h2>
                {contests.future.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-gray-600 text-center">No upcoming contests at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contests.future.map((contest) => (
                            <ContestCard
                                key={contest.contest_code}
                                contest={contest}
                                type="future"
                            />
                        ))}
                    </div>
                )}
            </section>

          
            <section>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Past Contests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contests.past.map((contest) => (
                        <ContestCard
                            key={contest.contest_code}
                            contest={contest}
                            type="past"
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Contest;