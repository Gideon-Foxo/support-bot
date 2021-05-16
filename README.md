<h1 align="center">Discord Support Bot</h1>

The Discord Support bot is a bot designed to be simple, lightweight and easy to use to help automate basic and frequently asked questions for support.

<h1 align="center">Demo!</h1>

Here is a gif of a very simple setup using 4 questions and a support responses.

![Its a gif!](https://cdn.discordapp.com/attachments/713861338673184858/843359915376771122/t6C5hIac5D.gif)

You can set as many questions as you desire and staff can be assigned either with a permission (default is  ban members) or by setting a staff role.

<h1 align="center">Commands</h1>

All commands start with a prefix and by default the prefix is set to s!. This can be changed in the settings.js file.

**s!ping**
> Pong! Shows you have fast I am responding.

**s!help** 
> Pretty much just links to this repo which is where you can find the instructions.

**s!support @User/ID**
> This command either adds or removes the support role from the provided user. This command can only be run by staff.

<h1 align="center">Installation</h1>

1. Install [node](https://nodejs.org/en/) v14 or higher.

2. [Download the latest release of this project](https://github.com/Gideon-foxo/support-bot/releases)

3. CD over to this project on your system and run `npm i`.

4. Input all of your settings into [settings.js](https://github.com/Gideon-foxo/support-bot/blob/main/src/config/settings.js) (src -> config -> settings.js)

5. CD over to the src folder and run `node index.js` to lunch the bot. It is highly recommended you use a program such as [pm2](https://www.npmjs.com/package/pm2) to run this app.


<h1 align="center">Contact/Support/Feedback</h1>

If you need support or would like to add feedback please either [join Gideon's server](https://discord.gg/QW6ab2NAj7) or [create a new issue](https://github.com/Gideon-foxo/support-bot/issues).
