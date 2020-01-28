# shellcheck source=./util.sh
_dir="$( dirname "$0" )"
[ -f "${_dir}/util.sh" ] || bash "${_dir}/download-util.sh" || exit 1
source "${_dir}/util.sh"
unset _dir

# Returns 0 or 1 depending on if the user answered
# positively or negatively, respectively.
function prompt_question {
    local msg="$1 [y|n] "
    local input=
    while [ -z "$input" ]; do
        echo -en "$msg"
        read -rn1 input
        echo
        case "${input:0:1}" in
            "y"|"Y") return 0;;
            "n"|"N") return 1;;
            *) input=;;
        esac
    done
}
