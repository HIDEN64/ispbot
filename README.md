# ispbot

This bot helps conrol the ISP from Discord.

**NOTE**: You will need to put your Discord token in the `.env` file for this to work.

## Dependencies

This runs on Debian Linux. It likely works fine on other Linuxes and maybe MacOS but probably not Windows.

Install `node`:

```
# curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs
```

Install node packages:

```
$ npm install discord.js axios shelljs
```

## Execution

Set to automatically run at startup:

```
$ npm install -g pm2
$ pm2 start /path/to/ispbot/index.js && pm2 save && pm2 startup
```

Or run manually:

```
$ node /path/to/ispbot/index.js
```

## Usage

Check out `!help`:

```
ISPBot brought to you by Famicoman
Controls for http://dialup.world/
Available at 1-800-613-8199

Commands:
!status             - Prints modem status
!uptime             - Prints system uptime
!creds              - Prints sip credentials
!reboot             - Reboots the server
!reboot-ata         - Reboots the ATA
!turnon-ata         - Turns ATA on
!turnoff-ata        - Turns ATA off
!status-ata         - Reports if ATA is on or off
!restart-modem0     - Restarts modem0 mgetty service
!restart-modem1     - Restarts modem1 mgetty service
!restart-modem2     - Restarts modem2 mgetty service
!restart-modem3     - Restarts modem3 mgetty service
!log        - Shows IPs visited
```
