// ==UserScript==
// @name    		MagicScript Extension for Dobrochan Imageboard
// @description 	Включает в себя: Ajax подгрузку и отправку постов, Превращение рейтингов в спойлеры, Умные кнопки разметки и автокомплит, Поддержку встраивания медиа со множества ресурсов, а так же HTML5 Audio/Video/Image файлов по прямым ссылкам и много чего еще.
// @namespace   	magicode
// @homepage		https://github.com/OpenA/MagiCcode/Dobrochan
// @updateURL   	https://github.com/OpenA/MagiCcode/raw/master/Dobrochan/HanabiraMagicExtension.user.js
// @downloadURL 	https://github.com/OpenA/MagiCcode/raw/master/Dobrochan/HanabiraMagicExtension.user.js
// @include 		*dobrochan.*
// @run-at  		document-start
// @version 		1.2.2
// @grant   		none
// ==/UserScript==
initStore();

/* Tinycon - A small library for manipulating the Favicon Tom Moor, http://tommoor.com */
(function(){var Tinycon={};var currentFavicon=null;var originalFavicon=null;var faviconImage=null;var canvas=null;var options={};var r=window.devicePixelRatio||1;var size=16*r;var defaults={width:7,height:9,font:10*r+'px arial',colour:'#fff',background:'#F03D25',fallback:true,crossOrigin:true,abbreviate:true};var ua=(function(){var agent=navigator.userAgent.toLowerCase();return function(browser){return agent.indexOf(browser)!==-1}}());var browser={ie:ua('msie'),chrome:ua('chrome'),webkit:ua('chrome')||ua('safari'),safari:ua('safari')&&!ua('chrome'),mozilla:ua('mozilla')&&!ua('chrome')&&!ua('safari')};var getFaviconTag=function(){var links=document.getElementsByTagName('link');for(var i=0,len=links.length;i<len;i++){if((links[i].getAttribute('rel')||'').match(/\bicon\b/)){return links[i]}}return false};var removeFaviconTag=function(){var links=document.getElementsByTagName('link');var head=document.getElementsByTagName('head')[0];for(var i=0,len=links.length;i<len;i++){var exists=(typeof(links[i])!=='undefined');if(exists&&(links[i].getAttribute('rel')||'').match(/\bicon\b/)){head.removeChild(links[i])}}};var getCurrentFavicon=function(){if(!originalFavicon||!currentFavicon){var tag=getFaviconTag();originalFavicon=currentFavicon=tag?tag.getAttribute('href'):'/favicon.ico'}return currentFavicon};var getCanvas=function(){if(!canvas){canvas=document.createElement("canvas");canvas.width=size;canvas.height=size}return canvas};var setFaviconTag=function(url){removeFaviconTag();var link=document.createElement('link');link.type='image/x-icon';link.rel='icon';link.href=url;document.getElementsByTagName('head')[0].appendChild(link)};var log=function(message){if(window.console)window.console.log(message)};var drawFavicon=function(label,colour){if(!getCanvas().getContext||browser.ie||browser.safari||options.fallback==='force'){return updateTitle(label)}var context=getCanvas().getContext("2d");var colour=colour||'#000';var src=getCurrentFavicon();faviconImage=document.createElement('img');faviconImage.onload=function(){context.clearRect(0,0,size,size);context.drawImage(faviconImage,0,0,faviconImage.width,faviconImage.height,0,0,size,size);if((label+'').length>0)drawBubble(context,label,colour);refreshFavicon()};if(!src.match(/^data/)&&options.crossOrigin){faviconImage.crossOrigin='anonymous'}faviconImage.src=src};var updateTitle=function(label){if(options.fallback){var originalTitle=document.title;if(originalTitle[0]==='('){originalTitle=originalTitle.slice(originalTitle.indexOf(' '))}if((label+'').length>0){document.title='('+label+') '+originalTitle}else{document.title=originalTitle}}};var drawBubble=function(context,label,colour){if(typeof label=='number'&&label>99&&options.abbreviate){label=abbreviateNumber(label)}var len=(label+'').length-1;var width=options.width*r+(6*r*len),height=options.height*r;var top=size-height,left=size-width-r,bottom=16*r,right=16*r,radius=2*r;context.font=(browser.webkit?'bold ':'')+options.font;context.fillStyle=options.background;context.strokeStyle=options.background;context.lineWidth=r;context.beginPath();context.moveTo(left+radius,top);context.quadraticCurveTo(left,top,left,top+radius);context.lineTo(left,bottom-radius);context.quadraticCurveTo(left,bottom,left+radius,bottom);context.lineTo(right-radius,bottom);context.quadraticCurveTo(right,bottom,right,bottom-radius);context.lineTo(right,top+radius);context.quadraticCurveTo(right,top,right-radius,top);context.closePath();context.fill();context.beginPath();context.strokeStyle="rgba(0,0,0,.3)";context.moveTo(left+radius/2.0,bottom);context.lineTo(right-radius/2.0,bottom);context.stroke();context.fillStyle=options.colour;context.textAlign="right";context.textBaseline="top";context.fillText(label,r===2?29:15,browser.mozilla?7*r:6*r)};var refreshFavicon=function(){if(!getCanvas().getContext)return;setFaviconTag(getCanvas().toDataURL())};var abbreviateNumber=function(label){var metricPrefixes=[['G',1000000000],['M',1000000],['k',1000]];for(var i=0;i<metricPrefixes.length;++i){if(label>=metricPrefixes[i][1]){label=round(label/metricPrefixes[i][1])+metricPrefixes[i][0];break}}return label};var round=function(value,precision){var number=new Number(value);return number.toFixed(precision)};Tinycon.setOptions=function(custom){options={};for(var key in defaults){options[key]=custom.hasOwnProperty(key)?custom[key]:defaults[key]}return this};Tinycon.setImage=function(url){currentFavicon=url;refreshFavicon();return this};Tinycon.setBubble=function(label,colour){label=label||'';drawFavicon(label,colour);return this};Tinycon.reset=function(){setFaviconTag(originalFavicon)};Tinycon.setOptions(defaults);window.Tinycon=Tinycon;if(typeof define==='function'&&define.amd){define(Tinycon)}})();
//Copyright (c) 2012 Tom Moor @license MIT Licensed @version 0.6.3

var BlobView=function(){function e(e){throw Error(e)}function t(e,t,n,r,i,s,o){this.blob=e;this.sliceOffset=t;this.sliceLength=n;this.slice=r;this.viewOffset=i;this.viewLength=s;this.littleEndian=o;this.view=new DataView(r,i,s);this.buffer=r;this.byteLength=s;this.byteOffset=i;this.index=0}t.get=function(n,r,i,s,o){if(r<0){e("negative offset")}if(i<0){e("negative length")}if(r>n.size){e("offset larger than blob size")}if(r+i>n.size){i=n.size-r}var u=n.slice(r,r+i);var a=new FileReader;a.readAsArrayBuffer(u);a.onloadend=function(){var e=null;if(a.result){e=new t(n,r,i,a.result,0,i,o||false)}s(e,a.error)}};t.prototype={constructor:t,getMore:function(e,n,r){if(e>=this.sliceOffset&&e+n<=this.sliceOffset+this.sliceLength){r(new t(this.blob,this.sliceOffset,this.sliceLength,this.slice,e-this.sliceOffset,n,this.littleEndian))}else{t.get(this.blob,e,n,r,this.littleEndian)}},littleEndian:function(){this.littleEndian=true},bigEndian:function(){this.littleEndian=false},getUint8:function(e){return this.view.getUint8(e)},getInt8:function(e){return this.view.getInt8(e)},getUint16:function(e,t){return this.view.getUint16(e,t!==undefined?t:this.littleEndian)},getInt16:function(e,t){return this.view.getInt16(e,t!==undefined?t:this.littleEndian)},getUint32:function(e,t){return this.view.getUint32(e,t!==undefined?t:this.littleEndian)},getInt32:function(e,t){return this.view.getInt32(e,t!==undefined?t:this.littleEndian)},getFloat32:function(e,t){return this.view.getFloat32(e,t!==undefined?t:this.littleEndian)},getFloat64:function(e,t){return this.view.getFloat64(e,t!==undefined?t:this.littleEndian)},readByte:function(){return this.view.getInt8(this.index++)},readUnsignedByte:function(){return this.view.getUint8(this.index++)},readShort:function(e){var t=this.view.getInt16(this.index,e!==undefined?e:this.littleEndian);this.index+=2;return t},readUnsignedShort:function(e){var t=this.view.getUint16(this.index,e!==undefined?e:this.littleEndian);this.index+=2;return t},readInt:function(e){var t=this.view.getInt32(this.index,e!==undefined?e:this.littleEndian);this.index+=4;return t},readUnsignedInt:function(e){var t=this.view.getUint32(this.index,e!==undefined?e:this.littleEndian);this.index+=4;return t},readFloat:function(e){var t=this.view.getFloat32(this.index,e!==undefined?e:this.littleEndian);this.index+=4;return t},readDouble:function(e){var t=this.view.getFloat64(this.index,e!==undefined?e:this.littleEndian);this.index+=8;return t},tell:function(){return this.index},remaining:function(){return this.byteLength-this.index},seek:function(t){if(t<0){e("negative index")}if(t>this.byteLength){e("index greater than buffer size")}this.index=t},advance:function(t){var n=this.index+t;if(n<0){e("advance past beginning of buffer")}if(n>this.byteLength){e("advance past end of buffer")}this.index=n},getUnsignedByteArray:function(e,t){return new Uint8Array(this.buffer,e+this.viewOffset,t)},readUnsignedByteArray:function(e){var t=new Uint8Array(this.buffer,this.index+this.viewOffset,e);this.index+=e;return t},getBit:function(e,t){var n=this.view.getUint8(e);return(n&1<<t)!==0},getUint24:function(e,t){var n,r,i;if(t!==undefined?t:this.littleEndian){n=this.view.getUint8(e);r=this.view.getUint8(e+1);i=this.view.getUint8(e+2)}else{i=this.view.getUint8(e);r=this.view.getUint8(e+1);n=this.view.getUint8(e+2)}return(i<<16)+(r<<8)+n},readUint24:function(e){var t=this.getUint24(this.index,e);this.index+=3;return t},getASCIIText:function(e,t){var n=new Uint8Array(this.buffer,e+this.viewOffset,t);return String.fromCharCode.apply(String,n)},readASCIIText:function(e){var t=new Uint8Array(this.buffer,this.index+this.viewOffset,e);this.index+=e;return String.fromCharCode.apply(String,t)},getUTF8Text:function(e,t){function n(){throw new Error("Illegal UTF-8")}var r=e;var i=e+t;var s;var o="";var u,a,f,l;while(r<i){var u=this.view.getUint8(r);if(u<128){o+=String.fromCharCode(u);r+=1}else if(u<194){n()}else if(u<224){if(r+1>=i){n()}a=this.view.getUint8(r+1);if(a<128||a>191){n()}s=((u&31)<<6)+(a&63);o+=String.fromCharCode(s);r+=2}else if(u<240){if(r+2>=i){n()}a=this.view.getUint8(r+1);if(a<128||a>191){n()}f=this.view.getUint8(r+2);if(f<128||f>191){n()}s=((u&15)<<12)+((a&63)<<6)+(f&63);o+=String.fromCharCode(s);r+=3}else if(u<245){if(r+3>=i){n()}a=this.view.getUint8(r+1);if(a<128||a>191){n()}f=this.view.getUint8(r+2);if(f<128||f>191){n()}l=this.view.getUint8(r+3);if(l<128||l>191){n()}s=((u&7)<<18)+((a&63)<<12)+((f&63)<<6)+(l&63);s-=65536;o+=String.fromCharCode(55296+((s&1047552)>>>10));o+=String.fromCharCode(56320+(s&1023));r+=4}else{n()}}return o},readUTF8Text:function(e){try{return this.getUTF8Text(this.index,e)}finally{this.index+=e}},getID3Uint28BE:function(e){var t=this.view.getUint8(e)&127;var n=this.view.getUint8(e+1)&127;var r=this.view.getUint8(e+2)&127;var i=this.view.getUint8(e+3)&127;return t<<21|n<<14|r<<7|i},readID3Uint28BE:function(){var e=this.getID3Uint28BE(this.index);this.index+=4;return e},readNullTerminatedLatin1Text:function(e){var t="";var n=unescape("%u0402%u0403%u201A%u0453%u201E%u2026%u2020%u2021%u20AC%u2030%u0409%u2039%u040A%u040C%u040B%u040F"+"%u0452%u2018%u2019%u201C%u201D%u2022%u2013%u2014%u0000%u2122%u0459%u203A%u045A%u045C%u045B%u045F"+"%u00A0%u040E%u045E%u0408%u00A4%u0490%u00A6%u00A7%u0401%u00A9%u0404%u00AB%u00AC%u00AD%u00AE%u0407"+"%u00B0%u00B1%u0406%u0456%u0491%u00B5%u00B6%u00B7%u0451%u2116%u0454%u00BB%u0458%u0405%u0455%u0457");var r=function(e){if(e>=192&&e<=255)return String.fromCharCode(e-192+1040);if(e>=128&&e<=191)return n.charAt(e-128);return String.fromCharCode(e)};for(var i=0;i<e;i++){var s=this.view.getUint8(this.index+i);if(s===0){i++;break}t+=r(s)}this.index+=i;return t},readNullTerminatedUTF8Text:function(e){for(var t=0;t<e;t++){if(this.view.getUint8(this.index+t)===0){break}}var n=this.readUTF8Text(t);if(t<e){this.advance(1)}return n},readNullTerminatedUTF16Text:function(e,t){if(t==null){var n=this.readUnsignedShort();e-=2;if(n===65279){t=false}else{t=true}}var r="";for(var i=0;i<e;i+=2){var s=this.getUint16(this.index+i,t);if(s===0){i+=2;break}r+=String.fromCharCode(s)}this.index+=i;return r}};return{get:t.get}}();

function parse_audio_metadata(blob,metadataCallback,errorCallback){var filename=blob.name;errorCallback=errorCallback||function(e){console.warn(e);};if(filename){if(filename.slice(0,5)==='DCIM/'&&filename.slice(-4).toLowerCase()==='.3gp'){errorCallback('skipping 3gp video file');return;}
if(filename.slice(-4).toLowerCase()==='.m4v'){errorCallback('skipping m4v video file');return;}}
if(blob.size<128){errorCallback('file is empty or too small');return;}
var TITLE='title';var ARTIST='artist';var ALBUM='album';var TRACKNUM='tracknum';var IMAGE='picture';var YEAR='year';var GENRE='genre';var genres_list=['Blues','Classic Rock','Country','Dance','Disco','Funk','Grunge','Hip-Hop','Jazz','Metal','New Age','Oldies','Other','Pop','R&B','Rap','Reggae','Rock','Techno','Industrial','Alternative','Ska','Death Metal','Pranks','Soundtrack','Euro-Techno','Ambient','Trip-Hop','Vocal','Jazz+Funk','Fusion','Trance','Classical','Instrumental','Acid','House','Game','Sound Clip','Gospel','Noise','AlternRock','Bass','Soul','Punk','Space','Meditative','Instrumental Pop','Instrumental Rock','Ethnic','Gothic','Darkwave','Techno-Industrial','Electronic','Pop-Folk','Eurodance','Dream','Southern Rock','Comedy','Cult','Gangsta Rap','Top 40','Christian Rap','Pop / Funk','Jungle','Native American','Cabaret','New Wave','Psychedelic','Rave','Showtunes','Trailer','Lo-Fi','Tribal','Acid Punk','Acid Jazz','Polka','Retro','Musical','Rock & Roll','Hard Rock','Folk','Folk-Rock','National Folk','Swing','Fast Fusion','Bebob','Latin','Revival','Celtic','Bluegrass','Avantgarde','Gothic Rock','Progressive Rock','Psychedelic Rock','Symphonic Rock','Slow Rock','Big Band','Chorus','Easy Listening','Acoustic','Humour','Speech','Chanson','Opera','Chamber Music','Sonata','Symphony','Booty Bass','Primus','Porn Groove','Satire','Slow Jam','Club','Tango','Samba','Folklore','Ballad','Power Ballad','Rhythmic Soul','Freestyle','Duet','Punk Rock','Drum Solo','A Cappella','Euro-House','Dance Hall','Goa','Drum & Bass','Club-House','Hardcore','Terror','Indie','BritPop','Negerpunk','Polsk Punk','Beat','Christian Gangsta Rap','Heavy Metal','Black Metal','Crossover','Contemporary Christian','Christian Rock','Merengue','Salsa','Thrash Metal','Anime','JPop','Synthpop','Abstract','Art Rock','Baroque','Bhangra','Big Beat','Breakbeat','Chillout','Downtempo','Dub','EBM','Eclectic','Electro','Electroclash','Emo','Experimental','Garage','Global','IDM','Illbient','Industro-Goth','Jam Band','Krautrock','Leftfield','Lounge','Math Rock','New Romantic','Nu-Breakz','Post-Punk','Post-Rock','Psytrance','Shoegaze','Space Rock','Trop Rock','World Music','Neoclassical','Audiobook','Audio Theatre','Neue Deutsche Welle','Podcast','Indie Rock','G-Funk','Dubstep','Garage Rock','Psybient']
var RATED='rated';var PLAYED='played';var ID3V2TAGS={TIT2:TITLE,TT2:TITLE,TPE1:ARTIST,TP1:ARTIST,TALB:ALBUM,TAL:ALBUM,TRCK:TRACKNUM,TRK:TRACKNUM,APIC:IMAGE,PIC:IMAGE,POPM:RATED,POP:RATED,PCNT:PLAYED,CNT:PLAYED,TORY:YEAR,TDOR:YEAR,TYER:YEAR,TYE:YEAR,TDRC:YEAR,TCON:GENRE,TCO:GENRE};var OGGTAGS={title:TITLE,artist:ARTIST,album:ALBUM,tracknumber:TRACKNUM};var MP4TAGS={'\xa9alb':ALBUM,'\xa9art':ARTIST,'\xa9ART':ARTIST,'aART':ARTIST,'\xa9nam':TITLE,'trkn':TRACKNUM,'covr':IMAGE,'Year':YEAR};var MP4Types={'M4A ':true,'M4B ':true,'mp41':true,'mp42':true,'isom':true,'iso2':true};var MP4Codecs={'mp4a':true,'samr':true,'sawb':true,'sawp':true,'alac':true};var metadata={};metadata[ARTIST]=metadata[ALBUM]=metadata[TITLE]=metadata[YEAR]='';metadata[RATED]=metadata[PLAYED]=0;if(filename){var p1=filename.lastIndexOf('/');var p2=filename.lastIndexOf('.');if(p2===-1){p2=filename.length;}
metadata[TITLE]=filename.substring(p1+1,p2);}
var headersize=Math.min(64*1024,blob.size);BlobView.get(blob,0,headersize,function(header,error){if(error){errorCallback(error);return;}
try{var magic=header.getASCIIText(0,12);if(magic.substring(0,9)==='LOCKED 1 '){handleLockedFile(blob);return;}
if(magic.substring(0,3)==='ID3'){parseID3v2Metadata(header);}else if(magic.substring(0,4)==='OggS'){parseOggMetadata(header);}else if(magic.substring(4,8)==='ftyp'){if(checkMP4Type(header,MP4Types)){parseMP4Metadata(header);return;}
else{errorCallback('Unknown MP4 file type');}}else if((header.getUint16(0,false)&0xFFFE)===0xFFFA){BlobView.get(blob,blob.size-128,128,function(footer,error){if(error){errorCallback(error);return;}
try{var magic=footer.getASCIIText(0,3);if(magic==='TAG'){parseID3v1Metadata(footer);}else{metadataCallback(metadata);}}
catch(e){errorCallback(e);}});}else{errorCallback('Unplayable music file');}}
catch(e){console.error('parseAudioMetadata:',e,e.stack);errorCallback(e);}});function parseID3v1Metadata(footer){var title=footer.getASCIIText(3,30);var artist=footer.getASCIIText(33,30);var album=footer.getASCIIText(63,30);var p=title.indexOf('\0');if(p!==-1){title=title.substring(0,p);}
p=artist.indexOf('\0');if(p!==-1){artist=artist.substring(0,p);}
p=album.indexOf('\0');if(p!==-1){album=album.substring(0,p);}
metadata[TITLE]=title||undefined;metadata[ARTIST]=artist||undefined;metadata[ALBUM]=album||undefined;var b1=footer.getUint8(125);var b2=footer.getUint8(126);if(b1===0&&b2!==0){metadata[TRACKNUM]=b2;}
metadataCallback(metadata);}
function parseID3v2Metadata(header){header.index=3;var id3version=header.readUnsignedByte();if(id3version>4){console.warn('mp3 file with unknown metadata version');metadataCallback(metadata);return;}
var id3revision=header.readUnsignedByte();var id3flags=header.readUnsignedByte();var has_extended_header=((id3flags&0x40)!==0);var length=header.readID3Uint28BE();header.getMore(header.index,length,parseID3);function parseID3(id3){if(has_extended_header){id3.advance(id3.readUnsignedInt());}
while(id3.index<id3.byteLength){var tagid,tagsize,tagflags;if(id3.getUint8(id3.index)===0){break;}
switch(id3version){case 2:tagid=id3.readASCIIText(3);tagsize=id3.readUint24();tagflags=0;break;case 3:tagid=id3.readASCIIText(4);tagsize=id3.readUnsignedInt();tagflags=id3.readUnsignedShort();break;case 4:tagid=id3.readASCIIText(4);tagsize=id3.readID3Uint28BE();tagflags=id3.readUnsignedShort();break;}
var nexttag=id3.index+tagsize;var tagname=ID3V2TAGS[tagid];if(!tagname){id3.index=nexttag;continue;}
if((tagflags&0xFF)!==0){console.warn('Skipping',tagid,'tag with flags',tagflags);id3.index=nexttag;continue;}
try{var tagvalue=null;switch(tagid){case'TIT2':case'TT2':case'TPE1':case'TP1':case'TALB':case'TAL':case'TORY':case'TDOR':case'TYER':case'TYE':case'TDRC':tagvalue=readText(id3,tagsize);break;case'TRCK':case'TRK':case'PCNT':case'CNT':tagvalue=parseInt(readText(id3,tagsize));break;case'APIC':case'PIC':tagvalue=readPic(id3,tagsize,tagid);break;case'TCON':case'TCO':tagvalue=readText(id3,tagsize)||'';tagvalue=new String(tagvalue).replace(/^\(?([0-9]+)\)?$/,function(match,genre_index){return genres_list[parseInt(genre_index)]});break;case'POPM':case'POP':tagvalue=readText(id3,tagsize,0);if(isNaN(parseInt(tagvalue))){tagvalue=id3.readUnsignedByte();}
if(tagvalue==0){tagvalue=0;}else if(tagvalue<64){tagvalue=1;}else if(tagvalue<128){tagvalue=2;}else if(tagvalue<192){tagvalue=3;}else if(tagvalue<255){tagvalue=4;}else{tagvalue=5;}}
if(tagvalue){metadata[tagname]=tagvalue;}}
catch(e){console.warn('Error parsing mp3 metadata tag',tagid,':',e);}
id3.index=nexttag;}
metadataCallback(metadata);}
function readPic(view,size,id){var start=view.index;var encoding=view.readUnsignedByte();var mimetype;if(id==='PIC'){mimetype=view.readASCIIText(3);if(mimetype==='JPG'){mimetype='image/jpeg';}
else if(mimetype==='PNG'){mimetype='image/png';}}
else{mimetype=view.readNullTerminatedLatin1Text(size-1);}
var kind=view.readUnsignedByte();var desc=readText(view,size-(view.index-start),encoding);var picstart=view.sliceOffset+view.viewOffset+view.index;var piclength=size-(view.index-start);return blob.slice(picstart,picstart+piclength,mimetype);}
function readText(view,size,encoding){if(encoding===undefined){encoding=view.readUnsignedByte();size=size-1;}
switch(encoding){case 0:return view.readNullTerminatedLatin1Text(size);case 1:return view.readNullTerminatedUTF16Text(size,undefined);case 2:return view.readNullTerminatedUTF16Text(size,false);case 3:return view.readNullTerminatedUTF8Text(size);default:throw Error('unknown text encoding');}}}
function parseOggMetadata(header){function sum(x,y){return x+y;}
var p1_num_segments=header.getUint8(26);var p1_segment_lengths=header.getUnsignedByteArray(27,p1_num_segments);var p1_length=Array.reduce(p1_segment_lengths,sum,0);var p2_header=27+p1_num_segments+p1_length;var p2_num_segments=header.getUint8(p2_header+26);var p2_segment_lengths=header.getUnsignedByteArray(p2_header+27,p2_num_segments);var p2_length=Array.reduce(p2_segment_lengths,sum,0);var p2_offset=p2_header+27+p2_num_segments;header.getMore(p2_offset,p2_length,function(page,error){if(error){errorCallback(error);return;}
var first_byte=page.readByte();var valid=false;switch(first_byte){case 3:valid=page.readASCIIText(6)==='vorbis';break;case 79:valid=page.readASCIIText(7)==='pusTags';break;}
if(!valid){errorCallback('malformed ogg comment packet');return;}
var vendor_string_length=page.readUnsignedInt(true);page.advance(vendor_string_length);var num_comments=page.readUnsignedInt(true);var seen_fields={};for(var i=0;i<num_comments;i++){if(page.remaining()<4){break;}
var comment_length=page.readUnsignedInt(true);if(comment_length>page.remaining()){break;}
var comment=page.readUTF8Text(comment_length);var equal=comment.indexOf('=');if(equal!==-1){var tag=comment.substring(0,equal).toLowerCase().replace(' ','');var propname=OGGTAGS[tag];if(propname){var value=comment.substring(equal+1);if(seen_fields.hasOwnProperty(propname)){metadata[propname]+=' '+value;}
else{metadata[propname]=value;seen_fields[propname]=true;}}}}});metadataCallback(metadata);}
function checkMP4Type(header,types){var majorbrand=header.getASCIIText(8,4);if(majorbrand in types){return true;}
else{var index=16;var size=header.getUint32(0);while(index<size){var compatiblebrand=header.getASCIIText(index,4);index+=4;if(compatiblebrand in types){return true;}}
return false;}}
function parseMP4Metadata(header){findMoovAtom(header);function findMoovAtom(atom){try{var offset=atom.sliceOffset+atom.viewOffset;var size=atom.readUnsignedInt();var type=atom.readASCIIText(4);if(size===0){size=atom.blob.size-offset;}
else if(size===1){size=atom.readUnsignedInt()*4294967296+atom.readUnsignedInt();}
if(type==='moov'){atom.getMore(offset,size,function(moov){try{parseMoovAtom(moov,size);metadataCallback(metadata);}
catch(e){errorCallback(e);}});}
else{if(offset+size+16<=atom.blob.size){atom.getMore(offset+size,16,findMoovAtom);}
else{metadataCallback(metadata);}}}
catch(e){errorCallback(e);}}
function parseMoovAtom(data,end){data.advance(8);while(data.index<end){var size=data.readUnsignedInt();var type=data.readASCIIText(4);var nextindex=data.index+size-8;if(type==='udta'){parseUdtaAtom(data,end);data.index=nextindex;}
else if(type==='trak'){data.advance(-8);var mdia=findChildAtom(data,'mdia');if(mdia){var minf=findChildAtom(mdia,'minf');if(minf){var vmhd=searchChildAtom(minf,'vmhd');if(vmhd){}
var smhd=searchChildAtom(minf,'smhd');if(smhd){var stbl=findChildAtom(minf,'stbl');if(stbl){var stsd=findChildAtom(stbl,'stsd');if(stsd){stsd.advance(20);var codec=stsd.readASCIIText(4);if(!(codec in MP4Codecs)){throw'Unsupported format in MP4 container: '+codec;}}}}}}
data.index=nextindex;}
else{data.advance(size-8);}}}
function findChildAtom(data,atom){var start=data.index;var length=data.readUnsignedInt();data.advance(4);while(data.index<start+length){var size=data.readUnsignedInt();var type=data.readASCIIText(4);if(type===atom){data.advance(-8);return data;}
else{data.advance(size-8);}}
return null;}
function searchChildAtom(data,atom){var start=data.index;var target=findChildAtom(data,atom);data.index=start;return target;}
function parseUdtaAtom(data,end){while(data.index<end){var size=data.readUnsignedInt();var type=data.readASCIIText(4);if(type==='meta'){parseMetaAtom(data,data.index+size-8);data.index=end;return;}
else{data.advance(size-8);}}}
function parseMetaAtom(data,end){data.advance(4);while(data.index<end){var size=data.readUnsignedInt();var type=data.readASCIIText(4);if(type==='ilst'){parseIlstAtom(data,data.index+size-8);data.index=end;return;}
else{data.advance(size-8);}}}
function parseIlstAtom(data,end){while(data.index<end){var size=data.readUnsignedInt();var type=data.readASCIIText(4);var next=data.index+size-8;var tagname=MP4TAGS[type];if(tagname){try{var value=getMetadataValue(data,next,type);metadata[tagname]=value;}
catch(e){console.warn('skipping',type,':',e);}}
data.index=next;}}
function getMetadataValue(data,end,tagtype){while(data.index<end){var size=data.readUnsignedInt();var type=data.readASCIIText(4);if(type!=='data'){data.advance(size-8);continue;}
var datatype=data.readUnsignedInt()&0xFFFFFF;data.advance(4);var datasize=size-16;if(tagtype==='trkn'){data.advance(2);return data.readUnsignedShort();}
switch(datatype){case 1:return data.readUTF8Text(datasize);case 13:return blob.slice(data.sliceOffset+data.viewOffset+data.index,data.sliceOffset+data.viewOffset+data.index+datasize,'image/jpeg');case 14:return blob.slice(data.sliceOffset+data.viewOffset+data.index,data.sliceOffset+data.viewOffset+data.index+datasize,'image/png');default:throw Error('unexpected type in data atom');}}
throw Error('no data atom found');}}
function handleLockedFile(locked){ForwardLock.getKey(function(secret){ForwardLock.unlockBlob(secret,locked,callback,errorCallback);function callback(unlocked,unlockedMetadata){parseAudioMetadata(unlocked,function(metadata){metadata.locked=true;if(unlockedMetadata.vendor){metadata.vendor=unlockedMetadata.vendor;}
if(!metadata[TITLE]){metadata[TITLE]=unlockedMetadata.name;}
metadataCallback(metadata);},errorCallback);}});}}

