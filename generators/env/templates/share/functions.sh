#!/usr/bin/env bash
#Collection of functions for installing and configuring software on Ubuntu
#Organized alphabetically
#All functions except setup_github_ssh require root privileges
fix_ssh_key_permissions() {
    KEY_NAME=${1:-id_rsa}
    chmod 600 ~/.ssh/${KEY_NAME}
    chmod 600 ~/.ssh/${KEY_NAME}.pub
}

install_atom() {
    log "Installing Atom editor"
    add-apt-repository -y ppa:webupd8team/atom >/dev/null 2>&1
    apt-get update >/dev/null 2>&1
    apt-get install -y atom >/dev/null 2>&1
}

install_couchdb() {
    log "Installing CouchDB"
    apt-get install -y curl >/dev/null 2>&1
    apt-get install -y couchdb >/dev/null 2>&1
    sed -i '/;port/c port = 5984' /etc/couchdb/local.ini
    sed -i '/;bind_address/c bind_address = 0.0.0.0' /etc/couchdb/local.ini
    lineNumber=$(($(echo $(grep -n '\[couch_httpd_auth\]' /etc/couchdb/local.ini) | awk -F':' '{print $1}')+1))
    sed -i "$lineNumber"'ipublic_fields = appdotnet, avatar, avatarMedium, avatarLarge, date, email, fields, freenode, fullname, github, homepage, name, roles, twitter, type, _id, _rev' /etc/couchdb/local.ini
    sed -i "$(($lineNumber+1))"'iusers_db_public = true' /etc/couchdb/local.ini
    lineNumber=$(($(echo $(grep -n '\[httpd\]' /etc/couchdb/local.ini) | awk -F':' '{print $1}')+1))
    sed -i "$lineNumber"'isecure_rewrites = false' /etc/couchdb/local.ini
    lineNumber=$(($(echo $(grep -n '\[couchdb\]' /etc/couchdb/local.ini) | awk -F':' '{print $1}')+1))
    sed -i "$lineNumber"'idelayed_commits = false' /etc/couchdb/local.ini
    #The default port can be changed by editing /etc/couchdb/local.ini
}

install_desktop() {
    log "Installing desktop"
    SSH_USER=${SSH_USERNAME:-vagrant}
    USERNAME=${SSH_USER}
    LIGHTDM_CONFIG=/etc/lightdm/lightdm.conf
    GDM_CUSTOM_CONFIG=/etc/gdm/custom.conf
    apt-get install -y --no-install-recommends ubuntu-desktop >/dev/null 2>&1
    apt-get install -y gnome-terminal overlay-scrollbar gnome-session-fallback >/dev/null 2>&1
    apt-get install -y firefox chromium-browser ubuntu-restricted-addons indicator-multiload xclip >/dev/null 2>&1
    apt-get install -y figlet toilet >/dev/null 2>&1
    mkdir -p $(dirname ${GDM_CUSTOM_CONFIG})
    echo "[daemon]" >> $GDM_CUSTOM_CONFIG
    echo "# Enabling automatic login" >> $GDM_CUSTOM_CONFIG
    echo "AutomaticLoginEnable=True" >> $GDM_CUSTOM_CONFIG
    echo "AutomaticLoginEnable=${USERNAME}" >> $GDM_CUSTOM_CONFIG
    echo "[SeatDefaults]" >> $LIGHTDM_CONFIG
    echo "autologin-user=${USERNAME}" >> $LIGHTDM_CONFIG
}

install_docker() {
    log "Preparing Docker dependencies"
    apt-get install -y linux-image-generic-lts-trusty linux-headers-generic-lts-trusty xserver-xorg-lts-trusty >/dev/null 2>&1
    apt-key adv --keyserver hkp://pgp.mit.edu:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D >/dev/null 2>&1
    echo "deb https://apt.dockerproject.org/repo ubuntu-trusty main" | sudo tee -a /etc/apt/sources.list.d/docker.list >/dev/null 2>&1
    apt-get update >/dev/null 2>&1
    if apt-cache policy docker-engine >/dev/null 2>&1; then
        log "Installing Docker"
        apt-get install -y docker-engine >/dev/null 2>&1
    fi
}

install_java8() {
    log "Installing JRE and JDK"
    echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | sudo /usr/bin/debconf-set-selections
    add-apt-repository -y ppa:webupd8team/java >/dev/null 2>&1
    apt-get update >/dev/null 2>&1
    apt-get install -y oracle-java8-installer >/dev/null 2>&1
}

install_jenkins() {
    log "Preparing to install Jenkins"
    wget -q -O - https://jenkins-ci.org/debian/jenkins-ci.org.key | sudo apt-key add - >/dev/null 2>&1
    sh -c 'echo deb http://pkg.jenkins-ci.org/debian binary/ > /etc/apt/sources.list.d/jenkins.list' >/dev/null 2>&1
    apt-get update >/dev/null 2>&1
    log "Installing Jenkins"
    apt-get install -y jenkins >/dev/null 2>&1
}

install_julia() {
    log "Adding Julia language PPA"
    apt-get install -y software-properties-common python-software-properties >/dev/null 2>&1
    add-apt-repository -y ppa:staticfloat/juliareleases >/dev/null 2>&1
    add-apt-repository -y ppa:staticfloat/julia-deps >/dev/null 2>&1
    apt-get update >/dev/null 2>&1
    log "Installing Julia language"
    apt-get install -y julia >/dev/null 2>&1
}

