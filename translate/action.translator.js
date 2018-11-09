'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _worldCountries = require('world-countries');

var _worldCountries2 = _interopRequireDefault(_worldCountries);

var _nlp_compromise = require('nlp_compromise');

var _nlp_compromise2 = _interopRequireDefault(_nlp_compromise);

var _googleTranslateApi = require('google-translate-api');

var _googleTranslateApi2 = _interopRequireDefault(_googleTranslateApi);

var _helpers = require('../../node_modules/ava-ia/lib/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -- Internal
var DEMONYM = 'Demonym';
var PREPOSITION = 'Preposition';

exports.default = function (state) {

  return new Promise(function (resolve, reject) {
	  
    	var action_index = state.tokens.indexOf('translate');
		var terms = _nlp_compromise2.default.text(state.sentence).sentences[0].terms;
		if (action_index == -1) {
			terms.map(function (term, index) {
				if (term.text.toLowerCase().indexOf('translate') != -1)
					action_index = index;
			})
		}
		
		var to = void 0;
		var sentence = '';
		
		terms.map(function (term, index) {
		  if (index > action_index) {
			if (term.tag === DEMONYM) {
			  (function () {
				var demonym = term.text.toLowerCase();
				if (demonym != 'english') {
					var country = _worldCountries2.default.find(function (country) {
					  return country.demonym.toLowerCase() === demonym;
					});
					if (country) to = country.cca2;
				} else {
					to = 'EN';
				}
			  })();
			} else if (terms[index + 1] && !(term.tag === PREPOSITION && terms[index + 1].tag === DEMONYM)) {
			    sentence += term.text + ' ';
			} else if (!terms[index + 1] && term.tag != PREPOSITION) {
				sentence += term.text;
			}
		  }
		});
	
    if (sentence && to) {
	  if (state.debug) info('ActionTranslator'.bold.yellow, 'sentence:'.bold, sentence, 'to:'.bold, to);
      (0, _googleTranslateApi2.default)(sentence, { to: to }).then(function (response) {
        	if (response.text.indexOf('null') !== -1) response.text = response.text.replace('null','');
			state.action = {
			  module: 'translate',
			  sentence: sentence,
			  command: 'local',
			  cca2: to,
			  entity: _helpers.entities.knowledge,
			  translated: response.text
			};
		
			resolve(state);
		
      });
    } else {
		setTimeout(function(){
			state.action = {
				module: 'translate',
				command: 'error',
				error: 'je suis désolé, je ne suis pas arrivé à traduire cette phrase'
			};
			resolve(state);
		}, 500);  
	}
  });
};