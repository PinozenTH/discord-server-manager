const { EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'guildMemberUpdate',
  execute(oldMember, newMember) {
    if (oldMember.premiumSince === null && newMember.premiumSince !== null) {
      const guild = newMember.guild;
      const embed = new EmbedBuilder()
        .setTitle('Server Boost!')
        .setDescription(`${newMember} has boosted the server!`)
        .setColor(0x0099ff)
        .setThumbnail(newMember.user.displayAvatarURL())
        .setFooter({ text: 'Pinont\'s Home' });
      guild.channels.cache.get('921727387132104764').send({ embeds: [embed] });
    }
    if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
      const removedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id) && !newMember.user.bot);
      const botRoleId = '752910580544831549';
      const musicBotRoleId = '855670721728348190';
      if (removedRoles.has(botRoleId)) {
        newMember.roles.remove(botRoleId);
        newMember.user.send('You don\'t have permission to access Bot roles');
      } else if (removedRoles.has(musicBotRoleId)) {
        newMember.roles.remove(musicBotRoleId);
        newMember.user.send('You don\'t have permission to access Music bot roles');
      }
    }
  },
};