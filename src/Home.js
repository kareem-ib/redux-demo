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
import eip20JSON from './EIP20.json'
import parameterizerJSON from './Parameterizer.json'
import registryJSON from './Registry.json'
import plcrvotingJSON from './PLCRVoting.json'
import EthAbi from 'ethjs-abi'
import { setName, setAge, setLink, setLogs } from './actions'

class Home extends Component {
  updateEthLogs = async () => {
    const eth = new Ethjs(window.web3.currentProvider)
    const filter = {
      fromBlock: this.props.latestBlock,
      toBlock: 'latest',
      address: '0x73064ef6b8aa6d7a61da0eb45e53117718a3e891',
      topics: [],
    }
    const Latest = (await eth.blockNumber()).toString()
    const logs = await eth.getLogs(filter)
    const decoder = EthAbi.logDecoder(eip20JSON.abi)
    const events = decoder(logs)
    this.props.onDispatchSetLogs(setLogs(Latest, events))
  }
  
  state = {
    name: '',
    age: '',
  }

  componentDidMount() {
    this.updateEthLogs()
    setInterval(this.updateEthLogs,5000)
  }

  // change the REACT state
  handleChangeName = e => {
    this.setState({
      name: e.target.value,
    })
  }
  // dispatch an action, which changes the REDUX store
  handleClickSetName = () => {
    this.props.onDispatchSetName(this.state.name)
    this.setState({
      name: '',
    })
  }

  // change the REACT state
  handleChangeAge = e => {
    this.setState({
      age: e.target.value,
    })
  }
  // dispatch an action, which changes the REDUX store
  handleClickSetAge = () => {
    this.props.onDispatchSetAge(this.state.age)
    this.setState({
      age: '',
    })
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
	  case 'Application whitelisted':
	      noti.title = 'Application `title` was added to the registry';
	      noti.message = 'Click to review the listing';
	      this.notify(noti, 'info');
	      break;
	  case 'Application challenged':
	      noti.title = 'Application `title` was challenged';
	      noti.message = 'Click to vote';
	      this.notify(noti, 'info');
	      break;
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
            alert('here is more info')
          }
        }
    });
  }

  generateButtons(i, ...names) {
      console.log(i++);
      return names.map((title, index) => {
	  return <button onClick={e => this.handleClickNotification(title)} key={title + index}>{title}</button>
      });
  }

  /*generateLogs(){
  return this.props.logs.map((log,index)=>{return <li key= {log + index}>{log._eventName}</li>})
  }*/

  /*getMessage(title) {
      switch (title) {
	  case 'Application added':
	  case 'Your vote won!':
	    this.props.onDispatchNotification(success(noti));
	    break;
	  case 'Applciation whitelisted':
	  case 'Application challenged':
	  case 'Listing challenged':
	    this.props.onDispatchNotification(info(noti));
	    break;
	  case 'Your vote lost!':
	  case 'Transaction failed':
	  case 'Application removed':
	  default:
	    this.props.onDispatchNotification(error(noti));
      }
  }*/

  render() {
    //let l = this.generateButtons(0, '', '', '');
    //let logs = this.generateLogs()
    let list = this.generateButtons(0, 'Application added', 'Application whitelisted', 'Application removed', 'Application challenged', 'Listing challenged', 'Your vote won!', 'Your vote lost!', 'Transaction failed');
    return (
      <div>
        <div>Home Component</div>
        <input value={this.state.name} onChange={this.handleChangeName} />
        <button onClick={this.handleClickSetName}>Set name</button>

        <input value={this.state.age} onChange={this.handleChangeAge} />
        <button onClick={this.handleClickSetAge}>Set age</button>
	{list}
	{/*<div onClick={e => this.handleClickNotification('Application')}>Application</div>
	<div onClick={e => this.handleClickNotification('Challenge')}>Challenge</div> */}

        {this.props.name === 'isaac' ? (
          <div>NAME IS ISAAC</div>
        ) : this.props.name === 'wes' ? (
          <div>NAME IS WES</div>
        ) : (
          this.props.name !== '' && <div>NAME IS SOMETHING ELSE</div>
        )}

        <br />
        <br />

        <div>{`React State Name: ${this.state.name}`}</div>
        <div>{`React State Age: ${this.state.age}`}</div>

        <br />
        <br />

        <div>{`Redux Store Name: ${this.props.name}`}</div>
        <div>{`Redux Store Age: ${this.props.age}`}</div>

        <br />
        <br />

        {`there are ${this.props.notifications.length} notifications`}

        <Notifications notifications={this.props.notifications} />
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onDispatchSetName: name => dispatch(setName(name)),
    onDispatchSetAge: age => dispatch(setAge(age)),
    onDispatchNotification: notification => dispatch(notification),
    onDispatchSetLink: link => dispatch(link),
    onDispatchSetLogs: logs => dispatch(logs),
  }
}

function mapStateToProps(state) {
  return {
    name: state.home.name,
    age: state.home.age,
    notifications: state.notifications,
    link: state.link,
    logs: state.logs.logs,
    latestBlock: state.logs.latestBlock,
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default compose(withConnect)(Home)
