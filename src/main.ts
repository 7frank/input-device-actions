import App from "./App.svelte";
import { mount } from "svelte";

async function main() {
  const { loadExamples } = await import("./example/example");

  loadExamples();

  mount(App, {
    target: document.body,
    props: {
      name: "2.0.0",
    },
  });
}

export default main();
