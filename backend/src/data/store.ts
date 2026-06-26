type ResourceStore = Record<string, unknown>;

const store: ResourceStore = {};

const getStore = () => store;

const postResource = (_body: ResourceStore = {}) => store;

const putResource = (_body: ResourceStore = {}) => store;

const deleteResource = (_body: ResourceStore = {}) => store;

export {
    deleteResource,
    getStore,
    postResource,
    putResource
};
