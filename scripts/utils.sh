#!/bin/bash

# All projects
projects=('ecommerce' 'dashboard' 'image-gallery' 'ai-text-editor' 'kanban' 'ai-chatbot' 'shared')

# Runs a command for all projects
run_command() {
  local command="$1"

  for project in "${projects[@]}"
  do
    echo "Running '$command' for project: $project"
    eval "$command $project"
    if [ $? -ne 0 ]; then
      echo "Tests failed for project: $project"
      exit 1
    fi
  done

  echo -e "\nAll operations have completed successfully!"
}

