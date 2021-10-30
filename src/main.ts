import App from "./App.svelte";

async function main() {
  const { loadExamples } = await import("./example/example-bindings");

  loadExamples();

  const app = new App({
    target: document.body,
    props: {
      name: "2.0.0",
    },
  });
}

export default main();
