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

develop
Target branch where validated work will be merged later.

workflow
Main active development & integration branch.

feature/*
Development branches created from `workflow` for Jira tasks.

## Branch Workflow

workflow
↓
feature/CHAT-XX-task-name
↓
work
↓
push
↓
Pull Request
↓
workflow

Later (Milestone / Release):

workflow
↓
Pull Request / Merge
↓
develop

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

- There is no main branch.
- Do not work directly on develop.
- Do not work directly on workflow.
- All feature branches are created from workflow.
- One Jira task = one feature branch.
- Always create a Pull Request to workflow.
- Keep commits clear and small.
- Pull the latest workflow before starting a task.
- Merge workflow into develop when milestones are complete.
