// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://localhost:44372/',
  vimeoUserId:"",
  vimeoApiKey:'',
  // vimeoToken:"602f2a811b5a94b07a0eb6e0c4a00aaa",
  vimeoClientId:"",
  vimeoClientSecret:"",
  vimeoAuthUrl:"https://api.vimeo.com/oauth/authorize",
  vimeoTokenUrl:"https://api.vimeo.com/oauth/access_token",
  zoom:{
      authEndpoint : 'http://localhost:4000',
      sdkKey : '',
      meetingNumber : '',
      passWord : '',
      role : 0,
      userName : 'Angular',
      userEmail : '',
      registrantToken : '',
      zakToken : '',
      leaveUrl : 'http://localhost:4200',
      sdkSecret:''
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
