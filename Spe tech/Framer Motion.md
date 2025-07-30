========================
CODE SNIPPETS
========================
TITLE: JavaScript Setup and Imports
DESCRIPTION: Imports necessary modules and variables from global objects (window.Motion, window.Assert), gets the root DOM element, and defines constants and a motion value used throughout the script.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/defer-handoff-layout.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const { motion, animateStyle, animate, startOptimizedAppearAnimation, optimizedAppearDataAttribute, motionValue, frame, } = window.Motion
const { matchViewportBox } = window.Assert
const root = document.getElementById("root")
const duration = 0.5
const x = motionValue(0)
let isFirstFrame = true
```

----------------------------------------

TITLE: Installing Framer Motion with npm
DESCRIPTION: Provides the command line instruction to install the Framer Motion library using the npm package manager.

SOURCE: https://github.com/grx7/framer-motion/blob/main/packages/framer-motion/README.md#_snippet_1

LANGUAGE: shell
CODE:
```
npm install framer-motion
```

----------------------------------------

TITLE: Implementing Optimized Appear Animation with Framer Motion/React - JavaScript
DESCRIPTION: Initializes dependencies from global objects, defines spring physics parameters, creates a React component using `motion.div` with initial/animate states and a spring transition, includes an animation start check, renders the component server-side, generates spring keyframes based on physics, and starts a Motion One optimized appear animation with hydration triggered mid-animation.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/interrupt-spring.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const { motion, animateStyle, startOptimizedAppearAnimation, optimizedAppearDataAttribute, motionValue, spring, } = window.Motion
const { matchViewportBox, matchOpacity } = window.Assert
const root = document.getElementById("root")
const stiffness = 300
const damping = 40
const mass = 1
// This is the tree to be rendered "server" and client-side.
const Component = React.createElement(motion.div, {
  id: "box",
  initial: { y: 0, scale: 1 },
  animate: { y: 100, scale: 2 },
  transition: { type: "spring", stiffness, damping, mass },
  /**
   * On animation start, check the values we expect to see here
   */
  onAnimationStart: () => {
    const { top, left } = document
      .getElementById("box")
      .getBoundingClientRect()
    if (top < 110 || top > 140 || left < 60 || left > 90) {
      showError(box, `unexpected viewport box`)
    }
  },
  style: { willChange: "opacity" },
  \[optimizedAppearDataAttribute\]: "a",
})
// Emulate server rendering of element
root.innerHTML = ReactDOMServer.renderToString(Component)
const springTimeResolution = 10
function generateSpringKeyframes(from, to) {
  let t = 0
  const keyframes = \[\]
  const springAnimation = spring({
    keyframes: \[from, to\],
    stiffness,
    damping,
    mass,
  })
  let state = { done: false, value: from }
  while (!state.done) {
    state = springAnimation.next(t)
    keyframes.push(state.value)
    t += springTimeResolution
  }
  return keyframes
}
const yKeyframes = generateSpringKeyframes(0, 100)
const scaleKeyframes = generateSpringKeyframes(1, 2)
const maxKeyframes = Math.max(
  yKeyframes.length,
  scaleKeyframes.length
)
const transformOptions = {
  duration: maxKeyframes * springTimeResolution,
  ease: "linear",
}
const transformKeyframes = \[\]
for (let i = 0; i < maxKeyframes; i++) {
  transformKeyframes.push(
    `translateY(${ yKeyframes\[Math.min(i, yKeyframes.length - 1)\] }px) scale(${ scaleKeyframes\[Math.min(i, scaleKeyframes.length - 1)\] })`
  )
}
// Start Motion One animations
const animation = startOptimizedAppearAnimation(
  document.getElementById("box"),
  "transform",
  transformKeyframes,
  transformOptions,
  (animation) => {
    // Hydrate root mid-way through animation
    setTimeout(() => {
      ReactDOM.hydrateRoot(root, Component)
    }, 100)
  }
)
```

----------------------------------------

TITLE: Starting Optimized Opacity Animation (JavaScript)
DESCRIPTION: Initiates an optimized appear animation for the 'opacity' property of the box element using `startOptimizedAppearAnimation`. It animates from 0 to 1 using the same timing options as the transform animation.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/resync-delay.html#_snippet_3

LANGUAGE: javascript
CODE:
```
startOptimizedAppearAnimation(
  document.getElementById("box"),
  "opacity",
  [0, 1],
  options
)
```

----------------------------------------

TITLE: Starting Manual Rotation Animation (JavaScript)
DESCRIPTION: Initializes the start time and begins the manual rotation animation loop by calling `requestAnimationFrame`. This function is commented out in the provided code.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/benchmarks/pregenerated-background-color.html#_snippet_3

LANGUAGE: javascript
CODE:
```
function animateRotation() {
  startTime = performance.now()
  requestAnimationFrame(rotate)
}
// animateRotation()
```

----------------------------------------

TITLE: Starting Optimized Opacity Appear Animation
DESCRIPTION: Initiates a Web Animations API (WAAPI) optimized animation for the opacity property of the #box element, transitioning from 0 to 1 over a specified duration with a linear ease.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/defer-handoff-block.html#_snippet_4

LANGUAGE: javascript
CODE:
```
// Start optimised opacity animation
startOptimizedAppearAnimation(
  document.getElementById("box"),
  "opacity",
  [0, 1],
  {
    duration: duration * 1000,
    ease: "linear",
  }
)
```

----------------------------------------

TITLE: Starting Optimized Appear Animations (JavaScript)
DESCRIPTION: Demonstrates starting optimized appear animations for `opacity` and `backgroundColor` properties on the target element using `startOptimizedAppearAnimation`. It highlights a potential conflict with the `backgroundColor` animation defined in the component's `animate` prop.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/defer-handoff-layout-ancestor.html#_snippet_4

