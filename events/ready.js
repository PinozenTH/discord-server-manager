const { REST } = require('@discordjs/rest');
const { Routes, SlashCommandBuilder, ActivityType, Status, ActivityPlatform } = require('discord.js');

const commands = [
    new SlashCommandBuilder().setName('voice-hide').setDescription('Hide the voice channel'),
    new SlashCommandBuilder().setName('voice-reveal').setDescription('Reveal the voice channel'),
    new SlashCommandBuilder().setName('voice-lock').setDescription('Lock the voice channel'),
    new SlashCommandBuilder()
        .setName('voice-limit')
        .setDescription('Set the user limit for the voice channel')
        .addIntegerOption(option =>
        option.setName('limit')
            .setDescription('The maximum number of users allowed in the channel')
            .setRequired(true)),
    new SlashCommandBuilder()
        .setName('voice-kick')
        .setDescription('Kick a user from the voice channel')
        .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to kick from the voice channel')
            .setRequired(true)),
    new SlashCommandBuilder()
        .setName('voice-ban')
        .setDescription('Ban a user from the voice channel')
        .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to ban from the voice channel')
            .setRequired(true)),
    new SlashCommandBuilder()
        .setName('voice-unban')
        .setDescription('Unban a user from the voice channel')
        .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to unban from the voice channel')
            .setRequired(true)),
    new SlashCommandBuilder()
        .setName('voice-rename')
        .setDescription('Rename the voice channel')
        .addStringOption(option =>
        option.setName('name')
            .setDescription('The new name for the voice channel')
            .setRequired(true)),
    new SlashCommandBuilder()
        .setName('voice-add')
        .setDescription('Add a user to the voice channel')
        .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to add into voice channel')
            .setRequired(true)),
]

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
      console.log(`Logged in as ${client.user.tag}!`);

      const guildId = '749969091560734822';
      const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    
      try {
        console.log('Started unregistering older application commands.');
        rest.put(
          Routes.applicationGuildCommands(client.user.id, guildId),
          { body: commands }
        );
        console.log('Successfully unregistered all application commands.');
      } catch (error) {
        console.error('Error managing application commands:', error);
      }
      console.log('Started registering application commands.')
      console.log('Successfully registered application commands.');

      client.guilds.cache.forEach(guild => {
        console.log(`Connected to guild: ${guild.name}`);
        if (guild.id !== guildId) {
          guild.leave();
          console.log(`Left guild: ${guild.name}`);
        }
      });
      const guild = client.guilds.cache.get(guildId);
      if (guild) {
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
      }
    },
};