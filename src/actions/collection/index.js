import * as ActionTypes from "./action-types";

// const headers = {
//   'Content-Type': 'multipart/form-data',
// }

  export const importcol = (data) => (
    {
    type: ActionTypes.IMPORTCOL,
    payload: {
      request: {
        url: `/api/import-collections`,
        method: "post",
        data
      }
    }
  }
  );

export const getAllCollections = () => (
    {
    type: ActionTypes.FETCH_COLLECTION,
    payload: {
        request: {
            url: `api/bookmark/collections`,
            method: "get"
        }
    }
});

export const addCollections = (data) => (
  {
  type: ActionTypes.ADD_COLLECTION,
  payload: {
      request: {
          url: `api/collections`,
          method: "post",
          data
      }
  }
});

export const addCollectionReset = () => {
  return{
  type: ActionTypes.ADD_COLLECTION_RESET
}};


export const resetCollectionData = () => ({
  type: ActionTypes.RESET_COLLECTION_DATA
})

export const getCollectionById = (collectionId) => ({
  type: ActionTypes.GET_COLLECTION_BY_ID,
  payload: {
      request: {
          url: `api/collections/${collectionId}`,
          method: "get",
      }
  }
})

export const getUserCollections = () => ({
  type: ActionTypes.GET_USER_COLLECTIONS,
  payload: {
    request: {
        url: `api/get-user-collections`,
        method: "get",
    }
  }
})

export const searchableData = (searchword) => ({
  type: ActionTypes.SEARCH_DATA,
  payload: {
    request: {
      url: `/api/search?searchword=${searchword}`,
      method: "get",
    },
  }
})

export const saveSelectedCollection = (data) => ({
  type: ActionTypes.SAVE_SELECTED_COLLECTION,
  data
})