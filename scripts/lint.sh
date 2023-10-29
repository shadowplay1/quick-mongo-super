#!/bin/bash

output=""


lint() {
    if [[ $1 == '--fix' ]]; then
        echo 'Fixing all the fixable linting issues...'
        echo

        eslint ./src --fix & output=$(eslint ./src --fix)
    else
        echo 'Checking the code for linting issues...'
        echo

        eslint ./src & output=$(eslint ./src)
    fi
}


lint $1

if [ -n "$output" ]; then
    echo 'Linting check failed.'
    exit 1
else
    echo 'Linting check passed!'
    exit 0
fi
