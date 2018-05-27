import React from 'react';

export var Menu = (props) => {
    return (<div className="menu logged">
        <div onClick={() => props.dispatch({ type: "TOGGLE_MENU" })}>
            <div className="iconCenter">
                <i key="bars" className="fas fa-bars"></i>
            </div>
        </div>
        <div>{props.subTitle}</div>
        <div></div>
        <div onClick={() => props.dispatch({ type: "GO_BACK" })} style={{ visibility: props.showBreadcrumbs ? "visible" : "hidden" }}>
            <div className="iconCenter">
                <i key="bars" className="fas fa-arrow-left"></i>
            </div>
        </div>
    </div>)
}

export default Menu;