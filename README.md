# R2-D2

R2-D2 is a simple bot that's made for Star Wars themed servers.
It has two main functions:
* First, there is a 1/50 chance of the bot randomly sending a message. Currently that includes "Beep boop" and a few R2-D2 gifs.
  - You can customize which channels R2-D2 will send messages in, utilizing either a blacklist or a whitelist
  - Members of the server can use the `disable` command to disable R2-D2 from speaking in that channel for one hour
* Second, there is a command you can use that allows staff members or those with a specific role to speak as if they were the bot (even including the new reply feature on Discord!)

<hr>

This bot is not made to be public for any server, but is instead made for you to host yourself, using the sample `config.js` file. 
When you do so, you will need to do the following steps:
1. Make sure that you have node.js and npm installed, with a minimum of v12 and v6 respectively
2. Download the files for the bot into a folder.
3. Run the command `npm install` in a terminal to install the libraries for the bot
4. Rename the `.env.example` file to `.env` and replace `lalatokenhere` with the token for your bot
5. Run the command `npm start` to start the bot