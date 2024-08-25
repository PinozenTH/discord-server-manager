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
  },
};