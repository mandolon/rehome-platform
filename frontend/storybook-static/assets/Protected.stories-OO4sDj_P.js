import{r as l,R as e}from"./index-B2-qRKKC.js";import{u as f}from"./AuthProvider-cMGYVJDZ.js";import{c as E}from"./utils-D-KgF5mV.js";import"./_commonjsHelpers-Cpj98o6Y.js";const N=()=>({push:n=>{},prefetch:async n=>{},replace:n=>{}}),t=l.forwardRef(({className:n,...a},r)=>l.createElement("div",{ref:r,className:E("animate-pulse rounded-md bg-muted",n),...a}));t.displayName="Skeleton";t.__docgenInfo={description:"",methods:[],displayName:"Skeleton"};function g({children:n}){const{user:a,loading:r}=f(),c=N();return l.useEffect(()=>{!r&&!a&&c.push("/login")},[a,r,c]),r?e.createElement("div",{className:"min-h-screen bg-gray-50 p-4"},e.createElement("div",{className:"mx-auto max-w-7xl space-y-4"},e.createElement(t,{className:"h-16 w-full"}),e.createElement("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-3"},e.createElement(t,{className:"h-32 w-full"}),e.createElement(t,{className:"h-32 w-full"}),e.createElement(t,{className:"h-32 w-full"})),e.createElement(t,{className:"h-64 w-full"}))):a?e.createElement(e.Fragment,null,n):null}g.__docgenInfo={description:"",methods:[],displayName:"Protected",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const R={title:"Auth/Protected",component:g,parameters:{layout:"fullscreen",docs:{description:{component:"Gate component that renders children only when a user is authenticated. Shows a skeleton while loading and redirects to /login if unauthenticated."}}},argTypes:{children:{control:!1,description:"Content to render when authenticated"}},tags:["autodocs"]},s={name:"Authenticated",args:{children:e.createElement("div",{style:{padding:16}},e.createElement("h2",null,"Private Dashboard"),e.createElement("p",null,"This content is visible because the mocked user is authenticated."))},parameters:{globals:{role:"admin"}}},o={name:"Guest (no render)",args:{children:e.createElement("div",{style:{padding:16}},e.createElement("h2",null,"Should Not Render"),e.createElement("p",null,"As a guest, this content should not appear (Protected returns null and would redirect in app)."))},parameters:{globals:{role:"guest"}}};var d,i,u;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  name: 'Authenticated',
  args: {
    children: <div style={{
      padding: 16
    }}>\r
        <h2>Private Dashboard</h2>\r
        <p>This content is visible because the mocked user is authenticated.</p>\r
      </div>
  },
  parameters: {
    globals: {
      role: 'admin'
    }
  }
}`,...(u=(i=s.parameters)==null?void 0:i.docs)==null?void 0:u.source}}};var m,p,h;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  name: 'Guest (no render)',
  args: {
    children: <div style={{
      padding: 16
    }}>\r
        <h2>Should Not Render</h2>\r
        <p>As a guest, this content should not appear (Protected returns null and would redirect in app).</p>\r
      </div>
  },
  parameters: {
    globals: {
      role: 'guest'
    }
  }
}`,...(h=(p=o.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};const _=["Authenticated","GuestDoesNotRender"];export{s as Authenticated,o as GuestDoesNotRender,_ as __namedExportsOrder,R as default};
