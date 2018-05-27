import React from 'react';
import { GlobalAppActions, fetchLadders, fetchUpdateScore, fetchMatches, fetchMatchesGroups } from '../lib/actions.js'
import Loading from './ContentUtils.jsx';
import { zeroPad, colorScore, calculateTeam, recalculateGroups, getTeamObject } from '../lib/utils.js';
import { genericPlayername } from '../lib/basicConfig'

export class ContentMatch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            content: [],
            groups: {},
            editables: [],
            updateReferences: [],
        }
        this.currentSubtitle = "";
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.forceReload) {
            this.props.dispatch({ type: "UNFORCE" });
            fetchLadders.bind(this)();
        }
    }

    toggleEdit(id) {

        if (this.state.editables.indexOf(id) === -1) {
            this.state.editables.push(id);
        } else {
            this.state.editables.splice(this.state.editables.indexOf(id), 1);

            this.state.content[id].update = true;
            this.state.groups = {};
            recalculateGroups(this.state.groups, this.state.content);

            Object.keys(this.state.content).map(function (key, index, array) {
                var currentValue = this.state.content[key];
                var homeTeam = calculateTeam(currentValue, this.state.groups, array, this.props.teams, "home");
                var awayTeam = calculateTeam(currentValue, this.state.groups, array, this.props.teams, "away");
                if (currentValue.type != "group") {
                    if (currentValue.home_team != (typeof homeTeam === 'object' ? homeTeam.id : null)) currentValue.update = true;
                    if (currentValue.away_team != (typeof awayTeam === 'object' ? awayTeam.id : null)) currentValue.update = true;

                    currentValue.home_team = typeof homeTeam === 'object' ? homeTeam.id : null;
                    currentValue.away_team = typeof awayTeam === 'object' ? awayTeam.id : null;
                }
            }.bind(this));

            // this.getReferences(listado, match);

            Object.keys(this.state.content).map(function (key, index, array) {
                if (this.state.content[key].update) {
                    fetchUpdateScore.bind(this)(this.state.content[key])
                    this.state.content[key].update = false;
                };
            }.bind(this));

        }
        this.setState({
            editables: this.state.editables,
            groups: this.state.groups
        });

    }

    getReferences(listado, match) {

        if (match.references != null) {
            for (var i = 0; i < match.references.length; i++) {
                var id = match.references[i];
                var newMatch = this.state.content.filter((e) => e.id == id)[0];
                listado.push(newMatch.id);
                this.getReferences(listado, newMatch);
            }

        }
    }

    incrementScore(id, score) {
        var content = this.state.content;
        content[id][score] = this.state.content[id][score] == undefined ? 0 : this.state.content[id][score] + 1;

        if ((score == "home_penalty" || score == "away_penalty") && content[id]["home_penalty"] === content[id]["away_penalty"]) {
            content[id][score] = this.state.content[id][score] == undefined ? 0 : this.state.content[id][score] + 1;
        }

        this.setState({
            content: content
        });
    }

    decrementScore(id, score) {
        var content = this.state.content;
        content[id][score] = this.state.content[id][score] == undefined ? undefined : this.state.content[id][score] - 1;
        if (this.state.content[id][score] === -1) content[id][score] = undefined;

        if ((score == "home_penalty" || score == "away_penalty") && content[id]["home_penalty"] != undefined && content[id]["home_penalty"] === content[id]["away_penalty"]) {
            content[id][score] = this.state.content[id][score] == undefined ? undefined : this.state.content[id][score] - 1;
            if (this.state.content[id][score] === -1) content[id][score] = undefined;
        }

        this.setState({
            content: content
        });
    }

    componentDidMount() {
        fetchMatches.bind(this)();
    }

    dispatch(action) {
        this.setState(preState => GlobalAppActions(preState, action));
    }

    renderSubtitle(newSubtitle) {
        if (newSubtitle.length == 1) newSubtitle = "Group";
        if (this.currentSubtitle === newSubtitle) {
            return undefined;
        }
        this.currentSubtitle = newSubtitle;
        return <div>{this._translate(this.currentSubtitle)}</div>
    }

    _translate(value) {
        if (value.indexOf("Group") != -1) return "Fase de grupos";
        if (value.indexOf("Round of 16") != -1) return "Octavos de final";
        if (value.indexOf("Quarter-finals") != -1) return "Cuartos de final";
        if (value.indexOf("Semi-finals") != -1) return "Semi Final";
        if (value.indexOf("Third place play-off") != -1) return "Tercer lugar";
        if (value.indexOf("Final") != -1) return "Final";
    }

    renderMatches() {
        if (Object.keys(this.state.groups).length == 0) {
            recalculateGroups(this.state.groups, this.state.content);
            Object.keys(this.state.content).map(function (key, index, array) {
                var currentValue = this.state.content[key];
                var homeTeam = calculateTeam(currentValue, this.state.groups, array, this.props.teams, "home");
                var awayTeam = calculateTeam(currentValue, this.state.groups, array, this.props.teams, "away");
                if (currentValue.type != "group") {
                    if (currentValue.home_team != (typeof homeTeam === 'object' ? homeTeam.id : null)) currentValue.update = true;
                    if (currentValue.away_team != (typeof awayTeam === 'object' ? awayTeam.id : null)) currentValue.update = true;

                    currentValue.home_team = typeof homeTeam === 'object' ? homeTeam.id : null;
                    currentValue.away_team = typeof awayTeam === 'object' ? awayTeam.id : null;
                }
            }.bind(this));
        }

        if (Object.keys(this.state.groups).length == 0) return null;
        return Object.keys(this.state.content).map(function (key, index, array) {
            var currentValue = this.state.content[key];
            var d = new Date(currentValue.date);
            return this.props.playername !== undefined &&
                this.props.username === this.props.playername &&
                (currentValue.editable && !currentValue.finished) || genericPlayername == this.props.username ?
                this.state.editables.indexOf(currentValue.name) !== -1 ?
                    [this.renderSubtitle(currentValue.groupName), <MatchEdit round={index + 1} key={"match" + currentValue.name}
                        id={currentValue.name}
                        date={zeroPad(d.getDate(), 2) + "/" + zeroPad(d.getMonth(), 2) + " " + zeroPad(d.getHours(), 2) + ":" + zeroPad(d.getMinutes(), 2)}
                        homeTeam={getTeamObject(this.props.teams, currentValue.home_team)}
                        awayTeam={getTeamObject(this.props.teams, currentValue.away_team)}
                        match={currentValue}
                        toggleEdit={(index) => this.toggleEdit(index)}
                        inc={(index, home) => this.incrementScore(index, home)}
                        dec={(index, home) => this.decrementScore(index, home)}
                        matchStatus={currentValue.status} />]
                    :
                    [this.renderSubtitle(currentValue.groupName), <MatchUser round={index + 1} key={"match" + currentValue.name}
                        id={currentValue.name}
                        date={zeroPad(d.getDate(), 2) + "/" + zeroPad(d.getMonth(), 2) + " " + zeroPad(d.getHours(), 2) + ":" + zeroPad(d.getMinutes(), 2)}
                        homeTeam={getTeamObject(this.props.teams, currentValue.home_team)}
                        awayTeam={getTeamObject(this.props.teams, currentValue.away_team)}
                        match={currentValue}
                        toggleEdit={(index) => this.toggleEdit(index)}
                        matchStatus={currentValue.status} />]
                :
                [this.renderSubtitle(currentValue.groupName), <Match round={index + 1} key={"match" + currentValue.name}
                    date={zeroPad(d.getDate(), 2) + "/" + zeroPad(d.getMonth(), 2) + " " + zeroPad(d.getHours(), 2) + ":" + zeroPad(d.getMinutes(), 2)}
                    homeTeam={getTeamObject(this.props.teams, currentValue.home_team)}
                    awayTeam={getTeamObject(this.props.teams, currentValue.away_team)}
                    match={currentValue}
                    matchStatus={currentValue.status} />]
        }.bind(this))
    }


    render() {
        return this.state.showLoading ? <Loading /> : this.renderMatches();
    }
}



