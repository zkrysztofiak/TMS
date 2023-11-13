import { createMachine } from "xstate";
const ClientMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGEA2BLMA7ALgOnQlTAGIBlALwFcBrAQwCsACAaQ2xzqYAcB7JgHIBJAAoBtAAwBdRKD6x0OdLyyyQAD0QBaAGw6ArHgDsEgMwAmfUdP6JJ0wA4ANCACe2gCxe8ARgk6HIwBOQI9TCSDTHQBfaJc0TFw8WGp6LEwmAHcmABUAWTISAHEfSRkkEHlFZVUKzQQtcx9zPFNrP0tzBwiPSJd3Bq8PX38HIJ8dSyCjJtj49iSU2jp0sCzcguLSn3K5XgUlFTV6rVNHYyN9Uy8z80tTIP1+7RsW20eIiUCLLo85kASHDw3AATmAKBxeJkVhlMq50jQAM+ZEgAdTAINcADN0DQqAwymoqodaqB6h5zKY8A5AlcfGM-Pows9Bt4-AFgqFwpEYnEAQt8KDwZDoassvDcci0Rjsbj8WIdkT9tUjnVEB4JBI8Ppmh4dB4fAajB59OYWadzFqzmcdA9TIyJIb-oCksIREwGHAcEwAPIsJh0YisAVcMUAWzo5FSjEyyAAQixCRViTVjoh9IYdZSfPoHF5zB482a3OmLMYoqbxhqbEYHM6BXg3R6vb7-YG1mxEpwmOHI5RlgxYwmFbtKsqSWmGhYjL5bNa7mZrEYWVcWtYDOYq2YrEF613ktGxdl4yxiuYk3sDqm1Q0JlqgmFJjqghJzHpmSWGgXhhIMwXjXmMwBKYe5AksaSwkwJ5niOSpXqqZLaPSQR4BEUTNA4uaGnczifloEw+NSNgBA49JkQEvLzPu4Ewmsx4AEp5MUpgXmO8GkhoiAGL4lK-I6lgGs0LKEUElLdFYAQ+EEHIOCBfIuvgNFHlBjHMbBybjteiEIKR1KRH+om2P4QTCb+RGUpMHjWKRjjmKBST9hBHYhkwADGEDFB4rEpghnE6S0XwdBYDhdHYxYDJuOh4GJPhGDoOZWRIGp-PJDaObRwZdlw7meepl4qhxJyxcMdJGNYQwmkEfSfpF0WOLF8VMiYyWxHyWC8BAcBqApcEFZOWiyShjp2MBm6akYPjmnS1LGYawRlTm9n4IQxC9RON5aMEhHDXFsljXYk14UM2qjCEtqkXYKVUWBh6QfkZBrVpflaF4hGvQE+g6DMJoWOax22AEZ31ZdS3AmCEK4FCGVwgiyKPb59TBHgX1WXmEwGBYUR-d4ANjA451+MaoP0XQEC8IA2oCAOCAACE8OFVxjyzgZdyTGVHjYyVp348DROpfuTaerA3p+gGQadhwoYZBGdOThq94GoW9oGElr4rmWNo6ouBj6FVoNKZBJ4yxtXhagaSWVRYPLLnhb7DJuVWPDuE3dHJ12LLddEqXkRvafhprRQYpFSTqzV3OaE3GJuZXdPjOt5qD6ViuLuDZRAPt+X4du9PjL42K+GMsna1LGraOqFjSzSgywKiYK5TD61wyecOn9RjNqn3+LWIRy1JwnjK0ISE6R1bWHJsRAA */
    context: {
      CBKchecked: 0,
      CRMchecked: 0,
    },
    id: "Client",
    initial: "idle",
    states: {
      idle: {
        on: {
          "Szukaj Klienta po NIP": {
            target: "szukanie w TMS",
          },
        },
      },

      "szukanie w TMS": {
        on: {
          G1: [
            {
              target: "prezentowanie wyników",
              cond: "jest_w_TMS",
            },
            {
            target: "szukanie w CBK",
            cond: "nie_ma_w_TMS",
          },

        ]
        }
      },

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
          SzukajwCBK: [{
            target: "Szukanie Klienta cd",
            cond: "CBKchecked",
          },
        "szukanie w CBK"],
        }
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
          }]
        }
      }
,
      "szukanie w CRM": {
        description: "TBD: strzał do API",
        exit: assign({ CRMchecked: 1 }),
        on: {
          G3: [{
            target: "prezentowanie wyników",
            cond: "jest_w_CRM",
          }, {
            target: "Koniec szukania Klienta",
            cond: "nie_ma_w_CRM",
          }],
        },
      },

      "Szukanie Klienta cd": {
        on: {
          G4: [{

            target: "Koniec szukania Klienta",
            cond: "SCRMchecked",
          }, {
            target: "szukanie w CRM",
          }],
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
      znaleziono: (context, event) => {
        return false;
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
      "CBKchecked=0": (context, event) => {
        return false;
      },
      "nie szukano w SCRM": (context, event) => {
        return false;
      },
    },
    delays: {},
  }
);
