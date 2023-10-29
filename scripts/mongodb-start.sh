#!/bin/bash

if [[ ! -d '~/db' ]]; then
    mkdir '~/db'
fi

pwd
echo
ls -la

mongod --port 27018 --dbpath ~/db --fork --logpath ~/db/mongodb.log