install_mesa() {
    log "Installing mesa"
    apt-add-repository ppa:xorg-edgers >/dev/null 2>&1
    apt-get update >/dev/null 2>&1
    apt-get install libdrm-dev >/dev/null 2>&1
    apt-get build-dep mesa >/dev/null 2>&1
    wget -O - http://llvm.org/apt/llvm-snapshot.gpg.key|sudo apt-key add -
    apt-get install -y clang-3.6 clang-3.6-doc libclang-common-3.6-dev >/dev/null 2>&1
    apt-get install -y libclang-3.6-dev libclang1-3.6 libclang1-3.6-dbg >/dev/null 2>&1
    apt-get install -y libllvm-3.6-ocaml-dev libllvm3.6 libllvm3.6-dbg >/dev/null 2>&1
    apt-get install -y lldb-3.6 llvm-3.6 llvm-3.6-dev llvm-3.6-doc >/dev/null 2>&1
    apt-get install -y llvm-3.6-examples llvm-3.6-runtime clang-modernize-3.6 >/dev/null 2>&1
    apt-get install -y clang-format-3.6 python-clang-3.6 lldb-3.6-dev >/dev/null 2>&1
    apt-get install -y libx11-xcb-dev libx11-xcb1 libxcb-glx0-dev libxcb-dri2-0-dev >/dev/null 2>&1
    apt-get install -y libxcb-dri3-dev libxshmfence-dev libxcb-sync-dev llvm >/dev/null 2>&1
}

install_mongodb() {
    log "Installing MongoDB"
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 >/dev/null 2>&1
    echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list >/dev/null 2>&1
    apt-get update >/dev/null 2>&1
    apt-get install -y mongodb-org >/dev/null 2>&1
    # Change config file to allow external connections
    sed -i '/bind_ip/c # bind_ip = 127.0.0.1' /etc/mongod.conf >/dev/null 2>&1
    # Change default port to 8000
    #sudo sed -i '/#port/c port = 8000' /etc/mongod.conf >/dev/null 2>&1
    service mongod restart >/dev/null 2>&1
    #The default port can be changed by editing /etc/mongod.conf
}

install_pandoc() {
    log "Installing Pandoc"
    apt-get install -y texlive texlive-latex-extra pandoc >/dev/null 2>&1
}

install_python() {
    log "Installing advanced Python support"
    apt-get install -y libzmq3-dev python-pip python-dev >/dev/null 2>&1
    apt-get install -y libblas-dev libatlas-base-dev liblapack-dev gfortran libfreetype6-dev libpng-dev >/dev/null 2>&1
    pip install --upgrade pip >/dev/null 2>&1
    pip install --upgrade virtualenv >/dev/null 2>&1
    pip install ipython[notebook] >/dev/null 2>&1
}

install_redis() {
    log "Installing redis"
    apt-get install -y redis-server >/dev/null 2>&1
    #Configure redis-server to accept remote connections
    sed -i 's/bind 127.0.0.1/bind 0.0.0.0/' /etc/redis/redis.conf
    service redis-server restart >/dev/null 2>&1
    #The default port can be changed by editing /etc/redis/redis.conf
}

log() {
    TIMEZONE=Central
    MAXLEN=35
    MSG=$1
    for i in $(seq ${#MSG} $MAXLEN)
    do
        MSG=$MSG.
    done
    MSG=$MSG$(TZ=":US/$TIMEZONE" date +%T)
    echo $MSG
}

setup_github_ssh() {
    if [ `whoami` == 'root' ]; then
      echo "✘ setup_github_ssh should be used without root privileges"
      return 0
    fi
    PASSPHRASE=${1:-123456}
    KEY_NAME=${2:-id_rsa}
    echo -n "Generating key pair......"
    ssh-keygen -q -b 4096 -t rsa -N ${PASSPHRASE} -f ~/.ssh/${KEY_NAME}
    echo "DONE"
    if [[ -e ~/.ssh/${KEY_NAME}.pub ]]; then
        if type xclip >/dev/null 2>&1; then
            cat ~/.ssh/${KEY_NAME}.pub | xclip -sel clip
            echo "✔ Public key has been saved to clipboard"
        else
            cat ~/.ssh/${KEY_NAME}.pub
        fi
        if [[ -s ~/.ssh/${KEY_NAME} ]]; then
            echo $'\n#GitHub alias\nHost me\n\tHostname github.com\n\tUser git\n\tIdentityFile ~/.ssh/'${KEY_NAME}$'\n' >> ~/.ssh/config
            echo "✔ git@me alias added to ~/.ssh/config for ${KEY_NAME}"
        fi
    else
        echo "Something went wrong, please try again."
    fi
}

setup_npm_proxy() {
if [ `whoami` != 'root' ]; then
  echo "✘ setup_npm_proxy should be used with root privileges"
  return 0
fi
PORT=${1:-4873}
cat << EOF > /etc/init/npm-proxy.conf
description "Sinopia NPM Proxy Server"
author      "Jason Wohlgemuth"

start on filesystem or runlevel [2345]
stop on shutdown

env HOME=${HOME}

script
    echo \$\$ > /var/run/npm-proxy.pid
    ${NVM_BIN}/node ${NVM_BIN}/sinopia
end script

pre-start script
    echo "registry = http://localhost:${PORT}/" >> ${HOME}/.npmrc
    echo "[`date`] Sinopia server STARTED" >> /var/log/npm-proxy.log
end script

pre-stop script
    sed -i '/registry =/d' ${HOME}/.npmrc
    rm /var/run/npm-proxy.pid
    echo "[`date`] Sinopia server STOPPED" >> /var/log/npm-proxy.log
end script
EOF
log "✔ npm-proxy service installed"
service npm-proxy start
log "✔ npm-proxy service started"
}

update() {
    log "Updating"
    apt-get update >/dev/null 2>&1
}
