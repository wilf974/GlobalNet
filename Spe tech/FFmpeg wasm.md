========================
CODE SNIPPETS
========================
TITLE: Starting the Development Server (Bash)
DESCRIPTION: This command initiates the local development server, which hosts the ffmpeg.wasm browser examples. Once the server is running, users can access the examples by navigating to http://localhost:8080 in their web browser.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/vanilla-app/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
npm start
```

----------------------------------------

TITLE: Starting SolidStart Development Server (Bash)
DESCRIPTION: These commands are used to start the development server for a SolidStart project after dependencies have been installed. `npm run dev` starts the server, and adding `-- --open` automatically opens the application in a new browser tab, streamlining the development workflow.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/solidstart-app/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

----------------------------------------

TITLE: Starting Svelte Development Server (Bash)
DESCRIPTION: This snippet shows how to start the development server for a Svelte project. It includes options to simply run the server or to automatically open the application in a new browser tab.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/sveltekit-app/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

----------------------------------------

TITLE: Starting Next.js Development Server - Bash
DESCRIPTION: This snippet provides the command-line instructions to start the development server for a Next.js application. It shows options for `npm`, `yarn`, and `pnpm` to run the `dev` script, which typically makes the application accessible at `http://localhost:3000`.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/nextjs-app/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm run dev
# or
yarn dev
# or
pnpm dev
```

----------------------------------------

TITLE: Installing Project Dependencies with npm
DESCRIPTION: This command installs all required project dependencies listed in the `package.json` file. It is a fundamental step to prepare the project environment after cloning the repository.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/vue-vite-app/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
npm install
```

----------------------------------------

TITLE: Downloading ffmpeg.wasm Assets (Bash)
DESCRIPTION: This command downloads all necessary assets for the ffmpeg.wasm browser examples from npm. It is a prerequisite step that must be completed before attempting to run any of the examples.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/vanilla-app/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm run download
```

----------------------------------------

TITLE: Building @ffmpeg/core Production (Multithread) using Make
DESCRIPTION: This command initiates a production build of the @ffmpeg/core package, configured for multithreaded execution. It requires Docker 23.0+ and `make` to be installed. The output is located in /packages/core-mt.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/contribution/core.md#_snippet_3

LANGUAGE: bash
CODE:
```
$ make prd-mt
```

----------------------------------------

TITLE: Building @ffmpeg/core Production (Single Thread) using Make
DESCRIPTION: This command initiates a production build of the @ffmpeg/core package, optimized for single-threaded execution. It requires Docker 23.0+ and `make` to be installed. The output is located in /packages/core.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/contribution/core.md#_snippet_2

LANGUAGE: bash
CODE:
```
$ make prd
```

----------------------------------------

TITLE: Starting Development Server with Hot-Reload
DESCRIPTION: This command initiates the development server, typically configured by Vite, enabling hot-reloading for efficient development. It compiles and serves the application locally for testing and iteration.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/vue-vite-app/README.md#_snippet_1

LANGUAGE: Shell
CODE:
```
npm run dev
```

----------------------------------------

TITLE: Starting Development Server with npm for @ffmpeg/util
DESCRIPTION: This command initiates the development environment for the @ffmpeg/util package, allowing developers to work on the project with features like live reloading.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/contribution/util.md#_snippet_0

LANGUAGE: bash
CODE:
```
$ npm run dev
```

----------------------------------------

TITLE: Building Svelte App for Production (Bash)
DESCRIPTION: This snippet provides the command to create a production-ready build of the Svelte application. The output is optimized for deployment.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/sveltekit-app/README.md#_snippet_2

LANGUAGE: bash
CODE:
```
npm run build
```

----------------------------------------

TITLE: Building @ffmpeg/core Dev (Single Thread) using Make
DESCRIPTION: This command initiates a development build of the @ffmpeg/core package, optimized for single-threaded execution. It requires Docker 23.0+ and `make` to be installed. The output is located in /packages/core.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/contribution/core.md#_snippet_0

LANGUAGE: bash
CODE:
```
$ make dev
```

----------------------------------------

TITLE: Initializing a SolidStart Project (Bash)
DESCRIPTION: These commands initialize a new SolidStart project using the `npm init solid` command. The first command creates a project in the current directory, while the second creates it in a specified subdirectory 'my-app'. This is the initial step for any new SolidStart application.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/solidstart-app/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
# create a new project in the current directory
npm init solid@latest

# create a new project in my-app
npm init solid@latest my-app
```

----------------------------------------

TITLE: Building @ffmpeg/core Dev (Multithread) using Make
DESCRIPTION: This command initiates a development build of the @ffmpeg/core package, configured for multithreaded execution. It requires Docker 23.0+ and `make` to be installed. The output is located in /packages/core-mt.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/contribution/core.md#_snippet_1

LANGUAGE: bash
CODE:
```
$ make dev-mt
```

----------------------------------------

TITLE: Running Development Environment for @ffmpeg/ffmpeg (Bash)
DESCRIPTION: This command starts the development server or process for the @ffmpeg/ffmpeg project, enabling live reloading and debugging.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/contribution/ffmpeg.md#_snippet_0

LANGUAGE: bash
CODE:
```
$ npm run dev
```

----------------------------------------

TITLE: Creating a New Svelte Project (Bash)
DESCRIPTION: This snippet demonstrates how to initialize a new Svelte project using `npm create svelte@latest`. It shows commands for creating a project in the current directory or a specified subdirectory.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/sveltekit-app/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

