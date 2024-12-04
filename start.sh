#!/bin/bash

set -x
NODE_ENV=${NODE_ENV:-development}
# Log the detected environment
echo "Detected environment: $NODE_ENV"
# Check the value of NODE_ENV
if [ "$NODE_ENV" == "production" ]; then
    echo "Running production script for environment: $NODE_ENV"
    npx dotenv-vault pull "$NODE_ENV" || { echo "Failed to pull dotenv configuration"; exit 1; }
       # Stop logging
    exec >/dev/tty 2>/dev/tty
    npm run start:prod
elif [ "$NODE_ENV" == "development" ]; then
    echo "Running development script for environment: $NODE_ENV"
    npx dotenv-vault pull "$NODE_ENV" || { echo "Failed to pull dotenv configuration"; exit 1; }
       # Stop logging
            exec >/dev/tty 2>/dev/tty
    npm run start:dev
else
    echo "NODE_ENV is not set or unknown. Defaulting to development..."

       # Stop logging
            exec >/dev/tty 2>/dev/tty
    npm run start:dev
fi