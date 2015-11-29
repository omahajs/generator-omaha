#!/usr/bin/env bash
#Make setup.sh executable
chmod +x setup.sh
#Source install functions
. ./functions.sh

log "Installing nvm"
curl -so- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash >/dev/null 2>&1

log "Installing Atom plugins"
apm install file-icons sublime-block-comment atom-beautify language-docker >/dev/null 2>&1
apm install minimap minimap-selection minimap-find-and-replace minimap-git-diff >/dev/null 2>&1
apm install color-picker pigments hydrogen >/dev/null 2>&1

if type julia >/dev/null 2>&1; then
    log "Installing IJulia"
    julia -e 'Pkg.add("IJulia")' >/dev/null 2>&1
fi

log "Patching agnoster theme fonts"
wget https://github.com/powerline/powerline/raw/develop/font/PowerlineSymbols.otf >/dev/null 2>&1
wget https://github.com/powerline/powerline/raw/develop/font/10-powerline-symbols.conf >/dev/null 2>&1
mkdir ~/.fonts/
mkdir -p ~/.config/fontconfig/conf.d/
mv PowerlineSymbols.otf ~/.fonts/
fc-cache -vf ~/.fonts/ >/dev/null 2>&1
mv 10-powerline-symbols.conf ~/.config/fontconfig/conf.d/

SCRIPT_FOLDER=.${ORG_NAME:-techtonic}
mkdir -p ~/${SCRIPT_FOLDER}

if [[ -e functions.sh ]]; then
    mv functions.sh ~/${SCRIPT_FOLDER}
fi

if [[ -e setup.sh ]]; then
    mv setup.sh ~/${SCRIPT_FOLDER}
fi

if type atom >/dev/null 2>&1; then
    mv snippets.cson ~/.atom
else
    mv snippets.cson ~/${SCRIPT_FOLDER}
fi