/* SpelzZ - */
(function(){
	var _z = {
		each: $each, setup: $setup, route: $route,
		getlSVal: getlSValue, setlSVal: setlSValue, fall: fallback,
		append: function(el, nodes) { $nodeUtil('append', el, nodes) },
		prepend: function(el, nodes) { $nodeUtil('prepend', el, nodes) },
		after: function(el, nodes) { $nodeUtil('after', el, nodes) },
		before: function(el, nodes) { $nodeUtil('before', el, nodes) },
		replace: function(el, nodes) { $nodeUtil('replace', el, nodes) },
		remove: function(el, nodes) { $nodeUtil('remove', el, nodes) }
	}
	function $each(obj, Fn) {
		var el = typeof obj === 'string' ? document.querySelectorAll(obj) : obj;
		Array.prototype.slice.call(el, 0).forEach(Fn)
	}
	function $setup(obj, attr, events) {
		var el = typeof obj === 'string' ? document.createElement(obj) : obj;
		if (attr) {
			for (var key in attr) {
				attr[key] === undefined ? el.removeAttribute(key) :
				key === 'html'    ? el.innerHTML   = attr[key] :
				key === 'text'    ? el.textContent = attr[key] :
				key === 'value'   ? el.value       = attr[key] :
				key === 'checked' ? el.checked     = attr[key] :
				el.setAttribute(key, attr[key]);
			}
		}
		if (events) {
			for (var key in events) {
				el.addEventListener(key, events[key], false);
			}
		}
		return el;
	}
	function $nodeUtil(p, el, nodes) {
		var i, node, Child, Parent = el.parentNode;
		if (typeof el === 'string')
			el = document.querySelector(el);
		if (nodes && !Array.isArray(nodes))
			nodes = [nodes];
		switch (p.toLowerCase()) {
			case 'append':
				for (i = 0, len = nodes.length; i < len; i++) {
					if (nodes[i])
						el.appendChild(nodes[i]);
				}
				break;
			case 'remove':
				$each(el, function(child) {
					child.parentNode.removeChild(child);
				});
				break;
			case 'replace':
				Parent.replaceChild(nodes[0], el);
				break;
			default:
				switch (p.toLowerCase()) {
					case 'after': Child = el.nextSibling;
						break;
					case 'before': Child = el;
						break;
					case 'prepend': Child = el.childNodes[0], Parent = el;
				}
				for (i = 0; node = nodes[i++];) {
					Parent.insertBefore(node, Child);
				}
		}
	}
	function $route(el, Fn) {
		while (el) {
			var tn = (typeof Fn === 'string' ? el.querySelector(Fn) : Fn(el));
			if (tn)
				return (typeof tn === 'object' ? tn : el);
			el = el.parentNode;
		}
	}
	function probeStore(name, val, sess) {
		var stor = sess ? sessionStorage : localStorage;
		try {
			stor.setItem(name, val);
		} catch(e) {
			stor.removeItem(name);
			stor.setItem(name, val);
		}
	}
	function setlSValue(name, value, sess) {
		if (typeof name === 'object') {
			for (var key in name) {
				probeStore(key, (name[key] === null ? value : name[key]), sess);
			}
		} else {
			probeStore(name, value, sess);
		}
	}
	function getlSValue(name, def, sess) {
		var stor = sess ? sessionStorage : localStorage;
		if (name in stor) {
			var v = stor.getItem(name);
			v = v == 'false' ? false : 
				v == 'true' ? true : v;
			return v;
		} else {
			probeStore(name, def, sess);
			return def;
		}
	}
	function fallback(e) {
		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue = false;
	}
	window._z = _z;
})();

