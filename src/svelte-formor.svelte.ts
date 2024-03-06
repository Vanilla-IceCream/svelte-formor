import type {} from 'svelte';
import type { BaseSchema } from 'valibot';
import { unmount } from 'svelte';
import { safeParse } from 'valibot';

import { debounce } from './utils';

export const useSchema = (
  schema: BaseSchema | typeof $derived<BaseSchema> | typeof $derived.by<BaseSchema>,
  target: typeof $state,
  errors: typeof $state,
  touched?: typeof $state,
) => {
  let validated = false;

  function parse(useTouch = false) {
    console.log('schema =', schema);

    const parsed = safeParse(schema, target);

    console.log('parsed = ', parsed);

    errors = {};

    if (!parsed.success) {
      for (let i = 0; i < parsed.issues.length; i++) {
        const issue = parsed.issues[i];

        let errorPath = issue.path?.length ? String(issue.path?.[0].key) : '';

        if (issue.path?.some((item) => item.type === 'array')) {
          errorPath = issue.path?.reduce((acc, cur) => {
            if (typeof cur.key === 'number') return acc + `[${cur.key}]`;
            if (acc) return acc + `.${cur.key}`;
            return String(cur.key);
          }, '');
        }

        if (errorPath) {
          if (!Object.keys(errors).includes(errorPath)) {
            if (useTouch) {
              if (touched?.[errorPath]) errors[errorPath] = issue.message;
            } else {
              console.log('errorPath =', errorPath);
              errors[errorPath] = issue.message;
              console.log('errors =', errors);
            }
          }
        }
      }
    }

    return parsed.success;
  }

  const validate = () => {
    validated = true;

    const debouncing = debounce(() => {
      parse();
    });

    // $effect(() => {
    //   if (target) {
    //     if (validated) debouncing();
    //   }
    // });

    return parse();
  };

  const stop = () => {
    validated = false;
    errors = {};
  };

  const run = () => {
    // $effect(() => {
    //   if (touched?.value) {
    //     if (!validated) parse(true);
    //   }
    // });
    // const debouncing = debounce(() => {
    //   parse(true);
    // });
    // $effect(() => {
    //   if (target.value) {
    //     if (!validated) debouncing();
    //   }
    // });
  };

  const rerun = () => {
    // if (touched?.value) {
    //   touched.value = {};
    // }
  };

  unmount(() => {
    stop();
    rerun();
  });

  return {
    validate,
    stop,
    run,
    rerun,
  };
};
