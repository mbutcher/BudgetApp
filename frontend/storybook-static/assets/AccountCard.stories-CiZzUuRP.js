import{j as S}from"./jsx-runtime-DFAAy_2V.js";import{A as k}from"./AccountCard-1D3WR-TI.js";import{u as T}from"./authStore-9rPuOrgm.js";import{b}from"./mockData-K9D4SkBR.js";import"./index-Bc2G9s8g.js";import"./index-Bk2kneit.js";import"./index-Dy83Z4lh.js";import"./index-D9nDLaTN.js";import"./utils-BOzF_IbP.js";import"./clsx-B-dksMZM.js";import"./useFormatters-DFQvbmp2.js";import"./useQuery-CIXANqNG.js";import"./QueryClientProvider-Lm9Is62K.js";import"./query-DzksRMPg.js";import"./client-BtbUihLd.js";import"./useTranslation-CriaNoZI.js";import"./index-XZO_rlAO.js";import"./context-DY79RVi1.js";import"./createLucideIcon-B9d3ud5S.js";import"./index-6pVCHIeC.js";const E=y=>(T.setState({user:b}),S.jsx(y,{})),K={component:k,title:"Layout/AccountCard",decorators:[E],parameters:{layout:"padded"}},e={id:"acct-1",userId:"u1",name:"",type:"checking",isAsset:!0,startingBalance:0,currentBalance:0,currency:"CAD",color:"#3b82f6",institution:"TD Bank",annualRate:null,isActive:!0,createdAt:"2026-01-01T00:00:00Z",updatedAt:"2026-02-01T00:00:00Z"},a={args:{account:{...e,name:"TD Chequing",type:"checking",currentBalance:3421.5}}},r={args:{account:{...e,id:"acct-2",name:"TFSA Savings",type:"savings",currentBalance:12500,color:"#22c55e",annualRate:.035}}},n={args:{account:{...e,id:"acct-3",name:"Visa Credit Card",type:"credit_card",isAsset:!1,currentBalance:-1842.3,color:"#f43f5e",annualRate:.1999}}},t={args:{account:{...e,id:"acct-neg",name:"Overdrawn Chequing",type:"checking",currentBalance:-124.5,color:"#ef4444"}}},c={args:{account:{...e,name:"TD Chequing",type:"checking",currentBalance:3421.5},onEdit:()=>alert("Edit clicked"),onArchive:()=>alert("Archive clicked")}};var s,o,i;a.parameters={...a.parameters,docs:{...(s=a.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    account: {
      ...base,
      name: 'TD Chequing',
      type: 'checking',
      currentBalance: 3421.5
    }
  }
}`,...(i=(o=a.parameters)==null?void 0:o.docs)==null?void 0:i.source}}};var u,d,m;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    account: {
      ...base,
      id: 'acct-2',
      name: 'TFSA Savings',
      type: 'savings',
      currentBalance: 12500,
      color: '#22c55e',
      annualRate: 0.035
    }
  }
}`,...(m=(d=r.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var p,l,g;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    account: {
      ...base,
      id: 'acct-3',
      name: 'Visa Credit Card',
      type: 'credit_card',
      isAsset: false,
      currentBalance: -1842.3,
      color: '#f43f5e',
      annualRate: 0.1999
    }
  }
}`,...(g=(l=n.parameters)==null?void 0:l.docs)==null?void 0:g.source}}};var A,h,C;t.parameters={...t.parameters,docs:{...(A=t.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    account: {
      ...base,
      id: 'acct-neg',
      name: 'Overdrawn Chequing',
      type: 'checking',
      currentBalance: -124.5,
      color: '#ef4444'
    }
  }
}`,...(C=(h=t.parameters)==null?void 0:h.docs)==null?void 0:C.source}}};var v,B,f;c.parameters={...c.parameters,docs:{...(v=c.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    account: {
      ...base,
      name: 'TD Chequing',
      type: 'checking',
      currentBalance: 3421.5
    },
    onEdit: () => alert('Edit clicked'),
    onArchive: () => alert('Archive clicked')
  }
}`,...(f=(B=c.parameters)==null?void 0:B.docs)==null?void 0:f.source}}};const M=["AssetAccount","SavingsAccount","CreditCard","NegativeBalance","WithEditHandlers"];export{a as AssetAccount,n as CreditCard,t as NegativeBalance,r as SavingsAccount,c as WithEditHandlers,M as __namedExportsOrder,K as default};
