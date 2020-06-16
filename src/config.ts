const throwIfNot = <T, K extends keyof T>(obj: Partial<T>, prop: K, msg?: string): T[K] => {
  if(obj[prop] === undefined || obj[prop] === null){
    throw new Error(msg || `Environment is missing variable ${prop}`)
  }else {
    return obj[prop] as T[K]
  }
}
// Validate that we have our expected ENV variables defined!
['PORT', 'HOST', 'HOSTPORT', 'emailReceber', 'emailContato', 'passEmailContato', 'WEATHER_API_KEY', 'WEATHER_API_URL'].forEach(v => {
  throwIfNot(process.env, v)
})

export interface IProcessEnv {
  PORT: number;
  HOST: string;
  HOSTPORT: number;

  emailReceber: string;
  emailContato: string;
  passEmailContato: string;

  WEATHER_API_KEY: string
  WEATHER_API_URL: string
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IProcessEnv { }
  }
}