var exec = require('child_process').exec;
var fs = require('fs-extra');

require('colors');


exports.action = function(data, callback){
  
	var tblCommand = {
		
		error: function() {Avatar.speak(data.action.error, data.client, function() {  
								Avatar.Speech.end(data.client);
							});
		},
		local: function() {translate(data.client, data.action.sentence, data.action.translated, data.action.cca2)}
	};
	
	info("Translate command:", data.action.command.yellow, "From:", data.client.yellow);
	tblCommand[data.action.command]();
  
	callback();
  
}



function translate(client, sentence, translated, language) {
	
	if (language.toLowerCase() != 'en') info("Sentence:".bold, sentence.yellow);
	info("Translated:".bold, translated.yellow);
	
	if (Config.modules.translate.voicerss.key && Config.modules.translate.voicerss.key.length > 0 ) {
		
		info('Traduction from voicerss');
		
		var tts = require('./node_modules/voice-rss-tts/index.js');
		var country;
		for (var i in Config.modules.translate.voicerss.countries) {
			if (Config.modules.translate.voicerss.countries[i].cca2 == language.toLowerCase()) {
				country = Config.modules.translate.voicerss.countries[i].code;
				break;
			}
		}
		
		if (country) {
			tts.speech({
				key: Config.modules.translate.voicerss.key,
				hl: country,
				src: translated,
				r: Config.modules.translate.voicerss.speed,
				c: 'wav',
				f: '16khz_16bit_stereo',
				ssml: false,
				b64: false,
				callback: function (err, content) {
					if (err) {
						error(err);
						Avatar.Speech.end(client);
					} else {
						var file = __dirname + '/tts/translated-' + language.toLowerCase() + '.wav';
						fs.writeFile(file, toBuffer(content));
						speak_translated(client, language);
					}
				}
			});
		} else {
			Avatar.speak('je n\'ai pas trouvé le code du pays' ,client, function() {  
				Avatar.Speech.end(client);
			});
		}
	} else {
		info('Traduction from espeak');
		
		var cmd = __dirname + '/eSpeak/command_line/eSpeak -v' + language.toLowerCase() + Config.modules.translate.espeak.voice + ' -k20 -s' + Config.modules.translate.espeak.speed + ' --path="' + __dirname + '/eSpeak" -w "' + __dirname + '/tts/translated-' + language + '.wav" "' + translated + '"';
	 
		var child = exec(cmd, function (error, stdout, stderr) {
			if (error) {
				info('Unable to start eSpeak: ' + error);
				return Avatar.Speech.end(client);
			}
			 
			speak_translated(client, language);
		});
		
	}
}


var speak_translated = function (client, language) {
	
	if (!Avatar.Socket.isServerSpeak(client)) {
		Avatar.copyfile('plugins/translate/tts/translated-' + language.toLowerCase() + '.wav', client, function() { 
			Avatar.play('%TRANSFERT%/translated-' + language.toLowerCase() + '.wav', client, function() { 
				Avatar.Speech.end(client);
			})
		})
	} else
		Avatar.play('plugins/translate/tts/translated-' + language.toLowerCase() + '.wav', client, function() { 
			Avatar.Speech.end(client);
		});
	
}



var streamBuffers = require('stream-buffers');
var toBuffer = function(records){
  var osb = new streamBuffers.WritableStreamBuffer({
    initialSize: (100 * 1024),   // start at 100 kilobytes.
    incrementAmount: (10 * 1024) // grow by 10 kilobytes each time buffer overflows.
  });
 
  osb.write(new Buffer(records, 'binary'));
  
  osb.end();
  return osb.getContents();
}

