#!/bin/bash
# Copy+paste the file from the browser's textarea into a text editor buffer.
# gvim worked nicely for that - KDE's kate did not.
cat libxmp-js-output.txt | \
    (export LC_ALL=C ; perl -0777 -pE 'use bytes; s/\s+//g; s/\\x([0-9A-F])([0-9A-F])/chr(hex("$1$2"))/eg' > libxmp.raw) && \
sox -r 11025 -b 16 -e signed-integer -c 2 libxmp.raw libxmp.wav
