#!/bin/bash
rm -rf /var/www/my-frontend-app/*
cp -r /opt/codedeploy-agent/deployment-root/deployment-*/deployment-archive/* /var/www/my-frontend-app/