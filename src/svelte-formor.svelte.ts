import type { BaseSchema, BaseIssue, ObjectPathItem, ArrayPathItem } from 'valibot';
import { safeParse } from 'valibot';

import { debounce } from './utils';

export const useSchema = <const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
  schema: TSchema,
  target: unknown,
  errors: Record<string, string | undefined>,
  touched?: Record<string, boolean | undefined>,
) => {
  let validated = false;

  function parse(useTouch = false) {
    const parsed = safeParse<TSchema>(schema, target);

    for (const key in errors) {
      errors[key] = undefined;
    }

    if (!parsed.success) {
      for (let i = 0; i < parsed.issues.length; i++) {
        const issue = parsed.issues[i];

        let errorPath = issue.path?.length ? String((issue.path?.[0] as ObjectPathItem).key) : '';

        if (issue.path?.some((item) => item.type === 'array')) {
          errorPath = issue.path?.reduce((acc, cur) => {
            const path = cur as ArrayPathItem;
            if (typeof path.key === 'number') return acc + `[${path.key}]`;
            if (acc) return acc + `.${path.key}`;
            return String(path.key);
          }, '');
        }

        if (errorPath) {
          if (!errors[errorPath]) {
            if (useTouch) {
              if (touched?.[errorPath]) errors[errorPath] = issue.message;
            } else {
              errors[errorPath] = issue.message;
            }
          }
        }
      }
    }

    return parsed.success;
  }

  const debouncing = debounce(() => {
    parse();
  });

  $effect.root(() => {
    $effect(() => {
      if (validated) {
        for (const key in target) {
          if (Object.prototype.hasOwnProperty.call(target, key)) {
            debouncing();
          }
        }
      }
    });

    return () => {
      stop();
      rerun();
    };
  });

  function validate() {
    validated = true;
    return parse();
  }

  function stop() {
    validated = false;

    for (const key in errors) {
      errors[key] = undefined;
    }
  }

  function run() {
    if (touched && typeof touched === 'object') {
      parse(true);
    }
  }

  function rerun() {
    if (touched && typeof touched === 'object') {
      for (const key in touched) {
        touched[key] = undefined;
      }
    }
  }

  return {
    validate,
    stop,
    run,
    rerun,
  };
};
