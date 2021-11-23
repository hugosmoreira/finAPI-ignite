const express = require('express');
const { v4: uuidv4 } = require('uuid')

const app = express();

app.use(express.json());

const customers = []

//middleware

function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.params
  const customer = customers.find(c => c.cpf === cpf)
  if (!customer) {
    return response.status(400).json({ error: 'Customer not found' })
  }
  request.customer = customer

  return next()
}

function getBalance(statement) {
  statement.reduce((acc, operation) => {
    if(operation.type === "credit") {
      return acc + operation.value
    } else {
      return acc - operation.value
    }
  }, 0)

  return balance
}


app.post("/account", (request, response) =>  {
  const { name, cpf } = request.body;
  

  const customerAlreadyExists = customer.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists" });
  }

  
  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: []
  })

  return response.status(201).send
})

app.get("/statement/", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request


  return res.json(customer.statement);

})

app.post("/deposit/", verifyIfExistsAccountCPF, (request, response) => {
   const { description, amount } = request.body;

   const { customer } = request;

   const statementOperation = {
     description,
      amount,
      createdAt: new Date(),
      type : 'credit'
   }


   customer.statement.push(statementOperation)

   return response.status(201).send();
})

app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
  const { amount } = request.body;

  const { customer } = request;
  const balance = getBalance(customer.statement)

  if(amount > balance) {
    return response.status(400).json({ error: 'Insufficient funds' })
  }

  const statementOperation = {
    amount,
    createdAt: new Date(),
    type : 'debit',
  }

  customer.statement.push(statementOperation)
  return response.status(201).send();
})


app.get("statement/date", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  const { date } = request.query;

  const dateFormat = new Date(date + "00:00");

  const statement = customer.statement.filter((statement) => statement.createdAt >= dateFormat.toDateString() === new Date(dateFormat).toDateString());

  return response.jason(customer.statement)
})


app.put("/account", verifyIfExistsAccountCPF, (request, response) => {
  const { name } = request.body;
  const { customer } = request;

  customer.name = name;

  return response.status(201).send();
})

app.get("/account", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  return response.json(customer);
})

app.delete("/account", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  

  customers.splice(customer, 1);

  return response.status(200).json(customer)
})

app.get("/balance", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  const balance = getBalance(customer.statement)

  return response.json(balance)
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});