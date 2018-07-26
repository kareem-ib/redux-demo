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
import { generateNoti, notify, EventTypes, setProps } from './notifs'

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
    console.log('reg', contractName)
    switch (contractName) {
      case ('PLCRVoting'):
        return '0x946184cde118286d46825b866521d0236800c613'
      case ('Registry'):
        return '0x39cfbe27e99bafa761dac4566b4af3b4c9cc8fbe'
      case ('Parameterizer'):
        return '0xd71498b67c157927b39900b51b13621e9b106769'
      case ('EIP20'):
        return '0x73064ef6b8aa6d7a61da0eb45e53117718a3e891'
    }
  }

  state = {
    name: '',
    age: '',
  }

  componentDidMount() {
    console.log()
    this.eth = new Ethjs(window.web3.currentProvider)
    this.getEthLogs('Registry')
    this.getEthLogs('PLCRVoting')
    this.getEthLogs('EIP20')
    this.getEthLogs('Parameterizer')
    setProps(this.props);

    setInterval(async () => {
      const Latest = (await this.eth.blockNumber()).toString()

      console.log('ITERATE');

      if (this.props.latestBlock === 'latest') {
        this.props.onDispatchSetLatestBlock(setLatestBlock(Latest))
      }

      if (this.props.latestBlock !== Latest) {
        this.props.onDispatchSetLatestBlock(setLatestBlock(Latest))
        
        const events = await this.getEthLogs('Registry') // this.getEthLogs() => {registry: events, plcrevents: plcrevents, eipevents, paramevents}
        const plcrevents = await this.getEthLogs('PLCRVoting')
        const eipevents = await this.getEthLogs('EIP20')
        const paramevents = await this.getEthLogs('Parameterizer')
        
        this.props.onDispatchSetLogs(setLogs([...paramevents, ...eipevents, ...plcrevents, ...events]))
        
        this.props.logs.map((log) => {
          const noti = generateNoti(log._eventName);
          notify(noti, EventTypes[log._eventName]);
        });
        console.log(Latest, this.props.latestBlock)
      }
    }, 5000)
  }

  generateButtons(...names) {
    return names.map((title, index) => {
      return <button onClick={e => {
        const noti = generateNoti(title);
        notify(noti, EventTypes[title]);
      }} key={title + index}>{title}</button>
    });
  }

  render() {
    //let l = this.generateButtons(0, '', '', '');
    //let logs = this.generateLogs()
    setProps(this.props);
    let list = this.generateButtons('_Application', '_ApplicationWhitelisted', '_ApplicationRemoved', '_Challenge', '_TXFailed', '_ReparameterizationProposal', '_NewChallenge', '_ChallengeFailed', );
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
