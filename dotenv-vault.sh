#!/bin/bash

# Script to pull and push environment variables using dotenv-vault
# Usage: ./dotenv-vault.sh [pull|push] [environment]

# Check for correct usage
if [ "$#" -lt 1 ]; then
  echo "Usage: $0 [pull|push] [environment]"
  exit 1
fi

# Assign action (pull/push) and environment
ACTION=$1
ENVIRONMENT=${2:-development} # Default to 'development' if not specified

# Ensure npx is installed
if ! command -v npx &> /dev/null; then
  echo "Error: npx is not installed. Please install Node.js and npm."
  exit 1
fi

# Execute dotenv-vault command
if [ "$ACTION" == "pull" ]; then
  echo "Pulling environment variables for environment: $ENVIRONMENT"
  npx dotenv-vault pull --environment $ENVIRONMENT
elif [ "$ACTION" == "push" ]; then
  echo "Pushing environment variables for environment: $ENVIRONMENT"
  npx dotenv-vault push --environment $ENVIRONMENT
else
  echo "Error: Unknown action '$ACTION'. Use 'pull' or 'push'."
  exit 1
fi

# Check for success
if [ $? -eq 0 ]; then
  echo "dotenv-vault $ACTION successful for environment: $ENVIRONMENT"
else
  echo "Error: dotenv-vault $ACTION failed for environment: $ENVIRONMENT"
  exit 1
fi
