const { ChannelType } = require('discord.js');

module.exports = {
  name: 'voiceStateUpdate',
  execute: async function(oldState, newState) {
    let partyChannelId = '1276581461964619881';
    let workingChannelId = '1277179177526890529';
    let partyCategoryId = '1276554466849591327';
    let workingCategoryId = '1277179398893736016';

    // Check if the user joined the specific voice channel
    if (oldState.channelId !== newState.channelId) {
      if (newState.channelId === partyChannelId) {
        createVoiceChannel(partyCategoryId, newState, '🎉', 'Party');
      } else if (newState.channelId === workingChannelId) {
        createVoiceChannel(workingCategoryId, newState, '💪', 'Working Room');
      }
    }
    if (oldState.channel) {
      if (oldState.channel.members.size === 0) {
        removeVoiceChannel(partyCategoryId, oldState);
        removeVoiceChannel(workingCategoryId, oldState);
      }
    }
  },
};

async function createVoiceChannel(categoryId, newState, channelEmoji, channelType) {
  const guild = newState.guild;
  const originalChannel = newState.channel;
  if (!originalChannel) return;
  let newChannelName = originalChannel.name;
  let suffix = 1;

  // Check for existing channels with similar names
  while (guild.channels.cache.some(channel => channel.name === newChannelName)) {
    let str = ` ${suffix}`;
    newChannelName = `${channelEmoji}${newState.member.nickname || newState.member.user.globalName || newState.member.user.username}'s ${channelType} ${str.replace(" 1", "")}`;
    suffix += 1;
  }

  try {
    // Create a new voice channel
    const newChannel = await guild.channels.create({
      name: newChannelName,
      type: ChannelType.GuildVoice,
      parent: categoryId, // Set the parent to the specific category ID
      bitrate: originalChannel.bitrate,
      userLimit: originalChannel.userLimit,
      permissionOverwrites: originalChannel.permissionOverwrites.cache.values()
    });
    // Move the user to the newly created channel
    await newState.setChannel(newChannel);
    console.log(`Moved ${newState.member.user.username} to ${newChannelName}`);

    console.log(`Created new voice channel: ${newChannelName}`);
  } catch (error) {
    console.error('Error creating new voice channel:', error);
  }
}

async function removeVoiceChannel(categoryId, oldState) {
  const channel = oldState.channel;
  // Check if the channel is empty and in the specific category
  if (channel.parentId === categoryId) {
    try {
      // Log the channel ID before deletion
      console.log(`Attempting to delete channel with ID: ${channel.id}`);
      const fetchedChannel = await channel.guild.channels.fetch(channel.id).catch(() => null);
      if (fetchedChannel) {
        await fetchedChannel.delete(); // Delete the channel if it's not the specific one
        console.log(`Deleted empty voice channel: ${fetchedChannel.name}`); // Log the deletion
      } else {
        console.log(`Channel with ID ${channel.id} no longer exists.`);
      }
    } catch (error) {
      console.error('Error deleting empty voice channel:', error);
    } 
  }  
}