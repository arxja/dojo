# Tusi Couple — Interactive Mathematical Animation

> An interactive canvas visualization of the Tusi couple, a 13th‑century mathematical mechanism by Naṣīr al-Dīn al‑Ṭūsī, rendered with smooth animation and real‑time controls.

## 🎨 About

This project is a single‑file HTML/CSS/JavaScript application that brings to life the **Tusi couple** — a mathematical device discovered by the Persian polymath Naṣīr al‑Dīn al‑Ṭūsī in the 13th century. The mechanism demonstrates how a point on a circle rolling inside a larger circle of twice the radius moves in a straight line (a diameter of the outer circle).

Visually, the animation shows multiple balls rolling inside a large circle, each with a glowing marked point. Despite each point sliding back and forth along a straight line, the whole ensemble appears to rotate — a beautiful optical illusion grounded in geometry.

The project features:

- **Real‑time animation** with requestAnimationFrame and delta‑time handling
- **Interactive controls** — adjust the number of balls and animation speed
- **Toggle layers** — show/hide circles, spokes, and tracks
- **Responsive design** — works on desktop and mobile with DPR‑aware canvas scaling
- **Click/space to pause** — convenient animation control
- **Elegant dark UI** — radial gradient background, monospace typography, and a frosted‑glass control panel

## ✨ Features

- **Geometric accuracy** — balls orbit at half the outer radius, marked points trace straight lines
- **Dynamic ball count** — from 1 to 16 balls, each with its own colored track
- **Adjustable speed** — from 0× to 2.6× animation speed
- **Layer toggles** — independently show/hide circles, spokes, and tracks
- **Responsive canvas** — handles window resizing and high‑DPI displays
- **Pause/resume** — click anywhere on the canvas or press Space
- **Smooth performance** — requestAnimationFrame loop with capped delta time
- **No dependencies** — pure vanilla HTML, CSS, and JavaScript

## 🎯 What You'll Learn

- **The Tusi couple** — how a circle rolling inside another produces straight‑line motion
- **Canvas 2D rendering** — drawing arcs, lines, and glowing points with shadows
- **Animation loops** — requestAnimationFrame with delta‑time and frame capping
- **Geometric transformations** — translating, rotating, and scaling in canvas
- **Interactive UI controls** — range sliders and toggle buttons with visual feedback
- **Responsive design** — devicePixelRatio‑aware canvas sizing
- **Mathematical visualization** — converting equations into visual elements

## 🎮 How to Use

1. **Open `index.html`** in any modern web browser — no build step or server required
2. **Adjust the controls** at the bottom of the screen:
   - **Balls** slider (1–16) — change the number of rolling balls
   - **Speed** slider (0–2.6×) — control animation speed
   - **Circles** / **Spokes** / **Tracks** buttons — toggle visual layers
3. **Click the canvas** or press **Space** to pause/resume the animation
4. **Resize the window** — the canvas automatically scales while maintaining aspect ratio

### Example Interactions

- Drag the "Balls" slider to 3 → three balls appear with 120° spacing
- Set Speed to 0 → animation freezes, allowing you to study the geometry
- Toggle "Tracks" off → only the balls and their spokes remain
- Press Space → pause the animation mid‑motion

## 🎨 Customization

### Colors

The ball colors are generated using HSL with hue = `(k * 360) / N`. To change the palette, modify the hue calculation:

```js
const hue = (k * 360) / N; // evenly spaced hues
// Change to a fixed range:
const hue = 200 + (k * 120) / N; // blue-to-green range
```

### Animation Speed

Adjust `BASE_OMEGA` to change the base rotation speed:

```js
const BASE_OMEGA = 1.15; // rad/s at 1.0× — increase for faster base speed
```

### Visual Style

- **Outer circle** — change `ctx.strokeStyle` and `lineWidth`
- **Glow effect** — modify `shadowBlur` and `shadowColor` on marked points
- **Background** — edit the `body` radial gradient in CSS
- **UI panel** — adjust `backdrop-filter`, colors, and border radius

### Adding New Layers

Extend the `state.show` object and add corresponding rendering blocks:

```js
state.show.numbers = false; // new toggle
// In render():
if (state.show.numbers) {
  // draw ball indices
}
```

## 📁 Project Structure

```
tusi-couple/
├── index.html    # Single‑file application (HTML + CSS + JavaScript)
└── README.md     # This file
```

The entire application is self‑contained in one file — perfect for learning, sharing, or embedding in other projects.

## 🚀 Run Locally

Simply open `index.html` in any modern browser:

```bash
# On macOS
open index.html

# On Windows
start index.html

# Or use a simple server (optional)
npx serve .
```

No installation, no dependencies, no build tools.

## 📐 Mathematical Background

The Tusi couple works because a circle of radius `r` rolling inside a circle of radius `R = 2r` traces a straight line. For a marked point at angle `β` on the inner circle:

- Ball center: `C = r · (cos ψ, sin ψ)` where `ψ = θ + 2πk/N`
- Marked point: `P = C + r · (cos β, sin β)` where `β = −θ`

The key identity `ψ − β = 2θ + 2πk/N` means the point always lies on the line through the origin at angle `α = πk/N`, oscillating between `−R` and `+R` along that line.

## 📝 License

MIT License — free to use, modify, and distribute.
