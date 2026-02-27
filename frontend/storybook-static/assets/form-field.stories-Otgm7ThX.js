import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{c as x}from"./utils-BOzF_IbP.js";import{L as v}from"./label-ncJcb9vA.js";import{I as c}from"./input-jTd6TWk4.js";import"./index-Bc2G9s8g.js";import"./clsx-B-dksMZM.js";function s({label:p,htmlFor:u,error:i,className:F,children:h}){return e.jsxs("div",{className:x("space-y-2",F),children:[e.jsx(v,{htmlFor:u,children:p}),h,i&&e.jsx("p",{className:"text-sm text-destructive",children:i})]})}s.__docgenInfo={description:"",methods:[],displayName:"FormField",props:{label:{required:!0,tsType:{name:"string"},description:""},htmlFor:{required:!0,tsType:{name:"string"},description:""},error:{required:!1,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const g={title:"UI/FormField"},r={render:()=>e.jsx("div",{className:"w-80",children:e.jsx(s,{label:"Email address",htmlFor:"email",children:e.jsx(c,{id:"email",type:"email",placeholder:"you@example.com"})})})},a={render:()=>e.jsx("div",{className:"w-80",children:e.jsx(s,{label:"Email address",htmlFor:"email-err",error:"Please enter a valid email.",children:e.jsx(c,{id:"email-err",type:"email",defaultValue:"not-an-email",className:"border-destructive focus-visible:ring-destructive"})})})};var t,l,d;r.parameters={...r.parameters,docs:{...(t=r.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => <div className="w-80">
      <FormField label="Email address" htmlFor="email">
        <Input id="email" type="email" placeholder="you@example.com" />
      </FormField>
    </div>
}`,...(d=(l=r.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var o,m,n;a.parameters={...a.parameters,docs:{...(o=a.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => <div className="w-80">
      <FormField label="Email address" htmlFor="email-err" error="Please enter a valid email.">
        <Input id="email-err" type="email" defaultValue="not-an-email" className="border-destructive focus-visible:ring-destructive" />
      </FormField>
    </div>
}`,...(n=(m=a.parameters)==null?void 0:m.docs)==null?void 0:n.source}}};const I=["NoError","WithError"];export{r as NoError,a as WithError,I as __namedExportsOrder,g as default};
