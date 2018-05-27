import React from 'react';
import { GlobalAppActions, fetchBanPlayer } from '../lib/actions.js'
import {ModalLoading} from './ContentUtils.jsx';

export class ContentBanPlayer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
        }
    }

    dispatch(action) {
        this.setState(preState => GlobalAppActions(preState, action));
    }

    render() {
        return this.state.showLoading ? <div className="newLadder"><ModalLoading /></div>
            :
            <div className="newLadder">
                <div>¿Desea expulsar el siguiente usuario?</div>
                <div>{this.props.playername}</div>
                <div className="public" >
                    
                </div>
                <div style={{fontSize:"0.8em"}}>
                   Esta acción es irreversible
                </div>
                <div><button onClick={() => fetchBanPlayer.bind(this)()}>Expulsar</button></div>
                <div> </div>
            </div>
    }

}
export default ContentBanPlayer;