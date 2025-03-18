const axios=require('axios')

const BOT_TOKEN = "7314366996:AAG3pxhSvHQPqgfdUJkFl1BpnIvN2laApPc";
const CHAT_ID = "-4281948932";

const sendMessage = async (message) => {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        await axios.post(url, {
            chat_id: CHAT_ID,
            text: message,
        });
        console.log("Message sent successfully!");
    } catch (error) {
        console.error("Error sending message:", error.response.data);
    }
};

sendMessage("Hi");
