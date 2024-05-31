<script lang="ts">
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
</script>

<form>
  <div>
    <input type="text" bind:value={form.name} onblur={() => (touched.name = true)} />
    <input type="text" bind:value={form.email} onblur={() => (touched.email = true)} />
  </div>

  <button type="button" onclick={submit}>Submit</button>
</form>

<pre>form = {JSON.stringify(form, null, 2)}</pre>
<pre>valdn = {JSON.stringify(valdn, null, 2)}</pre>
<pre>touched = {JSON.stringify(touched, null, 2)}</pre>
<pre>locale = {JSON.stringify(locale, null, 2)}</pre>

<button type="button" onclick={() => i18n('en')}>English</button>
<button type="button" onclick={() => i18n('zh')}>Chinese</button>
