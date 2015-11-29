#!/bin/bash -eux
#Ensure the scripts work on POSIX systems even if edited on Windows
sed -i 's/\r//' functions.sh
sed -i 's/\r//' setup.sh
#Source install functions
. ./functions.sh

# Disable the release upgrader
log "Disabling the release upgrader"
sed -i.bak 's/^Prompt=.*$/Prompt=never/' /etc/update-manager/release-upgrades
log "Updating list of repositories"
# apt-get update does not actually perform updates, it just downloads and indexes the list of packages
apt-get -y update >/dev/null 2>&1
if [[ $UPDATE  =~ true || $UPDATE =~ 1 || $UPDATE =~ yes ]]; then
    log "Performing dist-upgrade"
    apt-get -y dist-upgrade --force-yes >/dev/null 2>&1
    reboot
    sleep 60
fi
