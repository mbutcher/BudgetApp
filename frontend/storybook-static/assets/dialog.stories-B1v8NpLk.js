import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{r as l}from"./index-Bc2G9s8g.js";import{w as R,u as p,e as f}from"./index-BEIOxGzJ.js";import{c as d}from"./utils-BOzF_IbP.js";import{c as P}from"./createLucideIcon-B9d3ud5S.js";import{B as u}from"./button-CScwkglh.js";import{I as x}from"./input-jTd6TWk4.js";import"./clsx-B-dksMZM.js";/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=P("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),k=l.createContext(null);function q(){const t=l.useContext(k);if(!t)throw new Error("Dialog subcomponent used outside <Dialog>");return t}function E({open:t,onOpenChange:n,children:a}){return e.jsx(k.Provider,{value:{open:t,onOpenChange:n},children:a})}function I({className:t,children:n,...a}){const{open:s,onOpenChange:o}=q();return l.useEffect(()=>{const g=_=>{_.key==="Escape"&&o(!1)};return s&&document.addEventListener("keydown",g),()=>document.removeEventListener("keydown",g)},[s,o]),s?e.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center",children:[e.jsx("div",{className:"fixed inset-0 bg-black/80",onClick:()=>o(!1),"aria-hidden":"true"}),e.jsxs("div",{className:d("relative z-50 grid w-full max-w-lg gap-4 rounded-lg border bg-background p-6 shadow-lg",t),...a,children:[e.jsxs("button",{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",onClick:()=>o(!1),children:[e.jsx(S,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"Close"})]}),n]})]}):null}function N({className:t,...n}){return e.jsx("div",{className:d("flex flex-col space-y-1.5 text-center sm:text-left",t),...n})}function T({className:t,...n}){return e.jsx("h2",{className:d("text-lg font-semibold leading-none tracking-tight",t),...n})}function O({className:t,...n}){return e.jsx("p",{className:d("text-sm text-muted-foreground",t),...n})}E.__docgenInfo={description:"",methods:[],displayName:"Dialog",props:{open:{required:!0,tsType:{name:"boolean"},description:""},onOpenChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:""},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};I.__docgenInfo={description:"",methods:[],displayName:"DialogContent"};N.__docgenInfo={description:"",methods:[],displayName:"DialogHeader"};T.__docgenInfo={description:"",methods:[],displayName:"DialogTitle"};O.__docgenInfo={description:"",methods:[],displayName:"DialogDescription"};const A={title:"UI/Dialog"};function m({initialOpen:t=!1}){const[n,a]=l.useState(t);return e.jsxs("div",{children:[e.jsx(u,{onClick:()=>a(!0),children:"Open Dialog"}),e.jsx(E,{open:n,onOpenChange:a,children:e.jsxs(I,{children:[e.jsxs(N,{children:[e.jsx(T,{children:"Edit Profile"}),e.jsx(O,{children:"Make changes to your profile here."})]}),e.jsxs("div",{className:"space-y-4 py-2",children:[e.jsx(x,{placeholder:"Display name","data-testid":"name-input"}),e.jsx(x,{placeholder:"Email address",type:"email"})]}),e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx(u,{variant:"outline",onClick:()=>a(!1),children:"Cancel"}),e.jsx(u,{onClick:()=>a(!1),children:"Save Changes"})]})]})})]})}const i={render:()=>e.jsx(m,{})},r={render:()=>e.jsx(m,{initialOpen:!0})},c={render:()=>e.jsx(m,{}),play:async({canvasElement:t})=>{const n=R(t),a=n.getByRole("button",{name:/open dialog/i});await p.click(a),await f(n.getByText("Edit Profile")).toBeInTheDocument();const s=n.getByPlaceholderText(/display name/i);await p.type(s,"Jane Smith");const o=n.getByRole("button",{name:/cancel/i});await p.click(o),await f(n.queryByText("Edit Profile")).not.toBeInTheDocument()}};var h,y,v;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <DialogDemo />
}`,...(v=(y=i.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};var D,j,w;r.parameters={...r.parameters,docs:{...(D=r.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <DialogDemo initialOpen />
}`,...(w=(j=r.parameters)==null?void 0:j.docs)==null?void 0:w.source}}};var C,b,B;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <DialogDemo />,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Open the dialog
    const openBtn = canvas.getByRole('button', {
      name: /open dialog/i
    });
    await userEvent.click(openBtn);

    // Dialog content should be visible
    await expect(canvas.getByText('Edit Profile')).toBeInTheDocument();

    // Fill in the input
    const nameInput = canvas.getByPlaceholderText(/display name/i);
    await userEvent.type(nameInput, 'Jane Smith');

    // Close via Cancel
    const cancelBtn = canvas.getByRole('button', {
      name: /cancel/i
    });
    await userEvent.click(cancelBtn);

    // Dialog should be closed
    await expect(canvas.queryByText('Edit Profile')).not.toBeInTheDocument();
  }
}`,...(B=(b=c.parameters)==null?void 0:b.docs)==null?void 0:B.source}}};const G=["Closed","Open","InteractionOpenFillClose"];export{i as Closed,c as InteractionOpenFillClose,r as Open,G as __namedExportsOrder,A as default};
