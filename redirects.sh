#!/bin/bash
BUCKET=s3://cevo.com.au
while read -r line; do
  OBJECT=$(echo $line | cut -f1)
  REDIRECT=$(echo $line | awk '{print $2}')
  echo "aws s3 cp ${BUCKET}${OBJECT} ${BUCKET}${OBJECT} --website-redirect"
done < $1
