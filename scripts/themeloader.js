import {
    loadCSS,
    getMetadata,
  } from './aem.js';

  async function loadTheme() {
    let theme=getMetadata('theme');
    console.log('===Theme===> ',theme);
    if(theme==''){
        await loadCSS(`${window.hlx.codeBasePath}/styles/styles.css`);
    }else{
        await loadCSS(`${window.hlx.codeBasePath}/themes/${theme}.css`);
    }
  } 

  export {
    loadTheme
  };