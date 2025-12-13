import { combineReducers } from "@reduxjs/toolkit"
import { baseApi } from "./api"

const reducers = {
    api: baseApi.reducer,
}

export const combineReducer = combineReducers<typeof reducers>(reducers)