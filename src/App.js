import React from 'react';
import BreadCrumbs from './js/component/BreadCrumbs.jsx';
import Menu from './js/component/Menu.jsx';
import SideMenu from './js/component/SideMenu.jsx';
import ModalContent from './js/component/ModalContent.jsx';
import GlobalContent from './js/component/GlobalContent.jsx';
import {Welcome} from './js/component/ContentUtils.jsx';
import { GlobalAppActions, prefetchMatches, prefetchTeams, prefetchGroups, prefetchSession } from './js/lib/actions.js'

import './css/breadCrumbs.css'
import './css/content.css'
import './css/flags.css'
import './css/groups.css'
import './css/main.css'
import './css/matches.css'
import './css/menu.css'
import './css/modal.css'
import './css/player.css'
import './css/playerMatches.css'
import './css/SideMenu.css'

require('./js/lib/control.js');


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showWelcome: true,
      showMenu: false,
      showBreadcrumbs: false,

      contentWindow: "LADDERS",
      teams: [],
      token: undefined,
      subTitle: "Quinielas",
      dispatch: (action) => this.dispatch(action)
    }
  }

  componentDidMount() {
    prefetchSession.bind(this)();
    prefetchTeams.bind(this)();
  }

  dispatch(action) {
    this.setState(preState => GlobalAppActions(preState, action));
  }

  render() {

    document.body.classList.toggle('noscroll', this.state.showModal || this.state.showMenu);
    return <div>
      {this.state.showWelcome && <Welcome />}
      {this.state.showMenu && <div onClick={() => this.dispatch({ type: "TOGGLE_MENU" })} className={"sideMenu-modal " + (this.state.showMenu && "show")} />}
      {this.state.showBreadcrumbs && <BreadCrumbs breadcrumbs={this.state.breadcrumbs} />}
      <Menu  {...this.state} />
      <SideMenu {...this.state} />
      <ModalContent  {...this.state} />
      <GlobalContent {...this.state} />
      <div className="footer">
        <div><i class="fab fa-github-square"></i><a style={{ fontSize:"0.5em", lineHeight:"50px", paddingLeft:"20px"}} href="https://github.com/splitfirex">Splitfirex</a></div>
        <div><i class="fab fa-twitter-square"></i><span style={{ fontSize:"0.5em", paddingLeft:"20px"}}>dfarinaf</span></div>
        <div style={{ textAlign:"center"}} >gallego.ml @ Version 1.0.0</div>      
      </div>
    </div>
  }

}



export default App;
