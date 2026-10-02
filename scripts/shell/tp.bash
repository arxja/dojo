# scripts/shell/tp.bash
# Usage: add `source /path/to/repo/scripts/shell/tp.bash` to ~/.bashrc or ~/.zshrc.

# Resolve repo root once, at source time.
_tp_here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_tp_root="$(cd "$_tp_here/../.." && pwd)"
unset _tp_here

# Path normalizer: cygpath on Git Bash / MSYS, identity elsewhere.
if command -v cygpath >/dev/null 2>&1; then
  _tp_native() { cygpath -m "$1"; }
else
  _tp_native() { printf '%s' "$1"; }
fi

tp() {
  local root rf rf_win target

  # Prefer the repo we're currently in, fall back to the one we were sourced from.
  root="$(git rev-parse --show-toplevel 2>/dev/null)" || root="$_tp_root"

  [ -f "$root/scripts/tp.mjs" ] || {
    echo "tp: $root/scripts/tp.mjs not found" >&2
    return 1
  }

  rf="$(mktemp -t tp.XXXXXX 2>/dev/null || mktemp)"
  rf_win="$(_tp_native "$rf")"

  if TP_RESULT_FILE="$rf_win" node "$(_tp_native "$root/scripts/tp.mjs")"; then
    target="$(cat "$rf")"
    rm -f "$rf"
    if [ -n "$target" ] && [ -d "$target" ]; then
      cd "$target" || return 1
    else
      echo "tp: invalid target '$target'" >&2
      return 1
    fi
  else
    rm -f "$rf"
    return 1
  fi
}