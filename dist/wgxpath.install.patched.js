(function(){var h=this;
function aa(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
b&&"undefined"==typeof a.call)return"object";return b}function k(a){return"string"==typeof a}function ba(a,b,c){return a.call.apply(a.bind,arguments)}function ca(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function da(a,b,c){da=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ba:ca;return da.apply(null,arguments)}function ea(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}}function l(a){var b=m;function c(){}c.prototype=b.prototype;a.t=b.prototype;a.prototype=new c};function n(a,b,c){this.a=a;this.b=b||1;this.d=c||1};var r,fa,ga,ha;function ia(){return h.navigator?h.navigator.userAgent:null}ha=ga=fa=r=!1;var s;if(s=ia()){var ja=h.navigator;r=0==s.lastIndexOf("Opera",0);fa=!r&&(-1!=s.indexOf("MSIE")||-1!=s.indexOf("Trident"));ga=!r&&-1!=s.indexOf("WebKit");ha=!r&&!ga&&!fa&&"Gecko"==ja.product}var t=fa,ka=ha,la=ga;function ma(){var a=h.document;return a?a.documentMode:void 0}var na;
a:{var oa="",u;if(r&&h.opera)var pa=h.opera.version,oa="function"==typeof pa?pa():pa;else if(ka?u=/rv\:([^\);]+)(\)|;)/:t?u=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:la&&(u=/WebKit\/(\S+)/),u)var qa=u.exec(ia()),oa=qa?qa[1]:"";if(t){var ra=ma();if(ra>parseFloat(oa)){na=String(ra);break a}}na=oa}var sa={};
function ta(a){if(!sa[a]){for(var b=0,c=String(na).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),d=String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var g=c[f]||"",p=d[f]||"",q=RegExp("(\\d*)(\\D*)","g"),x=RegExp("(\\d*)(\\D*)","g");do{var v=q.exec(g)||["","",""],J=x.exec(p)||["","",""];if(0==v[0].length&&0==J[0].length)break;b=((0==v[1].length?0:parseInt(v[1],10))<(0==J[1].length?0:parseInt(J[1],10))?-1:(0==v[1].length?0:parseInt(v[1],10))>
(0==J[1].length?0:parseInt(J[1],10))?1:0)||((0==v[2].length)<(0==J[2].length)?-1:(0==v[2].length)>(0==J[2].length)?1:0)||(v[2]<J[2]?-1:v[2]>J[2]?1:0)}while(0==b)}sa[a]=0<=b}}var ua=h.document,va=ua&&t?ma()||("CSS1Compat"==ua.compatMode?parseInt(na,10):5):void 0;var w=t&&!(t&&9<=va),wa=t&&!(t&&8<=va);function y(a,b,c,d){this.a=a;this.nodeName=c;this.nodeValue=d;this.nodeType=2;this.parentNode=this.ownerElement=b}function xa(a,b){var c=wa&&"href"==b.nodeName?a.getAttribute(b.nodeName,2):b.nodeValue;return new y(b,a,b.nodeName,c)};function ya(a){this.b=a;this.a=0}function za(a){a=a.match(Aa);for(var b=0;b<a.length;b++)Ba.test(a[b])&&a.splice(b,1);return new ya(a)}var Aa=RegExp("\\$?(?:(?![0-9-])[\\w-]+:)?(?![0-9-])[\\w-]+|\\/\\/|\\.\\.|::|\\d+(?:\\.\\d*)?|\\.\\d+|\"[^\"]*\"|'[^']*'|[!<>]=|\\s+|.","g"),Ba=/^\s/;function z(a,b){return a.b[a.a+(b||0)]}function A(a){return a.b[a.a++]};var B=Array.prototype,Ca=B.indexOf?function(a,b,c){return B.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(k(a))return k(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},C=B.forEach?function(a,b,c){B.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=k(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},Da=B.filter?function(a,b,c){return B.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=k(a)?
a.split(""):a,p=0;p<d;p++)if(p in g){var q=g[p];b.call(c,q,p,a)&&(e[f++]=q)}return e},D=B.reduce?function(a,b,c,d){d&&(b=da(b,d));return B.reduce.call(a,b,c)}:function(a,b,c,d){var e=c;C(a,function(c,g){e=b.call(d,e,c,g,a)});return e},Ea=B.some?function(a,b,c){return B.some.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=k(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return!0;return!1};
function Fa(a,b){var c;a:{c=a.length;for(var d=k(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){c=e;break a}c=-1}return 0>c?null:k(a)?a.charAt(c):a[c]}function Ga(a){return B.concat.apply(B,arguments)}function Ha(a,b,c){return 2>=arguments.length?B.slice.call(a,b):B.slice.call(a,b,c)};!ka&&!t||t&&t&&9<=va||ka&&ta("1.9.1");t&&ta("9");function Ia(a,b){if(a.contains&&1==b.nodeType)return a==b||a.contains(b);if("undefined"!=typeof a.compareDocumentPosition)return a==b||Boolean(a.compareDocumentPosition(b)&16);for(;b&&a!=b;)b=b.parentNode;return b==a}
function Ja(a,b){if(a==b)return 0;if(a.compareDocumentPosition)return a.compareDocumentPosition(b)&2?1:-1;if(t&&!(t&&9<=va)){if(9==a.nodeType)return-1;if(9==b.nodeType)return 1}if("sourceIndex"in a||a.parentNode&&"sourceIndex"in a.parentNode){var c=1==a.nodeType,d=1==b.nodeType;if(c&&d)return a.sourceIndex-b.sourceIndex;var e=a.parentNode,f=b.parentNode;return e==f?Ka(a,b):!c&&Ia(e,b)?-1*La(a,b):!d&&Ia(f,a)?La(b,a):(c?a.sourceIndex:e.sourceIndex)-(d?b.sourceIndex:f.sourceIndex)}d=9==a.nodeType?a:
a.ownerDocument||a.document;c=d.createRange();c.selectNode(a);c.collapse(!0);d=d.createRange();d.selectNode(b);d.collapse(!0);return c.compareBoundaryPoints(h.Range.START_TO_END,d)}function La(a,b){var c=a.parentNode;if(c==b)return-1;for(var d=b;d.parentNode!=c;)d=d.parentNode;return Ka(d,a)}function Ka(a,b){for(var c=b;c=c.previousSibling;)if(c==a)return-1;return 1};function E(a){var b=null,c=a.nodeType;1==c&&(b=a.textContent,b=void 0==b||null==b?a.innerText:b,b=void 0==b||null==b?"":b);if("string"!=typeof b)if(w&&"title"==a.nodeName.toLowerCase()&&1==c)b=a.text;else if(9==c||1==c){a=9==c?a.documentElement:a.firstChild;for(var c=0,d=[],b="";a;){do 1!=a.nodeType&&(b+=a.nodeValue),w&&"title"==a.nodeName.toLowerCase()&&(b+=a.text),d[c++]=a;while(a=a.firstChild);for(;c&&!(a=d[--c].nextSibling););}}else b=a.nodeValue;return""+b}
function F(a,b,c){if(null===b)return!0;try{if(!a.getAttribute)return!1}catch(d){return!1}wa&&"class"==b&&(b="className");return null==c?!!a.getAttribute(b):a.getAttribute(b,2)==c}function G(a,b,c,d,e){return(w?Ma:Na).call(null,a,b,k(c)?c:null,k(d)?d:null,e||new H)}
function Ma(a,b,c,d,e){if(a instanceof I||8==a.b||c&&null===a.b){var f=b.all;if(!f)return e;a=Oa(a);if("*"!=a&&(f=b.getElementsByTagName(a),!f))return e;if(c){for(var g=[],p=0;b=f[p++];)F(b,c,d)&&g.push(b);f=g}for(p=0;b=f[p++];)"*"==a&&"!"==b.tagName||K(e,b);return e}Pa(a,b,c,d,e);return e}
function Na(a,b,c,d,e){b.getElementsByName&&d&&"name"==c&&!t?(b=b.getElementsByName(d),C(b,function(b){a.a(b)&&K(e,b)})):b.getElementsByClassName&&d&&"class"==c?(b=b.getElementsByClassName(d),C(b,function(b){b.className==d&&a.a(b)&&K(e,b)})):a instanceof L?Pa(a,b,c,d,e):b.getElementsByTagName&&(b=b.getElementsByTagName(a.d()),C(b,function(a){F(a,c,d)&&K(e,a)}));return e}
function Qa(a,b,c,d,e){var f;if((a instanceof I||8==a.b||c&&null===a.b)&&(f=b.childNodes)){var g=Oa(a);if("*"!=g&&(f=Da(f,function(a){return a.tagName&&a.tagName.toLowerCase()==g}),!f))return e;c&&(f=Da(f,function(a){return F(a,c,d)}));C(f,function(a){"*"==g&&("!"==a.tagName||"*"==g&&1!=a.nodeType)||K(e,a)});return e}return Ra(a,b,c,d,e)}function Ra(a,b,c,d,e){for(b=b.firstChild;b;b=b.nextSibling)F(b,c,d)&&a.a(b)&&K(e,b);return e}
function Pa(a,b,c,d,e){for(b=b.firstChild;b;b=b.nextSibling)F(b,c,d)&&a.a(b)&&K(e,b),Pa(a,b,c,d,e)}function Oa(a){if(a instanceof L){if(8==a.b)return"!";if(null===a.b)return"*"}return a.d()};function H(){this.b=this.a=null;this.i=0}function Sa(a){this.b=a;this.a=this.d=null}function Ta(a,b){if(!a.a)return b;if(!b.a)return a;for(var c=a.a,d=b.a,e=null,f=null,g=0;c&&d;)c.b==d.b||c.b instanceof y&&d.b instanceof y&&c.b.a==d.b.a?(f=c,c=c.a,d=d.a):0<Ja(c.b,d.b)?(f=d,d=d.a):(f=c,c=c.a),(f.d=e)?e.a=f:a.a=f,e=f,g++;for(f=c||d;f;)f.d=e,e=e.a=f,g++,f=f.a;a.b=e;a.i=g;return a}function Ua(a,b){var c=new Sa(b);c.a=a.a;a.b?a.a.d=c:a.a=a.b=c;a.a=c;a.i++}
function K(a,b){var c=new Sa(b);c.d=a.b;a.a?a.b.a=c:a.a=a.b=c;a.b=c;a.i++}function Va(a){return(a=a.a)?a.b:null}function Wa(a){return(a=Va(a))?E(a):""}function M(a,b){return new Xa(a,!!b)}function Xa(a,b){this.d=a;this.b=(this.c=b)?a.b:a.a;this.a=null}function N(a){var b=a.b;if(null==b)return null;var c=a.a=b;a.b=a.c?b.d:b.a;return c.b};function m(a){this.g=a;this.b=this.f=!1;this.d=null}function O(a){return"\n  "+a.toString().split("\n").join("\n  ")}function Ya(a,b){a.f=b}function Za(a,b){a.b=b}function P(a,b){var c=a.a(b);return c instanceof H?+Wa(c):+c}function Q(a,b){var c=a.a(b);return c instanceof H?Wa(c):""+c}function R(a,b){var c=a.a(b);return c instanceof H?!!c.i:!!c};function S(a,b,c){m.call(this,a.g);this.c=a;this.e=b;this.k=c;this.f=b.f||c.f;this.b=b.b||c.b;this.c==$a&&(c.b||c.f||4==c.g||0==c.g||!b.d?b.b||b.f||4==b.g||0==b.g||!c.d||(this.d={name:c.d.name,l:b}):this.d={name:b.d.name,l:c})}l(S);
function T(a,b,c,d,e){b=b.a(d);c=c.a(d);var f;if(b instanceof H&&c instanceof H){e=M(b);for(d=N(e);d;d=N(e))for(b=M(c),f=N(b);f;f=N(b))if(a(E(d),E(f)))return!0;return!1}if(b instanceof H||c instanceof H){b instanceof H?e=b:(e=c,c=b);e=M(e);b=typeof c;for(d=N(e);d;d=N(e)){switch(b){case "number":d=+E(d);break;case "boolean":d=!!E(d);break;case "string":d=E(d);break;default:throw Error("Illegal primitive type for comparison.");}if(a(d,c))return!0}return!1}return e?"boolean"==typeof b||"boolean"==typeof c?
a(!!b,!!c):"number"==typeof b||"number"==typeof c?a(+b,+c):a(b,c):a(+b,+c)}S.prototype.a=function(a){return this.c.j(this.e,this.k,a)};S.prototype.toString=function(){var a="Binary Expression: "+this.c,a=a+O(this.e);return a+=O(this.k)};function ab(a,b,c,d){this.a=a;this.p=b;this.g=c;this.j=d}ab.prototype.toString=function(){return this.a};var bb={};function U(a,b,c,d){if(bb.hasOwnProperty(a))throw Error("Binary operator already created: "+a);a=new ab(a,b,c,d);return bb[a.toString()]=a}
U("div",6,1,function(a,b,c){return P(a,c)/P(b,c)});U("mod",6,1,function(a,b,c){return P(a,c)%P(b,c)});U("*",6,1,function(a,b,c){return P(a,c)*P(b,c)});U("+",5,1,function(a,b,c){return P(a,c)+P(b,c)});U("-",5,1,function(a,b,c){return P(a,c)-P(b,c)});U("<",4,2,function(a,b,c){return T(function(a,b){return a<b},a,b,c)});U(">",4,2,function(a,b,c){return T(function(a,b){return a>b},a,b,c)});U("<=",4,2,function(a,b,c){return T(function(a,b){return a<=b},a,b,c)});
U(">=",4,2,function(a,b,c){return T(function(a,b){return a>=b},a,b,c)});var $a=U("=",3,2,function(a,b,c){return T(function(a,b){return a==b},a,b,c,!0)});U("!=",3,2,function(a,b,c){return T(function(a,b){return a!=b},a,b,c,!0)});U("and",2,2,function(a,b,c){return R(a,c)&&R(b,c)});U("or",1,2,function(a,b,c){return R(a,c)||R(b,c)});function cb(a,b){if(b.a.length&&4!=a.g)throw Error("Primary expression must evaluate to nodeset if filter has predicate(s).");m.call(this,a.g);this.c=a;this.e=b;this.f=a.f;this.b=a.b}l(cb);cb.prototype.a=function(a){a=this.c.a(a);return db(this.e,a)};cb.prototype.toString=function(){var a;a="Filter:"+O(this.c);return a+=O(this.e)};function eb(a,b){if(b.length<a.o)throw Error("Function "+a.h+" expects at least"+a.o+" arguments, "+b.length+" given");if(null!==a.n&&b.length>a.n)throw Error("Function "+a.h+" expects at most "+a.n+" arguments, "+b.length+" given");a.s&&C(b,function(b,d){if(4!=b.g)throw Error("Argument "+d+" to function "+a.h+" is not of type Nodeset: "+b);});m.call(this,a.g);this.e=a;this.c=b;Ya(this,a.f||Ea(b,function(a){return a.f}));Za(this,a.r&&!b.length||a.q&&!!b.length||Ea(b,function(a){return a.b}))}l(eb);
eb.prototype.a=function(a){return this.e.j.apply(null,Ga(a,this.c))};eb.prototype.toString=function(){var a="Function: "+this.e;if(this.c.length)var b=D(this.c,function(a,b){return a+O(b)},"Arguments:"),a=a+O(b);return a};function fb(a,b,c,d,e,f,g,p,q){this.h=a;this.g=b;this.f=c;this.r=d;this.q=e;this.j=f;this.o=g;this.n=void 0!==p?p:g;this.s=!!q}fb.prototype.toString=function(){return this.h};var gb={};
function V(a,b,c,d,e,f,g,p){if(gb.hasOwnProperty(a))throw Error("Function already created: "+a+".");gb[a]=new fb(a,b,c,d,!1,e,f,g,p)}V("boolean",2,!1,!1,function(a,b){return R(b,a)},1);V("ceiling",1,!1,!1,function(a,b){return Math.ceil(P(b,a))},1);V("concat",3,!1,!1,function(a,b){var c=Ha(arguments,1);return D(c,function(b,c){return b+Q(c,a)},"")},2,null);V("contains",2,!1,!1,function(a,b,c){b=Q(b,a);a=Q(c,a);return-1!=b.indexOf(a)},2);V("count",1,!1,!1,function(a,b){return b.a(a).i},1,1,!0);
V("false",2,!1,!1,function(){return!1},0);V("floor",1,!1,!1,function(a,b){return Math.floor(P(b,a))},1);V("id",4,!1,!1,function(a,b){function c(a){if(w){var b=e.all[a];if(b){if(b.nodeType&&a==b.id)return b;if(b.length)return Fa(b,function(b){return a==b.id})}return null}return e.getElementById(a)}var d=a.a,e=9==d.nodeType?d:d.ownerDocument,d=Q(b,a).split(/\s+/),f=[];C(d,function(a){a=c(a);!a||0<=Ca(f,a)||f.push(a)});f.sort(Ja);var g=new H;C(f,function(a){K(g,a)});return g},1);
V("lang",2,!1,!1,function(){return!1},1);V("last",1,!0,!1,function(a){if(1!=arguments.length)throw Error("Function last expects ()");return a.d},0);V("local-name",3,!1,!0,function(a,b){var c=b?Va(b.a(a)):a.a;return c?c.nodeName.toLowerCase():""},0,1,!0);V("name",3,!1,!0,function(a,b){var c=b?Va(b.a(a)):a.a;return c?c.nodeName.toLowerCase():""},0,1,!0);V("namespace-uri",3,!0,!1,function(){return""},0,1,!0);
V("normalize-space",3,!1,!0,function(a,b){return(b?Q(b,a):E(a.a)).replace(/[\s\xa0]+/g," ").replace(/^\s+|\s+$/g,"")},0,1);V("not",2,!1,!1,function(a,b){return!R(b,a)},1);V("number",1,!1,!0,function(a,b){return b?P(b,a):+E(a.a)},0,1);V("position",1,!0,!1,function(a){return a.b},0);V("round",1,!1,!1,function(a,b){return Math.round(P(b,a))},1);V("starts-with",2,!1,!1,function(a,b,c){b=Q(b,a);a=Q(c,a);return 0==b.lastIndexOf(a,0)},2);V("string",3,!1,!0,function(a,b){return b?Q(b,a):E(a.a)},0,1);
V("string-length",1,!1,!0,function(a,b){return(b?Q(b,a):E(a.a)).length},0,1);V("substring",3,!1,!1,function(a,b,c,d){c=P(c,a);if(isNaN(c)||Infinity==c||-Infinity==c)return"";d=d?P(d,a):Infinity;if(isNaN(d)||-Infinity===d)return"";c=Math.round(c)-1;var e=Math.max(c,0);a=Q(b,a);if(Infinity==d)return a.substring(e);b=Math.round(d);return a.substring(e,c+b)},2,3);V("substring-after",3,!1,!1,function(a,b,c){b=Q(b,a);a=Q(c,a);c=b.indexOf(a);return-1==c?"":b.substring(c+a.length)},2);
V("substring-before",3,!1,!1,function(a,b,c){b=Q(b,a);a=Q(c,a);a=b.indexOf(a);return-1==a?"":b.substring(0,a)},2);V("sum",1,!1,!1,function(a,b){for(var c=M(b.a(a)),d=0,e=N(c);e;e=N(c))d+=+E(e);return d},1,1,!0);V("translate",3,!1,!1,function(a,b,c,d){b=Q(b,a);c=Q(c,a);var e=Q(d,a);a=[];for(d=0;d<c.length;d++){var f=c.charAt(d);f in a||(a[f]=e.charAt(d))}c="";for(d=0;d<b.length;d++)f=b.charAt(d),c+=f in a?a[f]:f;return c},3);V("true",2,!1,!1,function(){return!0},0);function L(a,b){this.e=a;this.c=void 0!==b?b:null;this.b=null;switch(a){case "comment":this.b=8;break;case "text":this.b=3;break;case "processing-instruction":this.b=7;break;case "node":break;default:throw Error("Unexpected argument");}}function hb(a){return"comment"==a||"text"==a||"processing-instruction"==a||"node"==a}L.prototype.a=function(a){return null===this.b||this.b==a.nodeType};L.prototype.d=function(){return this.e};
L.prototype.toString=function(){var a="Kind Test: "+this.e;null===this.c||(a+=O(this.c));return a};function ib(a){m.call(this,3);this.c=a.substring(1,a.length-1)}l(ib);ib.prototype.a=function(){return this.c};ib.prototype.toString=function(){return"Literal: "+this.c};function I(a,b){this.h=a.toLowerCase();this.c=b?b.toLowerCase():"http://www.w3.org/1999/xhtml"}I.prototype.a=function(a){var b=a.nodeType,c=a.nodeName;if(1!=b&&2!=b)return!1;if("*"==this.h)return!0;c=c.split(":").pop();return this.h!=c.toLowerCase()?!1:this.c==(a.namespaceURI?a.namespaceURI.toLowerCase():"http://www.w3.org/1999/xhtml")};I.prototype.d=function(){return this.h};I.prototype.toString=function(){return"Name Test: "+("http://www.w3.org/1999/xhtml"==this.c?"":this.c+":")+this.h};function jb(a){m.call(this,1);this.c=a}l(jb);jb.prototype.a=function(){return this.c};jb.prototype.toString=function(){return"Number: "+this.c};function kb(a,b){m.call(this,a.g);this.e=a;this.c=b;this.f=a.f;this.b=a.b;if(1==this.c.length){var c=this.c[0];c.m||c.c!=lb||(c=c.k,"*"!=c.d()&&(this.d={name:c.d(),l:null}))}}l(kb);function mb(){m.call(this,4)}l(mb);mb.prototype.a=function(a){var b=new H;a=a.a;9==a.nodeType?K(b,a):K(b,a.ownerDocument);return b};mb.prototype.toString=function(){return"Root Helper Expression"};function nb(){m.call(this,4)}l(nb);nb.prototype.a=function(a){var b=new H;K(b,a.a);return b};nb.prototype.toString=function(){return"Context Helper Expression"};
kb.prototype.a=function(a){var b=this.e.a(a);if(!(b instanceof H))throw Error("Filter expression must evaluate to nodeset.");a=this.c;for(var c=0,d=a.length;c<d&&b.i;c++){var e=a[c],f=M(b,e.c.a),g;if(e.f||e.c!=ob)if(e.f||e.c!=pb)for(g=N(f),b=e.a(new n(g));null!=(g=N(f));)g=e.a(new n(g)),b=Ta(b,g);else g=N(f),b=e.a(new n(g));else{for(g=N(f);(b=N(f))&&(!g.contains||g.contains(b))&&b.compareDocumentPosition(g)&8;g=b);b=e.a(new n(g))}}return b};
kb.prototype.toString=function(){var a;a="Path Expression:"+O(this.e);if(this.c.length){var b=D(this.c,function(a,b){return a+O(b)},"Steps:");a+=O(b)}return a};function qb(a,b){this.a=a;this.b=!!b}
function db(a,b,c){for(c=c||0;c<a.a.length;c++)for(var d=a.a[c],e=M(b),f=b.i,g,p=0;g=N(e);p++){var q=a.b?f-p:p+1;g=d.a(new n(g,q,f));if("number"==typeof g)q=q==g;else if("string"==typeof g||"boolean"==typeof g)q=!!g;else if(g instanceof H)q=0<g.i;else throw Error("Predicate.evaluate returned an unexpected type.");if(!q){q=e;g=q.d;var x=q.a;if(!x)throw Error("Next must be called at least once before remove.");var v=x.d,x=x.a;v?v.a=x:g.a=x;x?x.d=v:g.b=v;g.i--;q.a=null}}return b}
qb.prototype.toString=function(){return D(this.a,function(a,b){return a+O(b)},"Predicates:")};function W(a,b,c,d){m.call(this,4);this.c=a;this.k=b;this.e=c||new qb([]);this.m=!!d;b=0<this.e.a.length?this.e.a[0].d:null;a.b&&b&&(a=b.name,a=w?a.toLowerCase():a,this.d={name:a,l:b.l});a:{a=this.e;for(b=0;b<a.a.length;b++)if(c=a.a[b],c.f||1==c.g||0==c.g){a=!0;break a}a=!1}this.f=a}l(W);
W.prototype.a=function(a){var b=a.a,c=null,c=this.d,d=null,e=null,f=0;c&&(d=c.name,e=c.l?Q(c.l,a):null,f=1);if(this.m)if(this.f||this.c!=rb)if(a=M((new W(sb,new L("node"))).a(a)),b=N(a))for(c=this.j(b,d,e,f);null!=(b=N(a));)c=Ta(c,this.j(b,d,e,f));else c=new H;else c=G(this.k,b,d,e),c=db(this.e,c,f);else c=this.j(a.a,d,e,f);return c};W.prototype.j=function(a,b,c,d){a=this.c.d(this.k,a,b,c);return a=db(this.e,a,d)};
W.prototype.toString=function(){var a;a="Step:"+O("Operator: "+(this.m?"//":"/"));this.c.h&&(a+=O("Axis: "+this.c));a+=O(this.k);if(this.e.a.length){var b=D(this.e.a,function(a,b){return a+O(b)},"Predicates:");a+=O(b)}return a};function tb(a,b,c,d){this.h=a;this.d=b;this.a=c;this.b=d}tb.prototype.toString=function(){return this.h};var ub={};function X(a,b,c,d){if(ub.hasOwnProperty(a))throw Error("Axis already created: "+a);b=new tb(a,b,c,!!d);return ub[a]=b}
X("ancestor",function(a,b){for(var c=new H,d=b;d=d.parentNode;)a.a(d)&&Ua(c,d);return c},!0);X("ancestor-or-self",function(a,b){var c=new H,d=b;do a.a(d)&&Ua(c,d);while(d=d.parentNode);return c},!0);
var lb=X("attribute",function(a,b){var c=new H,d=a.d();if("style"==d&&b.style&&w)return K(c,new y(b.style,b,"style",b.style.cssText)),c;var e=b.attributes;if(e)if(a instanceof L&&null===a.b||"*"==d)for(var d=0,f;f=e[d];d++)w?f.nodeValue&&K(c,xa(b,f)):K(c,f);else(f=e.getNamedItem(d))&&(w?f.nodeValue&&K(c,xa(b,f)):K(c,f));return c},!1),rb=X("child",function(a,b,c,d,e){return(w?Qa:Ra).call(null,a,b,k(c)?c:null,k(d)?d:null,e||new H)},!1,!0);X("descendant",G,!1,!0);
var sb=X("descendant-or-self",function(a,b,c,d){var e=new H;F(b,c,d)&&a.a(b)&&K(e,b);return G(a,b,c,d,e)},!1,!0),ob=X("following",function(a,b,c,d){var e=new H;do for(var f=b;f=f.nextSibling;)F(f,c,d)&&a.a(f)&&K(e,f),e=G(a,f,c,d,e);while(b=b.parentNode);return e},!1,!0);X("following-sibling",function(a,b){for(var c=new H,d=b;d=d.nextSibling;)a.a(d)&&K(c,d);return c},!1);X("namespace",function(){return new H},!1);
var vb=X("parent",function(a,b){var c=new H;if(9==b.nodeType)return c;if(2==b.nodeType)return K(c,b.ownerElement),c;var d=b.parentNode;a.a(d)&&K(c,d);return c},!1),pb=X("preceding",function(a,b,c,d){var e=new H,f=[];do f.unshift(b);while(b=b.parentNode);for(var g=1,p=f.length;g<p;g++){var q=[];for(b=f[g];b=b.previousSibling;)q.unshift(b);for(var x=0,v=q.length;x<v;x++)b=q[x],F(b,c,d)&&a.a(b)&&K(e,b),e=G(a,b,c,d,e)}return e},!0,!0);
X("preceding-sibling",function(a,b){for(var c=new H,d=b;d=d.previousSibling;)a.a(d)&&Ua(c,d);return c},!0);var wb=X("self",function(a,b){var c=new H;a.a(b)&&K(c,b);return c},!1);function xb(a){m.call(this,1);this.c=a;this.f=a.f;this.b=a.b}l(xb);xb.prototype.a=function(a){return-P(this.c,a)};xb.prototype.toString=function(){return"Unary Expression: -"+O(this.c)};function yb(a){m.call(this,4);this.c=a;Ya(this,Ea(this.c,function(a){return a.f}));Za(this,Ea(this.c,function(a){return a.b}))}l(yb);yb.prototype.a=function(a){var b=new H;C(this.c,function(c){c=c.a(a);if(!(c instanceof H))throw Error("Path expression must evaluate to NodeSet.");b=Ta(b,c)});return b};yb.prototype.toString=function(){return D(this.c,function(a,b){return a+O(b)},"Union Expression:")};function zb(a,b){this.a=a;this.b=b}function Ab(a){for(var b,c=[];;){Y(a,"Missing right hand side of binary expression.");b=Bb(a);var d=A(a.a);if(!d)break;var e=(d=bb[d]||null)&&d.p;if(!e){a.a.a--;break}for(;c.length&&e<=c[c.length-1].p;)b=new S(c.pop(),c.pop(),b);c.push(b,d)}for(;c.length;)b=new S(c.pop(),c.pop(),b);return b}function Y(a,b){if(a.a.b.length<=a.a.a)throw Error(b);}function Cb(a,b){var c=A(a.a);if(c!=b)throw Error("Bad token, expected: "+b+" got: "+c);}
function Db(a){a=A(a.a);if(")"!=a)throw Error("Bad token: "+a);}function Eb(a){a=A(a.a);if(2>a.length)throw Error("Unclosed literal string");return new ib(a)}function Fb(a){var b=A(a.a),c=b.indexOf(":");if(-1==c)return new I(b);var d=b.substring(0,c);a=a.b(d);if(!a)throw Error("Namespace prefix not declared: "+d);b=b.substr(c+1);return new I(b,a)}
function Gb(a){var b,c=[],d;if("/"==z(a.a)||"//"==z(a.a)){b=A(a.a);d=z(a.a);if("/"==b&&(a.a.b.length<=a.a.a||"."!=d&&".."!=d&&"@"!=d&&"*"!=d&&!/(?![0-9])[\w]/.test(d)))return new mb;d=new mb;Y(a,"Missing next location step.");b=Hb(a,b);c.push(b)}else{a:{b=z(a.a);d=b.charAt(0);switch(d){case "$":throw Error("Variable reference not allowed in HTML XPath");case "(":A(a.a);b=Ab(a);Y(a,'unclosed "("');Cb(a,")");break;case '"':case "'":b=Eb(a);break;default:if(isNaN(+b))if(!hb(b)&&/(?![0-9])[\w]/.test(d)&&
"("==z(a.a,1)){b=A(a.a);b=gb[b]||null;A(a.a);for(d=[];")"!=z(a.a);){Y(a,"Missing function argument list.");d.push(Ab(a));if(","!=z(a.a))break;A(a.a)}Y(a,"Unclosed function argument list.");Db(a);b=new eb(b,d)}else{b=null;break a}else b=new jb(+A(a.a))}"["==z(a.a)&&(d=new qb(Ib(a)),b=new cb(b,d))}if(b)if("/"==z(a.a)||"//"==z(a.a))d=b;else return b;else b=Hb(a,"/"),d=new nb,c.push(b)}for(;"/"==z(a.a)||"//"==z(a.a);)b=A(a.a),Y(a,"Missing next location step."),b=Hb(a,b),c.push(b);return new kb(d,c)}
function Hb(a,b){var c,d,e;if("/"!=b&&"//"!=b)throw Error('Step op should be "/" or "//"');if("."==z(a.a))return d=new W(wb,new L("node")),A(a.a),d;if(".."==z(a.a))return d=new W(vb,new L("node")),A(a.a),d;var f;if("@"==z(a.a))f=lb,A(a.a),Y(a,"Missing attribute name");else if("::"==z(a.a,1)){if(!/(?![0-9])[\w]/.test(z(a.a).charAt(0)))throw Error("Bad token: "+A(a.a));c=A(a.a);f=ub[c]||null;if(!f)throw Error("No axis with name: "+c);A(a.a);Y(a,"Missing node name")}else f=rb;c=z(a.a);if(/(?![0-9])[\w]/.test(c.charAt(0)))if("("==
z(a.a,1)){if(!hb(c))throw Error("Invalid node type: "+c);c=A(a.a);if(!hb(c))throw Error("Invalid type name: "+c);Cb(a,"(");Y(a,"Bad nodetype");e=z(a.a).charAt(0);var g=null;if('"'==e||"'"==e)g=Eb(a);Y(a,"Bad nodetype");Db(a);c=new L(c,g)}else c=Fb(a);else if("*"==c)c=Fb(a);else throw Error("Bad token: "+A(a.a));e=new qb(Ib(a),f.a);return d||new W(f,c,e,"//"==b)}
function Ib(a){for(var b=[];"["==z(a.a);){A(a.a);Y(a,"Missing predicate expression.");var c=Ab(a);b.push(c);Y(a,"Unclosed predicate expression.");Cb(a,"]")}return b}function Bb(a){if("-"==z(a.a))return A(a.a),new xb(Bb(a));var b=Gb(a);if("|"!=z(a.a))a=b;else{for(b=[b];"|"==A(a.a);)Y(a,"Missing next union location path."),b.push(Gb(a));a.a.a--;a=new yb(b)}return a};function Jb(a){switch(a.nodeType){case 1:return ea(Kb,a);case 9:return Jb(a.documentElement);case 2:return a.ownerElement?Jb(a.ownerElement):Lb;case 11:case 10:case 6:case 12:return Lb;default:return a.parentNode?Jb(a.parentNode):Lb}}function Lb(){return null}function Kb(a,b){if(a.prefix==b)return a.namespaceURI||"http://www.w3.org/1999/xhtml";var c=a.getAttributeNode("xmlns:"+b);return c&&c.specified?c.value||null:a.parentNode&&9!=a.parentNode.nodeType?Kb(a.parentNode,b):null};function Mb(a,b){if(!a.length)throw Error("Empty XPath expression.");var c=za(a);if(c.b.length<=c.a)throw Error("Invalid XPath expression.");b?"function"==aa(b)||(b=da(b.lookupNamespaceURI,b)):b=function(){return null};var d=Ab(new zb(c,b));if(!(c.b.length<=c.a))throw Error("Bad token: "+A(c));this.evaluate=function(a,b){var c=d.a(new n(a));return new Z(c,b)}}
function Z(a,b){if(0==b)if(a instanceof H)b=4;else if("string"==typeof a)b=2;else if("number"==typeof a)b=1;else if("boolean"==typeof a)b=3;else throw Error("Unexpected evaluation result.");if(2!=b&&1!=b&&3!=b&&!(a instanceof H))throw Error("value could not be converted to the specified type");this.resultType=b;var c;switch(b){case 2:this.stringValue=a instanceof H?Wa(a):""+a;break;case 1:this.numberValue=a instanceof H?+Wa(a):+a;break;case 3:this.booleanValue=a instanceof H?0<a.i:!!a;break;case 4:case 5:case 6:case 7:var d=
M(a);c=[];for(var e=N(d);e;e=N(d))c.push(e instanceof y?e.a:e);this.snapshotLength=a.i;this.invalidIteratorState=!1;break;case 8:case 9:d=Va(a);this.singleNodeValue=d instanceof y?d.a:d;break;default:throw Error("Unknown XPathResult type.");}var f=0;this.iterateNext=function(){if(4!=b&&5!=b)throw Error("iterateNext called with wrong result type");return f>=c.length?null:c[f++]};this.snapshotItem=function(a){if(6!=b&&7!=b)throw Error("snapshotItem called with wrong result type");return a>=c.length||
0>a?null:c[a]}}Z.ANY_TYPE=0;Z.NUMBER_TYPE=1;Z.STRING_TYPE=2;Z.BOOLEAN_TYPE=3;Z.UNORDERED_NODE_ITERATOR_TYPE=4;Z.ORDERED_NODE_ITERATOR_TYPE=5;Z.UNORDERED_NODE_SNAPSHOT_TYPE=6;Z.ORDERED_NODE_SNAPSHOT_TYPE=7;Z.ANY_UNORDERED_NODE_TYPE=8;Z.FIRST_ORDERED_NODE_TYPE=9;function Nb(a){this.lookupNamespaceURI=Jb(a)};function Ob(a){a=a||h;var b=a.document;b.evaluate||(a.XPathResult=Z,b.evaluate=function(a,b,e,f){return(new Mb(a,e)).evaluate(b,f)},b.createExpression=function(a,b){return new Mb(a,b)},b.createNSResolver=function(a){return new Nb(a)})}var Pb=["wgxpath","install"],$=h;Pb[0]in $||!$.execScript||$.execScript("var "+Pb[0]);for(var Qb;Pb.length&&(Qb=Pb.shift());)Pb.length||void 0===Ob?$=$[Qb]?$[Qb]:$[Qb]={}:$[Qb]=Ob;})()
