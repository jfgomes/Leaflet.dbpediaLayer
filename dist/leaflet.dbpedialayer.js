 /*
  Leaflet.dbpLayer a Leaflet plugin adding a markerGroup layer with dynamically loaded points of interest from DBpedia.
  (c) 2013, Christian Wörner
 */
L.DBpediaLayer=L.LayerGroup.extend({initialize:function(A){this._layers={},this.dbp.lang=A.lang||"en",this.dbp.includeCities=!!A.includeCities,this.dbp.style=document.createElement("style"),this.dbp.style.innerHTML=".dbpPopup>img {width:188px;};",document.body.appendChild(this.dbp.style)},onAdd:function(A){this.dbp.map=A,this._map=A,this.dbp.layer=this;var e=this;A.on("moveend",function(){if(A.hasLayer(e)){var t=A.getBounds(),a=t._southWest,r=t._northEast,i=e.dbp.utils._identifyAreaToLoad({SW:a,NE:r},e.dbp.visitedBounds);i&&e.dbp._ajaxWrapper(i.current,i.not),e.dbp.visitedBounds.push({SW:a,NE:r})}})},dbp:{utils:{},queries:{},transport:{},visitedBounds:[],_ajaxWrapper:function(A,e){var t=this.queries._assembleAreaQuery(A.SW,A.NE,{notHere:e,language:this.lang||"en",includeCities:this.includeCities}),a=this.queries._assembleDbpediaURL(t),r=this;this._putLoader(),this.transport._sendQuery(a,this._handleDbpediaData,{errorCallback:function(){e.pop()},completeCallback:function(){r._removeLoader()}})},_handleDbpediaData:function(A){var e=A.results.bindings;L.DBpediaLayer.prototype.dbp._addDBpediaLayer(e)},_addDBpediaLayer:function(A){var e;for(e=0;e<A.length;e++){var t=A[e],a=[t.lat.value,t.lng.value],r=this.utils._langLink(t.link.value,this.lang),i=this.utils._shortenAbstract(t.abstract.value),n="<div class='dbpPopup'>";n+="<h3 class='dbpPopupTitle'>"+t.label.value+"</h3>",n+=a,n+=" - <a class='dbpPopupWikipediaLink' title='"+r+"'href='"+t.link.value+"'>",n+="more info</a>",n+="<br/>"+i+"<br/>",n+="<img class='dbpPopupThumbnail' src='"+t.thumbnail.value+"'/>",n+="</div>";var E=L.marker(a).bindPopup(n).bindLabel(t.label.value);this.layer.addLayer(E)}},_putLoader:function(){if("undefined"==typeof this.loaderGif){var A=document.createElement("img");A.src="data:image/gif;base64,"+b64Src,A.id="dbpedialayer.loaderGif",A.style.position="absolute",A.style.width="64px",A.style.top="14px",A.style.left="48%",this.loaderGif=A;var e=this.map.getContainer();e.appendChild(A)}else this.loaderGif.style.display="block"},_removeLoader:function(){this.loaderGif.style.display="none"}}}),L.dbPediaLayer=function(A){return new L.DBpediaLayer(A||{})},function(A){function e(A){return"http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query="+escape(A)+"&format=json"}A._assembleDbpediaURL=e,A._assembleAreaQuery=function(A,e,t){t=t||{};var a=t.language,r=t.typeUrl?"":" (GROUP_CONCAT(?type; separator=',') as ?types) ",i="SELECT DISTINCT (str(?label) as ?label) ?lng ?lat ?abstract ?link ?thumbnail ";if(i+=r+" WHERE {",i+="       ?res <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?lng.",i+="       ?res <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat.",i+="       ?res rdfs:label ?label .",i+="       ?res foaf:isPrimaryTopicOf ?link.",i+="       ?res <http://dbpedia.org/ontology/thumbnail> ?thumbnail.",i+="       ?res <http://dbpedia.org/ontology/abstract> ?abstract.",t.typeUrl?i+="      ?res rdf:type "+t.typeUrl:(i+="      ?res rdf:type  ?type_url .",i+="      ?type_url rdfs:label ?type ."),t.includeCities||t.typeUrl||(i+="      MINUS {?res a <http://dbpedia.org/ontology/PopulatedPlace>}."),i+="      FILTER ((?lng > "+A.lng+"  AND ?lng < "+e.lng,i+="      AND ?lat > "+A.lat+" AND ?lat < "+e.lat+") AND ",t.notHere)for(var n=0;n<t.notHere.length;n++){var E=t.notHere[n];i+="      !(?lng > "+E.SW.lng+"  AND ?lng < "+E.NE.lng,i+="      AND ?lat > "+E.SW.lat+" AND ?lat < "+E.NE.lat+") AND "}return i+="      LANG(?label)='"+a+"' AND",i+="      LANG(?abstract)='"+a+"'",t.typeUrl||(i+="      AND LANG(?type)='en')"),i+="  } Limit 1000"}}("undefined"==typeof exports?L.DBpediaLayer.prototype.dbp.queries:exports),function(A){function e(A,e){for(var a=[],r=0;r<e.length;r++){var i=e[r];t(A,i)&&a.push(i)}return{current:A,not:a}}function t(A,e){return a(A,e)||r(A,e)||i(A,e)||n(A,e)?!1:!0}function a(A,e){return E(A)<Q(e)}function r(A,e){return g(A)<s(e)}function i(A,e){return Q(A)>E(e)}function n(A,e){return s(A)>g(e)}function E(A){return A.NE.lat}function g(A){return A.NE.lng}function Q(A){return A.SW.lat}function s(A){return A.SW.lng}A._langLink=function(A,e){return"en"===e?A:A.replace("://dbp","://"+e)},A._shortenAbstract=function(A){var e=A.split(" ");return e.slice(0,24).join(" ")+(e.length>24?"...":"")},A._identifyAreaToLoad=e,A._overlapping=t}("undefined"==typeof exports?L.DBpediaLayer.prototype.dbp.utils:exports);var b64Src="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";!function(A){function e(e,t,a){a=a||{};var r={dataType:"json",url:e,success:t};a.completeCallback&&(r.complete=function(){a.completeCallback()}),a.errorCallback&&(r.error=a.errorCallback),a.trackLoading&&(r.progress=a.trackLoading);var i=new XMLHttpRequest;return i.open("GET",r.url,!0),i.onreadystatechange=function(){if(4===i.readyState&&200===i.status){var A=JSON.parse(i.responseText);r.success(A),r.complete()}},i.send(),A.currentAjax=i,i}A._sendQuery=e}("undefined"==typeof exports?L.DBpediaLayer.prototype.dbp.transport:exports);