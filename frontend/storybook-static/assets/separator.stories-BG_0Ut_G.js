import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{r as h}from"./index-Bc2G9s8g.js";import{c as u}from"./utils-BOzF_IbP.js";import"./clsx-B-dksMZM.js";const s=h.forwardRef(({className:m,orientation:p="horizontal",...d},x)=>e.jsx("hr",{ref:x,className:u("shrink-0 border-border",p==="horizontal"?"h-[1px] w-full border-t":"h-full w-[1px] border-l",m),...d}));s.displayName="Separator";s.__docgenInfo={description:"",methods:[],displayName:"Separator",props:{orientation:{required:!1,tsType:{name:"union",raw:"'horizontal' | 'vertical'",elements:[{name:"literal",value:"'horizontal'"},{name:"literal",value:"'vertical'"}]},description:"",defaultValue:{value:"'horizontal'",computed:!1}}}};const j={title:"UI/Separator"},a={render:()=>e.jsxs("div",{className:"w-64 space-y-4",children:[e.jsx("p",{className:"text-sm",children:"Section A"}),e.jsx(s,{}),e.jsx("p",{className:"text-sm",children:"Section B"})]})},r={render:()=>e.jsxs("div",{className:"flex h-10 items-center gap-4",children:[e.jsx("span",{className:"text-sm",children:"Left"}),e.jsx(s,{orientation:"vertical"}),e.jsx("span",{className:"text-sm",children:"Right"})]})};var t,o,n;a.parameters={...a.parameters,docs:{...(t=a.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => <div className="w-64 space-y-4">
      <p className="text-sm">Section A</p>
      <Separator />
      <p className="text-sm">Section B</p>
    </div>
}`,...(n=(o=a.parameters)==null?void 0:o.docs)==null?void 0:n.source}}};var i,c,l;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <div className="flex h-10 items-center gap-4">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
}`,...(l=(c=r.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};const g=["Horizontal","Vertical"];export{a as Horizontal,r as Vertical,g as __namedExportsOrder,j as default};
