import React from 'react';
import { server, genericLaddername, genericPlayername, postData, getData } from './basicConfig.js'

export const GlobalAppActions = (state, action) => {

    switch (action.type) {
        case "CLOSE_MODAL":
            return { showModal: false }
        case "GO_BACK":
            window.scrollTo(0, 0);
            if (state.playername !== undefined) {
                return { subTitle: "Jugadores", showMenu: false, contentWindow: "PLAYERS", breadcrumbs: [state.laddername], playername: undefined }
            }
            return { subTitle: "Quinielas", showMenu: false, laddername: undefined, contentWindow: "LADDERS", showBreadcrumbs: false, breadcrumbs: [] }
        case "TOGGLE_MENU":
            return { showMenu: !state.showMenu }
        case "LOADING_PREFETCHS":
            return { showWelcome: true }
        case "SUCCESS_PREFETCHS":
            state[action.prefetch] = action.content;
            if (state.teams.length === 0) {
                return { ...state }
            }
            return { showWelcome: false }
        case "GO_TO":

            switch (action.dest) {
                case "SHOW_HOME":
                    window.scrollTo(0, 0);
                    return { subTitle: "Quinielas", playername: undefined, laddername: undefined, showMenu: false, contentWindow: "LADDERS", showBreadcrumbs: false }
                case "SHOW_GROUPS":
                    window.scrollTo(0, 0);
                    return { subTitle: "Grupos", playername: undefined, laddername: undefined, showMenu: false, contentWindow: "GROUPS", showBreadcrumbs: false }
                case "SHOW_MATCHES":
                    window.scrollTo(0, 0);
                    return { subTitle: "Partidos", playername: undefined, laddername: undefined, showMenu: false, contentWindow: "MATCHES", showBreadcrumbs: false }
                case "SHOW_PLAYERS":
                    window.scrollTo(0, 0);
                    return { subTitle: "Jugadores", laddername: action.laddername, showMenu: false, contentWindow: "PLAYERS", showBreadcrumbs: true, breadcrumbs: [action.laddername] }
                case "SHOW_PLAYER_MATCHES":
                    window.scrollTo(0, 0);
                    return { subTitle: "Partidos", playername: action.playername, laddername: action.laddername, showMenu: false, contentWindow: "MATCHES", showBreadcrumbs: true, breadcrumbs: [action.playername] }
                case "SHOW_PLAYER_GROUPS":
                    window.scrollTo(0, 0);
                    return { subTitle: "Grupos", playername: action.playername, laddername: action.laddername, showMenu: false, contentWindow: "GROUPS", showBreadcrumbs: true, breadcrumbs: [action.playername] }
                case "SIGN_IN":
                    return { showModal: true, showMenu: false, contentModalWindow: "SIGNIN" }
                case "SIGN_UP":
                    return { showModal: true, showMenu: false, contentModalWindow: "SIGNUP" }
                case "NEW_LADDER":
                    return { showModal: true, showMenu: false, contentModalWindow: "NEWLADDER" }
                case "JOIN_LADDER":
                    return { showModal: true, showMenu: false, contentModalWindow: "JOINLADDER", laddername: action.laddername, ladderProtected: action.ladderProtected }
                case "BAN_PLAYER":
                    return { showModal: true, showMenu: false, contentModalWindow: "BANPLAYER", laddername: action.laddername, playername: action.playername }
                case "LEAVE_LADDER":
                    return { showModal: true, showMenu: false, contentModalWindow: "LEAVELADDER", laddername: action.laddername }
                default:
                    return state
            }
        case "SUCCESS_UPDATE_COLOR":
            state.content.bgColor = action.content.bgColor;
            return { showLoading: false, content: state.content }
        case "LOADING_CONTENT":
            return { forceReload: false, showLoading: true }
        case "TOGGLE_PUBLIC":
            return { public: !state.public }
        case "TOGGLE_TYPE":
            return { type: (state.type == "Completo") ? "Por Fases" : "Completo" }
        case "SUCCESS_CONTENT":
            return { showLoading: false, content: action.content }

        case "SUCCESS_MATCHES":
            return { showLoading: false, content: action.content }
        case "SUCCESS_GROUPS":
            return { groups: action.content }
        case "UPDATE_PLAYER":
            state.content.listaUsers[action.content.username] = action.content
            return { content: state.content }
        case "SUCCESS_LOGIN":
            window.scrollTo(0, 0);
            return { forceReload: true, contentModalWindow: "", showBreadcrumbs: false, subTitle: "Quinielas", contentWindow: "LADDERS", showModal: false, showLoading: false, username: action.username, token: action.token }
        case "SUCCESS_LOGOUT":
            fetchLogout();
            window.scrollTo(0, 0);
            return { showMenu: !state.showMenu, showBreadcrumbs: false, subTitle: "Quinielas", contentWindow: "LADDERS", showModal: false, showLoading: false, username: undefined, token: undefined }
        case "SUCCESS_CREATE":
            return { forceReload: true, contentModalWindow: "", showBreadcrumbs: true, breadcrumbs: [action.laddername], subTitle: action.laddername, contentWindow: "PLAYERS", showModal: false, laddername: action.laddername }
        case "SUCCESS_LEAVE":
        case "SUCCESS_JOIN":
            return { forceReload: true, contentModalWindow: "", showModal: false, subTitle: "Quinielas", playername: undefined, laddername: undefined, showMenu: false, contentWindow: "LADDERS", showBreadcrumbs: false }
        case "UNFORCE":
            return { forceReload: false }
        case "CLOSE_AND_RELOAD":
            return { forceReload: true, showModal: false }
        case "FAIL_PROCESS_PASSWORD":
            return { showLoading: false, errorPassword: true }
        default:
            return state;


    }

}

