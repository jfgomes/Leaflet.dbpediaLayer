(function(exports){
    function assembleDbpediaURL(query){
       return "http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=" +
                   escape(query) + "&format=json";
    }
    exports.assembleDbpediaURL = assembleDbpediaURL;

    /** assembleAreaQuery() - assembles a SPARQL query for resources in a specified area.
     *
     * @param {object} SW - SouthWest corner
     * @param {object} NE - NorthWest corner
     * both SW and NE must have the following format {lat:NN.NN, lng:NN.NN}
     *
     * @param {object} options:
     *                     - notHere: list(areas): areas to exclude in the query, format [obj, obj]:
     *                                 obj must have the following format:
     *                                    {SW:{lat:NN.NN, lng:NN.NN},
     *                                     NE:{lat:NN.NN, lng: NN.NN}}
     *                     - language {string}, default: 'en'
     *                     - includeCities {bool}, default: false
     *                          NB: by default populated places (dbpedia-owl:PopulatedPlace) are excluded from the query
     *                     - typeUrl {string} SPARQL-URL-string (e.g. <http://queries for: 'rdf:type')
     * @returns {string} q - the assembled query
     */
    exports.assembleAreaQuery = function(positionSW, positionNE, options){
        options || (options = {});
        var lang = options.language || 'en',
            typeQueryHead = options.typeUrl ? "" : " (GROUP_CONCAT(?type; separator=',') as ?types) ",
            q = "SELECT DISTINCT (str(?label) as ?label) ?lng ?lat ?link ?thumbnail " + typeQueryHead + " WHERE {";
        q += "       ?res <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?lng."
        q += "       ?res <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat."
        q += "       ?res rdfs:label ?label ."
        q += "       ?res foaf:isPrimaryTopicOf ?link."
        q += "       ?res <http://dbpedia.org/ontology/thumbnail> ?thumbnail."
        if (options.typeUrl){
            q += "      ?res rdf:type " + typeUrl
        } else {
            q += "      ?res rdf:type  ?type_url ."
            q += "      ?type_url rdfs:label ?type ."
        }
        if (!options.includeCities && !options.typeUrl){
            q += "      MINUS {?res a <http://dbpedia.org/ontology/PopulatedPlace>}."
        }
        q += "      FILTER ((?lng > " + positionSW.lng + "  AND ?lng < " + positionNE.lng
        q += "      AND ?lat > " + positionSW.lat + " AND ?lat < " + positionNE.lat + ") AND "
        if (options.notHere){
            for (var idx = 0 ; idx < options.notHere.length ; idx++) {
                var area = options.notHere[idx];
                q += "      !(?lng > " + area.SW.lng + "  AND ?lng < " + area.NE.lng
                q += "      AND ?lat > " + area.SW.lat + " AND ?lat < " + area.NE.lat + ") AND "
            }
        }
        q += "      LANG(?label)='" + lang + "'"
        if (!options.typeUrl){
            q += "      AND LANG(?type)='" + lang + "')"
        }
        q += "  } Limit 1000"
        console.log(q)
        return q
    }
})(typeof exports === 'undefined' ? this['dbpLayer']['queries'] = {} : exports)
