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
