# Testing #30DaysOfSWA with Playwright

## 1. What are we doing?

The final objective is to setup automated tests to support end-to-end testing of the deployed #30DaysOfSWA website at https://aka.ms/30DaysOfPWA

The initial objective is to document the usage of Playwright as the testing framework, following the [Getting Started](https://playwright.dev/docs/1.21/intro) tutorial as a quickstart, then refining the established test structure and scripts to meet requirements.

---

## 2. Where should my tests be?

Note that the #30DaysOfSWA site is built and deployed from [this source repository](https://github.com/staticwebdev/30DaysOfSWA). In a real-world application, we would be setting up the tests in the _same_ repo to automate testing on every push or commit to the source.

However, *this** repo is being used as a tutorial to explore Playwright capabilities - so writing it as a standalone project that tests only against the **deployed** SWA website.

---

## 3. How do I install Playwright?

There are three options:
 * [Using VS Code extension](https://playwright.dev/docs/1.21/intro#using-the-vs-code-extension) for default scaffold and config from IDE
 * [Using `npm init`](https://playwright.dev/docs/1.21/intro#using-init-command) for default scaffold and config at commandline
 * [Manually](https://playwright.dev/docs/1.21/intro#manually) for more granular control over process.

For now, I'm taking the second route.

```
npm init playwright@latest 
```

The command should kickstart the process by asking you to configure your preferences for programming language, testing folder location, and GitHub Actions integration. Here is what that looks like (output truncated for clarity)

```
Getting started with writing end-to-end tests with Playwright:
Initializing project in '.'
✔ Do you want to use TypeScript or JavaScript? · JavaScript
✔ Where to put your end-to-end tests? · tests
✔ Add a GitHub Actions workflow? (y/N) · true

Initializing NPM project (npm init -y)
Wrote to <pwd>/package.json:
...
...
Chromium 102.0.5005.40 (playwright build v1005) downloaded to <dirname>
Firefox 99.0.1 (playwright build v1323) downloaded to  <dirname>
Webkit 15.4 (playwright build v1641) downloaded to  <dirname>
...
...
Writing playwright.config.js.
Writing .github/workflows/playwright.yml.
Writing tests/example.spec.js.
Writing package.json.
✔ Success! Created a Playwright Test project at <pwd>
```

The installation then ends with some recommendations:

```
Inside that directory, you can run several commands:

  npx playwright test
    Runs the end-to-end tests.

  npx playwright test --project=chromium
    Runs the tests only on Desktop Chrome.

  npx playwright test example.spec.js
    Runs the tests in the specific file.

  npx playwright test --debug
    Runs the tests in debug mode.

We suggest that you begin by typing:

    npx playwright test

And check out the following files:
  - ./example.spec.js - Example end-to-end test
  - ./playwright.config.js - Playwright Test configuration

Visit https://playwright.dev/docs/intro for more information. ✨

Happy hacking! 🎭
```

---

## 4. What did the installation do?

 1. It installs the Playwright commandline tools in your local development environment. Let's validate by checking the installed version.

    ```
    $npx playwright --version
    Version 1.22.1
    ```

 2. It downloads and installs the three core browsers required for cross-platform testing: **Chromium, Firefox and WebKit**. Check the output to see which versions were installed. You can always use the manual option to [customize the browser installation](https://playwright.dev/docs/1.21/cli#install-browsers)

 3. It sets up the basic configuration files, dependencies and scripts required to run your end-to-end tests. Here's what that looks like (output cleaned up and annotated for clarity)

    ```
    $ ls 
    .git/
    .github/
        workflows/
            playwright.yml // Playwright actions
    .gitignore
    LICENSE                 
    node_modules/                   
    playwright.config.js  // Playwright config
    README.md               
    package-lock.json     
    tests                 
        example.spec.ts    // Playwright tests
    package.json          
    ```

---

## 5. What can I do with this?

Let's take the installation log's advice and run the default Playwright Test Runner on the default test script.

```
$npx playwright test
```

Here's what we see:

```
$ npx playwright test

Running 75 tests using 3 workers
[63/75] [webkit] › example.spec.js:227:3 › Editing › shoul
  Slow test file: [webkit] › example.spec.js (41s)
  Slow test file: [firefox] › example.spec.js (30s)
  Slow test file: [chromium] › example.spec.js (29s)
  Consider splitting slow test files to speed up parallel execution

  75 passed (41s)

To open last HTML report run:

  npx playwright show-report
```

What did this do? It ran the default (25) tests in the [example.spec.js](tests/example.spec.js) file on the (3) target browsers identified in the "projects" section of the [playwright.config.js](/playwright.config.js) file. Currently the test runner uses three workers - however you can [control parallelism and sharding](https://playwright.dev/docs/1.21/test-parallel) for efficiency.

The default test configuration and spec files are heavily annotated - helping you understand exactly what the test achieves, and how to configure the test run.

By default, tests are run against [this TODO MVC demo app](https://demo.playwright.dev/todomvc). 

![TODO MVC](./todo-mvc.png)
In the later "Customize Tests" section, we'll take our first steps in customizing the default script to run against the [#30DaysOfSWA](https://www.azurestaticwebapps.dev/) site instead, and use the process to understand more about the testing process.

---

## 6. What does the Report Show?

You may have noticed that the execution of the test run ended with the following message:

```
To open last HTML report run:

  npx playwright show-report
```

This should launch the default browser open to `http://127.0.0.1:9323/` - showing an HTML-based report as shown below. 

![HTML Report](playwright-report.png)

We can immediately note a few things:
 * The report provides a summary of tests status (top)
 * It breaks down status for each test by browser, duration (performance)
 * It allows to dive into a given test for details.

For example, clicking on the first test takes us to this screen which breaks down the status and duration of each test action within that test.

![Test Action](test-action.png)

---

## 7. What about those GitHub Actions?

That's right - the default scaffold sets up the `.github/workflow/playwright.yml` file for you. Let's take a peek inside:

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '14.x'
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v2
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

We can see that this sets up a GitHub Action that installs dependencies and required browsers, then runs the test - and uploads the report as an artifact to your GitHub repo that is _retained for 30 days_.
