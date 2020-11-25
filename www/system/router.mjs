let routes = [
    {path: "/",                       page: "../pages/index.mjs"},
    {path: "/chat",                   page: "../pages/chat.mjs"},
    {path: "/login",                  page: "../pages/login.mjs"},
    {path: "/issues",                 page: "../pages/issues/issues.mjs"},
    {path: "/issues/sprint",          page: "../pages/issues/cursprint.mjs"},
    {path: "/sprints",                page: "../pages/issues/sprints.mjs"},
    {path: "/backlog",                page: "../pages/issues/backlog.mjs"},
    {path: "/releases",               page: "../pages/management/releases.mjs"},
    {path: "/stat/monthly",           page: "../pages/stat/monthly.mjs"},
    {path: "/setup/users",            page: "../pages/setup/users.mjs"},
    {path: "/system",                 page: "../pages/setup/system.mjs"},
    {path: "/systemtools",            page: "../pages/setup/tools.mjs"},
    {path: "/azure-vms",              page: "../pages/infrastructure/vms.mjs"},
    {path: "/instances",              page: "../pages/infrastructure/instances.mjs"},
    {path: "/servers",                page: "../pages/infrastructure/servers.mjs"},
    {path: "/actions",                page: "../pages/infrastructure/actions.mjs"},
    {path: "/actions/types",          page: "../pages/infrastructure/actiontypes.mjs"},

    //Place regexp pages last, to ensure fast routing of those without:
    {regexp: /\/issue\/(\d+)/,              page: "../pages/issues/issue.mjs"},
    {regexp: /\/task\/(\d+)/,               page: "../pages/issues/task.mjs"},
    {regexp: /\/release\/(\d+)/,            page: "../pages/management/release.mjs"},
    {regexp: /\/azure-vm\/([a-zA-Z]+)/,     page: "../pages/infrastructure/vm.mjs"},
    {regexp: /\/instance\/([a-zA-Z\_0-9]+)/,page: "../pages/infrastructure/instance.mjs"},
    {regexp: /\/setup\/users\/([a-z]+)/,    page: "../pages/setup/user.mjs"},
    {regexp: /\/action\/(\d+)/,             page: "../pages/infrastructure/action.mjs"}
]


export default function route(path) {
    path = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path //Remove trailing slash
    let r = routes.find(r => r.path ? r.path == path : r.regexp ? r.regexp.test(path) : false)
    return r ? r.page : null;
}