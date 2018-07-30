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

export function logsReducer(state = {logs: []}, action){
  switch(action.type){
    case 'update_logs':
      return {
        ...state, 
        logs: action.logs
      }
    default :
      return state
  }
}

export function blockReducer(state = {latestBlock: 'latest'}, action){
  switch(action.type){
    case 'update_latest_block':
      return{
        ...state,
        latestBlock: action.latestBlock,
      }
    default:
      return state
  }
}
