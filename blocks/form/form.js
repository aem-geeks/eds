import { browserId,getSteps } from '../../services/services.js';
import {createSelect,createLabel,createTextArea,createHidden,createInput,createHeading,createButton ,createFormFields} from '../../services/fields.js';



function constructPayload(form) {
  const payload = {};
  [...form.elements].forEach((fe) => {
    if (fe.type === 'checkbox') {
      if (fe.checked) payload[fe.id] = fe.value;
    } else if (fe.id) {
      payload[fe.id] = fe.value;
    }
    //console.log(" FD====> ",fe.name,fe.value);
  });
  return payload;
}

function addClasses(fieldWrapper,fd){
  fd.Class.split(',').forEach((c,i)=>{
    fieldWrapper.classList.add(c);
  });
}




async function createParam(pp){
  pp.split(',').forEach((i,pp)=>{
     console.log(" PP => ",i,pp);
  })
}

function applyRules(form, rules) {
  const payload = constructPayload(form);
  rules.forEach((field) => {
    const { type, condition: { key, operator, value } } = field.rule;
    if (type === 'visible') {
      if (operator === 'eq') {
        if (payload[key] === value) {
          form.querySelector(`.${field.fieldId}`).classList.remove('hidden');
        } else {
          form.querySelector(`.${field.fieldId}`).classList.add('hidden');
        }
      }
    }
  });
}

function fill(form) {
  const { action } = form.dataset;
  if (action === '/tools/bot/register-form') {
    const loc = new URL(window.location.href);
    form.querySelector('#owner').value = loc.searchParams.get('owner') || '';
    form.querySelector('#installationId').value = loc.searchParams.get('id') || '';
  }
}

function createStepMap(stepsMap,row,stepsArray){
  stepsMap.set(row.Steps,row.Steps);
  stepsMap.set("step",row.Steps);
  stepsMap.set("type",row.Type);
  if(row.Field=="next"){
    //stepsMap.set("target","Step"+(stepsArray.length+1));
    stepsMap.set("btn_next_name",row.Field);
    stepsMap.set("btn_next",row.Field);
    stepsMap.set("btn_next_target",row.Target);
    stepsMap.set("btn_next_label",row.Label);
  }else if(row.Field=="previous"){
    //stepsMap.set("target","Step"+(stepsArray.length-1));
    stepsMap.set("btn_pre_name",row.Field);
    stepsMap.set("btn_pre",row.Field);
    stepsMap.set("btn_pre_target",row.Target);
    stepsMap.set("btn_pre_label",row.Label);
  }
  return stepsMap;
}

function createStepsArray(formInfo){
  const stepsArray=[];
  let step;
  formInfo.data.forEach((s,i)=>{
    if(s.Type=="next-pre"){
      step=s.Steps;
      //console.log("--LLLL---->",stepsArray.length);      
      if(stepsArray.length>0 && stepsArray[stepsArray.length-1].has(step)){
        let stepsMap= stepsArray[stepsArray.length-1];
        createStepMap(stepsMap,s,stepsArray);
      }else if(stepsArray.length>0 && !stepsArray[stepsArray.length-1].has(step)){
        let stepsMap= new Map();
        createStepMap(stepsMap,s,stepsArray);
        stepsArray.push(stepsMap);
      }else if(stepsArray.length == 0){
        let stepsMap= new Map();
        createStepMap(stepsMap,s,stepsArray);
        stepsArray.push(stepsMap);
      } 
   }
  });
  return stepsArray;
}

async function createStep(stepDiv,form,formURL,m){
  stepDiv.id=m.Id;
  stepDiv.innerHTML=m.Label;
  addClasses(stepDiv,m);
  const pathname=formURL+"?sheet="+m.Steps
  let promise = Promise.resolve(fetch(pathname));
  promise.then(function (resp) {
      return resp.json();
  }).then(function (json) {
    //console.log("==Creating Fields===>",json.data);
    createFormFields(stepDiv,json,form,formURL);
    
});
 if(m.Steps!=='step1'){
    stepDiv.style.display="none";
 }
 form.append(stepDiv);
}


async function createFormSteps(json,form,formURL){
  
  //createStepsArray(json).forEach((m,i)=>{
    const stepsArray=new Array();
    (json.data).forEach((m,i)=>{
    const stepDiv=document.createElement('div');
    stepsArray.push(stepDiv);
    createStep(stepDiv,form,formURL,m);

  });
}





async function createForm(formURL) {
  console.log("=====formURL=====> {} ",formURL);
  const { pathname } = new URL(formURL);
  //console.log("=====pathname=====> {} ",pathname);
  const resp = await fetch(pathname);
  const json = await resp.json();
  //console.log("=====JSON=====> {} ",json);
  const form = document.createElement('form');



  const rules = [];
  // eslint-disable-next-line prefer-destructuring
  form.dataset.action = pathname.split('.json')[0];
  //console.log("=====ACTION=====> {} ",form.dataset.action);
  
 //console.log("=============>",json.data[0].Steps);
   if(json.data[0].Steps){
      //console.log("----This is MultiStep Form---");
      createFormSteps(json,form,formURL);
      
   }

  //console.log("=========JSON DATA========>",json.data,json);



  form.addEventListener('change', () => applyRules(form, rules));
  applyRules(form, rules);
  //fill(form);
  return (form);
}

export default async function decorate(block) {
  //console.log("====BLOCK=====> {} ",block);
  const form = block.querySelector('a[href$=".json"]');
  //console.log("====JSON URL=====> {} ",form);
  //addInViewAnimationToSingleElement(block, 'fade-up');
  if (form) {

    form.replaceWith(await createForm(form.href));
    setTimeout(() => {  
      console.log('Calling Hide Show!'); 
      getSteps(form);
    }, 2000);
  
  }
}
