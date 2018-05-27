import React from 'react';
import Loading from './ContentUtils.jsx';
import { GlobalAppActions, fetchLadders } from '../lib/actions.js'
import { genericPlayername, genericLaddername } from '../lib/basicConfig.js'

export class ContentLadder extends React.Component {

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

    componentWillReceiveProps(nextProps) {
        if (nextProps.forceReload) {
            this.props.dispatch({ type: "UNFORCE" });
            fetchLadders.bind(this)();
        }
    }

    componentDidMount() {
        fetchLadders.bind(this)();
    }

    renderLadders() {
        return this.state.content.map(function (currentValue, index, array) {
            if(this.props.username != genericPlayername && currentValue.name == genericLaddername) return;
            if (this.props.username !== undefined) {
                return <LoggedLadder
                    key={"Ladder" + index}
                    usersCount={currentValue.playerCount}
                    containsUser={currentValue.listaUsers != null}
                    containsPendingUser={currentValue.listaUsers != null && !currentValue.listaUsers[this.props.username].isActive}
                    name={currentValue.name}
                    protected={currentValue.isPassword}
                    bgColor={currentValue.bgColor}
                    type={currentValue.type}
                    dispatch={(action) => this.props.dispatch(action)}
                />
            } else {
                return <Ladder
                    key={"Ladder" + index}
                    usersCount={currentValue.playerCount}
                    name={currentValue.name}
                    protected={currentValue.isPassword}
                    bgColor={currentValue.bgColor}
                    type={currentValue.type}
                    dispatch={(action) => this.props.dispatch(action)}
                />
            }
        }.bind(this));

    }


    render() {

        return this.state.showLoading ? <Loading /> : this.renderLadders()
    }

}


function LoggedLadder(props) {

    var protectedIcon = <div><div className="iconCenter"><i className="fas fa-users"></i></div></div>

    if (props.protected) {
        protectedIcon = <div><div className="iconCenter"><i className="fas fa-lock"></i></div></div>;
    }

    if (props.containsUser && props.protected) {
        protectedIcon = <div><div className="iconCenter"><i className="fas fa-unlock"></i></div></div>;
    }

    var joinIcon = <div onClick={() => { props.dispatch({ type: "GO_TO", dest: "JOIN_LADDER", laddername: props.name, ladderProtected: props.protected }) }} ><div className="iconCenter"><i className="fas fa-user-plus"></i></div></div>;

    if (props.containsUser) {
        joinIcon = <div style={{ border: "unset" }}></div>;
    }

    if (props.containsPendingUser) {
        joinIcon = <div><div className="iconCenter"><i className="far fa-clock"></i></div></div>;
    }

    return (
        <div key={props.name + props.usersCount} className="ladder"  >
            <div style={{ backgroundColor: props.bgColor }} className="ladderShow"
                onClick={!props.protected || props.containsUser ? (() => { props.dispatch({ type: "GO_TO", dest: "SHOW_PLAYERS", laddername: props.name }) })
                    : (() => { })}>
                <div>
                    {props.name + " | "+ (props.type =="Completo" ? "C" : "P")}
                </div>
            </div>
            <div className="ladderMenu">
                <div>Jugadores:  {props.usersCount}</div>
                {joinIcon}
                {protectedIcon}
            </div>
        </div>
    )
}

function Ladder(props) {

    return (
        <div className="ladder logged" >
            <div className="ladderShow" style={{ backgroundColor: props.bgColor }}
                onClick={!props.protected ?
                    (() => { props.dispatch({ type: "GO_TO", dest: "SHOW_PLAYERS", laddername: props.name }) })
                    : (() => { props.dispatch({ type: "GO_TO", dest: "SIGN_IN" }) })} >
                <div>
                    {props.name + " | "+ (props.type =="Completo" ? "C" : "P")}
                </div>
            </div>
            <div className="ladderMenu">
                <div>Jugadores: {props.usersCount}</div>
                <div><div className="iconCenter"><i className={props.protected ? "fas fa-lock" : "fas fa-users"}></i></div></div>
            </div>
        </div>
    )
}

export default ContentLadder;