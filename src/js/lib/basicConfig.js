export var server = "http://rest.gallego.ml/api";
export var genericPlayername = "quiniadmin";
export var genericLaddername = "MAIN_LEADERBOARD";

export var postData = {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    mode: 'cors',
    cache: 'default'
};

export var getData = {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    mode: 'cors',
    cache: 'default'
};

export default server;