// RecurringExpenses.js
const [expenses, setExpenses] = useState([]);
const addRecurringExpense = (expense) => {
  setExpenses([...expenses, expense]);
};

const recurringExpense = {
  name: 'Netflix Subscription',
  amount: 15,
  frequency: 'monthly',
};

useEffect(() => {
  if (recurringExpense.frequency === 'monthly') {
    setInterval(() => {
      addRecurringExpense(recurringExpense);
    }, 30 * 24 * 60 * 60 * 1000); // Trigger every month
  }
}, []);
