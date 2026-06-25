const axios = require('axios');

const PRIORITY_WEIGHTS = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
};


function getPriorityRank(notification) {
    const weight = PRIORITY_WEIGHTS[notification.Type] || 0;
    const unixTimestamp = new Date(notification.Timestamp).getTime();
    return { weight, unixTimestamp };
}


 
async function fetchAndProcessPriorityInbox(n = 10) {
    const apiUrl = 'http://4.224.186.213/evaluation-service/notifications';
    
    try {
        console.log(`Fetching notifications from protected API...`);
        const response = await axios.get(apiUrl);
        const notifications = response.data.notifications;

        if (!notifications || !Array.isArray(notifications)) {
            console.error("Invalid response format received from API.");
            return;
        }

        notifications.sort((a, b) => {
            const rankA = getPriorityRank(a);
            const rankB = getPriorityRank(b);

            if (rankB.weight !== rankA.weight) {
                return rankB.weight - rankA.weight;
            }
            // Secondary Sort: Newer timestamp comes first
            return rankB.unixTimestamp - rankA.unixTimestamp;
        });

        const priorityInbox = notifications.slice(0, n);

        console.log(`\n=== PRIORITY INBOX (TOP ${n} NOTIFICATIONS) ===`);
        priorityInbox.forEach((item, index) => {
            console.log(`[${index + 1}] Type: ${item.Type.padEnd(10)} | Time: ${item.Timestamp} | Message: ${item.Message}`);
        });

    } catch (error) {
        console.error("Error executing Priority Inbox process:", error.message);
    }
}

fetchAndProcessPriorityInbox(10);