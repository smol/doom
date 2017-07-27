// mus2midi.js -- based off https://github.com/sirjuddington/SLADE/blob/master/src/External/mus2mid/mus2mid.cpp
// musToMidi.ts -- based off https://github.com/jmickle66666666/wad-js/blob/develop/src/wad/mus2midi.js
// Read a MUS file from a lump data (musinput) and output a MIDI blob
//
// Returns ArrayBuffer if successful, false otherwise

module Wad {

	// Standard MIDI type 0 header + track header
	/*
	const uint8_t midiheader[] =
	{
		'M', 'T', 'h', 'd',     // Main header
		0x00, 0x00, 0x00, 0x06, // Header size
		0x00, 0x00,             // MIDI type (0)
		0x00, 0x01,             // Number of tracks
		0x00, 0x46,             // Resolution
		'M', 'T', 'r', 'k',     // Start of track
		0x00, 0x00, 0x00, 0x00  // Placeholder for track length
	};
	*/
	// ^ this is the standard first 22 bytes of the midi output, aside from adding the track length.
	// I should create a function that adds this data manually with the DataView
	function writeMidiHeader() {
		var midiHeaderData = [
		];


	}

	interface MusHeader {
		id: number[];
		scorelength: number;
		scorestart: number;
		primarychannels: number;
		secondarychannels: number;
		instrumentcount: number;
	}

	const MidiHeader: number[] = [
		'M'.charCodeAt(0), 'T'.charCodeAt(0), 'h'.charCodeAt(0), 'd'.charCodeAt(0), // Main header
		0x00, 0x00, 0x00, 0x06, // Header size
		0x00, 0x00, // MIDI type (0)
		0x00, 0x01, // Number of tracks
		0x00, 0x46, // Resolution
		'M'.charCodeAt(0), 'T'.charCodeAt(0), 'r'.charCodeAt(0), 'k'.charCodeAt(0), // Start of track
		0x00, 0x00, 0x00, 0x00 // Placeholder for track length
	];

	// constants
	const NUM_CHANNELS: number = 16;
	const MUS_PERCUSSION_CHAN: number = 15;
	const MIDI_PERCUSSION_CHAN: number = 9;
	const MIDI_TRACKLENGTH_OFS: number = 18;

	export class MusToMidi {
		// MUS event codes
		private mus_releasekey = 0x00;
		private mus_presskey = 0x10;
		private mus_pitchwheel = 0x20;
		private mus_systemevent = 0x30;
		private mus_changecontroller = 0x40;
		private mus_scoreend = 0x60;

		// MIDI event codes
		private midi_releasekey = 0x80;
		private midi_presskey = 0x90;
		private midi_aftertouchkey = 0xA0;
		private midi_changecontroller = 0xB0;
		private midi_changepatch = 0xC0;
		private midi_aftertouchchannel = 0xD0;
		private midi_pitchwheel = 0xE0;

		private data: DataView;
		private master: ArrayBuffer;
		private dataToWrite: any[] = [];

		// Cached channel velocities
		private channelvelocities = [127, 127, 127, 127, 127, 127, 127, 127,
			127, 127, 127, 127, 127, 127, 127, 127];

		// Timestamps between sequences of MUS events
		private queuedTime = 0;

		// Counter for the length of the track
		private trackSize;

		private controller_map = [0x00, 0x20, 0x01, 0x07, 0x0A, 0x0B, 0x5B, 0x5D,
			0x40, 0x43, 0x78, 0x7B, 0x7E, 0x7F, 0x79];

		private channelMap = [];

		// Main DataView for writing to. This is used by writeData();
		private outputDataView;
		private writePosition = 0;

		// Wrapper function to work like slade's memchunk.write()
		// I'm so lazy
		private position = 0;

		constructor(data: DataView) {
			this.data = data;

			this.master = this.convert();

			// if (this.master === null)
			// 	console.log("Failed to convert mus to midi. Sucks.");
			// 	console.log(musDataPosition);
			// 	console.log(data.byteLength);
			// 	console.log(this.master);
			// }
		}

		getMasterOutput(): ArrayBuffer {
			return this.master;
		}

		// Given a MUS channel number, get the MIDI channel number to use in the outputted file.
		private getMIDIChannel(musChannel) {
			// Find the MIDI channel to use for this MUS channel.
			// MUS channel 15 is the percusssion channel.

			// Allocate a free MIDI channel.
			function allocateMIDIChannel() {
				var result;
				var max;
				var i;

				// Find the current highest-allocated channel.

				max = -1;

				for (i = 0; i < NUM_CHANNELS; ++i) {
					if (this.channelMap[i] > max) {
						max = this.channelMap[i];
					}
				}

				// max is now equal to the highest-allocated MIDI channel.  We can
				// now allocate the next available channel.  This also works if
				// no channels are currently allocated (max=-1)

				result = max + 1;

				// Don't allocate the MIDI percussion channel!

				if (result == MIDI_PERCUSSION_CHAN) {
					++result;
				}

				return result;
			}

			if (musChannel == MUS_PERCUSSION_CHAN) {
				return MIDI_PERCUSSION_CHAN;
			}
			else {
				// If a MIDI channel hasn't been allocated for this MUS channel
				// yet, allocate the next free MIDI channel.

				if (this.channelMap[musChannel] == -1) {
					this.channelMap[musChannel] = allocateMIDIChannel();
				}

				return this.channelMap[musChannel];
			}
		}

