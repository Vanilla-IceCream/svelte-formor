<script lang="ts">
  import { onMount } from 'svelte';
  import { useSchema } from 'svelte-formor';
  import * as v from 'valibot';

  interface Form {
    name?: string;
    email?: string;
  }

  let form = $state<Form>({});
  let valdn = $state<Partial<Record<keyof Form, string>>>({});
  let touched = $state<Partial<Record<keyof Form, boolean>>>({});

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
      touched,
    ),
  );

  const submit = () => {
    if (schema.validate()) {
      console.log('passed =', form);
    }
  };

  const i18n = (lang: 'en' | 'zh') => {
    if (lang === 'zh') {
      locale.required = `這是必填欄位`;
      locale.email = `這必須是一個有效的電子郵件`;
    } else {
      locale.required = 'This is a required field';
      locale.email = `This must be a valid email`;
    }
  };

  onMount(() => {
    schema.run();
  });
</script>

<form>
  <fieldset>
    <legend>Touched</legend>

    <div class="flex gap-2">
      <label for="name">Name</label>
      <input type="text" id="name" bind:value={form.name} onblur={() => (touched.name = true)} />
      <div class="text-red-500">{valdn.name}</div>
    </div>

    <div class="flex gap-2">
      <label for="email">Email</label>
      <input type="text" id="email" bind:value={form.email} onblur={() => (touched.email = true)} />
      <div class="text-red-500">{valdn.email}</div>
    </div>

    <button type="button" onclick={submit}>Submit</button>
  </fieldset>
</form>

<pre>form = {JSON.stringify(form, null, 2)}</pre>
<pre>valdn = {JSON.stringify(valdn, null, 2)}</pre>
<pre>touched = {JSON.stringify(touched, null, 2)}</pre>
<pre>locale = {JSON.stringify(locale, null, 2)}</pre>

<button type="button" onclick={() => i18n('en')}>English</button>
<button type="button" onclick={() => i18n('zh')}>Chinese</button>

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
