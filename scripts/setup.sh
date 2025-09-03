#!/bin/bash

# Function to print colored text
print_green() {
  echo -e "\033[0;32m$1\033[0m"
}
print_red() {
  echo -e "\033[0;31m$1\033[0m"
}

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
  print_red "pnpm not found. Install pnpm globally with npm i -g pnpm "
  exit 1
else
  print_green "pnpm is already installed. "
fi

# Installing required dependencies
print_green "Installing dependencies using pnpm..."
pnpm install

# Husky setup
print_green "Setting up Husky hooks..."
pnpm dlx husky init
# Create pre-commit hook
print_green "🪝 Creating pre-commit hook..."
cat > .husky/pre-commit <<'EOF'
echo  "Running pre-commit hooks..."
prettier $(git diff --cached --name-only --diff-filter=ACMR | sed 's| |\\ |g') --write --ignore-unknown
git update-index --again

npm run pre-commit
echo "Code formatted using prettier..."
EOF

# Create commit-msg hook
print_green "🪝 Creating commit-msg hook..."
cat > .husky/commit-msg <<'EOF'
echo "Commit Linting..."
npm run commit-msg
EOF

# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x scripts/*
print_green "✅ Husky hooks setup complete!"
# Setting executable permissions
print_green "Setting executable permissions on Husky hooks..."
chmod ug+x .husky/*
chmod ug+x .git/hooks/*

print_green "✅ Executable permissions set on Husky hooks!"

# Copy .env.example to .env
print_green "Copying .env.example to .env..."
if [ ! -f .env ]; then
  cp .env.example .env
  print_green "✅ Copied .env.example to .env"
else
  print_red "⚠️  .env file already exists. Skipping copy."
fi
print_green " Add env vars for the project in .env file"

print_green "✅ Setup complete!"