LANGUAGE: JavaScript
CODE:
```
// Start optimised opacity animation
startOptimizedAppearAnimation(
  document.getElementById("optimised-box"),
  "opacity",
  \[0, 1\],
  {
    duration: duration * 1000,
    ease: "linear",
  }
)

// Start optimised background-color animation
// This optimised animation is red -> red whereas the animation on the
// motion.div is blue -> blue. Therefore, if the optimised animations
// cancelled, the rendered color will be blue.
startOptimisedAppearAnimation(
  document.getElementById("optimised-box"),
  "backgroundColor",
  \["#f00", "#f00"\]
  {
    duration: duration * 1000,
    ease: "linear",
  }
)
```

----------------------------------------

TITLE: Implementing Optimized Appear Animation with Framer Motion (JavaScript)
DESCRIPTION: Demonstrates using Framer Motion's optimized appear animation feature. It defines a React component using `motion.div`, server-renders it, starts an optimized appear animation, and then hydrates the root with the same component, including checks during the animation lifecycle. Requires Framer Motion, React, and ReactDOM.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/interrupt-delay-before-accelerated.html#_snippet_1

LANGUAGE: JavaScript
CODE:
```
const { motion, animateStyle, startOptimizedAppearAnimation, optimizedAppearDataAttribute, motionValue, } = window.Motion
const { matchOpacity } = window.Assert
const root = document.getElementById("root")
const duration = 0.25
const delay = 0.5

// This is the tree to be rendered "server" and client-side.
const Component = React.createElement(motion.div, {
  id: "box",
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration, ease: "linear", delay },
  // style: { opacity },
  /**
   * On animation start, check the values we expect to see here
   */
  onAnimationStart: () => {
    matchOpacity(document.getElementById("box"), 0)
    requestAnimationFrame(() => {
      matchOpacity(document.getElementById("box"), 0)
    })
  },
  \[optimizedAppearDataAttribute\]: "a",
})

// Emulate server rendering of element
root.innerHTML = ReactDOMServer.renderToString(Component)

startOptimizedAppearAnimation(
  document.getElementById("box"),
  "opacity",
  \[0, 1\],
  {
    duration: duration * 1000,
    ease: "linear",
    delay: delay * 1000,
  },
  (animation) => {
    // Hydrate root mid-way through delay
    setTimeout(() => {
      ReactDOM.hydrateRoot(root, Component)
      const { opacity: initialOpacity } = window.getComputedStyle(box)
      if (initialOpacity !== "0") {
        showError(box, \`opacity should have animated\`)
      }
    }, 300)
  }
)
```

----------------------------------------

TITLE: Importing Dependencies and Initializing Variables (JavaScript)
DESCRIPTION: Imports necessary functions and objects from the global `window.Motion` and `window.Assert` objects, gets the root element, defines animation duration, and initializes a `motionValue`.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/defer-handoff-layout-ancestor.html#_snippet_1

LANGUAGE: JavaScript
CODE:
```
const { motion, animateStyle, animate, startOptimizedAppearAnimation, optimizedAppearDataAttribute, motionValue, frame, } = window.Motion
const { matchViewportBox } = window.Assert
const root = document.getElementById("root")
const duration = 0.5
const x = motionValue(0)
let isFirstFrame = true
```

----------------------------------------

TITLE: Run Framer Motion Vanilla Dev Environment (Shell)
DESCRIPTION: Execute this command from the root directory of the motion project to start the development server for the Vanilla environment. This allows access to various tests and benchmark files.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
yarn dev
```

----------------------------------------

TITLE: Styling Elements for Layout Testing (CSS)
DESCRIPTION: Defines basic styles for the body, container, and box elements used in the layout projection example. Includes positioning, dimensions, background colors, and a rule to highlight incorrect layout states.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/shared-promote-new-mix-rotate-scale-correction.html#_snippet_0

LANGUAGE: css
CODE:
```
body { padding: 0; margin: 0; } #container-a { position: relative; width: 300px; height: 300px; } #box-a { width: 100px; height: 100px; background-color: #00cc88; } #container-b { position: relative; width: 300px; height: 600px; } #box-b { position: absolute; top: 100px; left: 100px; width: 200px; height: 300px; background-color: #09f; } #trigger-overflow { width: 1px; height: 1px; position: absolute; top: 2000px; left: 2000px; } \[data-layout-correct="false"\] { background: #dd1144 !important; opacity: 0.5; }
```

----------------------------------------

TITLE: Starting WAAPI Transform Animation and Hydrating Root (JavaScript)
DESCRIPTION: Starts a WAAPI animation for the `transform` property using `startOptimizedAppearAnimation`. It includes a callback that triggers `ReactDOM.hydrateRoot` after a delay, simulating the client-side hydration process during which animation cancellation might occur.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/defer-handoff-layout-ancestor.html#_snippet_5

LANGUAGE: JavaScript
CODE:
```
// Start WAAPI animation
const animation = startOptimisedAppearAnimation(
  document.getElementById("optimised-box"),
  "transform",
  \["translateX(0px)", "translateX(100px)"\],
  {
    duration: duration * 1000,
    ease: "linear",
  },
  (animation) => {
    setTimeout(() => {
      ReactDOM.hydrateRoot(
        root,
        React.createElement(Component)
      )
    }, (duration * 1000) / 4)
  }
)
```

----------------------------------------

TITLE: Importing Framer Motion and Assert Utilities
DESCRIPTION: Imports necessary functions and objects from global Motion and Assert objects, and initializes variables used for animation control and element references.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/defer-handoff-block.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const { motion, animateStyle, animate, startOptimizedAppearAnimation, optimizedAppearDataAttribute, motionValue, frame, } = window.Motion
const { matchViewportBox } = window.Assert
const root = document.getElementById("root")
const duration = 4
const x = motionValue(0)
const xTarget = 500
let isFirstFrame = true
```

