import{j as e}from"./jsx-runtime-Bkl-fPu3.js";import{B as d}from"./button-DxiiD8aR.js";import{C as m,c as p}from"./card-BvUaGs8v.js";import{F as u,S as g}from"./settings-5kTb9Djr.js";import{c as f}from"./createLucideIcon-DDzH4Jbm.js";import"./index-yBjzXJbu.js";import"./index-QQMyt9Ur.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DpZA7tDW.js";import"./index-CdJFUDDL.js";import"./utils-CBfrqCZ4.js";/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],h=f("users",y);function n({icon:i,title:c,description:l,action:a}){return e.jsx(m,{children:e.jsxs(p,{className:"flex flex-col items-center justify-center py-12 text-center",children:[i&&e.jsx("div",{className:"mb-4 text-muted-foreground",children:i}),e.jsx("h3",{className:"text-lg font-semibold mb-2",children:c}),e.jsx("p",{className:"text-muted-foreground mb-6 max-w-sm",children:l}),a&&e.jsx(d,{onClick:a.onClick,children:a.label})]})})}n.__docgenInfo={description:"",methods:[],displayName:"EmptyState",props:{icon:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},title:{required:!0,tsType:{name:"string"},description:""},description:{required:!0,tsType:{name:"string"},description:""},action:{required:!1,tsType:{name:"signature",type:"object",raw:`{\r
  label: string;\r
  onClick: () => void;\r
}`,signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"onClick",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!0}}]}},description:""}}};const T={title:"UI/EmptyState",component:n},t={args:{title:"No requests found",description:"Get started by creating your first request.",action:{label:"Create Request",onClick:()=>console.log("Create request clicked")}}},r={args:{icon:e.jsx(u,{className:"h-12 w-12"}),title:"No files uploaded",description:"Upload your first file to get started.",action:{label:"Upload File",onClick:()=>console.log("Upload file clicked")}}},o={args:{icon:e.jsx(h,{className:"h-12 w-12"}),title:"No team members",description:"Team members will appear here once they are added."}},s={args:{icon:e.jsx(g,{className:"h-12 w-12"}),title:"Settings not configured",description:"Configure your settings to get started.",action:{label:"Configure",onClick:()=>console.log("Configure clicked")}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'No requests found',
    description: 'Get started by creating your first request.',
    action: {
      label: 'Create Request',
      onClick: () => console.log('Create request clicked')
    }
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    icon: <FileText className="h-12 w-12" />,
    title: 'No files uploaded',
    description: 'Upload your first file to get started.',
    action: {
      label: 'Upload File',
      onClick: () => console.log('Upload file clicked')
    }
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    icon: <Users className="h-12 w-12" />,
    title: 'No team members',
    description: 'Team members will appear here once they are added.'
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    icon: <Settings className="h-12 w-12" />,
    title: 'Settings not configured',
    description: 'Configure your settings to get started.',
    action: {
      label: 'Configure',
      onClick: () => console.log('Configure clicked')
    }
  }
}`,...s.parameters?.docs?.source}}};const E=["Default","WithIcon","WithoutAction","SettingsExample"];export{t as Default,s as SettingsExample,r as WithIcon,o as WithoutAction,E as __namedExportsOrder,T as default};
