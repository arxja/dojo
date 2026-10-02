# Shell integration

`tp` changes the working directory of **your current shell**, so it must be a shell
function. A Node script cannot `cd` its parent process — that's a Unix/Windows rule,
not a limitation of this repo.

Everything about `tp` lives in this repo. Your shell config only needs a single
`source` line that points at one of the files below. Updates to `tp` ship through
git — no need to edit dotfiles again.

## bash / zsh (Git Bash, WSL, macOS, Linux)

Add to `~/.bashrc` **or** `~/.zshrc`:

    source /absolute/path/to/repo/scripts/shell/tp.bash

Reload the shell (or `source ~/.bashrc`).

If `type tp` still says "not found", Git Bash skipped your `.bashrc`. Create
`~/.bash_profile` containing:

    [ -f ~/.bashrc ] && . ~/.bashrc

## fish

Add to `~/.config/fish/config.fish`:

    source /absolute/path/to/repo/scripts/shell/tp.fish

## PowerShell

Add to `$PROFILE` (open with `notepad $PROFILE`):

    . C:\absolute\path\to\repo\scripts\shell\tp.ps1

## No dotfiles at all

If you don't want to touch your shell config, source per session from inside the repo:

    source scripts/shell/tp.bash

Then `tp` works for that terminal. This is the pattern to use in CI or ephemeral
containers where the rc file is not under your control.

## Verify

    type tp                                    # should print: tp is a shell function
    node scripts/tp.mjs --list                 # script works standalone
    tp                                         # interactive jump
