# Playground — Scripts

Utilities for the monorepo playground. Currently two commands:

- **`pnpm new`** — scaffold a new project into `projects/<name>` from a template.
- **`tp`** — fuzzy-jump to a project from anywhere inside the repo.

Both work cross-platform: Git Bash, WSL, macOS, Linux, PowerShell.

---

## Layout

```txt
templates/ # one folder per template, auto-discovered
vanilla-js/
template.json
package.json
index.html
src/
scripts/
new.mjs # scaffold wizard
tp.mjs # fuzzy-jump (Node side)
shell-install.mjs # optional: wires tp into your rc file
shell/
tp.bash # bash + zsh + Git Bash
tp.fish # fish
tp.ps1 # PowerShell
projects/ # generated projects live here
docs/
scripts.md # this file
```

---

## Install (one time)

```bash
pnpm add -D -w @inquirer/prompts picocolors execa
```

---

## `pnpm new` — scaffold a project

Generates `projects/<name>` from a template in `templates/`. Templates are discovered
automatically — adding a stack means dropping a folder, no code changes.

### Usage

```bash
pnpm new
```

You'll be prompted to:

1. **Pick a template** (arrow keys, `Enter` to confirm).
2. **Name the project** — letters, numbers, `-`, `_`. Must not already exist.
3. **Confirm `postInstall`** (if the template defines one) — e.g. `pnpm install`.

### Example session

```txt
$ pnpm new

? Pick a template Vanilla JS HTML/CSS/JS with a Vite dev server
? Project name hello-world
✔ Created projects/hello-world
? Run "pnpm install"? (Y/n)
```

### Adding a template

```bash
mkdir -p templates/express-api
```

```json
{
"label": "Express API",
"description": "Node + Express + TypeScript, minimal",
"postInstall": "pnpm install"
}
```

Optional file: if `templates/<id>/template.json` is missing, the folder name is used as
the label and no `postInstall` runs.

### `template.json`

| Field         | Type   | Required | Description                                                                 |
| ------------- | ------ | -------- | --------------------------------------------------------------------------- |
| `label`       | string | no       | Pretty name shown in the wizard. Defaults to the folder name.               |
| `description` | string | no       | Dimmed text next to the label.                                              |
| `postInstall` | string | no       | Shell command run inside the new project after copy, only if user confirms. |

### Placeholders

Any **text** file in the template is scanned for `{{var}}` and substituted:

| Placeholder | Value                            |
| ----------- | -------------------------------- |
| `{{name}}`  | The project name the user typed. |

Rules:

- Matches `\{\{\s*([\w-]+)\s*\}\}` — whitespace inside braces is fine.
- Unknown keys are replaced with an empty string.
- Binary files are copied byte-for-byte (detected by a UTF-8 decode failure).
- `template.json` is **not** copied into the new project.
- Anything else (`.gitignore`, dotfiles, nested folders) is copied as-is.

### Conventions

- **id**: kebab-case, unique, matches the folder name (`nextjs-mini`, `go-cli`).
- **Don't pin a package manager** inside templates. Let `postInstall` decide.
- **Don't commit lockfiles** into templates. `postInstall` produces them.
- **No secrets** — templates are committed to git.
- **Cross-platform `postInstall`**: prefer tooling commands (`pnpm install`,
  `cargo fetch`, `go mod download`). Avoid bash-only syntax like `$(...)`.
  `&&` and `||` are fine (both `cmd.exe` and POSIX shells support them).

### Non-goals

- No conditional file inclusion (`if os === 'win32'`). Add a second template instead.
- No variable prompts beyond `{{name}}` yet. The `discoverTemplates()` seam in
  `scripts/new.mjs` is where you'd add `variables: [...]` to `template.json` later.
- No overwrite. If `projects/<name>` exists, the wizard aborts.

### Troubleshooting `new`

- **Template doesn't appear** — folder must be a direct child of `templates/` and readable.
- **Binary file mangled** — the copy path checks for UTF-8 replacement characters; if you
  still see corruption, add an explicit `binary: [".png"]` list to `template.json`.
- **`postInstall` fails** — the wizard streams child stdout/stderr, and the project is
  kept. Fix and run the command manually inside the new project.

---

## `tp` — fuzzy-jump to a project

`tp` **must** be a shell function, because `cd` cannot be done by a child process. The
function lives in this repo (`scripts/shell/`); your dotfiles only need a single `source`
line. Updates ship through git.

