require('dotenv').config();

const request = require('request-promise');
const Promise = require('bluebird');
const moment = require('moment');

function getBoard() {
  return _trelloRequest('boards/' + process.env.TRELLO_BOARD_ID + '/lists')
}

function findList(jsonLists) {
  const lists = JSON.parse(jsonLists);

  return new Promise(function(resolve, reject) {
    const list = lists.find(function(list) {
      return list.name === process.env.TRELLO_LIST_NAME;
    });

    resolve(list);
  });
}

function getListCards(list) {
  return _trelloRequest('lists/' + list.id + '/cards');
}

function printCards(cards) {
  console.log('Cards:');

  JSON.parse(cards).forEach(function(card) {
    console.log(card.name + '  ' + moment(card.due).format('MM/DD/YYYY h:mm a'));
  });
}

function _trelloRequest(urlFragment) {
  return request({
    uri: 'https://api.trello.com/1/' + urlFragment,
    qs: {
      'key': process.env.TRELLO_KEY,
      'token': process.env.TRELLO_TOKEN
    }
  });
}

getBoard()
.then(findList)
.then(getListCards)
.then(printCards);
