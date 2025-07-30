========================
CODE SNIPPETS
========================
TITLE: Web Audio API: latencyHint Interaction Examples
DESCRIPTION: Provides non-normative examples illustrating how `latencyHint` (interactive, balanced, playback) behaves with different `renderSize` values (192, 1024, 2048 frames) at a 48 kHz sample rate, showing the resulting latency.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/explainer/user-selectable-render-size.md#_snippet_7

LANGUAGE: APIDOC
CODE:
```
Examples of renderSize and latencyHint interaction (Non-normative, 48 kHz sample rate):
  - Scenario: Hardware render size = 192 frames; 'balanced' latency = 20 ms; 'playback' latency = 200 ms.
    - For 'interactive': latency will be `192*n` frames (n is 1, 2, 3,..., chosen by UA).
    - For 'balanced' (20 ms): Graph rendered 5 times per callback (`5*192` frames = 960 frames).
    - For 'playback' (200 ms): Graph rendered 50 times per callback (9600 frames).

  - Scenario: Selected render size = 1024 frames.
    - For 'interactive': latency will be `1024*n` frames (n is 1, 2, 3,..., chosen by UA).
    - For 'balanced' (20 ms = 960 frames): Resulting latency will be 1024 frames (21.33 ms) because 960 frames is smaller than 1024 frames.
    - For 'playback' (200 ms = 9600 frames): Resulting latency will be 200 ms because 9600 frames is larger than 1024 frames.

  - Scenario: Selected render size = 2048 frames.
    - For 'interactive': latency will be `2048*n` frames (n is 1, 2, 3,..., chosen by UA).
    - For 'balanced' (20 ms = 960 frames): Resulting latency will be 2048 frames (42.67 ms) because 960 frames is smaller than 2048 frames.
    - For 'playback' (200 ms = 9600 frames): Resulting latency will be 200 ms because 9600 frames is larger than 2048 frames.
```

----------------------------------------

TITLE: Generate HTML Preview of Web Audio API Specification with Bikeshed HTTP API
DESCRIPTION: This command leverages `curl` to send the `index.bs` specification file to the Bikeshed HTTP API, which then generates an HTML preview. The `force=1` flag ensures the file is processed, and the resulting HTML output is saved to `index.html` for local viewing in a web browser.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/CONTRIBUTING.md#_snippet_1

LANGUAGE: bash
CODE:
```
curl https://api.csswg.org/bikeshed/ -F file=@index.bs -F force=1 > index.html
```

----------------------------------------

TITLE: Web Audio API: General Implementation Issues for renderSize
DESCRIPTION: Addresses general implementation complexities introduced by user-selectable `renderSize`, noting that UAs must handle these appropriately for various nodes.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/explainer/user-selectable-render-size.md#_snippet_9

LANGUAGE: APIDOC
CODE:
```
Implementation Issues:
  - Conceptually, this change is relatively simple.
  - Some nodes may have additional complexities due to user-selectable `renderSize`.
  - It is up to the User Agent (UA) to handle these appropriately.
```

----------------------------------------

TITLE: Convolve Command-Line Tool Usage
DESCRIPTION: Documentation for the `convolve` command-line tool, used for post-processing recordings by performing an inverse-convolution. It specifies the required input file, impulse response file, and output file arguments.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/convolution.html#_snippet_2

LANGUAGE: Shell
CODE:
```
% convolve -h\nUsage: convolve input\_file impulse\_response\_file output\_file
```

----------------------------------------

TITLE: Generate Test Tones Command-Line Tool Usage
DESCRIPTION: Documentation for the `generate_testtones` command-line tool, which creates exponential sine-sweep test tones and their inverses for impulse response recording. It details the available options for output file, sample rate, duration, and minimum frequency.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/convolution.html#_snippet_1

