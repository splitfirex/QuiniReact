export var zeroPad = (num, places) => {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}


export var colorScore = (score) => {
    if (score == null) return "whiteBG";
    switch (score) {
        case 0:
            return "tomatoBG";
        case 1:
            return "yellowBG";
        case 3:
            return "greenBG";
    }
}

export var calculateTeam = (match, group, matches, teams, location) => {
    var loc = location == "home" ? "home_team" : "away_team";
    var loc2 = location == "home" ? "home_team_ph" : "away_team_ph";

    switch (match.type) {
        case "group":
            return getTeamObject(teams, match[loc]);
        case "qualified":
            if (match.forced && match[loc] != null) return getTeamObject(teams, match[loc]);
            var g = group[match[loc2].split("_")[0]];
            if (g[g[match[loc2].split("_")[1] == "1" ? "winner": "runnerup"]].p == 0) return match[loc2];
            return getTeamObject(teams, g[match[loc2].split("_")[1] == "1" ? "winner": "runnerup"]);
        case "winner":
            if (match.forced && match[loc] != null) return getTeamObject(teams, match[loc]);

            var m = matches[match[loc2].replace(/\D+/g, '')];
            if (m.home_result == null || m.away_result == null) return match[loc2];
            if (m.home_result == m.away_result) {
                return getTeamObject(teams, (m.home_penalty > m.away_penalty ? m.home_team : m.away_team));
            }
            return getTeamObject(teams, (m.home_result > m.away_result ? m.home_team : m.away_team));
        case "loser":
            if (match.forced && match[loc] != null) return getTeamObject(teams, match[loc]);

            var m = matches[match[loc2].replace(/\D+/g, '')];
            if (m.home_result == null || m.away_result == null) return match[loc2];
            if (m.home_result == m.away_result) {
                return getTeamObject(teams, (m.home_penalty < m.away_penalty ? m.home_team : m.away_team));
            }
            return getTeamObject(teams, (m.home_result < m.away_result ? m.home_team : m.away_team));
    }
}

export var getTeamObject = (teams, id) => {
    return teams.filter(t => t.id == id)[0];
}

export var recalculateGroups = (group, matches) => {

    Object.keys(matches).forEach((key) => {
        var match = matches[key];
        if (match.type != "group" || match.home_team == null || match.away_team == null) return;
        if (!group[match.groupName]) {
            group[match.groupName] = { [match.home_team]: { p: 0, pg: 0, ng: 0 }, [match.away_team]: { p: 0, pg: 0, ng: 0 } }
        }
        if (!group[match.groupName][match.home_team]) group[match.groupName][match.home_team] = { p: 0, pg: 0, ng: 0 };
        if (!group[match.groupName][match.away_team]) group[match.groupName][match.away_team] = { p: 0, pg: 0, ng: 0 };

        var homeDetail = group[match.groupName][match.home_team];
        var awayDetail = group[match.groupName][match.away_team];

        homeDetail.p = match.home_result > match.away_result ? homeDetail.p + 3 : homeDetail.p;
        awayDetail.p = match.home_result < match.away_result ? awayDetail.p + 3 : awayDetail.p;
        homeDetail.p = match.home_result != null && match.away_result != null && match.home_result == match.away_result ? homeDetail.p + 1 : homeDetail.p;
        awayDetail.p = match.home_result != null && match.away_result != null && match.home_result == match.away_result ? awayDetail.p + 1 : awayDetail.p;

        homeDetail.ng = homeDetail.ng + (match.away_result == null ? 0 : match.away_result);
        awayDetail.ng = awayDetail.ng + (match.home_result == null ? 0 : match.home_result);

        homeDetail.pg = homeDetail.pg + (match.home_result == null ? 0 : match.home_result);
        awayDetail.pg = awayDetail.pg + (match.away_result == null ? 0 : match.away_result);
    });

    Object.keys(group).forEach((key) => {
        Object.keys(group[key]).forEach((key2) => {
            if (!group[key].winner) {
                group[key].winner = key2;
                return;
            }
            if (group[key].winner && !group[key].runnerup) {
                group[key].runnerup = key2;
            }
            var winner = group[key][group[key].winner];
            var runnerup = group[key][group[key].runnerup];
            var contend = group[key][key2];
            if (winner.p == contend.p) {
                if ((winner.pg - winner.ng) < (contend.pg - contend.ng)) {
                    group[key].runnerup = group[key].winner;
                    group[key].winner = key2;
                    return;
                }
            } else {
                if (winner.p < contend.p) {
                    group[key].runnerup = group[key].winner;
                    group[key].winner = key2;
                    return;
                }
            }

            if (runnerup.p == contend.p) {
                if ((runnerup.pg - runnerup.ng) < (contend.pg - contend.ng)) {
                    group[key].runnerup = key2;
                    return;
                }
            } else {
                if (runnerup.p < contend.p) {
                    group[key].runnerup = key2;
                    return;
                }
            }
        })
    });

}

export default zeroPad;



