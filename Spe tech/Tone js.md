========================
CODE SNIPPETS
========================
TITLE: Installing Dependencies with npm
DESCRIPTION: This command installs the necessary dependencies for the Tone.js project using npm. It is a prerequisite for building and running the examples locally.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/examples/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
$ npm install
```

----------------------------------------

TITLE: Starting a Local Server with Python
DESCRIPTION: This command starts a simple HTTP server using Python to serve the Tone.js examples. It allows users to access the examples through a web browser. The server runs on port 8000 by default.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/examples/README.md#_snippet_2

LANGUAGE: Shell
CODE:
```
$ python -m SimpleHTTPServer 8000
```

----------------------------------------

TITLE: Building the project with npm
DESCRIPTION: This command builds the Tone.js project using npm.  It compiles the necessary files to run the examples locally. This must be executed after installing the dependencies.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/examples/README.md#_snippet_1

LANGUAGE: Shell
CODE:
```
$ npm run build
```

----------------------------------------

TITLE: Installing Tone.js using npm
DESCRIPTION: This snippet demonstrates how to install Tone.js locally into a project using npm. It shows the commands for installing the latest stable version and the 'next' version. The `npm install` command is used to download and install the Tone.js package and its dependencies.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm install tone      // Install the latest stable version
npm install tone@next // Or, alternatively, use the 'next' version
```

----------------------------------------

TITLE: Starting Audio with Tone.start()
DESCRIPTION: This JavaScript snippet demonstrates how to start the audio context using `Tone.start()` in response to a user click event. The event listener is attached to a button element, and when the button is clicked, `Tone.start()` is called. The `await` keyword ensures that the audio context is fully started before proceeding. A console log confirms that the audio is ready.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/README.md#_snippet_7

LANGUAGE: javascript
CODE:
```
//attach a click listener to a play button
document.querySelector("button")?.addEventListener("click", async () => {
	await Tone.start();
	console.log("audio is ready");
});
```

----------------------------------------

TITLE: Creating a basic synth and playing a note
DESCRIPTION: This JavaScript snippet demonstrates how to create a basic synthesizer using `Tone.Synth` and play a middle 'C' note for an eighth note duration. The `toDestination()` method connects the synth to the audio output, and `triggerAttackRelease()` starts and stops the note.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/README.md#_snippet_3

LANGUAGE: javascript
CODE:
```
//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();

//play a middle 'C' for the duration of an 8th note
synth.triggerAttackRelease("C4", "8n");
```

----------------------------------------

TITLE: Loading and playing a sample with Tone.Player
DESCRIPTION: This JavaScript snippet demonstrates how to load and play an audio sample using `Tone.Player`. The URL of the audio file is passed to the `Tone.Player` constructor. The `toDestination()` method connects the player to the audio output. `Tone.loaded()` ensures that the audio file is fully loaded before calling `player.start()` to play the sample.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/README.md#_snippet_10

LANGUAGE: javascript
CODE:
```
const player = new Tone.Player(
	"https://tonejs.github.io/audio/berklee/gong_1.mp3"
).toDestination();
Tone.loaded().then(() => {
	player.start();
});
```

----------------------------------------

TITLE: Triggering attack and release separately
DESCRIPTION: This JavaScript snippet demonstrates how to trigger the attack and release of a note separately using `triggerAttack` and `triggerRelease` methods. `Tone.now()` gets the current audio context time, which is used to schedule the attack and release events. The note 'C4' is triggered immediately and released after 1 second.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/README.md#_snippet_4

LANGUAGE: javascript
CODE:
```
const synth = new Tone.Synth().toDestination();
const now = Tone.now();
// trigger the attack immediately
synth.triggerAttack("C4", now);
// wait one second before triggering the release
synth.triggerRelease(now + 1);
```

----------------------------------------

TITLE: Connecting a player to effects in parallel
DESCRIPTION: This JavaScript snippet demonstrates how to connect a `Tone.Player` to multiple effects in parallel using `connect`. The player's output is connected to both a `Tone.Filter` and a `Tone.FeedbackDelay`, allowing the audio to pass through both effects simultaneously before reaching the audio output.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/README.md#_snippet_13

LANGUAGE: javascript
CODE:
```
const player = new Tone.Player({
	url: "https://tonejs.github.io/audio/drum-samples/loops/ominous.mp3",
	autostart: true,
});
const filter = new Tone.Filter(400, "lowpass").toDestination();
const feedbackDelay = new Tone.FeedbackDelay(0.125, 0.5).toDestination();

// connect the player to the feedback delay and filter in parallel
player.connect(filter);
player.connect(feedbackDelay);
```

----------------------------------------

TITLE: Scheduling events with Tone.Loop and Transport
DESCRIPTION: This JavaScript snippet demonstrates how to schedule events using `Tone.Loop` and `Tone.Transport`. Two synths are created (`Tone.FMSynth` and `Tone.AMSynth`), and loops are used to trigger notes at specific intervals. The loops are started relative to the transport's time, and the transport's BPM is ramped up over time. The FMSynth plays every quarter note, while the AMSynth plays every off-quarter note.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/README.md#_snippet_8

LANGUAGE: javascript
CODE:
```
// create two monophonic synths
const synthA = new Tone.FMSynth().toDestination();
const synthB = new Tone.AMSynth().toDestination();
//play a note every quarter-note
const loopA = new Tone.Loop((time) => {
	synthA.triggerAttackRelease("C2", "8n", time);
}, "4n").start(0);
//play another note every off quarter-note, by starting it "8n"
const loopB = new Tone.Loop((time) => {
	synthB.triggerAttackRelease("C4", "8n", time);
}, "4n").start("8n");
// all loops start when the Transport is started
Tone.getTransport().start();
// ramp up to 800 bpm over 10 seconds
Tone.getTransport().bpm.rampTo(800, 10);
```

