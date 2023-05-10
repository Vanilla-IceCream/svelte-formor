# svelte-formor

Form validation for Svelte in composition functions with Zod.

## Installation

Install `svelte-formor` with your favorite package manager:

```sh
$ npm i svelte-formor
# or
$ yarn add svelte-formor
# or
$ pnpm i svelte-formor
# or
$ bun add svelte-formor
```

## Usage

To use `svelte-formor`, import the `useSchema` function:

```ts
// esm
import { useSchema } from 'svelte-formor';

// cjs
const { useSchema } = require('svelte-formor');
```

```svelte
<script lang="ts">
  import { writable } from 'svelte/store';
  import { useSchema } from 'svelte-formor';
  import { z } from 'zod';

  const form = writable<{ name?: string; email?: string }>({});
  const valdn = writable<Record<string, string>>({});

  const msgs = { required: 'This is a required field' };

  const schema = useSchema(
    z.object({
      name: z.string({ required_error: msgs.required }).nonempty(msgs.required),
      email: z.string({ required_error: msgs.required }).nonempty(msgs.required),
    }),
    form,
    valdn,
  );

  const submit = () => {
    if (schema.validate()) {
      console.log('passed', $form);
    }
  };
</script>

<div class="max-w-100 p-6 shadow-md">
  <div class="flex flex-col gap-3">
    <TextField label="Name" bind:value={$form.name} errorMessage={$valdn.name} />
    <TextField label="Email" bind:value={$form.email} errorMessage={$valdn.email} />
  </div>

  <Button class="mt-6" on:click={submit}>Submit</Button>
</div>

<pre>{JSON.stringify($form, null, 2)}</pre>
<pre>{JSON.stringify($valdn, null, 2)}</pre>
```
