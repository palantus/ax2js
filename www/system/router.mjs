let routes = [
    {path: "/",                       page: "../pages/index.mjs"},
    {path: "/setup/users",            page: "../pages/setup/users.mjs"},
    {path: "/system",                 page: "../pages/setup/system.mjs"},
    {path: "/systemtools",            page: "../pages/setup/tools.mjs"},

    //Place regexp pages last, to ensure fast routing of those without:
    {regexp: /\/ax\/([a-zA-Z\_0-9]+)/,page: "../pages/ax.mjs"},
]


export default function route(path) {
    path = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path //Remove trailing slash
    let r = routes.find(r => r.path ? r.path == path : r.regexp ? r.regexp.test(path) : false)
    return r ? r.page : null;
}