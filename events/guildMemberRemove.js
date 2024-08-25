const { EmbedBuilder, ActivityType } = require('discord.js');

module.exports = {
  name: 'guildMemberRemove',
  execute(member, client) {
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
    const guild = client.guilds.cache.get('749969091560734822');
      if (guild) {
        const memberCount = guild.memberCount;
        client.user.setPresence({
          activities: [{
            name: `${memberCount} guests`,
            type: ActivityType.Watching
          }],
          status: "idle"
        });
        console.log(`Set activity to Watching ${memberCount} Guest`);
      } else {
        console.log('Guild not found.');
      }
  },
};