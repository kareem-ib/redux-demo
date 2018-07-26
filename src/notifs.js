import React, { Component } from 'react'
import {
    success,
    error,
    warning,
    info,
  } from 'react-notification-system-redux'

let props;
export function setProps(prop) {
    props = prop;
}

export const EventTypes = {
    _Application: 'success',
    _ApplicationWhitelisted: 'info',
    _ApplicationRemoved: 'error',
    _Challenge: 'info',
    _TransactionFailed: 'error',
    _Approval: 'success',
    _VoteCommitted: 'info',
    _VoteRevealed: 'info',
    _TokensRescued: 'info',
    _ReparameterizationProposal: 'info',
    _NewChallenge: 'info',
    _ProposalAccepted: 'info',
    _ChallengeSucceeded: 'info',
    _ChallengeFailed: 'info',
    _RewardClaimed: 'success',
    _ListingRemoved: 'error',
    _ListingWithdrawn: 'info',
}

function getNotiTitleAndMessage(_eventName) {
    let title, message;
    switch (_eventName) {
        case '_Application':
            title = 'Application `title` applied';
            message = 'Click to review the listing';
            break; 
        case '_ApplicationWhitelisted':
            title = 'Application `title` was added to the registry';
            message = 'Click to review the listing'; 
            break;
        case '_ApplicationRemoved':
            title = 'Application `title` removed';
            message = 'View application `title` history';
            break;
        case '_Challenge':
            title = 'Application `title` was challenged';
            message = 'Click to vote';
            break;
        case '_TransactionFailed': 
        case '_Approval': 
        case '_VoteCommitted': 
        case '_VoteRevealed': 
        case '_TokensRescued': 
        case '_ReparameterizationProposal':
            title = 'Parameter `name` proposed to be `proposal`';
            message = 'View parameter proposal';
            break;
        case '_NewChallenge':
            title = 'Parameter `name` was challenged';
            message = 'Click to vote';
            break;
        case '_ProposalAccepted': 
        case '_ChallengeSucceeded': 
        case '_ChallengeFailed':
            title = 'Challenge against `name` failed!';
            message = 'Votes in favor of listing:`_votes`\nVotes against listing: `_votes`';
            break;
        case '_RewardClaimed': 
        case '_ListingRemoved': 
        case '_ListingWithdrawn':
        case '_TXFailed':
            title = 'Transaction `txHash` failed!';
            message = 'View `txHash` on Etherscan';
            break;
        default:
            console.log('ERROR IN getNotiTitleAndMessage()');   
    }

    return {title, message};
  }

export function generateNoti(_eventName, action = () => {}) {
    const titleAndMessage = getNotiTitleAndMessage(_eventName);
    return {
        uid: props.notifications.length + 1,
        title: titleAndMessage.title,
        message: titleAndMessage.message,
        position: 'tl',
        autoDismiss: 0,
        dismissible: 'both',
        action,
    }
}

export function notify(noti, type, callback = function () {}) {
    switch (type) {
        case 'success':
            props.onDispatchNotification(success(noti));
            break;
        case 'info':
            props.onDispatchNotification(info(noti));
            break;
        case 'warning':
            props.onDispatchNotification(warning(noti));
            break;
        case 'error':
            props.onDispatchNotification(error(noti));
            break;
        default:
            console.log('ERROR IN CALLING this.notify()');
    }
    callback();
}