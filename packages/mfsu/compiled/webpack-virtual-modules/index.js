(function(){"use strict";var e={984:function(e,t,i){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};const a=r(i(17));const s=i(584);let n=45e6;function checkActivation(e){if(!e._compiler){throw new Error("You must use this plugin only after creating webpack instance!")}}function getModulePath(e,t){return a.default.isAbsolute(e)?e:a.default.join(t.context,e)}function createWebpackData(e){return t=>{if(t._data){const i=t._currentLevel;const r=t._levels[i];return{result:e,level:r}}return[null,e]}}function getData(e,t){if(e._data instanceof Map){return e._data.get(t)}else if(e._data){return e.data[t]}else if(e.data instanceof Map){return e.data.get(t)}else{return e.data[t]}}function setData(e,t,i){const r=i(e);if(e._data instanceof Map){e._data.set(t,r)}else if(e._data){e.data[t]=r}else if(e.data instanceof Map){e.data.set(t,r)}else{e.data[t]=r}}function getStatStorage(e){if(e._statStorage){return e._statStorage}else if(e._statBackend){return e._statBackend}else{throw new Error("Couldn't find a stat storage")}}function getFileStorage(e){if(e._readFileStorage){return e._readFileStorage}else if(e._readFileBackend){return e._readFileBackend}else{throw new Error("Couldn't find a readFileStorage")}}function getReadDirBackend(e){if(e._readdirBackend){return e._readdirBackend}else if(e._readdirStorage){return e._readdirStorage}else{throw new Error("Couldn't find a readDirStorage from Webpack Internals")}}class VirtualModulesPlugin{constructor(e){this._compiler=null;this._watcher=null;this._staticModules=e||null}writeModule(e,t){if(!this._compiler){throw new Error(`Plugin has not been initialized`)}checkActivation(this);const i=t?t.length:0;const r=Date.now();const a=new Date(r);const o=new s.VirtualStats({dev:8675309,nlink:0,uid:1e3,gid:1e3,rdev:0,blksize:4096,ino:n++,mode:33188,size:i,blocks:Math.floor(i/4096),atime:a,mtime:a,ctime:a,birthtime:a});const l=getModulePath(e,this._compiler);if(process.env.WVM_DEBUG)console.log(this._compiler.name,"Write virtual module:",l,t);let c=this._watcher&&this._watcher.watchFileSystem;while(c&&c.wfs){c=c.wfs}let u=this._compiler.inputFileSystem;while(u&&u._inputFileSystem){u=u._inputFileSystem}u._writeVirtualFile(l,o,t);if(c&&(c.watcher.fileWatchers.size||c.watcher.fileWatchers.length)){const e=c.watcher.fileWatchers instanceof Map?Array.from(c.watcher.fileWatchers.values()):c.watcher.fileWatchers;for(let t of e){if("watcher"in t){t=t.watcher}if(t.path===l){if(process.env.DEBUG)console.log(this._compiler.name,"Emit file change:",l,r);delete t.directoryWatcher._cachedTimeInfoEntries;t.emit("change",r,null)}}}}apply(e){this._compiler=e;const afterEnvironmentHook=()=>{let t=e.inputFileSystem;while(t&&t._inputFileSystem){t=t._inputFileSystem}if(!t._writeVirtualFile){const e=t.purge;t.purge=()=>{e.apply(t,[]);if(t._virtualFiles){Object.keys(t._virtualFiles).forEach((e=>{const i=t._virtualFiles[e];t._writeVirtualFile(e,i.stats,i.contents)}))}};t._writeVirtualFile=(e,i,r)=>{const o=getStatStorage(t);const l=getFileStorage(t);const c=getReadDirBackend(t);t._virtualFiles=t._virtualFiles||{};t._virtualFiles[e]={stats:i,contents:r};setData(o,e,createWebpackData(i));setData(l,e,createWebpackData(r));const u=e.split(/[\\/]/);let d=u.length-1;const f=u[0]?1:0;while(d>f){const e=u.slice(0,d).join(a.default.sep)||a.default.sep;try{t.readdirSync(e)}catch(t){const r=Date.now();const a=new s.VirtualStats({dev:8675309,nlink:0,uid:1e3,gid:1e3,rdev:0,blksize:4096,ino:n++,mode:16877,size:i.size,blocks:Math.floor(i.size/4096),atime:r,mtime:r,ctime:r,birthtime:r});setData(c,e,createWebpackData([]));setData(o,e,createWebpackData(a))}let r=getData(getReadDirBackend(t),e);r=r[1]||r.result;const l=u[d];if(r.indexOf(l)<0){const i=r.concat([l]).sort();setData(getReadDirBackend(t),e,createWebpackData(i))}else{break}d--}}}};const afterResolversHook=()=>{if(this._staticModules){for(const[e,t]of Object.entries(this._staticModules)){this.writeModule(e,t)}this._staticModules=null}};const t=typeof e.webpack==="undefined"?4:5;const watchRunHook=(i,r)=>{this._watcher=i.compiler||i;const a=e.inputFileSystem._virtualFiles;const s=e.fileTimestamps;if(a&&s&&typeof s.set==="function"){Object.keys(a).forEach((e=>{const i=+a[e].stats.mtime;s.set(e,t===4?i:{safeTime:i,timestamp:i})}))}r()};if(e.hooks){e.hooks.afterEnvironment.tap("VirtualModulesPlugin",afterEnvironmentHook);e.hooks.afterResolvers.tap("VirtualModulesPlugin",afterResolversHook);e.hooks.watchRun.tapAsync("VirtualModulesPlugin",watchRunHook)}else{e.plugin("after-environment",afterEnvironmentHook);e.plugin("after-resolvers",afterResolversHook);e.plugin("watch-run",watchRunHook)}}}e.exports=VirtualModulesPlugin},584:function(e,t,i){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:true});t.VirtualStats=void 0;const a=r(i(57));class VirtualStats{constructor(e){for(const t in e){if(!Object.prototype.hasOwnProperty.call(e,t)){continue}this[t]=e[t]}}_checkModeProperty(e){return(this.mode&a.default.S_IFMT)===e}isDirectory(){return this._checkModeProperty(a.default.S_IFDIR)}isFile(){return this._checkModeProperty(a.default.S_IFREG)}isBlockDevice(){return this._checkModeProperty(a.default.S_IFBLK)}isCharacterDevice(){return this._checkModeProperty(a.default.S_IFCHR)}isSymbolicLink(){return this._checkModeProperty(a.default.S_IFLNK)}isFIFO(){return this._checkModeProperty(a.default.S_IFIFO)}isSocket(){return this._checkModeProperty(a.default.S_IFSOCK)}}t.VirtualStats=VirtualStats},57:function(e){e.exports=require("constants")},17:function(e){e.exports=require("path")}};var t={};function __nccwpck_require__(i){var r=t[i];if(r!==undefined){return r.exports}var a=t[i]={exports:{}};var s=true;try{e[i].call(a.exports,a,a.exports,__nccwpck_require__);s=false}finally{if(s)delete t[i]}return a.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var i=__nccwpck_require__(984);module.exports=i})();