		private writeData(bytes) {
			this.dataToWrite = this.dataToWrite.concat(bytes);
		}

		// Write timestamp to a MIDI file.
		private writeTime(time) {
			var buffer = time & 0x7F;
			var writeval;

			while ((time >>= 7) != 0) {
				buffer <<= 8;
				buffer |= ((time & 0x7F) | 0x80);
			}

			for (; ;) {
				writeval = (buffer & 0xFF);

				this.writeData([writeval]);

				this.trackSize += 1;

				if ((buffer & 0x80) != 0)
					buffer >>= 8;
				else {
					this.queuedTime = 0;
					return;
				}
			}
		}

		private confirmWrite() {
			console.info(this.dataToWrite.length);
			var newBuffer = new ArrayBuffer(this.dataToWrite.length);
			this.outputDataView = new DataView(newBuffer);
			// Then write the data
			for (var i = 0; i < this.dataToWrite.length; i++) {
				this.outputDataView.setUint8(this.position, this.dataToWrite[i]);
				this.position += 1;
			}
		}



		// Write the end of track marker
		private writeEndTrack() {
			let endtrack = [0xFF, 0x2F, 0x00];

			this.writeTime(this.queuedTime);

			this.writeData(endtrack);

			this.trackSize += 3;
		}


		// Write a pitch wheel/bend event
		private writePitchWheel(channel, wheel) {
			// Write queued time
			this.writeTime(this.queuedTime);

			var working = this.midi_pitchwheel | channel;
			this.writeData([working]);

			working = wheel & 0x7F;
			this.writeData([working]);

			working = (wheel >> 7) & 0x7F;
			this.writeData([working]);

			this.trackSize += 3;
		}

		// Write a key press event
		private writePressKey(channel, key, velocity) {
			// Write queued time
			this.writeTime(this.queuedTime);

			// Write pressed key and channel
			var working = this.midi_presskey | channel;
			this.writeData([working]);

			// Write key
			working = key & 0x7F;
			this.writeData([working]);

			// Wite velocity
			working = velocity & 0x7F;
			this.writeData([working]);

			this.trackSize += 3;
		}

		// Write a key release event
		private writeReleaseKey(channel, key) {

			// Write queued time
			this.writeTime(this.queuedTime);

			// Write released key
			var working = this.midi_releasekey | channel;
			this.writeData([working]);

			// Write key
			working = key & 0x7F;
			this.writeData([working]);

			// Dummy
			working = 0;
			this.writeData([working]);

			this.trackSize += 3;
		}

		private readMusHeader(): MusHeader {
			var output: MusHeader = {
				id: [],
				scorelength: 0,
				scorestart: 0,
				primarychannels: 0,
				secondarychannels: 0,
				instrumentcount: 0
			};

			for (var i = 0; i < 4; i++) {
				output.id.push(this.data.getUint8(i));
			}
			output.scorelength = this.data.getUint16(4, true);
			output.scorestart = this.data.getUint16(6, true);
			output.primarychannels = this.data.getUint16(8, true);
			output.secondarychannels = this.data.getUint16(10, true);
			output.instrumentcount = this.data.getUint16(12, true);

			return output;
		}

		// Write a patch change event
		private writeChangePatch(channel, patch) {
			// Write queued time
			this.writeTime(this.queuedTime);

			var working = this.midi_changepatch | channel;
			this.writeData([working]);

			working = patch & 0x7F;
			this.writeData([working]);

			this.trackSize += 2;
		}

		// Write a valued controller change event
		private writeChangeController_Valued(channel, control, value) {
			// Write queued time
			this.writeTime(this.queuedTime);

			var working = this.midi_changecontroller | channel;
			this.writeData([working]);

			working = control & 0x7F;
			this.writeData([working]);

			// Quirk in vanilla DOOM? MUS controller values should be 7-bit, not 8-bit.
			working = value & 0x80 ? 0x7F : value;
			this.writeData([working]);

			this.trackSize += 3;
		}

		// Write a valueless controller change event
		private writeChangeController_Valueless(channel, control) {
			this.writeChangeController_Valued(channel, control, 0);
		}

