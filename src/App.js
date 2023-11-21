import React from "react";
import "./App.css";
import { Button, Spin } from "antd";
import { FormClient } from "./formClient";

import { useMachine } from "@xstate/react";
import { ClientMachine } from "./models/ClientMachine";

function App() {
    const [current, send] = useMachine(ClientMachine);

    const handleOnFinishFormClient = (values, context) => {
        // console.log(current.context);
        console.log(values);
        // current.context.userId = values.id;
        console.log(current.context);
        send("Szukaj Klienta po NIP", {
            id: values.id,
            userId: values.id,
            name: values.name,
        });
    };
    return (
        <div className="App">
            <header className="App-header">
                Learn Xstate
                <div class="grid-container">
                    <div class="grid-item">{current.matches("szukanie w TMS") && <Spin tip="Loading..." />}</div>
                    <div class="grid-item">Status: </div>
                    <div class="grid-item">{current.value}</div>
                    <div class="grid-item">03</div>
                    <div class="grid-item">04</div>

                    <div class="grid-item">
                        <Button
                            type="primary"
                            disabled={!current.matches("idle")}
                            onClick={() => send("Szukaj Klienta po NIP")}
                        >
                            Szukaj Klienta po NIP
                        </Button>
                    </div>
                    <div class="grid-item">
                        <Button
                            type="primary"
                            disabled={!current.matches("prezentowanie wyników")}
                            onClick={() => send("Jest Klient")}
                        >
                            Jest Klient
                        </Button>
                    </div>
                    <div class="grid-item">12</div>
                    <div class="grid-item">13</div>
                    <div class="grid-item">14</div>

                    <div class="grid-item">20</div>

                    <div class="grid-item">
                        <Button
                            type="primary"
                            danger={true}
                            disabled={!current.matches("prezentowanie wyników")}
                            onClick={() => send("Nie ma na liście")}
                        >
                            Nie ma na liście
                        </Button>
                    </div>
                    <div class="grid-item">22</div>
                    <div class="grid-item">23</div>
                    <div class="grid-item">24</div>

                    <div class="grid-item">30</div>
                    <div class="grid-item">31</div>
                    <div class="grid-item">32</div>
                    <div class="grid-item">33</div>
                    <div class="grid-item">34</div>

                    <div class="grid-item">40</div>
                    <div class="grid-item">41</div>
                    <div class="grid-item">42</div>
                    <div class="grid-item">43</div>
                    <div class="grid-item">44</div>
                </div>
                <div class="grid-container2">
                    <div class="grid-footer">
                        {current.matches("idle") && (
                            <FormClient
                                id={current.context.id}
                                NIP={current.context.NIP}
                                name={current.context.name}
                                handleOnFinish={handleOnFinishFormClient}
                            />
                        )}
                    </div>
                    <div class="grid-footer">91</div>
                    <div class="grid-footer">
                        <pre style={{ textAlign: "left" }}>
                            {JSON.stringify(
                                {
                                    value: current.value,
                                    context: current.context,
                                },
                                null,
                                2
                            )}
                        </pre>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
