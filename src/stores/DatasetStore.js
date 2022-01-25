import {derived, get, writable} from 'svelte/store';
import {ApiClient} from "@opendatasoft/api-client/src/client/index";
import {fromCatalog} from "@opendatasoft/api-client/src/odsql/index";

const defaultParameters = {
    limit: 20,
    offset: 0
}

const __addRefinesAndQuery = (query, parameters, fieldid = '') => {
    let newQuery = query;
    let keys = Object.keys(parameters.refine || {});
    for (let i = 0; i < keys.length; i += 1) {
        if (keys[i] !== fieldid)
            newQuery = newQuery.refine(`${keys[i]}:"${parameters.refine[keys[i]]}"`);
    }
    if (parameters['q']) {
        newQuery = newQuery.where(`"${parameters['q']}"`)
    }
    return newQuery;
}

const __getRecords = (domain, dataset, parameters, set) => {
    if (domain) {
        const client = new ApiClient({domain: domain});
        let query = fromCatalog()
            .dataset(dataset)
            .records()
            .limit(parameters.limit)
            .offset(parameters.offset);
        query = __addRefinesAndQuery(query, parameters);
        client.get(query)
            .then(res => res)
            .then(res => {
                set(res.records)
            })
            .catch((err) => console.log(err));
    }
}

const __getFacet = (domain, dataset, parameters, set, fieldid) => {
    if (domain) {
        const client = new ApiClient({domain: domain});
        let query = fromCatalog()
            .dataset(dataset)
            .facets().facet(fieldid)
            .limit(parameters.limit)
            .offset(parameters.offset);
        query = __addRefinesAndQuery(query, parameters, fieldid);
        client.get(query)
            .then(res => res)
            .then(res => {
                set(res.facets[0].facets);
            })
            .catch((err) => console.log(err));
    }
}

const __getExport = (domain, dataset, parameters, set, exportType) => {
    if (domain) {
        const client = new ApiClient({domain: domain});
        let query = fromCatalog()
            .dataset(dataset)
            .exports(exportType);
        query = __addRefinesAndQuery(query, parameters);
        client.get(query)
            .then(res => res)
            .then(res => {
                set(res);
            })
            .catch((err) => console.log(err));
    }
}

class DatasetStore {
    constructor(domain, dataset, parameters = {}) {
        this.domain = writable(domain);
        this.dataset = writable(dataset);
        this.parameters = writable(Object.assign({}, defaultParameters, parameters));
    }

    id = undefined;

    setQuery = (q) => {
        if (this.id) {
            clearTimeout(this.id);
        }
        this.id = setTimeout(() => {
            this.parameters.update(param => {
                param['q'] = q;
                return param;
            })
            clearTimeout(this.id);
        }, 500);

    }

    refine = (k, v) => {
        this.parameters.update(param => {
            if (!param.hasOwnProperty('refine'))
                param['refine'] = {};
            param['refine'][k] = v;
            return param;
        })
    }

    unrefine = (k) => {
        this.parameters.update(param => {
            if (param.hasOwnProperty('refine'))
                if (param['refine'].hasOwnProperty(k))
                    delete param['refine'][k];
            return param;
        })
    }

    getRecordsStore = () => {
        return derived([this.domain, this.dataset, this.parameters],
            ([$domain, $dataset, $parameters], set) => {
                console.log($parameters);
                __getRecords($domain, $dataset, $parameters, set);
            }, []);
    }

    getFacetStore = (fieldid) => {
        return derived([this.domain, this.dataset, this.parameters],
            ([$domain, $dataset, $parameters], set) => {
                __getFacet($domain, $dataset, $parameters, set, fieldid);
            }, []);
    }

    getGeojsonExport = () => {
        return derived([this.domain, this.dataset, this.parameters],
            ([$domain, $dataset, $parameters], set) => {
                __getExport($domain, $dataset, $parameters, set, "geojson");
            }, []);
    }
}

export default DatasetStore;