LANGUAGE: Shell
CODE:
```
% generate\_testtones -h\nUsage: generate\_testtone\n\t\[-o /Path/To/File/To/Create\] Two files will be created: .tone and .inverse\n\t\[-rate <sample rate>\] sample rate of the generated test tones\n\t\[-duration <duration>\] The duration, in seconds, of the generated files\n\t\[-min\_freq <min\_freq>\] The minimum frequency, in hertz, for the sine sweep
```

----------------------------------------

TITLE: Web Audio API: AnalyserNode Implementation with renderSize
DESCRIPTION: Discusses the `AnalyserNode`'s implementation in the context of `renderSize`, noting that its current specification for power-of-two sizes for time and frequency domain data is likely compatible.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/explainer/user-selectable-render-size.md#_snippet_10

LANGUAGE: APIDOC
CODE:
```
AnalyserNode Implementation:
  - The `AnalyserNode` currently specifies powers of two for the size of both returned time-domain data and frequency-domain data.
  - This existing specification is likely compatible with changes to `renderSize`.
```

----------------------------------------

TITLE: Web Audio API: Security and Privacy with renderSize 'hardware'
DESCRIPTION: Discusses the security and privacy implications of using 'hardware' for `renderSize`, specifically the potential for user fingerprinting due to exposure of hardware capabilities. Notes that UAs can return a different value for privacy reasons.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/explainer/user-selectable-render-size.md#_snippet_8

LANGUAGE: APIDOC
CODE:
```
Security and Privacy Issues:
  - When the user requests `renderSize = "hardware"`, the user's hardware capability can be exposed.
  - This exposure can potentially be used to fingerprint the user.
  - While beneficial for performance to return the exact hardware value, UAs can return a different value for privacy reasons.
```

----------------------------------------

TITLE: Web Audio API: Supported renderSize Values
DESCRIPTION: Outlines the required and recommended `renderSize` values for User Agents. All UAs must support powers of two between 64 and 2048, inclusive. It is highly recommended to support other common sizes like 96, 144, 192, 240 (Android) and 440, 480 (Windows).

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/explainer/user-selectable-render-size.md#_snippet_5

LANGUAGE: APIDOC
CODE:
```
Requirements for renderSize:
  Mandatory: All User Agents must support a `renderSize` that is a power of two between 64 and 2048, inclusive.
  Recommended: Support for other sizes that are not a power of two, particularly common values on Android (e.g., 96, 144, 192, 240) and Windows (e.g., 440, 480 for 10 ms buffers at 44.1 kHz and 48 kHz respectively).
```

----------------------------------------

TITLE: Web Audio API: ConvolverNode Implementation with renderSize
DESCRIPTION: Explains the implementation challenges for `ConvolverNode` when supporting non-power-of-two `renderSize` values. It typically uses power-of-two FFTs, so supporting arbitrary sizes may require more complex algorithms or general FFTs.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/explainer/user-selectable-render-size.md#_snippet_11

LANGUAGE: APIDOC
CODE:
```
ConvolverNode Implementation:
  - For efficiency, the `ConvolverNode` is often implemented using FFTs.
  - Typically, only power-of-two FFTs have been used because the render size was 128.
  - To support user-selectable `renderSize` values (especially those not a power of two), either:
    - More complex algorithms are needed to buffer the data appropriately.
    - More general FFTs are required to support sizes that are not a power of two.
  - It is up to the discretion of the User Agent (UA) to implement this appropriately for all supported `renderSize` values.
```

----------------------------------------

TITLE: Web Audio API: renderSize and latencyHint Interaction
DESCRIPTION: Explains how `renderSize` interacts with `latencyHint` in `AudioContextOptions`. It details how `renderSize` influences the minimum possible latency and how `latencyHint` can increase it. Specific behaviors are described for 'default', 'hardware', and numeric `renderSize` values.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/explainer/user-selectable-render-size.md#_snippet_6

