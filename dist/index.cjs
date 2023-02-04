var ot=Object.create;var M=Object.defineProperty;var st=Object.getOwnPropertyDescriptor;var at=Object.getOwnPropertyNames;var ft=Object.getPrototypeOf,ct=Object.prototype.hasOwnProperty;var lt=(t,e)=>{for(var r in e)M(t,r,{get:e[r],enumerable:!0})},pe=(t,e,r,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of at(e))!ct.call(t,n)&&n!==r&&M(t,n,{get:()=>e[n],enumerable:!(i=st(e,n))||i.enumerable});return t};var m=(t,e,r)=>(r=t!=null?ot(ft(t)):{},pe(e||!t||!t.__esModule?M(r,"default",{value:t,enumerable:!0}):r,t)),ut=t=>pe(M({},"__esModule",{value:!0}),t);var xt={};lt(xt,{Collection:()=>W,EncryptedFSAdapter:()=>Q,FSAdapter:()=>w,LocalStorageAdapter:()=>R});module.exports=ut(xt);var U=m(require("dot-wild"),1);var Y=m(require("lodash"),1),et=m(require("dot-wild"),1);var b=m(require("dot-wild"),1),D=m(require("lodash"),1);function p(t){return Array.isArray(t)?t:t==null?[]:[t]}function l(t){return!!t&&Object.prototype.toString.call(t)==="[object Object]"}function O(t){return l(t)&&u(t).length===0}var A=Object.values,u=Object.keys,_=(t,e)=>t?Object.prototype.hasOwnProperty.call(t,e):!1;function de(t){return typeof t=="function"}function L(t){return l(t)&&u(t).forEach(e=>{!t[e]||!l(t[e])||(L(t[e]),u(t[e]).length===0&&delete t[e])}),t}var pt=t=>t.map(e=>r=>r[e]),dt=t=>t.map(e=>e===1?"asc":"desc");function ht(t,e){let r={$floor:(i,n)=>{let o=b.default.get(i,n);return typeof o=="number"?Math.floor(o):0},$ceil:(i,n)=>{let o=b.default.get(i,n);return typeof o=="number"?Math.ceil(o):0},$sub:(i,n)=>{let o;for(let s of n)typeof s=="number"?o===void 0?o=s:o-=s:o===void 0?o=Number(b.default.get(i,s)??0):o-=Number(b.default.get(i,s)??0);return o},$add:(i,n)=>{let o;for(let s of n)typeof s=="number"?o===void 0?o=s:o+=s:o===void 0?o=Number(b.default.get(i,s)??0):o+=Number(b.default.get(i,s)??0);return o},$mult:(i,n)=>{let o=1;for(let s of n)typeof s=="number"?o*=s:o*=Number(b.default.get(i,s)??1);return o},$div:(i,n)=>{let o;for(let s of n)typeof s=="number"?o===void 0?o=s:o/=s:o===void 0?o=Number(b.default.get(i,s)??1):o/=Number(b.default.get(i,s)??1);return o},$fn:(i,n)=>n(i)};return u(e.aggregate).forEach(i=>{typeof e.aggregate[i]=="object"&&u(e.aggregate[i]).forEach(n=>{n[0]==="$"&&(!r[n]||(t=t.map(o=>(o[i]=r[n](o,e.aggregate[i][n]),o))))})}),t}function S(t,e){if(e.aggregate&&(t=ht(t,e)),e.project){let n=Object.keys(e.project).reduce((s,a)=>{if(typeof e.project[a]=="number"&&typeof s=="number")return s+e.project[a]},0),o=n===Object.keys(e.project).length?1:n===0?2:0;if(o===1)t=t.map(s=>D.default.pick(s,u(e.project)));else if(o===2)t=t.map(s=>D.default.omit(s,u(e.project)));else if(o===0){let s=Object.keys(e.project).filter(a=>e.project[a]===0);t=t.map(a=>D.default.omit(a,s))}}e.sort&&(t=D.default.orderBy(t,pt(u(e.sort)),dt(A(e.sort)))),e.skip&&typeof e.skip=="number"&&(t=t.slice(e.skip)),e.take&&typeof e.take=="number"&&(t=t.slice(0,e.take)),e.join&&Array.isArray(e.join)&&e.join.forEach(n=>{if(!n.collection)throw new Error("Missing required field in join: collection");if(!n.from)throw new Error("Missing required field in join: from");if(!n.on)throw new Error("Missing required field in join: on");if(!n.as)throw new Error("Missing required field in join: as");let o=n?.options||{},s=n.collection,a=n.collection.createId(),f=!1;t=t.map(c=>{if(n.as.includes(".")){if(!n.as.includes("*"))throw new Error("as field must include * when using dot notation, e.g. items.*.meta");f=!0}f||(c[n.as]=p(c[n.as])),c[a]=[];let d=n.from.includes(".")?b.default.get(c,n.from):c[n.from];if(d===void 0)return c;if(Array.isArray(d))return d.forEach((g,j)=>{let v={[`${n.on}`]:g};f?c=b.default.set(c,n.as.replaceAll("*",j.toString()),s.find(v,o)[0]):c[a]=c[a].concat(s.find(v,o))}),f||(c[n.as]=c[a]),delete c[a],c;let T={[`${n.on}`]:d};return f||(c[a]=s.find(T,o),c[n.as]=c[a]),delete c[a],c})});function r(n,o){for(let s in o){let a=b.default.get(n,s);a==null&&(typeof o[s]=="function"?n=b.default.set(n,s,o[s](n)):n=b.default.set(n,s,o[s]))}return n}function i(n,o){for(let s in o){let a=b.default.get(n,s);Array.isArray(a)&&a.length===0&&(typeof o[s]=="function"?n=b.default.set(n,s,o[s](n)):n=b.default.set(n,s,o[s])),typeof a=="string"&&a.trim().length===0&&(typeof o[s]=="function"?n=b.default.set(n,s,o[s](n)):n=b.default.set(n,s,o[s])),typeof a=="object"&&Object.keys(a).length===0&&(typeof o[s]=="function"?n=b.default.set(n,s,o[s](n)):n=b.default.set(n,s,o[s]))}return n}return e.ifNull&&(t=t.map(n=>r(n,e.ifNull))),e.ifEmpty&&(t=t.map(n=>i(n,e.ifEmpty))),e.ifNullOrEmpty&&(t=t.map(n=>r(n,e.ifNullOrEmpty)).map(n=>i(n,e.ifNullOrEmpty))),t}var re=m(require("dot-wild"),1);var he=m(require("dot-wild"),1);function me(t,e){let r=!1;return l(e)&&u(e).forEach(i=>{let n=e[i].$gt;n=p(n);let o=he.default.get(t,i);o!==void 0&&n.forEach(s=>{typeof o=="string"||typeof o=="number"?o>s&&(r=!0):Array.isArray(o)&&o.length>s&&(r=!0)})}),r}var ge=m(require("dot-wild"),1);function be(t,e){let r=!1;return l(e)&&u(e).forEach(i=>{let n=e[i].$gte;n=p(n);let o=ge.default.get(t,i);o!==void 0&&n.forEach(s=>{typeof o=="string"||typeof o=="number"?o>=s&&(r=!0):Array.isArray(o)&&o.length>=s&&(r=!0)})}),r}var ye=m(require("dot-wild"),1);function Te(t,e){let r=!1;return l(e)&&u(e).forEach(i=>{let n=e[i].$lt;n=p(n);let o=ye.default.get(t,i);o!==void 0&&n.forEach(s=>{typeof o=="string"||typeof o=="number"?o<s&&(r=!0):Array.isArray(o)&&o.length<s&&(r=!0)})}),r}var Oe=m(require("dot-wild"),1);function _e(t,e){let r=!1;return l(e)&&u(e).forEach(i=>{let n=e[i].$lte;n=p(n);let o=Oe.default.get(t,i);o!==void 0&&n.forEach(s=>{typeof o=="string"||typeof o=="number"?o<=s&&(r=!0):Array.isArray(o)&&o.length<=s&&(r=!0)})}),r}var Z=m(require("dot-wild"),1);function je(t,e){let r=[];return l(e)&&u(e).forEach(i=>{if(i!=="$and")return;let n=e[i];n=p(n),n.forEach(o=>{u(o).forEach(s=>{let a=Z.default.get(o,s),f=Z.default.get(t,s);if(typeof a=="function"&&f!==void 0)r.push(a(f));else{let c=y(t,o,{deep:!0,returnKey:h,clonedData:!0},t);r.push(Boolean(c&&c.length))}})})}),!(!r.length||r.length&&r.includes(!1))}var G=m(require("dot-wild"),1);function ve(t,e){let r=[];return l(e)&&u(e).forEach(i=>{if(i!=="$or")return;let n=e[i];n=p(n),n.forEach(o=>{u(o).forEach(s=>{let a=G.default.get(o,s),f=G.default.get(t,s);if(typeof a=="function"&&f!==void 0)r.push(a(f));else{let c=y(t,o,{deep:!0,returnKey:h,clonedData:!0},t);r.push(Boolean(c&&c.length))}})})}),r.length?!!(r.length&&r.includes(!0)):!1}var k=m(require("dot-wild"),1);function xe(t,e){let r=[];return l(e)&&u(e).forEach(i=>{if(i!=="$xor")return;let n=e[i];if(n=p(n),n.length!==2)throw new Error(`invalid $xor query. expected exactly two values, found ${n.length}.`);n.forEach(o=>{u(o).forEach(s=>{let a=k.default.get(o,s)??o[s],f=k.default.get(t,s);if(typeof a=="function"&&f!==void 0)r.push(a(f));else{let c=y(t,o,{deep:!0,returnKey:h,clonedData:!0},t);r.push(Boolean(c&&c.length))}})})}),r.length===2?r.filter(i=>i).length===1:!1}var Ee=m(require("dot-wild"),1);function Ae(t,e){let r;return l(e)&&u(e).forEach(i=>{if(l(e[i])){let n=Ee.default.get(t,i);if(n===void 0)return;u(e[i]).forEach(o=>{o==="$fn"&&(r=!0,p(e[i][o]).forEach(s=>{s(n)||(r=!1)}))})}}),r!==void 0?r:!1}var $e=m(require("dot-wild"),1);function Ce(t,e){let r;return l(e)&&u(e).forEach(i=>{if(l(e[i])){let n=$e.default.get(t,i);if(n===void 0)return;u(e[i]).forEach(o=>{o==="$re"&&(r=!0,p(e[i][o]).forEach(s=>{s.test(n)||(r=!1)}))})}}),r!==void 0?r:!1}var z=m(require("dot-wild"),1);function we(t,e){let r=[];return l(e)&&u(e).forEach(i=>{let n=e[i].$includes;n=p(n),z.default.get(t,i)&&n.forEach(o=>{r.push(z.default.get(t,i).includes(o))})}),!(!r.length||r.length&&r.includes(!1))}var Ie=m(require("dot-wild"),1);function De(t,e){let r=[];return l(e)&&u(e).forEach(i=>{let n=e[i].$oneOf;n=p(n);let o=Ie.default.get(t,i);o!==void 0&&r.push(n.includes(o))}),!(!r.length||r.length&&r.includes(!1))}var Se=m(require("dot-wild"),1);function Pe(t,e){let r=!1;return l(e)&&u(e).forEach(i=>{let n=e[i].$length,o=Se.default.get(t,i);o!==void 0&&(Array.isArray(o)||typeof o=="string")&&o.length===n&&(r=!0)}),r}function Ve(t,e){let r=[];return l(e)&&u(e).forEach(i=>{if(i!=="$not")return;if(!l(e[i]))throw new Error(`$not operator requires an object as its value, received: ${e[i]}`);let n=p(e[i]);r.push(n.every(o=>{if(l(o)){let s=y(t,o,{deep:!0,returnKey:h,clonedData:!0},t);return!(s&&s.length)}return _(t,o)}))}),r.every(i=>!i)||!1}var Ke=m(require("dot-wild"),1);function Ne(t,e){let r=!1;return l(e)&&u(e).forEach(i=>{if(i!=="$has")return;let n=e[i];n=p(n),r=n.every(o=>Ke.default.get(t,o)!==void 0)}),r}var Qe=m(require("dot-wild"),1);function Re(t,e){let r=!1;return l(e)&&u(e).forEach(i=>{if(i!=="$hasAny")return;let n=e[i];n=p(n),r=n.some(o=>Qe.default.get(t,o))}),r}var $=(t,e,r,i=!1)=>{if(t===void 0)return;let n=o=>{if(!l(o))return o;let s={...o};return x(s,e)&&u(r).forEach(a=>{i?s={...s,[a]:r[a]}:_(s,a)&&(s={...s,[a]:r[a]})}),u(s).forEach(a=>{(l(s[a])||Array.isArray(s[a]))&&(s={...s,[a]:$(s[a],e,r,i)})}),s};return(Array.isArray(t)||l(t))&&!O(e)&&!O(r)?Array.isArray(t)?t.map(o=>n(o)):n(t):t};function Me(t,e,r,i){return p(e).forEach(o=>{if(!l(o)&&!Array.isArray(o)){let s={};u(r).forEach(a=>{s[a]=o}),t=$(t,r,s,!0);return}t=$(t,r,o,!0)}),t}var Fe=m(require("dot-wild"),1);function q(t,e,r,i){return p(e).forEach(o=>{if(Array.isArray(o))return q(t,o,r,i);t=t.map(s=>Fe.default.set(s,o,void 0))}),t}function Ye(t,e,r,i){return p(e).forEach(o=>{if(!l(o)&&!Array.isArray(o)){let s={};u(r).forEach(a=>{s[a]=o}),t=$(t,r,s,!1)}else t=$(t,r,o,!1)}),t}function F(t,e,r,i,n){let o=p(e),s=y(t,r,{deep:!0,returnKey:h,clonedData:!1});return o.forEach(a=>{if(l(a)&&u(a).forEach(f=>{s.forEach(c=>{let d=y([c],r,{returnKey:f,deep:!0,clonedData:!1});(d?.length?d:s).forEach(g=>{if(_(g,f))i===0?g[f]+=a[f]:i===1?g[f]-=a[f]:i===2?g[f]*=a[f]:i===3&&(g[f]/=a[f]);else{let j=u(r)[0],v=y([g],r,{returnKey:j,deep:!0,clonedData:!1});v&&v.forEach(E=>{i===0?E[f]=a[f]:i===1?E[f]=-a[f]:i===2?E[f]=a[f]:i===3&&(E[f]=1/a[f])})}})})}),!l(a)){if(!s||!s.length)return;u(r).forEach(f=>{s.forEach(c=>{let d=y([c],r,{returnKey:f,deep:!0,clonedData:!1});(d?.length?d:s).forEach(g=>{_(g,f)?i===0?g[f]+=a:i===1?g[f]-=a:i===2?g[f]*=a:i===3&&(g[f]/=a):i===0?g[f]=a:i===1?g[f]=-a:i===2?g[f]=a:i===3&&(g[f]=1/a)})})})}}),t}function Be(t,e,r,i){return F(t,e,r,0,i)}function He(t,e,r,i){return F(t,e,r,1,i)}function Je(t,e,r,i){return F(t,e,r,2,i)}function Ue(t,e,r,i){return F(t,e,r,3,i)}var We=m(require("lodash"),1);function ee(t,e,r,i=!1){if(t===void 0)return;let n=o=>{if(!l(o))return o;let s={...o};return x(s,e)&&(i?s=We.default.merge(s,r):s={...s,...r}),u(s).forEach(a=>{(l(s[a])||Array.isArray(s[a]))&&(s={...s,[a]:ee(s[a],e,r)})}),s};return(Array.isArray(t)||l(t))&&!O(e)&&!O(r)?Array.isArray(t)?t.map(o=>n(o)):n(t):t}function Xe(t,e,r,i){return p(e).forEach(o=>{t=ee(t,r,o,!0)}),t}function Le(t,e,r,i){if(typeof e!="function")throw new Error("$map expected a function, e.g. { $map: (doc) => doc }");return t.map((n,o,s)=>e(n,o,s))}var te=m(require("dot-wild"),1);function Ze(t,e,r,i){if(de(e))return t.filter((n,o,s)=>e(n,o,s)?!0:(n[h]&&i.remove({[h]:n[h]}),!1));if(l(e))return t.map(n=>(Object.keys(e).forEach(o=>{let s=te.default.get(n,o);if(!Array.isArray(s))throw new Error(`$filter when providing an object to filter on, the key being operated on in the source document must be an array: ${o} was not an array`);let a=s.filter((f,c,d)=>e[o](f,c,d));n=te.default.set(n,o,a)}),n));throw new Error("$filter expected either a function, e.g. { $filter: (doc) => doc }, or an array path with a function key, e.g. { $filter: { anArray: (doc) => doc } }")}var P=m(require("dot-wild"),1);function Ge(t,e,r,i){return p(e).forEach(o=>{l(o)&&Object.keys(o).forEach(s=>{t=t.map(a=>{if(P.default.get(a,s)!==void 0){let f=P.default.get(a,s),c=o[s];if(Array.isArray(c)){let d=f.concat(c);a=P.default.set(a,s,d)}else{let d=f.concat([c]);a=P.default.set(a,s,d)}}return a})})}),t}var V=m(require("dot-wild"),1);function ke(t,e,r,i){return p(e).forEach(o=>{l(o)&&Object.keys(o).forEach(s=>{t=t.map(a=>{if(V.default.get(a,s)!==void 0){let f=V.default.get(a,s),c=o[s];if(Array.isArray(c)){let d=c.concat(f);a=V.default.set(a,s,d)}else{let d=[c].concat(f);a=V.default.set(a,s,d)}}return a})})}),t}var K={$gt:me,$gte:be,$lt:Te,$lte:_e,$and:je,$or:ve,$xor:xe,$includes:we,$oneOf:De,$fn:Ae,$re:Ce,$length:Pe,$not:Ve,$has:Ne,$hasAny:Re},ze={$merge:Xe,$map:Le,$filter:Ze,$push:Ge,$unshift:ke,$set:Me,$unset:q,$change:Ye,$inc:Be,$dec:He,$mult:Je,$div:Ue};function qe(t,e,r,i){return u(e).forEach(n=>{if(!ze[n]){console.warn(`unknown operator: ${n}`);return}t=ze[n](t,e[n],r,i)}),t}function x(t,e){if(typeof t!=typeof e)return!1;let r=(i,n)=>{if(i[n]===e[n])return!0;let o=[];return n.startsWith("$")&&o.push(n),n!=="$not"&&l(e[n])&&!O(e[n])&&(o=o.concat(u(e[n]).filter(s=>s.startsWith("$")))),o.length?o.every(s=>s==="$not"?!K[s](i,e):K[s](i,e)):n.includes(".")?re.default.get(i,n)===e[n]:_(i,n)&&x(i[n],e[n])};return Array.isArray(t)&&Array.isArray(e)?t.some(i=>l(i)||Array.isArray(i))||e.some(i=>l(i)||Array.isArray(i))?t.every((i,n)=>x(t[n],e[n])):[...t].map(i=>`${i}`).sort().join(",")===[...e].map(i=>`${i}`).sort().join(","):Array.isArray(t)&&l(e)?Object.keys(e).every(i=>r(t,i)):l(t)&&l(e)?u(e).every(i=>r(t,i)):t===e}function y(t,e,r,i=null){if(t===void 0)return;t.__private&&delete t.__private,_(t,r.returnKey)&&(i=t);let n,o=Object.keys(e).some(f=>f.startsWith("$"));function s(f){if(!(!f||O(f))){if(n=p(n),f=p(f),Array.isArray(n)&&Array.isArray(f)){let c=n.map(d=>d[r.returnKey]);if(f.some(d=>c.includes(d[r.returnKey])))return}n=n.concat(f)}}function a(f){!f||(_(f,r.returnKey)&&(i=f),x(f,e)?s(i):r.deep&&!o&&u(f).forEach(c=>{(l(f[c])||Array.isArray(f[c]))&&(_(e,c)?s(y(f[c],e[c],r,i)):s(y(f[c],e,r,i)))}))}if(t=p(t),l(e)&&Array.isArray(t)&&!o&&t.forEach((f,c)=>{_(f,r.returnKey)&&(i=f),u(e).forEach(d=>{if(typeof d=="string"&&d.includes(".")){let T=re.default.get(f,d);T!==void 0&&s(y(T,e[d],r,i))}else l(f)?x(t[c],e[d])&&s(i):x(t,e[d])&&s(i)})}),!O(e)&&Array.isArray(t))t.forEach(f=>a(f));else return t;return n}var mt=(t,e)=>{let r=new Map,i;return t=p(t),t.filter(n=>{if(n!==void 0)return i=r.get(n[e]),i?n[e]!=i?(r.delete(n[e]),r.set(n[e],n[e]),!0):!1:(r.set(n[e],n[e]),!0)})};function ne(t,e,r,i,n){if(r={...B(),...r},e=p(e),e=e.filter(c=>Object.keys(c).length>0),!e.length){if(r.clonedData){let c=[];for(let d in t)d!=="__private"&&c.push(Y.default.cloneDeep(t[d]));return c}return S([...A(t)],r)}let o=[...A(t)].slice(1),s=[];for(let c of e){let d=[];if(c[h]&&!l(c[h])&&!i.integerIds)d.push(t[c[h]]);else if(c[h]&&!l(c[h])&&i.integerIds){let T=t.__private.id_map[c[h]];T&&d.push(t[T])}else{let T=H(Y.default.cloneDeep(c)),g=Object.fromEntries(Object.entries(et.default.flatten(T)).map(([j,v])=>[j.replace(/\\./g,"."),v]));Object.keys(g).some(j=>n.indices[j])?Object.keys(n.indices).forEach(j=>{let v=j.includes(".")?g[j]:c[j];if(v){let E=t.__private.index.valuesToCuid?.[j]?.[v];if(E){let nt=E?.map(it=>t[it]);d.push(...y(nt,c,r,i))}else d.push(...y(o,c,r,n))}}):(d=y(o,c,r,null),d===void 0&&(d=[]),d=p(d))}s.push(...d)}let a=mt(s,h);if(s=S(a,r),!r.clonedData)return s;let f=[];for(let c of s)f.push(Y.default.cloneDeep(c));return f}var C=m(require("fs"),1),ie=m(require("path"),1),N=class{elements=[];push(...e){this.elements.push(...e)}shift(){return this.elements.shift()}length(){return this.elements.length}},w=class{storagePath;name;filePath;queue;constructor(e,r){r.endsWith(".json")||(r+=".json"),this.storagePath=e,this.name=r,this.queue=new N,this.filePath=ie.default.join(this.storagePath,this.name),this.prepareStorage()}prepareStorage(){C.default.existsSync(this.storagePath)||C.default.mkdirSync(this.storagePath),C.default.existsSync(this.filePath)||C.default.writeFileSync(this.filePath,JSON.stringify({}))}read(){try{return Object.assign({},JSON.parse(C.default.readFileSync(this.filePath,"utf8"))||{})}catch{return{}}}write(e){for(this.queue.push([r=>{gt(r,this.filePath)},e]);this.queue.length();){let r=this.queue.shift();r[0](r[1])}}};function gt(t,...e){let i=(process.env.NODE_ENV||"development")==="development"?2:0,n=JSON.stringify(t,null,i);return bt(n,...e)}function bt(t,...e){let r=ie.default.join(...e);return C.default.writeFileSync(r,t)}var J=class{collection;inserted=[];removed=[];updated=[];operations=[];constructor(e){this.collection=e}insert(e){let r=this.collection.insert(e);return this.inserted.push(r),this.operations.push("insert"),r}update(e,r,i={}){let n=this.collection.find(e,{...i,project:void 0,join:void 0});return this.updated.push({documents:n,operations:r,options:i}),this.operations.push("update"),this.collection.update(e,r,i)}remove(e,r={}){let i=this.collection.find(e,{...r,project:void 0,join:void 0});return this.collection.remove(e,r),this.removed.push(i),this.operations.push("remove"),i}rollback(){let e=n=>{n.forEach(o=>{o[h]!==void 0?this.collection.remove({[h]:o[h]}):this.collection.remove({...o})})},r=n=>{n.documents.forEach(o=>{o[h]!==void 0?this.collection.assign(o[h],o):this.collection.update({...o},n.operations,n.options)})},i=n=>{n.forEach(o=>{o[h]!==void 0&&this.collection.assign(o[h],o)})};this.operations.reverse().forEach(n=>{switch(n){case"insert":e(this.inserted.pop());break;case"update":r(this.updated.pop());break;case"remove":i(this.removed.pop());break}}),this.inserted=[],this.updated=[],this.removed=[],this.operations=[]}commit(){this.inserted=[],this.updated=[],this.removed=[],this.collection._transaction=null}};var oe=m(require("dot-wild"),1);function se(t,e,r,i,n,o){i={...B(),...i},e=p(e);let s=[];for(let a of e){let f=[];f=y([...A(t)],a,i,null),f=p(f),s.push(...qe(f,r,a,o))}return i.returnKey===h&&n.timestamps&&s.forEach(a=>{let f;if(n.integerIds){let c=a[h];f=t.__private.id_map[c]}else f=a[h];Object.keys(o.indices).forEach(c=>{if(oe.default.get(a,c)){let d=t.__private.index.cuidToValues[f][c],T=String(oe.default.get(a,c));d!==T&&(t.__private.index.valuesToCuid[c][T]=t.__private.index.valuesToCuid[c][T]||[],t.__private.index.valuesToCuid[c][T].push(f),t.__private.index.valuesToCuid[c][d]=t.__private.index.valuesToCuid[c][d].filter(g=>g!==g),t.__private.index.valuesToCuid[c][d].length===0&&delete t.__private.index.valuesToCuid[c][d],t.__private.index.cuidToValues[f][c]=T)}}),a[ae]=Date.now(),o.merge(a[h],a)}),S(s,i)}var fe=256,ce=[];for(;fe--;)ce[fe]=(fe+256).toString(16).substring(1);function yt(t,e){let r="000000"+t;return r.substr(r.length-e)}function tt(t){let e=t.len||16,r="",i=0,n=Math.pow(36,4),o=t.init+Math.ceil(n/2);function s(){return o=o<=n?o:0,o++,(o-1).toString(16)}return function(){if(!r||i===256){for(r="",i=(1+e)/2|0;i--;)r+=ce[256*Math.random()|0];r=r.substring(i=0,e)}return`a${Date.now().toString(36)}${yt(s(),6)}${ce[i++]}${r}`}}function B(){return{deep:!0,returnKey:h,clonedData:!0,sort:void 0,skip:void 0,project:void 0}}function H(t){let e=new Set(u(K));return l(t)?(Object.keys(t).forEach(r=>{if(l(r)&&u(t[r]).every(i=>e.has(i))){delete t[r];return}if(!l(r)&&e.has(r)){delete t[r];return}if(!!l(t[r])){if(u(t[r]).every(i=>e.has(i))){delete t[r];return}u(t[r]).forEach(i=>{e.has(i)?delete t[r][i]:H(t[r][i])})}}),L(t)):t}var h="_id",Tt="_created_at",ae="_updated_at",le=t=>t!==void 0&&(typeof t=="string"||typeof t=="number"||typeof t=="boolean"),W=class{storagePath;name;options;data={};_transaction=null;indices={};createId;constructor(e=".data",r="db",i={}){this.storagePath=e,this.name=r,i.autosync=i.autosync??!0,i.timestamps=i.timestamps??!0,i.integerIds=i.integerIds??!1,i.adapter=i.adapter??new w(this.storagePath,this.name),this.options=i;let n=()=>({current:0,next_id:0,id_map:{},index:{valuesToCuid:{},cuidToValues:{}}});this.adapterRead(),this.data.__private||(this.data.__private=n()),this.createId=tt({init:this.data.__private.current,len:4})}adapterRead(){this.data=this.options.adapter.read()}assign(e,r){if(e!==void 0){if(this.options.integerIds){let i=e,n=this.data.__private.id_map[i];return n?(this.data[n]=r,this.data[n]):this.insert({...r,[h]:i})[0]}if(typeof e=="string"||typeof e=="number")return this.data[e]=r,this.data[e]}}filter(e){let r=Object.assign({},this.data);return delete r.__private,Object.values(r).filter(i=>{try{return e(i)}catch{return!1}})}find(e,r={}){return ne(this.data,e,r,this.options,this)}update(e,r,i={}){return se(this.data,e,r,i,this.options,this)}upsert(e,r,i={}){let n=this.update(e,r,i);if(n.length)return n;e=H(e);let o=this.insert(e);return se(o,e,r,i,this.options,this)}remove(e,r={}){let i=this.find(e,{...r,clonedData:!1}),n=i.map(o=>Object.assign({},o));return i.forEach(o=>{let s;if(this.options.integerIds){let a=o[h];s=this.data.__private.id_map[a],delete this.data.__private.id_map[a]}else s=o[h];Object.keys(this.indices).forEach(a=>{let f=U.default.get(o,a);le(f)&&(this.data.__private.index.valuesToCuid[a][f]=this.data.__private.index.valuesToCuid[a][f].filter(c=>c!==s),this.data.__private.index.valuesToCuid[a][f].length===0&&delete this.data.__private.index.valuesToCuid[a][f],delete this.data.__private.index.cuidToValues[s]),f===void 0&&Object.keys(this.data.__private.index.valuesToCuid[a]).forEach(c=>{this.data.__private.index.valuesToCuid[a][c]=this.data.__private.index.valuesToCuid[a][c].filter(d=>d!==s),this.data.__private.index.valuesToCuid[a][c].length===0&&delete this.data.__private.index.valuesToCuid[a][c]})}),delete this.data[s]}),this.sync(),n}insert(e){return Array.isArray(e)||(e=[e]),e.length?(e=e.map(r=>{let i=this.getId();if(this.data.__private.current++,this.options.timestamps&&(r[Tt]=Date.now(),r[ae]=Date.now()),r[h]===void 0&&(r[h]=i,this.options.integerIds)){let n=this.nextIntegerId();this.data.__private.id_map[n]=i,r[h]=n}return this.data[i]=r,Object.keys(this.indices).forEach(n=>{let o=String(U.default.get(r,n));if(le(o)){if(this.indices[n].unique&&this.data.__private.index.valuesToCuid?.[n]?.[o]!==void 0)throw new Error(`Unique index violation for key "${n}" and value "${o}"`);this.data.__private.index.valuesToCuid[n]=this.data.__private.index.valuesToCuid[n]||{},this.data.__private.index.valuesToCuid[n][o]=this.data.__private.index.valuesToCuid[n][o]||[],this.data.__private.index.valuesToCuid[n][o].push(i),this.data.__private.index.cuidToValues[i]=this.data.__private.index.cuidToValues[i]||{},this.data.__private.index.cuidToValues[i][n]=o}}),r}),this.options.autosync&&this.sync(),e):[]}merge(e,r){if(!!e){if(this.options.integerIds){let i=this.data.__private.id_map[e];if(!i||this.data[i]===void 0)return;Object.assign(this.data[i],O(r)?{}:r),this.sync();return}this.data[e]!==void 0&&(Object.assign(this.data[e],O(r)?{}:r),this.sync())}}sync(){return this.options.adapter.write(this.data)}drop(){this.data={__private:{current:0,next_id:0,id_map:{},index:{valuesToCuid:{},cuidToValues:{}}}}}getId(){return this.createId()}createIndex(e={}){if(!e.key)throw new Error("createIndex requires a key");e={key:e.key,unique:e.unique??!1};let{key:r,unique:i}=e;if(r.split(".").some(n=>!isNaN(Number(n))))throw new Error(`Cannot use a numeric property as an index key: ${r}`);if(this.indices[r]={unique:i},!this.data.__private.index.valuesToCuid[r])return Object.keys(this.data).forEach(n=>{if(n==="__private")return;let o=String(U.default.get(this.data[n],r));if(le(o)){if(i&&this.data.__private.index.valuesToCuid?.[r]?.[o]!==void 0)throw new Error(`Unique index violation for key "${r}" and value "${o}"`);this.data.__private.index.valuesToCuid[r]=this.data.__private.index.valuesToCuid[r]||{},this.data.__private.index.valuesToCuid[r][o]=this.data.__private.index.valuesToCuid[r][o]||[],this.data.__private.index.valuesToCuid[r][o].push(n),this.data.__private.index.cuidToValues[n]=this.data.__private.index.cuidToValues[n]||{},this.data.__private.index.cuidToValues[n][r]=o}else throw new Error(`Invalid index value for property ${r}: ${o}`)}),this.sync(),this}removeIndex(e){return this.indices[e]?(delete this.indices[e],this.data.__private.index.valuesToCuid[e]&&delete this.data.__private.index.valuesToCuid[e],Object.keys(this.data.__private.index.cuidToValues).forEach(r=>{this.data.__private.index.cuidToValues[r][e]!==void 0&&delete this.data.__private.index.cuidToValues[r][e],O(this.data.__private.index.cuidToValues[r])&&delete this.data.__private.index.cuidToValues[r]}),this.sync(),!0):!1}nextIntegerId(){return this.data.__private.next_id++}transaction(e){this._transaction=new J(this);try{e(this._transaction)}catch(r){throw this._transaction.rollback(),r}this._transaction.commit()}};var I=m(require("fs"),1),ue=m(require("path"),1);var X=m(require("crypto"),1),Q=class{storagePath;name;filePath;queue;constructor(e,r){r.endsWith(".json")||(r+=".json"),this.storagePath=e,this.name=r,this.queue=new N,this.filePath=ue.default.join(this.storagePath,this.name),this.prepareStorage()}prepareStorage(){I.default.existsSync(this.storagePath)||I.default.mkdirSync(this.storagePath),I.default.existsSync(this.filePath)||I.default.writeFileSync(this.filePath,JSON.stringify({}))}read(){try{let e=I.default.readFileSync(this.filePath,"utf8"),r=vt(e);return Object.assign({},JSON.parse(r)||{})}catch{return{}}}write(e){for(this.queue.push([r=>{Ot(r,this.filePath)},e]);this.queue.length();){let r=this.queue.shift();r[0](r[1])}}},rt=String(process.env.ARC_ENCFS_KEY||"Mahpsee2X7TKLe1xwJYmar91pCSaZIY7"),Ot=(t,...e)=>{let r=JSON.stringify(t,null,0);return _t(jt(r),...e)},_t=(t,...e)=>I.default.writeFileSync(ue.default.join(...e),t),jt=t=>{let e=Buffer.from(X.default.randomBytes(16)).toString("hex").slice(0,16),r=X.default.createCipheriv("aes-256-cbc",Buffer.from(rt),e),i=Buffer.concat([r.update(t),r.final()]);return`${e}:${i.toString("hex")}`},vt=t=>{let e=t.includes(":")?t.split(":"):[],r=Buffer.from(e.shift()||"","binary"),i=Buffer.from(e.join(":"),"hex"),n=X.default.createDecipheriv("aes-256-cbc",Buffer.from(rt),r);return Buffer.concat([n.update(i),n.final()]).toString()};var R=class{storageKey;constructor(e){this.storageKey=`arc_${e}`}read(){try{return Object.assign({},JSON.parse(localStorage.getItem(`arc_${this.storageKey}`)||"{}"))}catch(e){return console.error(`arc: failed to read from key: ${this.storageKey}: ${e}`),{}}}write(e){localStorage.setItem(this.storageKey,JSON.stringify(e))}};0&&(module.exports={Collection,EncryptedFSAdapter,FSAdapter,LocalStorageAdapter});
