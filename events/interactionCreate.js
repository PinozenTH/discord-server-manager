const { joinVoiceChannel, createAudioResource, AudioPlayer } = require('@discordjs/voice');
const { VoiceChannel } = require('discord.js');
const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;
        const player = new AudioPlayer();

        player.on('error', (error) => {
            console.error('Audio Player Error:', error);
            // Notify users about the error
            // You can also implement retry logic or fallback options here
        });

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
        } else if (commandName == 'guests') {
          const guild = interaction.guild;
          const memberCount = guild.members.cache.filter(member => !member.user.bot).size;
          await interaction.reply({ content: `There are ${memberCount} Guests here.`, ephemeral: true });
        }
        // else if (commandName === 'join') {
        //     const voiceChannel = interaction.member.voice.channel;
        //     if (!voiceChannel) {
        //         await interaction.reply({ content: 'You need to be in a voice channel to use this command.', ephemeral: true });
        //         return;
        //     }
        //     joinVoiceChannel({
        //         channelId: voiceChannel.id,
        //         guildId: voiceChannel.guild.id,
        //         adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        //     });
        //     await interaction.reply({ content: 'Joined your voice channel.', ephemeral: true });
        // } else if (commandName === 'play') {
        //     const url = interaction.options.getString('url');
        //     if (!url) {
        //         await interaction.reply({ content: 'Please provide a valid YouTube URL.', ephemeral: true });
        //         return;
        //     }
        //     const voiceChannel = interaction.member.voice.channel;
        //     if (!voiceChannel) {
        //         await interaction.reply({ content: 'You need to be in a voice channel to use this command.', ephemeral: true });
        //         return;
        //     }
        //     const connection = joinVoiceChannel({
        //         channelId: voiceChannel.id,
        //         guildId: voiceChannel.guild.id,
        //         adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        //     });
        //     const stream = ytdl(url, { filter: 'audioonly' });
        //     const resource = createAudioResource(stream);
        //     player.play(resource);
        //     await interaction.reply({ content: 'Playing your music.', ephemeral: true });
        // } else if (commandName === 'current-play') {
        //     const currentSong = player.state.resource?.metadata?.title;
        //     if (!currentSong) {
        //         await interaction.reply({ content: 'No music is currently playing.', ephemeral: true });
        //         return;
        //     }
        //     const embed = new MessageEmbed()
        //         .setTitle('Current Music')
        //         .setDescription(`Playing: **${currentSong}**`)
        //         .setColor('#0099ff');
        //     await interaction.reply({ embeds: [embed], ephemoral: true });
        // } else if (commandName === 'leave') {
        //     player.clearQueue();
        //     await player.stop();
        //     await interaction.reply({ content: 'Music stopped and bot left the voice channel.', ephemeral: true });
        // } else if (commandName === 'pause') {
        //     if (player.state.status === 'playing') {
        //         await player.pause();
        //         await interaction.reply({ content: 'Music paused.', ephemeral: true });
        //     } else {
        //         await interaction.reply({ content: 'Music is not playing.', ephemeral: true });
        //     }
        // } else if (commandName === 'queue') {
        //     const url = interaction.options.getString('url');
        //     if (!url) {
        //         await interaction.reply({ content: 'Please provide a valid YouTube URL.', ephemeral: true });
        //         return;
        //     }
        //     const stream = ytdl(url, { filter: 'audioonly' });
        //     const resource = createAudioResource(stream);
        //     player.queue.add(resource);
        //     await interaction.reply({ content: 'Song added to the queue.', ephemeral: true });
        // } else if (commandName === 'search') {
        //     const searchQuery = interaction.options.getString('query');
        //     if (!searchQuery) {
        //         await interaction.reply({ content: 'Please provide a search query.', ephemeral: true });
        //         return;
        //     }
        //     const searchResults = await ytdl.getInfo(searchQuery);
        //     if (!searchResults || searchResults.length === 0) {
        //         await interaction.reply({ content: 'No results found for your search query.', ephemeral: true });
        //         return;
        //     }
        //     const resultsEmbed = new MessageEmbed()
        //         .setTitle('Search Results')
        //         .setDescription(searchResults.slice(0, 10).map((result, index) => `**${index + 1}.** ${result.title}`).join('\n'))
        //         .setColor('#0099ff');
        //     await interaction.reply({ embeds: [resultsEmbed], ephemeral: true });
        //     const filter = (msg) => msg.author.id === interaction.user.id && !isNaN(msg.content) && msg.content >= 1 && msg.content <= 10;
        //     const response = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000 });
        //     if (!response.size) {
        //         await interaction.reply({ content: 'No response received. Please try again.', ephemeral: true });
        //         return;
        //     }
        //     const selectedIndex = parseInt(response.first().content) - 1;
        //     const selectedSong = searchResults[selectedIndex];
        //     const stream = ytdl(selectedSong.url, { filter: 'audioonly' });
        //     const resource = createAudioResource(stream);
        //     player.play(resource);
        //     await interaction.reply({ content: `Playing: **${selectedSong.title}**`, ephemeral: true });
        // }

    },
};