function Match(props) {
    var homeP = "";
    var awayP = "";
    if (props.match.home_result != undefined && props.match.home_result == props.match.away_result && props.match.type != "group") {
        homeP = "(" + (props.match.home_penalty == undefined ? "*" : props.match.home_penalty) + ")";
        awayP = "(" + (props.match.away_penalty == undefined ? "*" : props.match.away_penalty) + ")";
    }


    return (
        <div className="match">
            <div>{props.round}</div>
            <div className="matchInfo">
                <div><div>{props.date}</div></div>
                <div className={"teamMatch " + colorScore(props.matchStatus)}>
                    <div className="teambox">
                        <div>{typeof props.homeTeam === 'object' ? props.homeTeam.fifaCode : props.match.home_team_ph}</div>
                        <div><div className={"flag flag-" + (typeof props.homeTeam === 'object' ? props.homeTeam.iso2 : "none")}></div></div>
                        <div>{(props.match.home_result == undefined ? "*" : props.match.home_result) + homeP}</div>
                    </div>
                    <div className="teamboxSeparator">-</div>
                    <div className="teambox left">
                        <div>{awayP + (props.match.away_result == undefined ? "*" : props.match.away_result)}</div>
                        <div><div className={"flag flag-" + (typeof props.awayTeam === 'object' ? props.awayTeam.iso2 : "none")}></div></div>
                        <div>{typeof props.awayTeam === 'object' ? props.awayTeam.fifaCode : props.match.away_team_ph}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MatchUser(props) {
    var homeP = "";
    var awayP = "";
    if (props.match.home_result != undefined && props.match.home_result == props.match.away_result && props.match.type != "group") {
        homeP = "(" + (props.match.home_penalty == undefined ? "*" : props.match.home_penalty) + ")";
        awayP = "(" + (props.match.away_penalty == undefined ? "*" : props.match.away_penalty) + ")";
    }


    return (
        <div className="match user">
            <div>{props.round}</div>
            <div className="matchInfo">
                <div><div>{props.date}</div></div>
                <div className={"teamMatch " + colorScore(props.matchStatus)}>
                    <div className="teambox">
                        <div>{typeof props.homeTeam === 'object' ? props.homeTeam.fifaCode : props.match.home_team_ph}</div>
                        <div><div className={"flag flag-" + (typeof props.homeTeam === 'object' ? props.homeTeam.iso2 : "none")}></div></div>
                        <div>{(props.match.home_result == undefined ? "*" : props.match.home_result) + homeP}</div>
                    </div>
                    <div className="teamboxSeparator">-</div>
                    <div className="teambox left">
                        <div>{awayP + (props.match.away_result == undefined ? "*" : props.match.away_result)}</div>
                        <div><div className={"flag flag-" + (typeof props.awayTeam === 'object' ? props.awayTeam.iso2 : "none")}></div></div>
                        <div>{typeof props.awayTeam === 'object' ? props.awayTeam.fifaCode : props.match.away_team_ph}</div>
                    </div>
                </div>
            </div>
            <div onClick={() => props.toggleEdit(props.id)}><div className="iconCenter"><i className="fas fa-edit"></i></div></div>
        </div>
    )
}

function MatchEdit(props) {
    var homeP = "";
    var awayP = "";
    if (props.match.home_result != undefined && props.match.home_result == props.match.away_result && props.match.type != "group") {
        homeP = "(" + (props.match.home_penalty == undefined ? "*" : props.match.home_penalty) + ")";
        awayP = "(" + (props.match.away_penalty == undefined ? "*" : props.match.away_penalty) + ")";
    }

    return (<div className="match user edit">
        <div>{props.round}</div>
        <div className="matchInfo">
            <div><div>{props.date}</div></div>
            <div className={"teamMatch " + colorScore(props.matchStatus)}>
                <div className="teambox">
                    <div>{typeof props.homeTeam === 'object' ? props.homeTeam.fifaCode : props.match.home_team_ph}</div>
                    <div><div className={"flag flag-" + (typeof props.homeTeam === 'object' ? props.homeTeam.iso2 : "none")}></div></div>
                </div>
                <div className="teamboxSeparator">-</div>
                <div className="teambox">
                    <div></div>
                    <div><div className={"flag flag-" + (typeof props.awayTeam === 'object' ? props.awayTeam.iso2 : "none")}></div></div>
                    <div>{typeof props.awayTeam === 'object' ? props.awayTeam.fifaCode : props.match.away_team_ph}</div>
                </div>
            </div>
            <div className="editBox">
                <div onClick={() => props.dec(props.id, "home_result")} > <i className="fas fa-chevron-circle-left"></i> </div>
                <div>{props.match.home_result == undefined ? "*" : props.match.home_result}</div>
                <div onClick={() => props.inc(props.id, "home_result")}> <i className="fas fa-chevron-circle-right"></i> </div>
                <div></div>
                <div onClick={() => props.dec(props.id, "away_result")}> <i className="fas fa-chevron-circle-left"></i> </div>
                <div>{props.match.away_result == undefined ? "*" : props.match.away_result}</div>
                <div onClick={() => props.inc(props.id, "away_result")}> <i className="fas fa-chevron-circle-right"></i> </div>
            </div>
            {homeP != "" && <div className="editBox">
                <div onClick={() => props.dec(props.id, "home_penalty")} > <i className="fas fa-chevron-circle-left"></i> </div>
                <div>{props.match.home_penalty == undefined ? "*" : props.match.home_penalty}</div>
                <div onClick={() => props.inc(props.id, "home_penalty")}> <i className="fas fa-chevron-circle-right"></i> </div>
                <div></div>
                <div onClick={() => props.dec(props.id, "away_penalty")}> <i className="fas fa-chevron-circle-left"></i> </div>
                <div>{props.match.away_penalty == undefined ? "*" : props.match.away_penalty}</div>
                <div onClick={() => props.inc(props.id, "away_penalty")}> <i className="fas fa-chevron-circle-right"></i> </div>
            </div>}
        </div>
        <div onClick={() => props.toggleEdit(props.id)} ><div className="iconCenter"><i className="fas fa-save"></i></div></div>
    </div>)
}

export default ContentMatch;