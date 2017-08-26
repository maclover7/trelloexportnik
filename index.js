require('dotenv').config();

const request = require('request-promise');
const Promise = require('bluebird');
const moment = require('moment');

const boardID = process.env.TRELLO_BOARD_ID

const authParams = {
  'key': process.env.TRELLO_KEY,
  'token': process.env.TRELLO_TOKEN
};

function getBoard() {
  return request({ uri: 'https://api.trello.com/1/boards/' + boardID + '/lists', qs: authParams })
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
  return request({ uri: 'https://api.trello.com/1/lists/' + list.id + '/cards', qs: authParams })
}

function printCards(cards) {
  console.log('Cards:');

  JSON.parse(cards).forEach(function(card) {
    console.log(card.name + '  ' + moment(card.due).format('MM/DD/YYYY h:mm a'));
  });
}

getBoard()
.then(findList)
.then(getListCards)
.then(printCards);
