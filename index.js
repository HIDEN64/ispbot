// ispbot
// Install dependencies: 
// npm install discord.js axios shelljs
// npm install -g pm2
// pm2 start /root/discord-bot/index.js && pm2 save && pm2 startup

require("dotenv").config();
const { exec } = require("child_process");
const { Client, GatewayIntentBits } = require("discord.js");
var shell = require("shelljs");
const client = new Client({
        intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
         ]});
let time = null
let timeoutMins = 1;

//Listen to the event that signals the bot is ready to start working
client.on("ready", () => {
	console.log(`logged in as ${client.user.tag}`);
	time = Number(Date.now()) + (timeoutMins * 60 *1000);
});

//Listen to new messages on the server
client.on("messageCreate", (message) => {
	if (message?.member?.roles?.cache?.some(r => r.name === "Server Owner")
	|| message?.member?.roles?.cache?.some(r => r.name === "Admin")
	|| message?.member?.roles?.cache?.some(r => r.name === "Contributor")
	|| message?.member?.roles?.cache?.some(r => r.name === "Server Testers")
	|| message?.member?.roles?.cache?.some(r => r.name === "Redialed Dial-Up Operators")
	) {
		if(message?.content === "!reboot --force"){
			console.log("sending reboot...");
                        message.reply("Reboot request acknowledged, please try dialing again in ~30 seconds.");
                        shell.exec("sleep 5", {async: false});
			restartServer();
		}else if(message?.content === "!reboot"){
			console.log("passed role and command check");
			if(time != null && Number(Date.now()) >= time) {
				if((getStatus().split("waiting").length - 1) < 4){
					message.reply("It looks like someone may be dialed in right now, are you sure? Retry with **!reboot --force**");
					message.reply(getStatus());
				}else{
					console.log("sending reboot...");
					message.reply("Reboot request acknowledged, please try dialing again in ~30 seconds.");
					shell.exec("sleep 5", {async: false});
					restartServer();
				}
	  			//exec("sleep 5 && reboot now", (error, stdout, stderr) => {
          			//  if (error) {
          			//    console.log(`error: ${error.message}`);
          			//    message.reply(`Error: ${error.message}`);
          			//    return;
          			//  }
          			//  if (stderr) {
          			//    console.log(`stderr: ${stderr}`);
          			//    message.reply(`Error: ${stderr}`);
          			//    return;
          			//  }
          			//  console.log(`stdout: ${stdout}`);
          			//});
			}else {
				console.log("failed time check");
				message.reply("Request is too recent, please wait");
			}
		} else if (message?.content === "!help"){
			let msg = "ISPBot brought to you by Famicoman\n";
			msg += "Controls for *http:\/\/dialup.world*\n";
			msg += "Available at *1-800-613-8199*\n\n";
			msg += "Commands:\n";
			msg += "**!status**             - Prints modem status\n";
			msg += "**!uptime**             - Prints system uptime\n";
			msg += "**!creds**              - Prints sip credentials\n";
			msg += "**!reboot**             - Reboots the server\n";
			msg += "**!reboot-ata**         - Reboots the ATA\n";
			msg += "**!turnon-ata**         - Turns ATA on\n";
			msg += "**!turnoff-ata**        - Turns ATA off\n";
                        msg += "**!status-ata**         - Reports if ATA is on or off\n";
			msg += "**!restart-modem0**     - Restarts modem0 mgetty service\n";
			msg += "**!restart-modem1**     - Restarts modem1 mgetty service\n";
			msg += "**!restart-modem2**     - Restarts modem2 mgetty service\n";
			msg += "**!restart-modem3**     - Restarts modem3 mgetty service\n";
			msg += "**!log**		- Shows IPs visited\n";

			message.reply(msg);
		} else if (message?.content === "!creds"){
                        let msg = "Connect to the ISP using your SIP device!\n";
                        msg += "**Server:**  sip.webtv.zone\n";
                        msg += "**Port:**    16555\n";
			msg += "**User:**    redialed\n";
                        msg += "**Secret:**   redialed2\n";
                        msg += "**Codec:**    ulaw\n\n";
                        msg += "Remember to disable any echo cancellation and set jitter as low as possible!";

                        message.reply(msg);
		} else if (message?.content === "!uptime"){
                        let msg = shell.exec("uptime", {async: false}).stdout;

			message.reply(msg);
		} else if (message?.content === "!status"){
			let msg = getStatus();

			message.reply(msg);
		} else if (message?.content === "!log"){
			let msg = shell.exec("grep 'netfilter' /var/log/syslog | tail -5", {async: false}).stdout;
			message.reply(msg=='' ? 'No log found' : msg);
		} else if (message?.content === "!reboot-ata"){
			let msg = shell.exec("curl -is -X POST http://10.0.0.10/switch/kauf_plug/turn_off  | grep 'HTTP'", {async: false}).stdout;
			msg += shell.exec("curl -is -X POST http://10.0.0.10/switch/kauf_plug/turn_on  | grep 'HTTP'", {async: false}).stdout;
			if((msg.split("OK").length - 1) == 2){
				msg += "ATA reboot successful, please wait ~90 seconds before dialing in again";
			} else {
				msg += "Something went wrong, check current state with **!status-ata**";
			}
			message.reply(msg);
		} else if (message?.content === "!turnon-ata"){
                        let msg = shell.exec("curl -is -X POST http://10.0.0.10/switch/kauf_plug/turn_on  | grep 'HTTP'", {async: false}).stdout;
			if((msg.split("OK").length - 1) == 1){
                                msg += "ATA turn-on successful, please wait ~90 seconds before dialing in again";
                        } else {
                                msg += "Something went wrong, check current state with **!status-ata**";
                        }
                        message.reply(msg);
                } else if (message?.content === "!turnoff-ata"){
                        let msg = shell.exec("curl -is -X POST http://10.0.0.10/switch/kauf_plug/turn_off  | grep 'HTTP'", {async: false}).stdout;
                        if((msg.split("OK").length - 1) == 1){
                                msg += "ATA turn-off successful.";
                        } else {
                                msg += "Something went wrong, check current state with **!status-ata**";
                        }
                        message.reply(msg);
                } else if (message?.content === "!status-ata"){
                        let msg = shell.exec("curl http://10.0.0.10/switch/kauf_plug", {async: false}).stdout;

                        message.reply(msg);
                } else if (message?.content === "!restart-modem0"){
			let msg = shell.exec("systemctl restart mgetty@ttyUSB0", {async: false}).stdout;
			msg += shell.exec("systemctl -a | grep mgetty@ttyUSB0 | tr -s ' '", {async: false}).stdout;

                        message.reply(msg);
		} else if (message?.content === "!restart-modem1"){
                        let msg = shell.exec("systemctl restart mgetty@ttyUSB1", {async: false}).stdout;
                        msg += shell.exec("systemctl -a | grep mgetty@ttyUSB1 | tr -s ' '", {async: false}).stdout;

                        message.reply(msg);
                } else if (message?.content === "!restart-modem2"){
                        let msg = shell.exec("systemctl restart mgetty@ttyUSB2", {async: false}).stdout;
                        msg += shell.exec("systemctl -a | grep mgetty@ttyUSB2 | tr -s ' '", {async: false}).stdout;

                        message.reply(msg);
                } else if (message?.content === "!restart-modem3"){
                        let msg = shell.exec("systemctl restart mgetty@ttyUSB3", {async: false}).stdout;
                        msg += shell.exec("systemctl -a | grep mgetty@ttyUSB3 | tr -s ' '", {async: false}).stdout;

                        message.reply(msg);
                }
	}
});

function getStatus(){
	let msg = "";
	msg += "modem0: ";
	msg += shell.exec("tail -n 1 /var/log/mgetty/mg_ttyUSB0.log", {async: false}).stdout;
	msg += "\n";
	msg += "modem1: ";
	msg += shell.exec("tail -n 1 /var/log/mgetty/mg_ttyUSB1.log", {async: false}).stdout;
	msg += "\n";
	msg += "modem2: ";
	msg += shell.exec("tail -n 1 /var/log/mgetty/mg_ttyUSB2.log", {async: false}).stdout;
	msg += "\n";
	msg += "modem3: ";
	msg += shell.exec("tail -n 1 /var/log/mgetty/mg_ttyUSB3.log", {async: false}).stdout;
	msg += "\n";

	return msg;
}

function restartServer(){
	 shell.exec("reboot now", {async: false});
}

//Login to the server using bot token
client.login(process.env.TOKEN);
