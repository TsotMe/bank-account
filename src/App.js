import { useReducer } from "react";

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
};

function reduce(state, action) {
  switch (action.type) {
    case "openAccount":
      return { ...state, isActive: true, balance: 500 };
    case "deposit":
      if (!state.isActive) return state;

      return { ...state, balance: state.balance + action.payload };
    case "withdraw":
      if (state.balance < action.payload) return state;

      return {
        ...state,
        balance: state.balance - action.payload,
      };
    case "requestLoan":
      if (state.loan > 0) return state;

      return { ...state, loan: state.loan + action.payload };
    case "payLoan":
      if (state.balance < state.loan) return state;

      return {
        ...state,
        loan: 0,
        balance: state.balance - state.loan,
      };
    case "closeAccount":
      if (state.balance !== 0 || state.loan !== 0) return state;

      return initialState;

    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [{ balance, loan, isActive }, dispatch] = useReducer(
    reduce,
    initialState
  );

  const notClosable = isActive ? balance !== 0 || loan !== 0 : true;
  const haveActiveLoan = isActive ? loan !== 0 : true;
  const notEnoughBalance = isActive
    ? loan === 0
      ? true
      : balance < loan
    : true;

  return (
    <div className="App">
      <h1>Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>

      <p>
        <button
          onClick={() => dispatch({ type: "openAccount" })}
          disabled={isActive}
        >
          Open account
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "deposit", payload: 150 })}
          disabled={!isActive}
        >
          Deposit 150
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "withdraw", payload: 50 })}
          disabled={!isActive}
        >
          Withdraw 50
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "requestLoan", payload: 5000 })}
          disabled={haveActiveLoan}
        >
          Request a loan of 5000
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "payLoan" })}
          disabled={notEnoughBalance}
        >
          Pay loan
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "closeAccount" })}
          disabled={notClosable}
        >
          Close account
        </button>
      </p>
    </div>
  );
}