----------------------------------------

TITLE: Initializing and Testing Element Projection (JavaScript)
DESCRIPTION: Retrieves necessary functions from global objects, gets the box element, creates a projection node, records its initial position, updates the element's class, updates the projection node, and schedules a post-render check to match the viewport box.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/single-element-layout-change.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const { createNode } = window.Undo
const { matchViewportBox } = window.Assert
const { frame } = window.Projection
const box = document.getElementById("box")
const boxProjection = createNode(box)
const boxOrigin = box.getBoundingClientRect()
boxProjection.willUpdate()
box.classList.add("b")
boxProjection.root.didUpdate()
frame.postRender(() => {
  matchViewportBox(box, boxOrigin)
})
```

----------------------------------------

TITLE: Initializing Animation Node and Matching Viewport Box in JavaScript
DESCRIPTION: Initializes an animation node for a DOM element using `window.Animate.createNode`, gets its initial bounding box, updates the node's internal state, and asserts its viewport position using `window.Assert.matchViewportBox`.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/animate-single-element.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const { createNode } = window.Animate
const { matchViewportBox } = window.Assert
const box = document.getElementById("box")
const boxProjection = createNode(box)
const boxOrigin = box.getBoundingClientRect()
boxProjection.willUpdate()
boxProjection.root.didUpdate()
matchViewportBox(box, boxOrigin)
```

----------------------------------------