----------------------------------------

TITLE: Starting Local Development Server
DESCRIPTION: This command initiates a local development server for the Docusaurus website. It automatically opens a browser window and provides live reloading for most code changes, facilitating rapid development.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/README.md#_snippet_1

LANGUAGE: Shell
CODE:
```
$ npm start
```

----------------------------------------

TITLE: Installing Node.js Dependencies
DESCRIPTION: This command installs all required Node.js dependencies for the Docusaurus website project. It should be run after cloning the repository to set up the development environment.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
$ npm install
```

----------------------------------------

TITLE: Installing ffmpeg.wasm with Yarn
DESCRIPTION: Adds the `@ffmpeg/ffmpeg` and `@ffmpeg/util` packages to a project's dependencies using the Yarn package manager. This command fetches and installs the required libraries to enable ffmpeg.wasm's functionality for multimedia manipulation within a web application.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/getting-started/installation.md#_snippet_1

LANGUAGE: bash
CODE:
```
yarn add @ffmpeg/ffmpeg @ffmpeg/util
```

----------------------------------------

TITLE: Installing ffmpeg.wasm with npm
DESCRIPTION: Installs the core `@ffmpeg/ffmpeg` and utility `@ffmpeg/util` packages using the npm package manager. These packages are fundamental for integrating ffmpeg.wasm into a project, providing the necessary components for video and audio processing in the browser.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/getting-started/installation.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

----------------------------------------

TITLE: Initializing Mocha and Chai for Unit Testing - JavaScript
DESCRIPTION: This snippet initializes the Mocha test framework in 'bdd' (Behavior-Driven Development) mode and assigns Chai's 'expect' assertion library to the global 'window.expect' object. Finally, it runs the Mocha tests. This setup is crucial for executing unit tests in a browser environment.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/packages/util/tests/ffmpeg.test.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
mocha.setup('bdd'); window.expect = chai.expect; mocha.run();
```

----------------------------------------

TITLE: Compiling and Minifying for Production
DESCRIPTION: This command performs type-checking, compiles, and minifies the application's source code, optimizing it for production deployment. The output is ready for hosting and designed for optimal performance.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/vue-vite-app/README.md#_snippet_2

LANGUAGE: Shell
CODE:
```
npm run build
```

----------------------------------------

TITLE: Running Development Server with Angular CLI
DESCRIPTION: This command starts a local development server for the Angular application. It enables live reloading upon source file changes and is accessible via `http://localhost:4200/`.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/angular-app/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
ng serve
```

----------------------------------------

TITLE: Linting Code with ESLint
DESCRIPTION: This command executes ESLint to analyze the project's codebase for potential errors, enforce coding style guidelines, and ensure adherence to best practices. It helps maintain code quality and consistency.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/vue-vite-app/README.md#_snippet_3

LANGUAGE: Shell
CODE:
```
npm run lint
```

----------------------------------------

TITLE: Rendering Command Editor with Initial Arguments (React)
DESCRIPTION: This React snippet renders the `Editor` component, which allows users to input and modify ffmpeg commands. It pre-populates the editor with an example command to convert 'video.avi' to 'video.mp4', demonstrating how arguments are passed to ffmpeg.wasm for processing.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/src/pages/playground.md#_snippet_4

LANGUAGE: JavaScript
CODE:
```
{() => {
      const Editor = require('@site/src/components/Playground/Workspace/Editor').default;
      return (
        <Editor args={JSON.stringify(["-i", "video.avi", "video.mp4"], null, 2)} />
      );
    }}
```

----------------------------------------

TITLE: Configuring Mocha and Chai for FFmpeg Unit Tests - JavaScript
DESCRIPTION: This snippet initializes the test environment for FFmpeg.wasm unit tests. It sets a global FFmpeg type, configures Mocha for BDD style tests with a 60-second timeout, exposes Chai's `expect` assertion library, and finally runs the tests.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/tests/ffmpeg-core-st.test.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
window.FFMPEG_TYPE = "st"; mocha.setup("bdd"); mocha.timeout(60000); window.expect = chai.expect; mocha.run();
```

----------------------------------------

TITLE: Configuring FFmpeg.wasm and Mocha for Unit Tests - JavaScript
DESCRIPTION: This snippet initializes global variables for FFmpeg.wasm, setting its type and the URL for the core JavaScript file. It then configures the Mocha test framework for BDD style, sets a timeout, and integrates Chai for assertions before running the tests.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/tests/ffmpeg-st.test.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
window.FFMPEG_TYPE = "st"; window.CORE_URL = "http://localhost:3000/packages/core/dist/umd/ffmpeg-core.js"; mocha.setup("bdd"); mocha.timeout(60000); window.expect = chai.expect; mocha.run();
```

----------------------------------------

TITLE: Configuring Mocha and Chai for FFmpeg.wasm Unit Tests - JavaScript
DESCRIPTION: This snippet initializes the Mocha test framework in 'bdd' (Behavior-Driven Development) interface style and sets a timeout of 60 seconds for tests. It also assigns the Chai 'expect' assertion library to the global window object, making it available for assertions, and finally triggers the execution of the tests. It also sets a global `FFMPEG_TYPE` variable specific to FFmpeg.wasm.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/tests/ffmpeg-core-mt.test.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
window.FFMPEG_TYPE = "mt"; mocha.setup("bdd"); mocha.timeout(60000); window.expect = chai.expect; mocha.run();
```

