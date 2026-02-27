import{j as x}from"./jsx-runtime-DFAAy_2V.js";import{u as xt}from"./useFormatters-DFQvbmp2.js";import{i as Dt,D as Lt,a as Pt,E as St,b as X,c as z,d as Ot,A as Wt,e as B,h as jt,j as Y,k as wt,l as kt,m as ht,u as _t,G as Et,n as J,g as Ct,f as Nt,R as Tt,T as It,L as Ft}from"./generateCategoricalChart-D_mu8-Gl.js";import{R as v,r as Bt}from"./index-Bc2G9s8g.js";import{c as Q}from"./clsx-B-dksMZM.js";import{X as dt,Y as ft,C as Rt}from"./YAxis-BKXMZq3R.js";import"./authStore-9rPuOrgm.js";import"./index-6pVCHIeC.js";import"./index-XZO_rlAO.js";import"./tiny-invariant-CopsF_GD.js";var Kt=["type","layout","connectNulls","ref"],$t=["key"];function _(t){"@babel/helpers - typeof";return _=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},_(t)}function tt(t,n){if(t==null)return{};var a=zt(t,n),e,r;if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)e=i[r],!(n.indexOf(e)>=0)&&Object.prototype.propertyIsEnumerable.call(t,e)&&(a[e]=t[e])}return a}function zt(t,n){if(t==null)return{};var a={};for(var e in t)if(Object.prototype.hasOwnProperty.call(t,e)){if(n.indexOf(e)>=0)continue;a[e]=t[e]}return a}function R(){return R=Object.assign?Object.assign.bind():function(t){for(var n=1;n<arguments.length;n++){var a=arguments[n];for(var e in a)Object.prototype.hasOwnProperty.call(a,e)&&(t[e]=a[e])}return t},R.apply(this,arguments)}function et(t,n){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(t);n&&(e=e.filter(function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable})),a.push.apply(a,e)}return a}function A(t){for(var n=1;n<arguments.length;n++){var a=arguments[n]!=null?arguments[n]:{};n%2?et(Object(a),!0).forEach(function(e){D(t,e,a[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):et(Object(a)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))})}return t}function k(t){return Gt(t)||qt(t)||Vt(t)||Mt()}function Mt(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Vt(t,n){if(t){if(typeof t=="string")return H(t,n);var a=Object.prototype.toString.call(t).slice(8,-1);if(a==="Object"&&t.constructor&&(a=t.constructor.name),a==="Map"||a==="Set")return Array.from(t);if(a==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return H(t,n)}}function qt(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function Gt(t){if(Array.isArray(t))return H(t)}function H(t,n){(n==null||n>t.length)&&(n=t.length);for(var a=0,e=new Array(n);a<n;a++)e[a]=t[a];return e}function Ut(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function nt(t,n){for(var a=0;a<n.length;a++){var e=n[a];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,yt(e.key),e)}}function Xt(t,n,a){return n&&nt(t.prototype,n),a&&nt(t,a),Object.defineProperty(t,"prototype",{writable:!1}),t}function Yt(t,n,a){return n=G(n),Ht(t,mt()?Reflect.construct(n,a||[],G(t).constructor):n.apply(t,a))}function Ht(t,n){if(n&&(_(n)==="object"||typeof n=="function"))return n;if(n!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return Zt(t)}function Zt(t){if(t===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function mt(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch{}return(mt=function(){return!!t})()}function G(t){return G=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(a){return a.__proto__||Object.getPrototypeOf(a)},G(t)}function Jt(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(n&&n.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),n&&Z(t,n)}function Z(t,n){return Z=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,r){return e.__proto__=r,e},Z(t,n)}function D(t,n,a){return n=yt(n),n in t?Object.defineProperty(t,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[n]=a,t}function yt(t){var n=Qt(t,"string");return _(n)=="symbol"?n:n+""}function Qt(t,n){if(_(t)!="object"||!t)return t;var a=t[Symbol.toPrimitive];if(a!==void 0){var e=a.call(t,n);if(_(e)!="object")return e;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}var W=function(t){function n(){var a;Ut(this,n);for(var e=arguments.length,r=new Array(e),i=0;i<e;i++)r[i]=arguments[i];return a=Yt(this,n,[].concat(r)),D(a,"state",{isAnimationFinished:!0,totalLength:0}),D(a,"generateSimpleStrokeDasharray",function(o,s){return"".concat(s,"px ").concat(o-s,"px")}),D(a,"getStrokeDasharray",function(o,s,l){var u=l.reduce(function(L,S){return L+S});if(!u)return a.generateSimpleStrokeDasharray(s,o);for(var h=Math.floor(o/u),d=o%u,p=s-o,f=[],c=0,m=0;c<l.length;m+=l[c],++c)if(m+l[c]>d){f=[].concat(k(l.slice(0,c)),[d-m]);break}var g=f.length%2===0?[0,p]:[p];return[].concat(k(n.repeat(l,h)),k(f),g).map(function(L){return"".concat(L,"px")}).join(", ")}),D(a,"id",_t("recharts-line-")),D(a,"pathRef",function(o){a.mainCurve=o}),D(a,"handleAnimationEnd",function(){a.setState({isAnimationFinished:!0}),a.props.onAnimationEnd&&a.props.onAnimationEnd()}),D(a,"handleAnimationStart",function(){a.setState({isAnimationFinished:!1}),a.props.onAnimationStart&&a.props.onAnimationStart()}),a}return Jt(n,t),Xt(n,[{key:"componentDidMount",value:function(){if(this.props.isAnimationActive){var e=this.getTotalLength();this.setState({totalLength:e})}}},{key:"componentDidUpdate",value:function(){if(this.props.isAnimationActive){var e=this.getTotalLength();e!==this.state.totalLength&&this.setState({totalLength:e})}}},{key:"getTotalLength",value:function(){var e=this.mainCurve;try{return e&&e.getTotalLength&&e.getTotalLength()||0}catch{return 0}}},{key:"renderErrorBar",value:function(e,r){if(this.props.isAnimationActive&&!this.state.isAnimationFinished)return null;var i=this.props,o=i.points,s=i.xAxis,l=i.yAxis,u=i.layout,h=i.children,d=Pt(h,St);if(!d)return null;var p=function(m,g){return{x:m.x,y:m.y,value:m.value,errorVal:ht(m.payload,g)}},f={clipPath:e?"url(#clipPath-".concat(r,")"):null};return v.createElement(X,f,d.map(function(c){return v.cloneElement(c,{key:"bar-".concat(c.props.dataKey),data:o,xAxis:s,yAxis:l,layout:u,dataPointFormatter:p})}))}},{key:"renderDots",value:function(e,r,i){var o=this.props.isAnimationActive;if(o&&!this.state.isAnimationFinished)return null;var s=this.props,l=s.dot,u=s.points,h=s.dataKey,d=z(this.props,!1),p=z(l,!0),f=u.map(function(m,g){var L=A(A(A({key:"dot-".concat(g),r:3},d),p),{},{index:g,cx:m.x,cy:m.y,value:m.value,dataKey:h,payload:m.payload,points:u});return n.renderDotItem(l,L)}),c={clipPath:e?"url(#clipPath-".concat(r?"":"dots-").concat(i,")"):null};return v.createElement(X,R({className:"recharts-line-dots",key:"dots"},c),f)}},{key:"renderCurveStatically",value:function(e,r,i,o){var s=this.props,l=s.type,u=s.layout,h=s.connectNulls;s.ref;var d=tt(s,Kt),p=A(A(A({},z(d,!0)),{},{fill:"none",className:"recharts-line-curve",clipPath:r?"url(#clipPath-".concat(i,")"):null,points:e},o),{},{type:l,layout:u,connectNulls:h});return v.createElement(Ot,R({},p,{pathRef:this.pathRef}))}},{key:"renderCurveWithAnimation",value:function(e,r){var i=this,o=this.props,s=o.points,l=o.strokeDasharray,u=o.isAnimationActive,h=o.animationBegin,d=o.animationDuration,p=o.animationEasing,f=o.animationId,c=o.animateNewValues,m=o.width,g=o.height,L=this.state,S=L.prevPoints,E=L.totalLength;return v.createElement(Wt,{begin:h,duration:d,isActive:u,easing:p,from:{t:0},to:{t:1},key:"line-".concat(f),onAnimationEnd:this.handleAnimationEnd,onAnimationStart:this.handleAnimationStart},function(j){var P=j.t;if(S){var C=S.length/s.length,O=s.map(function(b,U){var I=Math.floor(U*C);if(S[I]){var F=S[I],w=B(F.x,b.x),bt=B(F.y,b.y);return A(A({},b),{},{x:w(P),y:bt(P)})}if(c){var At=B(m*2,b.x),gt=B(g/2,b.y);return A(A({},b),{},{x:At(P),y:gt(P)})}return A(A({},b),{},{x:b.x,y:b.y})});return i.renderCurveStatically(O,e,r)}var K=B(0,E),N=K(P),T;if(l){var $="".concat(l).split(/[,\s]+/gim).map(function(b){return parseFloat(b)});T=i.getStrokeDasharray(N,E,$)}else T=i.generateSimpleStrokeDasharray(E,N);return i.renderCurveStatically(s,e,r,{strokeDasharray:T})})}},{key:"renderCurve",value:function(e,r){var i=this.props,o=i.points,s=i.isAnimationActive,l=this.state,u=l.prevPoints,h=l.totalLength;return s&&o&&o.length&&(!u&&h>0||!jt(u,o))?this.renderCurveWithAnimation(e,r):this.renderCurveStatically(o,e,r)}},{key:"render",value:function(){var e,r=this.props,i=r.hide,o=r.dot,s=r.points,l=r.className,u=r.xAxis,h=r.yAxis,d=r.top,p=r.left,f=r.width,c=r.height,m=r.isAnimationActive,g=r.id;if(i||!s||!s.length)return null;var L=this.state.isAnimationFinished,S=s.length===1,E=Q("recharts-line",l),j=u&&u.allowDataOverflow,P=h&&h.allowDataOverflow,C=j||P,O=Y(g)?this.id:g,K=(e=z(o,!1))!==null&&e!==void 0?e:{r:3,strokeWidth:2},N=K.r,T=N===void 0?3:N,$=K.strokeWidth,b=$===void 0?2:$,U=wt(o)?o:{},I=U.clipDot,F=I===void 0?!0:I,w=T*2+b;return v.createElement(X,{className:E},j||P?v.createElement("defs",null,v.createElement("clipPath",{id:"clipPath-".concat(O)},v.createElement("rect",{x:j?p:p-f/2,y:P?d:d-c/2,width:j?f:f*2,height:P?c:c*2})),!F&&v.createElement("clipPath",{id:"clipPath-dots-".concat(O)},v.createElement("rect",{x:p-w/2,y:d-w/2,width:f+w,height:c+w}))):null,!S&&this.renderCurve(C,O),this.renderErrorBar(C,O),(S||o)&&this.renderDots(C,F,O),(!m||L)&&kt.renderCallByParent(this.props,s))}}],[{key:"getDerivedStateFromProps",value:function(e,r){return e.animationId!==r.prevAnimationId?{prevAnimationId:e.animationId,curPoints:e.points,prevPoints:r.curPoints}:e.points!==r.curPoints?{curPoints:e.points}:null}},{key:"repeat",value:function(e,r){for(var i=e.length%2!==0?[].concat(k(e),[0]):e,o=[],s=0;s<r;++s)o=[].concat(k(o),k(i));return o}},{key:"renderDotItem",value:function(e,r){var i;if(v.isValidElement(e))i=v.cloneElement(e,r);else if(Dt(e))i=e(r);else{var o=r.key,s=tt(r,$t),l=Q("recharts-line-dot",typeof e!="boolean"?e.className:"");i=v.createElement(Lt,R({key:o},s,{className:l}))}return i}}])}(Bt.PureComponent);D(W,"displayName","Line");D(W,"defaultProps",{xAxisId:0,yAxisId:0,connectNulls:!1,activeDot:!0,dot:!0,legendType:"line",stroke:"#3182bd",strokeWidth:1,fill:"#fff",points:[],isAnimationActive:!Et.isSsr,animateNewValues:!0,animationBegin:0,animationDuration:1500,animationEasing:"ease",hide:!1,label:!1});D(W,"getComposedData",function(t){var n=t.props,a=t.xAxis,e=t.yAxis,r=t.xAxisTicks,i=t.yAxisTicks,o=t.dataKey,s=t.bandSize,l=t.displayedData,u=t.offset,h=n.layout,d=l.map(function(p,f){var c=ht(p,o);return h==="horizontal"?{x:J({axis:a,ticks:r,bandSize:s,entry:p,index:f}),y:Y(c)?null:e.scale(c),value:c,payload:p}:{x:Y(c)?null:a.scale(c),y:J({axis:e,ticks:i,bandSize:s,entry:p,index:f}),value:c,payload:p}});return A({points:d,layout:h},u)});var te=Ct({chartName:"LineChart",GraphicalChild:W,axisComponents:[{axisType:"xAxis",AxisComp:dt},{axisType:"yAxis",AxisComp:ft}],formatAxisMap:Nt});function ee(t){const[n,a]=t.split("-");return new Date(Number(n),Number(a)-1,1).toLocaleString("default",{month:"short",year:"2-digit"})}function vt({snapshots:t,showLiabilities:n=!1}){const a=xt();if(t.length===0)return x.jsx("div",{className:"flex items-center justify-center h-64 text-sm text-gray-400",children:'No net worth snapshots yet. Click "Take Snapshot Now" to record your current net worth.'});const e=t.map(i=>({date:ee(i.snapshotDate),assets:i.totalAssets,liabilities:i.totalLiabilities,netWorth:i.netWorth})),r=i=>a.currency(i,void 0);return x.jsx(Tt,{width:"100%",height:300,children:x.jsxs(te,{data:e,margin:{top:4,right:16,left:0,bottom:0},children:[x.jsx(Rt,{strokeDasharray:"3 3",stroke:"#f0f0f0"}),x.jsx(dt,{dataKey:"date",tick:{fontSize:12}}),x.jsx(ft,{tickFormatter:r,tick:{fontSize:12},width:80}),x.jsx(It,{formatter:i=>r(i)}),x.jsx(Ft,{}),x.jsx(W,{type:"monotone",dataKey:"assets",name:"Assets",stroke:"#22c55e",strokeWidth:2,dot:!1}),n&&x.jsx(W,{type:"monotone",dataKey:"liabilities",name:"Liabilities",stroke:"#f43f5e",strokeWidth:2,dot:!1}),x.jsx(W,{type:"monotone",dataKey:"netWorth",name:"Net Worth",stroke:"#3b82f6",strokeWidth:2.5,dot:!1})]})})}vt.__docgenInfo={description:"",methods:[],displayName:"NetWorthChart",props:{snapshots:{required:!0,tsType:{name:"Array",elements:[{name:"NetWorthSnapshot"}],raw:"NetWorthSnapshot[]"},description:""},showLiabilities:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const he={component:vt,title:"Charts/NetWorthChart",parameters:{layout:"padded"}},y={id:"",userId:"u1",snapshotDate:"",totalAssets:0,totalLiabilities:0,netWorth:0,createdAt:"2026-01-01T00:00:00Z"},M={args:{snapshots:[{...y,id:"1",snapshotDate:"2025-09-01",totalAssets:1e4,totalLiabilities:8e3,netWorth:2e3},{...y,id:"2",snapshotDate:"2025-10-01",totalAssets:11500,totalLiabilities:7800,netWorth:3700},{...y,id:"3",snapshotDate:"2025-11-01",totalAssets:12e3,totalLiabilities:7600,netWorth:4400},{...y,id:"4",snapshotDate:"2025-12-01",totalAssets:13500,totalLiabilities:7200,netWorth:6300},{...y,id:"5",snapshotDate:"2026-01-01",totalAssets:14200,totalLiabilities:7e3,netWorth:7200},{...y,id:"6",snapshotDate:"2026-02-01",totalAssets:15921,totalLiabilities:6800,netWorth:9121}]}},V={args:{snapshots:[{...y,id:"1",snapshotDate:"2025-09-01",totalAssets:8e3,totalLiabilities:12e3,netWorth:-4e3},{...y,id:"2",snapshotDate:"2025-10-01",totalAssets:7800,totalLiabilities:12500,netWorth:-4700},{...y,id:"3",snapshotDate:"2025-11-01",totalAssets:7500,totalLiabilities:13200,netWorth:-5700},{...y,id:"4",snapshotDate:"2025-12-01",totalAssets:7200,totalLiabilities:14e3,netWorth:-6800},{...y,id:"5",snapshotDate:"2026-01-01",totalAssets:7e3,totalLiabilities:14800,netWorth:-7800},{...y,id:"6",snapshotDate:"2026-02-01",totalAssets:6800,totalLiabilities:15500,netWorth:-8700}]}},q={args:{snapshots:[{...y,id:"1",snapshotDate:"2025-09-01",totalAssets:1e4,totalLiabilities:8e3,netWorth:2e3},{...y,id:"2",snapshotDate:"2025-10-01",totalAssets:10050,totalLiabilities:8030,netWorth:2020},{...y,id:"3",snapshotDate:"2025-11-01",totalAssets:9980,totalLiabilities:7990,netWorth:1990},{...y,id:"4",snapshotDate:"2025-12-01",totalAssets:10010,totalLiabilities:8010,netWorth:2e3}]}};var at,rt,it;M.parameters={...M.parameters,docs:{...(at=M.parameters)==null?void 0:at.docs,source:{originalSource:`{
  args: {
    snapshots: [{
      ...base,
      id: '1',
      snapshotDate: '2025-09-01',
      totalAssets: 10000,
      totalLiabilities: 8000,
      netWorth: 2000
    }, {
      ...base,
      id: '2',
      snapshotDate: '2025-10-01',
      totalAssets: 11500,
      totalLiabilities: 7800,
      netWorth: 3700
    }, {
      ...base,
      id: '3',
      snapshotDate: '2025-11-01',
      totalAssets: 12000,
      totalLiabilities: 7600,
      netWorth: 4400
    }, {
      ...base,
      id: '4',
      snapshotDate: '2025-12-01',
      totalAssets: 13500,
      totalLiabilities: 7200,
      netWorth: 6300
    }, {
      ...base,
      id: '5',
      snapshotDate: '2026-01-01',
      totalAssets: 14200,
      totalLiabilities: 7000,
      netWorth: 7200
    }, {
      ...base,
      id: '6',
      snapshotDate: '2026-02-01',
      totalAssets: 15921,
      totalLiabilities: 6800,
      netWorth: 9121
    }]
  }
}`,...(it=(rt=M.parameters)==null?void 0:rt.docs)==null?void 0:it.source}}};var ot,st,lt;V.parameters={...V.parameters,docs:{...(ot=V.parameters)==null?void 0:ot.docs,source:{originalSource:`{
  args: {
    snapshots: [{
      ...base,
      id: '1',
      snapshotDate: '2025-09-01',
      totalAssets: 8000,
      totalLiabilities: 12000,
      netWorth: -4000
    }, {
      ...base,
      id: '2',
      snapshotDate: '2025-10-01',
      totalAssets: 7800,
      totalLiabilities: 12500,
      netWorth: -4700
    }, {
      ...base,
      id: '3',
      snapshotDate: '2025-11-01',
      totalAssets: 7500,
      totalLiabilities: 13200,
      netWorth: -5700
    }, {
      ...base,
      id: '4',
      snapshotDate: '2025-12-01',
      totalAssets: 7200,
      totalLiabilities: 14000,
      netWorth: -6800
    }, {
      ...base,
      id: '5',
      snapshotDate: '2026-01-01',
      totalAssets: 7000,
      totalLiabilities: 14800,
      netWorth: -7800
    }, {
      ...base,
      id: '6',
      snapshotDate: '2026-02-01',
      totalAssets: 6800,
      totalLiabilities: 15500,
      netWorth: -8700
    }]
  }
}`,...(lt=(st=V.parameters)==null?void 0:st.docs)==null?void 0:lt.source}}};var ct,ut,pt;q.parameters={...q.parameters,docs:{...(ct=q.parameters)==null?void 0:ct.docs,source:{originalSource:`{
  args: {
    snapshots: [{
      ...base,
      id: '1',
      snapshotDate: '2025-09-01',
      totalAssets: 10000,
      totalLiabilities: 8000,
      netWorth: 2000
    }, {
      ...base,
      id: '2',
      snapshotDate: '2025-10-01',
      totalAssets: 10050,
      totalLiabilities: 8030,
      netWorth: 2020
    }, {
      ...base,
      id: '3',
      snapshotDate: '2025-11-01',
      totalAssets: 9980,
      totalLiabilities: 7990,
      netWorth: 1990
    }, {
      ...base,
      id: '4',
      snapshotDate: '2025-12-01',
      totalAssets: 10010,
      totalLiabilities: 8010,
      netWorth: 2000
    }]
  }
}`,...(pt=(ut=q.parameters)==null?void 0:ut.docs)==null?void 0:pt.source}}};const de=["PositiveTrend","NegativeTrend","Flat"];export{q as Flat,V as NegativeTrend,M as PositiveTrend,de as __namedExportsOrder,he as default};
