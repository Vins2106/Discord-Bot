const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, color) => {
  
  const m = await message.channel.send("**Please Wait...**")
  
  setTimeout(function() {
    message.channel.send(`**:ping_pong: Pong! __${client.ws.ping}__ms**`).then(() => {m.delete()})
  }, 3000);
}

exports.conf = {
    aliases: ['pong', 'botping'],
    cooldown: "5"
}

exports.help = {
    name: 'ping',
    description: 'Get bot ping',
    usage: 'ping'
}