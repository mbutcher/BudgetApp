import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{r as a}from"./index-Bc2G9s8g.js";import{w as _,e as v,u as O}from"./index-BEIOxGzJ.js";import{c as d}from"./utils-BOzF_IbP.js";import"./clsx-B-dksMZM.js";const I=a.createContext(null);function C(){const n=a.useContext(I);if(!n)throw new Error("Tabs subcomponent used outside <Tabs>");return n}function D({value:n,onValueChange:t,className:s,...r}){return e.jsx(I.Provider,{value:{value:n,onValueChange:t},children:e.jsx("div",{className:d("w-full",s),...r})})}const b=a.forwardRef(({className:n,...t},s)=>e.jsx("div",{ref:s,className:d("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",n),...t}));b.displayName="TabsList";const o=a.forwardRef(({className:n,value:t,...s},r)=>{const{value:m,onValueChange:S}=C(),T=m===t;return e.jsx("button",{ref:r,role:"tab","aria-selected":T,className:d("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",T?"bg-background text-foreground shadow-sm":"hover:bg-background/50 hover:text-foreground",n),onClick:()=>S(t),...s})});o.displayName="TabsTrigger";const i=a.forwardRef(({className:n,value:t,...s},r)=>{const{value:m}=C();return m!==t?null:e.jsx("div",{ref:r,role:"tabpanel",className:d("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",n),...s})});i.displayName="TabsContent";D.__docgenInfo={description:"",methods:[],displayName:"Tabs",props:{value:{required:!0,tsType:{name:"string"},description:""},onValueChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""}}};b.__docgenInfo={description:"",methods:[],displayName:"TabsList"};o.__docgenInfo={description:"",methods:[],displayName:"TabsTrigger",props:{value:{required:!0,tsType:{name:"string"},description:""}}};i.__docgenInfo={description:"",methods:[],displayName:"TabsContent",props:{value:{required:!0,tsType:{name:"string"},description:""}}};const V={title:"UI/Tabs"};function p({defaultTab:n="overview"}){const[t,s]=a.useState(n);return e.jsxs(D,{value:t,onValueChange:s,className:"w-96",children:[e.jsxs(b,{children:[e.jsx(o,{value:"overview",children:"Overview"}),e.jsx(o,{value:"transactions",children:"Transactions"}),e.jsx(o,{value:"settings",children:"Settings"})]}),e.jsx(i,{value:"overview",children:e.jsx("p",{className:"p-4 text-sm",children:"Overview tab content."})}),e.jsx(i,{value:"transactions",children:e.jsx("p",{className:"p-4 text-sm",children:"Transactions tab content."})}),e.jsx(i,{value:"settings",children:e.jsx("p",{className:"p-4 text-sm",children:"Settings tab content."})})]})}const c={render:()=>e.jsx(p,{defaultTab:"overview"})},u={render:()=>e.jsx(p,{defaultTab:"transactions"})},l={render:()=>e.jsx(p,{defaultTab:"overview"}),play:async({canvasElement:n})=>{const t=_(n);await v(t.getByText("Overview tab content.")).toBeInTheDocument();const s=t.getByRole("button",{name:/transactions/i});await O.click(s),await v(t.getByText("Transactions tab content.")).toBeInTheDocument(),await v(t.queryByText("Overview tab content.")).not.toBeInTheDocument()}};var g,f,x;c.parameters={...c.parameters,docs:{...(g=c.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <TabsDemo defaultTab="overview" />
}`,...(x=(f=c.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var w,h,y;u.parameters={...u.parameters,docs:{...(w=u.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <TabsDemo defaultTab="transactions" />
}`,...(y=(h=u.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var j,N,B;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <TabsDemo defaultTab="overview" />,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Initially on Overview
    await expect(canvas.getByText('Overview tab content.')).toBeInTheDocument();

    // Click Transactions tab
    const txTab = canvas.getByRole('button', {
      name: /transactions/i
    });
    await userEvent.click(txTab);

    // Transactions content is now visible; Overview content is gone
    await expect(canvas.getByText('Transactions tab content.')).toBeInTheDocument();
    await expect(canvas.queryByText('Overview tab content.')).not.toBeInTheDocument();
  }
}`,...(B=(N=l.parameters)==null?void 0:N.docs)==null?void 0:B.source}}};const L=["FirstTabActive","SecondTabActive","InteractionSwitchTabs"];export{c as FirstTabActive,l as InteractionSwitchTabs,u as SecondTabActive,L as __namedExportsOrder,V as default};