----------------------------------------

TITLE: Configuring ESLint Parser Options for Type-Aware Rules - JavaScript
DESCRIPTION: This snippet demonstrates how to configure the `parserOptions` property within an ESLint configuration file. It sets the ECMAScript version, module source type, and specifies the paths to TypeScript configuration files, which is essential for enabling type-aware linting rules.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/react-vite-app/README.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

----------------------------------------

TITLE: Transcoding Video with FFmpeg.wasm in JavaScript
DESCRIPTION: This JavaScript snippet demonstrates how to initialize FFmpeg.wasm, load its core, handle user file input, write the file to FFmpeg's virtual file system, execute a transcoding command, read the output file, and display the transcoded video. It includes event listeners for logging and progress updates, and uses `fetchFile` to prepare the input file.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/tests/index.html#_snippet_0

LANGUAGE: javascript
CODE:
```
import { FFmpeg } from "/packages/ffmpeg/dist/esm/index.js";
import { fetchFile } from "/packages/util/dist/esm/index.js";
let ffmpeg = null;
const transcode = async ({ target: { files } }) => {
  const message = document.getElementById('message');
  if (ffmpeg === null) {
    ffmpeg = new FFmpeg();
    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    })
    ffmpeg.on("progress", ({ progress }) => {
      message.innerHTML = `${progress * 100} %`;
    });
    await ffmpeg.load({ coreURL: "/packages/core/dist/esm/ffmpeg-core.js", });
  }
  const { name } = files[0];
  await ffmpeg.writeFile(name, await fetchFile(files[0]));
  message.innerHTML = 'Start transcoding';
  await ffmpeg.exec(['-i', name, 'output.mp4']);
  message.innerHTML = 'Complete transcoding';
  const data = await ffmpeg.readFile('output.mp4');
  const video = document.getElementById('output-video');
  video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
}
const elm = document.getElementById('uploader');
elm.addEventListener('change', transcode);
```

----------------------------------------

TITLE: Accessing Angular CLI Help
DESCRIPTION: This command displays comprehensive help information for the Angular CLI. It provides a quick reference for all available commands and their usage options.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/angular-app/README.md#_snippet_6

LANGUAGE: Shell
CODE:
```
ng help
```

----------------------------------------

TITLE: Building Angular Project with Angular CLI
DESCRIPTION: This command compiles the Angular project into deployable artifacts. The output files are stored in the `dist/` directory, ready for production deployment.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/angular-app/README.md#_snippet_3

LANGUAGE: Shell
CODE:
```
ng build
```

----------------------------------------

TITLE: Building Static Website Content
DESCRIPTION: This command compiles the Docusaurus website into static content, generating files in the `build` directory. The output can then be served by any static content hosting service for production deployment.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/README.md#_snippet_2

LANGUAGE: Shell
CODE:
```
$ npm run build
```

----------------------------------------

TITLE: Adding Text Overlay to Video with ffmpeg.wasm (JSX)
DESCRIPTION: This example illustrates how to overlay text onto a video using ffmpeg.wasm. It loads the ffmpeg-core and a font file ('arial.ttf'), then uses the 'drawtext' filter to add 'ffmpeg.wasm' text at a specified position and style. The output is an MP4 file with the text overlay.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/getting-started/usage.md#_snippet_5

LANGUAGE: JSX
CODE:
```
// import { FFmpeg } from '@ffmpeg/ffmpeg';
// import { fetchFile } from '@ffmpeg/util';
function() {
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);
    const messageRef = useRef(null);

    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('log', ({ message }) => {
            messageRef.current.innerHTML = message;
            console.log(message);
        });
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setLoaded(true);
    }

    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
        await ffmpeg.writeFile('input.webm', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm'));
        await ffmpeg.writeFile('arial.ttf', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf'));
        await ffmpeg.exec([
            '-i',
            'input.webm',
            '-vf',
            'drawtext=fontfile=/arial.ttf:text=\'ffmpeg.wasm\':x=10:y=10:fontsize=24:fontcolor=white',
            'output.mp4',
        ]);
        const data = await ffmpeg.readFile('output.mp4');
        videoRef.current.src =
            URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    }

    return (loaded
        ? (
            <>
                <video ref={videoRef} controls></video><br/>
                <button onClick={transcode}>Transcode webm to mp4 with text</button>
                <p ref={messageRef}></p>
                <p>Open Developer Tools (Ctrl+Shift+I) to View Logs</p>
            </>
        )
        : (
            <button onClick={load}>Load ffmpeg-core (~31 MB)</button>
        )
    );
}
```

----------------------------------------

TITLE: Publishing @ffmpeg/ffmpeg Package (Bash)
DESCRIPTION: This command publishes the @ffmpeg/ffmpeg package to the npm registry, making it available for public use. It should be executed from the package's root directory.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/contribution/ffmpeg.md#_snippet_3

LANGUAGE: bash
CODE:
```
$ npm publish
```

----------------------------------------

TITLE: Deploying Website via SSH
DESCRIPTION: This command deploys the Docusaurus website to GitHub Pages using SSH for authentication. It's a convenient method for building and pushing the site to the `gh-pages` branch when SSH is configured.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/README.md#_snippet_3

LANGUAGE: Shell
CODE:
```
$ USE_SSH=true npm run deploy
```

----------------------------------------

