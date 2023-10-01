import { assign, createMachine } from "xstate";

const bookingMachine = createMachine({
  id: "buy plane tickets",
  initial: "initial",
  context: {
    passengers: [],
    selectedCountry: '',
  },
  states: {
    initial: {
      on: {
        START: {
          target: "search",
        },
      },
    },
    search: {
      on: {
        CONTINUE: {
          target: "passengers",
          actions: assign({
            selectedCountry: (context, event) => event.selectedCountry
          })
        },
        CANCEL: {
          target: "initial",
          actions: 'cleanContext'
        },
      },
    },
    tickets: {
      on: {
        FINISH: "initial",
        CANCEL: {
          target: "initial",
          actions: 'cleanContext'
        },
      },
    },
    passengers: {
      on: {
        DONE: "tickets",
        CANCEL: {
          target: "initial",
          actions: 'cleanContext'
        },
        ADD: {
          target: "passengers",
          actions: assign(
            (context, event) => context.passengers.push(event.newPassenger)
          )
        }
      },
    },
  },
}, 
{
  actions: {
    cleanContext : assign({
      passengers: [],
      selectedCountry: ''
    })
  }
});



export default bookingMachine;