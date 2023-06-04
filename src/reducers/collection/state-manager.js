import session                          from "../../utils/session";

export default class CollectionStateManager {
    static fetchCollectionListSuccess = (prevState, action) => {
        const state = { ...prevState };
        const {data} = action.payload;

        if (data) {
            state.collectionData = [...data] ;
            // session.setCollectionData(JSON.stringify(data))
        }

        return state;
    };
    static fetchSearchCollectionListSuccess = (prevState, action) => {
        const state = { ...prevState };
        const {data} = action.payload;
        // console.log("STA_MAN_CONSOLE",data)
        if (data) {
            state.searchCollectionData = [...data] ;
            // session.setCollectionData(JSON.stringify(data))
        }

        return state;
    };


    static importData = (prevState, action) => {
        const state    = { ...prevState };
        const { data } = action.payload;
        if (data) {
            state.importData     = data;
            state.collectionData = [ ...state.collectionData, ...data ]
            // session.setCollectionData(JSON.stringify(state.collectionData))

        }
        return state;
    };

    static addCollectionSuccess = (prevState, action) => {
        const state = { ...prevState };
        const {data} = action.payload;
        if (data) {
            state.addedCollectionData = { ...data?.data, id: data.data?.id, folders: [], bookmarks: [], collection: null };
            if (!data.msg) {
                state.collectionData      = (state.collectionData.length !== 0) ? [ ...state.collectionData, { ...data?.data, id: data.data?.id, folders: [], bookmarks: [], collection: null } ] : []
            }
            // session.setCollectionData(JSON.stringify(state.collectionData))
        }
        return state;
    };

    static addCollectionReset = (prevState, action) => {
        const state = { ...prevState };
        state.addedCollectionData = null; 
        state.collectionData = [ ...state.collectionData ]
        return state;
    };


    static getCollectionSuccess = (prevState, action) => {
        const state                 = { ...prevState }
        const data                  = action.payload.data
        const unfilterdCollection   = state.collectionData.filter((x) => x.id === Number(session.unfiltered_collection_id))
        if (data) {
            const collectionObj     = data.data?.attributes || data.data
            state.addedCollectionData = { ...collectionObj, id: data.data?.id, folders: [], bookmarks: [], collection: null };
            if(unfilterdCollection.length === 0){
                state.collectionData = [ ...state.collectionData,{ ...collectionObj, id: data.data?.id, folders: [], bookmarks: [], collection: null } ]
                // session.setCollectionData(JSON.stringify(state.collectionData))
            }else{
                state.collectionData = [ ...state.collectionData]
                // session.setCollectionData(JSON.stringify(state.collectionData))
            }
        }
        return state
    }
    
}