TITLE: Configuring FFmpeg and Mocha for Unit Tests (JavaScript)
DESCRIPTION: This snippet initializes global variables for FFmpeg, sets up the Mocha testing framework in BDD style, configures a timeout, and integrates Chai for assertions. It then runs the Mocha tests, preparing the environment for subsequent unit tests.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/tests/ffmpeg-mt.test.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
window.FFMPEG_TYPE = "mt"; window.CORE_URL = "http://localhost:3000/packages/core-mt/dist/umd/ffmpeg-core.js"; mocha.setup("bdd"); mocha.timeout(60000); window.expect = chai.expect; mocha.run();
```

----------------------------------------

TITLE: Running End-to-End Tests with Angular CLI
DESCRIPTION: This command initiates the execution of end-to-end tests for the application. It requires a pre-installed package that implements E2E testing capabilities.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/angular-app/README.md#_snippet_5

LANGUAGE: Shell
CODE:
```
ng e2e
```

----------------------------------------

TITLE: Building @ffmpeg/ffmpeg Project (Bash)
DESCRIPTION: This command transpiles the TypeScript source code of @ffmpeg/ffmpeg into JavaScript, preparing it for distribution or deployment.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/contribution/ffmpeg.md#_snippet_1

LANGUAGE: bash
CODE:
```
$ npm run build
```

----------------------------------------

TITLE: Instantiating FFmpeg in JavaScript
DESCRIPTION: The `createFFmpeg()` function is replaced by a class constructor `new FFmpeg()` in version 0.12+. Arguments previously passed to `createFFmpeg()` are now passed to the `ffmpeg.load()` method.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/migration.md#_snippet_1

LANGUAGE: JavaScript
CODE:
```
createFFmpeg()
```

LANGUAGE: JavaScript
CODE:
```
new FFmpeg()
```

----------------------------------------

TITLE: Building @ffmpeg/util from TypeScript to JavaScript
DESCRIPTION: This command transpiles the TypeScript source code of the @ffmpeg/util package into JavaScript, preparing it for deployment or consumption.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/contribution/util.md#_snippet_1

LANGUAGE: bash
CODE:
```
$ npm run build
```

----------------------------------------

TITLE: Rendering File System Manager with Initial Nodes (React)
DESCRIPTION: This React snippet renders the `FileSystemManager` component, which provides an interface for interacting with ffmpeg.wasm's in-memory file system. It initializes the file system with a predefined set of directory and file nodes, including a sample 'video.avi' for demonstration.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/src/pages/playground.md#_snippet_3

LANGUAGE: JavaScript
CODE:
```
{() => {
      const FileSystemManager = require('@site/src/components/Playground/Workspace/FileSystemManager').default;
      return (
        <FileSystemManager
          nodes={[
            {name: "..", isDir: true},
            {name: "tmp", isDir: true},
            {name: "home", isDir: true},
            {name: "dev", isDir: true},
            {name: "proc", isDir: true},
            {name: "video.avi", isDir: false},
          ]}
        />
      );
    }}
```

----------------------------------------

TITLE: Transcoding Video with Progress using FFmpeg.wasm (JavaScript)
DESCRIPTION: This snippet illustrates how to transcode a video file (webm to mp4) using FFmpeg.wasm while displaying the transcoding progress. It initializes FFmpeg, loads necessary modules, and sets up an event listener for the `progress` event to update a UI element with the current percentage and transcoded time. It then writes an input file, executes the transcoding command, reads the output, and displays it. Note that the `progress` feature is experimental and may not work in all scenarios.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/getting-started/usage.md#_snippet_3

LANGUAGE: JavaScript
CODE:
```
// import { FFmpeg } from '@ffmpeg/ffmpeg';
// import { fetchFile } from '@ffmpeg/util';
function() {
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);
    const messageRef = useRef(null);

    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        const ffmpeg = ffmpegRef.current;
        // Listen to progress event instead of log.
        ffmpeg.on('progress', ({ progress, time }) => {
            messageRef.current.innerHTML = `${progress * 100} % (transcoded time: ${time / 1000000} s)`;
        });
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setLoaded(true);
    }

    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
        await ffmpeg.writeFile('input.webm', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm'));
        await ffmpeg.exec(['-i', 'input.webm', 'output.mp4']);
        const data = await ffmpeg.readFile('output.mp4');
        videoRef.current.src =
            URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    }

    return (loaded
        ? (
            <>
                <video ref={videoRef} controls></video><br/>
                <button onClick={transcode}>Transcode webm to mp4</button>
                <p ref={messageRef}></p>
            </>
        )
        : (
            <button onClick={load}>Load ffmpeg-core (~31 MB)</button>
        )
    );
}
```

----------------------------------------

TITLE: Deploying Website without SSH
DESCRIPTION: This command deploys the Docusaurus website to GitHub Pages without using SSH, requiring the GitHub username to be specified. It builds the website and pushes it to the `gh-pages` branch, suitable when SSH is not preferred or available.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/README.md#_snippet_4

LANGUAGE: Shell
CODE:
```
$ GIT_USER=<Your GitHub username> npm run deploy
```

----------------------------------------

TITLE: Importing Material-UI Components for Documentation Site (JavaScript)
DESCRIPTION: This JavaScript snippet imports various Material-UI components (Table, TableBody, TableCell, etc.) and a custom MuiThemeProvider. These imports are essential for rendering the user interface elements, specifically tables, within the documentation site itself, rather than being part of the `ffmpeg.wasm` library's core functionality.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/overview.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
import MuiThemeProvider from "@site/src/components/common/MuiThemeProvider";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
```

