# -*- mode: ruby -*-
# vi: set ft=ruby :

$org_name = "techtonic"
$box_name = "techtonic/env"
$host_name = "home"

Vagrant.configure("2") do |config|
    config.vm.define "dev" do |env|
        env.vm.box = $box_name
        env.vm.hostname = $host_name
    end
    config.vm.network "forwarded_port", guest: 8000, host: 8000, auto_correct: true
    config.vm.network "forwarded_port", guest: 8080, host: 8080, auto_correct: true   #jenkins
    config.vm.network "forwarded_port", guest: 8111, host: 8111, auto_correct: true   #teamcity
    config.vm.network "forwarded_port", guest: 5984, host: 5984, auto_correct: true   #couch
    config.vm.network "forwarded_port", guest: 6379, host: 6379, auto_correct: true   #redis
    config.vm.network "forwarded_port", guest: 7001, host: 7001, auto_correct: true   #weblogic
    config.vm.network "forwarded_port", guest: 27017, host: 27017, auto_correct: true #mongodb
    config.vm.provider "virtualbox" do |vb|
        vb.name = $org_name + "-env-" + Time.now.to_i.to_s
        vb.customize ["modifyvm", :id, "--monitorcount", "1"]
    end
end
