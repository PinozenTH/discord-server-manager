module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;
      
        if (commandName === 'voice-hide' || commandName === 'voice-reveal' || commandName === 'voice-lock') {
          const voiceChannel = interaction.member.voice.channel;
          if (!voiceChannel) {
            await interaction.reply({ content: 'You need to be in a voice channel to use this command.', ephemeral: true });
            return;
          }
          const voiceChannelCategoryID = voiceChannel.parentId;
          if (voiceChannelCategoryID !== '1276554466849591327') {
            await interaction.reply({ content: 'This command can only be used on Party voice chat.', ephemeral: true });
            return;
          }
      
          try {
            if (commandName === 'voice-hide') {
              await voiceChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: false });
              await interaction.reply({ content: 'Voice channel hidden.', ephemeral: true });
            } else if (commandName === 'voice-reveal') {
              await voiceChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: true });
              await interaction.reply({ content: 'Voice channel revealed.', ephemeral: true });
            } else if (commandName === 'voice-lock') {
              await voiceChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: false });
              await interaction.reply({ content: 'Voice channel locked.', ephemeral: true });
            }
          } catch (error) {
            console.error('Error executing voice command:', error);
            await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
          }
        } else if (commandName === 'voice-limit') {
          const voiceChannel = interaction.member.voice.channel;
          if (!voiceChannel) {
            await interaction.reply({ content: 'You need to be in a voice channel to use this command.', ephemeral: true });
            return;
          }
      
          const limit = interaction.options.getInteger('limit');
          try {
            await voiceChannel.setUserLimit(limit);
            await interaction.reply({ content: `Voice channel user limit set to ${limit}.`, ephemeral: true });
          } catch (error) {
            console.error('Error setting voice channel limit:', error);
            await interaction.reply({ content: 'An error occurred while setting the user limit.', ephemeral: true });
          }
        } else if (commandName === 'voice-kick') {
          const voiceChannel = interaction.member.voice.channel;
          if (!voiceChannel) {
            await interaction.reply({ content: 'You need to be in a voice channel to use this command.', ephemeral: true });
            return;
          }
      
          const user = interaction.options.getUser('user');
          const member = await interaction.guild.members.fetch(user.id);
          
          if (member.voice.channel !== voiceChannel) {
            await interaction.reply({ content: 'The specified user is not in your voice channel.', ephemeral: true });
            return;
          }
      
          try {
            await member.voice.disconnect();
            await interaction.reply({ content: `${user.tag} has been kicked from the voice channel.`, ephemeral: true });
          } catch (error) {
            console.error('Error kicking user from voice channel:', error);
            await interaction.reply({ content: 'An error occurred while kicking the user.', ephemeral: true });
          }
        } else if (commandName === 'voice-ban') {
          const voiceChannel = interaction.member.voice.channel;
          if (!voiceChannel) {
            await interaction.reply({ content: 'You need to be in a voice channel to use this command.', ephemeral: true });
            return;
          }
      
          const user = interaction.options.getUser('user');
          try {
            await voiceChannel.permissionOverwrites.edit(user, { Connect: false });
            await interaction.reply({ content: `${user.tag} has been banned from the voice channel.`, ephemeral: true });
          } catch (error) {
            console.error('Error banning user from voice channel:', error);
            await interaction.reply({ content: 'An error occurred while banning the user.', ephemeral: true });
          }
        } else if (commandName === 'voice-unban') {
          const voiceChannel = interaction.member.voice.channel;
          if (!voiceChannel) {
            await interaction.reply({ content: 'You need to be in a voice channel to use this command.', ephemeral: true });
            return;
          }
      
          const user = interaction.options.getUser('user');
          try {
            await voiceChannel.permissionOverwrites.delete(user);
            await interaction.reply({ content: `${user.tag} has been unbanned from the voice channel.`, ephemeral: true });
          } catch (error) {
            console.error('Error unbanning user from voice channel:', error);
            await interaction.reply({ content: 'An error occurred while unbanning the user.', ephemeral: true });
          }
        } else if (commandName === 'voice-rename') {
          const voiceChannel = interaction.member.voice.channel;
          if (!voiceChannel) {
            await interaction.reply({ content: 'You need to be in a voice channel to use this command.', ephemeral: true });
            return;
          }
      
          const newName = interaction.options.getString('name');
          try {
            await voiceChannel.setName(newName);
            await interaction.reply({ content: `Voice channel renamed to "${newName}".`, ephemeral: true });
          } catch (error) {
            console.error('Error renaming voice channel:', error);
            await interaction.reply({ content: 'An error occurred while renaming the voice channel.', ephemeral: true });
          }
        } else if (commandName === 'voice-add') {
          const voiceChannel = interaction.member.voice.channel;
          if (!voiceChannel) {
            await interaction.reply({ content: 'You need to be in a voice channel to use this command.', ephemeral: true });
            return;
          }
      
          const user = interaction.options.getUser('user');
          try {
            await voiceChannel.permissionOverwrites.edit(user, { Connect: false });
            await interaction.reply({ content: `${user.tag} has been added to the voice channel.`, ephemeral: true });
          } catch (error) {
            console.error('Error inviting user into voice channel:', error);
            await interaction.reply({ content: 'An error occurred while adding the user.', ephemeral: true });
          }
        }
    },
};