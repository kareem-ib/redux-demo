import {
    success,
    error,
    warning,
    info,
  } from 'react-notification-system-redux'

// Set type of notification for certain events
export const EventTypes = {
    _Application: 'info',
    _ApplicationWhitelisted: 'success',
    _ApplicationRemoved: 'error',
    _Challenge: 'info',
    _VoteCommitted: 'info',
    _VoteRevealed: 'info',
    _ReparameterizationProposal: 'info',
    _NewChallenge: 'info',
    _ProposalAccepted: 'info',
    _ChallengeSucceeded: 'info',
    _ChallengeFailed: 'info',
    _ListingRemoved: 'error',
    _ListingWithdrawn: 'info',
    Approval: 'success',
    Transfer: 'success',
    _TokensRescued: 'info',
    _RewardClaimed: 'success',
}

// Get a desired notification title and message from an event
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
        case 'Approval':
            title = 'Tokens approved';
            message = 'View on Etherscan';
            break;
        case '_VoteCommitted':
            title = 'Vote successfully committed';
            message = 'Go to voting for `title`';
            break;
        case '_VoteRevealed':
            title = 'Vote revealed';
            message = 'Go to voting for `title`';
            break;
        case '_TokensRescued':
            title = 'Tokens successfully rescued';
            message = 'View token transaction';
        case '_ReparameterizationProposal':
            title = 'Parameter `name` proposed to be `proposal`'; // Check if valid parameter?
            message = 'View parameter proposal';
            break;
        case '_NewChallenge':
            title = 'Parameter `name` was challenged';
            message = 'Click to vote';
            break;
        case '_ProposalAccepted':
            title = '`proposal` accepted';
            message = 'View parameter proposal'; 
            break;
        case '_ChallengeSucceeded':
            title = 'Challenge against `title` succeeded';
            message = 'View challenge';
            break;
        case '_ChallengeFailed':
            title = 'Challenge against `name` failed!';
            message = 'Votes in favor of listing:`_votes`\nVotes against listing: `_votes`';
            break;
        case '_RewardClaimed':
            title = 'Successfully claimed reward';
            message = 'View token transaction';
            break;
        case '_ListingRemoved':
            title = 'Listing `name` removed';
            message = 'View exit information';
            break;
        case '_ListingWithdrawn':
            title = 'Listing `name` withdrawn';
            message = '`name` is no longer on the whitelist';
            break;
	case 'Transfer':
	    title = 'Transfer was successful';
	    message = 'View transfer on Etherscan';
	    break;
        default:
	        console.log('CANT READ', _eventName); 
    }

    return {title, message};
  }

// Create a general notification from an event
export function generateNoti(_eventName, uid, action = () => {}) {
    const {title, message} = getNotiTitleAndMessage(_eventName);
    return {
        uid,
        title,
        message,
        position: 'tl',
        autoDismiss: 0,
        dismissible: 'both',
        action,
    }
}

