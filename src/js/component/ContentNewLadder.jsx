import React from 'react';
import { GlobalAppActions, fetchNewLadder } from '../lib/actions.js'
import {ModalLoading} from './ContentUtils.jsx';

export class ContentNewLadder extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            showPassword: false,

            laddername: undefined,
            password: undefined,
            type:"Completo",
            public: true,
            error: false,
            errorPassword: false
        }
    }

    dispatch(action) {
        this.setState(preState => GlobalAppActions(preState, action));
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value,
            error: false,
            errorPassword: false
        });
    }

    render() {
        return this.state.showLoading ? <div className="newLadder"><ModalLoading /></div>
            :
            <div className="newLadder">

                <div>Crear nueva quiniela</div>
                <div><input className={this.state.error ? "error" : ""} id="laddername" type="text" placeholder="Nombre quiniela" value={this.state.laddername} onChange={this.handleChange.bind(this)} /></div>
                <div className="public" >
                    {this.state.public && <div onClick={() => this.dispatch({ type: "TOGGLE_PUBLIC" })} key="newLadderlock" className="iconCenter green"> <i className="fas fa-unlock" ></i> </div>}
                    {this.state.public || <div onClick={() => this.dispatch({ type: "TOGGLE_PUBLIC" })} key="newLadderUnlock" className="iconCenter red"> <i className="fas fa-lock" ></i></div>}
                </div>
                <div><button onClick={() => this.dispatch({ type: "TOGGLE_TYPE" })} >{this.state.type}</button></div>
                
                {this.state.public || <div><div><input className={this.state.errorPassword ? "error" : ""} type="pasword" placeholder="Contraseña" id="password" onChange={this.handleChange.bind(this)} /></div></div>}
                
                <div><button onClick={() => fetchNewLadder.bind(this)()} >Enviar</button></div>
                <div> </div>
            </div>
    }

}

export default ContentNewLadder;