----------------------------------------

TITLE: Importing fetchFile Utility in JavaScript
DESCRIPTION: The `fetchFile` utility function has been moved from the `@ffmpeg/ffmpeg` package to the new `@ffmpeg/util` package in version 0.12+.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/migration.md#_snippet_9

LANGUAGE: JavaScript
CODE:
```
import { fetchFile } from '@ffmpeg/ffmpeg'
```

LANGUAGE: JavaScript
CODE:
```
import { fetchFile } from '@ffmpeg/util'
```

----------------------------------------

TITLE: Linting Code for @ffmpeg/util with npm
DESCRIPTION: This command executes linting checks on the @ffmpeg/util package's source code to ensure adherence to coding standards and identify potential issues.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/contribution/util.md#_snippet_2

LANGUAGE: bash
CODE:
```
$ npm run lint
```

----------------------------------------

TITLE: Transcoding Video to MP4 with FFmpeg.wasm in JavaScript
DESCRIPTION: This snippet demonstrates how to initialize FFmpeg.wasm, load a video file from user input, transcode it to MP4 format using `ffmpeg.exec()`, and then display the transcoded video in a `<video>` element. It includes progress and log event handling, and uses `fetchFile` for file handling. Prerequisites include the FFmpeg.wasm library and an HTML structure with elements like 'message', 'output-video', and 'uploader'.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/vanilla-app/public/transcode.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
const { fetchFile } = FFmpegUtil;
const { FFmpeg } = FFmpegWASM;
let ffmpeg = null;
const transcode = async ({ target: { files } }) => {
  const message = document.getElementById('message');
  if (ffmpeg === null) {
    ffmpeg = new FFmpeg();
    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    })
    ffmpeg.on("progress", ({ progress, time }) => {
      message.innerHTML = `${progress * 100} %, time: ${time / 1000000} s`;
    });
    await ffmpeg.load({
      coreURL: "/assets/core/package/dist/umd/ffmpeg-core.js"
    });
  }
  const { name } = files[0];
  await ffmpeg.writeFile(name, await fetchFile(files[0]));
  message.innerHTML = 'Start transcoding';
  console.time('exec');
  await ffmpeg.exec(['-i', name, 'output.mp4']);
  console.timeEnd('exec');
  message.innerHTML = 'Complete transcoding';
  const data = await ffmpeg.readFile('output.mp4');
  const video = document.getElementById('output-video');
  video.src = URL.createObjectURL(new Blob([data.buffer], {
    type: 'video/mp4'
  }));
}
const elm = document.getElementById('uploader');
elm.addEventListener('change', transcode);
```

----------------------------------------

TITLE: Running Unit Tests with Angular CLI and Karma
DESCRIPTION: This command executes the unit tests configured for the Angular project. It typically uses Karma as the test runner to provide immediate feedback on code functionality.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/angular-app/README.md#_snippet_4

LANGUAGE: Shell
CODE:
```
ng test
```

----------------------------------------

TITLE: Generating Angular Component with Angular CLI
DESCRIPTION: This command is used to generate a new Angular component, streamlining the creation of new UI elements within the project structure.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/angular-app/README.md#_snippet_1

LANGUAGE: Shell
CODE:
```
ng generate component component-name
```

----------------------------------------

TITLE: Transcoding Video to MP4 using FFmpeg.wasm
DESCRIPTION: This JavaScript snippet demonstrates how to initialize FFmpeg.wasm, load a video file from user input, execute a transcoding command to convert it to MP4 (x264), and display the resulting video. It includes progress and log event listeners for user feedback during the transcoding process.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/vanilla-app/public/transcode.esm.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
import { FFmpeg } from "/assets/ffmpeg/package/dist/esm/index.js";
import { fetchFile } from "/assets/util/package/dist/esm/index.js";

let ffmpeg = null;

const transcode = async ({ target: { files } }) => {
  const message = document.getElementById('message');
  if (ffmpeg === null) {
    ffmpeg = new FFmpeg();
    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    })
    ffmpeg.on("progress", ({ progress }) => {
      message.innerHTML = `${progress * 100} %`;
    });
    await ffmpeg.load({ coreURL: "/assets/core/package/dist/esm/ffmpeg-core.js", });
  }
  const { name } = files[0];
  await ffmpeg.writeFile(name, await fetchFile(files[0]));
  message.innerHTML = 'Start transcoding';
  await ffmpeg.exec(['-i', name, 'output.mp4']);
  message.innerHTML = 'Complete transcoding';
  const data = await ffmpeg.readFile('output.mp4');
  const video = document.getElementById('output-video');
  video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
}

const elm = document.getElementById('uploader');
elm.addEventListener('change', transcode);
```

----------------------------------------

TITLE: Linting @ffmpeg/ffmpeg Project (Bash)
DESCRIPTION: This command runs linting checks on the @ffmpeg/ffmpeg project's codebase to enforce code style and identify potential errors or anti-patterns.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/contribution/ffmpeg.md#_snippet_2

LANGUAGE: bash
CODE:
```
$ npm run lint
```

----------------------------------------

TITLE: Generating Various Angular Schematics with Angular CLI
DESCRIPTION: This command provides a versatile way to scaffold different Angular elements, including directives, pipes, services, classes, guards, interfaces, enums, or modules, based on the specified type.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/angular-app/README.md#_snippet_2

LANGUAGE: Shell
CODE:
```
ng generate directive|pipe|service|class|guard|interface|enum|module
```

