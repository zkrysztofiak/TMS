import { createMachine, assign } from "xstate";
// https://xstate.js.org/docs/guides/communication.html#invoking-promises
const BASE_URL = "http://localhost:4001";
export const fetchClientInTMS = (userId) =>
  fetch(`${BASE_URL}/tms/${userId}`).then((response) => response.json());

export const ClientMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGEA2BLMA7ALgOnQlTAGIBlALwFcBrAQwCsACAaQ2xzqYAcB7JgHIBJAAoBtAAwBdRKD6x0OdLyyyQAD0QBaAOwBWAIx4AnADYJOgCyXTADgBMegMx7LAGhABPbZcd57OvbWxhLWlnoSFgC+UR5omLh4sNT0WJhMAO5MACoAsmT2JBAqYARYAG68NKUwOPEckjJIIPKKyqrNmgha9vYSeHq25pG2Fk7GAR7e3ZZOlia2Ns4SBgbGBgE6MXHsicm0dGlgmTn5hWAAThe8F3jcqHQ4AGY3ALZ4tfW4jWqtSipqLpaQxGAyLaz6WwGFyWAxTbRzex4CSmdaOAIGWGWLaxEBffDcC5gCgcXgZQ7pDKeNI0ADPGRIAHVLp4nugaFQGD9mn92oDEE5BSZBfZFhMDHpTI54TM-AEghFMStZi5tnjdgSiSTcGSKccqTT6UyWWyOVyDE05LwFP8OqAuk4DP09IN7AYdO6JHpjHp7DKtE4+ngrLDoRNTAZTIK1fi8MIREwGHAcEwAPIsJh0YisDVcI5MV50EgAcT03KtNr5nUQYJMgxRtn0Edso2hMt9pgW3ssxiWgrWMY1cdEieTaYzWeObASnCY+cLJbLFt+1raAOrM3deCd4Vb619Th07cDeEDeh0OnW4SC2MHM6SKT1J2QACEWCX7OWWqvbfzugE9DwWxBScFFIy9S89H9N0kWAhxHUjHQpUdO8OAfA58yyV932LT9lx5H8q3tbQAmMZFsVsb0HAmCYnH9aFbGRDYNkWUwdChNjUL2R9MKYZAACVchLJwv15ddiO6VZgwmRZBV8Nihl7GUJSA9jMQQyjjEFUxLC4-B9lSSk+ME4SxHwis1ztDRtEYlEUV7UII1mTFlK9PBfEjDYKJ0SIdL0vBKAw9Jpw4LgAGMIBLSxRMI8TrO6HRVMDewnDsYDfEWI8vEQewfSAgJ5IlH0QiGfzAsMqdcyYCKorMy1v0rOKgXsHT3KGCQ+lhSUJGMYwsumXLAIcKwWqK70JFKtUsF4CA4DUfEV0aqygS0oxFg6j0vR091bH9ZxO0PIJVj6FLQNMfzCGIRbLL-LQWycIDLA2p1JVhdj-V8QC2IVcweyCfd-IMp8sjyAprt-DdgV6aSUUvQNBShOjspmHtkUCaxNmVTjcVjQliVJclMOpdl6XBoj4p6fxYTFVK3VDKE-WRrRPrwb7wg9FrfQ9fz+LoYpAG1AQBwQAAQjJprEF+mGIjsJ0AhcD6-DZ88NlMLnQn8+NR1gFN00zbMQtwPN0kLMXloFDqBhFWYLy9VZgPbFqBk00CXR6lx7EBnijOw03bucQDcpcErDFS-qSLldirECTFVbsD2caHIHeIE3Jfch3pEp7SiJsbd0nBbf1zH8UVUV6cxxglJwyq9yqZ3CiA04kzF-B9KU+ijRsdK0mVxgemx88oyukNGPR-JYFRMDCpgk-QLgDc4RuKf6cYoUvCwCuMSjLEbZSQgWHQXDU2wJi6mIYiAA */
    context: {
      CBKchecked: 0,
      CRMchecked: 0,
      userId: 2,
      user: undefined,
      error: undefined,
    },
    id: "Client",
    initial: "idle",
    states: {
      idle: {
        on: {
          "Szukaj Klienta po NIP": {
            target: "szukanie w TMS2",
          },
        },
      },
      "szukanie w TMS2": {
        invoke: {
          id: "getClient",
          src: (context, event) => fetchClientInTMS(context.userId),
          onDone: {
            target: "prezentowanie wyników",
            actions: assign({ user: (context, event) => event.data }),
          },
          onError: {
            target: "szukanie w CBK",
            actions: assign({ error: (context, event) => event.data }),
          },
        },
      },

      // success: {},
      // failure: {
      //   on: {
      //     RETRY: { target: 'szukanie w TMS2' }
      //   }
      // },

      "prezentowanie wyników": {
        on: {
          Weryfikuj: [
            {
              target: "Radość!",
              cond: "OK",
            },
            {
              target: "NIP jest OK ale Klienta nie ma",
              cond: "notOK",
            },
          ],
        },
      },

      "Radość!": {},

      "NIP jest OK ale Klienta nie ma": {
        on: {
          G5: [
            {
              target: "Szukanie Klienta cd",
              // cond: (context) => context.CBKchecked > 0,
              cond: "CBKchecked",
            },
            {
              target: "szukanie w CBK",
              cond: !"CBKchecked",
            },
          ],
        },
      },

      "szukanie w CBK": {
        description: "TBD: strzał do API",
        exit: assign({ CBKchecked: 1 }),
        on: {
          G2: [
            {
              target: "prezentowanie wyników",
              cond: "jest_w_CBK",
            },
            {
              target: "szukanie w CRM",
              cond: "nie_ma_w_CBK",
            },
          ],
        },
      },
      "szukanie w CRM": {
        description: "TBD: strzał do API",
        exit: assign({ CRMchecked: 1 }),
        on: {
          G3: [
            {
              target: "prezentowanie wyników",
              cond: "jest_w_CRM",
            },
            {
              target: "Koniec szukania Klienta",
              cond: "nie_ma_w_CRM",
            },
          ],
        },
      },

      "Szukanie Klienta cd": {
        on: {
          G4: [
            {
              target: "Koniec szukania Klienta",
              cond: "SCRMchecked",
            },
            {
              target: "szukanie w CRM",
            },
          ],
        },
      },

      "Koniec szukania Klienta": {},
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {},
    services: {},
    guards: {
      jest_w_TMS: (context, event) => {
        return true;
      },
      nie_ma_w_TMS: (context, event) => {
        return false;
      },
      OK: (context, event) => {
        return false;
      },
      notOK: (context, event) => {
        return false;
      },
      nie_ma_w_CBK: (context, event) => {
        return false;
      },
      nie_ma_w_CRM: (context, event) => {
        return false;
      },
      CBKchecked: (context, event) => {
        return true;
      },
    },
    delays: {},
  }
);
