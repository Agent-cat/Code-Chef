const axios = require('axios');

const BOT_TOKEN = "7314366996:AAG3pxhSvHQPqgfdUJkFl1BpnIvN2laApPc";
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

const getChatIds = async () => {
    try {
        const response = await axios.get(`${API_URL}/getUpdates`);
        const updates = response.data.result;
        
        const chatIds = [...new Set(updates
            .filter(update => {
                const chat = update.message?.chat || update.my_chat_member?.chat;
                return chat && (chat.type === 'group' || chat.type === 'supergroup');
            })
            .map(update => {
                const chat = update.message?.chat || update.my_chat_member?.chat;
                return chat?.id;
            })
            .filter(id => id))];

        return chatIds;
    } catch (error) {
        console.error("Error fetching chat IDs:", error.response?.data || error.message);
        return [];
    }
};

const sendMessage = async (message) => {
    const chatIds = await getChatIds();
    
    if (chatIds.length === 0) {
        console.log("No group chat IDs found.");
        return;
    }

    for (const chat_id of chatIds) {
        try {
            await axios.post(`${API_URL}/sendMessage`, {
                chat_id,
                text: message,
                parse_mode: 'HTML'
            });
            console.log(`Message sent successfully to group ${chat_id}!`);
        } catch (error) {
            console.error(`Error sending message to group ${chat_id}:`, error.response?.data || error.message);
        }
    }
};

const checkAndNotifyContests = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/codechef/contests');
        const futureContests = response.data.future_contests;

        for (const contest of futureContests) {
            const startTime = new Date(contest.contest_start_date_iso);
            const currentTime = new Date();
            const timeUntilStart = startTime - currentTime;

           
            if (timeUntilStart > 0 && timeUntilStart <= 5 * 60 * 1000) {
                const message = `🚨 <b>Contest Starting Soon!</b> 🚨\n\n` +
                    `Contest: ${contest.contest_name}\n` +
                    `Start Time: ${contest.contest_start_date}\n` +
                    `Duration: ${contest.contest_duration} minutes\n\n` +
                    `Join now: https://www.codechef.com/${contest.contest_code}`;
                
                await sendMessage(message);
            }
        }
    } catch (error) {
        console.error('Error checking contests:', error);
    }
};


setInterval(checkAndNotifyContests, 60 * 1000);


checkAndNotifyContests();
