import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import { createFractionFlowApp } from '../../../src/app/app.js';
import { drawPracticeItems, recheckUnstartedItems } from '../../../src/app/plan87-draw.js';
import { PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE, PLAN74_ADDITION_PRACTICE_TYPE, PLAN78_SUBTRACTION_PRACTICE_TYPE, PLAN82_SUBTRACTION_PRACTICE_TYPE } from '../../../src/app/practice-types.js';
import { PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V3 as set40, PLAN40_SUBTRACTION_RECIPE_RECORDS as records40 } from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import { PLAN74_RECORDS_V2 } from '../../../src/content/plan74-mixed-addition-task.js';
import { PLAN78_RECORDS_V2 } from '../../../src/content/plan78-mixed-subtraction-task.js';
import { PLAN82_RECORDS_V2 } from '../../../src/content/plan82-mixed-subtraction-task.js';
const families={40:[PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE,records40.filter(r=>set40.itemIds.includes(r.itemId))],74:[PLAN74_ADDITION_PRACTICE_TYPE,PLAN74_RECORDS_V2],78:[PLAN78_SUBTRACTION_PRACTICE_TYPE,PLAN78_RECORDS_V2],82:[PLAN82_SUBTRACTION_PRACTICE_TYPE,PLAN82_RECORDS_V2]};
const query=new URLSearchParams(location.search), family=Number(query.get('family'));
const [base,records]=families[family]??[]; if(!base) throw Error('unknown family');
const selectedId=query.get('item'), seed=query.get('seed');
const revision=family===40?set40.revision:'2', setId=family===40?set40.id:base.setId;
let chosen;
if(selectedId) { const record=records.find(r=>r.itemId===selectedId); if(!record) throw Error('unknown item'); chosen=[record]; }
else if(seed!==null && /^\d+$/.test(seed)) {
  const selection=drawPracticeItems({items:records.map(r=>({setId,revision,itemId:r.itemId})),seed:Number(seed)});
  chosen=selection.draw.map(x=>records.find(r=>r.itemId===x.itemId)); window.plan87Selection=selection;
} else throw Error('item or seed required');
const items=chosen.map(record=>family===40?{id:record.itemId,fixtureId:record.fixtureId,authoringRevision:record.authoringRevision,episodeDefinitionId:record.definitionId,episodeDefinitionRevision:record.definitionRevision,patternId:record.recipeId,patternRevision:record.patternRevision,targetDenominator:record.targetDenominator,taskDataId:record.taskDataId,taskDataRevision:record.taskDataRevision}:{id:record.itemId,episodeDefinitionId:base.episodeDefinition.id,episodeDefinitionRevision:'1'});
const type={...base,setId,setRevision:revision,items};
window.measurementApp=createFractionFlowApp({root:document.querySelector('#app'),practiceTypes:[type],presentationMode:'instant-test'});window.measurementApp.mount();

// Test-only synthetic eligibility, deliberately unrelated to measurements. Never used by normal entry.
window.applySyntheticEligibility = eligibleIds => {
  const state=window.measurementApp.getState();
  if (!window.plan87Selection || !state || state.status!=='active' || !Array.isArray(eligibleIds)) return false;
  const index=type.items.findIndex(item=>item.id===state.taskContext.itemId);
  if(index<0) return false;
  const identity=itemId=>({setId,revision,itemId});
  const prefix=type.items.slice(0,index+1);
  const plan={permutation:window.plan87Selection.permutation,draw:type.items.map(item=>identity(item.id))};
  const eligible=eligibleIds.map(identity);
  const remainder=recheckUnstartedItems({plan,started:prefix.map(x=>identity(x.id)),eligibleItems:eligible});
  const sourceById=new Map(chosen.concat(records).map(record=>[record.itemId,record]));
  const asItem=record=>family===40?{id:record.itemId,fixtureId:record.fixtureId,authoringRevision:record.authoringRevision,episodeDefinitionId:record.definitionId,episodeDefinitionRevision:record.definitionRevision,patternId:record.recipeId,patternRevision:record.patternRevision,targetDenominator:record.targetDenominator,taskDataId:record.taskDataId,taskDataRevision:record.taskDataRevision}:{id:record.itemId,episodeDefinitionId:base.episodeDefinition.id,episodeDefinitionRevision:'1'};
  type.items.splice(0,type.items.length,...prefix,...remainder.map(x=>asItem(sourceById.get(x.itemId))));
  return type.items.map(x=>x.id);
};
