const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
  ],
});

// Collection for slash commands
client.commands = new Collection();

// Load events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
    console.log(`register event: ${event.name}`)
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
    console.log(`register event: ${event.name}`)
  }
}

// Load slash commands
// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// for (const file of commandFiles) {
//   const command = require(`./commands/${file}`);
//   client.commands.set(command.name, command);
//   console.log(`registering commands: ${command.name}`)
// }

client.login(process.env.TOKEN)