import React from 'react';
import { GlobalAppActions, fetchLeaveLadder } from '../lib/actions.js'
import {ModalLoading} from './ContentUtils.jsx';

export class ContentLeaveLadder extends React.Component {

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
                <div>¿Desea abandonar la quiniela?</div>
                <div>{this.props.laddername}</div>
                <div className="public" >
                    
                </div>
                <div style={{fontSize:"0.8em"}}>
                   Esta acción es irreversible
                </div>
                <div><button onClick={() => fetchLeaveLadder.bind(this)()}>aceptar</button></div>
                <div> </div>
            </div>
    }

}

export default ContentLeaveLadder;