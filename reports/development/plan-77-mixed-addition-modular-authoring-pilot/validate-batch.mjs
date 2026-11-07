import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { validatePlan74Batch } from '../../../src/content/plan74-mixed-addition-task.js';
if (process.argv.length !== 3) {
  console.error('Usage: node reports/development/plan-77-mixed-addition-modular-authoring-pilot/validate-batch.mjs <batch-module>');
  process.exitCode = 2;
} else {
  try {
    const { records, membership } = await import(pathToFileURL(resolve(process.argv[2])).href);
    const errors = validatePlan74Batch(records, membership);
    if (errors.length) {
      for (const {item,reason} of errors) console.error(`${item}: ${reason}`);
      process.exitCode = 1;
    } else console.log(`Valid: ${records.length} records, ${membership.items.length} members (${membership.setId} revision ${membership.setRevision}).`);
  } catch (error) {
    console.error(`Unable to load or validate batch: ${error.message}`);
    process.exitCode = 2;
  }
}
