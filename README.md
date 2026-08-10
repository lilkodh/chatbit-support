# ChatBit

Real-time customer support application for Souq Express.

## Team

- Chaimae — Frontend / Mobile
- Khalid — Backend

## Repository Structure

/backend
Backend project.

/mobile
Mobile project.

/docs
Project documentation.

## Git Branches

main
Final stable version.

develop
Main development branch.

feature/*
Development branches for Jira tasks.

## Branch Workflow

develop
↓
feature/CHAT-XX-task-name
↓
work
↓
push
↓
Pull Request
↓
develop

Final:

develop
↓
Pull Request
↓
main

## Branch Naming

Use:

feature/CHAT-XX-short-description

Example:

feature/CHAT-05-login-screen

## Commit Convention

Use simple Conventional Commits.

Examples:

feat: add login screen

fix: fix login validation

docs: update README

test: add login tests

chore: update configuration

## Important Rules

- Do not work directly on main.
- Do not work directly on develop.
- One Jira task = one feature branch.
- Always create a Pull Request to develop.
- Keep commits clear and small.
- Pull the latest develop before starting a task.