### Install

Add **one** line to your shell's rc file, pointing at the repo:

**bash / zsh (Git Bash, WSL, macOS, Linux)** — `~/.bashrc` or `~/.zshrc`:

```bash
source /absolute/path/to/repo/scripts/shell/tp.bash
```

**fish** — `~/.config/fish/config.fish`:

```fish
source /absolute/path/to/repo/scripts/shell/tp.fish
```

**PowerShell** — `$PROFILE` (open with `notepad $PROFILE`):

```powershell
. C:\absolute\path\to\repo\scripts\shell\tp.ps1
```

Then reload the shell (`source ~/.bashrc`, or restart the terminal).

#### Automatic install (optional)

```bash
pnpm shell:install
```

Appends the correct `source` line to the correct rc file, idempotently. Safe to run twice.

### Usage

```bash
tp # interactive fuzzy prompt
tp web # non-interactive: jump to first match of "web"
```

Inside the prompt:

- **Type** to filter — substring match, case-insensitive.
- **↑ / ↓** to move.
- **Enter** to jump — you land in `projects/<name>`.
- **Ctrl+C** to abort.

### How it works

1. The `tp` shell function runs `scripts/tp.mjs` with `TP_RESULT_FILE=/tmp/tp.XXXX`.
2. Node prompts, resolves the chosen project, writes the absolute path to that file.
3. The shell function reads it back and calls `cd` in **your** shell.

That indirection is required — a Node child process cannot `cd` its parent.
If `TP_RESULT_FILE` isn't set (e.g. running the script directly), Node falls back to a
temp file in `os.tmpdir()` and prints the path to stderr.

### Direct script use

Useful for scripting and CI:

```bash
node scripts/tp.mjs --list # print all project paths, one per line (stdout)
node scripts/tp.mjs web # print path of first match containing "web"
```

### Troubleshooting `tp`

**`type tp` says "not found"**
Git Bash / bash didn't source your `.bashrc`. Create `~/.bash_profile` with:

```bash
[ -f ~/.bashrc ] && . ~/.bashrc
```

Then `source ~/.bashrc && type tp`. It should print `tp is a shell function`.

**`node: cannot find module 'C:\c\Users\...'`**
Git Bash handed a POSIX path (`/c/...`) to Windows `node.exe`. The repo's `tp.bash`
handles this via `cygpath -m`; if you copied the function manually, make sure the
conversion is present.

**`tp: cannot write result file C:/tmp/tp.XXXX`**
`mktemp` produced `/tmp/...`, and Node tried `C:\tmp\...`. Same fix — use the repo's
`tp.bash`, which converts with `cygpath -m` before passing to Node.

**Fuzzy prompt looks garbled / arrow keys don't work (Git Bash / mintty)**
Rare on Node ≥ 18. As a workaround, run via `winpty node scripts/tp.mjs`, or use
Windows Terminal for that shell.

**`cd: too many arguments`**
The result file has whitespace or multiple lines. `tp.mjs` writes exactly one line
with no trailing newline — if you forked the script, keep it that way.

### What NOT to do

- **Don't** add `"tp": "node scripts/tp.mjs"` to `package.json` as a shortcut for the
  interactive prompt. `pnpm tp` runs in a child process; the `cd` happens there and
  vanishes when the script exits. You'll see the prompt, you'll pick a project, and
  nothing will move. That's why `tp` is a shell function, not an npm script.

---

## Verify

```bash

# 1. Script works standalone

node scripts/tp.mjs --list

# 2. Shell function is loaded

type tp # → tp is a shell function

# 3. End-to-end

tp

# 4. Scaffold flow

pnpm new
```

If (1) works but (3) doesn't, the shell function isn't loaded — re-source your rc file.
If (1) prints nothing, `projects/` is empty or missing.

---

## Extending

Ideas that fit the current seams without restructuring:

- **Per-template variables** — add `variables: [{ name, message, default }]` to
  `template.json`, and extend `copyTemplate` in `scripts/new.mjs` to prompt and merge.
- **`tp --here`** — open the current project in `$EDITOR`.
- **`ls` script** — list projects with their `git status` and last commit.
- **Windows-native `tp.cmd` shim** — lets `tp` work from `cmd.exe` too. Same repo file,
  no dotfile changes beyond `PATH`.
  ```