----------------------------------------

TITLE: Creating a polyphonic synth with Tone.PolySynth
DESCRIPTION: This JavaScript snippet shows how to create a polyphonic synthesizer using `Tone.PolySynth`. A `Tone.Synth` instance is passed as the first argument to `Tone.PolySynth`, creating a polyphonic synth that can play multiple notes simultaneously. The `triggerAttack` and `triggerRelease` methods are used to play and release multiple notes at specific times.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/README.md#_snippet_9

LANGUAGE: javascript
CODE:
```
const synth = new Tone.PolySynth(Tone.Synth).toDestination();
const now = Tone.now();
synth.triggerAttack("D4", now);
synth.triggerAttack("F4", now + 0.5);
synth.triggerAttack("A4", now + 1);
synth.triggerAttack("C5", now + 1.5);
synth.triggerAttack("E5", now + 2);
synth.triggerRelease(["D4", "F4", "A4", "C5", "E5"], now + 4);
```

----------------------------------------

TITLE: Connecting a player to a distortion effect
DESCRIPTION: This JavaScript snippet demonstrates how to connect a `Tone.Player` to a `Tone.Distortion` effect. A `Tone.Player` is created with a looping audio sample, and a `Tone.Distortion` effect is created and connected to the audio output. The `player.connect(distortion)` line routes the audio from the player through the distortion effect before it reaches the speakers.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/README.md#_snippet_12

LANGUAGE: javascript
CODE:
```
const player = new Tone.Player({
	url: "https://tonejs.github.io/audio/berklee/gurgling_theremin_1.mp3",
	loop: true,
	autostart: true,
});
//create a distortion effect
const distortion = new Tone.Distortion(0.4).toDestination();
//connect a player to the distortion
player.connect(distortion);
```

----------------------------------------

TITLE: Ramping oscillator frequency using a Signal
DESCRIPTION: This JavaScript snippet demonstrates how to control the frequency of an `Oscillator` using a `Signal`. The `osc.frequency.value` is set to "C4" initially, and then `osc.frequency.rampTo("C2", 2)` is used to smoothly ramp the frequency to "C2" over 2 seconds. The oscillator starts and stops after 3 seconds.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/README.md#_snippet_14

LANGUAGE: javascript
CODE:
```
const osc = new Tone.Oscillator().toDestination();
// start at "C4"
osc.frequency.value = "C4";
// ramp to "C2" over 2 seconds
osc.frequency.rampTo("C2", 2);
// start the oscillator for 2 seconds
osc.start().stop("+3");
```

----------------------------------------

TITLE: Including Tone.js in HTML using unpkg
DESCRIPTION: This snippet demonstrates how to include Tone.js directly in an HTML document using unpkg.com. The `<script src="http://unpkg.com/tone"></script>` tag includes the Tone.js library from the unpkg CDN, making its functionalities available to the webpage. It must be placed before other project scripts that depend on Tone.js.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/README.md#_snippet_2

LANGUAGE: html
CODE:
```
<script src="http://unpkg.com/tone"></script>
```

----------------------------------------

TITLE: Importing Tone.js in JavaScript
DESCRIPTION: This snippet shows how to import Tone.js into a JavaScript project using the `import` syntax. The `import * as Tone from "tone";` statement imports all exported members from the 'tone' module into the Tone namespace, allowing access to Tone.js functionalities.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/README.md#_snippet_1

LANGUAGE: javascript
CODE:
```
import * as Tone from "tone";
```

----------------------------------------

TITLE: Running Full Tests Headlessly in Chrome and Firefox using npm (bash)
DESCRIPTION: This command runs the full set of Tone.js tests in both Chrome and Firefox browsers in headless mode using npm. It requires Chrome and Firefox to be installed on the system. The tests execute automatically and results are reported to the console without launching visible browser windows.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/test/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm run test
```

----------------------------------------

TITLE: Creating a sampler with Tone.Sampler
DESCRIPTION: This JavaScript snippet demonstrates how to create a sampler using `Tone.Sampler`. The `urls` property maps note names to audio file URLs. The `release` property sets the release time for the samples. `baseUrl` provides the base URL for the audio files.  `Tone.loaded()` ensures all the audio files are loaded before triggering the notes Eb4, G4 and Bb4.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/README.md#_snippet_11

LANGUAGE: javascript
CODE:
```
const sampler = new Tone.Sampler({
	urls: {
		C4: "C4.mp3",
		"D#4": "Ds4.mp3",
		"F#4": "Fs4.mp3",
		A4: "A4.mp3",
	},
	release: 1,
	baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

Tone.loaded().then(() => {
	sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], 4);
});
```

----------------------------------------

TITLE: Scheduling events with triggerAttackRelease
DESCRIPTION: This JavaScript snippet shows how to use `triggerAttackRelease` to schedule multiple notes to play at specific times in the future. `Tone.now()` gets the current time, and notes are scheduled using relative times (now + 0.5, now + 1). The notes C4, E4, and G4 are played sequentially with an eighth-note duration.

SOURCE: https://github.com/tonejs/tone.js/blob/dev/README.md#_snippet_5

LANGUAGE: javascript
CODE:
```
const synth = new Tone.Synth().toDestination();
const now = Tone.now();
synth.triggerAttackRelease("C4", "8n", now);
synth.triggerAttackRelease("E4", "8n", now + 0.5);
synth.triggerAttackRelease("G4", "8n", now + 1);
```