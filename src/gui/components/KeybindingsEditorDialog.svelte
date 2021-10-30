<script lang="ts">
  import { Hotkeys } from "../../core";

  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from "sveltestrap";

  let open = false;
  const toggle = () => (open = !open);

  Hotkeys(window).on("help-action", function (e) {
    e.stopPropagation();
    toggle();
  });
</script>

<main>
  <Modal isOpen={open} {toggle} size="xl">
    <ModalHeader {toggle}>
      <h2>Change your key bindings</h2>
    </ModalHeader>
    <ModalBody>
      <slot />
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={toggle}>Do Something</Button>
      <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
  </Modal>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h2 {
    color: #ff3e00;
    text-transform: uppercase;

    font-weight: 100;
  }
</style>
