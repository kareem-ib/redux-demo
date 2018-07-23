import { SET_NAME, SET_AGE } from './actions'

const initialState = {
  age: 0,
  name: '',
  logs: [],
}

export function homeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_AGE:
      return {
        ...state,
        age: action.payload,
      }
    case SET_NAME:
      return {
        ...state,
        name: action.payload,
      }
    default:
      return state
  }
}

export function recentsTab(state = [], action){
  switch(action.type){
    case 'RNS_SHOW_NOTIFICATION':
      return [...state, {title: action.title, link: action.onRemove}]
    default :
      return state
  }
}

export function stateChanger(state = [], action){
  switch(action.type){
    case 'links':
      return [...state, action.payload]
    default :
      return state
  }
}

export function logsReducer(state = {logs: []}, action){
  switch(action.type){
    case 'update_logs':
      return {
        ...state, 
        logs: action.payload
      }
    default :
      return state
  }
}