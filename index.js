require("dotenv").config() //token and other values from .env
const Discord = require("discord.js") //require the discord.js library
const client = new Discord.Client({disableMentions: "all"}) //create a new client from discord.js
const config = require("./config.js") // require the config.js file for variables
const db = require("quick.db") // require the database using the quick.db library

// see if we're using a whitelist or a blacklist
const listtype = config.whitelist.length > 0 ? "white" : "black"

// Runs when the client successfully logs in
client.once("ready", async () => {
  //Log intro message
  console.log(
    `${client.user.username} is online in ${client.guilds.cache.size} guilds`
  )

  // set bot's status to idle
  client.user.setPresence({
    activity: { type: "LISTENING", name: "3PO 🙄" },
    status: "idle",
  })

  //log data about each guild the bot is in
  client.guilds.cache.forEach(async (x) => {
    console.log(`  -${x.name} - ${x.id} (${x.members.cache.size} members)`)
    x.members.fetch()
  })
})

client.on("message", async (message) => {
  if (message.author.bot) return // ignore messages from bots
  if(!message.content.startsWith(config.prefix)) return // ignore non-commands
  if(config.ows.includes(message.channel.id)) return // ignore ows channels
  let args = message.content.slice(config.prefix.length).trim().split(/ /g) //create an array with the arguments of the command
  let command = args.shift().toLowerCase() // set the first argument (the command itself) to the command variable and remove it from the args array


  //disable responses for one hour
  if (command == "disable") {
    db.set(`${message.channel.id}disable`, Date.now() + 3600000) // one hour from now
    message.channel.send(
      "I won't talk anymore in this channel for the next hour!"
    )
  }

  //reenable messages (owner only)
  if (command == "enable" && message.author.id == config.ownerID) {
    db.set("disable", Date.now())
    message.channel.send("Messages have been reenabled")
  }

  /*mod only command to speak as the bot 
  Two ways to use:
  ^copy message <- will say "message" as the bot
  ^copy 19736947697679 message <- will reply to the message with the ID of 19736947697679 with "message"
  */
  if (command == "copy") {
    if(message.member.roles.cache.has(config.modrole) || (message.guild.id == "791037986984820776" && message.member.roles.cache.has("799659106226929714"))) return
    // ^ if member is a mod or (in RWL and has sage role)
    message.delete().catch(()=>{}) // delete the command
    let m = await message.channel.messages.fetch(args[0]).catch(()=>{}) // see if there is a message with the ID of the first argument of the command
    if (m) { // if there is a message
      args.shift() // remove the ID from the arguments
      m.reply(args.join(" ")) // send the arguments joined with a space
    } else { // if there isn't a message
      message.channel.send(args.join(" ")) // send the arguments joined with a space
    }
  }

  //command to run code from Discord (accessible only to the user with the same ID as ownerID in the config.js)
  if (command == "eval" && message.author.id == config.ownerID) {
    try {
      const code = args.join(" ")
      let evaled = eval(code)
      if (typeof evaled !== "string") evaled = require("util").inspect(evaled)
      if (message.content.endsWith("1+1;")) {
        message.delete()
      } else {
        message.channel.send(evaled, { code: "xl", split: " " })
      }
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``)
    }
  }
})

client.on("message", (message) => {
  /*
    This entire chunk below is where the random messages are triggered 
    and where the checks for disabling channels for an hour are
  */
 if (
  (listtype == "white" && config.whitelist.includes(message.channel.id)) || // channel is whitelist and using whitelist
  (listtype == "black" && !config.blacklist.includes(message.channel.id)) //channel is blacklisted and using blacklist
) {
  console.log("----------------\nRandom message generator: " + message.id) //Start log block
  let disable = db.get(`${message.channel.id}disable`) // check if messages are disabled
  if (!disable) disable = 0 // if channel has never been disabled, set time to 0

  /*
    This next log looks like this:
      - Disabled: Yes, until 1610922749805 <- time when the bot is undisabled
      - Current time: 1610919569905 <- this will be the current date
  */
  console.log(
    `  - Disabled: ${
      disable > Date.now() ? `Yes, until ${disable}` : "No"
    }\n  - Current time: ${Date.now()}`
  )
  if (disable > Date.now()) return console.log("Canceled - Disabled")

  // Random number to see if a message will appear
  let num = getRandom(0, 50)
  console.log(`  - Random number: ${num}, Target: 13`)
  if (num == 13)
    message.channel.send(
      config.messages[getRandom(0, config.messages.length - 1)]
    )
  // ^ this will send a random message from the messages array in config.js if the random number is 13
}
})

// function to get a random number
const getRandom = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

//Login to Discord
client.login(process.env.TOKEN)
