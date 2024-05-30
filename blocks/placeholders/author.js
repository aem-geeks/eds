import { fetchPlaceholders,getMetadata } from '../../scripts/aem.js';
const placeholders = await fetchPlaceholders(getMetadata("locale"));
console.log(placeholders);
const { authorDetails,firstName,lastName,occupation,bio,topics} = placeholders;

export default function decorate(block) {
    const headingDiv=document.createElement('div');
    headingDiv.classList.add("table-heading");
    const htext=document.createTextNode(authorDetails);
    const headingH1=document.createElement('h1');
    headingH1.append(htext);
    headingDiv.append(headingH1);
    
    const table = document.createElement('table');
    let tr=document.createElement("tr");
    //let ad=document.createElement("th");ad.appendChild(document.createTextNode(authorDetails));tr.append(ad);
    let fn=document.createElement("th");fn.appendChild(document.createTextNode(firstName));tr.append(fn);
    let ln=document.createElement("th");ln.appendChild(document.createTextNode(lastName));tr.append(ln);
    let oc=document.createElement("th");oc.appendChild(document.createTextNode(occupation));tr.append(oc);
    let bi=document.createElement("th");bi.appendChild(document.createTextNode(bio));tr.append(bi);
    let to=document.createElement("th");to.appendChild(document.createTextNode(topics));tr.append(to);
    table.append(tr);
    [...block.children].forEach((row,r) => {
       let trow=document.createElement("tr");  
      [...row.children].forEach((col,c) => {
        console.log(" Row : Col  ",r,c);
        let tcol=document.createElement("td");
           tcol.appendChild(col);
           trow.append(tcol);
           row.replaceWith(trow);
      });
      table.append(trow);
    });
    block.append(headingDiv);
    block.append(table);
  }
  