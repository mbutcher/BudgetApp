import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{Q as R}from"./QueryClientProvider-Lm9Is62K.js";import{w as M,e as u,u as w}from"./index-BEIOxGzJ.js";import{r as U}from"./index-Bc2G9s8g.js";import{u as z}from"./useAccounts-BCtARCSZ.js";import{u as $,a as F}from"./useSavingsGoals-nTGho9tH.js";import{u as x}from"./useTranslation-CriaNoZI.js";import{T as h}from"./triangle-alert-ApQc8E-d.js";import{c as P}from"./createLucideIcon-B9d3ud5S.js";import{d as H,c as f,l as L,e as J}from"./mockData-K9D4SkBR.js";import{Q as K}from"./queryClient-DqSsX_cv.js";import"./useQuery-CIXANqNG.js";import"./query-DzksRMPg.js";import"./client-BtbUihLd.js";import"./authStore-9rPuOrgm.js";import"./index-6pVCHIeC.js";import"./index-XZO_rlAO.js";import"./offlineHelpers-pC_97PH_.js";import"./networkStore-BALze3A1.js";import"./context-DY79RVi1.js";import"./mutation-DGDFf7lc.js";/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=P("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=P("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);function Y(n){const{t:s}=x(),{data:t=[]}=z(),i=[],o=t.filter(a=>a.isActive&&a.isAsset&&a.currentBalance<0&&!n.includes(a.id));for(const a of o)i.push({id:`neg-${a.id}`,message:s("dashboard.warningNegativeBalance",{name:a.name})});return i}function Z({goalId:n,goalName:s,targetDate:t}){const{t:i}=x(),{data:o}=F(n),a=Math.ceil((new Date(t).getTime()-Date.now())/(1e3*60*60*24));if(!o||a>30||a<0)return null;const m=o.percentComplete,v=100-a/30*(100-m);return m>=v?null:e.jsxs("div",{className:"flex items-center gap-2 text-amber-700 text-sm",children:[e.jsx(h,{className:"h-4 w-4 flex-shrink-0"}),e.jsx("span",{children:i("dashboard.warningGoalBehindPace",{name:s,count:a})})]})}function _({excludedAccountIds:n}){const{t:s}=x(),t=Y(n),{data:i=[]}=$(),o=i.filter(r=>r.targetDate),[a,m]=U.useState(!1);return t.length>0||o.length>0?e.jsxs("div",{className:"h-full flex flex-col bg-amber-50 border border-amber-200 rounded-xl overflow-hidden",children:[e.jsxs("button",{onClick:()=>m(r=>!r),className:"flex items-center justify-between px-5 py-3 text-amber-800 font-medium text-sm flex-shrink-0 hover:bg-amber-100 transition-colors",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(h,{className:"h-4 w-4"}),e.jsx("span",{children:s("dashboard.warningsTitle")})]}),a?e.jsx(V,{className:"h-4 w-4"}):e.jsx(X,{className:"h-4 w-4"})]}),!a&&e.jsxs("div",{className:"px-5 pb-3 space-y-2 overflow-auto flex-1",children:[t.map(r=>e.jsxs("div",{className:"flex items-center gap-2 text-amber-700 text-sm",children:[e.jsx(h,{className:"h-4 w-4 flex-shrink-0"}),e.jsx("span",{children:r.message})]},r.id)),o.map(r=>e.jsx(Z,{goalId:r.id,goalName:r.name,targetDate:r.targetDate},r.id))]})]}):e.jsx("div",{className:"h-full flex items-center px-5 py-3",children:e.jsx("p",{className:"text-sm text-gray-400",children:s("dashboard.noWarnings")})})}_.__docgenInfo={description:"",methods:[],displayName:"WarningsWidget",props:{excludedAccountIds:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""}}};function ee(n,s){const t=new K({defaultOptions:{queries:{retry:!1,staleTime:1/0}}});if(n!==void 0&&t.setQueryData(["accounts"],n),s!==void 0){t.setQueryData(["savings-goals"],s);for(const[i,o]of Object.entries(H))t.setQueryData(["savings-goals",i,"progress"],o)}return t}const g=(n,s)=>t=>e.jsx(R,{client:ee(n,s),children:e.jsx("div",{style:{width:480,height:220},children:e.jsx(t,{})})}),De={component:_,title:"Dashboard/WarningsWidget",args:{excludedAccountIds:[]}},c={decorators:[g(f,[])]},l={decorators:[g([...f,L],[])]},p={decorators:[g()]},d={decorators:[g([...f,L],J)],play:async({canvasElement:n})=>{const s=M(n),t=s.getByRole("button");await u(t).toBeInTheDocument(),await w.click(t),await u(s.queryByText(/overdrawn chequing/i)).not.toBeInTheDocument(),await w.click(t),await u(s.getByText(/overdrawn chequing/i)).toBeInTheDocument()}};var y,b,D,j,N;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`{
  decorators: [withData(mockAccounts, [])]
}`,...(D=(b=c.parameters)==null?void 0:b.docs)==null?void 0:D.source},description:{story:'No warnings — shows the "All clear" state.',...(N=(j=c.parameters)==null?void 0:j.docs)==null?void 0:N.description}}};var k,A,B,T,W;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`{
  decorators: [withData([...mockAccounts, mockNegativeAssetAccount], [])]
}`,...(B=(A=l.parameters)==null?void 0:A.docs)==null?void 0:B.source},description:{story:"One negative-balance asset triggers a warning.",...(W=(T=l.parameters)==null?void 0:T.docs)==null?void 0:W.description}}};var C,I,E;p.parameters={...p.parameters,docs:{...(C=p.parameters)==null?void 0:C.docs,source:{originalSource:`{
  decorators: [withData()]
}`,...(E=(I=p.parameters)==null?void 0:I.docs)==null?void 0:E.source}}};var q,S,Q,G,O;d.parameters={...d.parameters,docs:{...(q=d.parameters)==null?void 0:q.docs,source:{originalSource:`{
  decorators: [withData([...mockAccounts, mockNegativeAssetAccount], mockSavingsGoals)],
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Warning content is visible by default (expanded)
    const toggleBtn = canvas.getByRole('button');
    await expect(toggleBtn).toBeInTheDocument();

    // Collapse the warnings
    await userEvent.click(toggleBtn);

    // The warning messages should no longer be in the DOM
    await expect(canvas.queryByText(/overdrawn chequing/i)).not.toBeInTheDocument();

    // Expand again
    await userEvent.click(toggleBtn);

    // Warning message is visible again
    await expect(canvas.getByText(/overdrawn chequing/i)).toBeInTheDocument();
  }
}`,...(Q=(S=d.parameters)==null?void 0:S.docs)==null?void 0:Q.source},description:{story:"Collapse / expand the warnings accordion.",...(O=(G=d.parameters)==null?void 0:G.docs)==null?void 0:O.description}}};const je=["NoWarnings","WithWarning","Loading","InteractionCollapseExpand"];export{d as InteractionCollapseExpand,p as Loading,c as NoWarnings,l as WithWarning,je as __namedExportsOrder,De as default};
