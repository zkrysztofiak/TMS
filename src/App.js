import React, { useState } from "react";
import "./App.css";
import { Button, Spin } from "antd";

import { useMachine } from "@xstate/react";
import { ClientMachine } from "./models/ClientMachine";

function App() {
  const [current, send] = useMachine(ClientMachine);
  return (
    <div className="App">
      <header className="App-header">
        Learn Xstate
        <div class="grid-container">
          <div class="grid-item">01</div>
          <div class="grid-item">02</div>
          <div class="grid-item">033333333333</div>
          <div class="grid-item">04</div>
          <div class="grid-item">05</div>
          <div class="grid-item">06</div>
          <div class="grid-item">07</div>
          <div class="grid-item">08</div>
          <div class="grid-item">09</div> <div class="grid-item">11</div>
          <div class="grid-item">
            {" "}
            <Button
              type="primary"
              disabled={!current.matches("idle")}
              onClick={() => send("DRUKUJ")}
            >
              DRUKUJ
            </Button>
          </div>
          <div class="grid-item">133333333333</div>
          <div class="grid-item">14</div>
          <div class="grid-item">15</div>
          <div class="grid-item">16</div>
          <div class="grid-item">17</div>
          <div class="grid-item">18</div>
          <div class="grid-item">19</div>
          <div class="grid-item">21</div>
          <div class="grid-item">22</div>
          <div class="grid-item">233333333333</div>
          <div class="grid-item">24</div>
          <div class="grid-item">25</div>
          <div class="grid-item">26</div>
          <div class="grid-item">27</div>
          <div class="grid-item">28</div>
          <div class="grid-item">29</div>
          <div class="grid-item">31</div>
          <div class="grid-item">32</div>
          <div class="grid-item">333333333333</div>
          <div class="grid-item">34</div>
          <div class="grid-item">35</div>
          <div class="grid-item">36</div>
          <div class="grid-item">37</div>
          <div class="grid-item">38</div>
          <div class="grid-item">39</div>
        </div>
      </header>
    </div>
  );
}

export default App;
