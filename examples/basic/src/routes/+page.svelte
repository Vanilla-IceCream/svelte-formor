<script>
  // import { useSchema } from '$lib/svelte-formor.svelte';
  import { useSchema } from 'svelte-formor';
  import * as v from 'valibot';

  // interface Form {
  //   name?: string;
  //   email?: string;
  // }

  // let form = $state<Form>({});
  // let valdn = $state<Partial<Record<keyof Form, string>>>({});
  let form = $state({});
  let valdn = $state({});

  const msgs = { required: 'This is a required field' };

  let struct = v.object({
    name: v.nullish(v.string([v.minLength(1, msgs.required)]), ''),
    email: v.nullish(v.string([v.minLength(1, msgs.required)]), ''),
  });

  const schema = useSchema(struct, form, valdn);

  const submit = () => {
    if (schema.validate()) {
      console.log('passed =', form);
    }
  };
</script>

<form class="max-w-100 p-6 shadow-md">
  <div class="flex flex-col gap-3">
    <input type="text" bind:value={form.name} />
    <input type="text" bind:value={form.email} />
  </div>

  <button type="button" class="mt-6" onclick={submit}>Submit</button>
</form>

<pre>{JSON.stringify(form, null, 2)}</pre>
<pre>{JSON.stringify(valdn, null, 2)}</pre>
