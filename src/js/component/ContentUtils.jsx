import React from 'react';

export const Welcome = ()  => {
    return (<div className="modalWelcome">
        <div>
            <img src={require("../../img/worldcup.svg")} alt="Cargando" />
            <img src={require("../../img/logo.png")} style={{ height: "40px", marginTop: "40px" }} alt="Cargando" />
        </div>
    </div>)
}

export const Loading = (props) => {
    return (
        <div className="loading">
            <i className="fas fa-spinner fa-pulse"></i>
        </div>
    )
}

export const  ModalLoading = () => {
    return (<div style={{ textAlign: "center", fontSize: "1em", alignSelf: "center" }}><i className="fas fa-cog fa-spin"></i> <br /> Procesando... </div>)
}

export default Loading;