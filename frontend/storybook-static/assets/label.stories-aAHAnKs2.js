import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{L as t}from"./label-ncJcb9vA.js";import{I as u}from"./input-jTd6TWk4.js";import"./index-Bc2G9s8g.js";import"./utils-BOzF_IbP.js";import"./clsx-B-dksMZM.js";const L={title:"UI/Label"},a={render:()=>e.jsx(t,{children:"Display name"})},r={render:()=>e.jsxs("div",{className:"flex flex-col gap-1.5 w-64",children:[e.jsx(t,{htmlFor:"display-name",children:"Display name"}),e.jsx(u,{id:"display-name",placeholder:"Jane Smith"})]})},s={render:()=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"checkbox",id:"agree",className:"rounded border-input"}),e.jsx(t,{htmlFor:"agree",children:"I agree to the terms and conditions"})]})};var n,o,i;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => <Label>Display name</Label>
}`,...(i=(o=a.parameters)==null?void 0:o.docs)==null?void 0:i.source}}};var d,l,c;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-1.5 w-64">
      <Label htmlFor="display-name">Display name</Label>
      <Input id="display-name" placeholder="Jane Smith" />
    </div>
}`,...(c=(l=r.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var m,p,h;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-2">
      <input type="checkbox" id="agree" className="rounded border-input" />
      <Label htmlFor="agree">I agree to the terms and conditions</Label>
    </div>
}`,...(h=(p=s.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};const v=["Standalone","WithInput","WithNativeCheckbox"];export{a as Standalone,r as WithInput,s as WithNativeCheckbox,v as __namedExportsOrder,L as default};
