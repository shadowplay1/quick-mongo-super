#!/bin/bash

if [[ ! -d '~/db' ]]; then
    mkdir '~/db'
fi

mongod --port 27018 --dbpath ~/db