function MagicExtension() {
	var hideinfo, showinfo, postForm, pfplaceh, topForm, delForm, deli, pass, lng, mEl, Chanabira, Nagato,
		unread_count = 0, lceche = {}, 
	HM = {
		MC: _z.getlSVal('EmbedIn', 1),
		Sage: false, zIndex: 0, DragableObj: null, Played: null, LastKey: null,
		LoadedPosts: {}, VActive: [], RepliesMap: {}, AlbumArts: {}, URL: ParseUrl(),
		LinksMap: JSON.parse(_z.getlSVal('LinksCache', '{}', true)), 
		oEmbedAPI: _z.getlSVal('oEmbedAPI', true),
		maXrating: _z.getlSVal('maXrating', 'SFW'),
		RemoveExif: _z.getlSVal('RemoveExif', true),
		AutoUpdate: _z.getlSVal('AutoUpdate', true, true),
		SoundNotify: _z.getlSVal('SoundNotify', false, true),
		AttachPopups: _z.getlSVal('AttachPopups', true),
		RemoveFileName: _z.getlSVal('RemoveFileName', false),
		DiscloseTextSpoilers: _z.getlSVal('DiscloseTextSpoilers', false),
	},
	Megia = {
		'video': new MagicContent(),
		'scbc': new MagicContent(),
		'docs': new MagicContent(true),
		'pdf': new MagicContent(true)
	},
	Target = {
		board: HM.URL.board,
		tid: HM.URL.thread,
		thread: function(num) {
			return document.getElementById('thread_'+ (num || Target.tid));
		},
		last: function() {
			var tlel = Target.thread().lastElementChild;
			return tlel.nodeName === 'FORM' ? tlel.previousElementSibling : tlel;
		}}, 
	Files = {
		audio: ['flac', 'alac', 'wav', 'm4a', 'm4r', 'aac', 'ogg', 'mp3', 'opus'],
		video: ['webm', 'ogv', 'ogm', 'mp4', 'm4v', 'flv', '3gp', 'swf'],
		image: ['jpeg', 'jpg', 'png', 'svg', 'gif'],
		arch: ['zip', 'rar', '7z']},
	KeyCodes = {
		symbs: ['"', '*', '(', '`', '%', '~'],
		codew: ['{', '[', '(', '\'', '"'],
		quots: ['^', '>']},
	LC = {
		lng: ['en', 'ru'],
		file: ["File", "Файл"],
		repl: ["Reply", "Ответ"],
		hide: ["Hide", "Скрыть"],
		edit: ["Edit", "Изменить"],
		hide: ["Hide", "Скрыть"],
		newp: [" new ", " новых "],
		allw: ["allowed", "раскрытых"],
		omit: [" omited ", " ответов "],
		delp: [" deleted ", " удаленных "],
		pmod: [' pre-moderated', ' на премодерации'],
		wsec: ['Wait a Second...', 'Секунду...'],
		subscrb: ["Subscribe", "Отслеживать"],
		postdel: ["Post is deleted.", "Пост удалён."],
		txtspoils: ["Disclose text spoilers", "Раскрывать текстовые спойлеры"],
		clck_img_to: [" - Click the image", " - Нажмите на картинку"],
		cens: ['Your censorship settings forbid this file.', 'Ваши настройки цензуры запрещают этот файл.'],
		expd: [" to expand", " для увеличения"],
		vitf: [" to view this file", " для просмотра"],
		pvid: [" to play video", " для воспроизведения"],
		allw: ["allowed", "раскрытых"],
		remv: ["Remove", "Убрать"],
		clos: ["Close", "Закрыть"],
		page: [" page", " страниц"],
		line: [" line", " строк"],
		all: [" All", " все"],
		add: ["Add", "Добавить"],
		names: {
			'en': ['Anonymous', 'Developer', 'Lawrense', 'Anonymous Expert', 'Slowpoke', 'Experimenter'],
			'ru': ['Анонимус', 'Доброкодер', 'Лоуренс', 'Анонимный эксперт', 'Добропок', 'Экспериментатор']
		},
		tm: {
			's': ['sec', 'cек'],
			'm': ['min', 'мин'],
			'h': ['h', 'ч']
		},
		few: {
			'u-a': ["\'s", "а"],
			'u-b': ["s", "ов"],
			'u-c': ["s", "ы"],
			'u-d': ["\'s", "и"],
			'en': ["s", ""],
			'ru': ["", "а"]
		},
		Month: [
			["January"  , "Январь"  ],
			["February" , "Февраль" ],
			["March"    , "Март"    ],
			["April"    , "Апрель"  ],
			["May"      , "Май"     ],
			["June"     , "Июнь"    ],
			["July"     , "Июль"    ],
			["August"   , "Август"  ],
			["September", "Сентябрь"],
			["October"  , "Октябрь" ],
			["November" , "Ноябрь"  ],
			["December" , "Декабрь" ]
		],
		Weekday: [
			["(Sun)", "(Вс)"],
			["(Mon)", "(Пн)"],
			["(Tue)", "(Вт)"],
			["(Wed)", "(Ср)"],
			["(Thu)", "(Чт)"],
			["(Fri)", "(Пт)"],
			["(Sat)", "(Cб)"]
		]
	}
	/***--[ Utilites ]--***/
	Array.prototype.isThere = matchIndex
	String.prototype.isThere = matchIndex
	String.prototype.allReplace = function(obj, r) {
		var retStr = this;
		for (var x in obj) {
			retStr = retStr.replace((r ? x : new RegExp(x, 'g')), obj[x])
		}
		return retStr
	}
	String.prototype.repeat = function(num) {
		return new Array(num + 1).join(this);
	}
	String.prototype.fext = function() {
		return this.split('.').pop().toLowerCase();
	}
	String.prototype.hashCode = function() {
		var hash = 0, i, chr, len;
		if (this.length == 0) return hash;
		for (i = 0, len = this.length; i < len; i++) {
			chr   = this.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}
	function matchIndex(str) {
		return this.indexOf(str) >= 0;
	}
	function setupOptions(obj, option, sess) {
		if (obj.type === 'checkbox')
			val = obj.checked;
		if (obj.tagName === 'SELECT')
			val = obj.value;
		HM[option] = val;
		_z.setlSVal(option, val, sess);
	}
	
	function getVSize(arg) {
		var out, n = _z.getlSVal('VideoSize', 2),
			w = (n == 4 ? 854 : n == 3 ? 720 : n == 2 ? 480 : 360),
			h = (n == 4 ? 576 : n == 3 ? 480 : n == 2 ? 360 : 270);
		switch (arg) {
			case 'html' : out = 'width="'+w+'" height="'+h+'"';
				break;
			case 'value': out = n;
				break;
			case 'text' : out = w+'×'+h;
				break;
			default     : out = [w, h];
		}
		return out;
	}
	function escapeUrl(url) {
		var eUrl = encodeURI(url).allReplace({'%2?5?E2%2?5?80%2?5?8B': '', '%2?5?3C/?\\w*%2?5?3E': '', '%2?5?22': ''});
		return decodeURI(eUrl);
	}
	function getPageName(url, r) {
		var a = url.split('/'), p = a.pop(), out = !p ? a.pop() : p;
		return r ? out : decodeURIComponent(out);
	}
	function ParseUrl(url) {
		var m = (url || document.location.href).match(/(?:https?:\/\/([^\/]+))?\/([^\/]+)\/(?:(\d+)|res\/(\d+)|(\w+))(?:\.x?html)?(#i?(\d+))?/);
		return m ? {host: m[1], board: m[2], page: m[3], thread: m[4], desk: m[5], pointer: m[6], pid: m[7]} : {};
	}
	function GetElements(el) { 
		var node = el || document;
		return { posts: node.getElementsByClassName('post'),
			images: node.querySelectorAll('.file > a > img.thumb[onclick^="expand_image"], .file > a[href$=".svg"] > img'),
			hoos: node.querySelectorAll('.reply-button, .reply-link, .cm-button, .spr-image, .ma-button, .sp-r'),
			links: node.querySelectorAll('.message a:not(#cm-link):not(.reply-link)'),
			elements: node.querySelectorAll('.reflink, .file > a[href$=".swf"] > img, img[alt^="r-1"]:not(.spr-image), img[alt="unrated"]:not(.spr-image), img[alt="illegal"]:not(.spr-image), .file > a > img[src="/thumb/generic/sound.png"], .file > a[href$=".webm"] > img, .file > a[href$=".pdf"] > img, .file > a > img[onclick^="open_url"]')
		}
	}
	function _show (el) { el.classList.remove('hidout') }
	function _shide(el) { el.classList.toggle('hidout') }
	function _hide (el) { el.classList.add('hidout') }
	function _cid(pid) {
		var n = new RegExp(/(\d+)/).exec(pid);
		return Number((n[1] || 0));
	}
	function _unc(str, n) {
		return str ? str : (n || 'Unknown');
	}
	function _stub(c) {
		var stb = _z.setup('div', {'html': c}, null);
		return stb.firstElementChild;
	}
	function _bitonum(arr, hex) {
		var hexNum = "";
		for (var i = 0; i < arr.length; i++) {
			hexNum += arr[i].toString(16);
		}
		return hex ? '0x'+ hexNum : parseInt(hexNum, 16);
	}
	function _b64Str(arr) {
		var base64String = "";
		for (var i = 0; i < arr.length; i++) {
			base64String += String.fromCharCode(arr[i]);
		}
		return btoa(base64String)
	}
	function _urlHash(url) {
		return url.replace(/https?:\/\//, '').hashCode().toString();
	}
	
	/************************************************************************/
	function getDataResponse(uri, Fn) {
		var apiReq = new XMLHttpRequest();
		apiReq.open('GET', uri, true);
		apiReq.onreadystatechange = function() {
			if (this.readyState !== 4)
				return;
			if (this.status === 304) {
				console.log('304 ' + this.statusText);
			} else {
				try {
					var json = JSON.parse(this.responseText);
				} catch(e){
					console.log(e.toString())
				} finally {
					Fn(this.status, this.statusText, (json || this.responseText), this);
					Fn = null;
				}
			}
		}
		apiReq.send(null);
	}
	function getFileReaderData(readAs, file, Fn) {
		var reader = new FileReader();
		reader.onload = function() {
			if (this.readyState < 1) {
				console.log('No data has been loaded yet.');
				return;
			}
			if (this.error) {
				console.log(this.error);
			} else {
				try {
					var data = this.result;
				} catch(e) {
					console.log(e.toString());
				} finally {
					Fn(data, this);
					Fn = null;
				}
			}
		}
		switch (readAs.toLowerCase()) {
			case 'text': reader.readAsText(file, 'UTF-8');
				break;
			case 'string': reader.readAsBinaryString(file);
				break;
			case 'dataurl': reader.readAsDataURL(file);
				break;
			case 'arraybuffer': reader.readAsArrayBuffer(file);
		}
	}
	
	function getKeyByValue(obj, value) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				if (Array.isArray(obj[prop])) {
					if (obj[prop].isThere(value))
						return prop;
				} else if (obj[prop] === value)
					return prop;
			}
		}
	}
	
	function getElementByXpath(path, value) {
		var v = (value || 0)
		var TYPE = [
			'ANY_TYPE',
			'NUMBER_TYPE',
			'STRING_TYPE',
			'BOOLEAN_TYPE',
			'UNORDERED_NODE_ITERATOR_TYPE',
			'ORDERED_NODE_ITERATOR_TYPE',
			'UNORDERED_NODE_SNAPSHOT_TYPE',
			'ORDERED_NODE_SNAPSHOT_TYPE',
			'ANY_UNORDERED_NODE_TYPE',
			'FIRST_ORDERED_NODE_TYPE']
		return document.evaluate(path, document.body, null, XPathResult[TYPE[v]], null);
	}
	
	function cleanStringForXpath(str)  {
		var parts  = str.match(/[^'"]+|['"]/g);
		parts = parts.map(function(part){
			if (part === "'")  {
				return '"\'"'; // output "'"
			}
			if (part === '"') {
				return "'\"'"; // output '"'
			}
			return "'" + part + "'";
		});
		return "concat(" + parts.join(",") + ")";
	}
	
	function difference(array1, array2) {
		var result = [];
		if (array2.length == 0) {
			return array1;
		}
		for (var i = 0; i < array1.length; i++) {
			if (!array2.isThere(array1[i])) {
				result.push(array1[i]);
			}
		}
		return result;
	}
	
	function bytesMagnitude(bytes) {
		return (bytes < 1024 ? bytes +' B' :
				bytes < 1024 * 1024 ? (bytes / 1024).toFixed(2) +' KB' :
				bytes < 1024 * 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(2) +' MB' :
											(bytes / 1024 / 1024 / 1024).toFixed(2) +' GB');
	}
	
	function getDateTime(jsonDT) {
		var date = new RegExp(/(?:(\d*)\-(\d*)\-(\d*)|(\d*)\s(\w*)\s(\d*)\s\(\w*\))\s(\d*\:\d*)(\:\d*)?/gm).exec(jsonDT),
			year = (date[1] || date[6]), month = (date[2] || date[5]), day = (date[3] || date[4]), hmin = date[7], sec = (date[8] || ''),
			uDate = new Date(month +" "+ day +", "+ year +" "+ hmin + " GMT+0300"),
			Time = uDate.toLocaleTimeString(),
			Month = LC.Month[uDate.getMonth()][lng],
			Weekday = LC.Weekday[uDate.getDay()][lng],
			Day = uDate.getDate(), Year = uDate.getFullYear();
		return '\n<span class="posterdate">'+ (Day < 10 ? "0" : '') + Day +" "+ Month +" "+ Year +" "+ Weekday +" "+
			(Time.length === 7 ? "0" + Time.slice(0, 4) : Time.slice(0, 5)) +'<span class="t-sec">'+ sec +'</span></span>';
	}
	
	function getDefaultName(name) {
		var i, l = LC.lng[lng];
		if (name) {
			i = LC.names['ru'].indexOf(name)
			return (i >= 0 ? LC.names[l][i] : name)
		} else {
			switch (HM.URL.board) {
				case 's'   : i = 1; break;
				case 'sw'  : i = 2; break;
				case 'wn'  : i = 3; break;
				case 'slow': i = 4; break;
				case 'mad' : i = 5; break;
				default    : i = 0;
			}
			return LC.names[l][i]
		}
	}
	
	function markAsRead(e) {
		unread_count--;
		this.removeEventListener('click', markAsRead, false);
		this.classList.remove('new');
		Tinycon.setBubble(unread_count);
	}
	
	/*** Charming Hanabira ***/
	//* @ original code 	http://dobrochan.com/js/hanabira-0.5.1311-.js
	//* @ copyright 		Dobrochan
	function CharmingHanabira(h) {
		var Chana = this, thread_updating, play_notify, ref_tamplate = '<a class="reply-link r{cl}" href="/r{brd}/res/r{tid}.xhtml#ir{pid}" onclick="Highlight(event, \'r{pid}\')">&gt;&gt;r{L}r{pid}</a>',
			Timer = { id: 0, offset: 0, ql: UpdateInterval(0) },
			Count = { dif: 0, new: 0, del: 0, mod: 0 },
			Notif = _z.setup(new Audio('/src/mp3/1406/musbox.mp3'), {}, {
				'play': function(e) { play_notify = true },
				'ended': function(e) { play_notify = false }
			}),
			ChLC = {
				snd_notify: ["Sound Notifications", "Звуковые уведомления"],
				mrk_to_del: ["Mark to delete", "Отметить для удаления"],
				loadnew: ["Load New Posts", "Подгрузить посты"],
				updprog: ["Updating...", "Обновление..."],
				updauto: ["Autoupdate Thread", "Автообновление треда"],
				dsl: {
					'quet': ['Quet Mode', 'Тихий режим'],
					'autotimer': ['Аutotimer', 'Автотаймер'],
					'manual': ['Manual', 'Вручную']
				}
			}
		this.$ = function(child) { return this['NewPostLoader'].querySelector(child) }
		this['NewPostLoader'] = _z.setup('span', {'id': 'new-post-loader', 'html': '<div id="update-stat"><a>'+ ChLC.loadnew[lng] +
				'</a></div><label><input id="notif-chbx" type="checkbox" hidden><span class="checkarea"></span>\n'+ ChLC.snd_notify[lng] +
				'</label><br><label><input id="upd-chbx" type="checkbox" hidden><span class="checkarea"></span>\n'+ ChLC.updauto[lng] +
				'</label><ul class="dropdown line-sect" id="timer-update-sets"><li class="dropdown-toggle"><label class="dropdown-label el-li t-sec">'+
				(ChLC.dsl[Timer.ql.value] || checkHTime(Timer.ql.value))[lng] +'</label><ul class="dropdown-menu"><li class="dropdown-item el-li" id="quet-mode-set">'+
				ChLC.dsl['quet'][lng] +'</li><li class="dropdown-item el-li" id="autotimer-set">'+ ChLC.dsl['autotimer'][lng] +'</li><li class="dropdown-item el-li" id="manual-int-set">'+
				ChLC.dsl['manual'][lng] +':\n<input id="int-val" max="180" min="15" type="number"></li></ul></li></ul>'
			}, null);
		this['UpdateStat'] = this.$('#update-stat');
		this['PostsCount'] = _z.setup('label', {'id': 'post-count', 'class': 'etch-text', 'text': HM.Elems.posts.length + LC.omit[lng]}, null);
		this['AllowedPosts'] = _z.setup('span', {'id': 'allowed-posts', 'class': 'etch-text', 'text': ' | '+ LC.allw[lng]}, null);
		this['LoadButton'] = _z.setup(this['UpdateStat'].firstChild, {}, {
				'click': updateThread
			});
		this['SoundNotify'] = _z.setup(this.$('#notif-chbx'), {'checked': HM.SoundNotify}, {
				'change': function(e) {
					setupOptions(this, 'SoundNotify', true);
				}
			});
		this['AutoUpdate'] = _z.setup(this.$('#upd-chbx'), {'checked': HM.AutoUpdate}, {
				'change': function(e) {
					setupOptions(this, 'AutoUpdate', true);
					Chana.updateTimer();
				}
			});
		this['setInterval'] = _z.setup(this.$('#int-val'), {'value': Timer.ql.int}, null);
		this['UpdateModeMenu'] = _z.setup(this.$('#timer-update-sets'), {}, {
				'click': function(e) {
					var val, tbox = this.firstElementChild.firstElementChild;
					if (e.target.tagName === 'INPUT')
						return;
					if (e.target.classList[0] === 'dropdown-item') {
						switch (e.target.id) {
							case 'manual-int-set':
								val = Chana['setInterval'].value;
								tbox.textContent = checkHTime(val)[lng];
								break;
							default:
								val = e.target.id.split('-')[0];
								tbox.textContent = e.target.textContent;
						}
						_z.setlSVal('UpdateMode', val, true);
					}	
					this.firstElementChild.classList.toggle('active');
				}
			});
		this.updateThread = updateThread;
		this.genReplyMap = function(posts) {
			_z.each(posts, function(post) {
				var cid = _cid(post.id), replies_links = new Array(0);
				if (HM.RepliesMap[cid]) {
					_z.each(HM.RepliesMap[cid], function(Id) {
						replies_links.push(ref_tamplate.allReplace({'r{brd}': Id[0], 'r{cl}': 'cview', 'r{tid}':
						(!Id[1] ? Id[2] : Id[1]), 'r{pid}': Id[2], 'r{L}': (Id[3] ? '❪'+ Id[0].toUpperCase() +'❫' : '')}));
					});
					var replies_div_arr = post.getElementsByClassName('replylinks'),
						replies_div = _z.setup('div', {'class': 'replylinks'}, null);
					if (replies_div_arr.length == 0)
						post.getElementsByClassName('abbrev')[0].appendChild(replies_div);
					else
						replies_div = replies_div_arr[0];
					replies_div.innerHTML = LC.repl[lng] + LC.few['u-c'][lng] +': '+ replies_links.join(', ');
					attachEvents(replies_div);
				}
			});
		}
		this.updateTimer = function() {
			clearTimeout(Timer.id);
			Timer.ql = UpdateInterval(Timer.offset);
			Timer.id = setTimeout(function() {
				if (HM.AutoUpdate) {
					if (Timer.ql.value === 'quet') {
						getDataResponse('/api/thread/'+ HM.URL.board +'/'+ HM.URL.thread +'.json?new_format',
							function(status, sText, json, xhr) {
								if (json.result) {
									updateCount(json.result.posts_count)
									var postStat = '( '+ (Count.new > 0 ? '+'+ Count.new + LC.newp[lng] : '') +
										' • '+ (Count.del < 0 ? Count.del + LC.delp[lng] : '') +' • '+ (Count.mod > 0 ? Count.mod + LC.pmod[lng] : '') +')';
									Chana['PostsCount'].textContent = HM.Elems.posts.length + LC.omit[lng] + postStat;
								}
							});
						Chana.updateTimer();
					} else
						updateThread(true)
				}
			}, Timer.ql.int * 1000);
		}
		function UpdateInterval(offset) {
			var t, val = _z.getlSVal('UpdateMode', 'autotimer', true);
			if (isNaN(val))
				t = 45 + (offset > 135 ? 135 : offset);
			else
				t = val < 15 ? 45 : val;
			return { value: val, int: t }
		}
		function checkHTime(x) {
			var s, m, v = 's';
			if (x > 59) {
				s = (x % 60).toString()
				m = (x / 60).toString().split('.')[0]
				x = m + ':'+ (s.length < 2 ? '0'+ s : s)
				v = 'm'
			}
			return ['every '+ x +' '+ LC.tm[v][0] +'.', 'каждые '+ x +' '+ LC.tm[v][1] +'.'];
		}
		function updateCount(jPC) {
			var i = (jPC + Count.mod) - HM.Elems.posts.length - Count.dif,
				n = i > 0 ? i : 0, d = i < 0 ? i : 0;
				Count.dif += i; Count.new += n; Count.del += d;
		}
		function updateThread(e) {
			if (thread_updating)
				return;
			thread_updating = true;
			Chana['LoadButton'].textContent = ChLC.updprog[lng];
			getDataResponse('/api/thread/'+ HM.URL.board +'/'+ Target.tid +'/new.json?new_format&message_html&last_post='+ _cid(Target.last().id),
			function(status, sText, json, xhr) {
				var i, temp, el, pCount, len, errorMsg;
				if (status !== 200 || json.error) {
					errorMsg = !json.error ? status +' '+ sText : json.error.message +' '+ json.error.code;
					Chana['UpdateStat'].replaceChild(_z.setup(mEl['WarningMsg'], {
						'text': errorMsg, 'style': ''}, null), Chana['LoadButton']);
					mEl.funct = function(e) {
						if (mEl['iteration'] >= 8) {
							Chana['UpdateStat'].replaceChild(Chana['LoadButton'], mEl['WarningMsg']);
							mEl['iteration'] = 0;
							Chana.updateTimer();
						}
					}
				} else {
					pCount = json.result.posts_count;
					el = json.result.posts;
					len = el ? el.length : 0;
					Count.dif = Count.new = 0;
					if (len > 0) {
						Timer.offset = 0;
						for (i = 0; i < len; i++) {
							temp = getHanabiraPost(el[i]);
							Target.thread().appendChild(temp[0]);
						}
						Tinycon.setBubble(unread_count);
					} else if (e === true)
						Timer.offset += 15;
				}
				if (e && !errorMsg) {
					if (HM.Elems.posts.length != pCount + Count.mod) {
						updateCount(pCount)
						getHanabiraFullThread();
					} else
						Chana['PostsCount'].textContent = pCount + LC.omit[lng] + (Count.mod > 0 ? ' ( +'+ Count.mod + LC.pmod[lng] +' )' : '');
					Chana.updateTimer();
				}
				Chana.genReplyMap(HM.Elems.posts);
				Chana['LoadButton'].textContent = ChLC.loadnew[lng];
				thread_updating = false;
			});
		}
		function getHanabiraFullThread() {
			getDataResponse('/api/thread/'+ HM.URL.board +'/'+ HM.URL.thread +'/all.json?new_format&message_html',
			function(status, sText, json, xhr) {
				var i, jsonPosts = json.result.posts, pCount = json.result.posts_count;
				function pnid(n) { return !HM.Elems.posts[n] ? 99999999 : _cid(HM.Elems.posts[n].id) }
				function jpid(n) { return !jsonPosts[n] ? 99999999 : jsonPosts[n].display_id }
				if (jsonPosts.length == HM.Elems.posts.length) {
					Count.dif = Count.del = 0;
					Count.mod = HM.Elems.posts.length - pCount;
				} else {
					for (i = 0; i < (HM.Elems.posts.length + Count.new); i++) {
						if (pnid(i) < jpid(i)) {
							_z.setup(HM.Elems.posts[i], {'class': "deleted"}, null)
							.querySelector('.doubledash').setAttribute('style', 'display:inline-block;');
						}
						if (pnid(i) > jpid(i)) {
							var derefl = ref_tamplate.allReplace({'r{brd}': HM.URL.board, 'r{tid}': HM.URL.thread, 'r{pid}': jpid(i), 'r{L}': '', 'r{cl}': 'nview'}),
								temp = getHanabiraPost(jsonPosts[i], [json.result.archived, json.result.autosage]),
								s = Chana['AllowedPosts'].querySelector('.reply-link') ? ', ' : ': ';
							if (!HM.Elems.posts[i])
								Target.thread().appendChild(temp[0]);
							else
								_z.before(HM.Elems.posts[i], temp[0]);
							_z.after(Chana['PostsCount'], Chana['AllowedPosts'])
							Chana['AllowedPosts'].insertAdjacentHTML('beforeend', s + derefl);
							attachEvents(Chana['AllowedPosts'])
						}
						if (pnid(i) < jpid(i)) {
							_z.setup(HM.Elems.posts[i], {'class': "deleted"}, null)
							.querySelector('.doubledash').setAttribute('style', 'display:inline-block;');
						}
					}
					Tinycon.setBubble(unread_count);
					Count = { dif: 0, new: 0, del: 0, mod: 0 }
					if (pCount !== HM.Elems.posts.length && jsonPosts.length === HM.Elems.posts.length) {
						Count.mod = HM.Elems.posts.length - pCount;
					}
				}
				Chana['PostsCount'].textContent = pCount + LC.omit[lng] + (Count.mod > 0 ? ' ( +'+ Count.mod + LC.pmod[lng] +' )' : '');
			});
		}
		function getHanabiraPost(postJson, margArr, mapArr) {
			var threadId = mapArr ? mapArr[1] : Target.tid,
				postId = postJson.display_id,
				board = mapArr ? mapArr[0] : HM.URL.board,
				files = postJson.files,
				len = files.length,
				op = postJson.op,
				hidden = checkIfHidden(),
				wrap = _z.setup((op ? 'div' : 'table'), {'id': 'post_'+ postId, 'class': (op ? 'oppost' : 'replypost') +' post'}, null),
				delicon = '<a class="delete icon"><input type="checkbox" id="delbox_r{post_id}" class="delete_checkbox" value="'+ postJson.thread_id +
					'" name="r{post_id}"><img src="/images/blank.png" title="'+ ChLC.mrk_to_del[lng] +'" alt="✕" onclick="this.parentNode.classList.toggle(\'checked\')"></a>\n',
				html = (op ? '' : '<tbody><tr><td class="doubledash">&gt;&gt;</td><td id="replyr{post_id}" class="reply new '+ (hidden ? 'by-'+ hidden[0] +' autohidden' : '') +'">') +
					'<a name="ir{post_id}"></a><label>'+ 
						(op ? '<a class="hide icon" onclick="hide_thread(event, \'r{board}\',r{post_id});" href="/api/thread/r{board}/r{post_id}/hide.redir"><img src="/images/blank.png" title="'+ LC.hide[lng] +'" alt="﹅"></a>\n'+
							delicon + '<a class="unsigned icon" onclick="sign_thread(event, \'r{board}\',r{post_id});"><img src="/images/blank.png" title="'+ LC.subscrb[lng] +'" alt="✩"></a>\n' : delicon) +
						(board === 'mad' ? '<span class="iphash">'+
							'<span class="ipmark" style="background:rgba(0,0,0,.5)">&nbsp;</span><span class="ipmark" style="background:rgba(255,255,255,.5)">&nbsp;</span>'+
							'<span class="ipmark" style="background:rgba(25,25,25,.6)">&nbsp;</span><span class="ipmark" style="background:rgba(99,99,99,.6)">&nbsp;</span>'+
							'<span class="ipmark" style="background:rgba(175,175,175,.6)">&nbsp;</span></span>\n<img class="geoicon" src="/src/png/1408/polandball_kawaii_16.png" alt="(^ ^)" title="Polandball (^ ^)">\n' : '') +
				'<span class="replytitle">'+ postJson.subject +'</span>\n<span class="postername">'+ getDefaultName(postJson.name) +'</span>\n'+ (op && margArr[0] ? '<img src="/images/archive.gif" alt="В архиве" title="В архиве">\n' :
				'') + (op && margArr[1] ? '<img src="/images/autosage.gif" alt="Бамп-лимит" title="Бамп-лимит">\n' : '') +'<span class="posterdate">'+ getDateTime(postJson.date) +
				'</span>\n</label><span class="reflink"><a onclick="Highlight(0, r{post_id})" href="/r{board}/res/r{thread_id}.xhtml#ir{post_id}">No.r{post_id}</a></span>\n<span class="cpanel"></span><br>';
			for (var i = 0; i < len; i++) {
				html += getHanabiraFile(files[i], postJson.post_id, board, threadId, postId, (len === 1));
			}
			wrap.insertAdjacentHTML('afterbegin', html.allReplace({'r{board}': board, 'r{thread_id}': threadId, 'r{post_id}': postId}) + 
				(len > 1 ? '<br style="clear: both">' : '') +'<div class="postbody">'+ postJson.message_html +'</div><div class="abbrev"></div>' +
				(op ? '' : '</td>'+ (hidden ? '<td class="reply hinfo-stub"><label class="'+ (hidden[0] === 'Title' ? 'replytitle' : 'postername') +
					' t-sec font-s">'+ hidden[1] +'</label> hidden post No.'+ postId +'</td>' : '') +'</tr></tbody>'));
			if (!mapArr) {
				unread_count++;
				if (!op)
					wrap.querySelector('.reply.new').addEventListener('click', markAsRead, false);
				if (HM.SoundNotify && !play_notify)
					Notif.play();
			}
			if (margArr)
				Chana.genReplyMap([wrap]);
			attachEvents(wrap);
			var wels = GetElements(wrap);
				hooElements(wels.elements);
				hooLinks(wels.links);
			function checkIfHidden() {
				var result; _z.each([
					['Title', postJson.subject],
					['Nametrip', postJson.name]],
				function(type) {
					var m, i, f, kwods = HM.Settings.Keywords[type[0]],
						keys = kwods.keys.split(', ');
					if (kwods.apply) {
						for (i = 0; i < keys.length; i++) {
							m = /^\*(.+)\*$|^\*(.+)|(.+)\*$/.exec(keys[i]);
							f = m ? (m[1] || m[2] || m[3]) : keys[i];
							if (type[1].isThere(f)) {
								result = [type[0], keys[i]]
								break;
							}
						}
					}
				});
				return result;
			}
			return [wrap, (op ? wrap.firstChild : wrap.firstChild.firstChild.lastChild)];
		}
		function getHanabiraFile(file, pid, brd, tId, pId, ONE) {
			var name, info, edit, action = '', m = 0.01572,
				src = file.src, fid = file.file_id,
				fmd = file.metadata, imgW = fmd.width,
				imgH = fmd.height, rating = file.rating,
				size = bytesMagnitude(file.size), filename = getPageName(src),
				maXr = HM.maXrating.toLowerCase(), ext = filename.fext(),
				type = file.type === 'code' ? 'text' : !file.type ? fmd.type : file.type,
				R = maXr === rating || maXr.match(/\d+/) >= rating.match(/\d+g?/) || 
					rating === 'sfw' ? false : true,
				thumb = R ? 'images/'+ rating +'.png' : file.thumb,
				thumbW = thumb !== file.thumb ? 200 : file.thumb_width,
				thumbH = thumb !== file.thumb ? 200 : file.thumb_height,
				isImage = ['image', 'vector'].isThere(type);
			if (brd === 'b' || brd === 'rf') {
				name = isImage ? getPageName(thumb).split('s')[0] +'.'+ ext :
						type == 'video' ? fmd["File Name"] : fid.toString() + pid.toString() +'.'+ ext;
			} else {
				name = !ONE && filename.length > 17 ? filename.substring(0, 17) + '...' : filename;
			}
			if (isImage) {
				info = ext.slice(0, 1).toUpperCase() + ext.slice(1) +', '+ size +', '+ imgW +'×'+ imgH;
				edit = '/utils/'+ type +'/edit/'+ fid +'/'+ pid;
				action = R ? '' : 'contextmenu="image-context" oncontextmenu="$(\'#image-context\').attr({src:this.parentNode.href, edit:\''+ edit +'\'})" onclick="expand_image(event, '+ imgW +', '+ imgH +')"';
			} else {
				var meta, metatype = type == 'flash' ? 'Flash' : fmd.type,
					lines = fmd.lines, pages = fmd.pages, files = fmd.files_count;
				if (['text', 'archive'].isThere(type)) {
					action = 'onclick="open_url(\'/utils/'+ type +'/'+ fid +'/'+ pid +'\', \'_blank\')"'
				}
				if (type == 'text') {
					meta = lines + LC.line[lng] + (lines === 1 ? LC.few['ru'][lng] : lines < 5 ? LC.few['u-d'][lng] : LC.few['en'][lng] );
				}
				if (type == 'pdf') {
					meta = imgW +'×'+ imgH +', '+ pages + LC.page[lng] + (pages === 1 ? LC.few['ru'][lng] : pages < 5 ? LC.few['u-c'][lng] : LC.few['en'][lng] );
				}
				if (type == 'archive') {
					thumb = 'src/png/1405/archive-icon.png';
					meta = files +' '+ LC.file[lng].toLowerCase() + (files === 1 ? '' : files < 5 ? LC.few['u-a'][lng] : LC.few['u-b'][lng] );
				}
				if (type == 'video') {
					metatype = fmd["File Type"] == 'WEBM' ? 'WebM' : fmd["File Type"];
					size = fmd["File Size"];
					meta = fmd["Image Size"] +' @ '+ fmd["Duration"];
				}
				if (type == 'music') {
					var brate = (fmd.bitrate / 1000).toFixed(0) + ' kbps',
						srate = (fmd.sample_rate / 1000).toFixed(1) + ' kHz',
						trlen = (fmd.length * m).toFixed(2).replace('.', ':'),
						trnam = _unc(fmd.artist) +' — '+ _unc(fmd.album),
						trnum = _unc(fmd.tracknumber, '0') +'/'+ _unc(fmd.totaltracks, '0');
					meta = trlen +' @ '+ brate +' / '+ srate +'<br>'+ (!ONE && trnam.length > 40 ? trnam.substring(0, 40) +'<br>'+ trnam.slice(40) : trnam) +' / '+ _unc(fmd.title) +' ['+ trnum +']';
				}
				info = metatype +', '+ size + (!meta ? '' : ', '+ meta);
			}
			var filebtns = (type != 'music' && !R && ONE ? LC.clck_img_to[lng] + (type == 'video' ? LC.pvid[lng] : isImage ? LC.expd[lng] : LC.vitf[lng]) : '') +'<br>'+ (R ? LC.cens[lng] : '') +'</div>';
			var fileinfo = '<div class="fileinfo">'+ LC.file[lng] +': <a href="/'+ src +'" target="_blank" title="'+ filename +'">'+ name +'</a><br><em>'+ info +'</em>';
			var filethmb = '<a href="/'+ src +'" target="_blank"><img class="'+ (isImage && R ? 'spr-image thumb expanded rated"' : 'thumb" width="'+ thumbW +'" height="'+ thumbH +'"') +
				' src="/'+ thumb +'" '+ action +' alt="'+ (R ? rating : filename) +'"></a>\n</div>';
			var filediv = '<div id="file_'+ pId +'_'+ fid +'" class="file">';
			return (ONE ? fileinfo + filebtns + filediv + filethmb : filediv + fileinfo + filebtns + filethmb);
		}
		function BindCloseRef(reftab) {
			var tr = _z.setup('tbody', {'html': '<tr><td>'}, null),
				drag = _z.setup('span', {'class': 'dpop txt-btn'}, {
					'mousedown': function(e) {
						reftab.style['z-index'] = HM.zIndex + 1
						HM.DragableObj = { el: reftab, offsetY: 9, offsetX: 9 }
						return _z.fall(e) }}),
				close = _z.setup('span', {
					'class': 'cpop ty txt-btn',
					'title': LC.clos[lng]}, {
					'click': function(e) { reftab.remove() }}),
				closeAll = _z.setup('span', {
					'class': 'cpop all txt-btn',
					'title': LC.clos[lng] + LC.all[lng]}, {
					'click': RemoveAllRefs });
				_z.setup(reftab, {}, {
					'click': function(e) {
						HM.zIndex++
						reftab.style['z-index'] = HM.zIndex }
					}).appendChild(tr).click();
			_z.append(tr.firstChild.firstChild, [close, closeAll, drag]);
		}
		function BindRemoveRef(a, reftab) {
			var to, timer = function(e) {
				to = setTimeout(function() {
					reftab.remove()
				}, 300) }
			reftab.onmouseleave = a.onmouseleave = timer;
			reftab.onmouseenter = a.onmouseenter = function(e) {
				clearTimeout(to);
				to = 0;
			}
		}
		this.closeLastPopup = RemoveAllRefs;
		function RemoveAllRefs(e) {
			var popups = document.getElementsByClassName('popup'),
				i = popups.length - 1;
			if (popups[0]) {
				switch (e.type) {
					case 'keydown':
						if (i == 0)
							HM.zIndex = 0;
						popups[i].remove();
						break;
					case 'click':
						HM.zIndex = 0;
						_z.remove(popups);
						break;
				}
			}
		}
		this.MagicPostView = function(e) {
			var a = e.target, attach = HM.AttachPopups, L = ParseUrl(a.href),
				brd = L.board, tid = L.thread, pid = L.pid, op = tid === pid,
				postid = (op ? 'post_' : 'reply') + pid, id = brd +'-'+ postid,
				refl = _z.route(a, '.reflink a'), href = refl.getAttribute('href'),
				reftab = _z.setup('table', {'class': (op ? 'oppost popup' : 'popup'), 'id': 'ref-'+ id,
					'html': '<tbody><tr><td class="loading"><span class="waiting'+ Math.floor(Math.random() * 3) +
					' icon"><img src="/images/blank.png"></span>\n'+ LC.wsec[lng] +'</td></tr></tbody>'}, null),
				loading = reftab.querySelector('.loading'), active = document.getElementById('ref-'+ id),
				post = HM.LoadedPosts[id] || document.getElementById(postid);
			function add_mapping(mapp) {
				if (!mapp)
					return;
				mapp.classList.add('mapped');
				if (attach) {
					mapp.classList.add('locked');
					mapp.removeEventListener('mouseover', Chana.MagicPostView, false);
				} else {
					a.onmouseout = function(e) {
						mapp.classList.remove('mapped');
					}
				}
			}
			function set_style(r) {
				var w = window.innerWidth, mw,
					x = e.pageX, y = e.pageY + 30,
					wx = w - x, y2 = y - r.offsetHeight - 45;
				if (a.classList[1] !== 'cview') {
					if (y2 > 0)
						y = y2;
					if ((wx < 600 || wx < w / 2) && r.offsetWidth > wx) {
						mw = w - 400;
						x = null;
					}
				}
				r.setAttribute('style', 'top:'+ y +'px;max-width:'+
					(mw || wx) +'px;'+ (x == null ? 'right:0' : 'left:'+ x) +'px'+
					(attach ? ';z-index:'+ HM.zIndex : ''));
			}
			function binded(el) {
				var load = !el ? _z.setup('td', {'class': 'stub', 'text': LC.postdel[lng]}, null) :
					_z.setup((op ? el : el.parentNode.lastElementChild).cloneNode(true), {'id': 'load-' + id, 'class': undefined}, null);
				attachEvents(load);
				if (el && attach && (op ? true : el.parentNode.lastElementChild.classList[1] !== 'hinfo-stub')) {
					BindCloseRef(reftab);
				} else {
					BindRemoveRef(a, reftab);
				}
				_z.replace(loading, load);
				add_mapping(reftab.querySelector('a[href="'+ href +'"]'));
			}
			if (active) {
				var loc = active.querySelector('.locked');
				if (loc && loc.hash !== refl.hash) {
					loc.className = 'reply-link cview';
					attachEvents(active);
				}
				add_mapping(active.querySelector('a[href="'+ href +'"]'));
				set_style(active);
				return active.click();
			} else if (post) {
				binded(post == 'stub' ? null : post);
			} else if (HM.URL.thread == tid) {
				binded(null);
			} else {
				getDataResponse('/api/post/'+ brd +'/'+ tid +'/'+ pid +'.json?message_html&new_format'+ (op ? '&thread' : ''),
				function(status, sText, json, xhr) {
					var temp, node, tstat, jpost, ErrorMSG;
					if (status !== 200) {
						ErrorMSG = new MagicElements()['WarningMsg'];
						_z.replace(loading, _z.setup(ErrorMSG, {
							'text': status +' '+ sText, 'style': ''}, null));
						setTimeout(function() {
							reftab.remove();
						}, 7000)
						return;
					} else if (json.error) {
						node = 'stub';
					} else {
						tstat = op ? [json.result.threads[0].archived, json.result.threads[0].autosage] : true;
						jpost = op ? json.result.threads[0].posts[0] : json.result;
						temp = getHanabiraPost(jpost, tstat, [brd, tid, pid]);
						node = op ? temp[0] : temp[1];
					}
					HM.LoadedPosts[id] = node;
					binded(node == 'stub' ? null : node);
					hooLinks(GetElements(reftab).links);
					set_style(reftab);
				});
			}
			document.body.appendChild(reftab);
			set_style(reftab);
		}
	}
	
	function keyMarks(e) {
		var TextArea, TA;
		if (e.target.tagName === 'TEXTAREA') {
			TextArea = e.target;
			TA = true;
		} else {
			TextArea = Nagato['ReplyText'];
			TA = false;
		}
		var YRT = TextArea.id === 'yuki-replyText',
			CED = TextArea.id === 'code_edit_ta',
			key = String.fromCharCode(e.charCode),
			val = TextArea.value,
			end = TextArea.selectionEnd,
			start = TextArea.selectionStart,
			selected = val.substring(start, end),
			active = selected.length > 0;
			function autoselect() {
				if (!active) {
					var fw = val.substring(start, val.length).match(/^(.*?)(?:\s|$)/);
					return (fw[1] ? false : true);
				} else return true;
			}
		if (YRT && TA && KeyCodes.symbs.isThere(key)) {
			if (active) {
				key = KeyCodes.symbs.indexOf(key) >= 4 ? key + key : key;
				wmarkText(TextArea, key, (key === '(' ? ')' : key))
				return _z.fall(e);
			}
		}
		if (CED && TA && KeyCodes.codew.isThere(key)) {
			if (autoselect()) {
				wmarkText(TextArea, key,
					(key === '(' ? ')' :
					 key === '{' ? '}' :
					 key === '[' ? ']' : key))
				return _z.fall(e);
			}
		}
		if (YRT && KeyCodes.quots.isThere(key)) {
			var sSp = val.substring(start - 1, start);
			if (['\n', ''].isThere(sSp) || selected.isThere('\n')) {
				key = key === '^' ? '*' : key;
				wmarkText(TextArea, key +' ', '\n'+ key +' ');
				return _z.fall(e);
			}
		}
		if (TA && e.keyCode != 8) { HM.LastKey = key;
			if (TextArea.className === 'ta-inact') {
				TextArea.setSelectionRange(end, end);
				TextArea.removeAttribute('class');
			}
		}
	}
	
	/*** Wakabamark Buttons Engine ***/
	function wmarkText(TextArea, openTag, closeTag) {
		var	ins, ql, sp, c, s, e, val = TextArea.value,
			end = TextArea.selectionEnd,
			start = TextArea.selectionStart,
			selected = val.substring(start, end),
			ws = window.getSelection().toString(),
			getext = start === end ? ws : selected,
			cont = (typex()).exec(selected);
			switch (closeTag.slice(0, 1)) {
				case '+' : ins = true; break;
				case '\n': ql  = true; break;
				case '%' : sp  = true; break;
				case '`' : c   = true; break;
				case '~' : s   = true;
			}
			function typex(gmi) {
				return new RegExp('^(\\s*)(.*?)(\\s*)$', (gmi || ''))
			}
		if (ins) {
			return _z.setup(TextArea, {'value': val.substr(0, end) + openTag + val.substr(end)}, null)
					.setSelectionRange(start + openTag.length, start + openTag.length);
		}
		if (ql) {
			if (ws && ws != getext){
				start = end = TextArea.value.length;
				getext = ws; openTag = closeTag;
			}
			markedText = openTag + getext.replace(/\n/gm, closeTag);
		} else {
			e = c ? '`' : '';
			if (s && (selected.slice(0, 1) === '~' || val.substring(end, end + 1) === '~'))
				openTag = openTag.slice(0, 1), closeTag = closeTag.slice(0, 1);
			markedText = cont === null ? (sp || c ? openTag + e + '\n' + getext + '\n' + e + closeTag :
				selected.replace(typex('gm'), '$1'+ openTag +'$2'+ closeTag +'$3')) :
				cont[1] + openTag + cont[2] + closeTag + cont[3];
		}
		eOfs = markedText.length, sOfs = 0;
		if (cont != null && !cont[2] && !ql) {
			sOfs = openTag.length;
			eOfs = sOfs + selected.length;
		}
		_z.setup(TextArea, {'class': 'ta-inact', 'value': val.substring(0, start) + markedText + val.substring(end)}, null).focus();
		if (!TextArea.id.isThere('code'))
			_z.setlSVal('SafeText', JSON.stringify(TextArea.value), true);
		TextArea.setSelectionRange(start + sOfs, start + eOfs);
	}
	
	/*** Strike Converter ***/
	//* @ by 		DesuDesuTalk
	function StrikeConvert(TextArea) {
		var sregex = /(?:\~\~\~(.*?[^\s])\~\~\~)|(?:\~\~(.*?[^\s])\~\~)/g;
		TextArea.value = TextArea.value.replace(sregex,
		function(match, str, str2, len, prefix) {
			var sMarked, sT, lm;
			if (str) {
				sMarked = str.replace(/[^\s]+/g, function(word){ 
					return word + word.replace(/./g, '^H');
				});
			}
			if (str2) {
				var word = str2.trim().split(/\s+/g).length;
				if (word === 1)
					sT = '^H', lm = str2.length;
				else if (word > 1)
					sT = '^W', lm = word;
				sMarked = str2 + sT.repeat(lm);
			}
			return sMarked;
		})
	}
	
	function MagicContent(scr){
		var MaC = this;
		this['Frame'] = {};
		this['Container'] = document.createElement('div');
		this.iframe = _z.setup('iframe', {'frameborder': '0', 'scrolling': (scr ? 'auto' : 'no'), 'allowfullscreen': 'true', 'mozallowfullscreen': 'true', 'webkitallowfullscreen': 'true'}, null);
		this.flash = _z.setup('embed', {'type': 'application/x-shockwave-flash'}, null);
		this.html5m = _z.setup('video', {'controls': ''}, null);
		this.RegExp = {
			'YouTube': createReg('youtu(?:be\\.com\\/(?:watch|playlist)\\?.*?(?:v=([\\w_-]*)|(list=[\\w_-]*))(?:.*?v=([\\w_-]*)|.*?(list=[\\w_-]*)+)?|\\.be\\/([\\w_-]*)(?:.*?(list=[\\w_-]*))?)(?:.*?t=([\\w_-]*))?'),
			'Pleer.com': createReg('pleer\\.com\\/tracks\\/([\\w_-]*)'),
			'Vimeo': createReg('vimeo\\.com\\/(?:.*?\\/)?(\\d+)(?:.*?t=(\\d+))?'),
			'Coub': createReg('coub\\.com\\/view\\/([\\w_-]*)'),
			'RuTube': createReg('rutube\\.ru\\/video\\/([\\w_-]*)\\/?'),
			'M@il.ru': createReg('(?:my\\.)?mail\\.ru\\/mail\\/([\\w_-]*)\\/video\\/([\\w_-]*\\/\\d+\\.html)'),
			'VK.com': createReg('vk\\.com\\/video(?:_ext\\.php\\?oid=)?(-?\\d+)(?:&id=|_)(\\d+).?(hash=[\\w_-]*)?(.*?hd=-?\\d+)?(.*?t=[\\w_-]*)?'),
			'Pastebin': createReg('pastebin\\.com\\/([\\w_-]*)'),
			'Custom': createReg
		}
		this.makePlayer = function(uri, embc) {
			var frame, ext = uri.fext(), element = MaC['Container'].firstElementChild;
			switch (embc) {
				case 'Cb': MaC['Frame'] = _z.setup(MaC.iframe, {'src': uri.replace(MaC.RegExp['Coub'],
						"//coub.com/embed/$1?muted=false&autostart=false&originalSize=false&hideTopBar=true&noSiteButtons=true&startWithHD=false")}, null);
					break;
				case 'YT': MaC['Frame'] = _z.setup(MaC.iframe, {'src': uri.replace(MaC.RegExp['YouTube'],
						"//www.youtube.com/embed/$1$3$5?$2$4$6&autohide=1&wmode=opaque&enablejsapi=1&theme=light&html5=1&rel=0&start=$7")}, null);
					break;
				case 'RT': MaC['Frame'] = _z.setup(MaC.iframe, {'src': uri.replace(MaC.RegExp['RuTube'],
						"//rutube.ru/video/embed/$1?autoStart=false&isFullTab=true&skinColor=fefefe")}, null);
					break;
				case 'Vm': MaC['Frame'] = _z.setup(MaC.iframe, {'src': uri.replace(MaC.RegExp['Vimeo'],
						"//player.vimeo.com/video/$1?badge=0&color=ccc5a7#t=$2")}, null);
					break;
				case 'my': MaC['Frame'] = _z.setup(MaC.iframe, {'src': uri.replace(MaC.RegExp['M@il.ru'],
						"//videoapi.my.mail.ru/videos/embed/mail/$1/$2")}, null);
					break;
				case 'VK': MaC['Frame'] = _z.setup(MaC.iframe, {'src': uri.replace(MaC.RegExp['VK.com'],
						"//vk.com/video_ext.php?oid=$1&id=$2&$3$4$5")}, null);
					break;
				case 'Pbin': MaC['Frame'] = _z.setup(MaC.iframe, {'src': uri.replace(MaC.RegExp['Pastebin'],
						"//pastebin.com/embed_js.php?i=$1")}, null);
					break;
				case 'Pleer': MaC['Frame'] = _z.setup(MaC.flash, {'class': 'prosto-pleer', 'width': '410', 'height': '40',
						'src': uri.replace(MaC.RegExp['Pleer.com'], "//embed.pleer.com/track?id=$1")}, null);
						MaC['Container'].className = 'pleer-container';
					break;
				case 'html5': frame = ext === 'pdf' ? MaC.iframe : Files.video.indexOf(ext) > 4 ? MaC.flash : MaC.html5m;
						MaC['Frame'] = _z.setup(frame, {'src': uri}, null);
					break;
				default: MaC['Frame'] = _z.setup(MaC.iframe, {'src': embc}, null);
			}
			if (!element)
				MaC['Container'].appendChild(MaC['Frame']);
			else if (element.tagName != MaC['Frame'].tagName)
				MaC['Container'].replaceChild(MaC['Frame'], element);
			return MaC['Container'];
		}
		this.matchPlayer = function(uri, embc) {
			var m, reg, i, result;
			switch (embc) {
				case 'YT': m = MaC.RegExp['YouTube'].exec(uri); result = m && (m[1] || m[2] || m[3] || m[4] || m[5] || m[6]);
					break;
				case 'VK': m = MaC.RegExp['VK.com'].exec(uri); result = m && m[1] && m[2] && m[3];
					break;
				case 'my': m = MaC.RegExp['M@il.ru'].exec(uri); result = m && m[1] && m[2];
					break;
				default: 
					switch (embc) {
						case 'Cb'   : reg = MaC.RegExp['Coub'];     break;
						case 'RT'   : reg = MaC.RegExp['RuTube'];   break;
						case 'Vm'   : reg = MaC.RegExp['Vimeo'];    break;
						case 'Pbin' : reg = MaC.RegExp['Pastebin']; break;
						case 'Pleer': reg = MaC.RegExp['Pleer.com'];break;
						default:      reg = MaC.RegExp['Custom']('('+embc+')', true);
					}
					m = reg.exec(uri)
					result = m && m[1];
			}
			return result;
		}
		function createReg(reg, arg) {
			var st = arg ? '' : '(?:https?:)?\\/\\/(?:www\\.)?';
			return new RegExp(st + reg, 'g');
		}
	}
	function loadMediaContainer(e) {
		var embc, cont, last, el = e.target;
		if (el.classList[0] !== 'cm-button')
			return;
		if (!el.href)
			el = el.parentNode
		var hash = _urlHash(el.href),
			th = HM.LinksMap[hash], Id = th.Type +'_'+ hash,
			TYPES = ['img', 'audio'].isThere(th.Type),
			pcont = _z.route(el, function jumpCont(el) {
				var pb = el.querySelector('.postbody');
				if (pb) {
					var prev = pb.previousElementSibling,
						node = prev.style['clear'] === 'both' ? prev : pb;
					if (node.previousElementSibling.className != 'postcontent')
						node.insertAdjacentHTML('beforebegin', '<span class="postcontent"></span>');
					return node.previousElementSibling;
				} else return false;
			});
		if ((HM.MC === 0 || ['pdf', 'docs'].isThere(th.Type) && th.Embed != 'Pbin') && !TYPES) {
			last = mEl['ContentWindow'].lastElementChild;
			if (last.id != 'content_'+ hash) {
				embc = th.Embed.allReplace({'(visual%3D)true': '1$false', 'notracklist%3Dtrue': 'notracklist%3Dfalse', 
					'twittercard%3Dtrue': 'artwork%3Dsmall%2Ftransparent%3Dtrue'})
				cont = _z.setup(Megia[th.Type].makePlayer(el.href, embc), {'class': 'content-frame '+ th.Type, 'id': 'content_'+ hash}, null);
				_z.setup(Megia[th.Type]['Frame'], {'width': '100%', 'height': '100%'}, null);
				if (last.classList[0] === 'content-frame') {
					mEl['ContentWindow'].replaceChild(cont, last);
					_hide(mEl['ContentMarker']);
				} else
					mEl['ContentWindow'].appendChild(cont)
			} else {
				cont = last;
				_hide(mEl['ContentMarker']);
			}
			mEl['ContentWindow'].classList.remove('hidup');
		} else {
			if (th.Embed === 'Pbin' || th.Type === 'audio') {
				if (TYPES)
					hash = th.Type;
				if (!Megia[hash])
					Megia[hash] = new MagicContent(true)
				if (el.previousElementSibling.id === Id) {
					Megia[hash]['Container'].remove();
				} else {
					cont = _z.setup(Megia[hash].makePlayer(el.href, th.Embed), {'class': th.Type +'-container', 'id': Id}, null);
					_z.setup(Megia[hash]['Frame'], {'class': (TYPES ? 'au' : 'full') +'-size'}, null);
					_z.before(el, cont)
				}
			} else {
				if (th.Type === 'img')
					Megia[th.Type] = { 'Container': pcont.querySelector('#'+ Id) }
				if (pcont.querySelector('#'+ Id)) {
					Megia[th.Type]['Container'].remove();
					cont = null;
				} else {
					if (TYPES) {
						cont = createImg(el.href, Id);
					} else {
						cont = _z.setup(Megia[th.Type].makePlayer(el.href, th.Embed), {'class': th.Type +'-container', 'id': Id}, null);
						_z.setup(Megia[th.Type]['Frame'], {'width': getVSize()[th.Type == 'scbc' ? 1 : 0], 'height': getVSize()[1]}, null);
					}
					pcont.appendChild(cont);
				}
			}
		}
		if (th.Type === 'video')
			HM.VActive = [pcont, cont];
		return _z.fall(e);
	}
	
	function attachFile(el, type) {
		var fileUrl = escapeUrl(el.href), hash = _urlHash(fileUrl),
			fileName = (type === 'img' ? 'Image' : type === 'audio' ? 'Audio' : 'Video') + ': '+ getPageName(fileUrl);
			function attach(e) {
				_z.setup(el, {'id': 'cm-link', 'class': 'cm-button', 'rel': 'nofollow', 'href': fileUrl,
					'text': fileName}, {'click': loadMediaContainer});
				HM.LinksMap[hash] = lceche[hash] = {Name: fileName, Embed: 'html5', Type: type};
				_z.setlSVal('LinksCache', JSON.stringify(lceche), true);
			};
			_z.setup(type, {'src': fileUrl}, {'load': attach, 'loadedmetadata': attach, 'error': function(e) { oEmbedMedia(el) }});
	}
	
	function oEmbedMedia(link, type, embed, provider, endpoint, arg) {
		var mediaUrl = escapeUrl(link.href), hash = _urlHash(mediaUrl);
		getDataResponse((endpoint || 'http://api.embed.ly/1/oembed?url=') + mediaUrl +'&format=json', function(status, sText, data, xhr) {
			if (status !== 200 || !data) {
				_z.setup(link, {'target': '_blank'}, null);
			} else {
				var descript = data.provider_url == 'http://pastebin`.com' ? data.description.split(' | ').pop() : (data.description || ""),
					name = !data.title || data.title.isThere('youtube.com/devicesupport') ? getPageName(mediaUrl) :
						data.title.allReplace({' - YouTube': '', ' - Pastebin.com': ''}, true);
				if (!provider)
					provider = name.toLowerCase().isThere(data.provider_name.toLowerCase()) ? '' : data.provider_name + ': ';
				HM.LinksMap[hash] = lceche[hash] = {Name: provider + name, Title: descript};
				if (arg || !arg && data.html && data.type != "link" && embed != 'YT') {
					switch (data.provider_name) {
						case 'SoundCloud':
						case 'BandCamp':
							type = 'scbc';
							break;
						case 'Google Docs':
							type = 'docs';
					}
					if (!embed && data.html || !arg && embed)
						embed = _stub(data.html).src;
					_z.setup(link, {'class': 'cm-button'}, {'click': loadMediaContainer });
					HM.LinksMap[hash].Embed = lceche[hash].Embed = embed;
					HM.LinksMap[hash].Type = lceche[hash].Type = type;
				}
				_z.setup(link, {'id': 'cm-link', 'rel': 'nofollow', 'href': mediaUrl, 'title': descript, 'text': provider + name}, null);
				_z.setlSVal('LinksCache', JSON.stringify(lceche), true);
			}
		});
	}
	function hooLinks(links) {
		_z.each(links, function(link) {
			if (!link.href || link.href.slice(0, 4) !== 'http')
				return;
			var href = escapeUrl(link.href), hash = _urlHash(link.href);
			if (href.isThere("/res/") && href.isThere("dobrochan")) {
				var targ = ParseUrl(href), refl = _z.route(link, '.reflink a'),
					from = ParseUrl(refl.href);
				if (targ != null && targ.thread) {
					var reply_id = (targ.pid || targ.thread),
						diffb = (targ.board !== from.board) || (from.board !== HM.URL.board),
						dataArr = [from.board, from.thread, from.pid, (diffb ? targ.board : '')];
					if (!link.textContent.isThere(">>"))
						_z.setup(link, {'href': href.replace(/https?:\/\/dobrochan\.\w+/, ''), 'onclick': 'Highlight(event, "'+ reply_id +'")',
						'text': '>>'+ (diffb ? targ.board +'/' : '') + reply_id}, null);
					_z.setup(link, {'class': 'reply-link', 'onmouseover': undefined}, {
						'mouseover': Chanabira.MagicPostView
					});
					if (!HM.RepliesMap[reply_id])
						HM.RepliesMap[reply_id] = new Array(0);
					if (!JSON.stringify(HM.RepliesMap[reply_id]).isThere(JSON.stringify(dataArr)))
						HM.RepliesMap[reply_id].push(dataArr);
				}
			} else if (HM.oEmbedAPI) {
				var type = 'video', endp = embed = prov = '', EXT = href.fext(), Macont = new MagicContent();
				if (HM.LinksMap[hash]) {
					if (HM.LinksMap[hash].Embed)
						_z.setup(link, {'class': 'cm-button'}, {'click': loadMediaContainer});
					_z.setup(link, {'href': href, 'id': 'cm-link', 'rel': 'nofollow',
						'text': HM.LinksMap[hash].Name, 'title': HM.LinksMap[hash].Title}, null);
					return;
				}
				if (Files.video.concat(Files.audio.concat(Files.image)).isThere(EXT)) {
					return attachFile(link, (Files.image.isThere(EXT) ? 'img' : Files.audio.isThere(EXT) ? 'audio' : 'video'));
				}
				if (href.isThere("pleer.com/tracks/")) {
					if (Macont.matchPlayer(href, 'Pleer')){
						return _z.replace(link, Macont.makePlayer(href, 'Pleer'));}
				}
				if (href.isThere("youtu")) {
					embed = 'YT'; prov = 'YouTube: ';
				}
				if (href.isThere("vimeo")) {
					embed = 'Vm'; prov = 'Vimeo: ';
				}
				if (href.isThere("coub.com/view/")) {
					embed = 'Cb'; prov = 'Coub: ';
				}
				if (href.isThere("rutube.ru/video/")) {
					embed = 'RT'; prov = 'RuTube: ';
				}
				if (href.isThere("mail.ru/") && href.isThere("/video/")) {
					embed = 'my'; prov = 'M@il.RU Видео: ';
				}
				if (href.isThere("vk.com/video")) {
					link.setAttribute('href', href.replace(Macont.RegExp['VK.com'], 'https://vk.com/video$1_$2?$3$4$5'));
					embed = 'VK'; prov = 'VK Видео: ';
				}
				if (href.isThere("video.yandex.ru/users/")) {
					if ((/\/view\/(\d+)/).exec(href)) {
						endp = '//video.yandex.ru/oembed.json?url=';
						prov = 'Яндекс.Видео: ';
					}
				}
				if (href.isThere("pastebin.com/")) {
					prov = 'Pastebin: '; type = 'docs'; embed = 'Pbin';
				}
				if (href.isThere("/iframe/") || href.isThere("/embed/")) {
					embed = href;
					if (!href.isThere("/html/"))
						link.setAttribute("href", href.allReplace({'embed/': "", 'be.com': ".be"}));
				}
				oEmbedMedia(link, type, embed, prov, endp, Macont.matchPlayer(href, embed));
			}
		});
	}
	function hooElements(elems) {
		_z.each(elems, function(el) {
			switch (el.classList[0]) {
				case 'reflink':
					var url = ParseUrl(el.firstElementChild.href),
						targ = _z.setup('a', {'class': 'reply-button line-sect txt-btn', 'title': LC.repl[lng]}, {
							'click': function(e) {
								Nagato.getForm(e, url.board, url.thread, url.pid)
							}
						});
					_z.after(el, targ)
					break;
				case 'thumb':
					var hash, a = el.parentNode;
					if (!a.href) {
						var finf = _z.route(el, '.fileinfo');
							a = _z.setup('a', {'href': finf.querySelector('a').href, 'target': "_blank"}, null);
						el.parentNode.appendChild(a); a.appendChild(el);
						if (Files.image.isThere(a.href.fext())) {
							return _z.setup(el, {'class': 'spr-image thumb expanded rated'}, {'click': MagicSpoirate});
						}
						if (Files.audio.isThere(a.href.fext())) {
							finf.lastChild.remove();
						}
					}
					if (Files.audio.isThere(a.href.fext())) {
						return makeMagicAudio(el);
					}
					hash = _urlHash(a.href);
					if (Files.video.isThere(a.href.fext())) {
						if (el.alt.fext() === 'mp4')
							el.src = '/src/png/1501/video.png'
						HM.LinksMap[hash] = {Embed: 'html5', Type: 'video'};
					}
					if (a.href.fext() === 'pdf') {
						HM.LinksMap[hash] = {Embed: 'html5', Type: 'pdf'};
					}
					if (el.onclick && el.onclick.toString().isThere('open_url')) {
						if (Files.arch.isThere(el.alt.fext()))
							el.src = '/src/png/1405/archive-icon.png'
						var uri = (/open_url\('([^']+)/).exec(el.onclick.toString())[1]
						HM.LinksMap[hash] = {Embed: uri, Type: (uri.isThere('text') ? 'docs' : 'pdf')};
						el.removeAttribute('onclick');
					}
					_z.setup(el, {'class': 'cm-button thumb'}, {'click': loadMediaContainer});
			}
		});
	}
	
	function attachEvents(node) {
		_z.each(GetElements(node).hoos,
		function(a) {
			switch (a.classList[0]) {
				case 'reply-link':
					if (a.classList[2] !== 'locked')
						a.addEventListener('mouseover', Chanabira.MagicPostView, false)
					break;
				case 'sp-r':
					a.addEventListener('click', function(e) {
						hRate(this, this.parentNode.parentNode.querySelector('img.spr-image'))
					}, false)
					break;
				case 'spr-image':
					a.addEventListener('click', MagicSpoirate, false)
					break;
				case 'cm-button':
					a.addEventListener('click', loadMediaContainer, false)
					break;
				case 'ma-button':
					a.addEventListener('click', initMagicAudio, false)
					break;
				case 'reply-button':
					var url = ParseUrl(_z.route(a, '.reflink a').href)
					a.addEventListener('click', function(e){
						Nagato.getForm(e, url.board, url.thread, url.pid)
					}, false)
			}
		});
	}
	
	function hRate(el, img) {
		if (el.classList[2]) {
			el.classList.remove('rate')
			img.src = img.parentNode.href
		} else {
			el.classList.add('rate')
			img.src = '/images/'+ img.alt +'.png'
		}
	}
	function MagicSpoirate(e) {
		if (this.classList[3]) {
			var finf = _z.route(this, '.fileinfo > a + br'), iMg = this,
				href = this.parentNode.href,
				fid = this.parentNode.parentNode.id.split('_'),
				btnRate = _z.setup('a', {'class': 'sp-r txt-btn', 'text': this.alt}, {
					'click': function(e) { hRate(this, iMg) }
				});
			createImgContext(this);
			_z.after(finf, btnRate);
			this.classList.remove('rated');
			this.src = href;
		} else if (this.alt.fext() == 'svg') {
			this.alt = this.src;
			this.src = this.parentNode.href;
		}
		this.classList.toggle('unexpanded')
		this.classList.toggle('expanded')
		return _z.fall(e);
	}
	function createImg(imgSrc, Id) {
		var fileName = getPageName(imgSrc),
			name = fileName.length > 17 ? fileName.substring(0, 17) + '...' : fileName,
			image = _z.setup('div', {'id': Id, 'class': 'file', 'html': ('<div class="fileinfo">'+ LC.file[lng] +': <a target="_blank" href="'+ imgSrc +'" title="'+ fileName +'" download>'+ name +
				'</a></div>\n<img class="spr-image thumb unexpanded" contextmenu="image-context" oncontextmenu="$(\'#image-context\').attr({src:this.src, edit:\'\'})" src="'+imgSrc +
				'"style="border:medium none;cursor:pointer;" alt="'+ fileName +'">')}, null);
			image.querySelector('.spr-image').addEventListener('click', MagicSpoirate, false);
		return image;
	}
	function createImgContext(img) {
		var fid, edit;
		if (img.parentNode.href.fext() == 'svg') {
			_z.setup(img, {'class': 'spr-image thumb unexpanded'}, {'click': MagicSpoirate});
			edit = ''
		} else {
			fid = img.parentNode.parentNode.id.split('_'),
			edit = '/utils/image/edit/'+fid[2]+'/'+fid[1];
		}
		_z.setup(img, {'contextmenu': 'image-context', 'oncontextmenu': '$(\'#image-context\').attr({src:this.parentNode.href, edit:\''+edit+'\'})'}, null);
	}
	
	/*** Base64Binary ***/
	//* @ original code 	https://github.com/danguer/blog-examples/blob/master/js/base64-binary.js
	//* @ copyright 		Daniel Guerrero
	Base64Binary = {
		_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		/* will return a Uint8Array type */
		decodeArrayBuffer: function(input) {
			var bytes = (input.length / 4) * 3;
			var ab = new ArrayBuffer(bytes);
			this.decode(input, ab);
			return ab;
		},
		decode: function(input, arrayBuffer) {
			//get last chars to see if are valid
			var lkey1 = this._keyStr.indexOf(input.charAt(input.length - 1));
			var lkey2 = this._keyStr.indexOf(input.charAt(input.length - 2));
			var bytes = (input.length / 4) * 3;
			if (lkey1 == 64) bytes--; //padding chars, so skip
			if (lkey2 == 64) bytes--; //padding chars, so skip
			var uarray;
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			var j = 0;
			if (arrayBuffer)
				uarray = new Uint8Array(arrayBuffer);
			else
				uarray = new Uint8Array(bytes);
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			for (i = 0; i < bytes; i += 3) {
				//get the 3 octects in 4 ascii chars
				enc1 = this._keyStr.indexOf(input.charAt(j++));
				enc2 = this._keyStr.indexOf(input.charAt(j++));
				enc3 = this._keyStr.indexOf(input.charAt(j++));
				enc4 = this._keyStr.indexOf(input.charAt(j++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				uarray[i] = chr1;
				if (enc3 != 64) uarray[i + 1] = chr2;
				if (enc4 != 64) uarray[i + 2] = chr3;
			}
			return uarray;
		}
	}
	
	/*** Form Serialization ***/
	//* @ original code 	https://gist.github.com/bullgare/5336154
	//* @ copyright 		bullgare
	function serializeArray(form) {
		var i, j, arr = new Array();
		if (!form || form.nodeName !== "FORM") {
			return;
		}
		for (i = form.elements.length - 1; i >= 0; i = i - 1) {
			if (form.elements[i].name === "") {
				continue;
			}
			switch (form.elements[i].nodeName) {
				case 'INPUT':
					switch (form.elements[i].type) {
						case 'text':
						case 'hidden':
						case 'password':
						case 'button':
						case 'reset':
						case 'submit':
							arr.push({
								name: form.elements[i].name,
								value: form.elements[i].value });
							break;
						case 'checkbox':
						case 'radio':
							if (form.elements[i].checked) {
								arr.push({
									name: form.elements[i].name,
									value: form.elements[i].value });
							}
							break;
						case 'file':
							break;
					}
					break;
				case 'TEXTAREA':
					arr.push({
						name: form.elements[i].name,
						value: form.elements[i].value });
					break;
				case 'SELECT':
					switch (form.elements[i].type) {
						case 'select-one':
							arr.push({
								name: form.elements[i].name,
								value: form.elements[i].value });
							break;
						case 'select-multiple':
							for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
								if (form.elements[i].options[j].selected) {
									arr.push({
										name: form.elements[i].name,
										value: form.elements[i].options[j].value });
								}
							}
							break;
					}
					break;
				case 'BUTTON':
					switch (form.elements[i].type) {
						case 'reset':
						case 'submit':
						case 'button':
							arr.push({
								name: form.elements[i].name,
								value: form.elements[i].value });
							break;
					}
					break;
			}
		}
		return arr;
	}
	
	/*** Yuki ReplyForm ***/
	//* @ original code 	https://github.com/tranquility-yuki/yukiscript
	//* @ copyright 		2013+, You
	function Yuki(h) {
		var Yu = this, fileList = [],
		LCY = {
			acap: ["Attach Captcha Image", 'Прикрепить капчу'],
			subj: ["Subject", "Тема"],
			newt: ["New Thread in", "Новый тред в"],
			post: ["Post", "Отправить"],
			txar: ["Message Text", "Текст сообщения"],
			inps: ['In Progress...', 'Работаем...'],
			ufrm: ['Unhide form', 'Раскрыть форму'],
			rmv: ["Remove", "Убирать"],
			fnm: ["File Name", "имя файла"],
			send: ['Sending', 'Отправка'],
			maxfc: ['Five files limit on this board.', 'Пять файлов это максимум на Доброчане.'],
			wmark: {
				'~': ['Wakabamark Strike Conversion', 'Перевод символов страйка в нотацию wakabamark'],
				'ul': ['Unordered List', 'Неупорядоченный список'],
				's': ['Strike', 'Зачеркнутый'],
				'i': ['Italic', 'Курсивный'],
				'b': ['Bold', 'Жирный'],
				'c': ['Code', 'Код'],
				'sp': ['Spoiler', 'Спойлер'],
				'q': ['Quote Selected', 'Цитировать выделенное']
			},
			cerr: {
				'en': ['captcha', 'human.'],
				'ru': ['капча', 'человек.']
			}
		},
		filepreview_tamplate = '[\n<a class="yuki_clickable">убрать</a>\n]<br><img class="preview_img" src="r{img}"><br><span class="file_name">r{fname}</span><br>'+
			'<span class="file_name">r{size}&nbsp;</span><select name="file_1_rating" class="rating_SFW" onchange="$(this).attr(\'class\', $(this).find(\'option:checked\')[0].className)">'+
			'<option class="rating_SFW">SFW</option><option class="rating_R15">R-15</option><option class="rating_R18">R-18</option><option class="rating_R18G">R-18G</option></select>',
		replyform_tamplate = '<input id="yuki-targetThread" name="thread_id" value="'+ (HM.URL.thread || 0) +'" type="hidden"><input name="task" value="post" type="hidden">'+
			'<div id="yuki-errorMsg"></div>'+
			'<table><tbody id="yuki-dropBox" class="line-sect"><tr class="etch-text"></tr><tr class="droparrow inactive"></tr></tbody><tbody class="line-sect">'+
			'<tr id="trname"><td><input placeholder="'+ getDefaultName() +'" name="name" size="30" value="" type="text">'+
				'<label class="sagearrow'+ (HM.Sage ? '' : ' inactive') +'"><input id="yuki-sage" name="sage" type="checkbox" hidden><span class="line-sect txt-btn"></label>'+
				'<label id="yuki-newThread-create" class="yuki_clickable inactive">'+ LCY.newt[lng] +'<span class="t-sec">\n/'+ HM.URL.board +
				'/</span></label><span>&nbsp;<a id="yuki-close-form" title="'+ LC.remv[lng] +'"><img src="/images/delete.png" alt="✖︎"></a></span></td></tr>'+
			'<tr id="trsubject"><td><input placeholder="'+ LCY.subj[lng] +'" name="subject" size="30" maxlength="64" value="" type="text">'+
				'<label class="submit-button">\n<span>'+ LCY.send[lng] +'</span>\n<input type="submit" value="'+ LCY.post[lng] +'"></label>\n'+
				'<span id="wmark-buttons-panel">'+
					'<a class="wmark-button" id="convert-strike" title="'+ LCY.wmark['~'][lng] +'"><strong>{~}</strong>&nbsp;</a>'+
					'<a class="wmark-button" id="list-mark" title="'+ LCY.wmark['ul'][lng] +'"><span>◉</span></a>&nbsp;'+
					'<a class="wmark-button" id="strike-mark" title="'+ LCY.wmark['s'][lng] +'"><img src="/src/svg/1405/~S-mark.svg" alt="~$"></a>&nbsp;'+
					'<a class="wmark-button" id="ital-mark" title="'+ LCY.wmark['i'][lng] +'"><img src="/src/svg/1405/i-mark.svg" alt="i"></a>&nbsp;'+
					'<a class="wmark-button" id="bold-mark" title="'+ LCY.wmark['b'][lng] +'"><img src="/src/svg/1405/-b-mark.svg" alt="b"></a>&nbsp;'+
					'<a class="wmark-button" id="code-mark" title="'+ LCY.wmark['c'][lng] +'"><img src="/src/svg/1405/[c]-mark.svg" alt="[c]"></a>&nbsp;'+
					'<a class="wmark-button" id="spoiler-mark" title="'+ LCY.wmark['sp'][lng] +'"><span class="spoiler">&middot;<strong>%%</strong>&middot;</span></a>&nbsp;'+
					'<a class="wmark-button" id="quote-mark" title="'+ LCY.wmark['q'][lng] +'"><img src="/src/svg/1405/„q”-mark.svg" alt="&gt;"></a>'+
				'</span></td></tr>'+
			'<tr id="trmessage"><td>'+
				'<textarea placeholder="'+ LCY.txar[lng] +'" id="yuki-replyText" name="message" style="resize:both;width:538px;height:208px;">'+
			'</textarea></td></tr><tr id="trcaptcha"><td><span>'+
					'<img alt="Капча" id="yuki-captcha-image" src="">&nbsp;'+
					'<span id="yuki-attach-captcha-button" class="txt-btn yuki_clickable" title="'+ LCY.acap[lng] +'">[+]</span></span><br>'+
					'<input id="yuki-captcha" autocomplete="off" name="captcha" type="text" hidden></td></tr>'+
			'<tr id="trrempass"><td><input id="yuki-pass" name="password" size="35" value="'+ pass +'" type="password" hidden></td></tr>'+
			'<tr id="trfile"><td id="files_parent"><div id="file_1_div"><label><span class="button">'+ LC.add[lng] +' '+ (lng ? LC.file[lng].toLowerCase() : LC.file[lng]) +
			LC.few['u-c'][lng] +'</span><input id="dumb_file_field" type="file" hidden multiple></label>\n<span class="yukiFileSets"><label><input id="yuki-removeExif" type="checkbox" hidden><span class="checkarea"></span>\n'+
			LCY.rmv[lng] +' Exif</label>\n<label><input id="yuki-removeFilename" type="checkbox" hidden><span class="checkarea"></span>\n'+ LCY.rmv[lng] +' '+ LCY.fnm[lng] +
			'</label></span></div></td></tr></tbody></table><div id="yuki-files-placeholder"></div>';
		this.$ = function(child) { return this['ReplyForm'].querySelector(child) }
		this.submitForm = yukiPleasePost;
		this.getForm = function(e, brd, tid, pid) {
			if (e.target.classList[0] == 'reply-button')
				makeReplyForm(e, brd, tid, pid)
			else
				makeGlobalForm(e)
		}
		this['ReplyForm'] = _z.setup('form', {
				'id': "yuki-replyForm",
				'class': 'line-sect',
				'method': "post",
				'enctype': "multipart/form-data",
				'html': replyform_tamplate
			}, {
				'submit': yukiPleasePost
			});
		this['TargetThread'] = this.$('#yuki-targetThread');
		this['ErrorMassage'] = this.$('#yuki-errorMsg');
		this['NewThreadCreate'] = _z.setup(this.$('#yuki-newThread-create'), {}, {
			'click': function(e) {
				var sel = this.classList[1] === 'selected';
				if (HM.URL.thread) {
					Yu['TargetThread'].value = sel ? HM.URL.thread : 0;
					this.classList.toggle('selected')
					this.classList.toggle('inactive')
				}
			}
		});
		this['CloseForm'] = _z.setup(this.$('#yuki-close-form'), {}, {
				'click': function(e) { Yu['ReplyForm'].remove() }
			});
		this['ReplyText'] = _z.setup(this.$('#yuki-replyText'), {
				'value': JSON.parse(_z.getlSVal('SafeText', JSON.stringify(this.$('#yuki-replyText').value), true))
			}, {
				'click': function(e) {
					this.classList.remove('ta-inact');
				},
				'keyup': function(e) {
					var height = _cid(this.style['height']);
					if (height + 26 < this.scrollHeight)
						this.style['height'] = this.scrollHeight +'px';
					_z.setlSVal('SafeText', JSON.stringify(this.value), true);
				}
			});
		this['FilesPlaceholder'] = this.$('#yuki-files-placeholder');
		this['Captcha'] = _z.setup(this.$('#yuki-captcha'), {}, {
				'focus': function(e) {
					Yu['CaptchaImage'].click()
				},
				'keypress': function(e) {
					CaptchaProcess(e, LC.lng[lng])
				}
			});
		this['CaptchaImage'] = _z.setup(this.$('#yuki-captcha-image'), {}, {
				'click': function(e) {
					this.src = '/captcha/'+ Target.board +'/'+ _t() +'.png'
				}
			});
		this['DumbFileField'] = _z.setup(this.$('#dumb_file_field'), {}, {
				'change': yukiAddFile
			});
			_z.setup(this.$('#yuki-removeExif'), {'checked': HM.RemoveExif}, {
				'change': function(e) {
					setupOptions(this, 'RemoveExif');
				}
			});
			_z.setup(this.$('#yuki-removeFilename'), {'checked': HM.RemoveFileName}, {
				'change': function(e) {
					setupOptions(this, 'RemoveFileName');
				}
			});
		this['Submit'] = _z.setup(this.$('input[type="submit"]'), {}, {
				'click': function(e) {
					StrikeConvert(Yu['ReplyText']) }
			});
		this['DropBox'] = _z.setup(this.$("#yuki-dropBox"), {}, {
				'dragover': _z.fall,
				'dragenter': function(e) {
					var items = e.dataTransfer.mozItemCount || '';
					if (this.classList[0] != 'thumb') {
						this.firstChild.textContent = LC.add[lng] +' '+ items +' '+ LC.file[lng].toLowerCase() +
							(items == 1 ? '' : !items ? LC.few['u-c'][lng] : items < 5 ? LC.few['u-a'][lng] : LC.few['u-b'][lng]);
						this.classList.add('thumb');
					}
				},
				'dragout': function(e) {
					this.firstChild.textContent = '';
					this.classList.remove('thumb');
				},
				'drop': function(e) {
					yukiAddFile(e);
					this.firstChild.textContent = '';
					this.classList.remove('thumb');
					return _z.fall(e);
				}
			});
		this['Sage'] = _z.setup(this.$('#yuki-sage'), {
				'checked': HM.Sage
			}, {
				'change': function(e) {
					setupOptions(this, 'Sage', true);
					this.parentNode.classList.toggle('inactive');
				}
			});
		this['AttachCaptchaButton'] = _z.setup(this.$('#yuki-attach-captcha-button'), {}, {
				'click': yukiAttachCapcha
			});
		this['OpenBottomForm'] = _z.setup('div', {'id': 'open-bottom-form', 'class': 'hideinfo', 'html': '[\n<a>'+ LCY.ufrm[lng] +'</a>\n]'}, null);
		this['OpenBottomForm'].firstElementChild.addEventListener('click', makeGlobalForm, false);
		_z.each(this['ReplyForm'].querySelectorAll('.wmark-button'), function(btn) {
			var Fn = wmarkText, O, C;
			switch (btn.id) {
				case 'convert-strike': Fn = StrikeConvert
					break;
				case 'list-mark'   : O = '* ', C = '\n* '
					break;
				case 'strike-mark' : O = C = '~~'
					break;         
				case 'ital-mark'   : O = C = '_'
					break;
				case 'bold-mark'   : O = C = '**'
					break;
				case 'code-mark'   : O = C = '`'
					break;
				case 'spoiler-mark': O = C = '%%'
					break;
				case 'quote-mark'  : O = '> ', C = '\n> '
			}
			btn.addEventListener('click', function(e) {
				Fn(Yu['ReplyText'], O, C)
			}, false);
		});
		function yukiAttachCapcha(e) {
			var el = e.target, exist;
			if (checkfilesLimit())
				return;
			var img = el.previousElementSibling;
			if (img.nodeName.toLowerCase() === 'img') {
				var canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				var ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);
				var dataURL = canvas.toDataURL("image/png");
				_z.each(fileList, function(obj){
					if (obj.dataURL === dataURL)
						exist = true;
				})
				if (exist)
					return;
				f = {
					"name": 'talking_captcha.png',
					"size": dataURL.length * 6 / 8,
					"type": 'image/png'
				};
				fileList.push({
					file: f,
					renamed: false,
					f_name: 'talking_captcha.png',
					jpegStripped: true,
					el: _z.setup('div', {'class': "yukiFile", 'html': filepreview_tamplate.allReplace({
						'r{img}': dataURL, 'r{fname}': f.name, 'r{size}': bytesMagnitude(f.size)
					})}, null),
					dataURL: dataURL
				});
				attachthisFile();
			}
		}
		function checkfilesLimit() {
			var limit, mu = (Target.board === 'mu');
			if (fileList.length >= (mu ? 10 : 5)) {
				_z.prepend(Yu['FilesPlaceholder'],
					_z.setup(mEl['WarningMsg'], {'text': LCY.maxfc[lng], 'style':'display:block;text-align:center;'}, null))
				mEl.funct = _rmMsg;
				limit = true;
			}
			return limit;
		}
		function attachthisFile() {
			fileList[fileList.length - 1].el.querySelector('.yuki_clickable').onclick = (function(data) {
				return function(e) {
					var idx = fileList.indexOf(data);
					data.el.remove();
					delete fileList[idx];
					fileList.splice(idx, 1)
				}
			}(fileList[fileList.length - 1]))
			Yu['FilesPlaceholder'].appendChild(fileList[fileList.length - 1].el);
		}
		function yukiAddFile(e) { // FileList object
			var data = (e.dataTransfer || e.target),
				files = data.files;
			if (checkfilesLimit())
				return;
			// Loop through the FileList and render image files as thumbnails.
			_z.each(files, function(f) {
				var exist, reader, renamed = false,
					f_name = f.name, f_ext = f_name.fext()
				_z.each(fileList, function(obj){
					if (obj.file.size === f.size)
						exist = true; })
				if (exist || checkfilesLimit())
					return;
				if (HM.RemoveFileName) {
					f_name = (makeRandId(32) + (f.name.match(/\.[^\.]+$/) || [''])[0]).toLowerCase();
					renamed = true;
				}
				fileList.push({
					file: f,
					f_name: f_name,
					renamed: renamed,
					el: _z.setup('div', {'class': 'yukiFile' + (Files.audio.isThere(f_ext) ? ' artwork' : ''), 'html': filepreview_tamplate.allReplace({
						'r{img}': (Files.arch.isThere(f_ext) ? '/src/png/1405/archive-icon.png' : f_ext === 'webm' ? '/src/svg/1501/webm-file.svg' : '#transparent'),
						'r{fname}': f_name, 'r{size}': bytesMagnitude(f.size)})
					}, null)
				});
				attachthisFile();
		
				// Closure to capture the file information.
				if (Files.audio.isThere(f_ext)) {
					var front = fileList[fileList.length - 1].el, 
						moz = typeof mozRTCSessionDescription !== "undefined";
					if (['ogg', 'opus'].isThere(f_ext) && moz) {
						var URL = window.URL || window.webkitURL, 
						HTMLAE = new Audio(URL.createObjectURL(f))
						HTMLAE.onloadedmetadata = function() {
							var mozMdata = this.mozGetMetadata();
							if (Object.keys(mozMdata).length > 0) {
								MDPBlockParser(front, mozMdata)
							}
						}
						HTMLAE.load()
					} else {
						getFileReaderData('arraybuffer', f, function(buffer) {
							if (['flac', 'alac', 'm4a'].isThere(f_ext)) {
								var AVAsset = new AV.Asset.fromBuffer(buffer);
								AVAsset.get('metadata', function(md) {
									AVMetadata(front, md)
								});
							} else {
								MAParser(front, new Blob([buffer]))
							}
						})
					}
				}
				reader = new FileReader();
				reader.onload = (function(theFile) {
					return function(e) {
						// Render thumbnail.
						if (HM.RemoveExif && theFile.file.type.toLowerCase() === 'image/jpeg') {
							theFile.dataURL = jpegStripExtra(e.target.result);
							theFile['jpegStripped'] = true;
						} else {
							theFile.dataURL = e.target.result;
							theFile['jpegStripped'] = false;
						}
						if (theFile.file.type.match('image.*')) {
							theFile.el.querySelector('.preview_img').setAttribute('src', theFile.dataURL);
						}
					};
				})(fileList[fileList.length - 1]);
				// Read in the image file as a data URL.
				reader.readAsDataURL(f);
			})
		}
		function submitProcess(st) {
			_z.setup(Yu['Submit'], {'disabled': (st ? "disabled" : undefined)}, null);
			Yu['Submit'].parentNode.classList.toggle('process');
		}
		function yukiPleasePost(e) {
			var form = e.target, formData = serializeArray(form),
				ajaxPost = new XMLHttpRequest(), fd = new FormData(),
				action = form.action +'?X-Progress-ID='+ _t() * 10000;
			for (var i = 0; i < formData.length; i++) {
				fd.append(formData[i].name, formData[i].value);
			};
			switch (form.id) {
				case 'yuki-replyForm': Fn = function() {
						if (this.readyState !== 4)
							return;
						if (this.status === 304) {
							Yu['ErrorMassage'].textContent = 'Не получилось отправить пост.\n'+
								'Попробуйте чуть попозже ещё разок или перезагрузить страницу.'+
								'〔\n'+ this.statusText+ '\n〕';
							submitProcess(false);
						} else {
							var rText = this.responseText,
								errPost = rText.match(/\/error\/post\/\d+/),
								newThread = rText.match(/\/\w*\/res\/\d+\.xhtml/);
							if (errPost) {
								getDataResponse(errPost, function(status, sText, err, xhr) {
									var msg = (/<td colspan='\d+' class='post-error'>(.+)<\/td>/).exec(err);
									Yu['ErrorMassage'].textContent = msg[1];
									if (LCY.cerr[LC.lng[lng]].isThere(msg[1].split(' ').pop()))
										Yu['Captcha'].removeAttribute('hidden');
									return submitProcess(false);
								});
							} else if (newThread && Yu['TargetThread'].value == 0) {
								document.location.href = newThread;
							} else {
								if (Yu['ReplyForm'].classList[1] === 'reply')
									Yu['ReplyForm'].remove();
								Yu['ReplyText'].value = '';
								Yu['ErrorMassage'].textContent = '';
								Yu['FilesPlaceholder'].innerHTML = '';
								Yu['Captcha'].setAttribute('hidden', '');
								submitProcess(false);
								_z.setlSVal('SafeText', JSON.stringify(Yu['ReplyText'].value), true);
								if (fileList.length === 0) {
									Chanabira.updateThread(null)
								} else {
									setTimeout(Chanabira.updateThread, 2000);
								}
								fileList = [];
							}
						}
					}
					for (var i = 0; i < fileList.length; i++) {
						if (HM.RemoveExif && fileList[i].file.type.toLowerCase() == 'image/jpeg' && !fileList[i].jpegStripped) {
							fileList[i].dataURL = jpegStripExtra(fileList[i].dataURL);
						}
						if (HM.RemoveFileName && !fileList[i].renamed) {
							fileList[i].f_name = (makeRandId(32) + (fileList[i].f_name.match(/\.[^\.]+$/) || [''])[0]).toLowerCase();
						}
						fd.append("file_" + (i + 1), dataURLtoBlob(fileList[i].dataURL, fileList[i].file.type), fileList[i].f_name);
						fd.append("file_" + (i + 1) + "_rating", fileList[i].el.querySelector("select[name='file_1_rating']").value);
					};
					fd.append("post_files_count", fileList.length)
					submitProcess(true);
					break;
				case 'delete_form': Fn = function() {
					if (this.readyState !== 4)
						return;
					if (this.status === 304) {
						console.log('304 ' + this.statusText);
					} else {
						if (this.responseURL === action) {
							var rText = this.responseText,
								msg = (/<center><h2>(.+)<\/h2><\/center>/).exec(rText);
							delForm.appendChild(_z.setup(mEl['WarningMsg'], {'text': msg[1], 'style': 'float:right;'}, null));
							mEl.funct = _rmMsg;
						} else {
							var chek = document.querySelectorAll('.post a.delete.icon.checked > .delete_checkbox');
							if (chek.length === 1) {
								_z.setup(document.getElementById('post_'+ chek[0].name), {'class': "deleted"}, null)
								.querySelector('.doubledash').setAttribute('style', 'display:inline-block;');
							} else if (Target.thread()) {
								setTimeout(function() {
									Chanabira.updateThread(true);
								}, 2000)
							}
						}
					}
				}
			}
			ajaxPost.open('POST', action, true);
			ajaxPost.onreadystatechange = Fn;
			ajaxPost.send(fd);
			return _z.fall(e);
		}
		function makeReplyForm(e, brd, tid, pid) {
			if (Target.thread(tid) && HM.URL.thread != tid)
				Target.tid = tid;
			if (Target.board != brd)
				Target.board = brd;
			Yu['TargetThread'].value = tid;
			Yu['CaptchaImage'].src = '/captcha/'+ brd +'/'+ _t() +'.png';
			_z.setup(Yu['ReplyForm'], {'class': 'line-sect' + (!e ? '' : ' reply'), 'action': '/'+ brd +'/post/new.xhtml'}, null);
			if (document.getElementById('captcha'))
				Yu['Captcha'].removeAttribute('hidden');
			var post = !e ? topForm : _z.route(e.target, function(el) {
					var nodes = el.className.split(' ');
					return nodes.isThere('post') || nodes.isThere('popup');
				}), classes = post.className.split(' ');
				if (classes.isThere('post') || !e) _z.after(post, Yu['ReplyForm']);
			else
				if (classes.isThere('popup')) post.firstChild.firstChild.firstChild.appendChild(Yu['ReplyForm']);
				if (pid && !Yu['ReplyText'].value.isThere('>>'+ pid)) wmarkText(Yu['ReplyText'], '>>'+ pid +'\r\n', '++');
				if (e) makeGlobalForm(null);
		}
		function makeGlobalForm(e) {
			switch (e) {
				case null:
					_z.each([hideinfo, Yu['OpenBottomForm']], _show);
					_hide(showinfo);
					break;
				default:
					switch (e.target.parentNode.id) {
						case 'hideinfotd':
							_z.each([hideinfo, Yu['OpenBottomForm']], _show);
							_hide(postForm);
							break;
						case 'open-bottom-form':
							_z.after(Yu['OpenBottomForm'], postForm)
							_hide(Yu['OpenBottomForm']);
							break;
					}
					switch (e.target.parentNode.id) {
						case 'hideinfodiv':
							pfplaceh.appendChild(postForm);
							_show(Yu['OpenBottomForm']);
							_hide(hideinfo);
						case 'open-bottom-form':
							_z.each([showinfo, postForm], _show);
							makeReplyForm(null, HM.URL.board, (HM.URL.thread || 0));
							Yu['NewThreadCreate'].className = (HM.URL.thread ? 'yuki_clickable ' : '') +
								(Yu['TargetThread'].value > 0 ? 'inactive' : 'selected');
							break;
					}
					return _z.fall(e);
			}
		}
		function makeRandId(size) {
			var text = "", 
				possible = "0123456789abcdef",
				len = possible.length;
			if (!size)
				size = len;
			for (var i = 0; i < size; i++)
				text += possible.charAt(Math.floor(Math.random() * len));
			return text;
		}
		function arrayBufferDataUri(raw) {
			var base64 = ''
			var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
			var bytes = new Uint8Array(raw)
			var byteLength = bytes.byteLength
			var byteRemainder = byteLength % 3
			var mainLength = byteLength - byteRemainder
			var a, b, c, d, chunk
			// Main loop deals with bytes in chunks of 3
			for (var i = 0; i < mainLength; i = i + 3) {
				// Combine the three bytes into a single integer
				chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
				// Use bitmasks to extract 6-bit segments from the triplet
				a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
				b = (chunk & 258048) >> 12 // 258048 = (2^6 - 1) << 12
				c = (chunk & 4032) >> 6 // 4032 = (2^6 - 1) << 6
				d = chunk & 63 // 63 = 2^6 - 1
				// Convert the raw binary segments to the appropriate ASCII encoding
				base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
			} // Deal with the remaining bytes and padding
			if (byteRemainder == 1) {
				chunk = bytes[mainLength]
				a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2
				// Set the 4 least significant bits to zero
				b = (chunk & 3) << 4 // 3 = 2^2 - 1
				base64 += encodings[a] + encodings[b] + '=='
			} else if (byteRemainder == 2) {
				chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
				a = (chunk & 64512) >> 10 // 16128 = (2^6 - 1) << 8
				b = (chunk & 1008) >> 4 // 1008 = (2^6 - 1) << 4
				// Set the 2 least significant bits to zero
				c = (chunk & 15) << 2 // 15 = 2^4 - 1
				base64 += encodings[a] + encodings[b] + encodings[c] + '='
			}
			return base64
		}
		function jpegStripExtra(input) { // result e.target.result;
			// Decode the dataURL
			var binary = atob(input.split(',')[1]);
			// Create 8-bit unsigned array
			var array = [];
			for (var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}
			var orig = new Uint8Array(array);
			var outData = new ArrayBuffer(orig.byteLength)
			var output = new Uint8Array(outData);
			var posO = 2,
				posT = 2;
			output[0] = orig[0];
			output[1] = orig[1];
			while (!(orig[posO] === 0xFF && orig[posO + 1] === 0xD9) && posO <= orig.byteLength) {
				if (orig[posO] === 0xFF && orig[posO + 1] === 0xFE) {
					posO += 2 + orig[posO + 2] * 256 + orig[posO + 3];
				} else if (orig[posO] === 0xFF && (orig[posO + 1] >> 4) === 0xE) {
					posO += 2 + orig[posO + 2] * 256 + orig[posO + 3];
				} else if (orig[posO] === 0xFF && orig[posO + 1] === 0xDA) {
					var l = (2 + orig[posO + 2] * 256 + orig[posO + 3]);
					for (var i = 0; i < l; i++) {
						output[posT++] = orig[posO++];
					}
					while (!(orig[posO] === 0xFF && orig[posO + 1] === 0xD9) && posO <= orig.byteLength) {
						output[posT++] = orig[posO++];
					}
				} else {
					var l = (2 + orig[posO + 2] * 256 + orig[posO + 3]);
					for (var i = 0; i < l; i++) {
						output[posT++] = orig[posO++];
					}
				}
			}
			output[posT] = orig[posO];
			output[posT + 1] = orig[posO + 1];
			output = new Uint8Array(outData, 0, posT + 2);
			return "data:image/Jpeg;base64," + arrayBufferDataUri(output);
		}
		function _rmMsg(e) {
			if (mEl['iteration'] >= 4) {
				mEl['WarningMsg'].remove();
				mEl['iteration'] = 0;
			}
		}
		function _t(last) { 
			return (new Date).getTime() - (last ? parseInt(last) : 0);
		}
		function dataURLtoBlob(dataURL, dataType) {
			// Decode the dataURL
			var binary = atob(dataURL.split(',')[1]);
			// Create 8-bit unsigned array
			var array = [];
			for (var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			} // Return our Blob object
			return new Blob([new Uint8Array(array)], {
				type: dataType
			});
		}
	}
	
	/****************** MagicAudio Player *********************/
	function _cover(artist, album, dataImage) {
		var aid, baid, aa, ALB = getKeyByValue(HM.AlbumArts, dataImage);
		if (ALB)
			dataImage = '$>'+ ALB;
		if (!dataImage)
			aid = artist;
		else
			aid = _unc(artist) +' — '+ _unc(album);
		aid = aid.hashCode().toString()
		if (HM.AlbumArts[aid]) {
			aa = HM.AlbumArts[aid]
			if (aa.slice(0, 2) === '$>')
				aid = aa.slice(2, aa.length)
			dataImage = HM.AlbumArts[aid];
		} else {
			HM.AlbumArts[aid] = dataImage;
			if (ALB)
				aid = ALB;
		}
		if (!document.getElementById('cover_'+ aid)) {
			document.body.appendChild(_z.setup('style', { 'id': 'cover_'+ aid,
				'text': '#album_'+ aid +'{background-image:url('+ dataImage +');}'
			}, null))
		}
		return 'album_'+ aid;
	}
	function AVMetadata(MAF, metadata) {
		if ("coverArt" in metadata) {
			var image = metadata.coverArt, itype = _bitonum([image.data[0], image.data[1], image.data[2], image.data[3]], true),
				dataImage = 'data:image/'+ (itype == "0xffd8ffe0" ? 'jpeg' : 'png') +';base64,'+ _b64Str(image.data);
			MAF.id = _cover(metadata.artist, metadata.album, dataImage)
		}
	}
	function MAParser(MAF, blob) {
		parse_audio_metadata(blob, function(metadata) {
			if ("picture" in metadata) {
				getFileReaderData('dataurl', metadata.picture, function(dataImage){
					MAF.id = _cover(metadata.artist, metadata.album, dataImage)
				})
			}
		}, function(e) {
			console.log(e)
		});
	}
	function MDPBlockParser(MAF, metadata) {
		if ('METADATA_BLOCK_PICTURE' in metadata) {
			var bpic = metadata['METADATA_BLOCK_PICTURE'],
				blob = new Blob([Base64Binary.decodeArrayBuffer(bpic)]);
			BlobView.get(blob, 0, blob.size, function (page, error) {
				var ptype, mimeL, mime, descL, desc, width, height, color, icolor, imageL, image, dataImage;
				if (error)
					return errorCallback(error);
				// PictureType = { 0: Other, 1: 32x32 pixels 'file icon' (PNG only), 2: Other file icon, 3: Cover (front), 4: Cover (back), 5: Leaflet page,
				// 6: Media (e.g. label side of CD), 7: Lead artist/lead performer/soloist, 8: Artist/performer, 9: Conductor, 10: Band/Orchestra, 
				ptype  = page.getUint8(3) // 11: Composer, 12: Lyricist/text writer, 13: Recording Location, 14: During recording, 15: During performance,
				// 16: Movie/video screen capture, 17: A bright coloured fish, 18: Illustration, 19: Band/artist logotype, 20: Publisher/Studio logotype }
				mimeL  = page.getUint8(4 + 3)      // MIME Type section size - [image/png 0x09, image/jpeg 0x12]
				         page.advance(5 + 3)
				mime   = page.readASCIIText(mimeL) // MIME Type section
				descL  = page.getUint8(5 + 3 + mimeL + 3) // Description section size
				         page.advance(4)
				desc   = page.readASCIIText(descL)        // Description section (it's somthing like comment)
				width  = page.getUnsignedByteArray(7 + 3 + mimeL + 3 + descL, 3)                  // image size width (hex)
				height = page.getUnsignedByteArray(8 + 3 + mimeL + 3 + descL + 3, 3)              // image size height (hex)
				color  = page.getUnsignedByteArray(9 + 3 + mimeL + 3 + descL + 3 + 3, 3)          // image color depth [8, 16, 24, 32] (hex)
				icolor = page.getUnsignedByteArray(10 + 3 + mimeL + 3 + descL + 3 + 3 + 3, 3)     // maybe color profile, i dont know
				imageL = page.getUnsignedByteArray(11 + 3 + mimeL + 3 + descL + 3 + 3 + 3 + 3, 3) // image section size (hex)
				image  = page.getUnsignedByteArray(11 + 3 + mimeL + 3 + descL + 3 + 3 + 3 + 3 + 3, _bitonum(imageL)) // image section
				if (image.length + image.length < page.viewLength) { // in some files image section length is wrong
					dataImage = bpic.match(/\/9j\/.+/g)[0];
				} else {
					dataImage = _b64Str(image);
				}
				MAF.id = _cover(metadata['ARTIST'], metadata['ALBUM'], 'data:'+ mime +';base64,'+ dataImage)
			})
		}
	}
	
	function makeMagicAudio(afSrc) {
		afSrc = afSrc.parentNode
		var afInf = _z.route(afSrc, 'em'),
			artalb = (/kHz\s*(.*\s—\s.*)\s\//).exec(afInf.textContent)[1],
			magicAudio = _z.setup('div', {'class': 'magic-audio thumb artwork', 'html': '<div class="ma-controls"><a href="'+
						afSrc.href +'" class="ma-button" id="ma-play"></a></div>'}, null);
		attachEvents(magicAudio)
		afInf.classList.add('magic-info');
		if (HM.AlbumArts[artalb.hashCode().toString()])
			magicAudio.id = _cover(artalb);
		_z.replace(afSrc, magicAudio)
	}
	function initMagicAudio(e) {
		var btn = e.target, AS = btn.href,
			magicAudio = btn.parentNode.parentNode;
			function _stop() {
				_z.each(document.querySelectorAll('#ma-pause'),
					function(a) { a.id = 'ma-play' });
				HM.Played.pause();
			}
			function _nextTrack(e) {
				var file = document.getElementById(atob(this.id)), p = file.querySelector('.ma-button'),
					nxtf = file.nextElementSibling, nxtfp = nxtf.querySelector('.ma-button');
				_stop();
				if (nxtfp)
					nxtfp.click();
			}
		if (btn.id == 'ma-pause') {
			_stop();
		} else {
			if (HM.Played != null)
				_stop();
			if (['flac', 'alac'].isThere(AS.fext())) {
				HM.Played = new AV.Player.fromURL(AS);
				if (!magicAudio.id) {
					HM.Played.asset.get('metadata', function(md) {
						AVMetadata(magicAudio, md)
					});
				}
				HM.Played.on('end', _nextTrack)
			} else {
				HM.Played = _z.setup(new Audio(AS), {}, {'ended': _nextTrack,
					'loadedmetadata': function(e) {
						var moz = typeof this.mozGetMetadata !== "undefined",
							mozMdata = moz ? this.mozGetMetadata() : false;
						if (!magicAudio.id && mozMdata && Object.keys(mozMdata).length > 0) {
							MDPBlockParser(magicAudio, mozMdata)
						} else if (!magicAudio.id) {
							var oReq = new XMLHttpRequest();
							oReq.open("GET", AS, true);
							oReq.responseType = "arraybuffer";
							oReq.onload = function() {
								var blob = new Blob([oReq.response]);
								if (blob) {
									MAParser(magicAudio, blob)
								}
							}
							oReq.send(null);
						}
					}
				});
			}
			HM.Played.id = btoa(btn.parentNode.parentNode.parentNode.id);
			btn.id = 'ma-pause';
			HM.Played.play();
		}
		return _z.fall(e);
	}
	
	/************************************************************************/
	function MagicElements(h) {
		var MEt = this,
			tLC = {
				m_macro: ['Make Image Macro', 'Создать макро'],
				fnd_src_wth: ["Find Source with", "Найти оригинал в"]
			}
		this.funct = function(e){};
		this['iteration'] = 0;
		this['ImageMenu'] = _z.setup('menu', {'type': 'context', 'id': 'image-context', 'src': '', 'edit': '', 'html': 
			'<menuitem icon="/images/edit.gif" label="'+ tLC.m_macro[lng] +'" onclick="window.open($(this).parent().attr(\'edit\'), \'_blank\')"></menuitem><menu label="'+ tLC.fnd_src_wth[lng] +'" icon="">'+
			'<menuitem icon="/src/png/1407/google_14_icon.png" label="Google" onclick="window.open(\'//www.google.com/searchbyimage?image_url=\'+ $(this).parent().parent().attr(\'src\'), \'_blank\')"></menuitem>'+
			'<menuitem icon="/images/booru.png" label="Iqdb" onclick="window.open(\'//iqdb.org/?url=\'+ $(this).parent().parent().attr(\'src\'), \'_blank\')"></menuitem>'+
			'<menuitem icon="/src/png/1502/saucenao_favicon1.png" label="SauceNAO" onclick="window.open(\'//saucenao.com/search.php?url=\'+ $(this).parent().parent().attr(\'src\'), \'_blank\')"></menuitem>'+
			'<menuitem icon="/src/png/1407/derpibooru_icon.png" label="Derpibooru Reverse Search" onclick="$(\'#rs-url\').val($(this).parent().parent().attr(\'src\')).parent().submit()"></menuitem></menu>'}, null)
		this['ReverseSearch'] = _z.setup('form', {'method': "post", 'action': "https://derpibooru.org/search/reverse", 'target': "_blank", 'enctype': "multipart/form-data",
			'hidden': '', 'html': '<input id="rs-url" name="url" type="text" value=""><input id="fuzziness" name="fuzziness" type="text" value="0.25">'}, null);
		this['ContentWindow'] = _z.setup('div', {'class': 'content-window hidup', 'html': '<div id="shadow-box"></div><label id="close-content-window"></label>'}, {
				'click': function(e) {
					switch (e.target.id) {
						case 'shadow-box': MEt['ContentWindow'].classList.add('hidup');
							_show(MEt['ContentMarker'])
							break;
						case 'close-content-window': MEt['ContentWindow'].classList.add('hidup');
							e.target.nextElementSibling.remove();
							HM.VActive = [];
							break;
					}
				}
			});
		this['ContentMarker'] = _z.setup('label', {'id': 'show-content-window', 'class': 'hidout'}, {
				'click': function(e) {
					MEt['ContentWindow'].classList.remove('hidup');
					_hide(this)
				}
			});
		this['WarningMsg'] = _z.setup('strong', {'id': 'warning-massage', 'class': 'blink'}, null);
	}
	
	function MagicSettings(h) {
		var MSs = this, ActiveButton,
			SLC = {
				mcp: ["Post", "В посте"],
				mcw: ["Fixed Window", "В окне"],
				vsyz: ["Video Size", "Размер видеоплеера"],
				maxr: ["Max Allowing Rating", "Макс. разрешенный рейтинг"],
				cframe: ["Content Frame", "Положение видеоплеера"],
				clipopup: ["Clipping Popup Posts", "Закреплять превью постов"],
				hidby: {
					'hr': ['Hide Posts and Threads', 'Скрытие постов и тредов'],
					'nt': ['by Tripcode or Name', 'По имени или трипкоду'],
					'tl': ['by Title', 'По заголовку'],
					'rw': ['Replace Words', 'Замена слов']
				},
				emb: {
					'title': ['Enable oEmbed API support', 'Включает встраивание для внешних ссылок и поддержку oEmbed API'],
					'url': ['embedded_media_links', 'vstraivanije_dla_vneshnih_ssilok'],
					'txt': ['Embedded Media Links', 'Встраивание ссылок']
				}},
			keywordsObj = {
				Nametrip: { apply: false, keys: '' },
				Title: { apply: false, keys: '' },
				Words: { apply: false, keys: '' }}
		this.Keywords = JSON.parse(_z.getlSVal('Keywords', JSON.stringify(keywordsObj)))
		this.$ = function(child) { return this['GeneralSets'].querySelector(child) }
		this['SpStyle'] = _z.setup('style', {'text': '.spoiler, .spoiler * {color:inherit!important;}'}, null);
		this['Panel'] = _z.setup('div', {'id': 'magic-panel'}, null);
		this['GeneralSets'] = _z.setup('table', {'html': '<tbody><tr><td class="f-sect"><span id="media-placement"><input '+
				(HM.MC == 0 ? 'checked' : '') +' value="0" name="cont_p" type="radio">\n'+ SLC.mcw[lng] +'\n<input '+
				(HM.MC == 1 ? 'checked' : '') +' value="1" name="cont_p" type="radio">\n'+ SLC.mcp[lng] +'\n</span></td><td class="s-sect">'+
				SLC.cframe[lng] +'</td></tr><tr class="vs-set'+ (HM.MC == 0 ? ' hidout' : '') +'"><td class="f-sect"><input id="video-frame-size" min="1" value="'+
				getVSize('value') +'" step="1" max="4" type="range" name="v_size"></td><td class="s-sect">'+ SLC.vsyz[lng] +'\n<span id="vsize-textbox">('+
				getVSize('text') +')</span></td></tr><tr><td class="f-sect"><select id="max-allowed-rating"><option class="rating_SFW">SFW</option>'+
				'<option class="rating_R15">R-15</option><option class="rating_R18">R-18</option><option class="rating_R18G">R-18G</option></select></td>'+
				'<td class="s-sect">'+ SLC.maxr[lng] +'</td></tr><tr><td class="f-sect"><label><input id="oembedapi" type="checkbox" hidden><span class="checkarea">'+
				'</span></label></td><td class="s-sect"><a id="exemple-link" title="'+ (HM.oEmbedAPI ? SLC.emb['title'][lng] : '') +'">'+
				(HM.oEmbedAPI ? 'Hint: '+ SLC.emb['txt'][lng] : '<u>http://www.magicpanel.div/'+ SLC.emb['url'][lng] +'</u>') +'</a></td></tr>'+
				'<tr><td class="f-sect"><label><input id="set-show-spoilers" hidden="" type="checkbox"><span class="checkarea"></span></label></td><td class="s-sect">'+
				LC.txtspoils[lng] +'</td></tr><tr><td class="f-sect"><label><a class="paperclip'+
				(HM.AttachPopups ? '' : ' inactive') +'"><input id="attach-popups" type="checkbox" hidden><img src="/src/png/1411/attachpopup.png"></a></label></td><td class="s-sect">'+
				SLC.clipopup[lng] +'</td></tr></tbody>'}, null);
		this['HideBySets'] = _z.setup('table', {'html': '<tbody><tr><th></th><th class="s-sect">'+ SLC.hidby['hr'][lng] +'</th></tr>'+
				'<tr><td class="o-sect"><label><input id="chx-Nametrip" type="checkbox" hidden><span class="checkarea"></span></label></td><td><span class="font-s cyan-light">'+
				SLC.hidby['nt'][lng] +'</span><br><textarea id="type-Nametrip" class="keywords-input font-s" placeholder="Mr.Yoba, Mr.*, *Yoba, !Hyd5gFre"></textarea></td></tr>'+
				'<tr><td class="o-sect"><label><input id="chx-Title" type="checkbox" hidden><span class="checkarea"></span></label></td><td><span class="font-s cyan-light">'+
				SLC.hidby['tl'][lng] +'</span><br><textarea id="type-Title" class="keywords-input font-s" placeholder="Официальный™*, *ожиданий от*, Унылый тред"></textarea></td></tr>'+
				'<tr><td class="o-sect"><label><input id="chx-Words" type="checkbox" hidden><span class="checkarea"></span></label></td><td><span class="font-s cyan-light">'+
				SLC.hidby['rw'][lng] +'</span><br><textarea id="type-Words" class="keywords-input font-s" placeholder="белое::черное, &quot;[w]&quot;::«[w]»"></textarea></td></tr></tbody>'}, null);
		var Types = ['Nametrip', 'Title', 'Words'];
			for (var n = 0; n < Types.length; n++) {
				_z.setup(this['HideBySets'].querySelector('#chx-'+ Types[n]), {'checked': this.Keywords[Types[n]].apply}, {
					'change': function(e) {
						var type = this.id.split('-')[1]
						MSs.Keywords[type].apply = this.checked
						_z.setlSVal('Keywords', JSON.stringify(MSs.Keywords))
						if (this.checked) {
							_z.each(document.querySelectorAll('.by-'+type+'.showhidden'), function(hel) {
								hel.classList.remove('showhidden')
								hel.classList.add('autohidden')
							});
							wer(MSs.Keywords[type].keys, type)
						} else {
							_z.each(document.querySelectorAll('.by-'+type+'.autohidden'), function(hel) {
								hel.classList.remove('autohidden')
								hel.classList.add('showhidden')
							});
						}
					}
				});
				_z.setup(this['HideBySets'].querySelector('#type-'+ Types[n]), {'value': this.Keywords[Types[n]].keys}, {
					'blur': function(e) {
						var type = this.id.split('-')[1]
						MSs.Keywords[type].keys = this.value
						_z.setlSVal('Keywords', JSON.stringify(MSs.Keywords))
						if (MSs.Keywords[type].apply)
							wer(this.value, type)
					}
				});
				if (this.Keywords[Types[n]].apply)
					wer(this.Keywords[Types[n]].keys, Types[n])
			}
		this['MediaPlacement'] = _z.setup(this.$('#media-placement'), {}, {
				'change': placeMedia
			});
		this['VideoSize'] = _z.setup(this.$('#video-frame-size'), {}, {
				'change': setVSize,
				'click': function(e) {
					Megia['scbc']['Container'].scrollIntoView();
					Megia['video']['Container'].scrollIntoView();
				}
			});
		this['VSizeTextBox'] = this.$('#vsize-textbox');
		this['Rating'] = _z.setup(this.$('#max-allowed-rating'), {
				'value': HM.maXrating,
				'class': 'rating_'+ HM.maXrating.replace('-', '')
			}, {
				'change': function(e) {
					setupOptions(this, 'maXrating');
					this.className = this.querySelector('option:checked').className;
				}
			});
		this['Popups'] = _z.setup(this.$('#attach-popups'), {
				'checked': HM.AttachPopups
			}, {
				'change': function(e) {
					setupOptions(this, 'AttachPopups');
					this.parentNode.classList.toggle('inactive');
				}
			});
		this['Embeds'] = _z.setup(this.$('#oembedapi'), {
				'checked': HM.oEmbedAPI
			}, {
				'change': function(e) {
					setupOptions(this, 'oEmbedAPI');
					if (this.checked) {
						hooLinks(GetElements().links);
						_z.setup(MSs.$('#exemple-link'), {'title': SLC.emb['title'][lng], 'text': 'Hint: '+ SLC.emb['txt'][lng]}, null);
					} else {
						_z.setup(MSs.$('#exemple-link'), {'title': undefined, 'html': '<u>http://www.magicpanel.div/'+ SLC.emb['url'][lng] +'</u>'}, null);
						_z.each('#cm-link', function(link) {
							_z.setup(link, {'id': undefined, 'class': undefined, 'title': undefined, 'text': link.href}, null);
						});
					}
				}
			});
		this['ButtonsPanel'] = _z.setup('a', {
				'id': 'magic-buttons-panel',
				'html': '<span id="hide-set" class="mpanel-btn txt-btn"></span><span id="general-set" class="mpanel-btn txt-btn"></span>'
			}, {
				'click': function(e) {
					var TABLE, INNER = MSs['Panel'].firstElementChild;
					switch (e.target.id) {
						case 'general-set': TABLE = MSs['GeneralSets']; break;
						case    'hide-set': TABLE = MSs['HideBySets'];  break;
					}
					if (e.target.classList[2] === 'active') {
						MSs['Panel'].remove()
					} else {
						if (!INNER) {
							MSs['Panel'].appendChild(TABLE);
						} else if (INNER !== TABLE) {
							MSs['Panel'].replaceChild(TABLE, INNER);
							if (ActiveButton)
								ActiveButton.classList.remove('active');
						}
						if (this.previousElementSibling.id !== 'magic-panel') {
							_z.before(this, MSs['Panel']);
						}
					}
					ActiveButton = e.target;
					e.target.classList.toggle('active');
				}
			});
		this['SetShowSpoilers'] = _z.setup(this.$('#set-show-spoilers'), {
				'checked': HM.DiscloseTextSpoilers
			}, {
				'change': function(e) {
					setupOptions(this, 'DiscloseTextSpoilers');
					spDisclosing();
				}
			});
		function setVSize(slider) {
			var p = slider.target.value;
				_z.setlSVal('VideoSize', p);
			function size(w, h) {
				MSs['VSizeTextBox'].textContent = '('+w+'×'+h+')';
				Megia['video']['Frame'].width = w;
				Megia['video']['Frame'].height = h;
				Megia['scbc']['Frame'].width = h;
				Megia['scbc']['Frame'].height = h;
			}
			p == 1 ? size(360, 270) : p == 2 ? size(480, 360) :
			p == 3 ? size(720, 480) : p == 4 ? size(854, 576) : size(0, 0);
		}
		function placeMedia(e) {
			var val = e.target.value,
				cont = HM.VActive[1],
				vsset = MSs.$('.vs-set'); 
				HM.MC = val;
			switch (val) {
				case '0': _hide(vsset);
					if (cont) {
						mEl['ContentWindow'].appendChild(_z.setup(cont, {'class': 'content-frame video', 'id': 'content_'+cont.id.split('_')[1]}, null));
						_z.setup(Megia['video']['Frame'], {'width': '100%', 'height': '100%'}, null);
						_show(mEl['ContentMarker']);
					}; break;
				case '1': _show(vsset);
					if (cont) {
						_z.prepend(HM.VActive[0], _z.setup(cont, {'class': 'video-container', 'id': 'video_'+cont.id.split('_')[1]}, null));
						_z.setup(Megia['video']['Frame'], {'class': '', 'width': getVSize()[0], 'height': getVSize()[1]}, null);
						_hide(mEl['ContentMarker']);
						mEl['ContentWindow'].classList.add('hidup');
					}
			}
			_z.setlSVal('EmbedIn', val)
		}
		function wer(val, arg) {
			var i, n, f, m, c, nodes, keys = val.split(', '),
				reg = arg === 'Words' ? /^(.+)\:\:(.+)$/ : /^\*(.+)\*$|^\*(.+)|(.+)\*$/,
				Class = {
					'Nametrip': ['postername', 'postertrip'],
					'Title': ['replytitle'],
					'Words': ['message'] }
			for (i = 0; i < keys.length; i++) {
				if (keys[i] === '')
					continue;
				m = reg.exec(keys[i]);
				c = keys[i].slice(0, 1) === '!' && arg === 'Nametrip' ? 1 : 0;
				if (arg === 'Words') {
					//nodes = getElementByXpath('//div[@class="'+ Class[arg][c] +'"][contains(.,"'+m[1]+'")]', 6);
					break;
				} else {
					f = m && m[1] ? 'contains(.,"'+m[1]+'")' :
						m && m[2] ? '"'+m[2]+'" = substring(., string-length(.) - string-length("'+m[2]+'") +1)' :
						m && m[3] ? 'starts-with(.,"'+m[3]+'")' : 'text()="'+ keys[i] +'"';
					nodes = getElementByXpath('//span[@class="'+ Class[arg][c] +'"]['+ f +']/parent::*/parent::*[not(contains(@class, "autohidden")) and not(contains(@class, "showhidden")) and not(parent::*[contains(@class, "showhidden") or contains(@class, "autohidden")])]', 7);
					for (n = 0; n < nodes.snapshotLength; n++) {
						var node = nodes.snapshotItem(n),
							tag = 'td';
						if (node.classList[0] === 'oppost') {
							node = node.parentNode;
							tag = 'label';
						}
						node.classList.add('by-'+ arg); node.classList.add('autohidden');
						node.insertAdjacentHTML('afterend', '<'+tag+' class="'+ node.classList[0] +' hinfo-stub"><label class="'+
							Class[arg][c] +' t-sec font-s">'+ keys[i] +'</label> hidden post No.'+ _cid(node.id) +'</'+tag+'>');
					}
				}
			}
		}
		function spDisclosing() {
			if (HM.DiscloseTextSpoilers)
				document.body.appendChild(MSs['SpStyle']);
			else
				MSs['SpStyle'].remove()
		}
		spDisclosing();
	}
	
	function insertListenerS(event) {
		switch (event.animationName) {
			case 'onReady': _z.append(document.head, [
				_z.setup("script", {"src": "/src/js/1501/alac_0.1.0.js"}, null),
				_z.setup("script", {"src": "/src/js/1501/flac_0.2.1.js"}, null)
			]);
		}
	}
	function insertListenerI(event) {
		switch (event.animationName) {
			case 'blinker':
				mEl['iteration']++;
				mEl.funct(event)
		}
	}
	function insertListenerE(event) {
		switch (event.animationName) {
			case 'onReady':
				lng = Hanabira.LC_ru;
				hideinfo = document.getElementById('hideinfodiv');
				showinfo = document.getElementById('hideinfotd');
				postForm = document.getElementById('postFormDiv');
				pfplaceh = document.getElementById('postform_placeholder');
				topForm = document.getElementById('postform');
				delForm = document.getElementById('delete_form'),
				deli = delForm.querySelector('input[name="password"]'),
				pass = deli.value, mEl = new MagicElements(), HM.Elems = GetElements(), Nagato = new Yuki(), HM.Settings = new MagicSettings();
				Chanabira = new CharmingHanabira();
				
				_hide(postForm);
				if (HM.URL.thread) {
					_z.append(delForm, [Nagato['OpenBottomForm'], Chanabira['NewPostLoader']]);
					_z.after(Target.thread(), Chanabira['PostsCount']);
					Chanabira.updateTimer();
				} else {
					_z.before(delForm.querySelector('.pages'), Nagato['OpenBottomForm']);
				}
				_z.each(document.querySelectorAll('.postername:not(.t-sec)'), function(pname) {
					if (!lng)
						pname.textContent = getDefaultName(pname.textContent);
					var oldate = pname.parentNode.lastChild;
					oldate.previousElementSibling.insertAdjacentHTML('afterend', getDateTime(oldate.textContent))
					oldate.remove();
				});
				_z.each([showinfo.firstElementChild, hideinfo.firstElementChild], function(el) {
					_z.setup(el, {'onclick': undefined, 'href': undefined}, {'click': Nagato.getForm});
				});
				hideinfo.removeAttribute('style');
				hooElements(HM.Elems.elements);
				hooLinks(HM.Elems.links);
				Chanabira.genReplyMap(HM.Elems.posts);
				_z.each(HM.Elems.images, createImgContext);
				_z.append(document.body, [
					mEl['ContentWindow'], mEl['ContentMarker'],
					mEl['ReverseSearch'], mEl['ImageMenu'],
					HM.Settings['ButtonsPanel']
				]);
				delForm.addEventListener('submit', Nagato.submitForm, false)
		}
	}
	
	_z.setup(window, {}, {
		'keypress': keyMarks,
		'mouseup': function(e) {
			HM.DragableObj = null },
		'keydown': function(e) {
			if (e.keyCode === 9 && e.target.id === 'code_edit_ta') {
				wmarkText(e.target, '\	', '\n\	');
				return _z.fall(e);
			}
			if (e.keyCode === 82 && !['TEXTAREA', 'INPUT'].isThere(e.target.tagName)) {
				_z.each('.reply.new', function(masRp) {
					masRp.classList.remove('new')
					masRp.removeEventListener('click', markAsRead, false)
				});
				Tinycon.setBubble(0);
				unread_count = 0;
			}
			if (e.keyCode === 27) {
				Chanabira.closeLastPopup(e);
			}
		},
		'mousemove': function(e) {
			if (HM.DragableObj) {
				HM.DragableObj.el.style.top  = HM.DragableObj.offsetY + e.pageY - HM.DragableObj.el.offsetHeight +'px';
				HM.DragableObj.el.style.left = HM.DragableObj.offsetX + e.pageX - HM.DragableObj.el.offsetWidth  +'px';
			}
		}
	});
	
	// animation listener events
	PrefixedEvent("AnimationStart", insertListenerS);
	PrefixedEvent("AnimationIteration", insertListenerI);
	PrefixedEvent("AnimationEnd", insertListenerE);
	// apply prefixed event handlers
	function PrefixedEvent(type, callback) {
		var p, pfx = ["webkit", "moz", "MS", "o", ""];
		for (var p = 0; p < pfx.length; p++) {
			if (!pfx[p])
				type = type.toLowerCase();
			document.addEventListener(pfx[p]+type, callback, false);
		}
	}
}; MagicExtension();

function initStore() {
	if (isNaN(localStorage.getItem('EmbedIn'))) {
		localStorage.removeItem('EmbedIn')
	}
	if (localStorage.getItem('VWidth') !== null) {
		localStorage.clear()
	}
	if (localStorage.getItem('oEmbedAPI') == 'false') {
		sessionStorage.setItem('LinksCache', '{}');
	}
	sessionStorage.removeItem('UpdateInterval')
	sessionStorage.removeItem('Sage')
}

var rp_arr = "data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjNweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMjMgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPjxkZWZzPjxmaWx0ZXIgeD0iLTUwJSIgeT0iLTUwJSIgd2lkdGg9IjIwMCUiIGhlaWdodD0iMjAwJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iZmlsdGVyLTEiPjxmZU9mZnNldCBkeD0iMCIgZHk9IjAiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiPjwvZmVPZmZzZXQ+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMC41IiBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVHYXVzc2lhbkJsdXI+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuNyAwIiBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdHlwZT0ibWF0cml4IiByZXN1bHQ9InNoYWRvd01hdHJpeE91dGVyMSI+PC9mZUNvbG9yTWF0cml4PjxmZU1lcmdlPjxmZU1lcmdlTm9kZSBpbj0ic2hhZG93TWF0cml4T3V0ZXIxIj48L2ZlTWVyZ2VOb2RlPjxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyI+PC9mZU1lcmdlTm9kZT48L2ZlTWVyZ2U+PC9maWx0ZXI+PC9kZWZzPjxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPjxwYXRoIGQ9Ik0xMi42NTg4OTc2LDUuOTkxNjcyMzkgTDExLjQ3MTM5NzYsOC4yOTUxNzk0MyBMMS43MjA3MDMxMiwxMi41OTc5NTY3IEwzLjAxMzc1ODY4LDguODYwMTkwNTkgTDkuMTIyNzg2NDYsNi43ODg0ODMgTDIuMTU2MTE5NzksMy44NDc1Mjc0NyBMNS40NTQ3MzA5LDIuMjUzOTA2MjUgTDEyLjY1ODg5NzYsNS45OTE2NzIzOSBaIE0yMC45MjMwMTc5LDUuOTkxNjcyMzkgTDE5LjczNTUxNzksOC4yOTUxNzk0MyBMOS45ODQ4MjM1LDEyLjU5Nzk1NjcgTDExLjI3Nzg3OTEsOC44NjAxOTA1OSBMMTcuMzg2OTA2OCw2Ljc4ODQ4MyBMMTAuNDIwMjQwMiwzLjg0NzUyNzQ3IEwxMy43MTg4NTEzLDIuMjUzOTA2MjUgTDIwLjkyMzAxNzksNS45OTE2NzIzOSBaIiBpZD0iPj4tY29weSIgZmlsbC1vcGFjaXR5PSIwLjQiIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCNmaWx0ZXItMSkiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiPjwvcGF0aD48cGF0aCBkPSJNMTIuNjU4ODk3Niw0Ljk5MTY3MjM5IEwxMS40NzEzOTc2LDcuMjk1MTc5NDMgTDEuNzIwNzAzMTIsMTEuNTk3OTU2NyBMMy4wMTM3NTg2OCw3Ljg2MDE5MDU5IEw5LjEyMjc4NjQ2LDUuNzg4NDgzIEwyLjE1NjExOTc5LDIuODQ3NTI3NDcgTDUuNDU0NzMwOSwxLjI1MzkwNjI1IEwxMi42NTg4OTc2LDQuOTkxNjcyMzkgWiBNMjAuOTIzMDE3OSw0Ljk5MTY3MjM5IEwxOS43MzU1MTc5LDcuMjk1MTc5NDMgTDkuOTg0ODIzNSwxMS41OTc5NTY3IEwxMS4yNzc4NzkxLDcuODYwMTkwNTkgTDE3LjM4NjkwNjgsNS43ODg0ODMgTDEwLjQyMDI0MDIsMi44NDc1Mjc0NyBMMTMuNzE4ODUxMywxLjI1MzkwNjI1IEwyMC45MjMwMTc5LDQuOTkxNjcyMzkgWiIgaWQ9Ij4+IiBzdHJva2Utb3BhY2l0eT0iMC40IiBzdHJva2U9IiM5OTkiIGZpbGw9IiNGRkYiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiPjwvcGF0aD48L2c+PC9zdmc+",
cmove = 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPjxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPjxjaXJjbGUgaWQ9Ik92YWwtMSIgZmlsbC1vcGFjaXR5PSIuMTUiIGZpbGw9IiMwMDAiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiIGN4PSIzIiBjeT0iMTciIHI9IjIiPjwvY2lyY2xlPjxjaXJjbGUgaWQ9Ik92YWwtMyIgZmlsbC1vcGFjaXR5PSIuMTUiIGZpbGw9IiMwMDAiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiIGN4PSIxNyIgY3k9IjE3IiByPSIyIj48L2NpcmNsZT48Y2lyY2xlIGlkPSJPdmFsLTYiIGZpbGwtb3BhY2l0eT0iLjE1IiBmaWxsPSIjMDAwIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIiBjeD0iMTciIGN5PSIxMCIgcj0iMiI+PC9jaXJjbGU+PGNpcmNsZSBpZD0iT3ZhbC03IiBmaWxsLW9wYWNpdHk9Ii4xNSIgZmlsbD0iIzAwMCIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCIgY3g9IjEwIiBjeT0iMTAiIHI9IjIiPjwvY2lyY2xlPjxjaXJjbGUgaWQ9Ik92YWwtOCIgZmlsbC1vcGFjaXR5PSIuMTUiIGZpbGw9IiMwMDAiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiIGN4PSIxMCIgY3k9IjE3IiByPSIyIj48L2NpcmNsZT48Y2lyY2xlIGlkPSJPdmFsLTIiIGZpbGwtb3BhY2l0eT0iLjE1IiBmaWxsPSIjMDAwIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIiBjeD0iMTciIGN5PSIzIiByPSIyIj48L2NpcmNsZT48L2c+PC9zdmc+',
artwork = 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iNTAwcHgiIGhlaWdodD0iNTAwcHgiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj48ZGVmcz48bGluZWFyR3JhZGllbnQgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSIgaWQ9ImxpbmVhckdyYWRpZW50LTEiPjxzdG9wIHN0b3AtY29sb3I9IiNGRkYiIG9mZnNldD0iMCUiPjwvc3RvcD4KPHN0b3Agc3RvcC1jb2xvcj0iI0Q0RDRENCIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+PGcgaWQ9IkxheWVyLTEiIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEsIC0xKSIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0xKSI+PHBhdGggZD0iTS0wLjc5ODY3OTg2OCwwLjAxNDQ0MDQzMzIgTDQ5OC44Mzk5MzQsMC4wMTQ0NDA0MzMyIEw0OTguODM5OTM0LDUwMC45MDk3NDcgTC0wLjc5ODY3OTg2OCw1MDAuOTA5NzQ3IEwtMC43OTg2Nzk4NjgsMC4wMTQ0NDA0MzMyIFoiIGlkPSJTaGFwZSIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCI+PC9wYXRoPjwvZz48ZyBpZD0iIzAwMDAwMGZmIiBza2V0Y2g6dHlwZT0iTVNMYXllckdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDEsIDEwNikiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjA5Mzc1IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuNzciPjxwYXRoIGQ9Ik0yMTAuNDQ4MjUxLDAgQzIxMC40NjI2MjMsNjUuMTg2OTY4NiAyMTAuNDQyNTAzLDEzMC4zNzEwMzMgMjEwLjQ1OTc0OSwxOTUuNTU4MDAxIEMyMTQuMTgxOTI3LDE5NC4yMTAyODcgMjE4LjExMzkyOCwxOTMuNDk4NjcgMjIyLjA2NjA0OCwxOTMuMzk5OTE1IEMyMjEuNzE0LDE5My4zMzQ2NjcgMjI3LjA1MjY4NiwxOTMuNTU3NDkzIDIzMi43OTM2OTMsMTk1LjA3MDY4NCBDMjM3Ljc4NjM4NywxOTYuMzg2NjM5IDI0My4wMjIwNTYsMTk4LjgyMjkzNyAyNDUuODU2Mzc1LDIwMS4wNzM3NTUgQzI1MC4zODYyMjQsMjA0LjY4NDExOSAyNTQuMDIyMTc0LDIwOS41MjMxMSAyNTUuODkwNDQ5LDIxNS4wNjUwMDUgQzI1OC4yMjE0ODIsMjIxLjgzODQzMSAyNTcuNzkzMjE2LDIyOS41MjM4ODkgMjU0LjczMjExOSwyMzUuOTkyMzM3IEMyNTAuODExNjE2LDI0NC4zODY1MDYgMjQyLjk3OTIzMiwyNTAuNTQ0MTY2IDIzNC4yNTI5NSwyNTMuMTY0MDc2IEMyMjYuODExNDY3LDI1NS40NjczOSAyMTguNjcxNTM2LDI1NS4zNDUzOTkgMjExLjI3ODkxNSwyNTIuOTA4NDc1IEMyMDQuMjcxNDQ3LDI1MC41NzMyMTIgMTk3Ljg5NjMxNywyNDYuMDM2Mjk0IDE5My43ODAzNjQsMjM5LjgwMDIxMSBDMTkwLjk3Nzk1MSwyMzUuNjI5MjY3IDE4OS4zNTY4NjMsMjMwLjcwMDIzNCAxODguOTcxNzExLDIyNS42ODY5NjkgQzE4OC45NzQ1ODUsMTY5LjQ2MzQ2MyAxODguOTg4OTU3LDExMy4yMzcwNTIgMTg4Ljk2NTk2Myw1Ny4wMTA2NDExIEMxMzguNjE0NTEyLDY4Ljc1Mzc2NDMgODguMjQ1ODE2OCw4MC40MTU1NTk5IDM3Ljg5MTQ5MjUsOTIuMTM4MzUxMiBDMzIuMzkzMDE1Myw5My40MzA4NzkgMjYuODc3MjkyNSw5NC42NDIwNzkyIDIxLjM5NjA2MDksOTYuMDEwMTI1NSBDMjEuNDEzMzA2NSwxNDIuODgzODYzIDIxLjM5MzE4NjYsMTg5Ljc1NDY5NyAyMS40MDc1NTc5LDIzNi42MjU1MyBDMzEuOTQxNzU1LDIzMi44NjcwMzMgNDQuMTY2MDIyNCwyMzMuOTE4NDgzIDUzLjcwNTcyMjMsMjM5Ljg5MzE1NiBDNTguMjQ5OTQyMSwyNDIuNzIyMTk1IDYyLjE1NjA3NDIsMjQ2LjY1MjA2IDY0Ljc5MTc3OTEsMjUxLjM1NDUzOCBDNjcuMTAyNjkxNywyNTUuNDU4Njc2IDY4LjM2NzM3MDIsMjYwLjE1NTM0NSA2OC40MzM0Nzg0LDI2NC44NzUyNSBDNjguNDYyMjIxMSwyNjkuODYyMzc0IDY3LjE0ODY4LDI3NC44NDY1OTMgNjQuNjY4MTg1NSwyNzkuMTYyNzY0IEM2MC41NjM3Mjg5LDI4Ni4zNDU3MzMgNTMuNTQ0NzYzMywyOTEuNjA4NzkgNDUuNzYxMjQxOSwyOTQuMDc3NjY0IEMzNS45MDgyNDY3LDI5Ny4yNTIzNDQgMjQuNzM1OTYxOCwyOTYuMjE4MzIyIDE1LjczMzc1MDMsMjkxLjAxMzM1NiBDOC4wNjUxOTk3MywyODYuNjUwNzEyIDIuMDMyMTA4NDEsMjc5LjAyMzM0NiAwLjQ3MTM4MDE2OSwyNzAuMTcwMjU3IEMwLjM1NjQwOTM5NiwyNjkuMDgxMDQ4IDAuMDg2MjI4MDc5NywyNjguMDE1MDc1IDAuMDA1NzQ4NTM4NjUsMjY2LjkyNTg2NyBDMC4wMDU3NDg1Mzg2NSwxOTQuMjM2NDI4IDAuMDE0MzcxMzQ2NiwxMjEuNTQ2OTg5IDAsNDguODU3NTUwMiBDNjUuNjg4NTUxMiwzMy42MDg2MjY5IDEzMS4zNzEzNTQsMTguMzMwNjU4MSAxOTcuMDU5OTA1LDMuMDczMDIxMTEgQzIwMS41MjM2NDUsMi4wNTY0MjYyMiAyMDUuOTcwMTQsMC45NTI2OTQ2MzUgMjEwLjQ0ODI1MSwwIFoiIGlkPSJTaGFwZSIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCI+PC9wYXRoPjwvZz48L2c+PC9zdmc+',
play = "data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPjxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPjxwYXRoIGQ9Ik0xNC4wNzQ1ODM0LDIuOTQ4MDc4NyBMMjUuMTQxNDkyLDIwLjk5NDAyOSBMMy4wMDc2NzUwMywyMC45OTQwMjkgTDE0LjA3NDU4MzQsMi45NDgwNzg3IEwxNC4wNzQ1ODM0LDIuOTQ4MDc4NyBaIiBpZD0iUGxheSIgc3Ryb2tlPSIjREREIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0iI0RERCIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQuMDA3Njc1LCAxMS45NDgwNzkpIHJvdGF0ZSg5MC4wMDAwMDApIHRyYW5zbGF0ZSgtMTQuMDA3Njc1LCAtMTEuOTQ4MDc5KSAiPjwvcGF0aD48L2c+PC9zdmc+",
pause = "data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyNnB4IiB2aWV3Qm94PSIwIDAgMjIgMjYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPjxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPjxwYXRoIGQ9Ik0xLDEgTDEsMjUgTDgsMjUgTDgsMSBMMSwxIEwxLDEgWiBNMTQsMSBMMTQsMjUgTDIxLDI1IEwyMSwxIEwxNCwxIEwxNCwxIFoiIGlkPSJTdG9wIiBzdHJva2U9IiNEREQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSIjREREIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj48L3BhdGg+PC9nPjwvc3ZnPg==",
shoW = 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMzFweCIgaGVpZ2h0PSIzMXB4IiB2aWV3Qm94PSIwIDAgMzEgMzEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPjxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPjxjaXJjbGUgaWQ9Ik92YWwtMSIgc3Ryb2tlPSIjQUFBIiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiMwMDAiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiIGN4PSIxNS41IiBjeT0iMTUuNSIgcj0iMTQuNSI+PC9jaXJjbGU+PHBhdGggZD0iTTguMjQ4MDQ2ODgsMTIuNjcyMTE5MSBMMTUuNDk2Mzk4OSwxOS43NSBMMjIuOTA4NjkxNCwxMi42NzIxMTkxIiBpZD0iUGF0aC0zIiBzdHJva2U9IiNBQUEiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiPjwvcGF0aD48L2c+PC9zdmc+',
closeW = 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMzFweCIgaGVpZ2h0PSIzMXB4IiB2aWV3Qm94PSIwIDAgMzEgMzEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPjxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPjxjaXJjbGUgaWQ9Ik92YWwtMSIgc3Ryb2tlPSIjREREIiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiMwMDAiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiIGN4PSIxNS41IiBjeT0iMTUuNSIgcj0iMTQuNSI+PC9jaXJjbGU+PHBhdGggZD0iTTExLjUsMTEuNSBMMTkuNSwxOS41IiBpZD0iTGluZSIgc3Ryb2tlPSIjREREIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj48L3BhdGg+PHBhdGggZD0iTTE5LjUsMTEuNSBMMTEuNSwxOS41IiBpZD0iTGluZSIgc3Ryb2tlPSIjREREIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj48L3BhdGg+PC9nPjwvc3ZnPg==',
hideS = 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjhweCIgaGVpZ2h0PSIyOHB4IiB2aWV3Qm94PSIwIDAgMjggMjgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPjxkZWZzPjxmaWx0ZXIgeD0iLTUwJSIgeT0iLTUwJSIgd2lkdGg9IjIwMCUiIGhlaWdodD0iMjAwJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iZmlsdGVyLTEiPjxmZU9mZnNldCBkeD0iMCIgZHk9IjEiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRJbm5lcjEiPjwvZmVPZmZzZXQ+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMC41IiBpbj0ic2hhZG93T2Zmc2V0SW5uZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJJbm5lcjEiPjwvZmVHYXVzc2lhbkJsdXI+PGZlQ29tcG9zaXRlIGluPSJzaGFkb3dCbHVySW5uZXIxIiBpbjI9IlNvdXJjZUFscGhhIiBvcGVyYXRvcj0iYXJpdGhtZXRpYyIgazI9Ii0xIiBrMz0iMSIgcmVzdWx0PSJzaGFkb3dJbm5lcklubmVyMSI+PC9mZUNvbXBvc2l0ZT48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAgIDAgMCAwIDAgMCAgIDAgMCAwIDAgMCAgMCAwIDAgMC4zNSAwIiBpbj0ic2hhZG93SW5uZXJJbm5lcjEiIHR5cGU9Im1hdHJpeCIgcmVzdWx0PSJzaGFkb3dNYXRyaXhJbm5lcjEiPjwvZmVDb2xvck1hdHJpeD48ZmVNZXJnZT48ZmVNZXJnZU5vZGUgaW49IlNvdXJjZUdyYXBoaWMiPjwvZmVNZXJnZU5vZGU+PGZlTWVyZ2VOb2RlIGluPSJzaGFkb3dNYXRyaXhJbm5lcjEiPjwvZmVNZXJnZU5vZGU+PC9mZU1lcmdlPjwvZmlsdGVyPjwvZGVmcz48ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj48cGF0aCBkPSJNMjYuNTg2OTg1NCw3LjU3ODY2NjY3IEMyNi41ODY5ODU0LDYuNjA4IDI2LjA2NjQwMTEsNi4xMjI2NjY2NyAyNS4wNjI0MTcsNi4xMjI2NjY2NyBDMjQuMTY5OTg2Nyw2LjEyMjY2NjY3IDIyLjY0NTQxODMsNi4yNzIgMjAuNDE0MzQyNiw2LjUzMzMzMzMzIEMyMC42Mzc0NTAyLDUuMTE0NjY2NjcgMjAuODIzMzczMiw0LjAzMiAyMC45MzQ5MjcsMy4yODUzMzMzMyBDMjEuMTIwODQ5OSwyLjE2NTMzMzMzIDIxLjIzMjQwMzcsMS41MzA2NjY2NyAyMS4yMzI0MDM3LDEuMzgxMzMzMzMgQzIxLjIzMjQwMzcsMC45NzA2NjY2NjcgMjEuMDQ2NDgwNywwLjYzNDY2NjY2NyAyMC43MTE4MTk0LDAuMzczMzMzMzMzIEMyMC4zMzk5NzM0LDAuMTQ5MzMzMzMzIDE5LjkzMDk0MjksMC4wMzczMzMzMzMzIDE5LjU1OTA5NjksMC4wMzczMzMzMzMzIEMxOC44ODk3NzQyLDAuMDM3MzMzMzMzMyAxOC40NDM1NTkxLDAuNjcyIDE4LjIyMDQ1MTUsMS44NjY2NjY2NyBDMTcuOTIyOTc0OCwzLjQzNDY2NjY3IDE3LjYyNTQ5OCw1LjExNDY2NjY3IDE3LjMyODAyMTIsNi44MzIgTDExLjIyOTc0NzcsNy40MjkzMzMzMyBDMTEuODk5MDcwNCw1LjcxMiAxMi40OTQwMjM5LDQuMjkzMzMzMzMgMTIuOTQwMjM5LDMuMTczMzMzMzMgTDEzLjQ5ODAwOCwxLjcxNzMzMzMzIEMxMy40OTgwMDgsMC41OTczMzMzMzMgMTMuMDE0NjA4MiwwIDEyLjEyMjE3OCwwIEMxMS41NjQ0MDksMCAxMS4wODEwMDkzLDAuMjk4NjY2NjY3IDEwLjcwOTE2MzMsMC44MjEzMzMzMzMgQzEwLjQxMTY4NjYsMS4yNjkzMzMzMyAxMC4wMDI2NTYsMS45NDEzMzMzMyA5LjU1NjQ0MDksMi44IEM4Ljk2MTQ4NzM4LDMuODQ1MzMzMzMgOC43MDExOTUyMiw0LjQ4IDguNzAxMTk1MjIsNC43Nzg2NjY2NyBDOC43MDExOTUyMiw1LjAwMjY2NjY3IDguNzM4Mzc5ODEsNS4xODkzMzMzMyA4Ljg0OTkzMzYsNS4zMzg2NjY2NyBMNy45MjAzMTg3Myw3LjkxNDY2NjY3IEM1LjM5MTc2NjI3LDguNCAzLjA4NjMyMTM4LDguOTIyNjY2NjcgMS4wNzgzNTMyNSw5LjUyIEMwLjMzNDY2MTM1NSw5Ljc0NCAwLDEwLjE5MiAwLDEwLjg2NCBDMCwxMi4wNTg2NjY3IDAuNDQ2MjE1MTM5LDEyLjYxODY2NjcgMS4zNzU4MzAwMSwxMi42MTg2NjY3IEMxLjQ4NzM4MzgsMTIuNjE4NjY2NyAxLjc4NDg2MDU2LDEyLjU0NCAyLjMwNTQ0NDg5LDEyLjM5NDY2NjcgQzQuNjEwODg5NzcsMTEuODM0NjY2NyA2LjEzNTQ1ODE3LDExLjQ2MTMzMzMgNi45MTYzMzQ2NiwxMS4yNzQ2NjY3IEM2LjM5NTc1MDMzLDEzLjU4OTMzMzMgNi4wMjM5MDQzOCwxNS40MTg2NjY3IDUuODM3OTgxNDEsMTYuNzI1MzMzMyBDNC4wNTMxMjA4NSwxNi44IDIuNzUxNjYwMDMsMTYuODc0NjY2NyAxLjg1OTIyOTc1LDE2LjkxMiBDMC44OTI0MzAyNzksMTcuMDI0IDAuNDA5MDMwNTQ0LDE3LjU0NjY2NjcgMC40MDkwMzA1NDQsMTguNDQyNjY2NyBDMC40MDkwMzA1NDQsMTkuNDg4IDAuODkyNDMwMjc5LDIwLjAxMDY2NjcgMS44NTkyMjk3NSwyMC4wMTA2NjY3IEMzLjIzNTA1OTc2LDIwLjAxMDY2NjcgNC4zODc3ODIyLDE5Ljk3MzMzMzMgNS4zNTQ1ODE2NywxOS44NjEzMzMzIEM1LjEzMTQ3NDEsMjIuMTAxMzMzMyA1LjA1NzEwNDkxLDIzLjc0NCA1LjA1NzEwNDkxLDI0LjgyNjY2NjcgQzUuMDU3MTA0OTEsMjUuOTQ2NjY2NyA1LjU3NzY4OTI0LDI2LjQ2OTMzMzMgNi42MTg4NTc5LDI2LjQ2OTMzMzMgQzcuNTg1NjU3MzcsMjYuNDY5MzMzMyA4LjA2OTA1NzEsMjUuOTg0IDguMDY5MDU3MSwyNC45Mzg2NjY3IEM4LjA2OTA1NzEsMjIuNTg2NjY2NyA4LjE0MzQyNjI5LDIwLjgzMiA4LjI5MjE2NDY3LDE5LjYzNzMzMzMgQzExLjI2NjkzMjMsMTkuMjY0IDEzLjYwOTU2MTgsMTguOTY1MzMzMyAxNS4zMjAwNTMxLDE4LjcwNCBDMTQuODczODM4LDIxLjA5MzMzMzMgMTQuNTM5MTc2NiwyMi44NDggMTQuMzkwNDM4MiwyNC4wMDUzMzMzIEMxNC4yNDE2OTk5LDI0LjcxNDY2NjcgMTQuMjA0NTE1MywyNS4xNjI2NjY3IDE0LjIwNDUxNTMsMjUuMzQ5MzMzMyBDMTQuMjA0NTE1MywyNi4zOTQ2NjY3IDE0LjcyNTA5OTYsMjYuOTE3MzMzMyAxNS44NDA2Mzc1LDI2LjkxNzMzMzMgQzE2LjU4NDMyOTMsMjYuOTE3MzMzMyAxNy4wMzA1NDQ1LDI2LjI0NTMzMzMgMTcuMjUzNjUyMSwyNC45MDEzMzMzIEMxNy41MTM5NDQyLDIzLjA3MiAxNy44ODU3OTAyLDIwLjg2OTMzMzMgMTguMzMyMDA1MywxOC4yOTMzMzMzIEwyMi40NTk0OTU0LDE3LjY1ODY2NjcgQzIyLjY4MjYwMjksMTcuODA4IDIyLjkwNTcxMDUsMTcuODQ1MzMzMyAyMy4yMDMxODczLDE3Ljg0NTMzMzMgQzIzLjcyMzc3MTYsMTcuODQ1MzMzMyAyNC4yODE1NDA1LDE3LjY1ODY2NjcgMjQuODAyMTI0OCwxNy4yNDggQzI1LjMyMjcwOTIsMTYuODc0NjY2NyAyNS42MjAxODU5LDE2LjM4OTMzMzMgMjUuNjIwMTg1OSwxNS44MjkzMzMzIEMyNS42MjAxODU5LDE0Ljc0NjY2NjcgMjQuOTUwODYzMiwxNC4xODY2NjY3IDIzLjYxMjIxNzgsMTQuMTg2NjY2NyBDMjMuNDYzNDc5NCwxNC4xODY2NjY3IDIzLjAxNzI2NDMsMTQuMjk4NjY2NyAyMi4yNzM1NzI0LDE0LjQ0OCBDMjEuMzgxMTQyMSwxNC42NzIgMjAuNzQ5MDA0LDE0LjgyMTMzMzMgMjAuMzc3MTU4LDE0Ljg1ODY2NjcgTDE4Ljg1MjU4OTYsMTUuMDgyNjY2NyBMMTkuODE5Mzg5MSw5LjYzMiBMMjEuNDE4MzI2Nyw5LjU1NzMzMzMzIEwyMS45Mzg5MTEsOS43ODEzMzMzMyBDMjIuOTQyODk1MSw5Ljc4MTMzMzMzIDIzLjk0Njg3OTIsOS42MzIgMjQuOTUwODYzMiw5LjI5NiBDMjYuMDI5MjE2NSw4Ljk2IDI2LjU4Njk4NTQsOC40IDI2LjU4Njk4NTQsNy41Nzg2NjY2NyBMMjYuNTg2OTg1NCw3LjU3ODY2NjY3IFogTTE2Ljc3MDI1MjMsOS45MzA2NjY2NyBMMTUuNzY2MjY4MywxNS40NTYgQzEyLjE5NjU0NzEsMTYuMDE2IDkuODkxMTAyMjYsMTYuMzE0NjY2NyA4Ljg0OTkzMzYsMTYuMzg5MzMzMyBDOS4zNzA1MTc5MywxMy45MjUzMzMzIDkuODE2NzMzMDcsMTIuMDIxMzMzMyAxMC4xODg1NzksMTAuNjc3MzMzMyBDMTMuNjgzOTMwOSwxMC4yMjkzMzMzIDE1Ljg3NzgyMiwxMC4wMDUzMzMzIDE2Ljc3MDI1MjMsOS45MzA2NjY2NyBMMTYuNzcwMjUyMyw5LjkzMDY2NjY3IFoiIGlkPSIjIiBmaWxsPSIjMTFCNkJFIiBmaWx0ZXI9InVybCgjZmlsdGVyLTEpIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj48L3BhdGg+PC9nPjwvc3ZnPg==';

var mesShadows = /* hr shadow */ 'hr{border-style:none none solid!important;border-color:rgba(0,0,0,.3)!important;box-shadow:0 1px 0 #fff!important;}'+
/* text spoiler, banner image & captcha image sadows */ '#yuki-captcha-image,.banner,.spoiler,.spoiler a,.spoiler blockquote,.spoiler blockquote blockquote,.spoiler blockquote blockquote blockquote{transition:all .1s ease;box-shadow:0 1px 2px -1px rgba(0,0,0,.7)!important;}.spoiler a:hover,.spoiler:hover,.transparent{box-shadow:none!important;}'+
/* popup/error posts, settings panel sadows & dropdown menu */ '.reply,.popup{border:0 none transparent!important;}.active > .dropdown-label,.dropdown-menu,.popup,#magic-panel{box-shadow:5px 5px 10px rgba(0,0,0,.4),inset 0 0 30px rgba(0,0,0,.1)!important;z-index:9;}'+
/* reply post sadows */ '.highlight,.reply{padding:2px 1em 2px 2px!important;box-shadow:inset 0 1px 30px -9px #fff,0 2px 2px rgba(0,0,0,.2),2px 0 3px -1px rgba(0,0,0,.1);}.line-sect.reply{padding:2px 4px!important;}'+
/* new reply post sadows */ '.reply.new{box-shadow:inset 0 1px 30px -9px rgba(255, 85, 0, 0.8),0 2px 2px rgba(0,0,0,.2),2px 0 3px -1px rgba(0,0,0,.1);}'+
/* post images/files & audio players shadows */ '.thumb,.yukiFile,.scbc-container,.prosto-pleer,.audio-container video{box-shadow:1px 2px 2px -1px rgba(0,0,0,.4),-1px 0 4px -1px rgba(0,0,0,.2),inset 0 0 30px rgba(0,0,0,.1)!important;}'+
/* error massage, theader & text input shadows */ '#yuki-errorMsg,.theader,.passvalid,input[type="text"],input[type="password"],input[type="number"],textarea,.docs-container{box-shadow:inset 0 1px 2px rgba(0,0,0,.3)!important;-webkit-border-radius:5px;border-style:none!important;}input[type="text"],input[type="number"],input[type="password"],textarea{-webkit-border-radius:3px!important;padding:4px!important;}'+
/* input buttons style */ 'input[type="button"],input[type="submit"],.button{transition:all .3s ease;box-shadow:0 1px 3px -1px rgba(0,0,0,.5),0 0 2px rgba(0,0,0,.2) inset;padding:3px 6px;color:#999;border:0 none;background-color:#fff;}input[type="button"]:hover,input[type="submit"]:hover,.button:hover{background-color:rgba(255,255,255,.5);}input[type="button"]:active,input[type="submit"]:active,.button:active{box-shadow:0 0 2px rgba(255,255,255,.3),0 0 2px rgba(0,0,0,.2) inset;background-color:rgba(255,255,255,.2);}'+
/* input checkbox style */ '.checkarea{box-shadow:inset 1px 1px 2px rgba(0,0,0,.3),0 0 2px #fff;border-radius:3px;padding:0 4px;background-color:#fff;font-size:14px;}.checkarea:before{content:"✗";color:transparent;}input[type="checkbox"]:checked + .checkarea:before{color:grey;}'+
/* text shadows */ '.etch-text,.mapped,.mapped:hover{font-variant:small-caps;font-weight:bold;color:transparent!important;text-shadow:0 1px 1px rgba(255,255,255,.8),-1px 0 0 #666;}'+
/* video-container shadows */ '.video-container{box-shadow:0 0 2px rgba(0,0,0,.2),0 0 4px rgba(0,0,0,.4),0 9px 9px -8px rgba(0,0,0,.8)!important;}'+
/* yuki-form previews shadows */ '.yukiFile img{box-shadow:0 4px 8px 0 rgba(0,0,0,.2);}';
var mesAnimations = '.reply{animation:pview .3s normal;-webkit-animation:pview .3s normal;}.popup{animation:pview .2s linear;-webkit-animation:pview .2s linear;}\
@keyframes pview{0%{transform:scale(0,0);opacity:0;}25%{transform:scale(.3,.3);opacity:.1;}50%{transform:scale(.9,.9);opacity:.3;}75%{transform:scale(1.02,1.02);opacity:.7;}100%{transform:scale(1,1);opacity:1;}}\
@-webkit-keyframes pview{0%{-webkit-transform:scale(0,0);opacity:0;}25%{-webkit-transform:scale(.3,.3);opacity:.1;}50%{-webkit-transform:scale(.9,.9);opacity:.3;}75%{-webkit-transform:scale(1.02,1.02);opacity:.7;}100%{-webkit-transform:scale(1,1);opacity:1;}}';

var MagicStyle = '.hidout,.add_,.play_,.view_,.edit_,.search_iqdb,.search_google,.reply_,#postform,#hideinfodiv hr,.reply #yuki-newThread-create,.submit-button.process input,.pleer-container + br,.artwork > select,.artwork > .file_name + br,.magic-info + br,.autohidden,.showhidden + .hinfo-stub{display:none!important;}\
.unexpanded,.rated{max-width:200px!important;max-height:200px!important;}.expanded{width:100%;height:auto;}#hideinfodiv{margin:5px;}.sp-r.rate{color:darkred;}#yuki-dropBox tr,.f-sect,.hideinfo{text-align:center!important;}\
.dpop,#wmark-buttons-panel,#yuki-close-form,#yuki-newThread-create{float:right;text-align:right;}.artwork{background:url('+artwork+')no-repeat scroll center center / 100% auto;}\
.yuki_clickable,.txt-btn,.wmark-button,.button,.el-li{cursor:pointer;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}\
.replylinks,.button{line-height:2em;font-size:75%;clear:both;}#post-count,.txt-btn{color:#999;}.mapped,.mapped:hover{cursor:default;color:#666!important;}.hidup{top:-9999px!important;}\
.userdelete:after{content:"";-webkit-animation:onReady 1s linear 2;animation:onReady 1s linear 2;}.cm-button{text-decoration:none;}.s-sect{text-align:left;padding-left:2em;color:#777;}\
#yuki-captcha,#yuki-pass{width:295px;}#yuki-captcha-image{vertical-align:middle;margin:2px;}#yuki-dropBox{width:7em;height:18em;border:3px dashed rgba(99,99,99,.3);padding:2px;}\
#convert-strike,.doubledash,.topformtr #yuki-replyForm #yuki-close-form,.dropdown-menu{visibility:hidden;}.sagearrow{background:url(/src/svg/1409/Sage.svg)no-repeat center bottom;position:relative;right:24px;top:2px;}\
#yuki-errorMsg{text-align:center;color:#FFF;background-color:#E04000;}.wmark-button{color:#fefefe;text-shadow:0 1px 0 rgba(0,0,0,.4);}.wmark-button .spoiler{text-shadow:none;}#allowed-posts{font-size:14px;}\
.rating_SFW{background:green;}.rating_R15{background:yellow;}.rating_R18{background:orange;}.rating_R18G{background:red;}.line-sect,.yukiFile,.cpop,.mpanel-btn{display:inline-block;}#warning-massage{color:#ff3428;}\
.yukiFile,.yukiFileSets{font-size:66%;}.yukiFile{text-align:center;width:210px;background-color:#fefefe;-webkit-border-radius:5px;margin:5px;padding:2px;}.reply.new{background-color:rgba(212,115,94,.1);}\
#yuki-files-placeholder > *{vertical-align:top;}.yukiFile img{max-width:150px;margin:5px 0;}.yukiFile span{max-width:200px;word-wrap:break-word;}.au-size{width:350px;height:80px;background-image:url(/src/png/1405/waveform.png);}\
#yuki-replyForm{text-align:left;padding:4px 8px;}.selected:before{content:"✓ ";color:green;}.reply-button,.cpop{margin-left:.4em;}#oembedapi + .checkarea,#set-show-spoilers + .checkarea{font-size:20px!important;}\
#yuki-dropBox tr{display:block;}.droparrow{background:url(/src/svg/1409/DropArrow.svg)no-repeat center;display:block;padding:9em 3em;}.artwork > .file_name{display:block;background-color:rgba(255,255,255,.8);padding:2px 0;}\
.cpop.ty{background-image:url(/src/svg/1411/closepopup.svg);}.cpop.all{background-image:url(/src/svg/1411/closeallpopups.svg);}.dpop{float:right;background-image:url('+cmove+');cursor:move;}.sagearrow span{cursor:default;}\
.cpop{width:14px;height:14px;}.dpop,.sagearrow span{width:20px;height:20px;}.reply-button{width:23px;height:14px;background:url('+rp_arr+')no-repeat center center;}.artwork > .preview_img{height:150px;}\
#magic-buttons-panel{z-index:9;position:fixed;right:1em;bottom:1em;}.mpanel-btn{padding:0 9px;width:28px;height:28px;opacity:.2;filter:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'.3 .3 .3 0 0 .3 .3 .3 0 0 .3 .3 .3 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");-webkit-filter:grayscale(100%);}\
.ta-inact::-moz-selection{background:rgba(99,99,99,.3);}.ta-inact::selection{background:rgba(99,99,99,.3);}#int-upd{bottom:2px;position:relative;}#allowed-posts a{text-decoration:none;text-shadow:none;font-weight:normal;}\
.mpanel-btn:hover,.mpanel-btn.active{opacity:1;filter:none;-webkit-filter:grayscale(0%);}#magic-panel tr{height:3em;}#vsize-textbox{color:#bbb;font-family:Trebuchet;}\
#magic-panel{position:fixed;right:5px;bottom:5px;max-width:450px;height:300px;border-radius:8px;padding:9px;padding-bottom:3em;background-color:#fefefe;}.sp-r{text-align:right;font-size:18px;}\
.deleted,.t-sec{opacity:.6;}.inactive{opacity:.4;}img[src="#transparent"]{opacity:0;}.wmark-button,.reply-button{vertical-align:middle;}.content-window{position:fixed;left:0;top:0;z-index:2999}\
.submit-button span{display:none;}.submit-button.process{font-size:13px;font-style:italic;color:#777;}@keyframes process{0%{width:0;}100%{width:1em;}}@-webkit-keyframes process{0%{width:0;}100%{width:1em;}}\
.submit-button.process span{display:inline;}.process:after{content:"....";display:inline-block;overflow:hidden;animation:process 3s linear .1s infinite;-webkit-animation:process 3s linear .1s infinite;}\
.magic-info,.sp-r{width:190px;background-color:rgba(255,255,255,.8);padding:5px;opacity:.6}.magic-info:hover,.sp-r:hover{z-index:1;opacity:1;}.magic-info,.magic-info + br,#magic-picture,.sp-r{position:absolute;}\
.content-frame,.scbc-container{background-color:#fefefe;}.video-container,.content-frame.video{background-color:#000;}.video-container,.scbc-container{margin:0 9px;display:inline-block!important;}\
.content-frame{position:absolute;top:10%;left:12%;right:18%;bottom:20%;box-shadow:5px 5px 10px rgba(0,0,0,.4);z-index:3000;}#shadow-box{position:absolute;background-color:rgba(33,33,33,.8);z-index:2999;}\
.docs-container > iframe,.content-frame.docs > iframe,.full-size,#shadow-box,.content-window,.preview_img{width:100%;height:100%;}.content-frame.img{background-color:transparent;}\
#close-content-window,#show-content-window{transition:.5s ease;opacity:.6;width:31px;height:31px;background-image:url('+closeW+');cursor:pointer;position:absolute;top:20px;right:20px;z-index:3000;}\
.docs-container,.content-frame.docs,.docs-container > iframe{overflow:auto;resize:both;background-color:#fefefe;}.content-frame.pdf{top:1%;left:17%;right:20%;bottom:1%;}\
#show-content-window{right:52%;position:fixed;background-image:url('+shoW+');border-radius:100%;}#close-content-window:hover,#show-content-window:hover{opacity:1;}\
#ma-play{background:url('+play+')no-repeat scroll center;}#ma-pause{background:url('+pause+')no-repeat scroll center;}.magic-audio{width:200px;height:200px;}input:focus,select:focus,textarea:focus,button:focus{outline:none;}\
.ma-controls,.ma-controls a{display:block;width:50px;height:50px;}.ma-controls{position:relative;top:37%;left:37%;border:2px solid #ddd;border-radius:100%;background-color:#333;opacity:.8;}\
.font-s{font-size:12px;}.keywords-input{width:300px;height:55px;resize:none;}.o-sect{padding:0 1em;}.cyan-light{color:rgba(90,152,155,.8);}\
#hide-set{background:url('+hideS+')no-repeat scroll center;}#general-set{background:url(/src/png/1409/list4.png)no-repeat scroll center center / 80%;}\
.dropdown,.dropdown-menu{padding-left:0;list-style:outside none none;}.active > .dropdown-label,.active > .dropdown-menu{visibility:visible;background-clip:padding-box;background-color:#fefefe;}.active > .dropdown-label{border-radius:4px 4px 0 0;}.dropdown-label{padding:4px 8px;border-radius:2px;font-variant:small-caps;font-size:14px;}.dropdown-menu{color:#777;position:absolute;min-width:150px;font-size:14px;line-height:1.8;}\
.dropdown-item{padding:0 10px;}.dropdown-item:hover{background-color:rgba(0,0,0,.1);}.dropdown-menu{border-radius:0 0 4px 4px;}.dropdown-label:before{content:"⟨ ";}.dropdown-label:after{content:" ⟩";}#int-val{width:50px;margin:0 4px;}\
.blink{-webkit-animation-name:blinker;-webkit-animation-duration:1s;-webkit-animation-timing-function:linear;-webkit-animation-iteration-count:infinite;animation-name:blinker;animation-duration:1s;animation-timing-function:linear;animation-iteration-count:infinite;}\
@-webkit-keyframes blinker{0%{opacity:1.0;}50%{opacity:0.0;}100%{opacity:1.0;}}@keyframes blinker{0%{opacity:1.0;}50%{opacity:0.0;}100%{opacity:1.0;}}\
@keyframes onReady{50% {opacity:0;}} @-webkit-keyframes onReady{50% {opacity:0;}}'+ mesShadows + mesAnimations;

_z.append(document.head, [
	_z.setup("script", {"src": "/src/js/1501/aurora_0.4.4.js"}, null),
	_z.setup("style", {"text": MagicStyle}, null)
]);
