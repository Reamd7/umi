(function(){var e={961:function(e,t){(function(e,n){true?n(t):0})(this,(function(e){"use strict";const t=",".charCodeAt(0);const n=";".charCodeAt(0);const r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";const i=new Uint8Array(64);const s=new Uint8Array(128);for(let e=0;e<r.length;e++){const t=r.charCodeAt(e);i[e]=t;s[t]=e}const o=typeof TextDecoder!=="undefined"?new TextDecoder:typeof Buffer!=="undefined"?{decode(e){const t=Buffer.from(e.buffer,e.byteOffset,e.byteLength);return t.toString()}}:{decode(e){let t="";for(let n=0;n<e.length;n++){t+=String.fromCharCode(e[n])}return t}};function decode(e){const t=new Int32Array(5);const n=[];let r=0;do{const i=indexOf(e,r);const s=[];let o=true;let l=0;t[0]=0;for(let n=r;n<i;n++){let r;n=decodeInteger(e,n,t,0);const a=t[0];if(a<l)o=false;l=a;if(hasMoreVlq(e,n,i)){n=decodeInteger(e,n,t,1);n=decodeInteger(e,n,t,2);n=decodeInteger(e,n,t,3);if(hasMoreVlq(e,n,i)){n=decodeInteger(e,n,t,4);r=[a,t[1],t[2],t[3],t[4]]}else{r=[a,t[1],t[2],t[3]]}}else{r=[a]}s.push(r)}if(!o)sort(s);n.push(s);r=i+1}while(r<=e.length);return n}function indexOf(e,t){const n=e.indexOf(";",t);return n===-1?e.length:n}function decodeInteger(e,t,n,r){let i=0;let o=0;let l=0;do{const n=e.charCodeAt(t++);l=s[n];i|=(l&31)<<o;o+=5}while(l&32);const a=i&1;i>>>=1;if(a){i=-2147483648|-i}n[r]+=i;return t}function hasMoreVlq(e,n,r){if(n>=r)return false;return e.charCodeAt(n)!==t}function sort(e){e.sort(sortComparator)}function sortComparator(e,t){return e[0]-t[0]}function encode(e){const r=new Int32Array(5);const i=1024*16;const s=i-36;const l=new Uint8Array(i);const a=l.subarray(0,s);let u=0;let c="";for(let h=0;h<e.length;h++){const d=e[h];if(h>0){if(u===i){c+=o.decode(l);u=0}l[u++]=n}if(d.length===0)continue;r[0]=0;for(let e=0;e<d.length;e++){const n=d[e];if(u>s){c+=o.decode(a);l.copyWithin(0,s,u);u-=s}if(e>0)l[u++]=t;u=encodeInteger(l,u,r,n,0);if(n.length===1)continue;u=encodeInteger(l,u,r,n,1);u=encodeInteger(l,u,r,n,2);u=encodeInteger(l,u,r,n,3);if(n.length===4)continue;u=encodeInteger(l,u,r,n,4)}}return c+o.decode(l.subarray(0,u))}function encodeInteger(e,t,n,r,s){const o=r[s];let l=o-n[s];n[s]=o;l=l<0?-l<<1|1:l<<1;do{let n=l&31;l>>>=5;if(l>0)n|=32;e[t++]=i[n]}while(l>0);return t}e.decode=decode;e.encode=encode;Object.defineProperty(e,"__esModule",{value:true})}))},712:function(e,t,n){"use strict";var r=n(961);class BitSet{constructor(e){this.bits=e instanceof BitSet?e.bits.slice():[]}add(e){this.bits[e>>5]|=1<<(e&31)}has(e){return!!(this.bits[e>>5]&1<<(e&31))}}class Chunk{constructor(e,t,n){this.start=e;this.end=t;this.original=n;this.intro="";this.outro="";this.content=n;this.storeName=false;this.edited=false;{this.previous=null;this.next=null}}appendLeft(e){this.outro+=e}appendRight(e){this.intro=this.intro+e}clone(){const e=new Chunk(this.start,this.end,this.original);e.intro=this.intro;e.outro=this.outro;e.content=this.content;e.storeName=this.storeName;e.edited=this.edited;return e}contains(e){return this.start<e&&e<this.end}eachNext(e){let t=this;while(t){e(t);t=t.next}}eachPrevious(e){let t=this;while(t){e(t);t=t.previous}}edit(e,t,n){this.content=e;if(!n){this.intro="";this.outro=""}this.storeName=t;this.edited=true;return this}prependLeft(e){this.outro=e+this.outro}prependRight(e){this.intro=e+this.intro}split(e){const t=e-this.start;const n=this.original.slice(0,t);const r=this.original.slice(t);this.original=n;const i=new Chunk(e,this.end,r);i.outro=this.outro;this.outro="";this.end=e;if(this.edited){i.edit("",false);this.content=""}else{this.content=n}i.next=this.next;if(i.next)i.next.previous=i;i.previous=this;this.next=i;return i}toString(){return this.intro+this.content+this.outro}trimEnd(e){this.outro=this.outro.replace(e,"");if(this.outro.length)return true;const t=this.content.replace(e,"");if(t.length){if(t!==this.content){this.split(this.start+t.length).edit("",undefined,true)}return true}else{this.edit("",undefined,true);this.intro=this.intro.replace(e,"");if(this.intro.length)return true}}trimStart(e){this.intro=this.intro.replace(e,"");if(this.intro.length)return true;const t=this.content.replace(e,"");if(t.length){if(t!==this.content){this.split(this.end-t.length);this.edit("",undefined,true)}return true}else{this.edit("",undefined,true);this.outro=this.outro.replace(e,"");if(this.outro.length)return true}}}function getBtoa(){if(typeof window!=="undefined"&&typeof window.btoa==="function"){return e=>window.btoa(unescape(encodeURIComponent(e)))}else if(typeof Buffer==="function"){return e=>Buffer.from(e,"utf-8").toString("base64")}else{return()=>{throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.")}}}const i=getBtoa();class SourceMap{constructor(e){this.version=3;this.file=e.file;this.sources=e.sources;this.sourcesContent=e.sourcesContent;this.names=e.names;this.mappings=r.encode(e.mappings)}toString(){return JSON.stringify(this)}toUrl(){return"data:application/json;charset=utf-8;base64,"+i(this.toString())}}function guessIndent(e){const t=e.split("\n");const n=t.filter((e=>/^\t+/.test(e)));const r=t.filter((e=>/^ {2,}/.test(e)));if(n.length===0&&r.length===0){return null}if(n.length>=r.length){return"\t"}const i=r.reduce(((e,t)=>{const n=/^ +/.exec(t)[0].length;return Math.min(n,e)}),Infinity);return new Array(i+1).join(" ")}function getRelativePath(e,t){const n=e.split(/[/\\]/);const r=t.split(/[/\\]/);n.pop();while(n[0]===r[0]){n.shift();r.shift()}if(n.length){let e=n.length;while(e--)n[e]=".."}return n.concat(r).join("/")}const s=Object.prototype.toString;function isObject(e){return s.call(e)==="[object Object]"}function getLocator(e){const t=e.split("\n");const n=[];for(let e=0,r=0;e<t.length;e++){n.push(r);r+=t[e].length+1}return function locate(e){let t=0;let r=n.length;while(t<r){const i=t+r>>1;if(e<n[i]){r=i}else{t=i+1}}const i=t-1;const s=e-n[i];return{line:i,column:s}}}class Mappings{constructor(e){this.hires=e;this.generatedCodeLine=0;this.generatedCodeColumn=0;this.raw=[];this.rawSegments=this.raw[this.generatedCodeLine]=[];this.pending=null}addEdit(e,t,n,r){if(t.length){const t=[this.generatedCodeColumn,e,n.line,n.column];if(r>=0){t.push(r)}this.rawSegments.push(t)}else if(this.pending){this.rawSegments.push(this.pending)}this.advance(t);this.pending=null}addUneditedChunk(e,t,n,r,i){let s=t.start;let o=true;while(s<t.end){if(this.hires||o||i.has(s)){this.rawSegments.push([this.generatedCodeColumn,e,r.line,r.column])}if(n[s]==="\n"){r.line+=1;r.column=0;this.generatedCodeLine+=1;this.raw[this.generatedCodeLine]=this.rawSegments=[];this.generatedCodeColumn=0;o=true}else{r.column+=1;this.generatedCodeColumn+=1;o=false}s+=1}this.pending=null}advance(e){if(!e)return;const t=e.split("\n");if(t.length>1){for(let e=0;e<t.length-1;e++){this.generatedCodeLine++;this.raw[this.generatedCodeLine]=this.rawSegments=[]}this.generatedCodeColumn=0}this.generatedCodeColumn+=t[t.length-1].length}}const o="\n";const l={insertLeft:false,insertRight:false,storeName:false};class MagicString{constructor(e,t={}){const n=new Chunk(0,e.length,e);Object.defineProperties(this,{original:{writable:true,value:e},outro:{writable:true,value:""},intro:{writable:true,value:""},firstChunk:{writable:true,value:n},lastChunk:{writable:true,value:n},lastSearchedChunk:{writable:true,value:n},byStart:{writable:true,value:{}},byEnd:{writable:true,value:{}},filename:{writable:true,value:t.filename},indentExclusionRanges:{writable:true,value:t.indentExclusionRanges},sourcemapLocations:{writable:true,value:new BitSet},storedNames:{writable:true,value:{}},indentStr:{writable:true,value:undefined}});this.byStart[0]=n;this.byEnd[e.length]=n}addSourcemapLocation(e){this.sourcemapLocations.add(e)}append(e){if(typeof e!=="string")throw new TypeError("outro content must be a string");this.outro+=e;return this}appendLeft(e,t){if(typeof t!=="string")throw new TypeError("inserted content must be a string");this._split(e);const n=this.byEnd[e];if(n){n.appendLeft(t)}else{this.intro+=t}return this}appendRight(e,t){if(typeof t!=="string")throw new TypeError("inserted content must be a string");this._split(e);const n=this.byStart[e];if(n){n.appendRight(t)}else{this.outro+=t}return this}clone(){const e=new MagicString(this.original,{filename:this.filename});let t=this.firstChunk;let n=e.firstChunk=e.lastSearchedChunk=t.clone();while(t){e.byStart[n.start]=n;e.byEnd[n.end]=n;const r=t.next;const i=r&&r.clone();if(i){n.next=i;i.previous=n;n=i}t=r}e.lastChunk=n;if(this.indentExclusionRanges){e.indentExclusionRanges=this.indentExclusionRanges.slice()}e.sourcemapLocations=new BitSet(this.sourcemapLocations);e.intro=this.intro;e.outro=this.outro;return e}generateDecodedMap(e){e=e||{};const t=0;const n=Object.keys(this.storedNames);const r=new Mappings(e.hires);const i=getLocator(this.original);if(this.intro){r.advance(this.intro)}this.firstChunk.eachNext((e=>{const s=i(e.start);if(e.intro.length)r.advance(e.intro);if(e.edited){r.addEdit(t,e.content,s,e.storeName?n.indexOf(e.original):-1)}else{r.addUneditedChunk(t,e,this.original,s,this.sourcemapLocations)}if(e.outro.length)r.advance(e.outro)}));return{file:e.file?e.file.split(/[/\\]/).pop():null,sources:[e.source?getRelativePath(e.file||"",e.source):null],sourcesContent:e.includeContent?[this.original]:[null],names:n,mappings:r.raw}}generateMap(e){return new SourceMap(this.generateDecodedMap(e))}_ensureindentStr(){if(this.indentStr===undefined){this.indentStr=guessIndent(this.original)}}_getRawIndentString(){this._ensureindentStr();return this.indentStr}getIndentString(){this._ensureindentStr();return this.indentStr===null?"\t":this.indentStr}indent(e,t){const n=/^[^\r\n]/gm;if(isObject(e)){t=e;e=undefined}if(e===undefined){this._ensureindentStr();e=this.indentStr||"\t"}if(e==="")return this;t=t||{};const r={};if(t.exclude){const e=typeof t.exclude[0]==="number"?[t.exclude]:t.exclude;e.forEach((e=>{for(let t=e[0];t<e[1];t+=1){r[t]=true}}))}let i=t.indentStart!==false;const replacer=t=>{if(i)return`${e}${t}`;i=true;return t};this.intro=this.intro.replace(n,replacer);let s=0;let o=this.firstChunk;while(o){const t=o.end;if(o.edited){if(!r[s]){o.content=o.content.replace(n,replacer);if(o.content.length){i=o.content[o.content.length-1]==="\n"}}}else{s=o.start;while(s<t){if(!r[s]){const t=this.original[s];if(t==="\n"){i=true}else if(t!=="\r"&&i){i=false;if(s===o.start){o.prependRight(e)}else{this._splitChunk(o,s);o=o.next;o.prependRight(e)}}}s+=1}}s=o.end;o=o.next}this.outro=this.outro.replace(n,replacer);return this}insert(){throw new Error("magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)")}insertLeft(e,t){if(!l.insertLeft){console.warn("magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead");l.insertLeft=true}return this.appendLeft(e,t)}insertRight(e,t){if(!l.insertRight){console.warn("magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead");l.insertRight=true}return this.prependRight(e,t)}move(e,t,n){if(n>=e&&n<=t)throw new Error("Cannot move a selection inside itself");this._split(e);this._split(t);this._split(n);const r=this.byStart[e];const i=this.byEnd[t];const s=r.previous;const o=i.next;const l=this.byStart[n];if(!l&&i===this.lastChunk)return this;const a=l?l.previous:this.lastChunk;if(s)s.next=o;if(o)o.previous=s;if(a)a.next=r;if(l)l.previous=i;if(!r.previous)this.firstChunk=i.next;if(!i.next){this.lastChunk=r.previous;this.lastChunk.next=null}r.previous=a;i.next=l||null;if(!a)this.firstChunk=r;if(!l)this.lastChunk=i;return this}overwrite(e,t,n,r){r=r||{};return this.update(e,t,n,{...r,overwrite:!r.contentOnly})}update(e,t,n,r){if(typeof n!=="string")throw new TypeError("replacement content must be a string");while(e<0)e+=this.original.length;while(t<0)t+=this.original.length;if(t>this.original.length)throw new Error("end is out of bounds");if(e===t)throw new Error("Cannot overwrite a zero-length range – use appendLeft or prependRight instead");this._split(e);this._split(t);if(r===true){if(!l.storeName){console.warn("The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string");l.storeName=true}r={storeName:true}}const i=r!==undefined?r.storeName:false;const s=r!==undefined?r.overwrite:false;if(i){const n=this.original.slice(e,t);Object.defineProperty(this.storedNames,n,{writable:true,value:true,enumerable:true})}const o=this.byStart[e];const a=this.byEnd[t];if(o){let e=o;while(e!==a){if(e.next!==this.byStart[e.end]){throw new Error("Cannot overwrite across a split point")}e=e.next;e.edit("",false)}o.edit(n,i,!s)}else{const r=new Chunk(e,t,"").edit(n,i);a.next=r;r.previous=a}return this}prepend(e){if(typeof e!=="string")throw new TypeError("outro content must be a string");this.intro=e+this.intro;return this}prependLeft(e,t){if(typeof t!=="string")throw new TypeError("inserted content must be a string");this._split(e);const n=this.byEnd[e];if(n){n.prependLeft(t)}else{this.intro=t+this.intro}return this}prependRight(e,t){if(typeof t!=="string")throw new TypeError("inserted content must be a string");this._split(e);const n=this.byStart[e];if(n){n.prependRight(t)}else{this.outro=t+this.outro}return this}remove(e,t){while(e<0)e+=this.original.length;while(t<0)t+=this.original.length;if(e===t)return this;if(e<0||t>this.original.length)throw new Error("Character is out of bounds");if(e>t)throw new Error("end must be greater than start");this._split(e);this._split(t);let n=this.byStart[e];while(n){n.intro="";n.outro="";n.edit("");n=t>n.end?this.byStart[n.end]:null}return this}lastChar(){if(this.outro.length)return this.outro[this.outro.length-1];let e=this.lastChunk;do{if(e.outro.length)return e.outro[e.outro.length-1];if(e.content.length)return e.content[e.content.length-1];if(e.intro.length)return e.intro[e.intro.length-1]}while(e=e.previous);if(this.intro.length)return this.intro[this.intro.length-1];return""}lastLine(){let e=this.outro.lastIndexOf(o);if(e!==-1)return this.outro.substr(e+1);let t=this.outro;let n=this.lastChunk;do{if(n.outro.length>0){e=n.outro.lastIndexOf(o);if(e!==-1)return n.outro.substr(e+1)+t;t=n.outro+t}if(n.content.length>0){e=n.content.lastIndexOf(o);if(e!==-1)return n.content.substr(e+1)+t;t=n.content+t}if(n.intro.length>0){e=n.intro.lastIndexOf(o);if(e!==-1)return n.intro.substr(e+1)+t;t=n.intro+t}}while(n=n.previous);e=this.intro.lastIndexOf(o);if(e!==-1)return this.intro.substr(e+1)+t;return this.intro+t}slice(e=0,t=this.original.length){while(e<0)e+=this.original.length;while(t<0)t+=this.original.length;let n="";let r=this.firstChunk;while(r&&(r.start>e||r.end<=e)){if(r.start<t&&r.end>=t){return n}r=r.next}if(r&&r.edited&&r.start!==e)throw new Error(`Cannot use replaced character ${e} as slice start anchor.`);const i=r;while(r){if(r.intro&&(i!==r||r.start===e)){n+=r.intro}const s=r.start<t&&r.end>=t;if(s&&r.edited&&r.end!==t)throw new Error(`Cannot use replaced character ${t} as slice end anchor.`);const o=i===r?e-r.start:0;const l=s?r.content.length+t-r.end:r.content.length;n+=r.content.slice(o,l);if(r.outro&&(!s||r.end===t)){n+=r.outro}if(s){break}r=r.next}return n}snip(e,t){const n=this.clone();n.remove(0,e);n.remove(t,n.original.length);return n}_split(e){if(this.byStart[e]||this.byEnd[e])return;let t=this.lastSearchedChunk;const n=e>t.end;while(t){if(t.contains(e))return this._splitChunk(t,e);t=n?this.byStart[t.end]:this.byEnd[t.start]}}_splitChunk(e,t){if(e.edited&&e.content.length){const n=getLocator(this.original)(t);throw new Error(`Cannot split a chunk that has already been edited (${n.line}:${n.column} – "${e.original}")`)}const n=e.split(t);this.byEnd[t]=e;this.byStart[t]=n;this.byEnd[n.end]=n;if(e===this.lastChunk)this.lastChunk=n;this.lastSearchedChunk=e;return true}toString(){let e=this.intro;let t=this.firstChunk;while(t){e+=t.toString();t=t.next}return e+this.outro}isEmpty(){let e=this.firstChunk;do{if(e.intro.length&&e.intro.trim()||e.content.length&&e.content.trim()||e.outro.length&&e.outro.trim())return false}while(e=e.next);return true}length(){let e=this.firstChunk;let t=0;do{t+=e.intro.length+e.content.length+e.outro.length}while(e=e.next);return t}trimLines(){return this.trim("[\\r\\n]")}trim(e){return this.trimStart(e).trimEnd(e)}trimEndAborted(e){const t=new RegExp((e||"\\s")+"+$");this.outro=this.outro.replace(t,"");if(this.outro.length)return true;let n=this.lastChunk;do{const e=n.end;const r=n.trimEnd(t);if(n.end!==e){if(this.lastChunk===n){this.lastChunk=n.next}this.byEnd[n.end]=n;this.byStart[n.next.start]=n.next;this.byEnd[n.next.end]=n.next}if(r)return true;n=n.previous}while(n);return false}trimEnd(e){this.trimEndAborted(e);return this}trimStartAborted(e){const t=new RegExp("^"+(e||"\\s")+"+");this.intro=this.intro.replace(t,"");if(this.intro.length)return true;let n=this.firstChunk;do{const e=n.end;const r=n.trimStart(t);if(n.end!==e){if(n===this.lastChunk)this.lastChunk=n.next;this.byEnd[n.end]=n;this.byStart[n.next.start]=n.next;this.byEnd[n.next.end]=n.next}if(r)return true;n=n.next}while(n);return false}trimStart(e){this.trimStartAborted(e);return this}hasChanged(){return this.original!==this.toString()}_replaceRegexp(e,t){function getReplacement(e,n){if(typeof t==="string"){return t.replace(/\$(\$|&|\d+)/g,((t,n)=>{if(n==="$")return"$";if(n==="&")return e[0];const r=+n;if(r<e.length)return e[+n];return`$${n}`}))}else{return t(...e,e.index,n,e.groups)}}function matchAll(e,t){let n;const r=[];while(n=e.exec(t)){r.push(n)}return r}if(e.global){const t=matchAll(e,this.original);t.forEach((e=>{if(e.index!=null)this.overwrite(e.index,e.index+e[0].length,getReplacement(e,this.original))}))}else{const t=this.original.match(e);if(t&&t.index!=null)this.overwrite(t.index,t.index+t[0].length,getReplacement(t,this.original))}return this}_replaceString(e,t){const{original:n}=this;const r=n.indexOf(e);if(r!==-1){this.overwrite(r,r+e.length,t)}return this}replace(e,t){if(typeof e==="string"){return this._replaceString(e,t)}return this._replaceRegexp(e,t)}_replaceAllString(e,t){const{original:n}=this;const r=e.length;for(let i=n.indexOf(e);i!==-1;i=n.indexOf(e,i+r)){this.overwrite(i,i+r,t)}return this}replaceAll(e,t){if(typeof e==="string"){return this._replaceAllString(e,t)}if(!e.global){throw new TypeError("MagicString.prototype.replaceAll called with a non-global RegExp argument")}return this._replaceRegexp(e,t)}}const a=Object.prototype.hasOwnProperty;class Bundle{constructor(e={}){this.intro=e.intro||"";this.separator=e.separator!==undefined?e.separator:"\n";this.sources=[];this.uniqueSources=[];this.uniqueSourceIndexByFilename={}}addSource(e){if(e instanceof MagicString){return this.addSource({content:e,filename:e.filename,separator:this.separator})}if(!isObject(e)||!e.content){throw new Error("bundle.addSource() takes an object with a `content` property, which should be an instance of MagicString, and an optional `filename`")}["filename","indentExclusionRanges","separator"].forEach((t=>{if(!a.call(e,t))e[t]=e.content[t]}));if(e.separator===undefined){e.separator=this.separator}if(e.filename){if(!a.call(this.uniqueSourceIndexByFilename,e.filename)){this.uniqueSourceIndexByFilename[e.filename]=this.uniqueSources.length;this.uniqueSources.push({filename:e.filename,content:e.content.original})}else{const t=this.uniqueSources[this.uniqueSourceIndexByFilename[e.filename]];if(e.content.original!==t.content){throw new Error(`Illegal source: same filename (${e.filename}), different contents`)}}}this.sources.push(e);return this}append(e,t){this.addSource({content:new MagicString(e),separator:t&&t.separator||""});return this}clone(){const e=new Bundle({intro:this.intro,separator:this.separator});this.sources.forEach((t=>{e.addSource({filename:t.filename,content:t.content.clone(),separator:t.separator})}));return e}generateDecodedMap(e={}){const t=[];this.sources.forEach((e=>{Object.keys(e.content.storedNames).forEach((e=>{if(!~t.indexOf(e))t.push(e)}))}));const n=new Mappings(e.hires);if(this.intro){n.advance(this.intro)}this.sources.forEach(((e,r)=>{if(r>0){n.advance(this.separator)}const i=e.filename?this.uniqueSourceIndexByFilename[e.filename]:-1;const s=e.content;const o=getLocator(s.original);if(s.intro){n.advance(s.intro)}s.firstChunk.eachNext((r=>{const l=o(r.start);if(r.intro.length)n.advance(r.intro);if(e.filename){if(r.edited){n.addEdit(i,r.content,l,r.storeName?t.indexOf(r.original):-1)}else{n.addUneditedChunk(i,r,s.original,l,s.sourcemapLocations)}}else{n.advance(r.content)}if(r.outro.length)n.advance(r.outro)}));if(s.outro){n.advance(s.outro)}}));return{file:e.file?e.file.split(/[/\\]/).pop():null,sources:this.uniqueSources.map((t=>e.file?getRelativePath(e.file,t.filename):t.filename)),sourcesContent:this.uniqueSources.map((t=>e.includeContent?t.content:null)),names:t,mappings:n.raw}}generateMap(e){return new SourceMap(this.generateDecodedMap(e))}getIndentString(){const e={};this.sources.forEach((t=>{const n=t.content._getRawIndentString();if(n===null)return;if(!e[n])e[n]=0;e[n]+=1}));return Object.keys(e).sort(((t,n)=>e[t]-e[n]))[0]||"\t"}indent(e){if(!arguments.length){e=this.getIndentString()}if(e==="")return this;let t=!this.intro||this.intro.slice(-1)==="\n";this.sources.forEach(((n,r)=>{const i=n.separator!==undefined?n.separator:this.separator;const s=t||r>0&&/\r?\n$/.test(i);n.content.indent(e,{exclude:n.indentExclusionRanges,indentStart:s});t=n.content.lastChar()==="\n"}));if(this.intro){this.intro=e+this.intro.replace(/^[^\n]/gm,((t,n)=>n>0?e+t:t))}return this}prepend(e){this.intro=e+this.intro;return this}toString(){const e=this.sources.map(((e,t)=>{const n=e.separator!==undefined?e.separator:this.separator;const r=(t>0?n:"")+e.content.toString();return r})).join("");return this.intro+e}isEmpty(){if(this.intro.length&&this.intro.trim())return false;if(this.sources.some((e=>!e.content.isEmpty())))return false;return true}length(){return this.sources.reduce(((e,t)=>e+t.content.length()),this.intro.length)}trimLines(){return this.trim("[\\r\\n]")}trim(e){return this.trimStart(e).trimEnd(e)}trimStart(e){const t=new RegExp("^"+(e||"\\s")+"+");this.intro=this.intro.replace(t,"");if(!this.intro){let t;let n=0;do{t=this.sources[n++];if(!t){break}}while(!t.content.trimStartAborted(e))}return this}trimEnd(e){const t=new RegExp((e||"\\s")+"+$");let n;let r=this.sources.length-1;do{n=this.sources[r--];if(!n){this.intro=this.intro.replace(t,"");break}}while(!n.content.trimEndAborted(e));return this}}MagicString.Bundle=Bundle;MagicString.SourceMap=SourceMap;MagicString.default=MagicString;e.exports=MagicString},5:function(e){"use strict";e.exports=require("crypto")},33:function(e){"use strict";e.exports=require("module")},411:function(e){"use strict";e.exports=require("path")},41:function(e){"use strict";e.exports=require("url")},224:function(e){"use strict";e.exports=require("tty")},310:function(e){"use strict";e.exports=require("url")},203:function(e){"use strict";e.exports=require("vite")},670:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:true});const r=n(411);const i=n(5);const s=n(33);const o=n(41);const l=n(203);const a=n(712);const u=n(224);var c={exports:{}};let h=u;let d=!("NO_COLOR"in process.env||process.argv.includes("--no-color"))&&("FORCE_COLOR"in process.env||process.argv.includes("--color")||process.platform==="win32"||h.isatty(1)&&process.env.TERM!=="dumb"||"CI"in process.env);let formatter=(e,t,n=e)=>r=>{let i=""+r;let s=i.indexOf(t,e.length);return~s?e+replaceClose(i,t,n,s)+t:e+i+t};let replaceClose=(e,t,n,r)=>{let i=e.substring(0,r)+n;let s=e.substring(r+t.length);let o=s.indexOf(t);return~o?i+replaceClose(s,t,n,o):i+s};let createColors=(e=d)=>({isColorSupported:e,reset:e?e=>`[0m${e}[0m`:String,bold:e?formatter("[1m","[22m","[22m[1m"):String,dim:e?formatter("[2m","[22m","[22m[2m"):String,italic:e?formatter("[3m","[23m"):String,underline:e?formatter("[4m","[24m"):String,inverse:e?formatter("[7m","[27m"):String,hidden:e?formatter("[8m","[28m"):String,strikethrough:e?formatter("[9m","[29m"):String,black:e?formatter("[30m","[39m"):String,red:e?formatter("[31m","[39m"):String,green:e?formatter("[32m","[39m"):String,yellow:e?formatter("[33m","[39m"):String,blue:e?formatter("[34m","[39m"):String,magenta:e?formatter("[35m","[39m"):String,cyan:e?formatter("[36m","[39m"):String,white:e?formatter("[37m","[39m"):String,gray:e?formatter("[90m","[39m"):String,bgBlack:e?formatter("[40m","[49m"):String,bgRed:e?formatter("[41m","[49m"):String,bgGreen:e?formatter("[42m","[49m"):String,bgYellow:e?formatter("[43m","[49m"):String,bgBlue:e?formatter("[44m","[49m"):String,bgMagenta:e?formatter("[45m","[49m"):String,bgCyan:e?formatter("[46m","[49m"):String,bgWhite:e?formatter("[47m","[49m"):String});c.exports=createColors();c.exports.createColors=createColors;let f;async function loadBabel(){if(!f){f=await n.e(346).then(n.t.bind(n,346,23))}return f}function toOutputFilePathInHtml(e,t,n,r,i,s){const{renderBuiltUrl:o}=i.experimental;let l=i.base===""||i.base==="./";if(o){const s=o(e,{hostId:n,hostType:r,type:t,ssr:!!i.build.ssr});if(typeof s==="object"){if(s.runtime){throw new Error(`{ runtime: "${s.runtime}" } is not supported for assets in ${r} files: ${e}`)}if(typeof s.relative==="boolean"){l=s.relative}}else if(s){return s}}if(l&&!i.build.ssr){return s(e,n)}else{return i.base+e}}function getBaseInHTML(e,t){return t.base==="./"||t.base===""?r.posix.join(r.posix.relative(e,"").slice(0,-2),"./"):t.base}function toAssetPathFromHtml(e,t,n){const i=l.normalizePath(r.relative(n.root,t));const toRelative=(e,t)=>getBaseInHTML(i,n)+e;return toOutputFilePathInHtml(e,"asset",t,"html",n,toRelative)}const p=`!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",(function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()}),!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();`;const g="vite-legacy-polyfill";const m="vite-legacy-entry";const y=`System.import(document.getElementById('${m}').getAttribute('data-src'))`;const b="__vite_is_modern_browser";const w=`try{import.meta.url;import("_").catch(()=>1);}catch(e){}window.${b}=true;`;const _=`!function(){if(window.${b})return;console.warn("vite: loading legacy build because dynamic import or import.meta.url is unsupported, syntax error above should be ignored");var e=document.getElementById("${g}"),n=document.createElement("script");n.src=e.src,n.onload=function(){${y}},document.body.appendChild(n)}();`;const v=`export function __vite_legacy_guard(){import('data:text/javascript,')};`;const S=`__VITE_IS_LEGACY__`;const x=s.createRequire(typeof document==="undefined"?new(n(310).URL)("file:"+__filename).href:document.currentScript&&document.currentScript.src||new URL("index.cjs",document.baseURI).href);function viteLegacyPlugin(e={}){let t;const n=e.targets||"defaults";const i=e.renderLegacyChunks!==false;const s=i;const o=(process.env.DEBUG||"").split(",");const l=o.includes("vite:*")||o.includes("vite:legacy");const u=new Map;const h=new Map;const d=new Map;const f=new Set;const b=new Set;if(Array.isArray(e.modernPolyfills)){e.modernPolyfills.forEach((e=>{f.add(e.includes("/")?`core-js/${e}`:`core-js/modules/${e}.js`)}))}if(Array.isArray(e.polyfills)){e.polyfills.forEach((e=>{if(e.startsWith(`regenerator`)){b.add(`regenerator-runtime/runtime.js`)}else{b.add(e.includes("/")?`core-js/${e}`:`core-js/modules/${e}.js`)}}))}if(Array.isArray(e.additionalLegacyPolyfills)){e.additionalLegacyPolyfills.forEach((e=>{b.add(e)}))}let x=false;const C={name:"vite:legacy-config",config(e,t){if(t.command==="build"){if(!e.build){e.build={}}if(!e.build.cssTarget){e.build.cssTarget="chrome61"}if(i){x=e.build.target!==void 0;e.build.target=["es2020","edge79","firefox67","chrome64","safari11.1"]}}return{define:{"import.meta.env.LEGACY":t.command==="serve"||e.build?.ssr?false:S}}},configResolved(e){if(x){e.logger.warn(c.exports.yellow(`plugin-legacy overrode 'build.target'. You should pass 'targets' as an option to this plugin with the list of legacy browsers to support instead.`))}}};const E={name:"vite:legacy-generate-polyfill-chunk",apply:"build",async generateBundle(r,o){if(t.build.ssr){return}if(!isLegacyBundle(o,r)){if(!f.size){return}l&&console.log(`[@vitejs/plugin-legacy] modern polyfills:`,f);await buildPolyfillChunk(t.mode,f,o,d,t.build,"es",r,true);return}if(!i){return}if(b.size||s){await (()=>{})(`Promise.resolve(); Promise.all();`,n,b);l&&console.log(`[@vitejs/plugin-legacy] legacy polyfills:`,b);await buildPolyfillChunk(t.mode,b,o,h,t.build,"iife",r,e.externalSystemJS)}}};const k={name:"vite:legacy-post-process",enforce:"post",apply:"build",configResolved(e){if(e.build.lib){throw new Error("@vitejs/plugin-legacy does not support library mode.")}t=e;if(!i||t.build.ssr){return}const getLegacyOutputFileName=(e,n="[name]-legacy-[hash].js")=>{if(!e){return r.posix.join(t.build.assetsDir,n)}return t=>{let n=typeof e==="function"?e(t):e;if(n.includes("[name]")){n=n.replace("[name]","[name]-legacy")}else{n=n.replace(/(.+)\.(.+)/,"$1-legacy.$2")}return n}};const createLegacyOutput=(e={})=>({...e,format:"system",entryFileNames:getLegacyOutputFileName(e.entryFileNames),chunkFileNames:getLegacyOutputFileName(e.chunkFileNames)});const{rollupOptions:n}=t.build;const{output:s}=n;if(Array.isArray(s)){n.output=[...s.map(createLegacyOutput),...s]}else{n.output=[createLegacyOutput(s),s||{}]}},async renderChunk(r,o,l){if(t.build.ssr){return null}if(!isLegacyChunk(o,l)){if(e.modernPolyfills&&!Array.isArray(e.modernPolyfills)){await detectPolyfills(r,{esmodules:true},f)}const n=new a(r);if(s&&o.isEntry){n.prepend(v)}if(r.includes(S)){const e=new RegExp(S,"g");let t;while(t=e.exec(r)){n.overwrite(t.index,t.index+S.length,`false`)}}if(t.build.sourcemap){return{code:n.toString(),map:n.generateMap({hires:true})}}return{code:n.toString()}}if(!i){return null}l.__vite_skip_esbuild__=true;l.__vite_force_terser__=true;l.__vite_skip_asset_emit__=true;const u=e.polyfills!==false&&!Array.isArray(e.polyfills);const c=!!t.build.sourcemap;const h=await loadBabel();const{code:d,map:p}=h.transform(r,{babelrc:false,configFile:false,compact:!!t.build.minify,sourceMaps:c,inputSourceMap:void 0,presets:[[()=>({plugins:[recordAndRemovePolyfillBabelPlugin(b),replaceLegacyEnvBabelPlugin(),wrapIIFEBabelPlugin()]})],["env",createBabelPresetEnvOptions(n,{needPolyfills:u,ignoreBrowserslistConfig:e.ignoreBrowserslistConfig})]]});if(d)return{code:d,map:p};return null},transformIndexHtml(e,{chunk:n}){if(t.build.ssr)return;if(!n)return;if(n.fileName.includes("-legacy")){u.set(n.facadeModuleId,n.fileName);return}const r=[];const o=n.facadeModuleId?.replace(/\?.*$/,"");const l=d.get(n.facadeModuleId);if(l){r.push({tag:"script",attrs:{type:"module",crossorigin:true,src:toAssetPathFromHtml(l,n.facadeModuleId,t)}})}else if(f.size){throw new Error(`No corresponding modern polyfill chunk found for ${o}`)}if(!i){return{html:e,tags:r}}r.push({tag:"script",attrs:{nomodule:true},children:p,injectTo:"body"});const a=h.get(n.facadeModuleId);if(a){r.push({tag:"script",attrs:{nomodule:true,crossorigin:true,id:g,src:toAssetPathFromHtml(a,n.facadeModuleId,t)},injectTo:"body"})}else if(b.size){throw new Error(`No corresponding legacy polyfill chunk found for ${o}`)}const c=u.get(n.facadeModuleId);if(c){r.push({tag:"script",attrs:{nomodule:true,crossorigin:true,id:m,"data-src":toAssetPathFromHtml(c,n.facadeModuleId,t)},children:y,injectTo:"body"})}else{throw new Error(`No corresponding legacy entry chunk found for ${o}`)}if(s&&a&&c){r.push({tag:"script",attrs:{type:"module"},children:w,injectTo:"head"});r.push({tag:"script",attrs:{type:"module"},children:_,injectTo:"head"})}return{html:e,tags:r}},generateBundle(e,n){if(t.build.ssr){return}if(isLegacyBundle(n,e)){for(const e in n){if(n[e].type==="asset"){delete n[e]}}}}};return[C,E,k]}async function detectPolyfills(e,t,n){const r=await loadBabel();const{ast:i}=r.transform(e,{ast:true,babelrc:false,configFile:false,presets:[["env",createBabelPresetEnvOptions(t,{ignoreBrowserslistConfig:true})]]});for(const e of i.program.body){if(e.type==="ImportDeclaration"){const t=e.source.value;if(t.startsWith("core-js/")||t.startsWith("regenerator-runtime/")){n.add(t)}}}}function createBabelPresetEnvOptions(e,{needPolyfills:t=true,ignoreBrowserslistConfig:n}){return{targets:e,bugfixes:true,loose:false,modules:false,useBuiltIns:t?"usage":false,corejs:t?{version:x("core-js/package.json").version,proposals:false}:void 0,shippedProposals:true,ignoreBrowserslistConfig:n}}async function buildPolyfillChunk(e,t,i,s,a,u,c,h){let{minify:d,assetsDir:f}=a;d=d?"terser":false;const p=await l.build({mode:e,root:r.dirname(o.fileURLToPath(typeof document==="undefined"?new(n(310).URL)("file:"+__filename).href:document.currentScript&&document.currentScript.src||new URL("index.cjs",document.baseURI).href)),configFile:false,logLevel:"error",plugins:[polyfillsPlugin(t,h)],build:{write:false,minify:d,assetsDir:f,rollupOptions:{input:{polyfills:C},output:{format:u,entryFileNames:c.entryFileNames}}},esbuild:false,optimizeDeps:{esbuildOptions:{target:"es5"}}});const g=Array.isArray(p)?p[0]:p;if(!("output"in g))return;const m=g.output[0];for(const e in i){const t=i[e];if(t.type==="chunk"&&t.facadeModuleId){s.set(t.facadeModuleId,m.fileName)}}i[m.fileName]=m}const C="\0vite/legacy-polyfills";function polyfillsPlugin(e,t){return{name:"vite:legacy-polyfills",resolveId(e){if(e===C){return e}},load(n){if(n===C){return[...e].map((e=>`import ${JSON.stringify(e)};`)).join("")+(t?"":`import "systemjs/dist/s.min.js";`)}}}}function isLegacyChunk(e,t){return t.format==="system"&&e.fileName.includes("-legacy")}function isLegacyBundle(e,t){if(t.format==="system"){const t=Object.values(e).find((e=>e.type==="chunk"&&e.isEntry));return!!t&&t.fileName.includes("-legacy")}return false}function recordAndRemovePolyfillBabelPlugin(e){return({types:t})=>({name:"vite-remove-polyfill-import",post({path:n}){n.get("body").forEach((n=>{if(t.isImportDeclaration(n.node)){e.add(n.node.source.value);n.remove()}}))}})}function replaceLegacyEnvBabelPlugin(){return({types:e})=>({name:"vite-replace-env-legacy",visitor:{Identifier(t){if(t.node.name===S){t.replaceWith(e.booleanLiteral(true))}}}})}function wrapIIFEBabelPlugin(){return({types:e,template:t})=>{const n=t(";(function(){%%body%%})();");return{name:"vite-wrap-iife",post({path:t}){if(!this.isWrapped){this.isWrapped=true;t.replaceWith(e.program(n({body:t.node.body})))}}}}}const E=[p,y,w,_].map((e=>i.createHash("sha256").update(e).digest("base64")));e.exports=viteLegacyPlugin;e.exports.cspHashes=E;e.exports["default"]=viteLegacyPlugin;e.exports.detectPolyfills=detectPolyfills}};var t={};function __nccwpck_require__(n){var r=t[n];if(r!==undefined){return r.exports}var i=t[n]={exports:{}};var s=true;try{e[n].call(i.exports,i,i.exports,__nccwpck_require__);s=false}finally{if(s)delete t[n]}return i.exports}__nccwpck_require__.m=e;!function(){var e=Object.getPrototypeOf?function(e){return Object.getPrototypeOf(e)}:function(e){return e.__proto__};var t;__nccwpck_require__.t=function(n,r){if(r&1)n=this(n);if(r&8)return n;if(typeof n==="object"&&n){if(r&4&&n.__esModule)return n;if(r&16&&typeof n.then==="function")return n}var i=Object.create(null);__nccwpck_require__.r(i);var s={};t=t||[null,e({}),e([]),e(e)];for(var o=r&2&&n;typeof o=="object"&&!~t.indexOf(o);o=e(o)){Object.getOwnPropertyNames(o).forEach((function(e){s[e]=function(){return n[e]}}))}s["default"]=function(){return n};__nccwpck_require__.d(i,s);return i}}();!function(){__nccwpck_require__.d=function(e,t){for(var n in t){if(__nccwpck_require__.o(t,n)&&!__nccwpck_require__.o(e,n)){Object.defineProperty(e,n,{enumerable:true,get:t[n]})}}}}();!function(){__nccwpck_require__.f={};__nccwpck_require__.e=function(e){return Promise.all(Object.keys(__nccwpck_require__.f).reduce((function(t,n){__nccwpck_require__.f[n](e,t);return t}),[]))}}();!function(){__nccwpck_require__.u=function(e){return""+e+".index.cjs.js"}}();!function(){__nccwpck_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}();!function(){__nccwpck_require__.r=function(e){if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(e,"__esModule",{value:true})}}();if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";!function(){var e={179:1};var installChunk=function(t){var n=t.modules,r=t.ids,i=t.runtime;for(var s in n){if(__nccwpck_require__.o(n,s)){__nccwpck_require__.m[s]=n[s]}}if(i)i(__nccwpck_require__);for(var o=0;o<r.length;o++)e[r[o]]=1};__nccwpck_require__.f.require=function(t,n){if(!e[t]){if(true){installChunk(require("./"+__nccwpck_require__.u(t)))}else e[t]=1}}}();var n=__nccwpck_require__(670);module.exports=n})();