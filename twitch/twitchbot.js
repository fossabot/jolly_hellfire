//dependencies laden
const $ = require('jquery');
const tmi = require("tmi.js");
const fs = require('fs')
const fetch = require("node-fetch");
const twitch = require('twitch-api-v5');
const jsome = require('jsome');
const piTemp = require("pi-temperature");
const log = require('noogger');
const stringify = require('json-stable-stringify');
const appRootPath = require('app-root-path');
const appRoot = appRootPath + "/jolly_hellfire/twitch";


// Init Log
var logParams = {
	consoleOutput : true,
	consoleOutputLevel:'DEBUG',    
	dateTimeFormat: "DD-MM-YYYY HH:mm:ss",
	fileNameDateFormat: "YYYY-MM-DD",
	fileNamePrefix:"consolelog-",
	outputPath: appRoot + "/logs/"
}; 
log.init(logParams);

log.alert("STARTING SCRIPT");

// API-Keys einlesen
var contents = fs.readFileSync(appRoot + "/hidden/secure.json");
var secureJSON = JSON.parse(contents);

// Twitch Channel joinen
// Bot User
var twitch_options_bot = {
	options: {
		debug: true
	},
	connection: {
		cluster: "aws",
		reconnect: true
	},
	identity: {
		username: "senpaimod_van_boven",
		password: (secureJSON.twitch)
	},
	channels: ["areukittenmerightmeow", "domaster_"]
};
var client = new tmi.client(twitch_options_bot);
client.connect()
.then(function(address, port) {
	console.log("tmi conneted: " + address + ":" + port);
	log.debug("tmi conneted: " + address + ":" + port);
})
.catch(function(err) {
	console.log("err: tsi cannot connect");
	log.error(err);
});
// Lurk User	
var twitch_options_lurker = {
	options: {
		debug: true
	},
	connection: {
		cluster: "aws",
		reconnect: true
	},
	identity: {
		username: "jeldan_van_boven",
		password: (secureJSON.twitch2)
	},
	channels: ["areukittenmerightmeow", "kitti_mind", "jeldan_van_boven", "babyrobbenklopfer", "stefananf", "domaster_"]
};
var lurker = new tmi.client(twitch_options_lurker);
lurker.connect()
.then(function(address, port) {
	console.log("tsi conneted: " + address + ":" + port);
})
.catch(function(err) {
	console.log("err: tsi cannot connect");
	log.error(err);
});

// Counter initialisieren
var counterBool = true;
var cd = 1000;
if (!fs.existsSync(appRoot + "/hidden/counter.xxx")) {
	createNewCountfile()
}