----------------------------------------

TITLE: Concatenating Multiple Video Files using FFmpeg.WASM in JavaScript
DESCRIPTION: This JavaScript snippet demonstrates how to initialize FFmpeg.WASM, load video files from user input, concatenate them using FFmpeg's `concat` demuxer, and display the resulting video. It sets up event listeners for progress and log messages, writes input files and a concatenation list to the FFmpeg virtual file system, executes the `ffmpeg` command, and finally reads the output to create a playable video blob. Dependencies include `FFmpegUtil` and `FFmpegWASM`.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/vanilla-app/public/concatDemuxer.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
const { fetchFile } = FFmpegUtil;
const { FFmpeg } = FFmpegWASM;
let ffmpeg = null;

const transcode = async ({ target: { files } }) => {
  const message = document.getElementById("message");
  if (ffmpeg === null) {
    ffmpeg = new FFmpeg();
    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    })
    ffmpeg.on("progress", ({ progress, time }) => {
      message.innerHTML = `${time / 1000000} s`;
    });
    await ffmpeg.load({ coreURL: "/assets/core/package/dist/umd/ffmpeg-core.js", });
  }
  message.innerHTML = "Start Concating";
  const inputPaths = [];
  for (const file of files) {
    const { name } = file;
    ffmpeg.writeFile(name, await fetchFile(file));
    inputPaths.push(`file ${name}`);
  }
  await ffmpeg.writeFile('concat_list.txt', inputPaths.join('\n'));
  await ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', 'concat_list.txt', 'output.mp4']);
  message.innerHTML = "Complete Concating";
  const data = await ffmpeg.readFile('output.mp4');
  const video = document.getElementById("output-video");
  video.src = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );
};

const elm = document.getElementById("uploader");
elm.addEventListener("change", transcode);
```

----------------------------------------

TITLE: Loading FFmpeg Core in JavaScript
DESCRIPTION: The `ffmpeg.load()` method remains the same in version 0.12+ for loading the FFmpeg core. This step is essential before performing any operations.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/migration.md#_snippet_2

LANGUAGE: JavaScript
CODE:
```
await ffmpeg.load()
```

LANGUAGE: JavaScript
CODE:
```
await ffmpeg.load()
```

----------------------------------------

TITLE: Transcoding WebM to MP4 (Single-thread) with ffmpeg.wasm in JavaScript
DESCRIPTION: This snippet demonstrates how to load the single-threaded ffmpeg.wasm core and transcode a WebM video file to MP4. It initializes the FFmpeg instance, sets up logging, loads the core and WASM modules from a CDN, writes the input file, executes the transcoding command, and reads the output file to display it in a video element. Dependencies include `@ffmpeg/ffmpeg` and `@ffmpeg/util`.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/getting-started/usage.md#_snippet_0

LANGUAGE: JSX
CODE:
```
// import { FFmpeg } from '@ffmpeg/ffmpeg';
// import { fetchFile, toBlobURL } from '@ffmpeg/util';
function() {
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);
    const messageRef = useRef(null);

    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('log', ({ message }) => {
            messageRef.current.innerHTML = message;
            console.log(message);
        });
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setLoaded(true);
    }

    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
        await ffmpeg.writeFile('input.webm', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm'));
        await ffmpeg.exec(['-i', 'input.webm', 'output.mp4']);
        const data = await ffmpeg.readFile('output.mp4');
        videoRef.current.src =
            URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    }

    return (loaded
        ? (
            <>
                <video ref={videoRef} controls></video><br/>
                <button onClick={transcode}>Transcode webm to mp4</button>
                <p ref={messageRef}></p>
                <p>Open Developer Tools (Ctrl+Shift+I) to View Logs</p>
            </>
        )
        : (
            <button onClick={load}>Load ffmpeg-core (~31 MB)</button>
        )
    );
}
```

----------------------------------------

TITLE: Transcoding Video to MP4 with FFmpeg.wasm in JavaScript
DESCRIPTION: This snippet demonstrates how to initialize FFmpeg.wasm, handle file uploads, display transcoding progress, execute FFmpeg commands to convert a video to MP4, and then play the resulting video in the browser. It uses `FFmpeg` and `fetchFile` from external modules and attaches the transcoding logic to a file input's change event.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/vanilla-app/public/transcode-mt.esm.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
import { FFmpeg } from "/assets/ffmpeg/package/dist/esm/index.js"; import { fetchFile } from "/assets/util/package/dist/esm/index.js"; let ffmpeg = null; const transcode = async ({ target: { files } }) => { const message = document.getElementById('message'); if (ffmpeg === null) { ffmpeg = new FFmpeg(); ffmpeg.on("log", ({ message }) => { console.log(message); }) ffmpeg.on("progress", ({ progress }) => { message.innerHTML = `${progress * 100} %`; }); await ffmpeg.load({ coreURL: "/assets/core-mt/package/dist/esm/ffmpeg-core.js", }); } const { name } = files[0]; await ffmpeg.writeFile(name, await fetchFile(files[0])); message.innerHTML = 'Start transcoding'; await ffmpeg.exec(['-i', name, 'output.mp4']); message.innerHTML = 'Complete transcoding'; const data = await ffmpeg.readFile('output.mp4'); const video = document.getElementById('output-video'); video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })); } const elm = document.getElementById('uploader'); elm.addEventListener('change', transcode);
```

----------------------------------------

