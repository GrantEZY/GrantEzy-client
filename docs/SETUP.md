# 📦 Getting Started with GrantEzy Client

Welcome to the **GrantEzy** frontend setup guide. This document walks you through environment setup,  development conventions, and automated scripts.

---

## 📦 Prerequisites

- **Node.js** version ~22.x ([Install node](https://nodejs.org/en/download))





## 📦 Initial Setup

### Make sure you have **all Prerequisites** installed.

Initial fork the repo and clone the forked repo

```bash
git clone https://github.com/<your username>/GrantEzy-Frontend.git
cd GrantEzy-Frontend
```

## Install pnpm (Optional)

Install pnpm for package manager 

```bash
npm i -g pnpm 
```
After that install the required packages for development

## Run the setup script 

Run the setup.sh in the scripts folder for the initial setup

```bash
chmod +x ./scripts/setup.sh
./scripts/setup.sh
```

## 📦 Start the Client

Update the env in the .env file

Start the client Instance

```
    pnpm run dev
```

## ## 📦 Commit Guidelines

Commits Convention ([Refer Here](https://www.conventionalcommits.org/en/v1.0.0/))

Make it executable
```bash
  chmod +x .husky/pre-commit
  chmod +x .husky/commit-msg
  chmod +x ./scripts/commit.sh
```

Run this for commiting with the convention

```bash
./scripts/commit.sh
```

It makes life easy for following commit format instead of typing big commits