TITLE: Animating React Component with Framer Motion
DESCRIPTION: Demonstrates using Framer Motion within a React component to animate opacity and layout. It includes state management, effect hooks, server-side rendering emulation, and starting a Web Animations API (WAAPI) animation for optimized appearance.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/defer-handoff-layout-opacity.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const { motion, animateStyle, animate, startOptimizedAppearAnimation, optimizedAppearDataAttribute, motionValue, frame, } = window.Motion
const { matchViewportBox } = window.Assert
const root = document.getElementById("root")
const duration = 0.5
const x = motionValue(0)
let isFirstFrame = true
function Component() {
  const \[top, setTop\] = React.useState(0)
  React.useEffect(() => {
    setTimeout(() => {
      setTop(100)
    }, 250)
  }, \[\])
  return React.createElement(motion.div, {
    id: "box",
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration,
      ease: "linear",
      layout: { duration: 10 },
    },
    style: {
      x,
      top,
      position: "relative",
      background: top ? "red" : "blue",
    },
    layout: true,
    onLayoutAnimationStart: () => {
      requestAnimationFrame(() => {
        const box = document.getElementById("box")
        if (
          box.style.opacity === window.getComputedStyle(box).opacity
        ) {
          /**
           * If style.opacity and computed style.opacity are the same,
           * it means the optimised opacity animation was cancelled by
           * the layout animation.
           */
          showError(
            "style attr and computed style should be slightly different"
          )
        }
      })
    },
    \[optimizedAppearDataAttribute\]: "a",
    children: "Content",
  })
}
// Emulate server rendering of element
root.innerHTML = ReactDOMServer.renderToString(
  React.createElement(Component)
)
// Start WAAPI animation
const animation = startOptimizedAppearAnimation(
  document.getElementById("box"),
  "opacity",
  \[0, 1\],
  {
    duration: duration * 1000,
    ease: "linear",
  },
  (animation) => {
    setTimeout(() => {
      ReactDOM.hydrateRoot(
        root,
        React.createElement(Component)
      )
    }, (duration * 1000) / 4)
  }
)
```

----------------------------------------

TITLE: Setting Up Projection Nodes for Nested Elements (JavaScript)
DESCRIPTION: Initializes necessary functions from global objects, creates projection nodes for existing and newly created nested HTML elements, linking them via parent-child relationships and shared layout IDs. It triggers updates and performs checks on the state of the projection system after setup.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/perf-shared-deep.html#_snippet_1

LANGUAGE: JavaScript
CODE:
```
const { createNode } = window.Animate
const { matchViewportBox, checkFrame } = window.Assert
const { frame } = window.Projection
const duration = 10
const a = document.getElementById("a")
const aProjection = createNode( a, undefined, { layoutId: "box" }, { duration } )
const a2 = document.getElementById("a-2")
const a2Projection = createNode( a2, aProjection, { layoutId: "2" }, { duration } )
const a3 = document.getElementById("a-3")
const a3Projection = createNode( a3, a2Projection, { layoutId: "3" }, { duration } )
aProjection.willUpdate()
a2Projection.willUpdate()
a3Projection.willUpdate()
const b = document.createElement("div")
b.id = "b"
document.body.appendChild(b)
const bProjection = createNode( b, undefined, { layoutId: "box" }, { duration } )
const b2 = document.createElement("div")
b2.id = "b-2"
b.appendChild(b2)
const b2Projection = createNode( b2, bProjection, { layoutId: "2" }, { duration } )
const b3 = document.createElement("div")
b3.id = "b-3"
b2.appendChild(b3)
const b3Projection = createNode( b3, b2Projection, { layoutId: "3" }, { duration } )
aProjection.root.didUpdate()
/**
 * Shared element transition nodes are currently all recalculated,
 * it would be good to investigate in the future if there's further
 * safe optimisations we can make here.
 */
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    console.log(window.ProjectionFrames)
    checkFrame(a, 1, { totalNodes: 7, resolvedTargetDeltas: 3, recalculatedProjection: 6, })
  })
})
```

----------------------------------------

TITLE: Starting Optimized Transform Animation (JavaScript)
DESCRIPTION: Initiates an optimized appear animation for the 'transform' property of the box element using `startOptimizedAppearAnimation`. It animates from 'translateX(0px)' to 'translateX(100px)' and hydrates the React component after the animation duration.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/resync-delay.html#_snippet_2

LANGUAGE: javascript
CODE:
```
// Emulate server rendering of element
root.innerHTML = ReactDOMServer.renderToString(Component)
const options = {
  delay: delay * 1000,
  duration: duration * 1000,
  ease: "linear",
}
startOptimizedAppearAnimation(
  document.getElementById("box"),
  "transform",
  ["translateX(0px)", "translateX(100px)"],
  options,
  (animation) => {
    setTimeout(() => {
      ReactDOM.hydrateRoot(root, Component)
    }, duration * 1000)
  }
)
```

----------------------------------------

TITLE: Styling Elements for Framer Motion Layout (CSS)
DESCRIPTION: Defines basic CSS styles for the body and two box elements (#box-a, #box-b) used in the Framer Motion layout examples. Includes positioning, dimensions, background colors, and a rule for incorrect layout states.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/shared-promote-new-mix-rotate.html#_snippet_0

LANGUAGE: css
CODE:
```
body { padding: 0; margin: 0; } #box-a { width: 100px; height: 100px; background-color: #00cc88; } #box-b { position: absolute; top: 100px; left: 100px; width: 200px; height: 300px; background-color: #09f; } #trigger-overflow { width: 1px; height: 1px; position: absolute; top: 2000px; left: 2000px; } \[data-layout-correct="false"\] { background: #dd1144 !important; opacity: 0.5; }
```

----------------------------------------

TITLE: Basic Page Layout CSS
DESCRIPTION: Defines basic styling for the page body, a container element, and nested divs/boxes, setting padding, margins, display properties, and initial dimensions.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/benchmarks/warm-start-gsap.html#_snippet_0

LANGUAGE: css
CODE:
```
body { padding: 0; margin: 0; } .container { padding: 100px; width: 100%; display: flex; flex-wrap: wrap; } .container > div { width: 100px; height: 100px; } .box { width: 10px; height: 100px; background-color: #fff; }
```

----------------------------------------

TITLE: Creating and Updating Projection Nodes with JavaScript
DESCRIPTION: Uses functions from `window.Undo`, `window.Assert`, and `window.Projection` to create and manipulate projection nodes. It gets DOM elements for an overlay and a box, creates projection nodes for them (linking the box node to the overlay node), gets the box's initial bounding rectangle, updates the box projection, scrolls the window, updates the root projection, and finally asserts the box's viewport position.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/sticky-scroll-no-layout-change.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const { createNode } = window.Undo
const { matchViewportBox, addPageScroll } = window.Assert
const { frame } = window.Projection

const overlay = document.getElementById("overlay")
const overlayProjection = createNode(overlay, undefined, {
  layoutScroll: true,
  layout: false,
})

const box = document.getElementById("box")
const boxProjection = createNode(
  box,
  overlayProjection
  // undefined,
  // { duration: 1 }
)

const boxOrigin = box.getBoundingClientRect()

boxProjection.willUpdate()

const scrollOffset = [50, 100]
window.scrollTo(...scrollOffset)

boxProjection.root.didUpdate()

matchViewportBox(box, {
  top: 200,
  left: -50,
  bottom: 300,
  right: 50,
})
```

----------------------------------------

TITLE: Setting up Layout Projection Nodes and Testing (JavaScript)
DESCRIPTION: Initializes projection nodes for screen containers and box elements using custom functions (`createNode`). Manipulates the DOM to create a new scrollable screen and a box within it. Performs layout matching tests after a delay using `matchViewportBox`.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/shared-scroll-b-a.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const { createNode } = window.Undo
const { matchViewportBox, matchVisibility, matchOpacity } = window.Assert
const { frame } = window.Projection
const screen = document.querySelector(".screen")
const screenProjection = createNode(screen)
const box = document.getElementById("box-b")
const boxOrigin = box.getBoundingClientRect()
const boxProjection = createNode(box, screenProjection, { layoutId: "box", })
boxProjection.willUpdate()
const scrollScreen = document.createElement("div")
scrollScreen.classList.add("screen", "scroll")
document.body.appendChild(scrollScreen)
const newBox = document.createElement("div")
newBox.id = "box"
scrollScreen.appendChild(newBox)
scrollScreen.scrollTop = 1000
console.log(scrollScreen.scrollTop)
const scrollScreenProjection = createNode(scrollScreen, undefined)
const newBoxProjection = createNode(
  newBox, scrollScreenProjection, { layoutId: "box", }
)
boxProjection.root.didUpdate()
setTimeout(() => {
  matchViewportBox(box, boxOrigin)
  matchViewportBox(newBox, boxOrigin)
  matchViewportBox(box, newBox)
}, 50)
```

----------------------------------------

TITLE: Initializing Animation Variables (JavaScript)
DESCRIPTION: Selects the elements to animate and defines variables for animation timing and rotation calculation.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/benchmarks/pregenerated-background-color.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const boxes = document.querySelectorAll(".box")
let startTime = 0
const duration = 10000
const rotateRate = 360 / duration
```

----------------------------------------

TITLE: Styling Elements for Layout Transitions (CSS)
DESCRIPTION: Provides basic CSS rules for elements used in layout transition tests, including dimensions, background colors, positioning, and a rule to highlight elements potentially miscalculated by the layout system.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/perf-shared-deep.html#_snippet_0

LANGUAGE: CSS
CODE:
```
body { padding: 0; margin: 0; } #a { width: 100px; height: 100px; background-color: #00cc88; } #b { width: 200px; height: 200px; background-color: #0077ff; position: absolute; top: 50px; left: 50px; } #a-2, #b-2 { width: 50px; height: 50px; background-color: #fff; } #a-3, #b-3 { width: 25px; height: 25px; background-color: #000; } #trigger-overflow { width: 1px; height: 1px; position: absolute; top: 2000px; left: 2000px; } \[data-layout-correct="false"\] { background: #dd1144 !important; opacity: 0.5; }
```

----------------------------------------

TITLE: Setting up Layout Projections and Animation with JavaScript
DESCRIPTION: Uses a library (Animate, Assert, Projection) to create layout nodes for existing and newly created DOM elements. It sets up shared layout IDs, triggers layout updates, appends new elements to the DOM, and includes a timeout to simulate a class change and assert the final position of an element.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/shared-promote-target.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const { createNode } = window.Animate
const { matchViewportBox, matchVisibility, matchOpacity } = window.Assert
const { frame } = window.Projection

const a = document.getElementById("box-a")
const childA = document.getElementById("child-a")
const c = document.getElementById("button")

const aProjection = createNode(
  a,
  undefined,
  { layoutId: "box" },
  { duration: 0.1 }
)

const childAProjection = createNode(
  childA,
  aProjection,
  { layoutId: "child" },
  { duration: 0.1 }
)

const cProjection = createNode(
  c,
  undefined,
  { layoutId: "foo" },
  { duration: 0.1 }
)

aProjection.willUpdate()
childAProjection.willUpdate()

const b = document.createElement("div")
const childB = document.createElement("div")
b.id = "box-b"
childB.id = "child-b"
b.appendChild(childB)
document.body.appendChild(b)

const bProjection = createNode(
  b,
  undefined,
  { layoutId: "box" },
  { duration: 0.1 }
)

const childBProjection = createNode(
  childB,
  bProjection,
  { layoutId: "child" },
  { duration: 0.1 }
)

aProjection.root.didUpdate()

// After the shared animation finished
setTimeout(() => {
  cProjection.willUpdate()
  c.classList.add("b")
  cProjection.root.didUpdate()

  matchViewportBox(childB, {
    left: 600,
    top: 100,
    height: 50,
    width: 50,
  })
}, 200)
```

----------------------------------------

TITLE: Setting Up Projection Nodes and Assertions (JavaScript)
DESCRIPTION: Uses helper functions from window.Animate, window.Assert, and window.Projection to create projection nodes for existing and newly created DOM elements. It sets specific properties (opacity, borderRadius, skewX) on these nodes and then uses frame.postRender to assert the final computed styles and layout properties of the elements.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/shared-promote-new-mix-skew.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const { createNode } = window.Animate
const { matchViewportBox, matchVisibility, matchOpacity, matchBorderRadius, matchSkewX, } = window.Assert
const { frame } = window.Projection
const box = document.getElementById("box-a")
const boxProjection = createNode(box, undefined, { layoutId: "a" })
boxProjection.willUpdate()
const newBox = document.createElement("div")
newBox.id = "box-b"
document.body.appendChild(newBox)
const newBoxProjection = createNode(newBox, undefined, { layoutId: "a", })
boxProjection.setValue("opacity", 0.8)
newBoxProjection.setValue("borderRadius", 20)
newBoxProjection.setValue("skewX", 40)
newBoxProjection.root.didUpdate()
frame.postRender(() => {
  const bbox = newBox.getBoundingClientRect()
  matchViewportBox(box, bbox)
  matchVisibility(box, "visible")
  matchVisibility(newBox, "visible")
  matchOpacity(box, 0.8)
  matchOpacity(newBox, 1)
  matchSkewX(box, 40)
  matchSkewX(newBox, 40)
  matchBorderRadius(box, "6.66667% / 5%")
  matchBorderRadius(newBox, "6.66667% / 5%")
})
```

----------------------------------------

TITLE: Start Optimized Opacity Animation
DESCRIPTION: Initiates an optimized animation for the 'opacity' property of the box element using `startOptimizedAppearAnimation` with a linear ease and specified duration.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/defer-handoff-layout.html#_snippet_4

LANGUAGE: javascript
CODE:
```
// Start optimised opacity animation
startOptimizedAppearAnimation(
  document.getElementById("box"),
  "opacity",
  [0, 1],
  {
    duration: duration * 1000,
    ease: "linear",
  }
)
```

----------------------------------------

TITLE: Starting Optimized Transform Animation and Hydration
DESCRIPTION: Initiates a WAAPI optimized animation for the transform property (specifically translateX) of the #box element. Includes a callback that triggers ReactDOM.hydrateRoot after a delay, attaching React event handlers and logic to the server-rendered HTML.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/defer-handoff-block.html#_snippet_5

LANGUAGE: javascript
CODE:
```
// Start WAAPI animation
const animation = startOptimizedAppearAnimation(
  document.getElementById("box"),
  "transform",
  ["translateX(0px)", `translateX(${xTarget}px)`],
  {
    duration: duration * 1000,
    ease: "linear",
  },
  (animation) => {
    setTimeout(() => {
      ReactDOM.hydrateRoot(root, Component)
    }, (duration * 1000) / 4)
  }
)
```

----------------------------------------

TITLE: Setting up Projection Nodes and Testing Layout (JavaScript)
DESCRIPTION: Initializes projection nodes for existing and newly created screen and box elements using functions from `window.Undo` and `window.Projection`. It manipulates the scroll position of a screen element and performs layout matching assertions using `window.Assert.matchViewportBox` after a short delay.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/shared-scroll-a-b.html#_snippet_1

LANGUAGE: JavaScript
CODE:
```
const { createNode } = window.Undo
const { matchViewportBox, matchVisibility, matchOpacity } = window.Assert
const { frame } = window.Projection
const scrollScreen = document.querySelector(".screen")
const scrollScreenProjection = createNode(scrollScreen, undefined, { layoutScroll: true, })
scrollScreen.scrollTop = 1000
const box = document.getElementById("box")
const boxProjection = createNode(box, scrollScreenProjection, { layoutId: "box", })
const boxOrigin = box.getBoundingClientRect()
boxProjection.willUpdate()
const screen = document.createElement("div")
screen.classList.add("screen")
document.body.appendChild(screen)
const screenProjection = createNode(screen, undefined)
const newBox = document.createElement("div")
newBox.id = "box-b"
screen.appendChild(newBox)
const newBoxProjection = createNode(newBox, screenProjection, { layoutId: "box", })
boxProjection.root.didUpdate()
setTimeout(() => {
  matchViewportBox(box, boxOrigin)
  matchViewportBox(newBox, boxOrigin)
  matchViewportBox(box, newBox)
}, 50)
```

----------------------------------------

TITLE: Starting Optimized Opacity Animation (Framer Motion)
DESCRIPTION: Initiates an optimized appear animation for the opacity property of the box element, animating it from 0 to 1 over a specified duration with a linear ease.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/defer-handoff-layout-uselayouteffect.html#_snippet_4

LANGUAGE: javascript
CODE:
```
// Start optimised opacity animation
startOptimizedAppearAnimation(
  document.getElementById("box"),
  "opacity",
  \[0, 1\],
  {
    duration: duration * 1000,
    ease: "linear",
  }
)
```

----------------------------------------

TITLE: Setting up Projection Nodes and Verifying Layout (JavaScript)
DESCRIPTION: Imports necessary functions, retrieves DOM elements, and creates a hierarchy of projection nodes for the parent, mid, and child elements. It triggers updates, applies a class to the parent to change layout, and uses 'matchViewportBox' within 'frame.postRender' to assert the final positions of the mid and child elements.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/animate-relative-mixed-transition.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const { createNode, relativeEase } = window.Animate
const { matchViewportBox } = window.Assert
const { frame } = window.Projection

const parent = document.getElementById("parent")
const mid = document.getElementById("mid")
const child = document.getElementById("child")

const parentProjection = createNode(
  parent,
  undefined,
  {},
  { duration: 0 }
)
const midProjection = createNode(
  mid,
  parentProjection,
  {},
  { duration: 0 }
)
const childProjection = createNode(
  child,
  midProjection,
  {},
  { type: false }
)

parentProjection.willUpdate()
midProjection.willUpdate()
childProjection.willUpdate()

parent.classList.add("b")

parentProjection.root.didUpdate()

frame.postRender(() => {
  frame.postRender(() => {
    matchViewportBox(mid, {
      bottom: 50,
      left: 100,
      right: 150,
      top: 0,
    })
    matchViewportBox(child, {
      bottom: 50,
      left: 100,
      right: 150,
      top: 0,
    })
  })
})
```

----------------------------------------

TITLE: Emulating Server-Side Rendering with ReactDOMServer
DESCRIPTION: Renders the defined React component to an HTML string using ReactDOMServer.renderToString and sets it as the innerHTML of the root element, simulating server-side rendering output.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/defer-handoff-block.html#_snippet_3

LANGUAGE: javascript
CODE:
```
// Emulate server rendering of element
root.innerHTML = ReactDOMServer.renderToString(Component)
```

----------------------------------------

TITLE: Starting Optimized Transform Animation and Hydrating (Framer Motion/ReactDOM)
DESCRIPTION: Starts an optimized appear animation for the transform property (translateX) of the box element. It also includes a callback that triggers client-side hydration using `ReactDOM.hydrateRoot` after a delay, demonstrating the interaction between optimized animations and hydration.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/defer-handoff-layout-uselayouteffect.html#_snippet_5

LANGUAGE: javascript
CODE:
```
// Start WAAPI animation
const animation = startOptimizedAppearAnimation(
  document.getElementById("box"),
  "transform",
  \["translateX(0px)", "translateX(100px)"\],
  {
    duration: duration * 1000,
    ease: "linear",
  },
  (animation) => {
    setTimeout(() => {
      ReactDOM.hydrateRoot(
        root,
        React.createElement(Component)
      )
    }, (duration * 1000) / 2)
  }
)
```

----------------------------------------

TITLE: Styling Elements for Animation (CSS)
DESCRIPTION: Defines basic layout for the body and styles for the animated boxes, including initial state (opacity 0) and performance optimization (`will-change`).

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/benchmarks/pregenerated-background-color.html#_snippet_0

LANGUAGE: css
CODE:
```
body { display: flex; flex-wrap: wrap; gap: 10px; height: 100vh; overflow: hidden; }
.box { width: 50px; height: 50px; background-color: #f00; opacity: 0; will-change: auto !important; }
```

----------------------------------------

TITLE: Basic CSS Styling
DESCRIPTION: Provides fundamental CSS rules for the body and container elements, setting padding, margins, display properties, and dimensions for child elements.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/benchmarks/mix-color-value-framer-motion.html#_snippet_0

LANGUAGE: css
CODE:
```
body { padding: 0; margin: 0; } .container { padding: 100px; width: 100%; display: flex; flex-wrap: wrap; } .container > div { width: 100px; height: 100px; } .box { width: 10px; height: 100px; background-color: #fff; }
```

----------------------------------------

TITLE: Animating Layout Transition with Framer Motion (JavaScript)
DESCRIPTION: Demonstrates creating animation nodes for elements using a library like Framer Motion. It sets initial properties, unmounts the old node, mounts the new one with the same layoutId to trigger a transition, and performs assertions on the final state after rendering.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/shared-promote-new-mix-remove.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const { createNode } = window.Animate
const { matchViewportBox, matchVisibility, matchOpacity, matchBorderRadius, } = window.Assert
const { frame } = window.Projection
const box = document.getElementById("box-a")
const boxProjection = createNode(box, undefined, { layoutId: "a" })
boxProjection.setValue("opacity", 0.8)
boxProjection.willUpdate()
const newBox = document.createElement("div")
newBox.id = "box-b"
document.body.appendChild(newBox)
const newBoxProjection = createNode(newBox, undefined, { layoutId: "a", })
newBoxProjection.setValue("borderRadius", 20)
boxProjection.unmount()
document.body.removeChild(box)
newBoxProjection.root.didUpdate()
frame.postRender(() => {
  const midBox = { bottom: 250, left: 50, right: 200, top: 50 }
  matchViewportBox(newBox, midBox)
  matchVisibility(newBox, "visible")
  /**
   * Should animate from the old opacity to the new one
   * IMPORTANT: Don't make the previous opacity something non-default
   */
  matchOpacity(newBox, 0.9)
  matchBorderRadius(newBox, "6.66667% / 5%")
})
```

----------------------------------------

TITLE: Implementing Framer Motion Optimized Appear Animation with SSR (JavaScript)
DESCRIPTION: Imports necessary Framer Motion and assertion utilities, sets up a motion value for opacity with a validation check, defines a React component using motion.div with initial/animate opacity and a transition, server-renders the component, initiates an optimized appear animation, and then hydrates the root after a delay to simulate a real-world SSR hydration scenario.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/persist.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const { motion, animateStyle, startOptimizedAppearAnimation, optimizedAppearDataAttribute, motionValue, } = window.Motion
const { matchOpacity } = window.Assert
const root = document.getElementById("root")
const duration = 0.5
const opacity = motionValue(0)
opacity.onChange((v) => {
  if (v < 1) {
    showError(
      document.getElementById("box"),
      "opacity should never be less than 1"
    )
  }
})
// This is the tree to be rendered "server" and client-side.
const Component = React.createElement(motion.div, {
  id: "box",
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration, ease: "linear" },
  style: { opacity },
  /**
   * On animation start, check the values we expect to see here
   */
  onAnimationStart: () => {
    console.log(
      getComputedStyle(document.getElementById("box")).opacity
    )
    matchOpacity(document.getElementById("box"), 1)
  },
  [optimizedAppearDataAttribute]: "a",
})
// Emulate server rendering of element
root.innerHTML = ReactDOMServer.renderToString(Component)
startOptimizedAppearAnimation(
  document.getElementById("box"),
  "opacity",
  [0, 1],
  {
    duration: duration * 1000,
    ease: "linear",
  },
  (animation) => {
    /**
     * Give it time to commit the finished animation
     */
    setTimeout(() => {
      // Hydrate root mid-way through animation
      ReactDOM.hydrateRoot(root, Component)
    }, duration * 1000 + 1000)
  }
)
```

----------------------------------------

TITLE: Implementing Framer Motion Layout and Optimized Animations (JavaScript)
DESCRIPTION: Defines a React component using Framer Motion for layout and optimized appear animations. It simulates server-side rendering, hydrates the component, and initiates various animations including transform, opacity, and background color.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/optimized-appear/defer-handoff-layout-child.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const { motion, animateStyle, animate, startOptimizedAppearAnimation, optimizedAppearDataAttribute, motionValue, frame, } = window.Motion
const { matchViewportBox, xTransformEquals } = window.Assert
const root = document.getElementById("root")
const duration = 0.5
const x = motionValue(0)
let isFirstFrame = true
function Component() {
  const \[top, setTop\] = React.useState(0)
  React.useEffect(() => {
    setTimeout(() => {
      setTop(100)
    }, 100)
  }, \[\])
  return React.createElement(motion.div, {
    id: "container",
    className: "box",
    transition: {
      duration,
      ease: "linear",
      layout: {
        ease: () => 1,
        duration: 10
      },
    },
    style: {
      top,
      position: "relative",
      background: top ? "red" : "blue",
    },
    layout: true,
    children: "Content",
    children: React.createElement(motion.div, {
      id: "optimised-box",
      className: "box",
      initial: {
        x: 0,
        opacity: 0,
        backgroundColor: "#f00",
      },
      animate: {
        x: 100,
        opacity: 1,
        backgroundColor: "#00f",
      },
      transition: {
        duration,
        ease: "linear",
      },
      style: {
        x,
        position: "relative",
      },
      onAnimationStart: () => {
        setTimeout(() => {
          const box = document.getElementById("optimised-box")
          if (
            box.style.opacity === window.getComputedStyle(box).opacity ||
            box.style.backgroundColor === window.getComputedStyle(box)
            .backgroundColor ||
            xTransformEquals(box)
          ) {
            showError(
              box,
              \`Optimised animations cancelled by ancestor layout animations\`
            )
          }
        }, 150)
      },
      \[optimizedAppearDataAttribute\]: "a",
      children: "Content",
    }),
  })
}
// Emulate server rendering of element
root.innerHTML = ReactDOMServer.renderToString(
  React.createElement(Component)
)
// Start optimised opacity animation
startOptimizedAppearAnimation(
  document.getElementById("optimised-box"),
  "opacity",
  \[0, 1\],
  {
    duration: duration * 1000,
    ease: "linear",
  }
)
startOptimizedAppearAnimation(
  document.getElementById("optimised-box"),
  "backgroundColor",
  \["#f00", "#00f"\],
  {
    duration: duration * 1000,
    ease: "linear",
  }
)
// Start WAAPI animation
const animation = startOptimizedAppearAnimation(
  document.getElementById("optimised-box"),
  "transform",
  \["translateX(0px)", "translateX(100px)"\],
  {
    duration: duration * 1000,
    ease: "linear",
  },
  (animation) => {
    setTimeout(() => {
      ReactDOM.hydrateRoot(
        root,
        React.createElement(Component)
      )
    }, (duration * 1000) / 4)
  }
)
```

----------------------------------------

TITLE: GSAP Interpolate Function Example
DESCRIPTION: Demonstrates the use of `gsap.utils.interpolate` to mix unit values (CSS variables and pixel values). It then runs a loop to test the function and measures performance.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/benchmarks/mix-unit-value-greensock.html#_snippet_1

LANGUAGE: javascript
CODE:
```
/** * Create an interpolate function that mixes unit values. */
const px = gsap.utils.interpolate(
  "var(--test-1, 1) 10px",
  "var(--test-9, 3) 60px"
)
const numRuns = 10
let startTime = performance.now()
for (let i = 0; i < numRuns; i++) {
  console.log(px(i / numRuns))
}
console.log(`First run: ${performance.now() - startTime}ms`)
```

----------------------------------------

TITLE: Run Bootstrap Command (Shell)
DESCRIPTION: Executes the 'bootstrap' target defined in the project's Makefile to set up the local development environment, typically involving installing dependencies and linking packages.

SOURCE: https://github.com/grx7/framer-motion/blob/main/CONTRIBUTING.md#_snippet_0

LANGUAGE: Shell
CODE:
```
make bootstrap
```

----------------------------------------

TITLE: Setting up Framer Motion Projection Nodes and Testing (JavaScript)
DESCRIPTION: Initializes Framer Motion projection nodes for existing ('a') and newly created ('b') DOM elements. It triggers layout updates and uses assertion functions (`checkFrame`) within `requestAnimationFrame` loops to verify the state of the projection tree.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/perf-shared-single.html#_snippet_1

LANGUAGE: javascript
CODE:
```
const { createNode } = window.Animate
const { matchViewportBox, checkFrame } = window.Assert
const { frame } = window.Projection
const a = document.getElementById("a")
const aProjection = createNode(
  a,
  undefined,
  { layoutId: "box" },
  { duration: 0.1 }
)
aProjection.willUpdate()
const b = document.createElement("b")
b.id = "b"
document.body.appendChild(b)
const bProjection = createNode(
  b,
  undefined,
  { layoutId: "box" },
  { duration: 0.1 }
)
aProjection.root.didUpdate()
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    console.log(window.ProjectionFrames)
    checkFrame(a, 1, {
      totalNodes: 3,
      resolvedTargetDeltas: 1, // We only need to resolve a target for the lead node
      recalculatedProjection: 2, // But recalculate a projection for both
    })
  })
})
```

----------------------------------------

TITLE: Styling Basic Elements for Layout Testing (CSS)
DESCRIPTION: Defines basic styles for body, two box elements (#box-a, #box-b), a trigger element (#trigger-overflow), and a rule for incorrect layout state. These styles set dimensions, positioning, background colors, and visual indicators for testing.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/shared-promote-new-mix-skew.html#_snippet_0

LANGUAGE: css
CODE:
```
body { padding: 0; margin: 0; } #box-a { width: 100px; height: 100px; background-color: #00cc88; } #box-b { position: absolute; top: 100px; left: 100px; width: 200px; height: 300px; background-color: #09f; } #trigger-overflow { width: 1px; height: 1px; position: absolute; top: 2000px; left: 2000px; } \[data-layout-correct="false"\] { background: #dd1144 !important; opacity: 0.5; }
```

----------------------------------------

TITLE: Applying Projection and Asserting Layout (JavaScript)
DESCRIPTION: Retrieves utility functions from window.Projection, window.Undo, and window.Assert. Gets DOM elements, captures their initial bounding boxes, creates projection nodes for them, sets a border radius value on one projection, groups the projections, triggers layout updates, changes the container's flex direction, and finally, in a post-render callback, asserts the viewport box, opacity, and border radius of the elements against expected values.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/flexbox-siblings-layout-group.html#_snippet_1

LANGUAGE: JavaScript
CODE:
```
const { frame, nodeGroup } = window.Projection
const { createNode } = window.Undo
const { matchOpacity, matchBorderRadius, matchViewportBox } = window.Assert
const container = document.getElementById("container")
const a = document.getElementById("a")
const b = document.getElementById("b")
const aOrigin = a.getBoundingClientRect()
const bOrigin = b.getBoundingClientRect()
const aProjection = createNode(a)
const bProjection = createNode(b)
aProjection.setValue("borderRadius", 20)
const group = nodeGroup()
group.add(aProjection)
group.add(bProjection)
aProjection.willUpdate()
container.style.flexDirection = "column-reverse"
aProjection.root.didUpdate()
frame.postRender(() => {
  window.scrollTo(0, 0)
  matchViewportBox(a, aOrigin)
  matchViewportBox(b, bOrigin)
  matchOpacity(a, 1)
  matchOpacity(b, 1)
  matchBorderRadius(a, "13.3333% / 10%")
  matchBorderRadius(b, "")
})
```

----------------------------------------

TITLE: Styling Layout Elements with CSS
DESCRIPTION: Defines basic styles for body, boxes, buttons, and child elements, including positioning, dimensions, background colors, and a class for button width change. Also includes a rule for highlighting elements with incorrect layout.

SOURCE: https://github.com/grx7/framer-motion/blob/main/dev/html/public/projection/shared-promote-target.html#_snippet_0

LANGUAGE: css
CODE:
```
body { padding: 0; margin: 0; } #box-a { position: absolute; left: 100px; top: 100px; width: 200px; height: 200px; background-color: #00cc88; } #box-b { position: absolute; left: 600px; top: 100px; width: 200px; height: 200px; background-color: #09f; } #button { width: 100px; height: 100px; top: 0; left: 0; background-color: rgb(132, 0, 255); } #button.b { width: 300px; } #child-a, #child-b { position: absolute; left: 0; top: 0; width: 50px; height: 50px; background-color: yellow; } #trigger-overflow { width: 1px; height: 1px; position: absolute; top: 2000px; left: 2000px; } \[data-layout-correct="false"\] { background: #dd1144 !important; opacity: 0.5; }
```