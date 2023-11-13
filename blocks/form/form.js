import { addInViewAnimationToSingleElement } from '../../utils/helpers.js';

function createSelect(fd) {
  const select = document.createElement('select');
  select.id = fd.Field;
  select.name=fd.Field;
  if (fd.Placeholder) {
    const ph = document.createElement('option');
    ph.textContent = fd.Placeholder;
    ph.setAttribute('selected', '');
    ph.setAttribute('disabled', '');
    select.append(ph);
  }
  fd.Options.split(',').forEach((o) => {
    const option = document.createElement('option');
    option.textContent = o.trim();
    option.value = o.trim();
    select.append(option);
  });
  if (fd.Mandatory === 'x') {
    select.setAttribute('required', 'required');
  }
  return select;
}

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

async function submitForm(form) {
  console.log("========FORM======>",form);
  const payload = constructPayload(form);
  console.log("========Payload======>",payload);
  payload.timestamp = new Date().toJSON();
  const resp = await fetch(form.dataset.action, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: payload }),
  });
  await resp.text();
  return payload;
}


async function submitService(fd,formURL,form) {
  console.log("========FORM======>",form);
  const payload = constructPayload(form);
  console.log("========Payload======>",payload);
  payload.timestamp = new Date().toJSON();
  const resp = await fetch(form.dataset.action, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: payload }),
  });
  await resp.text();
  return payload;
}

async function createQP(qp,form){
  let qps="";
  qp.split(',').forEach((q,i)=>{
    [...form.elements].forEach((fe)=>{
      console.log(" FE NAME => ",q,fe.name,fe.value);
     if(fe.name==q){
      console.log("qps",qps);
      if(qps==""){
         qps=qps+"?"+fe.name+"="+fe.value;
        //qps.concat("?"+fe.name+"="+fe.value);
      }else{
         qps=qps+"&"+fe.name+"="+fe.value;
        //qps.concat("&"+fe.name+"="+fe.value);
      }
    }
     }); 
  })
  console.log(" QPS => ",qps);
  return qps;
}

async function createPL(pl){
  pl.split(',').forEach((i,p)=>{
     console.log(" PL => ",i,p);
  })
}

async function createParam(pp){
  pp.split(',').forEach((i,pp)=>{
     console.log(" PP => ",i,pp);
  })
}

async function getServices(fd,formURL,form){
  console.log("=====Sheet NAME=====> {} ",fd.ServiceSheet);
  const serviceURL=await formURL+fd.ServiceSheet;
  console.log("=====Sheet=====> {} ",serviceURL);
  //const { serviceData } = new URL(serviceURL);
  //console.log("=====SheetURL=====> {} ",serviceData);
  const resp = await fetch(serviceURL);
  console.log("=====RESP=====> {} ",resp);
  const json = await resp.json();
  console.log("=====SheetJSON=====> {} ",json);
  json.data.forEach((fd) => {
    console.log("===Service data ===> {} ",fd.ServiceId,fd.Url,fd.Params,fd.Payload,fd.History,fd.Cookies);
    const qp="?";
    for (let fp in fd) {
      switch (fp) {
        case 'ServiceId':
          console.log(" SERVICE ID=> ",fp,fd[fp]);
          break;
        case 'Url':
          console.log(" URL=> ",fp,fd[fp]);
          break;
        case 'Params':
          console.log(" PARAMS=> ",fp,fd[fp]);
          createQP(fd[fp],form);
          break;
        case 'Payload':
          //console.log(" PAYLOAD=> ",fp,fd[fp]);
          //createPL(fd[fp]);
          break;
        case 'History':
          //console.log(" HISTORY=> ",fp,fd[fp]);
          //createParam(fd[fp]);
          break;
        case 'Cookies':
          //console.log(" COOKIES=> ",fp,fd[fp]);
          //createParam(fd[fp]);
          break;
        default:
          console.log("=This is default case=");
      }
   }

  /* */

   submitService(fd,formURL,form);

  /* */
  })

}

