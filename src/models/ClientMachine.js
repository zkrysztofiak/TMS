import { createMachine, assign } from "xstate";
import axios from "axios";

const BASE_URL = "http://localhost:4001";
// export const fetchClientInTMS = (userId) =>   fetch(`${BASE_URL}/tms/${userId}`).then((response) => response.json());

export const fetchClientInTMS = async (userId) => {
    const response = await axios.get(`${BASE_URL}/TMS/${userId}`);
    return response.data;
};

export const fetchClientInCBK = async (userId) => {
    const response = await axios.get(`${BASE_URL}/CBK/${userId}`);
    return response.data;
};

export const fetchClientInCRM = async (userId) => {
    const response = await axios.get(`${BASE_URL}/CRM/${userId}`);
    return response.data;
};
export const ClientMachine = createMachine(
    {
        /** @xstate-layout N4IgpgJg5mDOIC5QGEA2BLMA7ALgOnQlTAGIBlALwFcBrAQwCsACAaQ2xzqYAcB7JgHIBJAAoBtAAwBdRKD6x0OdLyyyQAD0QBaAOwBWAIx4AnADYJOgCyXTADgBMegMx7LAGhABPbZcd57OvbWxhLWlnoSFgC+UR5omLh4sNT0WJhMAO5MACoAsmQkECpgBFgAbrw0JTA48Rx5ZJIySCDyisqqLZoIWgGWeJY6TqYGQU4uOlbuXj6WRgY6piG2kzrG4wYxceyJybR0aWCZOfkkYABO57zneNyodDgAZtcAtng1dbgNTWptSipqbpaCL2PBDCSmewGVwuYw6Wwebw9ey2IyRWwjCROKH6UwuLYgT74PapdJZZAAIRYhWKpQqVXeYFqO1qVJ+LT+HUB2hR-RW9nsTgMeIMTkmxkR2gWtjwLj0ixGkMMEjhBKJSRSBzJTEp1IuVxudwez3Obw+LN17LkvAU-06oCBvP8WJstkG2KWeklPX0eAMxkcoWMliFGIk9jVLI1+0Ox2QACVcjSsCV0OVKtUmUSE7kra0be0AV1EE5+nYofY7MMVpD7N6tNCdH7xmEJBFjHp1rZIwliZrY+TE2dLtdbvcnq9Gczezm85yiw7EAYZaY9KjlU4sU44R3vdDQUKXAFTODUdiexxbucwBQOLwMlqjhlPGkaABnjIkABScBwrBZc4Fna3IINuTiyo2qK2CqKLytMSJaCG4HYvYKo6MKJ5usGF6JNw163rg96PpkL7oO+n4COkLxcFgXAYIA2oAAMaYIBtpcsWCAomiEgYiGaFmAY9YCk24QYvoZgOOGOH4MIIhMAwv5MAA8iwTB0MQ-69jRVF0CQADieisYW9oaIgAqytiPF6OYegBNCTjevKMoGMKgwLHohgud2sSElGsnyYpKlqRpbBaUwsbUfphkGM01psQupk9HMMoeRCPG+JCti2F6MwIE5frCi44RiiEtnSXglAxukoUcFwjEQPplhGcBHGCn6gpWTo4aWDWBjwSWISypE4wBgKgp4uVlWkkcNW4HVDV6U1MW-EB7GLj0LgSP4Di2GK4ymCMWU5Ui25bZu4bQSMwzbt5PlYLwEBwGoRIrfFJlAusRhuuG6FtqYczwvWzhbR2-pttZHqDOVhDEK9xkgVoWXgd9dl-QDCK5YhfgnkE1lBkExjQuVJLEVkDRwy163AuGeBwYEhPlh5gmY9Y4Grv69lCgs-p6MT-barqFNrYlwIuWCwa7au8rho4pj1vueBhjdVi7ehHZ81VT46omQsJY6J606Ebqlp2rgBsdS6RP48Inuhhi49hPnqnhN53g+A6keRuvvWZW3oXY5gWCsFhtjo9a+HoeA4+E5iWAGcebE7UbxnQRT0YA4IAAITeyBsfi22EKoj9Ljh9jgThOhla2V1ljlf5CmwH+QXqTNLLaUc1E5xx2IiSE+iOJWg8nvLBhbaPN3rJYEIolik3863YX1V362biYSPJfCxgdksGNIoMoJbzY9ghGKlb4knvZ4CwKiYIxTAk2kXCzZwy8i2dxjQQzzg2JCB3Zd6ARI7jFRDYG2lY1gxBiEAA */
        context: {
            CBKchecked: 0,
            CRMchecked: 0,
            userId: 25,
            user: undefined,
            error: undefined,
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
                invoke: {
                    id: "getClientTMS",
                    src: (context, event) => fetchClientInTMS(context.userId),
                    onDone: {
                        target: "prezentowanie wyników",
                        actions: assign({
                            user: (context, event) => event.data,
                        }),
                    },
                    onError: {
                        target: "szukanie w CBK",
                        actions: assign({
                            error: (context, event) => event.data,
                        }),
                    },
                },
            },
            "szukanie w CBK": {
                exit: assign({ CBKchecked: 1 }),
                invoke: {
                    id: "getClientCBK",
                    src: (context, event) => fetchClientInCBK(context.userId),
                    onDone: {
                        target: "prezentowanie wyników",
                        actions: assign({
                            user: (context, event) => event.data,
                        }),
                    },
                    onError: {
                        target: "szukanie w CRM",
                        actions: assign({
                            error: (context, event) => event.data,
                        }),
                    },
                },
            },

            "szukanie w CRM": {
                exit: assign({ CRMchecked: 1 }),
                invoke: {
                    id: "getClientCRM",
                    src: (context, event) => fetchClientInCRM(context.userId),
                    onDone: {
                        target: "prezentowanie wyników",
                        actions: assign({
                            user: (context, event) => event.data,
                        }),
                    },
                    onError: {
                        target: "Koniec szukania Klienta",
                        actions: assign({
                            error: (context, event) => event.data,
                        }),
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
                entry: assign({ error: "none" }),
                on: {
                    "Jest Klient": {
                        target: "Radość!",
                    },
                    "Nie ma na liście": {
                        target: "NIP jest OK ale Klienta nie ma",
                    },
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