		private convert(): ArrayBuffer {
			var channel_map: number[] = [];

			// master dataview for input mus
			let musDataView: DataView = this.data;
			var musDataPosition: number = 0;

			console.log('start mus2midi');
			var startTime = Date.now();

			function getMusByte8() {
				var output = musDataView.getUint8(musDataPosition);
				musDataPosition += 1;
				//console.log(output);
				return output;
			}

			// Header for the MUS file
			var musfileheader;

			// Descriptor for the current MUS event
			var eventdescriptor;
			var channel; // Channel number
			var mus_event;


			// Bunch of vars read from MUS lump
			var key;
			var controllernumber;
			var controllervalue;

			// Buffer used for MIDI track size record
			var tracksizebuffer = [];

			// Flag for when the score end marker is hit.
			var hitscoreend = 0;

			// Temp working byte
			var working;
			// Used in building up time delays
			var timedelay;

			// Initialise channel map to mark all channels as unused.
			for (channel = 0; channel < NUM_CHANNELS; ++channel) {
				channel_map[channel] = -1;
			}

			// Grab the header
			musfileheader = this.readMusHeader();
			// Check MUS header
			if (musfileheader.id[0] != 'M'.charCodeAt(0) || musfileheader.id[1] != 'U'.charCodeAt(0)
				|| musfileheader.id[2] != 'S'.charCodeAt(0) || musfileheader.id[3] != 0x1A) {
				console.log("mus header fail");
				return null;
			}

			// Seek to where the data is held
			musDataPosition = musfileheader.scorestart;
			// So, we can assume the MUS file is faintly legit. Let's start writing MIDI data...

			writeMidiHeader();

			// Now, process the MUS file:
			while (hitscoreend == 0) {
				// Handle a block of events:

				while (hitscoreend == 0) {
					// Fetch channel number and event code:
					eventdescriptor = getMusByte8();


					this.getMIDIChannel(eventdescriptor & 0x0F);
					mus_event = eventdescriptor & 0x70;
					switch (mus_event) {
						case this.mus_releasekey:
							//console.log('mus_releasekey');
							key = getMusByte8();

							this.writeReleaseKey(channel, key);

							break;

						case this.mus_presskey:
							key = getMusByte8();

							if (key & 0x80) {
								this.channelvelocities[channel] = getMusByte8();

								this.channelvelocities[channel] &= 0x7F;

								//console.log('mus_presskey: '+key+ ' ' + channelvelocities[channel]);
							} else {
								//console.log('mus_presskey: '+key);
							}

							this.writePressKey(channel, key, this.channelvelocities[channel]);

							break;

						case this.mus_pitchwheel:
							//console.log('mus_pitchwheel');
							key = getMusByte8();

							this.writePitchWheel(channel, key * 64);

							break;

						case this.mus_systemevent:
							//console.log('mus_systemevent');
							controllernumber = getMusByte8();

							if (controllernumber < 10 || controllernumber > 14) {
								console.log('controller number inaccurate 10-14:' + controllernumber);
								return null;
							}

							this.writeChangeController_Valueless(channel, this.controller_map[controllernumber]);

							break;

						case this.mus_changecontroller:
							controllernumber = getMusByte8();
							controllervalue = getMusByte8();
							//console.log('mus_changecontroller: ' +controllernumber+' '+controllervalue);
							if (controllernumber == 0) {
								this.writeChangePatch(channel, controllervalue);
							}
							else {
								if (controllernumber < 1 || controllernumber > 9) {
									console.log('controller number inaccurate: ' + controllernumber);
									return null;
								}

								this.writeChangeController_Valued(channel, this.controller_map[controllernumber], controllervalue);
							}

							break;

						case this.mus_scoreend:
							//console.log('mus_scoreend');
							hitscoreend = 1;
							break;

						default:
							//console.log('eventdescriptor default: '+eventdescriptor + ' ' + (eventdescriptor & 0x80));
							return null;
					}
					if ((eventdescriptor & 0x80) != 0) {
						//console.log('delay count');
						break;
					}
				}
				// Now we need to read the time code:
				if (hitscoreend == 0) {
					//console.log('read time code');
					timedelay = 0;
					//delayCounter = 0;
					for (; ;) {
						working = getMusByte8();
						//delayCounter += 1;
						timedelay = timedelay * 128 + (working & 0x7F);
						if ((working & 0x80) == 0)
							break;
					}
					//console.log('delay count: '+delayCounter + ' time delay: ' + timedelay)
					this.queuedTime += timedelay;
				}
			}
			console.log('finish writing');
			console.log('time: ' + (Date.now() - startTime));
			// End of track
			this.writeEndTrack();

			this.confirmWrite();

			// Write the track size into the stream
			this.outputDataView.setUint8(MIDI_TRACKLENGTH_OFS + 0, (this.trackSize >> 24) & 0xff);
			this.outputDataView.setUint8(MIDI_TRACKLENGTH_OFS + 1, (this.trackSize >> 16) & 0xff);
			this.outputDataView.setUint8(MIDI_TRACKLENGTH_OFS + 2, (this.trackSize >> 8) & 0xff);
			this.outputDataView.setUint8(MIDI_TRACKLENGTH_OFS + 3, this.trackSize & 0xff);

			return this.outputDataView.buffer;
		}
	}
}