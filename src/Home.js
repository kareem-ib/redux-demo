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
import { setLogs, setLatestBlock } from './actions'
import { generateNoti, EventTypes } from './notifs'

class Home extends Component {
  getEthLogs = () => {
    // events and rawLogs match indices
    let events = [];
    let rawLogs = [];
    this.getAddresses().forEach(async (address) => {
	const filter = {
	  fromBlock: this.props.latestBlock === 'latest' ? '0' : this.props.latestBlock,
	  toBlock: 'latest',
	  address,
	  topics: [],
	}
	
	const rawLog = await this.eth.getLogs(filter)
	rawLogs.push(...rawLog);

	const decoder = await EthAbi.logDecoder(contractJSON[address].abi)

	const ev = decoder(rawLog);
	events.push(...ev);
	console.log(events, rawLogs);
    });
    return { rawLogs, events };
  }

  // Does this need to be its own function?
  getAddresses = () => {
    return ['0x946184cde118286d46825b866521d0236800c613', // PLCRVoting
    '0x39cfbe27e99bafa761dac4566b4af3b4c9cc8fbe', // Registry
    '0xd71498b67c157927b39900b51b13621e9b106769', // Parameterizer
    '0x73064ef6b8aa6d7a61da0eb45e53117718a3e891'] // EIP20
  }

  state = {
    name: '',
    age: '',
  }

  buttonId = () => { return this.id++; }
  componentDidMount() {
    this.id = 0;
    this.eth = new Ethjs(window.web3.currentProvider)
    this.getEthLogs();

    setInterval(async () => {
      const Latest = (await this.eth.blockNumber()).toString()

      console.log('ITERATE');

      if (this.props.latestBlock !== Latest || this.props.latestBlock === 'latest') {
        this.props.onDispatchSetLatestBlock(setLatestBlock(Latest))
        
        const { rawLogs, events } = await this.getEthLogs() // this.getEthLogs() => {registry: events, plcrevents: plcrevents, eipevents, paramevents}
        
        this.props.onDispatchSetLogs(setLogs(events))
        
        this.props.logs.map((log, index) => {
          const noti = generateNoti(log._eventName, rawLogs[index].transactionHash);
          this.notify(noti, EventTypes[log._eventName]);
        });
        console.log(Latest, this.props.latestBlock)
      }
    }, 5000)
  }

// Dispatch a notification based on a given type, accepts a callback
notify(noti, type, callback = function () {}) {
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
    callback();
}
  generateButtons(...names) {
    return names.map((title, index) => {
      return <button onClick={e => {
        const noti = generateNoti(title, this.buttonId());
        this.notify(noti, EventTypes[title]);
      }} key={title + index}>{title}</button>
    });
  }

  render() {
    //let l = this.generateButtons(0, '', '', '');
    //let logs = this.generateLogs()
    let list = this.generateButtons('_Application', '_ApplicationWhitelisted', '_ApplicationRemoved', '_Challenge', '_ReparameterizationProposal', '_NewChallenge', '_ChallengeFailed', );
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
    onDispatchSetLogs: logs => dispatch(logs),
    onDispatchSetLatestBlock: latestBlock => dispatch(latestBlock),
  }
}

function mapStateToProps(state) {
  return {
    notifications: state.notifications,
    logs: state.logs,
    latestBlock: state.latestBlock,
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default compose(withConnect)(Home)
