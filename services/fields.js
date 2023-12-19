export function createSelect(fd) {
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

  export function createButton(fd,formURL) {
    const button = document.createElement('button');
    button.textContent = fd.Label;
    button.setAttribute("type","submit");
    button.classList.add('button');
    button.classList.add('submit');
    if (fd.Type === 'submit') {
      button.addEventListener('click', async (event) => {
        const form = button.closest('form');
        if (fd.Placeholder) form.dataset.action = fd.Placeholder;
        if (form.checkValidity()) {
          event.preventDefault();
          button.setAttribute('disabled', '');
          //await getServices(fd,formURL,form);
          //await submitForm(form);
  
          //const redirectTo = fd.Extra;
          //window.location.href = redirectTo;
        }
      });
    }
    return button;
  }
  
  export function createHeading(fd, el) {
    const heading = document.createElement(el);
    heading.textContent = fd.Label;
    return heading;
  }

  export function createInput(fd) {
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
  
  export function createHidden(fd) {
    const input = document.createElement('input');
    input.type = fd.Type;
    input.id = fd.Field;
    input.name=fd.Field;
    input.value=fd.Value;
    return input;
  }
  
  export function createTextArea(fd) {
    const input = document.createElement('textarea');
    input.id = fd.Field;
    input.name=fd.Field;
    input.setAttribute('placeholder', fd.Placeholder);
    if (fd.Mandatory === 'x') {
      input.setAttribute('required', 'required');
    }
    return input;
  }
  
  export function createLabel(fd) {
    const label = document.createElement('label');
    label.setAttribute('for', fd.Field);
    label.textContent = fd.Label;
    if (fd.Mandatory === 'x') {
      label.classList.add('required');
    }
    return label;
  }


  function addClasses(fieldWrapper,fd){
    fd.Class.split(',').forEach((c,i)=>{
      fieldWrapper.classList.add(c);
    });
  }

export function createNxtPreBtn(fd){
    const button = document.createElement('button');
    button.textContent = fd.Label;
    button.setAttribute("target",fd.Target);
    button.setAttribute("href","#"+fd.Target);
    button.setAttribute("type","#"+fd.Type);
    //button.classList.add('button');
    button.classList.add('dark-btn');
    button.classList.add('rounded-full');
    button.classList.add('btn-hover');
    return button;
  }

  export function createFormFields(stepDiv,json,form,formURL){
    json.data.forEach((fd) => {
      //console.log("---fd.Type",fd.Type,stepDiv.id);  
      if(fd.Steps==stepDiv.id){
      fd.Type = fd.Type || 'text';
      //console.log("DIV",stepDiv,fd.Steps);
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
          fieldWrapper.classList.add('select-style-1');
          fieldWrapper.classList.add('select-position');
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
        case 'next-pre':
          fieldWrapper.append(createNxtPreBtn(fd));
          addClasses(fieldWrapper,fd);
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
      stepDiv.append(fieldWrapper);
    }
    });
  }