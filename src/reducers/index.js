import { combineReducers } from 'redux';
import LoginReducer from './login';
import UserReducer from './user';
import CollectionReducer from './collection';
import TagReducer from './tags';

const rootReducer = combineReducers({
    login: LoginReducer,
    user: UserReducer,
    collection: CollectionReducer,
    tags: TagReducer
});

export default rootReducer;