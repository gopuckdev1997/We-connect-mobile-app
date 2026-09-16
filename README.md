# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Fonts

This project loads `Plus Jakarta Sans` at runtime in `src/app/_layout.tsx` with `useFonts` from `expo-font`.

- Font files live in `assets/fonts`
- The root layout keeps the splash screen visible with `expo-splash-screen` until the fonts are loaded
- The loaded family names are `sans-light`, `sans-regular`, `sans-medium`, `sans-semibold`, `sans-bold`, and `sans-extrabold`

Example usage:

```tsx
<Text style={{ fontFamily: "sans-semibold" }}>Hello</Text>
```

This is a valid Expo SDK 57 approach, especially when you want one runtime loading path that also works on web. For native-only Android/iOS apps, Expo recommends the `expo-font` config plugin as the more efficient option.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Code quality, commit, and PR rules

This project is set up to keep commits small, clean, and reviewable.

After pulling these changes, run `npm install` once so the new dev dependencies and Husky hooks are installed locally.

### What is configured

- `ESLint` for code quality
- `Prettier` with `prettier-plugin-tailwindcss` for formatting and class sorting
- `Husky` to run Git hooks locally
- `lint-staged` to check only staged files before each commit
- `commitlint` to enforce Conventional Commit messages
- GitHub Actions to run format, lint, and typecheck on every pull request
- A pull request template with a review checklist

### Local commands

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:write
npm run typecheck
```

### Commit message format

Use Conventional Commits:

```text
feat: add onboarding header
fix: prevent empty profile submission
chore: configure husky hooks
docs: add setup steps to readme
```

### What happens on commit

When you run `git commit`, Husky runs `lint-staged` first:

- staged `*.{js,jsx,ts,tsx}` files are fixed with ESLint and formatted with Prettier
- staged `*.{json,md,css}` files are formatted with Prettier
- the commit message is then validated with `commitlint`

If any of those checks fail, the commit is blocked until you fix the issue.

### Pull request rules

Every pull request to `main` or `master` runs:

- `npm run format`
- `npm run lint`
- `npm run typecheck`

Use the PR template to confirm:

- the change is explained clearly
- validation commands were run
- relevant devices/platforms were tested
- no unused assets or dead code were introduced

### Reuse this setup in other Expo projects

1. Install the tools:

   ```bash
   npm install -D eslint eslint-config-expo prettier prettier-plugin-tailwindcss husky lint-staged @commitlint/cli @commitlint/config-conventional
   ```

2. Add scripts to `package.json`:

   ```json
   {
     "scripts": {
       "lint": "expo lint",
       "lint:fix": "eslint . --fix",
       "typecheck": "tsc --noEmit",
       "format": "prettier --check .",
       "format:write": "prettier --write .",
       "prepare": "husky"
     }
   }
   ```

3. Add `lint-staged` to `package.json`:

   ```json
   {
     "lint-staged": {
       "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
       "*.{json,md,css}": ["prettier --write"]
     }
   }
   ```

4. Add `eslint.config.js`:

   ```js
   const { defineConfig } = require("eslint/config");
   const expoConfig = require("eslint-config-expo/flat");

   module.exports = defineConfig([
     expoConfig,
     {
       ignores: [".expo/*", "dist/*"],
     },
   ]);
   ```

5. Add `.prettierrc.json`:

   ```json
   {
     "plugins": ["prettier-plugin-tailwindcss"],
     "singleQuote": false,
     "trailingComma": "es5"
   }
   ```

6. Add `commitlint.config.cjs`:

   ```js
   module.exports = {
     extends: ["@commitlint/config-conventional"],
   };
   ```

7. Initialize Husky and create hooks:

   ```bash
   npx husky init
   ```

   Then set `.husky/pre-commit` to:

   ```sh
   #!/usr/bin/env sh
   npx lint-staged
   ```

   And `.husky/commit-msg` to:

   ```sh
   #!/usr/bin/env sh
   npx --no -- commitlint --edit "$1"
   ```

8. Add a GitHub Actions workflow that runs `format`, `lint`, and `typecheck` on pull requests.

9. Add a PR template checklist so reviewers and contributors follow the same quality bar.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
