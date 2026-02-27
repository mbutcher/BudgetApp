import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{r as n}from"./index-Bc2G9s8g.js";import{c as d}from"./utils-BOzF_IbP.js";import{B as T}from"./button-CScwkglh.js";import"./clsx-B-dksMZM.js";const t=n.forwardRef(({className:r,...a},s)=>e.jsx("div",{ref:s,className:d("rounded-lg border bg-card text-card-foreground shadow-sm",r),...a}));t.displayName="Card";const m=n.forwardRef(({className:r,...a},s)=>e.jsx("div",{ref:s,className:d("flex flex-col space-y-1.5 p-6",r),...a}));m.displayName="CardHeader";const p=n.forwardRef(({className:r,...a},s)=>e.jsx("h3",{ref:s,className:d("text-2xl font-semibold leading-none tracking-tight",r),...a}));p.displayName="CardTitle";const C=n.forwardRef(({className:r,...a},s)=>e.jsx("p",{ref:s,className:d("text-sm text-muted-foreground",r),...a}));C.displayName="CardDescription";const o=n.forwardRef(({className:r,...a},s)=>e.jsx("div",{ref:s,className:d("p-6 pt-0",r),...a}));o.displayName="CardContent";const x=n.forwardRef(({className:r,...a},s)=>e.jsx("div",{ref:s,className:d("flex items-center p-6 pt-0",r),...a}));x.displayName="CardFooter";t.__docgenInfo={description:"",methods:[],displayName:"Card"};m.__docgenInfo={description:"",methods:[],displayName:"CardHeader"};p.__docgenInfo={description:"",methods:[],displayName:"CardTitle"};C.__docgenInfo={description:"",methods:[],displayName:"CardDescription"};o.__docgenInfo={description:"",methods:[],displayName:"CardContent"};x.__docgenInfo={description:"",methods:[],displayName:"CardFooter"};const R={title:"UI/Card"},c={render:()=>e.jsxs(t,{className:"w-80",children:[e.jsxs(m,{children:[e.jsx(p,{children:"Account Balance"}),e.jsx(C,{children:"Your TD Chequing account"})]}),e.jsx(o,{children:e.jsx("p",{className:"text-2xl font-bold",children:"$3,421.50"})}),e.jsx(x,{children:e.jsx(T,{variant:"outline",size:"sm",children:"View Transactions"})})]})},i={render:()=>e.jsx(t,{className:"w-80",children:e.jsx(o,{className:"pt-6",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Content only card with no header or footer."})})})},l={render:()=>e.jsxs(t,{className:"w-80",children:[e.jsx(m,{children:e.jsx(p,{children:"Settings"})}),e.jsx(o,{children:e.jsx("p",{className:"text-sm",children:"Configure your preferences here."})})]})};var f,u,h;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <Card className="w-80">
      <CardHeader>
        <CardTitle>Account Balance</CardTitle>
        <CardDescription>Your TD Chequing account</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">$3,421.50</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          View Transactions
        </Button>
      </CardFooter>
    </Card>
}`,...(h=(u=c.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var N,g,j;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <Card className="w-80">
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">Content only card with no header or footer.</p>
      </CardContent>
    </Card>
}`,...(j=(g=i.parameters)==null?void 0:g.docs)==null?void 0:j.source}}};var y,w,_;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <Card className="w-80">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Configure your preferences here.</p>
      </CardContent>
    </Card>
}`,...(_=(w=l.parameters)==null?void 0:w.docs)==null?void 0:_.source}}};const v=["Full","BodyOnly","HeaderAndBody"];export{i as BodyOnly,c as Full,l as HeaderAndBody,v as __namedExportsOrder,R as default};
