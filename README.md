# Brocolito

**Bro**ther **co**mannd **li**ne **to**ol

Create type-safe CLIs to align local development and pipeline workflows.

Powered by [vite](https://www.npmjs.com/package/vite) & [cac](https://www.npmjs.com/package/cac).

## What you get

Ever wanted a type safe, easy to set up CLI that is automatically self-updating locally and can be used
in CI / CD workflows? Brocolito aims to support you with that.

## How to

You create some directory for your CLI code and place two mandatory files in it:

- `package.json`
  - the `name` will be the name of your CLI, e.g. `cli`.
  - the `dependencies` should contain `brocolito`
    - you can install it e.g. via `pnpm install brocolito`
  - the `scripts` should contain e.g. `"build": "brocolito build"`
- the `src/main.ts` is your index file for the CLI code
  - below you can find a minimal code sample

Run the build script to set up the CLI, from the above example with `pnpm build`.
You will get printed how to make the CLI globally available for you.

### Minimal code sample
In your `src/main.ts` you create this code:

```ts
import { CLI } from 'brocolito';

CLI.command('hello').action(() => console.log('hello world'));

CLI.help(); // this will allow your CLI to print help messages on e.g. "-h" option
CLI.parse(); // this needs to be executed after all "commands" were set up
```

Now you can run `cli -h` to see the help message or `cli hello` to print `hello world`.

For more advanced features see [here](https://www.npmjs.com/package/cac).

### Setup in GitHub Actions

Please check the used custom actions of this repository yourself. It uses [pnpm](.github/actions/pnpm-install)
to install the CLI dependencies and a simple [setup](.github/actions/brocolito-setup) to set up the CLI.

In this [workflow](.github/workflows/pr.yml) you can see it in action.
