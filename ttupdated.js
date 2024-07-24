const axios = require('axios');
const cheerio = require('cheerio');
const randomUseragent = require('random-useragent');
const { Client } = require('discord.js-selfbot-v13');
const client = new Client();
const pattern = /^https:\/\/flux\.li\/android\/external\/start\.php\?HWID=\w+/;
const keyget = async (htmlContent) => {
    const $ = cheerio.load(htmlContent);
    const codeElement = $('code').first();
    return codeElement ? codeElement.text().trim() : null;
};
const fluxusbypass = async (url) => {
    const userAgent = randomUseragent.getRandom();
    const headers = {
        'User-Agent': userAgent,
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
    };
    const urls = [
        url,
        'https://flux.li/android/external/check1.php?hash=',
        'https://flux.li/android/external/main.php?hash='
    ];

    for (let i = 0; i < urls.length; i++) {
        if (i === 1) headers['Referer'] = 'https://linkvertise.com/580726/fluxus1';
        try {
            console.log(`User-Agent: ${userAgent}`);
            const response = await axios.get(urls[i], { headers, timeout: 30000 });
            if (i === 2) {
                const key = await keyget(response.data);
                return key ? key : 'Key not found';
            }
        } catch (error) {
            console.error(`Error accessing ${urls[i]}: ${error}`);
            return 'Key retrieval failed';
        }
    }
};
client.on('ready', () => console.log('selfbot is ready!'));
client.on('messageCreate', async (message) => {
    const urls = message.content.split(/\s+/).filter(url => pattern.test(url));
    if (urls.length > 0) {
        for (const url of urls) {
            const key = await fluxusbypass(url);
            message.reply(`${key}`);
        }
    }
});
client.login('your discord account token');
