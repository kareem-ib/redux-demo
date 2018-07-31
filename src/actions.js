export function setLogs(logs){
  return{
    type: 'UPDATE_LOGS',
    logs,
  }
}

export function setLatestBlock(latestBlock){
  return{
    type: 'UPDATE_LATEST_BLOCK',
    latestBlock,
  }
}
