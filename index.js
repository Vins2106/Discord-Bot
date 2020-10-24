/*
 SIMPLE DISCORD BOT WITH COMMANDS HANDLER AND COMMANDS COOLDOWNS
 Maker: Vins Developer
 Discord: Vins#2106
*/
const Discord = require("discord.js");
const Client = require("discord.js");
const client = new Discord.Client({disableMentions: "all"}); //disable mention @everyone & @here 

const okaneClient = require("./src/config.json");
let config = okaneClient;

client.prefix = config.prefix; //prefix
const token = okaneClient.token; //token
client.invite = config.invite; //invite link
const fs = require("fs"); 
client.commands = new Discord.Collection(); //commands
client.aliases = new Discord.Collection(); //commands aliases
client.helps = new Discord.Collection(); //helps
const { Collection } = require("discord.js");
const cooldowns = new Collection;

client.login(token); //Make bot online

client.on("ready", () => {
  console.log("Ready!"); //if bot online, Ready! text can spawn on console
});

//command handler
    fs.readdir('./src/commands/', (err, categories) => {
        if (err) console.log(err);
        categories.forEach(category => {
            let moduleConf = require(`./src/commands/${category}/module.json`);
            moduleConf.path = `./src/commands/${category}`;
            moduleConf.cmds = [];
            moduleConf.usage = [];
            moduleConf.names = [];
            client.helps.set(category, moduleConf);
            if (!moduleConf) return;
            fs.readdir(`./src/commands/${category}`, (err, files) => {
                if (err) console.log(err);
                let commands = new Array();
                files.forEach(file => {
                    if (!file.endsWith('.js')) return;
                    let prop = require(`./src/commands/${category}/${file}`);
                    let cmdName = file.split('.')[0];
                    client.commands.set(prop.help.name, prop);
                    prop.conf.aliases.forEach(alias => {
                        client.aliases.set(alias, prop.help.name);
                    });
                    client.helps.get(category).cmds.push(prop.help)
                    client.helps.get(category).usage.push(prop.help.how)
                  client.helps.get(category).names.push(prop.help.another)
                });
            });
        });
    });


client.on('message', async message => {
    const prefix = client.prefix;

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
  
  const color = "BLUE"
  
      let commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (!commandFile) return;
    if (!cooldowns.has(commandFile.help.name)) {
        cooldowns.set(commandFile.help.name, new Collection());
    }
    const member = message.member;
    const now = Date.now();
    const timestamps = cooldowns.get(commandFile.help.name);
    const cooldownAmount = (commandFile.conf.cooldown || 5) * 1000;

    if (!timestamps.has(member.id)) {
        timestamps.set(member.id, now);
    } else {
        const expirationTime = timestamps.get(member.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send({
              embed: {
                color: color,
                description: `Error: (Ratelimit) <@${message.author.id}>, please wait \`${timeLeft.toFixed(1)}s\``
              }
            })
        }

        timestamps.set(member.id, now);
        setTimeout(() => timestamps.delete(member.id), cooldownAmount);
    }
  
    try {
  let commands = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  commands.run(client, message, args, color, prefix);
  if (!commands) return;
  } catch (e) {
  } finally {
  } 
});