LANGUAGE: APIDOC
CODE:
```
Interaction between renderSize and latencyHint:
  - The exact interaction is up to the User Agent (UA) to implement meaningfully.
  - For UAs that do not double buffer WebAudio's output: `latencyHint` can be 0, independent of `renderSize`.
  - For UAs that do double buffer: `renderSize` chooses the minimum possible latency, and `latencyHint` can increase this appropriately.
  - If `renderSize` is "default": 128 frames are used to render the graph, and `latencyHint` behaves as before.
  - If `renderSize` is "hardware": The graph is rendered using the hardware size. The latency value is chosen appropriately, but the resulting latency cannot be smaller than the hardware size.
  - If `renderSize` is a number: The graph is rendered using the appropriate UA-supported value. The `latencyHint` cannot produce latencies less than this `renderSize`.
```

----------------------------------------

TITLE: Web Audio API Render Size IDL Definitions
DESCRIPTION: Defines new IDL interfaces for user-selectable render size in the Web Audio API. This includes the `AudioContextRenderSizeCategory` enum, the `renderSizeHint` property for `AudioContextOptions` and `OfflineAudioContextOptions` dictionaries, and the `renderSize` property on `BaseAudioContext` to expose the actual render size.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/explainer/user-selectable-render-size.md#_snippet_0

LANGUAGE: IDL
CODE:
```
// New enum
enum AudioContextRenderSizeCategory {
  "default",
  "hardware"
};

dictionary AudioContextOptions {
  (AudioContextLatencyCategory or double) latencyHint = "interactive";
  float sampleRate;

  // New addition
  (AudioContextRenderSizeCategory or unsigned long) renderSizeHint = "default";
};

dictionary OfflineAudioContextOptions {
  unsigned long numberOfChannels = 1;
  required unsigned long length;
  required float sampleRate;
  
  // New addition
  (AudioContextRenderSizeCategory or unsigned long) renderSizeHint = "default";
};

partial interface BaseAudioContext {
  unsigned long renderSize;
};
```

----------------------------------------

TITLE: OfflineAudioContextOptions.renderSizeHint Property Reference
DESCRIPTION: Documents the `renderSizeHint` property within `OfflineAudioContextOptions`. This property has the same meaning, behavior, and constraints as its counterpart in `AudioContextOptions`. However, for an `OfflineAudioContext`, the 'hardware' category value behaves identically to 'default' because there is no physical hardware to adapt to.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/explainer/user-selectable-render-size.md#_snippet_3

LANGUAGE: APIDOC
CODE:
```
OfflineAudioContextOptions:
  renderSizeHint:
    Type: (AudioContextRenderSizeCategory or unsigned long)
    Default: "default"
    Description: This has exactly the same meaning, behavior, and constraints as for an AudioContext. However, for an OfflineContext, the value of "hardware" is the same as "default".
```

----------------------------------------

TITLE: Web Audio API: AudioContext Interface Issues
DESCRIPTION: Documents various issues found with the AudioContext interface in Chrome 91, including problems with `decodeAudioData`, promise handling, context construction, and state consistency.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/test-report.html#_snippet_3

LANGUAGE: APIDOC
CODE:
```
AudioContext Interface Issues:
Chrome 91:
- `decodeAudioData` not working correctly on detached iframe (crbug.com/1060315).
- Promises not handled correctly after iframe has been removed.
- Context construction not handled correctly when document isn't fully active (crbug.com/1060315).
- Context does not start in the "suspended" state (crbug.com/1106380).
- Consistency of processing after resume is flaky (crbug.com/1096493).
```

----------------------------------------

TITLE: Check Web Audio API Specification Errors with Bikeshed HTTP API
DESCRIPTION: This command uses `curl` to send the `index.bs` specification file to the Bikeshed HTTP API for error validation. It forces processing, directs error output to a temporary file, then cleans ANSI escape codes from the output using `sed` before comparing it against a `expected-errs.txt` file using `diff`.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/CONTRIBUTING.md#_snippet_0

