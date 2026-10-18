const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Ссылки на твои файлы, которые уже лежат у тебя в репозитории
const GITHUB_USERS_URL = "https://githubusercontent.com";
const GITHUB_SCRIPT_URL = "https://githubusercontent.com";

app.get('/gate', async (req, res) => {
    const userHWID = req.query.hwid;
    if (!userHWID) return res.send("denied");

    try {
        // Скачиваем белый список с гитхаба моментально, обходя кэш
        const usersResponse = await axios.get(`${GITHUB_USERS_URL}?nocache=${Date.now()}`);
        const allowedHWIDs = usersResponse.data.split(\(/\r\)?\n/).map(line => line.trim()).filter(Boolean);

        // Проверяем HWID в списке
        if (!allowedHWIDs.includes(userHWID)) {
            return res.send("denied");
        }

        // Скачиваем обфусцированный код твоей луашки Lethe v1.6 и отдаем в чит
        const scriptResponse = await axios.get(`${GITHUB_SCRIPT_URL}?nocache=${Date.now()}`);
        res.setHeader('Content-Type', 'text/plain');
        return res.send(scriptResponse.data);

    } catch (error) {
        return res.send("denied");
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
