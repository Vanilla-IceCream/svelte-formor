# svelte-formor

Form validation for Svelte in Runes with Valibot.

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
import { useSchema } from 'svelte-formor';
```

Basic forms:

```svelte
<script lang="ts">
  import { useSchema } from 'svelte-formor';
  import * as v from 'valibot';

  interface Form {
    name?: string;
    email?: string;
  }

  let form = $state<Form>({});
  let valdn = $state<Partial<Record<keyof Form, string>>>({});

  let locale = $state({
    required: 'This is a required field',
    email: `This must be a valid email`,
  });

  const schema = $derived(
    useSchema(
      v.object({
        name: v.nullish(v.pipe(v.string(), v.minLength(1, locale.required)), ''),
        email: v.nullish(
          v.pipe(v.string(), v.minLength(1, locale.required), v.email(locale.email)),
          '',
        ),
      }),
      form,
      valdn,
    ),
  );

  const submit = () => {
    if (schema.validate()) {
      console.log('passed =', form);
    }
  };
</script>

<form>
  <div class="flex gap-2">
    <label for="name">Name</label>
    <input type="text" id="name" bind:value={form.name} />
    <div class="text-red-500">{valdn.name}</div>
  </div>

  <div class="flex gap-2">
    <label for="email">Email</label>
    <input type="text" id="email" bind:value={form.email} />
    <div class="text-red-500">{valdn.email}</div>
  </div>

  <button type="button" onclick={submit}>Submit</button>
</form>

<style>
  .flex {
    display: flex;
  }

  .gap-2 {
    gap: 0.5rem;
  }

  .text-red-500 {
    color: #ef4444;
  }
</style>
```
