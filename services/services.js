import { submitForm } from './submit.js';

export function browserId() {
  const browser = new Map();
  browser.set("ipAddress", "192.168.1.1");
  browser.set("userAgent", navigator.userAgent);
  const browserPayload = JSON.stringify(Object.fromEntries(browser));
  //console.log("==Browse User===> ",browserPayload);
  return browserPayload;
}

export function getSteps(form){
  
  const stepContainers=document.querySelectorAll(".step-container");
  //console.log("==Steps HIDE/SHOW==>",stepContainers);
  stepContainers.forEach((step)=>{
    //console.log("==Step==>",step.id);
    const stepButtons=step.querySelectorAll("button[type]");
    stepButtons.forEach((btns)=>{
      //console.log("==Buttons==>",btns,btns.classList.contains("submit"));
        if(btns.classList.contains("submit")==false){
         btns.addEventListener('click', (btn) => {
           btn.preventDefault();
          //console.log("====Click Event====",btn.target.getAttribute("target"));
           showhideSteps(btn,stepContainers);
         });
        }else if(btns.classList.contains("submit")==true){
          btns.addEventListener('click', (btn) => {
            btn.preventDefault();
            console.log(form.href);
            submitForm(form);
           });
          
        }
    });
    
  });
}

function showhideSteps(btn,stepContainers){
  const stepid=btn.target.getAttribute("target")
  
  stepContainers.forEach((step)=>{
    let containerId=step.id;
    //console.log("====Click Event====",stepid,containerId);
    if(stepid===containerId){
      //console.log("==Step=to Display=>",containerId);
      step.style.display="block";
    }else{
      //console.log("==Step=to Hide=>",containerId);
      step.style.display="none";
    }
    

  });
}


export default {
  browserId,
};
