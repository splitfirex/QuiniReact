import React from 'react';
import { GlobalAppActions, fetchNextMatches, fetchPlayers, fetchPlayerStatus, fetchUpdateColor } from '../lib/actions.js'
import { getTeamObject, colorScore } from '../lib/utils.js'
import Loading from './ContentUtils.jsx';

class ContentPlayer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            content: {
                listaUsers: []
            }
        }
    }

    componentDidMount() {
        fetchPlayers.bind(this)();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.forceReload) {
            this.props.dispatch({ type: "UNFORCE" });
            fetchPlayers.bind(this)();
        }
    }

    dispatch(action) {
        this.setState(preState => GlobalAppActions(preState, action));
    }

    changeStatus(laddername, playername, admin, active) {
        fetchPlayerStatus.bind(this)(laddername, playername, admin, active);
    }

    renderPayers() {

        return Object.keys(this.state.content.listaUsers).map(function (key, index, array) {
            var currentValue = this.state.content.listaUsers[key];
            if (this.isAdmin) {

                if (currentValue.username === this.props.username) {
                    return <Player
                        currentValue={currentValue}
                        dispatch={(action) => this.props.dispatch(action)}
                        {...this.props} />
                }

                return <PlayerAdmin
                    currentValue={currentValue}
                    dispatch={(action) => this.props.dispatch(action)}
                    changeStatus={(laddername, playername, admin, active) =>
                        this.changeStatus(laddername, playername, admin, active)
                    }
                    {...this.props} />

            } else {
                if (currentValue.isActive || currentValue.isAdmin) {
                    return <Player
                        currentValue={currentValue}
                        dispatch={(action) => this.props.dispatch(action)}
                        {...this.props} />
                }
                return undefined;
            }
        }.bind(this));
    }

    render() {
        if (!this.state.showLoading) {
            this.isAdmin = !this.state.content.listaUsers[this.props.username] ? false :
                this.state.content.listaUsers[this.props.username].isAdmin;
            this.isActive = !this.state.content.listaUsers[this.props.username] ? false :
                this.state.content.listaUsers[this.props.username].isActive;
        }
        return this.state.showLoading ? <Loading  /> : [
            this.isAdmin &&
            <div className="adminLadder">
                <div onClick={() => this.props.dispatch({ type: "GO_TO", dest: "LEAVE_LADDER", laddername: this.props.laddername })} > <i className="fas fa-external-link-square-alt" ></i> Abandonar</div>
                <div className="ladderColor" onClick={() => fetchUpdateColor.bind(this)()} style={{ backgroundColor: this.state.content.bgColor, color: "white" }}> <i className="fas fa-adjust" ></i> Color</div>
            </div>,
            (!this.isAdmin && this.isActive) &&
            <div className="userLadder">
                <div onClick={() => this.props.dispatch({ type: "GO_TO", dest: "LEAVE_LADDER", laddername: this.props.laddername })} > <i className="fas fa-external-link-square-alt" ></i> Abandonar la quiniela</div>
            </div>, this.renderPayers()]
    }

}

function Player(props) {

    return (
        <div className="player">
            <div className={"playerShow f" + ((props.currentValue.winnerTeam != null) && getTeamObject(props.teams, props.currentValue.winnerTeam).shortCode)}>
                <div> {props.currentValue.username} | {props.currentValue.points} </div>
            </div>
            <div id={"id" + props.currentValue.username} className="playerContent">
                <PlayerShortMatches key={"id" + props.currentValue.username} {...props} />
            </div>
            <div className="playerMenu">
                <div onClick={() => props.dispatch({ type: "GO_TO", dest: "SHOW_PLAYER_MATCHES", laddername: props.laddername, playername: props.currentValue.username })} ><div className="iconCenter"><i className="fas fa-list-ol"></i> Partidos</div></div>
                <div onClick={() => props.dispatch({ type: "GO_TO", dest: "SHOW_PLAYER_GROUPS", laddername: props.laddername, playername: props.currentValue.username })} ><div className="iconCenter"><i className="fas fa-list-alt"></i> Grupos</div></div>
            </div>
        </div>
    )
}

