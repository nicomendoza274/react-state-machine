import { assign, createMachine } from "xstate";
import { fetchCountries } from '../Utils/api'

const fillConuntries = {
  initial: "loading",
  states: {
    loading: {
      invoke: {
        id: 'getCountries',
        src: () => fetchCountries,
        onDone: {
          target: 'success',
          actions: assign({
            countries: (context, event) => event.data
          })
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: 'Fallo el request'
          })
        }
      }
    },
    success: {},
    failure: {
      ON: {
        RETRY: {target: "loading"},
      }
    }
  }
}

const bookingMachine = createMachine({
  id: "buy plane tickets",
  initial: "initial",
  context: {
    passengers: [],
    selectedCountry: '',
    countries: [],
    error: '',
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
      ...fillConuntries,
    },
    tickets: {
      after: {
        5000: {
          target: 'initial',
          actions: 'cleanContext'
        }
      },
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