const hasPermission = (client, member, permission) => {
    let role = client.permissions[permission.toLowerCase()]
    if(!role) throw "Permission inexistante";

    if(Array.isArray(role)) {

        for (let i = 0; i < role.length; i++) {
            const e = role[i];
            if (member.roles.cache.find(r => r.id === e)) return true;
        }

    } else {
        if (member.roles.cache.find(r => r.id === role)) return true;
    }

    return false;
}

module.exports = {
    hasPermission
}
