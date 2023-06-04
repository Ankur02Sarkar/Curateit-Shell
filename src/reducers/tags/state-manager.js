export default class TagStateManager {
    static addTagSuccess = (prevState, action) => {
        const state = { ...prevState };
        const { data } = action.payload.data;
        if (data) {
            state.addedTagData = data;
        }
        return state;
    }

    static addTagReset = (prevState, action) => {
        const state = { ...prevState };
        state.addedTagData = null;
        return state;
    }
}