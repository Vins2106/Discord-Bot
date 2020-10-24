const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, color) => {
  if (!args[0]) {
    let module = client.helps.array();
    const embed = new MessageEmbed()
    .setAuthor(client.user.username + ' Category', client.user.displayAvatarURL())
    .setColor(color)
    .setThumbnail(client.user.displayAvatarURL())
    for (const mod of module) {
      embed.addField(`**${mod.name}**`, `\`${mod.how}\``, true)
    }
    return message.channel.send(embed);
  } else {
    let cmd = args[0]
    if (client.helps.get(cmd).names) {
      const embed = new MessageEmbed()
      .setAuthor(`${client.helps.get(cmd).name} Category`, client.user.displayAvatarURL())
      .setColor(color)
      for (const x of client.helps.array(cmd)) {
        embed.setDescription(x.cmds.map(a => `\`${client.prefix}${a.name}\`\n${a.description}`).join("\n\n"))
      }
      return message.channel.send(embed)
    }
  }
}

exports.conf = {
    aliases: ['h', 'cmds', 'cmdlist'],
    cooldown: "5"
}

exports.help = {
    name: 'help',
    description: 'Show all command list',
    usage: 'help [command]'
}