TITLE: Importing UI Components for ffmpeg.wasm Playground (React)
DESCRIPTION: This snippet imports various React components and Material-UI icons used to construct the user interface of the ffmpeg.wasm Playground. These components facilitate file management, theme provisioning, and interactive buttons, ensuring the application's visual and functional integrity.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/src/pages/playground.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
import BrowserOnly from '@docusaurus/BrowserOnly';
import MuiThemeProvider from "@site/src/components/common/MuiThemeProvider";
import ThemedButton from "@site/src/components/common/ThemedButton";
import ThemedIconButton from "@site/src/components/common/ThemedIconButton";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import RefreshIcon from "@mui/icons-material/Refresh";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import UploadIcon from "@mui/icons-material/Upload";
```

----------------------------------------

TITLE: Transcoding Video to MP4 with FFmpeg.wasm (JavaScript)
DESCRIPTION: This snippet demonstrates how to initialize FFmpeg.wasm, handle a file upload, write the input file to FFmpeg's virtual file system, execute a transcoding command to MP4 (x264), read the output file, and display the transcoded video in an HTML5 video element. It includes progress and log event handling.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/vanilla-app/public/transcode-mt.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
const { fetchFile } = FFmpegUtil; const { FFmpeg } = FFmpegWASM; let ffmpeg = null; const transcode = async ({ target: { files } }) => { const message = document.getElementById('message'); if (ffmpeg === null) { ffmpeg = new FFmpeg(); ffmpeg.on("log", ({ message }) => { console.log(message); }) ffmpeg.on("progress", ({ progress, time }) => { message.innerHTML = `${progress * 100} %, time: ${time / 1000000} s`; }); await ffmpeg.load({ coreURL: "/assets/core-mt/package/dist/umd/ffmpeg-core.js", }); } const { name } = files[0]; await ffmpeg.writeFile(name, await fetchFile(files[0])); message.innerHTML = 'Start transcoding'; console.time('exec'); await ffmpeg.exec(['-i', name, 'output.mp4']); console.timeEnd('exec'); message.innerHTML = 'Complete transcoding'; const data = await ffmpeg.readFile('output.mp4'); const video = document.getElementById('output-video'); video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })); } const elm = document.getElementById('uploader'); elm.addEventListener('change', transcode);
```

----------------------------------------

TITLE: Converting WebM to MP4 using FFmpeg Shell Command
DESCRIPTION: This shell command demonstrates how to convert an input WebM video file to an MP4 output file using FFmpeg. It is used as a baseline for performance comparison against ffmpeg.wasm versions. The command takes an input file (`-i`) and specifies the output file name.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/performance.md#_snippet_0

LANGUAGE: Shell
CODE:
```
ffmpeg -i [input.webm] output.mp4
```

----------------------------------------

TITLE: Reading Files from FFmpeg Virtual File System in JavaScript
DESCRIPTION: Similar to writing, reading files from the virtual file system in ffmpeg.wasm 0.12+ is streamlined. `ffmpeg.FS.readFile()` is replaced by the top-level `await ffmpeg.readFile()` method, which is an asynchronous operation.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/migration.md#_snippet_5

LANGUAGE: JavaScript
CODE:
```
ffmpeg.FS.readFile()
```

LANGUAGE: JavaScript
CODE:
```
await ffmpeg.readFile()
```

----------------------------------------

TITLE: Executing FFmpeg Commands in JavaScript
DESCRIPTION: The `ffmpeg.run()` method for executing FFmpeg commands is renamed to `ffmpeg.exec()` in version 0.12+. The arguments should still be provided as an array.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/migration.md#_snippet_3

LANGUAGE: JavaScript
CODE:
```
await ffmpeg.run(...args)
```

LANGUAGE: JavaScript
CODE:
```
await ffmpeg.exec([...args])
```

----------------------------------------

TITLE: Rendering Core Switcher for ffmpeg.wasm (React)
DESCRIPTION: This React snippet renders the `CoreSwitcher` component within a `MuiThemeProvider` and `BrowserOnly` context. The `CoreSwitcher` allows users to select between different ffmpeg.wasm core versions, such as multithreading, affecting asset loading and performance.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/src/pages/playground.md#_snippet_2

LANGUAGE: JavaScript
CODE:
```
{() => {
    const CoreSwitcher = require('@site/src/components/Playground/CoreSwitcher').default;
    return <CoreSwitcher/>;
  }}
```

----------------------------------------

TITLE: Writing Files to FFmpeg Virtual File System in JavaScript
DESCRIPTION: In ffmpeg.wasm 0.12+, file writing is simplified. The `ffmpeg.FS.writeFile()` method is replaced by the top-level `await ffmpeg.writeFile()` method, making it a direct asynchronous operation.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/migration.md#_snippet_4

LANGUAGE: JavaScript
CODE:
```
ffmpeg.FS.writeFile()
```

LANGUAGE: JavaScript
CODE:
```
await ffmpeg.writeFile()
```

----------------------------------------

TITLE: Defining Global Styles and Responsive Layout in CSS
DESCRIPTION: This CSS snippet defines global custom properties (CSS variables) for a color palette and gradients, establishes base font styles for the host element, headings, and paragraphs, and configures the main content area's layout. It also includes a media query to adjust the layout for smaller screens, ensuring responsiveness.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/angular-app/src/app/app.component.html#_snippet_0

