# NPM Lint Tools


### What does it do?

- Enable strict mode in tsconfig.json
- Install eslint-plugin-rxjs to lint rxjs codes
- Install eslint-plugin-sonarjs
- Install cspell and create cspell.json to check spelling
- Install lint-staged and create .lintstagedrc.json configuration
- Install commitlint
- Install husky pre-commit and commit-msg hooks
- Add engines section in package.json
- Add either .node-version or .nvmrc node configuration version

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

### Test in dry run mode

```bash
npm run manual-test:dry-run
```

``` bash
? Do you like to set strict mode in tsconfig.json? Yes
? Do you like to add cspell for spell checking? Yes
? Do you like to add commitlint to adopt the convention of commit message? Yes
? Do you like to add lint-staged? Yes
? Do you like to add eslint rules for RxJs? Yes
? Do you like to add SonarJS rules for ESLint? Yes
? Which version does the project use? 16
? Do you like to create node version configuration file? .nvmrc
    Added strict mode to tsconfig.json
    Added cspell@~6.1.1
    Added cspell.json
    Added cspell script to package.json
    Added @commitlint/cli@~17.0.2
    Added @commitlint/config-conventional@~17.0.2
    Added husky@~8.0.1
    Added commitlint.config.js
    Added husky prepare script to package.json
    Added .husky/commit-msg
    Added lint-staged@~13.0.0
    Found husky@~8.0.1, do not add dependency
    Added .lintstagedrc.json
    Found husky prepare script, skip this step
    Added .husky/pre-commit
    Added eslint-plugin-rxjs@~5.0.2
    Added 'plugin:rxjs/recommended' to .eslintrc.js
    Added eslint-plugin-sonarjs@~0.13.0
    Added 'plugin:sonarjs/recommended' to .eslintrc.js
    Added 16 to package.json
    Found .nvmrc, skip this step
CREATE cspell.json (150 bytes)
CREATE commitlint.config.js (66 bytes)
CREATE .husky/commit-msg (81 bytes)
CREATE .lintstagedrc.json (58 bytes)
CREATE .husky/pre-commit (81 bytes)
UPDATE tsconfig.json (816 bytes)
UPDATE package.json (2073 bytes)
UPDATE .eslintrc.js (617 bytes)
```

### Test in local application

Generate a new nestjs app under the same parent directory

```bash
npm link ../nest-lint-tools
schematics nest-lint-tools:nest-add
```

``` bash
? Do you like to set strict mode in tsconfig.json? Yes
? Do you like to add cspell for spell checking? Yes
? Do you like to add commitlint to adopt the convention of commit message? Yes
? Do you like to add lint-staged? Yes
? Do you like to add eslint rules for RxJs? Yes
? Do you like to add SonarJS rules for ESLint? Yes
? Which version does the project use? 16
? Do you like to create node version configuration file? .nvmrc
    Added strict mode to tsconfig.json
    Added cspell@~6.1.1
    Added cspell.json
    Added cspell script to package.json
    Added @commitlint/cli@~17.0.2
    Added @commitlint/config-conventional@~17.0.2
    Added husky@~8.0.1
    Added commitlint.config.js
    Added husky prepare script to package.json
    Added .husky/commit-msg
    Added lint-staged@~13.0.0
    Found husky@~8.0.1, do not add dependency
    Added .lintstagedrc.json
    Found husky prepare script, skip this step
    Added .husky/pre-commit
    Added eslint-plugin-rxjs@~5.0.2
    Added 'plugin:rxjs/recommended' to .eslintrc.js
    Added eslint-plugin-sonarjs@~0.13.0
    Added 'plugin:sonarjs/recommended' to .eslintrc.js
    Added 16 to package.json
    Created .nvmrc
CREATE cspell.json (150 bytes)
CREATE commitlint.config.js (66 bytes)
CREATE .husky/commit-msg (81 bytes)
CREATE .lintstagedrc.json (58 bytes)
CREATE .husky/pre-commit (81 bytes)
CREATE .nvmrc (2 bytes)
UPDATE tsconfig.json (734 bytes)
UPDATE package.json (2431 bytes)
UPDATE .eslintrc.js (781 bytes)
✔ Packages installed successfully.
✔ Packages installed successfully.
✔ Packages installed successfully.
    Made .husky/pre-commit executable
    Made .husky/commit-msg executable
```

Check the documentation with

```bash
schematics --help
```


### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!
