import{r as c,R as e}from"./index-B2-qRKKC.js";import{F as P,A as _}from"./FilamentResourceGuard-BFda2jSh.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./auth-context.storybook-D1c3gY5-.js";function p(){var E,x;const[m,u]=c.useState([{id:1,name:"Alpha Workspace",owner:"Alice Admin",members:5},{id:2,name:"Beta Workspace",owner:"Mark PM",members:12}]),[b,N]=c.useState(1),[r,n]=c.useState({}),s=c.useMemo(()=>m.find(a=>a.id===b)||null,[m,b]),C=()=>{var l,f;const a=Math.max(0,...m.map(g=>g.id))+1,t={id:a,name:((l=r.name)==null?void 0:l.toString())||`Workspace ${a}`,owner:((f=r.owner)==null?void 0:f.toString())||"Unknown",members:Number(r.members??0)};u(g=>[...g,t]),N(a),n({})},G=()=>{s&&(u(a=>a.map(t=>t.id===s.id?{...s,...r,members:Number(r.members??s.members)}:t)),n({}))},M=a=>{u(t=>t.filter(l=>l.id!==a)),b===a&&N(null)};return e.createElement(P,{resourceType:"workspaces"},e.createElement("div",{className:"grid grid-cols-12 gap-4 p-4"},e.createElement("section",{className:"col-span-5 border rounded p-3"},e.createElement("h2",{className:"font-semibold mb-2"},"Workspaces"),e.createElement("ul",{className:"divide-y"},m.map(a=>e.createElement("li",{key:a.id,className:"py-2 flex items-center justify-between"},e.createElement("button",{className:"text-left",onClick:()=>N(a.id)},e.createElement("div",{className:"font-medium"},a.name),e.createElement("div",{className:"text-xs text-gray-500"},"Owner: ",a.owner," • Members: ",a.members)),e.createElement("button",{className:"text-red-600 text-sm",onClick:()=>M(a.id),"aria-label":`Delete ${a.name}`},"Delete"))))),e.createElement("section",{className:"col-span-7 border rounded p-3"},e.createElement("h2",{className:"font-semibold mb-2"},"Detail"),s?e.createElement("div",{className:"space-y-2","aria-live":"polite"},e.createElement("div",null,e.createElement("span",{className:"text-sm text-gray-500"},"ID:")," ",s.id),e.createElement("div",null,e.createElement("span",{className:"text-sm text-gray-500"},"Name:")," ",s.name),e.createElement("div",null,e.createElement("span",{className:"text-sm text-gray-500"},"Owner:")," ",s.owner),e.createElement("div",null,e.createElement("span",{className:"text-sm text-gray-500"},"Members:")," ",s.members)):e.createElement("p",{className:"text-sm text-gray-500"},"No workspace selected"),e.createElement("div",{className:"mt-4 border-t pt-3"},e.createElement("h3",{className:"font-medium mb-2"},"Edit/Create"),e.createElement("form",{className:"grid grid-cols-2 gap-2",onSubmit:a=>a.preventDefault()},e.createElement("label",{className:"flex flex-col gap-1"},e.createElement("span",{className:"text-sm"},"Name"),e.createElement("input",{className:"border rounded p-2",value:((E=r.name)==null?void 0:E.toString())||"",onChange:a=>n(t=>({...t,name:a.target.value}))})),e.createElement("label",{className:"flex flex-col gap-1"},e.createElement("span",{className:"text-sm"},"Owner"),e.createElement("input",{className:"border rounded p-2",value:((x=r.owner)==null?void 0:x.toString())||"",onChange:a=>n(t=>({...t,owner:a.target.value}))})),e.createElement("label",{className:"flex flex-col gap-1 col-span-2"},e.createElement("span",{className:"text-sm"},"Members"),e.createElement("input",{type:"number",className:"border rounded p-2",value:r.members??"",onChange:a=>n(t=>({...t,members:Number(a.target.value)}))})),e.createElement("div",{className:"col-span-2 flex gap-2 mt-2"},e.createElement("button",{className:"bg-blue-600 text-white px-3 py-2 rounded",onClick:C,"aria-label":"Create workspace"},"Create"),e.createElement("button",{className:"bg-amber-600 text-white px-3 py-2 rounded",onClick:G,disabled:!s,"aria-disabled":!s,"aria-label":"Update workspace"},"Update")))))))}p.__docgenInfo={description:"",methods:[],displayName:"WorkspacesAdminPanel"};const U={title:"Admin/Workspaces/WorkspacesAdminPanel",component:p,parameters:{layout:"fullscreen",a11y:{disable:!1}}},o={name:"List + Detail (Admin)",args:{},parameters:{globals:{role:"admin"}}},d={name:"Hidden for Non-Admins",render:()=>e.createElement(_,{fallback:e.createElement("div",{style:{padding:16}},"No access")},e.createElement(p,null)),parameters:{globals:{role:"team_member"}}},i={name:"Access Denied (Guest)",parameters:{globals:{role:"guest"}},render:()=>e.createElement(p,null)};var k,A,v;o.parameters={...o.parameters,docs:{...(k=o.parameters)==null?void 0:k.docs,source:{originalSource:`{
  name: 'List + Detail (Admin)',
  args: {},
  parameters: {
    globals: {
      role: 'admin'
    }
  }
}`,...(v=(A=o.parameters)==null?void 0:A.docs)==null?void 0:v.source}}};var y,h,S;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'Hidden for Non-Admins',
  render: () => <AdminSectionGuard fallback={<div style={{
    padding: 16
  }}>No access</div>}>\r
      <WorkspacesAdminPanel />\r
    </AdminSectionGuard>,
  parameters: {
    globals: {
      role: 'team_member'
    }
  }
}`,...(S=(h=d.parameters)==null?void 0:h.docs)==null?void 0:S.source}}};var w,D,W;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'Access Denied (Guest)',
  parameters: {
    globals: {
      role: 'guest'
    }
  },
  render: () => <WorkspacesAdminPanel />
}`,...(W=(D=i.parameters)==null?void 0:D.docs)==null?void 0:W.source}}};const R=["Default","HiddenForNonAdmins","AccessDeniedWhenGuest"];export{i as AccessDeniedWhenGuest,o as Default,d as HiddenForNonAdmins,R as __namedExportsOrder,U as default};