function createButton(fd,formURL) {
  const button = document.createElement('button');
  button.textContent = fd.Label;
  button.classList.add('button');
  if (fd.Type === 'submit') {
    button.addEventListener('click', async (event) => {
      const form = button.closest('form');
      if (fd.Placeholder) form.dataset.action = fd.Placeholder;
      if (form.checkValidity()) {
        event.preventDefault();
        button.setAttribute('disabled', '');
        await getServices(fd,formURL,form);
        //await submitForm(form);

        //const redirectTo = fd.Extra;
        //window.location.href = redirectTo;
      }
    });
  }
  return button;
}

function createHeading(fd, el) {
  const heading = document.createElement(el);
  heading.textContent = fd.Label;
  return heading;
}

function createInput(fd) {
  const input = document.createElement('input');
  input.type = fd.Type;
  input.id = fd.Field;
  input.name=fd.Field;
  input.setAttribute('placeholder', fd.Placeholder);
  if (fd.Mandatory === 'x') {
    input.setAttribute('required', 'required');
  }
  return input;
}

function createHidden(fd) {
  const input = document.createElement('input');
  input.type = fd.Type;
  input.id = fd.Field;
  input.name=fd.Field;
  input.value=fd.Value;
  return input;
}

function createTextArea(fd) {
  const input = document.createElement('textarea');
  input.id = fd.Field;
  input.name=fd.Field;
  input.setAttribute('placeholder', fd.Placeholder);
  if (fd.Mandatory === 'x') {
    input.setAttribute('required', 'required');
  }
  return input;
}

function createLabel(fd) {
  const label = document.createElement('label');
  label.setAttribute('for', fd.Field);
  label.textContent = fd.Label;
  if (fd.Mandatory === 'x') {
    label.classList.add('required');
  }
  return label;
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


async function createForm(formURL) {
  //console.log("=====formURL=====> {} ",formURL);
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
  json.data.forEach((fd) => {
    //console.log("=====TYPE=====> {} ",fd.Field);
    fd.Type = fd.Type || 'text';
    const fieldWrapper = document.createElement('div');
    const style = fd.Style ? ` form-${fd.Style}` : '';
    const fieldId = `form-${fd.Type}-wrapper${style}`;
    //console.log("=====Field ID=====> {} ",fieldId);
    fieldWrapper.className = fieldId;
    fieldWrapper.classList.add('field-wrapper');
    switch (fd.Type) {
      case 'select':
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createSelect(fd));
        break;
      case 'heading':
        fieldWrapper.append(createHeading(fd, 'h3'));
        break;
      case 'legal':
        fieldWrapper.append(createHeading(fd, 'p'));
        break;
      case 'checkbox':
        fieldWrapper.append(createInput(fd));
        fieldWrapper.append(createLabel(fd));
        break;
      case 'text-area':
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createTextArea(fd));
        break;
      case 'hidden':
        fieldWrapper.append(createHidden(fd));
        break;        
      case 'submit':
        fieldWrapper.append(createButton(fd,formURL));
        break;
      default:
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createInput(fd));
    }

    if (fd.Rules) {
      try {
        rules.push({ fieldId, rule: JSON.parse(fd.Rules) });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`Invalid Rule ${fd.Rules}: ${e}`);
      }
    }
    form.append(fieldWrapper);
  });

  form.addEventListener('change', () => applyRules(form, rules));
  applyRules(form, rules);
  fill(form);
  return (form);
}

export default async function decorate(block) {
  //console.log("====BLOCK=====> {} ",block);
  const form = block.querySelector('a[href$=".json"]');
  console.log("====JSON URL=====> {} ",form);
  addInViewAnimationToSingleElement(block, 'fade-up');
  if (form) {
    form.replaceWith(await createForm(form.href));
  }
}
