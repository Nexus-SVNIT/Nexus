# Nexus Website

Welcome to the Nexus website repository! Nexus is the vibrant Computer Science and Engineering club at NIT Surat, and this project showcases our commitment to innovation. The frontend is built with React and Tailwind CSS, while the backend leverages Node.js.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Development](#development)
  - [Folder Structure](#folder-structure)
  - [Running Locally](#running-locally)
- [Contributing](#contributing)
  - [How to Contribute](#how-to-contribute)
  - [Development Workflow](#development-workflow)
- [License](#license)

## Getting Started

### Prerequisites

Ensure that you have the following tools installed:

- Node.js: [https://nodejs.org/](https://nodejs.org/)
- npm (Node Package Manager): [https://www.npmjs.com/](https://www.npmjs.com/)

### Installation

Begin by cloning the repository and installing dependencies:

```bash
git clone https://github.com/your-username/nexus-website.git
cd nexus-website
npm install
Explanation:


```
git clone: Fetches the project to your local machine.
cd nexus-website: Navigates to the project directory.
npm install: Installs project dependencies listed in package.json.

Development
Folder Structure
The project is structured into:

client: Frontend React application.
server: Backend Node.js application.
Running Locally
Start the frontend development server:
```bash
cd client
npm start
```


Explanation:

cd client: Changes to the "client" directory, housing the frontend code.
npm start: Initiates the React development server.
Start the backend server:
```bash

cd server
npm start
```
Explanation:

cd server: Moves to the "server" directory, home to the backend code.
npm start: Launches the backend server using Node.js.
Visit http://localhost:3000 to experience the local development version of the website.

Contributing
We encourage contributions from the community to enhance Nexus further! Follow the guidelines below to contribute.

How to Contribute
Fork the repository to your GitHub account.
Explanation:

"Forking" creates your personal copy of the repository on GitHub.
Clone the forked repository to your local machine.
```bash

git clone https://github.com/your-username/nexus-website.git
cd nexus-website
```
Explanation:

Similar to initial cloning, but now from your fork.
Create a new branch for your feature or bug fix.
```bash

git checkout -b feature-or-bugfix-name
```
Explanation:

Creates a new branch for isolating your changes.
Make your changes and commit them:
```bash

git add .
git commit -m "Your descriptive commit message"
```
Explanation:

git add .: Stages changes for commit.
git commit -m "Your descriptive commit message": Records changes with a descriptive message.
Push the changes to your forked repository:
```bash

git push origin feature-or-bugfix-name
```
Explanation:

git push origin feature-or-bugfix-name: Sends changes to the branch on your GitHub fork.
Open a pull request on the original repository.
Explanation:

A "pull request" suggests your changes to the original repository.
Development Workflow
Ensure your fork is up-to-date with the original repository.
```bash

git remote add upstream https://github.com/your-username/nexus-website.git
git fetch upstream
git checkout main
git merge upstream/main
```
Explanation:

git remote add upstream https://github.com/your-username/nexus-website.git: Adds the original repository as "upstream."
git fetch upstream: Retrieves the latest changes.
git checkout main: Switches to the main branch.
git merge upstream/main: Integrates changes from the original repository.
Follow the steps in "How to Contribute" for your feature or bug fix.
