import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{Q as N}from"./QueryClientProvider-Lm9Is62K.js";import{w as M,e as m,u as T}from"./index-BEIOxGzJ.js";import{r as Q}from"./index-Bc2G9s8g.js";import{M as I}from"./MonthlyChart-D3vO_7re.js";import{u as L,a as _}from"./useReports-DgSApoVl.js";import{u as R}from"./useTranslation-CriaNoZI.js";import{a as C,m as j}from"./mockData-K9D4SkBR.js";import{Q as W}from"./queryClient-DqSsX_cv.js";import"./generateCategoricalChart-D_mu8-Gl.js";import"./clsx-B-dksMZM.js";import"./tiny-invariant-CopsF_GD.js";import"./BarChart-DYu8jNNK.js";import"./YAxis-BKXMZq3R.js";import"./useQuery-CIXANqNG.js";import"./query-DzksRMPg.js";import"./client-BtbUihLd.js";import"./index-XZO_rlAO.js";import"./context-DY79RVi1.js";import"./mutation-DGDFf7lc.js";function E(){const{t:o}=R(),[t,a]=Q.useState(!1),{data:d=[],isLoading:F}=L(6),{data:S=[]}=_(3),B=t?[...d,...S]:d;return e.jsxs("div",{className:"h-full flex flex-col p-5",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4 flex-shrink-0",children:[e.jsx("h2",{className:"text-base font-semibold text-gray-900",children:o("dashboard.incomeVsExpenses")}),e.jsxs("label",{className:"flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none",children:[e.jsx("input",{type:"checkbox",checked:t,onChange:D=>a(D.target.checked),className:"rounded"}),o("dashboard.showForecast")]})]}),e.jsx("div",{className:"flex-1 min-h-0",children:F?e.jsx("div",{className:"h-full bg-gray-100 animate-pulse rounded-lg"}):e.jsx(I,{data:B})}),t&&e.jsx("p",{className:"mt-2 text-xs text-gray-400 flex-shrink-0",children:o("dashboard.forecastNote")})]})}E.__docgenInfo={description:"",methods:[],displayName:"MonthlyChartWidget"};function q(o,t){const a=new W({defaultOptions:{queries:{retry:!1,staleTime:1/0}}});return o!==void 0&&a.setQueryData(["reports","monthly-summary",6],o),t!==void 0&&a.setQueryData(["reports","forecast",3],t),a}const i=(o,t)=>a=>e.jsx(N,{client:q(o,t),children:e.jsx("div",{style:{width:600,height:300},children:e.jsx(a,{})})}),ce={component:E,title:"Dashboard/MonthlyChartWidget"},r={decorators:[i(j,C)]},s={decorators:[i()]},c={decorators:[i([],[])]},n={decorators:[i(j,C)],play:async({canvasElement:o})=>{const t=M(o),a=t.getByRole("checkbox");await m(a).not.toBeChecked(),await T.click(a),await m(a).toBeChecked(),await m(t.getByText(/forecast/i)).toBeInTheDocument()}};var l,h,p;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  decorators: [withChartData(mockMonthlySummary, mockForecast)]
}`,...(p=(h=r.parameters)==null?void 0:h.docs)==null?void 0:p.source}}};var u,x,y;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  decorators: [withChartData()]
}`,...(y=(x=s.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var f,g,k;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  decorators: [withChartData([], [])]
}`,...(k=(g=c.parameters)==null?void 0:g.docs)==null?void 0:k.source}}};var w,b,v;n.parameters={...n.parameters,docs:{...(w=n.parameters)==null?void 0:w.docs,source:{originalSource:`{
  decorators: [withChartData(mockMonthlySummary, mockForecast)],
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Forecast checkbox starts unchecked; forecast note is not visible
    const checkbox = canvas.getByRole('checkbox');
    await expect(checkbox).not.toBeChecked();

    // Enable forecast
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();

    // Forecast note should appear
    await expect(canvas.getByText(/forecast/i)).toBeInTheDocument();
  }
}`,...(v=(b=n.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};const ne=["Loaded","Loading","Empty","InteractionForecastToggle"];export{c as Empty,n as InteractionForecastToggle,r as Loaded,s as Loading,ne as __namedExportsOrder,ce as default};
