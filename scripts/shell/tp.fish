# scripts/shell/tp.fish
# Usage: add `source /path/to/repo/scripts/shell/tp.fish` to ~/.config/fish/config.fish.

set -l _tp_here (cd (dirname (status --current-filename)); and pwd)
set -g _tp_root (cd "$_tp_here/../.."; and pwd)

function tp
    set -l root (git rev-parse --show-toplevel 2>/dev/null)
    test -n "$root"; or set root $_tp_root

    test -f "$root/scripts/tp.mjs"; or begin
        echo "tp: $root/scripts/tp.mjs not found" >&2
        return 1
    end

    set -l rf (mktemp -t tp.XXXXXX)
    if env TP_RESULT_FILE=$rf node "$root/scripts/tp.mjs"
        set -l target (cat $rf)
        rm -f $rf
        if test -n "$target" -a -d "$target"
            cd $target
        else
            echo "tp: invalid target '$target'" >&2
            return 1
        end
    else
        rm -f $rf
        return 1
    end
end