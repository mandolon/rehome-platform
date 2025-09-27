import{R as e}from"./index-B2-qRKKC.js";import{u as y}from"./AuthProvider-cMGYVJDZ.js";import"./_commonjsHelpers-Cpj98o6Y.js";function b({area:f,children:s,fallback:l=null}){const{user:t}=y();return f==="admin"?!t||String(t.role).toLowerCase()!=="admin"?e.createElement(e.Fragment,null,l):e.createElement(e.Fragment,null,s):t?e.createElement(e.Fragment,null,s):e.createElement(e.Fragment,null,l)}b.__docgenInfo={description:"",methods:[],displayName:"RoleGate",props:{area:{required:!0,tsType:{name:"union",raw:"'admin' | 'app'",elements:[{name:"literal",value:"'admin'"},{name:"literal",value:"'app'"}]},description:""},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},fallback:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"",defaultValue:{value:"null",computed:!1}}}};const k={title:"Auth/RoleGate",component:b,parameters:{layout:"centered",docs:{description:{component:'Renders children based on area access. area="admin" shows content only to admin users; area="app" shows to any logged-in user.'}}},argTypes:{area:{control:"inline-radio",options:["admin","app"],description:"Area to guard"},fallback:{control:"text"},children:{control:!1}},tags:["autodocs"]},a={name:"Access Granted",args:{area:"app",fallback:e.createElement("div",{style:{padding:16}},"No Access"),children:e.createElement("div",{style:{padding:16}},"Secret content visible to allowed roles.")},parameters:{globals:{role:"admin"}}},n={name:"Access Denied",args:{area:"admin",fallback:e.createElement("div",{style:{padding:16}},"No Access"),children:e.createElement("div",{style:{padding:16}},"This should not render for team_member.")},parameters:{globals:{role:"team_member"}}},r={name:"Guest (Fallback)",args:{area:"app",fallback:e.createElement("div",{style:{padding:16}},"Please log in"),children:e.createElement("div",{style:{padding:16}},"Private content")},parameters:{globals:{role:"guest"}}};var o,d,c;a.parameters={...a.parameters,docs:{...(o=a.parameters)==null?void 0:o.docs,source:{originalSource:`{
  name: 'Access Granted',
  args: {
    area: 'app',
    fallback: <div style={{
      padding: 16
    }}>No Access</div>,
    children: <div style={{
      padding: 16
    }}>Secret content visible to allowed roles.</div>
  },
  parameters: {
    globals: {
      role: 'admin'
    }
  }
}`,...(c=(d=a.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var i,m,p;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`{
  name: 'Access Denied',
  args: {
    area: 'admin',
    fallback: <div style={{
      padding: 16
    }}>No Access</div>,
    children: <div style={{
      padding: 16
    }}>This should not render for team_member.</div>
  },
  parameters: {
    globals: {
      role: 'team_member'
    }
  }
}`,...(p=(m=n.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var u,g,v;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  name: 'Guest (Fallback)',
  args: {
    area: 'app',
    fallback: <div style={{
      padding: 16
    }}>Please log in</div>,
    children: <div style={{
      padding: 16
    }}>Private content</div>
  },
  parameters: {
    globals: {
      role: 'guest'
    }
  }
}`,...(v=(g=r.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};const E=["AccessGranted","AccessDenied","GuestFallback"];export{n as AccessDenied,a as AccessGranted,r as GuestFallback,E as __namedExportsOrder,k as default};
