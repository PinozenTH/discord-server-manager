const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberRemove',
  execute(member) {
    const goodbyeEmbed = new EmbedBuilder()
      .setColor('#FF6347')
      .setTitle('Farewell!')
      .setDescription(`Goodbye, ${member.user.username}! We're sorry to see you go.`)
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        { name: 'Member Since', value: member.joinedAt.toDateString() },
        { name: 'Total Members Now', value: member.guild.memberCount.toString() }
      )
      .setTimestamp()
      .setFooter({ text: 'We hope to see you again soon!' });

    const channel = member.guild.systemChannel;
    if (channel) {
      channel.send({ embeds: [goodbyeEmbed] });
    }
  },
};