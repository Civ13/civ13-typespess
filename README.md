# Civ13 TypeSpess

![](https://i.imgur.com/napac0L.png)

[![CircleCI](https://img.shields.io/circleci/build/github/Civ13/civ13-typespess)](https://app.circleci.com/pipelines/github/Civ13/civ13-typespess)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Civ13_civ13-typespess&metric=alert_status)](https://sonarcloud.io/dashboard?id=Civ13_civ13-typespess)

[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Civ13_civ13-typespess&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=Civ13_civ13-typespess)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Civ13_civ13-typespess&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=Civ13_civ13-typespess)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Civ13_civ13-typespess&metric=security_rating)](https://sonarcloud.io/dashboard?id=Civ13_civ13-typespess)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Civ13_civ13-typespess&metric=bugs)](https://sonarcloud.io/dashboard?id=Civ13_civ13-typespess)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Civ13_civ13-typespess&metric=code_smells)](https://sonarcloud.io/dashboard?id=Civ13_civ13-typespess)

![GitHub top language](https://img.shields.io/github/languages/top/civ13/civ13-typespess)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Civ13_civ13-typespess&metric=ncloc)](https://sonarcloud.io/dashboard?id=Civ13_civ13-typespess)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/civ13/civ13-typespess)
![GitHub repo size](https://img.shields.io/github/repo-size/civ13/civ13-typespess)
[![License](https://img.shields.io/github/license/civ13/civ13-typespess)](https://github.com/Civ13/civ13-typespess/blob/master/LICENSE)

[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/Civ13/civ13-typespess)

Welcome! This is an attempt at creating a Civ13 remake using [TypeScript](https://www.typescriptlang.org/) and *JavaScript*.

Check the original Civ13 that uses BYOND and SS13 code here: https://github.com/civ13/civ13.

**Please read the [Contribution Guide](.github/CONTRIBUTING.md) page if you're willing to help! All help is appreciated!**

## Installing

### Windows
1. Install node.js 12 or later from https://nodejs.org/en/download/
2. Clone `https://github.com/civ13/civ13-typespess.git` using your preferred git software, or download the ZIP file from github and extract it (not recommended).
3. Run `setup.bat` in the civ13-typespess/scripts folder.

Whenever you update to the latest code, run `setup.bat` again afterwards for the simplest and easiest experience.

### Linux (Ubuntu)
1. If you don't have it yet, install git using `apt install git`.
1. Clone the repo using `git clone https://github.com/civ13/civ13-typespess.git`.
2. Run `setup.sh` in the civ13-typespess/scripts folder.

Whenever you update to the latest code, run `setup.sh` again afterwards for the simplest and easiest experience.

## Running

Run `launch_server.bat` or  `launch_server.sh` in the civ13-typespess/scripts folder. To join the server connect to `localhost:1713` using a web browser.

If you have the database login system enabled (in **server.cson**), you also need to launch the **PouchDB** using `start_db.bat` or `start_db.sh`.

You can also use `launch_client.bat` to automatically update the dependencies and launch the game on the browser (Windows only).

## Licenses

All code is licensed under [GNU AGPL v3](https://www.gnu.org/licenses/agpl-3.0.html).
