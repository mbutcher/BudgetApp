import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{r as i}from"./index-Bc2G9s8g.js";import{w,u as l,e as d}from"./index-BEIOxGzJ.js";import{D as j,a as v,b as B,c as f,d as s,e as y}from"./dropdown-menu-BW9g-2c-.js";import{B as E}from"./button-CScwkglh.js";import"./utils-BOzF_IbP.js";import"./clsx-B-dksMZM.js";const O={title:"UI/DropdownMenu"};function h(){const[c,t]=i.useState(!1),[a,n]=i.useState(null);return e.jsxs("div",{className:"p-8",children:[a&&e.jsxs("p",{className:"mb-4 text-sm text-muted-foreground",children:["Selected: ",a]}),e.jsxs(j,{open:c,onOpenChange:t,children:[e.jsx(v,{children:e.jsx(E,{variant:"outline",children:"Open Menu"})}),e.jsxs(B,{align:"start",children:[e.jsx(f,{children:"Actions"}),e.jsx(s,{onClick:()=>{n("Edit"),t(!1)},children:"Edit"}),e.jsx(s,{onClick:()=>{n("Duplicate"),t(!1)},children:"Duplicate"}),e.jsx(y,{}),e.jsx(s,{disabled:!0,children:"Archive (disabled)"}),e.jsx(s,{className:"text-destructive",onClick:()=>{n("Delete"),t(!1)},children:"Delete"})]})]})]})}const o={render:()=>e.jsx(h,{})},r={render:()=>e.jsx(h,{}),play:async({canvasElement:c})=>{const t=w(c),a=t.getByRole("button",{name:/open menu/i});await l.click(a),await d(t.getByText("Edit")).toBeInTheDocument();const n=t.getByText("Duplicate");await l.click(n),await d(t.getByText("Selected: Duplicate")).toBeInTheDocument()}};var p,u,m;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <DropdownDemo />
}`,...(m=(u=o.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var x,D,g;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <DropdownDemo />,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Open the menu
    const trigger = canvas.getByRole('button', {
      name: /open menu/i
    });
    await userEvent.click(trigger);

    // Menu items should be visible
    await expect(canvas.getByText('Edit')).toBeInTheDocument();

    // Click "Duplicate"
    const duplicateItem = canvas.getByText('Duplicate');
    await userEvent.click(duplicateItem);

    // Selection feedback appears
    await expect(canvas.getByText('Selected: Duplicate')).toBeInTheDocument();
  }
}`,...(g=(D=r.parameters)==null?void 0:D.docs)==null?void 0:g.source}}};const A=["Closed","InteractionOpenAndSelect"];export{o as Closed,r as InteractionOpenAndSelect,A as __namedExportsOrder,O as default};
