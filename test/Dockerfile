FROM node:5.0.0
MAINTAINER Jason Wohlgemuth
ENV USER tester
RUN npm install yo grunt-cli generator-techtonic -g \
RUN useradd -d /home/$USER $USER \
 && mkdir /home/$USER \
 && chown $USER /home/$USER \
 && chown $USER /usr/local/lib/node_modules \
 && su $USER \
 && cd /home/$USER \
 && mkdir test-project \
 && cd test-project
EXPOSE 1337
