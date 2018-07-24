export const SET_AGE = 'SET_AGE'
export const SET_NAME = 'SET_NAME'

export function setAge(age) {
  return {
    type: SET_AGE,
    payload: age,
  }
}

export function setName(name) {
  return {
    type: SET_NAME,
    payload: name,
  }
}

export function setLink(link){
  return {
    type: 'links',
    payload: link,
  }
}

export function setLogs(logs){
  return{
    type: 'update_logs',
    logs,
  }
}

export function setLatestBlock(latestBlock){
  return{
    type: 'update_latest_block',
    latestBlock,
  }
}