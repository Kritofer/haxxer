const axios = require('axios')

const url = 'https://master1.ddnet.org/ddnet/15/servers.json'

async function getServers(ip) {
    const response = await axios.get(url)
    const servers = response.data.servers
    for (let i = 0; i < servers.length; i++) {
        if (!ip) break
        const serverIp = servers[i].addresses[0].substring(13)
        if (serverIp === ip) {
            return servers[i]
        }
    }
    return servers
}

module.exports = getServers