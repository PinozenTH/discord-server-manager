const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  execute: async function(member) {
    // Add the role to the new member
    const roleId = '977018045937619084';
    try {
      await member.roles.add(roleId);
      console.log(`Added role ${roleId} to ${member.user.username}`);
    } catch (error) {
      console.error(`Failed to add role ${roleId} to ${member.user.username}:`, error);
    }

    const welcomeEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Please Welcome!')
      .setDescription(`Hello Stranger! <@${member.user.id}>, Welcome to ${member.guild.name}! We are glad you are here!`)
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
          { name: 'Server Information', value: '<#749969744748216453>' },
          { name: 'Invited by', value: member.inviter ? `<@${member.inviter.id}>` : 'Unknown' }
      )
      .setTimestamp()
      .setFooter({ text: 'We hope you enjoy your stay!' });

    const channel = member.guild.systemChannel;
    if (channel) {
      channel.send({ embeds: [welcomeEmbed] });
    }
  },
};