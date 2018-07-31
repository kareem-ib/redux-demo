const initialState = {
  logs: [],
}

export function recentsTab(state = [], action){
  switch(action.type){
    case 'RNS_SHOW_NOTIFICATION':
      return [...state, {title: action.title, link: action.onRemove}]
    default :
      return state
  }
}

export function logsReducer(state = [], action){
  switch(action.type){
    case 'UPDATE_LOGS':
      return action.logs
    default :
      return state
  }
}

export function blockTimeReducer(state = 'latest', action){
  switch(action.type){
    case 'UPDATE_LATEST_BLOCK':
      return action.latestBlock
    default:
      return state
  }
}
