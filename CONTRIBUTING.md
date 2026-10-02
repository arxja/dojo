# 🤝 Contributing to the Dojo

First off, thank you for considering contributing to this project! 🎉 This repo is a growing
playground of small, self-contained projects across multiple stacks — web, Node, Go, Rust,
and whatever comes next. Contributions of any size are welcome.

This document explains how to add a project, what we expect, and how to get it merged.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Before You Start](#-before-you-start)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Project Structure](#-project-structure)
- [Scripts](#-scripts)
- [Development Guidelines](#-development-guidelines)
- [Adding a New Project](#-adding-a-new-project)
- [Adding a New Template](#-adding-a-new-template)
- [Commit Convention](#-commit-convention)
- [Pull Request Process](#-pull-request-process)
- [Code Review Checklist](#-code-review-checklist)
- [Getting Help](#-getting-help)
- [Recognition](#-recognition)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our standards of respect and
collaboration. By participating, you are expected to uphold these standards:

- **Be respectful** — Different viewpoints and experiences are valuable.
- **Be constructive** — Offer helpful feedback, not criticism.
- **Be collaborative** — Help others learn and grow.
- **Be inclusive** — Welcome contributors of all skill levels.
- **Be patient** — Not everyone has the same experience level.

---

## 🚦 Before You Start

### Check Existing Work

1. Browse the [Projects section](./README.md#-projects) to see what's already here.
2. Search [open issues](https://github.com/arxja/web-based-mini-projects/issues) for ongoing discussions.
3. Check [open PRs](https://github.com/arxja/web-based-mini-projects/pulls) to avoid duplicate work.

### Open an Issue First

For a new project, please open an issue before opening a PR. It avoids wasted effort if the
idea doesn't fit the repo's direction.

```txt
Project Name:      Your Project Name
Stack:             Vanilla JS | TypeScript | React | Node | Go | Rust | Other
Category:          Game | UI/UX | Utility | CLI | Library
Difficulty:        Beginner | Intermediate | Advanced
Description:       Brief description of what the project does
Learning Outcomes: What skills will this teach?
```

---

## 🎯 How Can I Contribute?

### Types of Contributions

| Type | Description | Impact |
|------|-------------|--------|
| 🆕 **New Project** | Add a new mini project | ⭐ High |
| 🧩 **New Template** | Add a scaffold for a new stack | ⭐ High |
| 🐛 **Bug Fixes** | Fix bugs in existing projects | ⭐ High |
| ✨ **Features** | Add features to existing projects | ⭐ Medium |
| 📝 **Documentation** | Improve READMEs, comments, guides | ⭐ Medium |
| 🎨 **UI/UX Improvements** | Better styling, responsiveness | ⭐ Medium |
| ⚡ **Performance** | Optimize code, reduce load times | ⭐ Low–Medium |
| 🔧 **Refactoring** | Clean up code, improve structure | ⭐ Low |
| 🧪 **Testing** | Add tests and fix edge cases | ⭐ Low |
| 🛠 **Tooling** | Improve `scripts/` helpers | ⭐ Medium |

### Priority Areas

- **TypeScript conversions** of existing JavaScript projects.
- **React / Next.js / Svelte versions** of vanilla JS projects.
- **Accessibility improvements** across all web projects.
- **Mobile responsiveness** for web projects.
- **New beginner-friendly projects** to help newcomers.
- **New templates** for stacks we don't cover yet.

---

## 📁 Project Structure

```txt
playground/
├── README.md                # Main docs
├── CONTRIBUTING.md          # This file
├── LICENSE                  # MIT
│
├── projects/                # Every project lives here
│   ├── flappy-bird/         # Vanilla JS example
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   └── README.md
│   │
│   ├── go-cli-demo/         # Go example
│   │   ├── main.go
│   │   ├── go.mod
│   │   └── README.md
│   │
│   └── your-new-project/
│       └── README.md
│
├── templates/               # Scaffolds used by `pnpm new`
│   ├── vanilla-js/
│   │   ├── template.json
│   │   ├── index.html
│   │   └── main.js
│   └── express-api/
│       ├── template.json
│       └── src/
│
├── scripts/                 # Repo tooling
│   ├── new.mjs              # Project scaffold wizard
│   ├── tp.mjs               # Fuzzy-jump helper (Node side)
│   ├── shell-install.mjs    # Wires `tp` into your rc file
│   └── shell/
│       ├── tp.bash
│       ├── tp.fish
│       └── tp.ps1
│
├── docs/
│   └── scripts.md           # Usage of `pnpm new` and `tp`
│
└── assets/                  # Shared assets
```

Naming rules:

- **Project folders**: `kebab-case` (`flappy-bird`, `go-cli-demo`).
- **Template folders**: `kebab-case`, and they're the template's id (`vanilla-js`, `express-api`).
- **One project = one folder** under `projects/`. Self-contained unless stated otherwise.

---

## 🛠 Scripts

Two helpers live in `scripts/`. Full usage: [`docs/scripts.md`](./docs/scripts.md).

### `pnpm new`

Interactive scaffold. Pick a template, type a name, done. Creates `projects/<name>` from
`templates/<id>/` and runs the template's `postInstall` if the template defines one.

```bash
pnpm new
```

### `tp`

Fuzzy-jump to a project. Must be installed as a shell function once — see
[`docs/scripts.md`](./docs/scripts.md#tp--fuzzy-jump-to-a-project).

```bash
tp              # fuzzy prompt, Enter to jump
tp web          # non-interactive: first project matching "web"
```

---

## 📏 Development Guidelines

### Code Quality Standards

#### HTML (web projects)

```html
<!-- ✅ DO — semantic HTML -->
<header>
  <nav>
    <ul>
      <li><a href="#home">Home</a></li>
    </ul>
  </nav>
</header>

<!-- ❌ DON'T — div soup -->
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>
```

#### CSS (web projects)

```css
/* ✅ DO — meaningful class names */
.game-container { }
.score-display { }
.restart-button { }

/* ❌ DON'T — generic, meaningless names */
.box { }
.thing { }
.btn1 { }
```

#### JavaScript / TypeScript

```js
// ✅ DO — clear naming, short functions
function calculateFinalScore(baseScore, multiplier) {
  const bonus = calculateBonus(baseScore);
  return (baseScore + bonus) * multiplier;
}

// ✅ DO — comment non-obvious logic
// AABB collision (Axis-Aligned Bounding Box)
function checkCollision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

// ❌ DON'T — vague names, long functions, no comments
function calc(b, m) {
  let x = b * 0.1;
  if (b > 100) x = b * 0.15;
  return (b + x) * m;
}
```

#### Go

```go
// ✅ DO — small funcs, wrapped errors, meaningful names
func LoadConfig(path string) (*Config, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("read config %q: %w", path, err)
	}
	var cfg Config
	if err := yaml.Unmarshal(raw, &cfg); err != nil {
		return nil, fmt.Errorf("parse config %q: %w", path, err)
	}
	return &cfg, nil
}
```

#### Rust

```rust
// ✅ DO — propagate errors, avoid unwrap in library code
pub fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let raw = std::fs::read_to_string(path)
        .map_err(|e| ConfigError::Read(path.to_path_buf(), e))?;
    serde_yaml::from_str(&raw)
        .map_err(|e| ConfigError::Parse(path.to_path_buf(), e))
}
```

### Project Requirements

Requirements depend on the project type. Every project **must**:

| # | Requirement | Description |
|---|-------------|-------------|
| 1 | ✅ **`README.md`** | Follows the project README template (below). |
| 2 | ✅ **Self-contained** | All assets live inside the project folder. |
| 3 | ✅ **Runs from a clean clone** | Exact commands documented in the README. |
| 4 | ✅ **Clean console / logs** | No errors or leftover `console.log` / `println!` / `fmt.Println` in normal operation. |
| 5 | ✅ **No secrets, no huge binaries** | Everything is committable. |

Additional requirements per stack:

| Stack | Must also |
|-------|-----------|
| **Web (vanilla)** | Have an `index.html` that works when opened directly. Be responsive on mobile, tablet, and desktop. Test in Chrome, Firefox, and Safari. Have **no** npm dependencies unless explicitly justified. |
| **Node / TS** | Have a working `build` and `dev` script. Include the lockfile. Not require global installs. |
| **Go** | Have a working `go build ./...` and `go vet ./...`. Module path and `go.mod` are committed. |
| **Rust** | Have a working `cargo build` and `cargo clippy` with no warnings. `Cargo.lock` committed for bins. |
| **Other** | Add a template (see below) so others can reproduce the setup. |

### Optional, but encouraged

- 🌙 Dark mode support (web).
- ⌨️ Keyboard accessibility (web).
- 🎨 CSS custom properties for theming (web).
- 📱 Touch-friendly interactions (web).
- 💾 Local storage for saving progress (web).
- 🧪 A minimal test or smoke check (any stack).
- 📸 A screenshot in the project README (web or GUI).

### Project README template

```markdown
# Project Name

> A brief one-line description.

## 🎮 About

Detailed description of the project, what it does, and why it's useful for learning.
Pick the emoji that fits: 🎮 (game), 🎨 (UI/UX), 🔧 (utility), ⌨️ (CLI), 📚 (library).

## ✨ Features

- Feature 1
- Feature 2

## 🎯 What You'll Learn

- Skill / concept 1
- Skill / concept 2

## 🚀 Run Locally

### Web (vanilla)
Open `index.html` in your browser. No installation required.

### Node / TypeScript
```bash
pnpm install
pnpm dev
```

### Go
```bash
go run .
```

### Rust
```bash
cargo run
```

## 🎨 Customization

Tips for modifying colors, difficulty, or behaviour.

## 📁 Project Structure

```txt
project-name/
├── index.html    # (or main.go, src/main.rs, etc.)
├── ...
└── README.md
```

## 📝 License

MIT
```

---

## ➕ Adding a New Project

### Preferred: use the scaffold

```bash
pnpm new
```

Pick a template, type a name, and the wizard creates `projects/<name>` for you. If the
template defines a `postInstall`, you'll be asked whether to run it (e.g. `pnpm install`,
`cargo fetch`, `go mod download`).

### Manual (only if no template fits)

If you're adding a project in a stack we don't yet have a template for, please **add the
template first** (see [Adding a New Template](#-adding-a-new-template)), then scaffold from it.
If you must do it by hand:

```bash
git checkout -b project/your-project-name
mkdir -p projects/your-project-name
cd projects/your-project-name
# create files, write README.md, ...
```

### Update the main README

Add your project to the projects table:

```markdown
| # | **Your Project Name** | Category | Stack | Difficulty | ✅ | [→](projects/your-project-name) |
```

And add it to the Learning Path section under the right level.

### Commit, push, open a PR

```bash
git add .
git commit -m "feat: add Your Project Name"
git push origin project/your-project-name
```

---

## 🧩 Adding a New Template

Templates live in `templates/<id>/` and are discovered automatically — no registry to edit.
A template is just a folder containing the files you want in a new project, plus an optional
`template.json`:

```json
{
  "label": "Express API",
  "description": "Node + Express + TypeScript, minimal",
  "postInstall": "pnpm install"
}
```

- **`label`** — pretty name in the wizard. Defaults to the folder name.
- **`description`** — dimmed text next to the label.
- **`postInstall`** — shell command run inside the new project after copy, only on confirm.
  Keep it cross-platform: prefer tooling commands (`pnpm install`, `cargo fetch`,
  `go mod download`). `&&` and `||` are fine; avoid bash-only syntax like `$(...)`.

### Placeholders

Any **text** file in the template is scanned and `{{name}}` is replaced with the project
name. Binary files are copied byte-for-byte. `template.json` is not copied.

### Conventions

- **id**: kebab-case, unique, matches the folder name.
- Don't pin a package manager inside templates — let `postInstall` decide.
- Don't commit lockfiles into templates — `postInstall` produces them.
- No secrets, no large binaries.

Full details: [`docs/scripts.md`](./docs/scripts.md#pnpm-new--scaffold-a-project).

---

## 📝 Commit Convention

We loosely follow [Conventional Commits](https://www.conventionalcommits.org/). Use the
prefix that matches the change:

| Prefix | Usage |
|--------|-------|
| ✅ `feat:` | New project, template, or feature |
| ✅ `fix:` | Bug fix |
| ✅ `style:` | Code style, formatting (no behaviour change) |
| ✅ `refactor:` | Code restructuring (no behaviour change) |
| ✅ `perf:` | Performance improvement |
| ✅ `docs:` | Documentation only |
| ✅ `test:` | Adding or fixing tests |
| ✅ `build:` | Build system, deps, lockfiles |
| ✅ `ci:` | CI configuration |
| ✅ `chore:` | Maintenance, tooling, misc |
| ✅ `improve:` | Enhancement to an existing project |

### Examples

```bash
git commit -m "feat: add Weather App project"
git commit -m "feat: add express-api template"
git commit -m "fix: correct score reset in Snake game"
git commit -m "docs: update contributing guidelines"
git commit -m "improve: add dark mode to Calculator"
git commit -m "chore: bump @inquirer/prompts"
```

---

## 🔄 Pull Request Process

### PR Title Format

```txt
feat: Add [Project Name]
feat: Add [template-id] template
fix: Fix [brief description]
improve: Add [feature] to [Project Name]
docs: Update [section]
```

### PR Description Template

```markdown
## 📝 Description
Brief description of your changes.

## 🎯 Type of Change
- [ ] New project
- [ ] New template
- [ ] Bug fix
- [ ] Feature addition
- [ ] Documentation
- [ ] Tooling / scripts
- [ ] Other: ____

## 🧩 Project Details (for new projects)
- **Stack:**   Vanilla JS / TS / React / Node / Go / Rust / Other
- **Category:** Game / UI-UX / Utility / CLI / Library
- **Difficulty:** Beginner / Intermediate / Advanced
- **Scaffolded with `pnpm new`?** Yes / No (explain)

## ✅ Checklist
- [ ] Runs from a clean clone using the commands in its README
- [ ] No console errors or leftover debug prints
- [ ] `README.md` included and follows the template
- [ ] Main `README.md` updated with the project entry
- [ ] Code follows style guidelines for its stack
- [ ] Self-contained project folder

## 📸 Screenshots
(Add before/after screenshots if applicable.)

## 🔗 Related Issues
Closes #issue-number
```

---

## ✅ Code Review Checklist

Reviewers will check for:

| # | Check | Details |
|---|-------|---------|
| 1 | 📁 **Structure** | Project follows folder conventions; name is kebab-case. |
| 2 | 📖 **README** | Complete, follows the template, includes run instructions. |
| 3 | 🧠 **Logic** | Clean, commented where non-obvious, error-free. |
| 4 | 🏷️ **Semantics** | Correct idioms for the stack (semantic HTML, wrapped Go errors, no `unwrap` in lib code, etc.). |
| 5 | ♿ **Accessibility** | Web projects: alt text, ARIA where needed, keyboard nav. |
| 6 | 📵 **Dependencies** | Vanilla JS projects: none. Others: minimal and justified. |
| 7 | 🚫 **Console** | No errors, no leftover debug output. |
| 8 | 📊 **Main README** | Updated with the new entry. |
| 9 | 🧩 **Template (if new)** | Discoverable, `template.json` valid, `postInstall` cross-platform. |
| 10 | 🛠 **Scripts (if touched)** | `scripts/*` runs on Git Bash, macOS, Linux, PowerShell. |

---

## 🆘 Getting Help

- Ask questions in your issue or PR comments.
- Look at existing projects in `projects/` for reference.
- Read the Learning Path in the main README for complexity guidance.
- For tooling (`pnpm new`, `tp`), see [`docs/scripts.md`](./docs/scripts.md).

---

## 🌟 Recognition

All contributors will be recognized:

- Your name appears in the project's commit history.
- Your project stays in the collection for others to learn from.
- You're helping developers improve their skills.

---

## Review Process

1. **Automated checks** — ensure nothing obvious is broken.
2. **Maintainer review** — a maintainer will review your PR.
3. **Feedback** — address any requested changes.
4. **Approval** — PR gets merged.
5. Response time is typically 3–5 days. Be patient and open to feedback!

<div align="center">

Thank you for contributing! 🎉

Every project you add helps someone learn.

**[⬆ Back to top](#-contributing-to-the-playground)**

</div>