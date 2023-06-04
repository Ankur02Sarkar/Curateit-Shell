import session from "../../utils/session";

export default class UserViewStateManager {
    static fetchUserDetailsSuccess = (prevState, action) => {
        const state = { ...prevState };
        const { data } = action.payload;

        if (data) {
            state.userData = data;
            state.userTags = data.tags ? [...data.tags] : []
            // state.themeMode = data.preferences?.theme?.mode
            state.sidebarPosition = data?.preferences?.sidebar_position || 'right'
            state.enableFloatMenu = session.enableFloatMenu
            state.show_image_option = data?.preferences?.show_image_option || true
            state.show_code_option = data?.preferences?.show_code_option || true
            state.sidebar_position = data?.preferences?.sidebar_position || 'right'
            state.sidebar_view = data?.preferences?.sidebar_view || 'auto_hide'

            session.setUserId(data.id)
        }
        return state;
    };

    static updateUserTags = (prevState, action) => {
        const state = { ...prevState }
        const { tags } = action

        if (Array.isArray(tags)) {
            state.userTags = [...state.userTags, ...tags]
        }
        else {
            state.userTags = [...state.userTags, tags]
        }
        return state
    }

    static updateUserSuccess = (prevState, action) => {
        const state = { ...prevState };
        const { data } = action.payload;
        if (data) {
            state.userData = { ...state.userData, ...data };
            state.themeMode = data.preferences?.theme?.mode;
            state.sidebarPosition = data?.preferences?.sidebar_position
            state.enableFloatMenu = session.enableFloatMenu
            state.show_image_option = data?.preferences?.show_image_option
            state.show_code_option = data?.preferences?.show_code_option
            state.sidebar_position = data?.preferences?.sidebar_position
            state.sidebar_view = data?.preferences?.sidebar_view
        }
        return state;
    };

}