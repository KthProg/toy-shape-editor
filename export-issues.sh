#!/bin/bash

cd "$(dirname "$0")"

hub issue -s all -f "%U|%t|%S|%cI|%uI|%L%n" > ../web-issues.csv