LANGUAGE: CSS
CODE:
```
:host { --bright-blue: oklch(51.01% 0.274 263.83); --electric-violet: oklch(53.18% 0.28 296.97); --french-violet: oklch(47.66% 0.246 305.88); --vivid-pink: oklch(69.02% 0.277 332.77); --hot-red: oklch(61.42% 0.238 15.34); --orange-red: oklch(63.32% 0.24 31.68); --gray-900: oklch(19.37% 0.006 300.98); --gray-700: oklch(36.98% 0.014 302.71); --gray-400: oklch(70.9% 0.015 304.04); --red-to-pink-to-purple-vertical-gradient: linear-gradient( 180deg, var(--orange-red) 0%, var(--vivid-pink) 50%, var(--electric-violet) 100% ); --red-to-pink-to-purple-horizontal-gradient: linear-gradient( 90deg, var(--orange-red) 0%, var(--vivid-pink) 50%, var(--electric-violet) 100% ); --pill-accent: var(--bright-blue); font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; box-sizing: border-box; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } h1 { font-size: 3.125rem; color: var(--gray-900); font-weight: 500; line-height: 100%; letter-spacing: -0.125rem; margin: 0; font-family: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; } p { margin: 0; color: var(--gray-700); } main { width: 100%; min-height: 100%; display: flex; justify-content: center; align-items: center; padding: 1rem; box-sizing: inherit; position: relative; } @media screen and (max-width: 650px) { .content { flex-direction: column; width: max-content; } .divider { height: 1px; width: 100%; background: var(--red-to-pink-to-purple-horizontal-gradient); margin-block: 1.5rem; } }
```

----------------------------------------

TITLE: Transcoding Video with Timeout using FFmpeg.wasm (JavaScript)
DESCRIPTION: This snippet demonstrates how to transcode a video file (webm to mp4) using FFmpeg.wasm, incorporating a timeout mechanism for the `ffmpeg.exec` command. It initializes FFmpeg, loads necessary modules, writes an input file from a URL, executes the transcoding command with a 1-second timeout, reads the output, and displays it in a video element. It also logs FFmpeg messages to a UI element and the console.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/getting-started/usage.md#_snippet_2

LANGUAGE: JavaScript
CODE:
```
// import { FFmpeg } from '@ffmpeg/ffmpeg';
// import { fetchFile } from '@ffmpeg/util';
function() {
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);
    const messageRef = useRef(null);

    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('log', ({ message }) => {
            messageRef.current.innerHTML = message;
            console.log(message);
        });
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setLoaded(true);
    }

    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
        await ffmpeg.writeFile('input.webm', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm'));
        // The exec should stop after 1 second.
        await ffmpeg.exec(['-i', 'input.webm', 'output.mp4'], 1000);
        const data = await ffmpeg.readFile('output.mp4');
        videoRef.current.src =
            URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    }

    return (loaded
        ? (
            <>
                <video ref={videoRef} controls></video><br/>
                <button onClick={transcode}>Transcode webm to mp4</button>
                <p ref={messageRef}></p>
                <p>Open Developer Tools (Ctrl+Shift+I) to View Logs</p>
            </>
        )
        : (
            <button onClick={load}>Load ffmpeg-core (~31 MB)</button>
        )
    );
}
```

----------------------------------------

TITLE: Splitting Video into Segments with ffmpeg.wasm (JSX)
DESCRIPTION: This snippet demonstrates how to load the ffmpeg-core and then use ffmpeg.wasm to split a video file ('input.webm') into multiple segments of 3 seconds each. It specifically plays the second segment ('output_1.mp4'). It requires the @ffmpeg/ffmpeg and @ffmpeg/util packages.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/getting-started/usage.md#_snippet_4

LANGUAGE: JSX
CODE:
```
// import { FFmpeg } from '@ffmpeg/ffmpeg';
// import { fetchFile } from '@ffmpeg/util';
function() {
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);
    const messageRef = useRef(null);

    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('log', ({ message }) => {
            messageRef.current.innerHTML = message;
            console.log(message);
        });
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setLoaded(true);
    }

    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
        await ffmpeg.writeFile('input.webm', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm'));
        await ffmpeg.exec([
            '-i',
            'input.webm',
            '-f',
            'segment',
            '-segment_time',
            '3',
            '-g',
            '9',
            '-sc_threshold',
            '0',
            '-force_key_frames',
            'expr:gte(t,n_forced*9)',
            '-reset_timestamps',
            '1',
            '-map',
            '0',
            'output_%d.mp4'
        ]);
        const data = await ffmpeg.readFile('output_1.mp4');
        videoRef.current.src =
            URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    }

    return (loaded
        ? (
            <>
                <video ref={videoRef} controls></video><br/>
                <button onClick={transcode}>Split video to segments of 3 sec. and plays 2nd segment</button>
                <p ref={messageRef}></p>
                <p>Open Developer Tools (Ctrl+Shift+I) to View Logs</p>
            </>
        )
        : (
            <button onClick={load}>Load ffmpeg-core (~31 MB)</button>
        )
    );
}
```

----------------------------------------

TITLE: Handling Log Events in FFmpeg in JavaScript
DESCRIPTION: In ffmpeg.wasm 0.12+, logging is handled via an event listener. Instead of `ffmpeg.setLogger()`, you now use `ffmpeg.on("log", callback)` to subscribe to log events.

SOURCE: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/migration.md#_snippet_7

LANGUAGE: JavaScript
CODE:
```
ffmpeg.setLogger()
```

LANGUAGE: JavaScript
CODE:
```
ffmpeg.on("log", () => {})
```