export const LoginAppActions = (state, action) => {
    switch (action.type) {
        case "LOADING_CONTENT":
            return { showLoading: true }
        case "FAIL_PROCESS":
            return { showLoading: false, error: true }
        default:
            return state
    }
}

export var prefetchTeams = function () {
    this.dispatch({ type: "LOADING_PREFETCHS" });
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (req) {
        if (req.target.readyState == 4 && req.target.status == 200) {
            this.dispatch({ type: "SUCCESS_PREFETCHS", prefetch: "teams", content: JSON.parse(req.target.responseText) });
        }
    }.bind(this);
    xhttp.open("GET", server + "/team/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.send();
}

export var fetchLadders = function () {
    this.dispatch({ type: "LOADING_CONTENT" });
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (req) {
        if (req.target.readyState == 4 && req.target.status == 200) {
            this.dispatch({ type: "SUCCESS_CONTENT", content: JSON.parse(req.target.responseText) });
        }
    }.bind(this);
    xhttp.open("GET", server + "/leader/", true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.send();
}

export var fetchMatches = function () {
    this.dispatch({ type: "LOADING_CONTENT" });

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (req) {
        if (req.target.readyState == 4 && req.target.status == 200) {
            this.dispatch({ type: "SUCCESS_CONTENT", content: JSON.parse(req.target.responseText) });
        }
    }.bind(this);
    xhttp.open("GET", server + "/group?leadername=" + (this.props.laddername || genericLaddername) + "&username=" + (this.props.playername || genericPlayername), true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.send();
}

export var prefetchSession = function () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (req) {
        if (req.target.readyState == 4 && req.target.status == 200) {
            this.dispatch({ type: "SUCCESS_LOGIN", username: JSON.parse(req.target.responseText).user.username });
        } else if (req.target.status == 400) {
            this.dispatch({ type: "FAIL_PROCESS" });
        }
    }.bind(this);
    xhttp.open("POST", server + "/user/sesion", true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.send();
}

export var fetchPlayers = function () {
    this.dispatch({ type: "LOADING_CONTENT" });
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (req) {
        if (req.target.readyState == 4 && req.target.status == 200) {
            this.dispatch({ type: "SUCCESS_CONTENT", content: JSON.parse(req.target.responseText) });
        }
    }.bind(this);
    xhttp.open("GET", server + "/leader/detail?leadername=" + (this.props.laddername || genericLaddername), true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.send();
}

export var fetchLogin = function () {

    this.dispatch({ type: "LOADING_CONTENT" });
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (req) {
        if (req.target.readyState == 4 && req.target.status == 200) {
            this.props.dispatch({ type: "SUCCESS_LOGIN", username: JSON.parse(req.target.responseText).user.username });
        } else if (req.target.status == 400) {
            this.dispatch({ type: "FAIL_PROCESS" });
        }
    }.bind(this);
    xhttp.open("POST", server + "/user/login", true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.withCredentials = true
    xhttp.send(JSON.stringify({ "username": this.state.username.trim().replace(/\./g,'_'), "passwd": this.state.password }));
}

export var fetchLogout = function () {

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", server + "/user/logout", true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.withCredentials = true
    xhttp.send();
}

export var fetchRegister = function () {
    if (this.state.password.trim().length === 0 || this.state.passwordRepeat.trim() != this.state.password.trim()) {
        this.dispatch({ type: "FAIL_PROCESS" });
        return;
    }
    this.dispatch({ type: "LOADING_CONTENT" });
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (req) {
        if (req.target.readyState == 4 && req.target.status == 200) {
            this.props.dispatch({ type: "SUCCESS_LOGIN", username: JSON.parse(req.target.responseText).user.username });
        } else if (req.target.status == 400) {
            this.dispatch({ type: "FAIL_PROCESS" });
        }
    }.bind(this);
    xhttp.open("POST", server + "/user/register", true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.withCredentials = true
    xhttp.send(JSON.stringify({ "username": this.state.username.trim().replace(/\./g,'_'), "password": this.state.password.trim() }));

}

export var fetchNewLadder = function () {
    if (!this.state.public && (this.state.password == undefined || this.state.password.length === 0)) {
        this.dispatch({ type: "FAIL_PROCESS_PASSWORD" });
        return;
    }
    this.dispatch({ type: "LOADING_CONTENT" });
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (req) {
        if (req.target.readyState == 4 && req.target.status == 200) {
            this.props.dispatch({ type: "SUCCESS_CREATE", laddername: JSON.parse(req.target.responseText).name });
        } else if (req.target.status == 400) {
            this.dispatch({ type: "FAIL_PROCESS" });
        }
    }.bind(this);
    xhttp.open("POST", server + "/leader/create", true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.withCredentials = true
    xhttp.send(JSON.stringify({ leadername: this.state.laddername, type: this.state.type, "password": this.state.password }));
}

export var fetchJoinLadder = function () {
    if (this.props.ladderProtected && !this.state.password && this.state.password.length === 0) {
        this.dispatch({ type: "FAIL_PROCESS_PASSWORD" });
        return;
    }
    this.dispatch({ type: "LOADING_CONTENT" });
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (req) {
        if (req.target.readyState == 4 && req.target.status == 200) {
            this.props.dispatch({ type: "SUCCESS_JOIN" });
        } else if (req.target.status == 400) {
            this.dispatch({ type: "FAIL_PROCESS_PASSWORD" });
        }
    }.bind(this);
    xhttp.open("POST", server + "/leader/join", true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.withCredentials = true
    xhttp.send(JSON.stringify({ leadername: this.props.laddername, type: this.state.type, "password": this.state.password }));

}

export var fetchPlayerStatus = function (laddername, playername, admin, active) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (req) {
        if (req.target.readyState == 4 && req.target.status == 200) {
            this.dispatch({ type: "UPDATE_PLAYER", content: JSON.parse(req.target.responseText) });
        }
    }.bind(this);
    xhttp.open("POST", server + "/leader/updatestatus", true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.send(JSON.stringify({
        "username": playername, "isActive": active, "isAdmin": admin, "leadername": laddername
    }));
}

export var fetchBanPlayer = function () {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (req) {
        if (req.target.readyState == 4 && req.target.status == 200) {
            this.props.dispatch({ type: "CLOSE_AND_RELOAD" });
        }
    }.bind(this);
    xhttp.open("POST", server + "/leader/kick", true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.send(JSON.stringify({ "username": this.props.playername, "leadername": this.props.laddername }));
}

export var fetchUpdateScore = function (matchData) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (req) {
        if (req.target.readyState == 4 && req.target.status == 200) {
            //this.dispatch({ type: "SUCCESS_CONTENT", content: JSON.parse(req.target.responseText) });
        }
    }.bind(this);
    xhttp.open("POST", server + "/group/updatematch", true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.send(JSON.stringify({
        leadername: this.props.laddername,
        home_team: matchData.home_team, away_team: matchData.away_team,
        home_result: matchData.home_result, away_result: matchData.away_result,
        home_penalty: matchData.home_penalty, away_penalty: matchData.away_penalty,
        match: matchData.name
    }));

}

export var fetchUpdateColor = function () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (req) {
        if (req.target.readyState == 4 && req.target.status == 200) {
            this.dispatch({ type: "SUCCESS_UPDATE_COLOR", content: JSON.parse(req.target.responseText) });
        }
    }.bind(this);
    xhttp.open("POST", server + "/leader/updatecolor?leadername=" + this.props.laddername, true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.send();
}

export var fetchLeaveLadder = function () {

    this.dispatch({ type: "LOADING_CONTENT" });
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (req) {
        if (req.target.readyState == 4 && req.target.status == 200) {
            this.props.dispatch({ type: "SUCCESS_LEAVE" });
        }
    }.bind(this);
    xhttp.open("POST", server + "/leader/leave", true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.send(JSON.stringify({ "leadername": this.props.laddername }));
}

export var fetchNextMatches = function () {
    /* this.dispatch({ type: "LOADING_CONTENT" });
     if (this.props.token === undefined) {
         fetch(server + '/user/nextmatches?username=' + (this.state.playername || genericPlayername) + '&laddername=' + (this.props.laddername || genericLaddername), getData)
             .then(res => res.json())
             .then(function (json) {
                 this.dispatch({ type: "SUCCESS_CONTENT", content: json });
             }.bind(this));
     } else {
         postData.body = JSON.stringify({ "token": this.props.token, "username": (this.state.playername || genericPlayername), "laddername": (this.props.laddername || genericLaddername) });
         fetch(server + "/user/nextmatches", postData)
             .then(res => res.json())
             .then(function (json) {
                 this.dispatch({ type: "SUCCESS_CONTENT", content: json });
             }.bind(this));
     }*/
}



export default GlobalAppActions;