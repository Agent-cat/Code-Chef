const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const studentRoutes = require("./routes/student.routes");
const contestRoutes = require("./routes/contest.routes");
const adminRoutes = require("./routes/admin.routes");
const counselorRoutes = require("./routes/counselor.routes");
const { ConnectDB } = require("./Database/connection");
const port = process.env.PORT || 4000;

const axios = require('axios');

const BOT_TOKEN = "7314366996:AAG3pxhSvHQPqgfdUJkFl1BpnIvN2laApPc";
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

const notifiedContests = new Set();

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
        const futureContests = response.data.future_contests[0];
        console.log("futureContests", futureContests);
        console.log("time", new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false }));
        if (futureContests) {
            if (notifiedContests.has(futureContests.contest_code)) {
                return;
            }

            const startTime = new Date(futureContests.contest_start_date_iso);
            const currentTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
            const timeUntilStart = startTime - currentTime;
            console.log("timeUntilStart", timeUntilStart);
            if (timeUntilStart > 0 && timeUntilStart <= 5 * 60 * 1000) {
                const message = `🚨 <b>Contest Starting Soon!</b> 🚨\n\n` +
                    `Contest: ${futureContests.contest_name}\n` +
                    `Start Time: ${new Date(futureContests.contest_start_date_iso).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}\n` +
                    `Duration: ${futureContests.contest_duration} minutes\n\n` +
                    `Join now: https://www.codechef.com/${futureContests.contest_code}`;
                
                await sendMessage(message);
                notifiedContests.add(futureContests.contest_code);
            }
        }
    } catch (error) {
        console.error('Error checking contests:', error);
    }
};

const clearNotifiedContests = () => {
    notifiedContests.clear();
    console.log('Cleared notified contests set');
};

ConnectDB();
app.use(cors({
  origin: '*'
}));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/students", studentRoutes);
app.use("/api/codechef", contestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", counselorRoutes);

setInterval(checkAndNotifyContests, 60 * 1000);

setInterval(clearNotifiedContests, 7 * 15 * 60 * 60 * 1000);

checkAndNotifyContests();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
