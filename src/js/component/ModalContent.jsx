import React from 'react';
import ContentLogin from './ContentLogin.jsx'
import ContentRegister from './ContentRegister.jsx'
import ContentNewLadder from './ContentNewLadder.jsx'
import ContentJoinLadder from './ContentJoinLadder.jsx'
import ContentBanPlayer from './ContentBanPlayer.jsx'
import ContentLeaveLadder from './ContentLeaveLadder.jsx'

export var ModalContent = (props) => {
    return (<div className={"modalContent " + (props.showModal && "show")}>
        <div className="backButton" onClick={() => props.dispatch({ type: "CLOSE_MODAL" })}>
            <div className="iconCenter">
                <i className="fas fa-times"></i>
            </div>
        </div>
        {props.contentModalWindow === "SIGNIN" && <ContentLogin {...props} />}
        {props.contentModalWindow === "SIGNUP" && <ContentRegister {...props} />}
        {props.contentModalWindow === "NEWLADDER" && <ContentNewLadder {...props} />}
        {props.contentModalWindow === "JOINLADDER" && <ContentJoinLadder {...props} />}
        {props.contentModalWindow === "BANPLAYER" && <ContentBanPlayer {...props} />}
        {props.contentModalWindow === "LEAVELADDER" && <ContentLeaveLadder {...props} />}
        
    </div>)
}




export default ModalContent;