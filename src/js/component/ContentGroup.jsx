import React from 'react';
import { GlobalAppActions, fetchGroups, fetchMatches } from '../lib/actions.js'
import Loading from './ContentUtils.jsx';
import { recalculateGroups, sortProperties } from '../lib/utils.js';


export class ContentGroup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            content: []
        }
    }

    dispatch(action) {
        this.setState(preState => GlobalAppActions(preState, action));
    }

    componentDidMount() {
        fetchMatches.bind(this)();
    }

    renderGroups() {
        var groups = {};
        recalculateGroups(groups, this.state.content);

        if (Object.keys(groups).length == 0) return null;
        return Object.keys(groups).map(function (key, index, array) {
            var currentValue = groups[key];
            return <Group key={"groupbox" + index} name={key}
                details={sortProperties(groups[key], "p", true, true)}  {...this.props} />
        }.bind(this));
    }

    render() {
        return this.state.showLoading ? <Loading /> : this.renderGroups();
    }
}


function Group(props) {

    var groupsRow = [];
    props.details.forEach(function (key, index) {
        if (isNaN(key[0])) return;
        var ele = key[1];
        groupsRow.push(<GroupRow key={"GroupRow" + index} idTeam={parseInt(key[0]) - 1} ng={ele.ng} p={ele.p} pg={ele.pg} teams={props.teams} />);
    })
    return (
        <div className="group">
            <div className="title">
                <div> Grupo {props.name}</div>
            </div>
            <div className="row">
                <div>
                </div>
                <div>Equipo</div>
                <div>GF</div>
                <div>GC</div>
                <div>Dif</div>
                <div>P</div>
            </div>
            {groupsRow}
        </div>
    )
}


function GroupRow(props) {
    console.log(props);
    return (
        <div className="row" >
            <div>
                <div className={"flag flag-" + props.teams[props.idTeam].iso2}></div>
            </div>
            <div>{props.teams[props.idTeam].name}</div>
            <div>{props.pg}</div>
            <div>{props.ng}</div>
            <div>{props.pg - props.ng}</div>
            <div>{props.p}</div>
        </div>
    )
}

export default ContentGroup;