import{j as h}from"./jsx-runtime-DFAAy_2V.js";import{c as S}from"./utils-BOzF_IbP.js";import"./index-Bc2G9s8g.js";import"./clsx-B-dksMZM.js";const O={default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground"};function f({className:y,variant:b="default",...x}){return h.jsx("div",{className:S("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",O[b],y),...x})}f.__docgenInfo={description:"",methods:[],displayName:"Badge",props:{variant:{required:!1,tsType:{name:"union",raw:"'default' | 'secondary' | 'destructive' | 'outline'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'destructive'"},{name:"literal",value:"'outline'"}]},description:"",defaultValue:{value:"'default'",computed:!1}}}};const E={component:f,title:"UI/Badge",args:{children:"Badge"}},e={},r={args:{variant:"secondary"}},a={args:{variant:"destructive",children:"Over budget"}},t={args:{variant:"outline",children:"Pending"}};var n,s,o;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:"{}",...(o=(s=e.parameters)==null?void 0:s.docs)==null?void 0:o.source}}};var i,c,d;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    variant: 'secondary'
  }
}`,...(d=(c=r.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var u,l,m;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: 'destructive',
    children: 'Over budget'
  }
}`,...(m=(l=a.parameters)==null?void 0:l.docs)==null?void 0:m.source}}};var p,g,v;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    variant: 'outline',
    children: 'Pending'
  }
}`,...(v=(g=t.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};const I=["Default","Secondary","Destructive","Outline"];export{e as Default,a as Destructive,t as Outline,r as Secondary,I as __namedExportsOrder,E as default};
