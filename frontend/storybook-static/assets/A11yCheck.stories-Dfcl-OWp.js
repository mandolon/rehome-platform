import{j as e}from"./jsx-runtime-Bkl-fPu3.js";import"./index-yBjzXJbu.js";const l={title:"Checks/A11y",parameters:{a11y:{config:{rules:[{id:"label",enabled:!0}]}}}},r={render:()=>e.jsxs("div",{children:[e.jsx("h2",{children:"A11y Violation Example"}),e.jsx("button",{children:"Button without accessible name"}),e.jsx("input",{type:"text",placeholder:"Input without label"})]})},t={render:()=>e.jsxs("div",{children:[e.jsx("h2",{children:"A11y Fixed Example"}),e.jsx("button",{"aria-label":"Submit form",children:"Submit"}),e.jsx("label",{htmlFor:"email",children:"Email"}),e.jsx("input",{id:"email",type:"email",placeholder:"Enter your email"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div>\r
      <h2>A11y Violation Example</h2>\r
      <button>Button without accessible name</button>\r
      <input type="text" placeholder="Input without label" />\r
    </div>
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div>\r
      <h2>A11y Fixed Example</h2>\r
      <button aria-label="Submit form">Submit</button>\r
      <label htmlFor="email">Email</label>\r
      <input id="email" type="email" placeholder="Enter your email" />\r
    </div>
}`,...t.parameters?.docs?.source}}};const n=["Violating","Fixed"];export{t as Fixed,r as Violating,n as __namedExportsOrder,l as default};
