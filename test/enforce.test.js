/* eslint-env mocha */
const { RuleTester } = require('eslint');
const fs = require('fs');
const rule = require('../lib/enforce.js');

const ruleTester = new RuleTester({
  parser: fs.realpathSync('./node_modules/@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2015,
    requireConfigFile: false,
    sourceType: 'module',
    babelOptions: {
      presets: [
        '@babel/preset-flow',
      ],
    },
  },
});

const repeatString = (str, times) => [...new Array(times + 1)].join(str);

ruleTester.run('enforce', rule, {
  valid: [
    {
      code: "import { a, b, c, d } from './test'",
    },
    {
      code: "import type { a, b, c, d } from './test'",
    },
    {
      code: "import { type a, b, type c, d } from './test'",
    },
    {
      code: "import { a, b, c, d } from './test'",
      options: [6],
    },
    {
      code: "import { a, b, c, d } from './test'",
      options: [{
        items: 6,
      }],
    },
    {
      code: "import {\na,\nb,\nc\n} from './test'",
      options: [2],
    },
    {
      code: "import type {\na,\nb,\nc\n} from './test'",
      options: [2],
    },
    {
      code: "import {\ntype a,\nb,\ntype c\n} from './test'",
      options: [2],
    },
    {
      code: "import {\na,\nb,\nc\n} from './test'",
      options: [{
        items: 2,
      }],
    },
    {
      code: "import test from './test'",
    },
    {
      code: "import test, { a } from './test'",
    },
    {
      code: "import * as test from './test'",
    },
    {
      code: "import './test.css'",
    },
    {
      code: "import { a, b, c, d } from './test'",
      options: [4, 50],
    },
    {
      code: "import { a, b, c, d } from './test'",
      options: [{
        items: 4,
        'max-len': 50,
      }],
    },
    {
      code: `import { ${repeatString('a', 25)} } from './test'`,
      options: [1, 50],
    },
    {
      code: `import { ${repeatString('a', 25)} } from './test'`,
      options: [{
        items: 1,
        'max-len': 50,
      }],
    },
    {
      code: `import {\n${repeatString('a', 25)},\n${repeatString('b', 25)}\n} from './test'`,
      options: [6, 50],
    },
    {
      code: `import {\n${repeatString('a', 25)},\n${repeatString('b', 25)}\n} from './test'`,
      options: [{
        items: 6,
        'max-len': 50,
      }],
    },
    {
      code: "import a from 'a'",
      options: [10, 17],
    },
    {
      code: "import a from 'a'",
      options: [{
        items: 10,
        'max-len': 17,
      }],
    },
    {
      code: "import { a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t } from './test'",
      options: [20, 83],
    },
    {
      code: "import { a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t } from './test'",
      options: [{
        items: 20,
        'max-len': 83,
      }],
    },
    {
      code: "import test, { a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t } from './test'",
      options: [20, 89],
    },
    {
      code: "import test, { a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t } from './test'",
      options: [{
        items: 20,
        'max-len': 89,
      }],
    },
    {
      code: `import { ${repeatString('a', 512)} } from './test'`,
      options: [1],
    },
    {
      code: `import { ${repeatString('a', 512)} } from './test'`,
      options: [{
        items: 1,
      }],
    },
    {
      code: "import {\n    aaaaaaaaaaa,\n    aaaaaaaaaaaaaaaaaaa,\n    aaaaaaaaaaaaa\n} from './aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';",
      options: [{
        items: 4,
        'max-len': 140,
        semi: true,
      }],
    },
    {
      code: "import { aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa } from './aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';",
      options: [{
        items: 4,
        'max-len': 140,
        semi: true,
      }],
    },
    {
      code: "import aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, { aaa } from './aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';",
      options: [{
        items: 4,
        'max-len': 140,
        semi: true,
      }],
    },
  ],

  invalid: [
    {
      code: "import {\na,\nb\n} from './test'",
      output: "import { a, b } from './test'",
      options: [4],
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: "import test, {\na as apple,\nb as banana\n} from './test'",
      output: "import test, { a as apple, b as banana } from './test'",
      options: [2],
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: "import test, {\na,\nb\n} from './test'",
      output: "import test, { a, b } from './test'",
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: "import test, {\na,\nb\n} from './test'",
      output: "import test, { a, b } from './test';",
      options: [{
        semi: true,
      }],
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: "import { a, b, c, d } from './test'",
      output: "import {\na,\nb,\nc,\nd\n} from './test'",
      options: [1],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      code: "import { a, b, c, d } from './test'",
      output: "import {\na,\nb,\nc,\nd\n} from './test';",
      options: [{
        items: 1,
        semi: true,
      }],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      code: "import test, { a, b } from './test'",
      output: "import test, {\na,\nb\n} from './test'",
      options: [1],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      code: "import test, { a, b as banana } from './test'",
      output: "import test, {\na,\nb as banana\n} from './test'",
      options: [1],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      code: "import { \na,\n\nb,\n\n\nc,\n\n\nd,\n\n\n\ne\n} from './test'",
      output: "import {\na,\nb,\nc,\nd,\ne\n} from './test'",
      options: [4],
      errors: [{ messageId: 'noBlankBetween' }],
    },
    {
      code: "import { a,\n\n\nb } from './test'",
      output: "import {\na,\nb\n} from './test'",
      options: [1],
      errors: [{ messageId: 'noBlankBetween' }],
    },
    {
      code: "import {\n\na,\nb\n\n\n} from './test'",
      output: "import {\na,\nb\n} from './test'",
      options: [1],
      errors: [{ messageId: 'limitLineCount' }],
    },
    {
      code: "import {\na, b, c\n} from './test'",
      output: "import {\na,\nb,\nc\n} from './test'",
      options: [1],
      errors: [{ messageId: 'limitLineCount' }],
    },
    {
      code: "import { getPublicStaticVoidFinalObjectClassExtensionFactory } from './test'",
      output: "import {\ngetPublicStaticVoidFinalObjectClassExtensionFactory\n} from './test'",
      options: [4, 50],
      errors: [{ messageId: 'mustSplitLong' }],
    },
    {
      code: "import { aaaaaaaaaa, bbbbbbbbbb, cccccccccc, dddddddddd } from './test'",
      output: "import {\naaaaaaaaaa,\nbbbbbbbbbb,\ncccccccccc,\ndddddddddd\n} from './test'",
      options: [4, 50],
      errors: [{ messageId: 'mustSplitLong' }],
    },
    {
      code: "import {\n    aaaaaaaaaaa,\n    aaaaaaaaaaaaaaaaaaa,\n    aaaaaaaaaaaaa\n} from './aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';",
      output: "import { aaaaaaaaaaa, aaaaaaaaaaaaaaaaaaa, aaaaaaaaaaaaa } from './aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'",
      options: [{
        items: 4,
        'max-len': 140,
        semi: false,
      }],
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: "import { aaaaaaaaaaa, aaaaaaaaaaaaaaaaaaa, aaaaaaaaaaaaa } from './aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';",
      output: "import {\naaaaaaaaaaa,\naaaaaaaaaaaaaaaaaaa,\naaaaaaaaaaaaa\n} from './aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';",
      options: [{
        items: 4,
        'max-len': 140,
        semi: true,
      }],
      errors: [{ messageId: 'mustSplitLong' }],
    },
    {
      code: "import type { a, b, c, d } from './test'",
      output: "import type {\na,\nb,\nc,\nd\n} from './test'",
      options: [1],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      code: "import { type a, b, type c, d } from './test'",
      output: "import {\ntype a,\nb,\ntype c,\nd\n} from './test'",
      options: [1],
      errors: [{ messageId: 'mustSplitMany' }],
    },
  ],
});
