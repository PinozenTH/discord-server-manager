const { execute } = require("./events/ready");

module.exports = {
    name: 'presenceUpdate',
    execute(newPresence) {
        if (newPresence.user.bot) return;
        const guildId = '749969091560734822';
        const guild = client.guilds.cache.get(guildId);
        if (!guild) return console.log('Guild not found.');
    
        const memberCount = guild.memberCount;
        let onlineMembers = guild.members.cache.filter(member => member.presence?.status === 'online').size;
        let idleMembers = guild.members.cache.filter(member => member.presence?.status === 'idle').size;
        let dndMembers = guild.members.cache.filter(member => member.presence?.status === 'dnd').size;
    
        client.user.setPresence({
        activities: [{
            name: `${memberCount} guests`,
            type: ActivityType.Custom,
            state: `${onlineMembers > 0 ? `🟢 ${onlineMembers}` : ''}${dndMembers > 0 ? ` ⛔ ${dndMembers}` : ''}${idleMembers > 0 ? ` 🌙 ${idleMembers}` : ''}`.trim(),
            instance: false,
        }],
        status: 'idle'
        });
    
        console.log(`Updated activity to Watching ${memberCount} Guest`);
    }
}