function PlayerAdmin(props) {
    return (
        <div className="player">
            <div className={"playerShow f" + ((props.currentValue.winnerTeam != null) && getTeamObject(props.teams, props.currentValue.winnerTeam).shortCode)}>
                <div> {props.currentValue.username} | {props.points} </div>
            </div>
            <div id={"id" + props.currentValue.username} className="playerContent">
                <PlayerShortMatches key={"id" + props.currentValue.username} {...props} />
            </div>
            <div key={props.currentValue.username + props.currentValue.isAdmin + props.currentValue.isActive} className="playerMenu admin">
                <div onClick={() => props.dispatch({ type: "GO_TO", dest: "SHOW_PLAYER_MATCHES", laddername: props.laddername, playername: props.currentValue.username })} ><div className="iconCenter"><i className="fas fa-list-ol"></i> Partidos</div></div>
                <div onClick={() => props.dispatch({ type: "GO_TO", dest: "SHOW_PLAYER_GROUPS", laddername: props.laddername, playername: props.currentValue.username })} ><div className="iconCenter"><i className="fas fa-list-alt"></i> Grupos</div></div>
                <div onClick={() => props.changeStatus(props.laddername, props.currentValue.username, !props.currentValue.isAdmin, props.currentValue.isActive)} ><div className="iconCenter"><i style={{ "color": props.currentValue.isAdmin ? "blue" : "black" }} className="fas fa-at"></i></div></div>
                <div onClick={() => props.changeStatus(props.laddername, props.currentValue.username, props.currentValue.isAdmin, !props.currentValue.isActive)} ><div className="iconCenter"><i style={{ "color": props.currentValue.isActive ? "green" : "tomato" }} className="fas fa-user"></i></div></div>
                <div onClick={() => props.dispatch({ type: "GO_TO", dest: "BAN_PLAYER", laddername: props.laddername, playername: props.currentValue.username })}><div className="iconCenter"><i className="fas fa-ban"></i></div></div>
            </div>
        </div>
    )
}

class PlayerShortMatches extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            playername: props.currentValue.username,
            content: {
                prevMatches: [],
                nextMatches: []
            }
        }
    }

    componentDidMount() {
        fetchNextMatches.bind(this)();
    }

    dispatch(action) {
        this.setState(preState => GlobalAppActions(preState, action));
    }


    renderNextMatches() {
        return this.state.content.nextMatches.map(function (currentValue, index, array) {
            return <AuxMatch key={this.props.username + " " + index}
                match={currentValue}
                index={index} round={currentValue.idMatch + 1}
                oddLast={(index + 1) % 2 !== 0 && (this.state.content.nextMatches.length - 1 === index)}
                matchStatus={currentValue.status}  {...this.props} />
        }.bind(this));
    }

    renderPrevMatches() {
        return this.state.content.prevMatches.map(function (currentValue, index, array) {
            return <AuxMatch key={this.props.username + " " + index} match={currentValue}
                index={index} round={currentValue.idMatch + 1}
                oddLast={(index + 1) % 2 !== 0 && (this.state.content.prevMatches.length - 1 === index)}
                matchStatus={currentValue.status} {...this.props} />
        }.bind(this));
    }

    render() {
        return [
            this.state.content.prevMatches.length !== 0 && <div style={{ gridColumn: "1 / span 2" }}>Partidos previos</div>,
            //this.renderPrevMatches(),
            this.state.content.nextMatches.length !== 0 && <div style={{ gridColumn: "1 / span 2" }}>Partidos siguientes </div>,
            //this.renderNextMatches()
        ]
    }

}

function AuxMatch(props) {

    var homeP = "";
    var awayP = "";
    if (props.match.home_result != undefined && props.match.home_result == props.match.away_result && props.match.type != "group") {
        homeP = "(" + (props.match.home_penalty == undefined ? "*" : props.match.home_penalty) + ")";
        awayP = "(" + (props.match.away_penalty == undefined ? "*" : props.match.away_penalty) + ")";
    }

    var homeTeam = getTeamObject(props.teams, props.match.home_team) || {};
    var awayTeam = getTeamObject(props.teams, props.match.away_team) || {};

    return (
        <div style={{ gridColumn: props.oddLast && "1 / span 2" }}>
            <div className={"teamMatch " + colorScore(props.match.status)} style={{ "borderBottom": "grey 1px solid" }}>
                <div className="teambox">
                    <div>{typeof homeTeam === 'object' ? homeTeam.shortCode : homeTeam}</div>
                    <div><div className={"flag flag-" + (typeof homeTeam === 'object' ? homeTeam.flagUrl : "none")}></div></div>
                    <div>{(props.match.home_result == undefined ? "*" : props.match.home_result) + homeP}</div>
                </div>
                <div className="teamboxSeparator">-</div>
                <div className="teambox left">
                    <div>{awayP + (props.match.away_result == undefined ? "*" : props.match.away_result)}</div>
                    <div><div className={"flag flag-" + (typeof awayTeam === 'object' ? awayTeam.flagUrl : "none")}></div></div>
                    <div>{typeof awayTeam === 'object' ? awayTeam.shortCode : awayTeam}</div>
                </div>
            </div>
        </div>
    )
}

export default ContentPlayer;