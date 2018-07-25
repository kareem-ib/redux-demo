import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Notifications, {
  show,
  success,
  error,
  warning,
  info,
  hide,
  removeAll,
} from 'react-notification-system-redux'
import Ethjs from 'ethjs'
import contractJSON from './contractsJSON'

import EthAbi from 'ethjs-abi'
import { setLink, setLogs, setLatestBlock } from './actions'

class Home extends Component {
  getEthLogs = async (contractName) => {
    const filter = {
      fromBlock: this.props.latestBlock,
      toBlock: 'latest',
      address: await this.getAddressFromLogs(contractName),
      topics: [],
    }
    const logs = await this.eth.getLogs(filter)
    const decoder = await EthAbi.logDecoder(contractJSON[contractName].abi)
    const events = decoder(logs)
    console.log(events);
    return events
  }
  
  getAddressFromLogs = (contractName) => {
    console.log(contractName)
    switch(contractName){
      case('PLCRVoting'):
        return '0x946184cde118286d46825b866521d0236800c613'
      case('Registry'):
        return '0x39cfbe27e99bafa761dac4566b4af3b4c9cc8fbe'
      case('Parameterizer'):
        return '0xd71498b67c157927b39900b51b13621e9b106769'
      case('EIP20'):
        return '0x73064ef6b8aa6d7a61da0eb45e53117718a3e891'
      }
  }

  state = {
    name: '',
    age: '',
  }

  componentDidMount() {
    this.eth = new Ethjs(window.web3.currentProvider)
    this.getEthLogs('Registry')
    this.getEthLogs('PLCRVoting')
    this.getEthLogs('EIP20')
    this.getEthLogs('Parameterizer')
    setInterval(async () => {
      const Latest = (await this.eth.blockNumber()).toString()
      console.log('ITERATE');
      if(this.props.latestBlock === 'latest'){
        this.props.onDispatchSetLatestBlock(setLatestBlock(Latest))
      }
      if(this.props.latestBlock !== Latest){
        this.props.onDispatchSetLatestBlock(setLatestBlock(Latest))
        const events = await this.getEthLogs('Registry')
        const plcrevents = await this.getEthLogs('PLCRVoting')
        const eipevents = await this.getEthLogs('EIP20')
        const paramevents = await this.getEthLogs('Parameterizer')
        this.props.onDispatchSetLogs(setLogs(paramevents))
        this.props.onDispatchSetLogs(setLogs(eipevents))
        this.props.onDispatchSetLogs(setLogs(plcrevents))
        this.props.onDispatchSetLogs(setLogs(events))
	      this.props.logs.map( (log) =>
         this.handleClickNotification(log._eventName) 
        )
        console.log(Latest, this.props.latestBlock)
        
      }
    }, 5000)
  }

  getNotificationDetails(type) {
    switch (type) {
      case 'Application':
        return {
          uid: this.props.notifications.length + 1,
          title: 'Application',
          message: 'message',
          position: 'tl',
          autoDismiss: 0,
          dismissible: 'click',
          onRemove: () => this.props.onDispatchSetName('isaac'),
        }
      case 'Challenge':
        return {
          uid: this.props.notifications.length + 1,
          title: 'Challenge',
          message: 'message',
          position: 'bl',
          autoDismiss: 4,
        }
    }
  }
  
  notify(noti, type) {
      switch (type) {
	  case 'success':
	      this.props.onDispatchNotification(success(noti));
	      break;
	  case 'info':
	      this.props.onDispatchNotification(info(noti));
	      break;
	  case 'warning':
	      this.props.onDispatchNotification(warning(noti));
	      break;
	  case 'error':
	      this.props.onDispatchNotification(error(noti));
	      break;
	  default:
	      console.log('ERROR IN CALLING this.notify()');
      }
  }

  submitNoti(noti) {
      switch (noti.title) {
	  case '_Application':
	  case 'Application added':
	      noti.title = 'Application `title` applied';
	      noti.message = 'Click to review the listing';
	      this.notify(noti, 'success');
	      break;
	  case 'Your vote won!':
	      noti.title = 'Your vote in `pollId` won!';
	      noti.message = 'Click to claim your reward.';
	      this.notify(noti, 'success');
	      break;
	  case '_ApplicationWhitelisted':
	  case 'Application whitelisted':
	      noti.title = 'Application `title` was added to the registry';
	      noti.message = 'Click to review the listing';
	      this.notify(noti, 'info');
	      break;
	  case '_Challenge':
	  case 'Application challenged':
	      noti.title = 'Application `title` was challenged';
	      noti.message = 'Click to vote';
	      this.notify(noti, 'info');
	      break;
	  case '_Challenge':
	  case 'Listing challenged':
	      noti.title = 'Listing `title` was challenged';
	      noti.message = 'Click to vote';
	      this.notify(noti, 'info');
	      break;
	  case 'Your vote lost!':
	      noti.title = 'Your vote in `pollId` lost!';
	      noti.message = 'Votes in favor of listing:`_votes`\nVotes against listing: `_votes`';
	      this.notify(noti, 'error');
	      break;
	  case 'Transaction failed':
	      noti.title = 'Transaction `txHash` failed!';
	      noti.message = 'View `txHash` on Etherscan';
	      this.notify(noti, 'error');
	      break;
	  case '_ApplicationRemoved':
	  case 'Application removed':
	      noti.title = 'Application `title` removed';
	      noti.message = 'View application `title` history';
	      this.notify(noti, 'error');
	      break;
	  default:
	      console.log('ERROR IN submitNoti()');
      }
  }

  // get notification details,
  // dispatch an action that is handled by the notifications reducer,
  // and ultimately changes the REDUX store
  handleClickNotification = (title, message='generic message') => {
    this.submitNoti({
        uid: this.props.notifications.length + 1,
        title,
        message,
        position: 'tl',
        autoDismiss: 0,
        dismissible: 'click',
        onRemove:() => this.props.onDispatchSetLink(setLink(title)),
        action: {
          label: 'More info',
          callback: function(){
            //link or modal
            //<a target="_blank" href={`https://etherscan.io/`}>
          //{'Etherscan'}
        //</a>
          }
        }
    });
  }

  generateButtons(...names) {
      return names.map((title, index) => {
	  return <button onClick={e => this.handleClickNotification(title)} key={title + index}>{title}</button>
      });
  }

  render() {
    //let l = this.generateButtons(0, '', '', '');
    //let logs = this.generateLogs()
    let list = this.generateButtons('Application added', 'Application whitelisted', 'Application removed', 'Application challenged', 'Listing challenged', 'Your vote won!', 'Your vote lost!', 'Transaction failed');
    return (
      <div>
        <div>Home Component</div>

  {list}
  
        {`there are ${this.props.notifications.length} notifications`}

        <Notifications notifications={this.props.notifications} />
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onDispatchNotification: notification => dispatch(notification),
    onDispatchSetLink: link => dispatch(link),
    onDispatchSetLogs: logs => dispatch(logs),
    onDispatchSetLatestBlock: latestBlock => dispatch(latestBlock),
  }
}

function mapStateToProps(state) {
  return {
    notifications: state.notifications,
    link: state.link,
    logs: state.logs.logs,
    latestBlock: state.latestBlock.latestBlock,
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default compose(withConnect)(Home)