LANGUAGE: bash
CODE:
```
curl https://api.csswg.org/bikeshed/ -F file=@index.bs -F force=1 -F output=err -o err && cat err | sed -E 's/\\033\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]//g' | diff -u - expected-errs.txt
```

----------------------------------------

TITLE: Chrome Web Audio API Missing Features
DESCRIPTION: This snippet lists specific Web Audio API interfaces and properties that are currently not implemented in Chrome, as identified by IDL harness tests.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/implementation-report.html#_snippet_0

LANGUAGE: APIDOC
CODE:
```
Missing Features (Chrome):
- MediaStreamTrackSourceNode
- AudioContext.outputLatency
```

----------------------------------------

TITLE: Web Audio API: IDL Harness Test Missing Features
DESCRIPTION: Documents the missing Web Audio API features identified by the IDL Harness tests across Chrome, Firefox, and Safari, including specific interfaces and properties.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/test-report.html#_snippet_0

LANGUAGE: APIDOC
CODE:
```
IDL Harness Test Missing Features:
Chrome 91 Missing:
- MediaStreamTrackSource (crbug.com/679813)
- outputLatency (crbug.com/785409)
Firefox 84 Missing:
- OfflineAudioContext.suspend()
- OfflineAudioContext.resume()
- AudioParam.automationRate
- AudioParam.cancelAndHoldAtTime()
- AudioListener.positionX
- AudioListener.positionY
- AudioListener.positionZ
- AudioListener.forwardX
- AudioListener.forwardY
- AudioListener.forwardZ
- AudioListener.upX
- AudioListener.upY
- AudioListener.upZ
Safari 115 Missing:
- audioWorklet
- outputLatency
- MediaStreamTrackSource
```

----------------------------------------

TITLE: Web Audio API: AudioWorklet Interface Issues
DESCRIPTION: Outlines several identified issues and flakiness with the AudioWorklet interface in Chrome 91, including problems with process getters, microtask checkpoints, port construction, and message port stability.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/test-report.html#_snippet_4

LANGUAGE: APIDOC
CODE:
```
AudioWorklet Interface Issues:
Chrome 91:
- Some tests appear to be flaky. Or run correctly locally but not on the wpt bots.
- Process getters not implemented correctly?
- Microtask checkpoints not handled correctly?
- Port construction broken?
- Suspended context message port seems flaky?
```

----------------------------------------

TITLE: AudioContextRenderSizeCategory Enumeration Reference
DESCRIPTION: Provides detailed descriptions for the `AudioContextRenderSizeCategory` enum values. The 'default' value sets the rendering size to 128 frames. The 'hardware' value selects a size appropriate for the current output device for `AudioContext`, potentially aligning with native buffer sizes, while for `OfflineAudioContext`, 'hardware' behaves identically to 'default' due to the absence of physical hardware.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/explainer/user-selectable-render-size.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
AudioContextRenderSizeCategory:
  "default": Default rendering size of 128 frames
  "hardware": Use an appropriate value for the hardware for an AudioContext or the default for an OfflineAudioContext

AudioContext:
  For an AudioContext, the "hardware" category means a size is chosen that is appropriate to the current output device. For example, selecting "hardware" may result in a size of 192 frames for the Android phone used in the example.

OfflineAudioContext:
  For an OfflineAudioContext, there's no concept of "hardware", so using "hardware" is the same as "default".
