// Report-local test harness, served by the local Vite server only.
import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import { createFractionFlowApp } from '../../../src/app/app.js';
import { PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE as base } from '../../../src/app/practice-types.js';
import { PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V3 as set, PLAN40_SUBTRACTION_RECIPE_RECORDS as records } from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';
const items=set.itemIds.map(id=>{
  const r=records.find(record=>record.itemId===id);if(!r)throw Error(`missing registered item ${id}`);
  return {id:r.itemId,fixtureId:r.fixtureId,authoringRevision:r.authoringRevision,episodeDefinitionId:r.definitionId,episodeDefinitionRevision:r.definitionRevision,patternId:r.recipeId,patternRevision:r.patternRevision,targetDenominator:r.targetDenominator,taskDataId:r.taskDataId,taskDataRevision:r.taskDataRevision};
});
const type={...base,setId:set.id,setRevision:set.revision,items};
window.plan89ReviewApp=createFractionFlowApp({root:document.querySelector('#app'),practiceTypes:[type],presentationMode:'instant-test'});
window.plan89ReviewApp.mount();
