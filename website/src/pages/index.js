
import React, { useState, useRef } from "react";

function ChangeDisplay() {

  async function openFirefox(operation) {
    let response = await fetch("/change_display_api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation: operation })
    });
}

  return (
    <main>
      <button onclick={openFirefox('enfer')}>Enfer</button>
    </main>
    
  );
}

export default ChangeDisplay;