```

----------------------------------------

TITLE: Firefox Web Audio API Missing Features
DESCRIPTION: This snippet details the Web Audio API methods, properties, and constructors that are not yet supported in Firefox, based on IDL harness test results. Note that AudioProcessingEvent is deprecated.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/implementation-report.html#_snippet_1

LANGUAGE: APIDOC
CODE:
```
Missing Features (Firefox):
- OfflineAudioContext.suspend()
- OfflineAudioContext.resume()
- AudioParam.automationRate
- AudioParam.cancelAndHoldAtTime
- AudioListener.positionX
- AudioListener.positionY
- AudioListener.positionZ
- AudioListener.forwardX
- AudioListener.forwardY
- AudioListener.forwardZ
- AudioListener.upX
- AudioListener.upY
- AudioListener.upZ
- AudioProcessingEvent constructor (deprecated)
```

----------------------------------------

TITLE: BaseAudioContext renderSize Attribute Definition
DESCRIPTION: Documents the new `renderSize` attribute of `BaseAudioContext`, detailing its purpose as the actual number of frames used for rendering, its read-only nature, and its type. It also notes that `renderSize` cannot be selected with the 3-argument `OfflineAudioContext` constructor.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/explainer/user-selectable-render-size.md#_snippet_4

LANGUAGE: APIDOC
CODE:
```
BaseAudioContext:
  renderSize: unsigned long, readonly
    Description: The actual number of frames used to render the graph. This may differ from the value requested by `renderSizeHint`.
    Constraint: Explicitly not supported for selection when using the 3-argument constructor for `OfflineAudioContext`.
```

----------------------------------------

TITLE: Web Audio API: Processing Model Issues
DESCRIPTION: Details the identified issues with the Web Audio API's processing model, specifically concerning cycle handling in Chrome 91.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/test-report.html#_snippet_1

LANGUAGE: APIDOC
CODE:
```
Processing Model Issues:
Chrome 91:
- Cycles without and without delay nodes are not handled correctly (crbug.com/1021295)
```

----------------------------------------

TITLE: FFTConvolver Component API Description
DESCRIPTION: Describes the conceptual `FFTConvolver` building block, outlining its capabilities for short convolutions, inherent latency, and how it can be utilized for longer convolutions by combining multiple instances.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/convolution.html#_snippet_0

LANGUAGE: APIDOC
CODE:
```
FFTConvolver Component:
  Purpose: Performs short convolutions efficiently using FFTs.
  Properties:
    - fftSizeN: Minimum size is twice the length of the short impulse response.
    - latency: N/2 sample-frames.
  Usage:
    - Not suitable for very long convolutions.
    - Multiple instances can be chained for extremely long convolutions.
```

----------------------------------------

TITLE: Web Audio API: AudioBufferSourceNode Interface Issues
DESCRIPTION: Highlights issues related to the AudioBufferSourceNode interface, specifically concerning active processing implementation in Chrome 91.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/test-report.html#_snippet_2

LANGUAGE: APIDOC
CODE:
```
AudioBufferSourceNode Interface Issues:
Chrome 91:
- Active processing not implemented correctly (crbug.com/1073247)
```

----------------------------------------

TITLE: AudioContextOptions.renderSizeHint Property Reference
DESCRIPTION: Documents the `renderSizeHint` property within `AudioContextOptions`. This property accepts an `AudioContextRenderSizeCategory` enum value or an `unsigned long` to specify an exact render size. Supported `unsigned long` values include powers of two between 64 and 2048. If an unsupported value is requested, the User Agent will round it up to the next smallest supported value, clamping to the maximum if it exceeds the limit.

SOURCE: https://github.com/webaudio/web-audio-api/blob/main/explainer/user-selectable-render-size.md#_snippet_2

LANGUAGE: APIDOC
CODE:
```
AudioContextOptions:
  renderSizeHint:
    Type: (AudioContextRenderSizeCategory or unsigned long)
    Default: "default"
    Description: Identifies the render size for the context. The preferred value of the renderSizeHint is one of the values from the AudioContextRenderSizeCategory. However, an unsigned long value may be given to request an exact number of frames to use for rendering. Powers of two between 64 and 2048, inclusive MUST be supported. It is recommended that UA's support values that are not a power of two. If the requested value is not supported by the UA, the UA MUST round the value up to the next smallest value that is supported. If this exceeds the maximum supported value, it is clamped to the max.
```