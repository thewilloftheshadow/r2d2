require("dotenv").config(); //token and other values from .env
const Discord = require("discord.js"); //require the discord.js library
const client = new Discord.Client(); //create a new client from discord.js
const config = require("./config.js"); // require the config.js file for variables
const db = require("quick.db"); // require the database using the quick.db library

// Runs when the client successfully logs in
client.once("ready", async () => {
  //Log intro message
  console.log(
    `${client.user.username} is online in ${client.guilds.cache.size} guilds`
  );

  // set bot's status to idle
  client.user.setPresence({
    activity: {type: "LISTENING", name: "to 3PO 🙄"},
    status: "idle",
  });

  //log data about each guild the bot is in
  client.guilds.cache.forEach(async (x) => {
    console.log(`  -${x.name} - ${x.id} (${x.members.cache.size} members)`);
  });
});

client.on("message", async (message) => {
  if (message.author.bot) return; // ignore messages from bots
  let args = message.content.slice(config.prefix.length).trim().split(/ /g); //create an array with the arguments of the command
  let command = args.shift().toLowerCase(); // set the first argument (the command itself) to the command variable and remove it from the args array

  //disable responses for one hour
  if (command == "disable") {
    db.set(`${message.channel.id}disable`, Date.now() + 3600000); // one hour from now
    message.channel.send(
      "I won't talk anymore in this channel for the next hour!"
    );
  }

  if (command == "enable" && message.author.id == config.ownerID) {
    db.set("disable", Date.now()); // one hour from now
    message.channel.send("Messages have been reenabled");
  }

  //command to run code from Discord (accessible only to the user with the same ID as ownerID in the config.js)
  if (command == "eval" && message.author.id == config.ownerID) {
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      if (!message.content.endsWith("1+1;"))
        message.channel.send(evaled, { code: "xl", split: " " });
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
    }
  }

  if (config.whitelist.includes(message.channel.id)) {
    console.log("----------------\nNew message: " + message.id);
    let disable = db.get(`${message.channel.id}disable`); // check if messages are disabled
    if (!disable) disable = 0;

    console.log(
      `  - Disabled: ${
        disable > Date.now() ? `Yes, until ${disable}` : "No"
      }\n  - Current time: ${Date.now()}`
    );
    if (disable > Date.now()) return console.log("Canceled - Disabled");
    
      // Random number to see if a message will appear
      let num = getRandom(0, 50);
      console.log(`  - Random number: ${num}, Target: 13`);
      if (num == 13)
        message.channel.send(
          config.messages[getRandom(0, config.messages.length - 1)]
        );
      // ^ this will send a random message from the messages array in config.js if the random number is 69
    
  }
});

// function to get a random number
const getRandom = (min, max) => {
  max = max + 1; //max is non inclusive in this function, so this adds one to include the passed max
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

//function to pause for a certain amount of time
const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

//Login to Discord
client.login(process.env.TOKEN);
