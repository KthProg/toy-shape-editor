#!/bin/bash -e
#
# May need to install prettier with `npm i -g prettier`

# Run prettier as a pre-hook
printf "\\n\e[1;31mfind src -type f | xargs prettier --print-width 80 --no-semi --single-quote --trailing-comma es5 --write\e[0m\\n"
find src -type f | xargs prettier --print-width 80 --no-semi --single-quote --trailing-comma es5 --write
