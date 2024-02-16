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
                <div className="grid-container">
                    <div className="grid-item">{current.matches("szukanie w TMS") && <Spin />}</div>
                    <div className="grid-item">Status: </div>
                    <div className="grid-item">{current.value}</div>
                    <div className="grid-item">03</div>
                    <div className="grid-item">04</div>

                    <div className="grid-item">
                        <Button
                            type="primary"
                            disabled={!current.matches("idle")}
                            onClick={() => send("Szukaj Klienta po NIP")}
                        >
                            Szukaj Klienta po NIP
                        </Button>
                    </div>
                    <div className="grid-item">
                        <Button
                            type="primary"
                            disabled={!current.matches("prezentowanie wyników")}
                            onClick={() => send("Jest Klient")}
                        >
                            Jest Klient
                        </Button>
                    </div>
                    <div className="grid-item">12</div>
                    <div className="grid-item">13</div>
                    <div className="grid-item">14</div>

                    <div className="grid-item">20</div>

                    <div className="grid-item">
                        <Button
                            type="primary"
                            danger={true}
                            disabled={!current.matches("prezentowanie wyników")}
                            onClick={() => send("Nie ma na liście")}
                        >
                            Nie ma na liście
                        </Button>
                    </div>
                    <div className="grid-item">22</div>
                    <div className="grid-item">23</div>
                    <div className="grid-item">24</div>

                    <div className="grid-item">30</div>
                    <div className="grid-item">31</div>
                    <div className="grid-item">32</div>
                    <div className="grid-item">33</div>
                    <div className="grid-item">34</div>

                    <div className="grid-item">40</div>
                    <div className="grid-item">41</div>
                    <div className="grid-item">42</div>
                    <div className="grid-item">43</div>
                    <div className="grid-item">44</div>
                </div>
                <div className="grid-container2">
                    <div className="grid-footer">
                        {current.matches("idle") && (
                            <FormClient
                                id={current.context.id}
                                NIP={current.context.NIP}
                                name={current.context.name}
                                handleOnFinish={handleOnFinishFormClient}
                            />
                        )}
                    </div>
                    <div className="grid-footer">91</div>
                    <div className="grid-footer">
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
