#!/bin/bash

# updating repositories and upgrading them
sudo apt update && sudo apt upgrade -y

# Creating a custom log file
cd /home/ubuntu
touch startup.log

# Installing nodejs
cd ~
curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt install nodejs
node -v && echo "Installed nodejs successfully" >> /home/ubuntu/startup.log

# Cloning git repository
cd /home/ubuntu
git clone https://github.com/TanmayChavan-2403/MyMeanings.git
echo "Git clone completed" >> /home/ubuntu/startup.log

# Installing all node_modules packages
cd MyMeanings
npm install
echo "Node modules installed" >> /home/ubuntu/startup.log

# Installing nginx server
sudo apt install nginx -y
echo "Nginx installed successfully" >> /home/ubuntu/startup.log