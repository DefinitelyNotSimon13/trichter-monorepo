## TODO:

- Proper Error Hanlding
- Improved consistent logging (currently effectively none)
- Better helper etc, usage of stuff provided by spring boot / modern kotlin features, ensure "bad" code can't even be written?
- General improvements?
- Proper configurability / handling of profiles for differenct scenarios (dev, ...)

## Things I find weird:

- Architecture feels somewhat off (overall seems reasonable, just not quite there?)
- placement / handling of entity -> dto? 
- constructor if RunController with a lot of usecases does seem a bit weird, but still
    better then just one giant service I guess?
- Having "/api/v2/users/{id}/runs" in the runs controller feels weird, but having it in the
    UserController would mean the user feature has to depend on runs, which is worse I guess?
- User entity, doesnt actually "belong" to the backend, but instead to BetterAuth. In the backend context it's more like a "Read-Only Public Profile". The core behind this can't be changed (would need separating database / removing foreign key form runs) but maybe clarity / how it's done can be improved?
