# ShakeSearch Challenge

Welcome to the Pulley Shakesearch Challenge! This repository contains a simple web app for searching text in the complete works of Shakespeare.

## Prerequisites

To run the tests, you need to have [Go](https://go.dev/doc/install) and [Docker](https://docs.docker.com/engine/install/) installed on your system.

## Your Task

Your task is to fix the underlying code to make the failing tests in the app pass. There are 3 frontend tests and 3 backend tests, with 2 of each currently failing. You should not modify the tests themselves, but rather improve the code to meet the test requirements. You can use the provided Dockerfile to run the tests or the app locally. The success criteria are to have all 6 tests passing.

## Instructions

<img width="404" alt="image" src="https://github.com/ProlificLabs/shakesearch/assets/98766735/9a5b96b5-0e44-42e1-8d6e-b7a9e08df9a1">

*** 

**Do not open a pull request or fork the repo**. Use these steps to create a hard copy.

1. Create a repository from this one using the "Use this template" button.
2. Fix the underlying code to make the tests pass
3. Include a short explanation of your changes in the readme or changelog file
4. Email us back with a link to your copy of the repo

## Running the App Locally


This command runs the app on your machine and will be available in browser at localhost:3001.

```bash
make run
```

## Running the Tests

This command runs backend and frontend tests.

Backend testing directly runs all Go tests.

Frontend testing run the app and mochajs tests inside docker, using internal port 3002.

```bash
make test
```

Good luck!

## Challenge Updates

All tests now pass ✅

For easy review can view the diff via the PR used to fix the tests which uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Can also just view master.



### Bugs 🐛

There was some bugs encountered on `master` while working on the challenge.
Addressed these also.

#### Docker

I assume the docker image built and ran the project successfully when it was first created.
Running the tests without changes resulted in a mocha library timeout error which I fixed.
I was instructed not to update the tests so I updated the docker test command to handle this.

#### Searching

Searching with an empty term resulted in a console error.
This was handled with a UX improvement via a simple message to the user.

### Features ✨

Please see rationale for adding the features below which fixed the tests.
My approach was based on making the right decision which will allow us to 10x in future.

#### Case sensitivity in search

1. Supported both case sensitive and insensitive searching for easy code deprecation (if old functionality not needed), 
A/B testing and refactoring.
2. Supported it also on FE via search params. UI can easily be added in future for user to
control case sensitivity if needed by Product Manager. This will lead to a better UX where the user is in control of their actions.

#### Pagination

1. Opted for BE pagination using a standard [convention](https://graphql.org/learn/pagination/).
Using any convention such as this, allows us to easily add more pagination features.
2. BE pagination allows for handling large amounts of data if needed.
3. BE pagination also should make FE faster as there as less nodes in the DOM and less data 
transferred over the network.

### Improvements 🛠

These were not mandatory.

#### Support for URL params

Since app is not a SPA, I added search params to assist with UX and supporting features above as
opposed to in-memory navigation.

#### Visibility of Load More button

Did a UX quick win of disabling the button if no results. Can be expanded in future to account for
total results.

#### TODOs

Added TODOs in code for future enhacements.

#### Future Considerations

Just a few things to consider next time as I didn't have time to address:
1. Make code more DRY
2. Not hardcode certain keywords