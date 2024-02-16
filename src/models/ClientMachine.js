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

// Action to assign the context id https://stackoverflow.com/questions/59602381/xstate-js-how-to-send-context-to-a-machine
// const assign_userId = assign({ userId: (context, event) => event.userId });
export const ClientMachine = createMachine(
    {
        /** @xstate-layout N4IgpgJg5mDOIC5QGEA2BLMA7ALgOnQlTAGIBlALwFcBrAQwCsACAaQ2xzqYAcB7JgHIBJAAoBtAAwBdRKD6x0OdLyyyQAD0QBaAOwBWAIx4AnADYJOgCyXTADgBMegMx7LAGhABPbZcd57OvbWxhLWlnoSFgC+UR5omLh4sNT0WJhMAO5MACoAsmQkECpgBFgAbrw0JTA48Rx5ZJIySCDyisqqLZoIWgGWeJY6TqYGQU4uOlbuXj6WRgY6piG2kzrG4wYxceyJybR0aWCZOfkkYABO57zneNyodDgAZtcAtng1dbgNTWptSipqbpaCL2PBDCSmewGVwuYw6Wwebw9ey2IyRWwjCROKH6UwuLYgT74PapdJZZAAIRYhWKpQqVXeYFqO1qVJ+LT+HUB2gCTjBGIMo2Gk3MTkR2gWpn89iCpkMkyxC3sBKJSRSBzJTEp1IuVxudwez3Obw+LO17LkvAU-06oCBvLwgqGejhS2Mcxs4p6kLwTmMQXdtksQdcEUsKpZav2h2OyAASrkaVgSuhypVqkyifHchbWlb2gCuohLBITMHBTKQZYnDoDF7sY7jE2bIEccNw7FCZGSRqjuSE2dLtdbvcnq9GcyErUE7nOYW7cWjCM7JjIfZ1tDpkiFkZDE5gxDbE5QgFTBGp7dzmAKBxeBle5lPGkaABnjIkABScBwrBZs-zNrcgg662HgthmAYNgGJCLiCqYXrAhIaJ6DCQZ2P6grnhwl7Xre94xhkT7oK+74COkLxcFgXAYIA2oAAMaYP+1pckWwGong6KmL4cyuBIrgIfYdh4Hojg1hIxi2KEELKp2qrCCITAMN+TAAPIsEwdDEL+U6UeRdAkExBa2hoiAuBxcwYjKBgSPYfrQV6ImlpEzkuDK4mCVhiTyYpylqRpWlsDpTAxhRBkGM0lrMfOJkIHoUorOsIz7hI4H6PYXq+DoYLjE4BhNq41ZoZ5+CUNG6SBRwXB0RABnSL8AEsQuyJWNlIyQTYEnmDo9a5f4LmDMYzi2HFxV4KVpJHBVuBVTVYjhfVUXGd0ER4KYa1rTokQScEdYzAg+5Sut+hYu66yBHoMSdlgvAQHAahEgtRlAVoG5gSWATWXFczwghei2KBLgwv61ZDFxo2EMQj2AaxWj-XyQY2bWfFcQsCJ7Vovh6KtgThOYljA8Y0KjT2BEnGQUONTFiGgnoViBITdiOIYCHWHycp5dCGw7oNxPqqT2oU9FQL4-0iwGCskHgTB4QIZzvqJUhKxLEegy82VfZagmgtLTyLrCaElnjFCIRintIRgX9Aa+Gt1kLKN3BXjeuB3g+hHPm+2tAfYpa1iukTwptm20yzfimDjcWhATmyyZG3lKbAP5+Zpk0srpRwUZ7rG5aW3GY7BoR2AhQb604qUpcsEkXTHF7jQ+U2cEw1WZ01vSbWWGIpclSwGKbSKYxxR65WYDiSjJ2wXiwKiYHRTAk+gXD13QzcxTKwnmJi4mCoNjho0iKJZRYkE2yJcJrGel1AA */
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
                entry: ["assign_userId"],
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
                        actions: assign({ error: (context, event) => event.data }),
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
                        actions: assign({ user: (context, event) => event.data }),
                    },
                    onError: {
                        target: "szukanie w CRM",
                        actions: assign({ error: (context, event) => event.data }),
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
                        actions: assign({ user: (context, event) => event.data }),
                    },
                    onError: {
                        target: "Koniec szukania Klienta",
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
                entry: assign({ error: "none" }),
                on: {
                    "Jest Klient": {
                        // actions: assign({ CBKchecked: 0, CRMchecked: 0 }),
                        target: "idle",
                    },
                    "Nie ma na liście": "NIP jest OK ale Klienta nie ma",
                },
            },

            "NIP jest OK ale Klienta nie ma": {
                always: [
                    {
                        target: "szukanie w CBK",
                        cond: "condCBKchecked",
                    },
                    {
                        target: "Szukanie Klienta cd",
                    },
                ],
            },

            "Szukanie Klienta cd": {
                always: [
                    {
                        target: "szukanie w CRM",
                        cond: "condCRMchecked",
                    },
                    {
                        target: "Koniec szukania Klienta",
                    },
                ],
            },

            "Koniec szukania Klienta": {},
        },
        predictableActionArguments: true,
        preserveActionOrder: true,
    },
    {
        actions: {
            assign_userId: assign({
                userId: (context, event) => event.userId,
            }),
        },
        services: {},
        guards: {
            condCBKchecked: (context, event) => {
                console.log("context.CBKchecked: " + context.CBKchecked === 0);
                return !context.CBKchecked;
            },
            condCRMchecked: (context, event) => {
                console.log("context.CRMchecked: " + context.CRMchecked === 0);
                return !context.CRMchecked;
            },
        },
        delays: {},
    }
);
