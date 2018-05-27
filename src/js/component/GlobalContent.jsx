import React from 'react';
import ContentLadder from './ContentLadder.jsx'
import ContentGroup from './ContentGroup.jsx'
import ContentMatch from './ContentMatch.jsx'
import ContentPlayer from './ContentPlayer.jsx'

export var GlobalContent = (props) => {
    return (
        <div className={"content-warp " + (props.showBreadcrumbs && "showBreadcrumbs")} >
            <div className="content">

                {props.contentWindow === "LADDERS" && <ContentLadder {...props} />}
                {props.contentWindow === "GROUPS" && <ContentGroup  {...props} />}
                {props.contentWindow === "MATCHES" && <ContentMatch {...props} />}
                {props.contentWindow === "PLAYERS" && <ContentPlayer {...props} />}

            </div>
        </div>
    )
}

export default GlobalContent;