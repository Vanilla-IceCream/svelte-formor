import type {} from 'svelte';
import type { BaseSchema } from 'valibot';
import { unmount } from 'svelte';
import { safeParse } from 'valibot';

import { debounce } from './utils';

export const useSchema = (schema: BaseSchema, target: object, errors: object, touched?: object) => {
  let validated = false;

  function parse(useTouch = false) {
    const parsed = safeParse(schema, target);

    for (const key in errors) {
      errors[key] = undefined;
    }

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
          if (useTouch) {
            errors[errorPath] = issue.message;
          } else {
            errors[errorPath] = issue.message;
          }
        }
      }
    }

    return parsed.success;
  }

  const debouncing = debounce(() => {
    parse();
  });

  $effect(() => {
    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        if (validated) debouncing();
      }
    }
  });

  const validate = () => {
    validated = true;
    return parse();
  };

  const stop = () => {
    validated = false;

    for (const key in errors) {
      errors[key] = undefined;
    }
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
