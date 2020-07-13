*Please read these notes before commiting code to this directory.*
- Please use the following design pattern for consistency: 
  - Create a folder `fooCloudFunctions` in the `functions` directory with 
    your cloud functions.
  - For easy deployment with the CLI, each function should be statically defined
    as `exports.bar = ...`.  If you are referencing a 3rd party api, use stubbing 
    for dependency injection with sinon instead of manual injection.
  - It may seem like this ignores DRY, and it basically does. This is a downside
    to the firebase CLI, and generally isn't a problem for most queries or 
    functions. 
    - You can try using [environment variables](https://cloud.google.com/functions/docs/env-var)
      to a certain extent to deploy across a dev and staging environment, but
      I've had trouble getting it to work easily. 
    - Basically you have to declare environment variables in a `.env.yaml` file,
      write your dev functions referencing the dev variables, and then at 
      deployment overwrite them with `gcloud functions deploy FUNCTION_NAME --set-env-vars FOO=bar ...`
      - This is *not* a `firebase` deployment. It is a `gcloud` deployment, 
        and it's a lot more difficult. 
      - It doesn't seem like firebase really supports this, but it can possibly 
        be hacked it seems like. Read more in [this](https://stackoverflow.com/questions/49744470/creating-a-development-and-staging-environments-for-google-cloud-functions)
        stack exchange post.  
      - I have not gotten it to work yet, so this section is still a work in 
        progress. 
  - Right now I recommend writing dev code/tests, and after your code gets 
    approved, duplicate it with prod variables in the place of dev variables.
  - You do not have to export these functions separately with 
    `module.exports = ...`. To reference in other functions, import `fooCloudFunctions/fooFunctions` 
    and call `fooFunctions.bar`. 
  - Create a subfolder `fooTests` in `test`. You can test with `npm run test` 
    from the `functions` directory without needing to specify your specific 
    test.
- Deployment notes: 
  - Cloud functions must be exported from `index.js`. 
  - You can deploy all your cloud functions with `exports.foo = require(./fooCloudFunctions/fooFunctions)`.
   - This will deploy each function in `fooFunctions` as `foo-fooFunction1, foo-fooFunction2, ...`. 
  - If you are deploying `foo` for the first time, you will need to 
    run something like `firebase deploy --only functions:foo-bar1,functions:foo-bar2,...`
  - If redeploying you only need to run `firebase deploy --only functions:foo`. 
- Testing: 
  - For unit tests mocha (a test framework), chai (an assertion lib.), and 
    sinon (a spying library) are recommended. 
  - Read more about these libraries in `test/testConfig.js`. 
  - If you are using a 3rd party api call in your function, use stubbing to 
    mock the call. 
  - Tests are compiled with `npm run test` from the `functions` directory. You 
    do not need to specify your test file. 
  - Test coveraged is provided with [istanbul](https://istanbul.js.org/).
- Config and keys
  - If you are running code locally that connects to firebase, you will need to
    download a firebase service key and upload it to the `functions` directory.
    Use the filename `step9-2020-capstone.json`.
  - If you are using local environment variables (e.g., for 3rd party api keys),
    you may need to invoke the shell command `firebase functions:config:get > .runtimeconfig.json`.
  - You can set environment variables in shell with the following pattern:
    `firebase functions:config:set foo.key=ADMIN_API_KEY`, and can then be accessed
    with `functions.config().foo.key`.   
