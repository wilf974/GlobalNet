========================
CODE SNIPPETS
========================
TITLE: Cloning howler.js Repository (Shell)
DESCRIPTION: Use this command in your terminal to clone the complete howler.js repository from GitHub. This will download all source code, examples, and documentation, including the live streaming demo files. Ensure you have Git installed to execute this command.

SOURCE: https://github.com/goldfire/howler.js/blob/master/examples/radio/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
git clone https://github.com/goldfire/howler.js.git
```

----------------------------------------

TITLE: Playing a basic sound with Howler.js
DESCRIPTION: This is the most basic example showing how to create a Howl object with a single source file and immediately play it using the play() method.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_3

LANGUAGE: javascript
CODE:
```
var sound = new Howl({
  src: ['sound.mp3']
});

sound.play();
```

----------------------------------------

TITLE: Cloning howler.js Repository (Shell)
DESCRIPTION: Provides the command-line instruction to clone the howler.js GitHub repository using Git. This is a prerequisite for accessing the source code and running the demo locally.

SOURCE: https://github.com/goldfire/howler.js/blob/master/examples/sprite/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
git clone https://github.com/goldfire/howler.js.git
```

----------------------------------------

TITLE: Configuring Howl with playback options
DESCRIPTION: This example demonstrates initializing a Howl object with several common options such as multiple sources, autoplay, looping, volume, and an event callback for when the sound finishes.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_5

LANGUAGE: javascript
CODE:
```
var sound = new Howl({
  src: ['sound.webm', 'sound.mp3', 'sound.wav'],
  autoplay: true,
  loop: true,
  volume: 0.5,
  onend: function() {
    console.log('Finished!');
  }
});
```

----------------------------------------

TITLE: Using Howler.js with ES6 syntax
DESCRIPTION: This example combines ES6 module import with creating a Howl object and demonstrates controlling the global volume for all sounds using the Howler object.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_9

LANGUAGE: javascript
CODE:
```
import {Howl, Howler} from 'howler';

// Setup the new Howl.
const sound = new Howl({
  src: ['sound.webm', 'sound.mp3']
});

// Play the sound.
sound.play();

// Change global volume.
Howler.volume(0.5);
```

----------------------------------------

TITLE: Configuring XHR requests for Web Audio loading
DESCRIPTION: These examples demonstrate how to use the `xhr` option in the Howl constructor to customize the XHR request used when loading audio files via Web Audio, allowing for custom headers, methods, or credentials.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_11

LANGUAGE: javascript
CODE:
```
// Using each of the properties.
new Howl({
  xhr: {
    method: 'POST',
    headers: {
      Authorization: 'Bearer:' + token,
    },
    withCredentials: true,
  }
});
```

LANGUAGE: javascript
CODE:
```
// Only changing the method.
new Howl({
  xhr: {
    method: 'POST',
  }
});
```

----------------------------------------

TITLE: Handling Howler.js events
DESCRIPTION: This example demonstrates how to attach event listeners to a Howl object using the 'once' method for single-trigger events like 'load' and the 'on' method for repeated events like 'end'.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_7

LANGUAGE: javascript
CODE:
```
var sound = new Howl({
  src: ['sound.webm', 'sound.mp3']
});

// Clear listener after first call.
sound.once('load', function(){
  sound.play();
});

// Fires when the sound finishes playing.
sound.on('end', function(){
  console.log('Finished!');
});
```

----------------------------------------

TITLE: Encode WEBM with Cues using FFmpeg - Shell
DESCRIPTION: Provides a command-line example using `ffmpeg` to encode a WAV file into a WEBM format with the `dash` flag. This flag adds cues to the WEBM file, which can improve seekability, particularly in browsers like Firefox.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_16

LANGUAGE: shell
CODE:
```
ffmpeg -i sound1.wav -dash 1 sound1.webm
```

----------------------------------------

TITLE: Fading Sound In and Out howler.js JavaScript
DESCRIPTION: Fades the volume of a sound from a starting volume to an ending volume over a specified duration. This example shows fading in from 0 to 1, and then using the `fade` event to trigger a fade out from 1 to 0.

SOURCE: https://github.com/goldfire/howler.js/blob/master/CHANGELOG.md#_snippet_4

LANGUAGE: javascript
CODE:
```
// Fade in a sound.
sound.fade(0, 1, 1000);

// Fade out the sound once the previous fade has ended.
sound.once('fade', function(){
  sound.fade(1, 0, 1000);
});
```

----------------------------------------

TITLE: Requiring Howler.js using CommonJS
DESCRIPTION: This JavaScript snippet demonstrates how to require the Howl and Howler classes using CommonJS syntax, commonly used in Node.js or older module bundling setups.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_2

LANGUAGE: javascript
CODE:
```
const {Howl, Howler} = require('howler');
```

----------------------------------------

TITLE: Initializing Howler.js in HTML
DESCRIPTION: This snippet demonstrates how to include the howler.js library using a script tag in an HTML file and initialize a new Howl object with specified audio sources.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_0

LANGUAGE: html
CODE:
```
<script src="/path/to/howler.js"></script>
<script>
    var sound = new Howl({
      src: ['sound.webm', 'sound.mp3']
    });
</script>
```

