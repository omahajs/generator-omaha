#!/bin/bash -eux
#Source install functions
. ./functions.sh

SSH_USER=${SSH_USERNAME:-vagrant}
log "Installing guest additions"
VBOX_VERSION=$(cat /home/${SSH_USER}/.vbox_version)
mount -o loop /home/${SSH_USER}/VBoxGuestAdditions_$VBOX_VERSION.iso /mnt >/dev/null 2>&1
sh /mnt/VBoxLinuxAdditions.run >/dev/null 2>&1
umount /mnt >/dev/null 2>&1
rm /home/${SSH_USER}/VBoxGuestAdditions_$VBOX_VERSION.iso
rm /home/${SSH_USER}/.vbox_version
if [[ $VBOX_VERSION = "4.3.10" ]]; then
    ln -s /opt/VBoxGuestAdditions-4.3.10/lib/VBoxGuestAdditions /usr/lib/VBoxGuestAdditions
fi