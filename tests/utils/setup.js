import { describe, it } from 'node:test'
import { RuleTester } from 'eslint'

RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only