----------------------------------------

TITLE: Importing Howler.js using ES6 Modules
DESCRIPTION: This JavaScript snippet shows the standard way to import the Howl and Howler classes using ES6 module syntax, suitable for modern front-end development workflows.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_1

LANGUAGE: javascript
CODE:
```
import {Howl, Howler} from 'howler';
```

----------------------------------------

TITLE: Group Playback with Howler.js - JavaScript
DESCRIPTION: Demonstrates creating a new Howl instance with audio sprites and controlling multiple concurrently playing sounds from that instance. It shows how to play individual sprite tracks by name, control the volume of the entire group, and pause all currently playing sounds within the group using global instance methods.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_12

LANGUAGE: javascript
CODE:
```
var sound = new Howl({
  src: ['sound.webm', 'sound.mp3'],
  sprite: {
    track01: [0, 20000],
    track02: [21000, 41000]
  }
});

// Play each of the track.s
sound.play('track01');
sound.play('track02');

// Change the volume of both tracks.
sound.volume(0.5);

// After a second, pause both sounds in the group.
setTimeout(function() {
  sound.pause();
}, 1000);
```

----------------------------------------

TITLE: Specify Dolby Audio Format - JavaScript
DESCRIPTION: Demonstrates how to correctly load and specify the Dolby Audio format when using `howler.js`. Since Dolby Audio files can be in an `mp4` container, you must explicitly list 'dolby' in the `format` array to ensure they are identified and played correctly.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_15

LANGUAGE: javascript
CODE:
```
var dolbySound = new Howl({
  src: ['sound.mp4', 'sound.webm', 'sound.mp3'],
  format: ['dolby', 'webm', 'mp3']
});
```

----------------------------------------

TITLE: Howl Sprite definition syntax
DESCRIPTION: This snippet shows the required syntax for defining a sound sprite object within the Howl constructor options, including the optional third parameter for looping a sprite.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_10

LANGUAGE: javascript
CODE:
```
new Howl({
  sprite: {
    key1: [offset, duration, (loop)]
  },
});
```

----------------------------------------

TITLE: Defining and playing sound sprites with Howler.js
DESCRIPTION: This snippet shows how to define multiple sound segments within a single audio file using the 'sprite' option and then play a specific segment by its key.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_6

LANGUAGE: javascript
CODE:
```
var sound = new Howl({
  src: ['sounds.webm', 'sounds.mp3'],
  sprite: {
    blast: [0, 3000],
    laser: [4000, 1000],
    winner: [6000, 5000]
  }
});

// Shoot the laser!
sound.play('laser');
```

----------------------------------------

TITLE: Controlling multiple sound instances with Howler.js
DESCRIPTION: This snippet illustrates how the play() method returns a unique Sound ID that can be used with other methods (like fade or rate) to control specific instances of the same sound.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_8

LANGUAGE: javascript
CODE:
```
var sound = new Howl({
  src: ['sound.webm', 'sound.mp3']
});

// Play returns a unique Sound ID that can be passed
// into any method on Howl to control that specific sound.
var id1 = sound.play();
var id2 = sound.play();

// Fade out the first sound and speed up the second.
sound.fade(1, 0, 1000, id1);
sound.rate(1.5, id2);
```

----------------------------------------

TITLE: Streaming audio with Howler.js (HTML5)
DESCRIPTION: This snippet shows how to configure a Howl object to use HTML5 Audio specifically, which is recommended for streaming large or live audio files to avoid waiting for full download.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_4

LANGUAGE: javascript
CODE:
```
var sound = new Howl({
  src: ['stream.mp3'],
  html5: true
});

sound.play();
```

----------------------------------------

TITLE: Handle Play Error and Unlock Event - JavaScript
DESCRIPTION: Illustrates how to handle audio playback errors, particularly those related to mobile/browser unlock requirements. It shows listening for the `onplayerror` event and, upon error, waiting for the `unlock` event using `once` before attempting to play the sound again.

SOURCE: https://github.com/goldfire/howler.js/blob/master/README.md#_snippet_14

LANGUAGE: javascript
CODE:
```
var sound = new Howl({
  src: ['sound.webm', 'sound.mp3'],
  onplayerror: function() {
    sound.once('unlock', function() {
      sound.play();
    });
  }
});

sound.play();
```

----------------------------------------

TITLE: Playing & Pausing Specific Playback howler.js JavaScript
DESCRIPTION: Initiates playback of a sound and returns a unique ID for that specific playback instance. This ID can then be used with methods like `pause` to control only that instance, allowing for multiple simultaneous playbacks of the same sound.

SOURCE: https://github.com/goldfire/howler.js/blob/master/CHANGELOG.md#_snippet_3

LANGUAGE: javascript
CODE:
```
var id = sound.play();
sound.pause(id);
```

----------------------------------------

TITLE: Setting Seek Position howler.js JavaScript
DESCRIPTION: Sets the playback position of a single sound instance. This method replaces the deprecated `pos` method. It takes the desired position in seconds as an argument.

SOURCE: https://github.com/goldfire/howler.js/blob/master/CHANGELOG.md#_snippet_0

LANGUAGE: javascript
CODE:
```
sound.seek(10);
```