// Chat-Befehle
client.on('chat', function(channel, user, message, self) {

	// Jewlia
	if (channel === "#areukittenmerightmeow") {
		var c_name = "areukittenmerightmeow";
		var time = new Date();
		time = time.toLocaleString();
		log.info(user["username"] + "|" + message);
		switch (message) {
			case "!commands":
			client.say(c_name, "@" + user["username"] + " ! + nummer, snapchat, twitter, eugen, song, nudes, dansgame, clips, elo, realelo, merch, discord, wp, boosted, spacebar, konzentrieren, oversleep, cookorn");
			break;
			case "!sr-help":
			client.say(c_name, "@" + user["username"] + " only mod: !sr- + sextape, besoffen, saufen, hartz4, julia, chameleon, ganzganzbillig");
			break;
			case "!clips":
			client.say(c_name, "@" + user["username"] + " Die alten Clips sind zu finden unter: http://best-clips.free-legal-girls.com");
			break;
			case "!goa":
			client.say(c_name, "@" + user["username"] + " Was ist Goa? http://goa.free-legal-girls.com");
			break;
			case "!superhiddenrealnacktbilder":
			if (user["username"] == "areukittenmerightmeow" || user["username"] == "jeldan_van_boven" || user["username"] == "senpaimod_van_boven") client.say(c_name, "https://bit.ly/2hsNa0b");
			break;
			case "!realelo":
			realElo(c_name, user["username"]);
			break;
			case "!discord":
			client.say(c_name, "@" + user["username"] + " Discord: http://livechat.free-legal-girls.com/");
			break;
			case "!twitter":
			client.say(c_name, "@" + user["username"] + " Twitter: http://xxx-blog.free-legal-girls.com/");
			break;
			case "!einnahmen":
			client.say(c_name, "@" + user["username"] + " Danke an alle <3 http://moneyflow.free-legal-girls.com");
			break;
			case "!merch":
			client.say(c_name, "@" + user["username"] + " Der Merch wird nächsten Monat released, hab Geduld");
			break;
			case "!merch":
			client.say(c_name, "@" + user["username"] + " Der Merch wird nächsten Monat released, hab Geduld");
			break;
			case "!voteformodgehalt":
			client.say(c_name, "@" + user["username"] + " Danke für deine Solidarität <3 Weitere Unterstützung kannst du uns hier da lassen: http://modgehalt.free-legal-girls.com/");
			break;
			case "!konzentrieren":
			client.say(c_name, "@AreUKittenMeRightMeow Warden, Nicht Inten, Farmen, Dem Team helfen falls du gefeedet bist");
			break;
			case "!oversleep":
			client.say(c_name, "DIAMOND V LUL DIAMOND V LUL DIAMOND V LUL DIAMOND V LUL DIAMOND V LUL DIAMOND V LUL DIAMOND V LUL DIAMOND V LUL DIAMOND V LUL");
			break;
			case "lul":
			client.say(c_name, "LUL");
			break;
			case "LUL":
			client.say(c_name, "LUL");
			break;
			case "!pi-temp":
			if(user["username"] == "jeldan_van_boven") piTemp.measure(function(err, temp){client.say(c_name, "@" + user["username"] +  " Temp: " + temp + "°C"); if(err){log.error(err)} else{log.debug("PiTemp:" + temp)}});
			break;
			case "!ping":
			if(user.mod) client.say(c_name, "pong");
			break;
			default:
			break;
		}
		// Counter
		if (counterBool && message) {
			var jsonCounter = fs.readFileSync(appRoot + "/hidden/counter.xxx");
			var counter = JSON.parse(jsonCounter);
			switch (message){
				case "!wp":	{
					counterBool = false;
					counter.wp++;
					client.say(c_name, "@" + user["username"] + " Julia hat schon " + counter.wp + " mal mehr oder weniger gut gespielt");
					fs.writeFile(appRoot + "/hidden/counter.xxx", stringify(counter, { space: '  ' }), function(err) {
						if (err) {
							log.error(err);
							return console.log(err);
						}
						else{
							log.debug("WROTE ./hidden/counter.xxx");
						}
					});
					setTimeout(function() {
						counterBool = true;
					}, cd);
					break;
				};
				case "!spacebar": {
					counterBool = false;
					counter.spacebar++;
					client.say(c_name, "@" + user["username"] + " " + counter.spacebar + " mal hat Julia jetzt schon die Leertaste durchgedrückt um dem Fähigkeitsschuss auszuweichen");
					fs.writeFile(appRoot + "/hidden/counter.xxx", stringify(counter, { space: '  ' }), function(err) {
						if (err) {
							log.error(err);
							return console.log(err);
						}
						else{
							log.debug("WROTE ./hidden/counter.xxx");
						}
					});
					setTimeout(function() {
						counterBool = true;
					}, cd);
					break;
				};
				case "!boosted": {
					counterBool = false;
					counter.boosted++;
					client.say(c_name, "@" + user["username"] + " Julia wurde schon " + counter.boosted + " mal aus dem Leben geboosted");
					fs.writeFile(appRoot + "/hidden/counter.xxx", stringify(counter, { space: '  ' }), function(err) {
						if (err) {
							log.error(err);
							return console.log(err);
						}
						else{
							log.debug("WROTE ./hidden/counter.xxx");
						}
					});
					setTimeout(function() {
						counterBool = true;
					}, cd);
					break;
				};
				case "!bluetrinket": {
					counterBool = false;
					counter.bluetrinket++;
					client.say(c_name, "@" + user["username"] + " Julia hat bisher " + counter.bluetrinket + " mal ihr Trinket nicht upgegradet. Ja Gege!");
					fs.writeFile(appRoot + "/hidden/counter.xxx", stringify(counter, { space: '  ' }), function(err) {
						if (err) {
							log.error(err);
							return console.log(err);
						}
						else{
							log.debug("WROTE ./hidden/counter.xxx");
						}
					});
					setTimeout(function() {
						counterBool = true;
					}, cd);
					break;
				};
				case "!cookorn": {
					counterBool = false;
					counter.cookorn++;
					client.say(c_name, "@cookorn stinkt schon zum " + counter.cookorn + "ten mal Kappa");
					fs.writeFile(appRoot + "/hidden/counter.xxx", stringify(counter, { space: '  ' }), function(err) {
						if (err) {
							log.error(err);
							return console.log(err);
						}
						else{
							log.debug("WROTE ./hidden/counter.xxx");
						}
					});
					setTimeout(function() {
						counterBool = true;
					}, cd);
					break;
				};
				default: break;
			}
		}
		// Songrequests
		if (message.startsWith("!sr-") && (user.mod || user["username"] == "Krabbechan")) {
			switch (message) {
				case "!sr-sextape":
				client.say(c_name, "!sr JeMSac1f1Dg");
				break;
				case "!sr-julia":
				client.say(c_name, "!sr 75oC13a2EtI");
				break;
				case "!sr-saufen":
				client.say(c_name, "!sr PP9I6WRD4VI");
				break;
				case "!sr-besoffen":
				client.say(c_name, "!sr fF1dWRmjtKo");
				break;
				case "!sr-hartz4":
				client.say(c_name, "!sr aMMqcBzMkRQ");
				break;
				case "!sr-chameleon":
				client.say(c_name, "!sr JmcA9LIIXWw");
				break;
				case "!sr-ganzganzbillig":
				client.say(c_name, "!sr NdT-W-NhnlI");
				break;
				default:
				break;
			}
		}
	}

});

function realElo(c_name, username) {
	var winrate = 0;
	var text = "";
	fetch('https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/82346830?api_key=' + secureJSON.league)
	.then(res => res.json())
	.then((out) => {
		text = text + " 'J x l i a': " + out[0].tier + " " + out[0].rank + " " + out[0].leaguePoints + "LP ~~";
	})
	.catch(function(err) {
		log.error(err);
		console.log("CANNOT CONNECT");
	});
	fetch('https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/66653847?api_key=' + secureJSON.league)
	.then(res => res.json())
	.then((out) => {
		text = text + " 'AreUKittnMe': " + out[0].tier + " " + out[0].rank + " " + out[0].leaguePoints + "LP ~~";
	})
	.catch(function(err) {
		log.error(err);
		console.log("CANNOT CONNECT");
	});
	setTimeout(function() {
		client.say(c_name, "@" + username + text);
	}, 800);
}

function createNewCountfile() {
	var counter = {
		wp: 0,
		spacebar: 0,
		boosted: 0,
		bluetrinket: 0
	};
	fs.writeFile(appRoot + "/hidden/counter.xxx", stringify(counter, { space: '  ' }), (err) => {
		if (err) {
			console.error(err);
			log.error(err);
			return;
		};
		console.log("Counter-File has been created");
		log.debug("CREATED: counter.xxx")
	});
};
